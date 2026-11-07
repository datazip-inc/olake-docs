"""Ask OLake API.

POST /ask         {"question": "..."} -> {"answer": "...", "sources": ["<url>", ...]}
POST /ask/stream  same input, Server-Sent Events for the chat widget
POST /feedback    thumbs up/down from the widget
GET  /healthz, /version
"""

import asyncio
import hashlib
import hmac
import json
import logging
import os
import re
import sys
import time
import uuid
from collections import OrderedDict, defaultdict, deque
from datetime import date
from pathlib import Path

from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from app import analytics, answer, config, llm
from app.refresh import Refresher
from app.search import SearchIndex

logging.basicConfig(stream=sys.stdout, level=logging.INFO, format="%(message)s")
log = logging.getLogger("ask-olake")


def log_event(event: str, **fields) -> None:
    log.info(json.dumps({"event": event, "ts": round(time.time(), 3), **fields}, ensure_ascii=False))


WEB_DIR = Path(__file__).resolve().parent.parent / "web"
META = json.loads((Path(os.getenv("DATA_DIR", "data")) / "meta.json").read_text())
index = SearchIndex()


def get_index() -> SearchIndex:
    return index


def swap_index(new_index: SearchIndex) -> None:
    """Atomically replace the live index; cached answers may be stale, so drop them."""
    global index
    index = new_index
    _cache.clear()
    log_event("index_swapped", chunks=len(new_index.chunks))


refresher = Refresher(get_index, swap_index, META)


async def _hourly_persist():
    """Persist analytics to disk every hour so restarts don't lose the day's metrics."""
    while True:
        await asyncio.sleep(3600)
        analytics.persist()


@asynccontextmanager
async def lifespan(_app: FastAPI):
    analytics.load()  # resume today's counters from disk
    tasks = []
    if os.getenv("LIVE_REFRESH", "1") == "1":
        tasks.append(asyncio.create_task(refresher.run_forever()))
    tasks.append(asyncio.create_task(_hourly_persist()))
    yield
    for t in tasks:
        t.cancel()


app = FastAPI(title="Ask OLake", version="1.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["GET", "POST", "OPTIONS"], allow_headers=["*"])


# ---------- guards: rate limit, daily budget cap, answer cache ----------

_hits_per_ip: dict[str, deque] = defaultdict(deque)
_daily = {"day": date.today(), "llm_calls": 0}
_cache: OrderedDict[str, dict] = OrderedDict()
CACHE_SIZE = 1000


def client_ip(request: Request) -> str:
    fwd = request.headers.get("x-forwarded-for")
    return fwd.split(",")[0].strip() if fwd else (request.client.host if request.client else "?")


def check_rate_limit(ip: str) -> None:
    now, window = time.monotonic(), _hits_per_ip[ip]
    while window and now - window[0] > 60:
        window.popleft()
    if len(window) >= config.RATE_LIMIT_PER_MIN:
        raise HTTPException(429, "Too many questions, please wait a minute.")
    window.append(now)


def take_llm_budget() -> bool:
    if _daily["day"] != date.today():
        _daily.update(day=date.today(), llm_calls=0)
    if _daily["llm_calls"] >= config.DAILY_LLM_CALL_CAP:
        return False
    _daily["llm_calls"] += 1
    return True


def cache_key(question: str, history: list["Message"] | None = None) -> str:
    norm_q = re.sub(r"[\s?!.]+", " ", question.lower()).strip()
    if not history:
        return norm_q
    prior_user = ""
    for msg in reversed(history):
        if msg.role == "user" and msg.content.strip():
            prior_user = re.sub(r"[\s?!.]+", " ", msg.content.lower()).strip()
            break
    return f"{prior_user} > {norm_q}" if prior_user else norm_q


def cache_get(key: str) -> dict | None:
    if key in _cache:
        _cache.move_to_end(key)
        return _cache[key]
    return None


def cache_put(key: str, value: dict) -> None:
    _cache[key] = value
    if len(_cache) > CACHE_SIZE:
        _cache.popitem(last=False)


# ---------- core ----------

class Message(BaseModel):
    role: str = Field(..., pattern="^(user|assistant)$")
    content: str = Field(..., max_length=4000)


class AskRequest(BaseModel):
    question: str = Field(..., min_length=1)
    history: list[Message] = Field(default_factory=list)
    page_url: str = Field("", max_length=500)
    session_id: str = Field("", max_length=64)


# ---------- thread store (persistent sessions, 30-min TTL, no DB) ----------

_THREAD_TTL_S = 1800  # 30 minutes of inactivity
_MAX_THREAD_TURNS = 20  # cap stored turns per session (40 messages)
_threads: dict[str, tuple[float, list[Message]]] = {}  # {session_id: (last_access, messages)}


def _thread_prune() -> None:
    cutoff = time.monotonic() - _THREAD_TTL_S
    expired = [k for k, (t, _) in _threads.items() if t < cutoff]
    for k in expired:
        del _threads[k]


def thread_get(session_id: str) -> list[Message]:
    entry = _threads.get(session_id)
    if not entry:
        return []
    _threads[session_id] = (time.monotonic(), entry[1])  # refresh TTL
    return entry[1]


def thread_put(session_id: str, question: str, answer: str) -> None:
    if not session_id:
        return
    existing = thread_get(session_id)
    turns = list(existing)
    turns.append(Message(role="user", content=question[:4000]))
    turns.append(Message(role="assistant", content=answer[:4000]))
    if len(turns) > _MAX_THREAD_TURNS * 2:
        turns = turns[-((_MAX_THREAD_TURNS * 2)):]
    _threads[session_id] = (time.monotonic(), turns)
    if len(_threads) > 10000:  # safety cap
        _thread_prune()


def clean_question(q: str) -> str:
    q = q.strip()
    if not q:
        raise HTTPException(422, "Question is empty.")
    if len(q) > config.MAX_QUESTION_CHARS:
        raise HTTPException(413, f"Question is too long (max {config.MAX_QUESTION_CHARS} characters).")
    return q


_HISTORY_PATTERNS = (
    "what was earlier", "what was before", "what did i", "what did you",
    "what was the previous", "what was there before", "before that",
    "what was my", "remind me", "you said", "you mentioned",
    "earlier you", "previous question", "previous answer", "go back",
    "what i asked", "what we discussed", "our conversation",
    "recap", "summarize our chat", "what have we", "first question",
)

_BEFORE_PATTERN = re.compile(r"\bbefore\b.*\bwhat\b|\bwhat\b.*\bbefore\b|\bbefore\s+\w+\s+what\b", re.IGNORECASE)


def is_history_question(question: str, history: list[Message]) -> bool:
    """True when the user is asking about the conversation itself, not the docs."""
    if not history:
        return False
    q = question.lower().strip()
    if any(p in q for p in _HISTORY_PATTERNS):
        return True
    if _BEFORE_PATTERN.search(q):
        return True
    # "before X what was there" — check if X appears in a recent assistant answer
    if "before" in q:
        words_after_before = q.split("before", 1)[1].strip().split()
        if words_after_before:
            target = words_after_before[0].rstrip("?,.")
            for msg in reversed(history):
                if msg.role == "assistant" and target in msg.content.lower():
                    return True
    return False


def contextualize_query(question: str, history: list[Message]) -> str:
    """When a user asks a follow-up, fold the prior topic into the search query for accurate retrieval."""
    if not history:
        return question
    last_user_turn = ""
    for msg in reversed(history):
        if msg.role == "user" and msg.content.strip():
            last_user_turn = msg.content.strip()
            break
    if not last_user_turn:
        return question
    q_lower = question.lower()
    tokens = [t for t in q_lower.split() if t]
    is_follow_up = len(tokens) <= 6 or any(w in q_lower for w in (
        "that", "this", "it", "what about", "how about", "same for", "instead", "why",
        "workaround", "how to fix", "how do i fix", "example", "config", "which file"
    ))
    if is_follow_up:
        return f"{last_user_turn} {question}"
    return question


def no_llm_result(text: str, hits) -> dict:
    return {"answer": text, "sources": [], "citations": [], "model": None,
            "candidates": [h.chunk["url"] for h in hits[:3]], "suggestions": []}


async def retrieve(question: str, history: list[Message] | None = None, page_url: str = ""):
    effective_query = contextualize_query(question, history or [])
    sub_queries = await llm.decompose_query(effective_query)
    if len(sub_queries) > 1:
        # Multi-hop: each sub-query retrieves independently; results merged with RRF
        hits = index.multi_search(sub_queries, k=config.TOP_K, page_url=page_url)
        return hits, None
    rewrite = await llm.rewrite_query(effective_query) if config.REWRITE_MODEL else None
    return index.search(effective_query, k=config.TOP_K, alt_query=rewrite, page_url=page_url), rewrite


async def answer_question(question: str, history: list[Message] | None = None, page_url: str = "") -> dict:
    if history and is_history_question(question, history):
        if not take_llm_budget():
            return no_llm_result("Ask OLake has reached its daily usage limit. Please try again tomorrow, "
                                 "or search the docs at https://olake.io/docs/.", [])
        msgs = answer.build_history_messages(question, [m.model_dump() for m in history])
        raw, model = await llm.complete(msgs)
        return {"answer": raw, "sources": [], "citations": [], "model": model, "candidates": [], "suggestions": []}
    hits, rewrite = await retrieve(question, history, page_url=page_url)
    if answer.is_weak(hits):
        return no_llm_result(answer.IDK_ANSWER, hits)
    if not take_llm_budget():
        return no_llm_result("Ask OLake has reached its daily usage limit. Please try again tomorrow, "
                             "or search the docs at https://olake.io/docs/.", hits)
    raw, model = await llm.complete(answer.build_messages(question, hits, [m.model_dump() for m in (history or [])]))
    text, sources, citations = answer.finalize(raw, hits)
    suggestions = await llm.suggest_followups(question, text) if config.SUGGESTIONS_ENABLED else []
    return {"answer": text, "sources": sources, "citations": citations, "model": model,
            "candidates": [h.chunk["url"] for h in hits], "suggestions": suggestions}


@app.get("/search")
async def search(q: str, k: int = 8, request: Request = None):
    """Zero-cost search: returns top-k chunks from hybrid retrieval without any LLM call."""
    if not q or not q.strip():
        raise HTTPException(422, "q is required")
    if len(q) > config.MAX_QUESTION_CHARS:
        raise HTTPException(413, "Query too long")
    hits = index.search(q.strip(), k=min(k, 20))
    return {
        "query": q.strip(),
        "results": [
            {
                "title": h.chunk["title"],
                "url": h.chunk["url"],
                "page_url": h.chunk["page_url"],
                "source_type": h.chunk.get("source_type", "docs"),
                "excerpt": h.chunk["text"][:300].strip(),
                "score": round(h.score, 4),
                "bm25": round(h.bm25, 2),
                "cosine": round(h.cosine, 3),
            }
            for h in hits
        ],
    }


@app.post("/ask")
async def ask(body: AskRequest, request: Request):
    question = clean_question(body.question)
    ip, started = client_ip(request), time.perf_counter()
    history = body.history or (thread_get(body.session_id) if body.session_id else [])
    key = cache_key(question, history)
    check_rate_limit(ip)  # flood protection applies to every request, cached or not
    result, cached = cache_get(key), True
    if result is None:
        cached = False
        try:
            result = await answer_question(question, history, page_url=body.page_url)
        except Exception as e:  # never leak stack traces; still return the contract shape
            log_event("error", question=question, error=f"{type(e).__name__}: {e}")
            analytics.record_error()
            return JSONResponse(status_code=503, content={
                "answer": "Sorry, the answering service is temporarily unavailable. Please try again shortly.",
                "sources": [], "suggestions": []})
        if result["model"]:
            cache_put(key, result)
            thread_put(body.session_id, question, result["answer"])
    elapsed_ms = round(1000 * (time.perf_counter() - started))
    is_idk = result["answer"].startswith("I couldn't find")
    log_event("ask", question=question, ip=ip, cached=cached, model=result["model"],
              sources=result["sources"], page_url=body.page_url or None, ms=elapsed_ms)
    analytics.record_ask(question, cached, result["model"], elapsed_ms, is_idk=is_idk)
    return {"answer": result["answer"], "sources": result["sources"],
            "suggestions": result.get("suggestions", [])}


def sse(event: str, data) -> str:
    return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"


@app.post("/ask/stream")
async def ask_stream(body: AskRequest, request: Request):
    question = clean_question(body.question)
    ip, answer_id = client_ip(request), uuid.uuid4().hex[:12]
    history = body.history or (thread_get(body.session_id) if body.session_id else [])
    key = cache_key(question, history)
    check_rate_limit(ip)  # flood protection applies to every request, cached or not
    cached = cache_get(key)

    async def events():
        started = time.perf_counter()
        result = cached
        is_hist_q = history and is_history_question(question, history)
        if result is None:
            if is_hist_q:
                if not take_llm_budget():
                    result = no_llm_result("Ask OLake has reached its daily usage limit.", [])
                else:
                    raw, model = [], None
                    try:
                        hist_dicts = [m.model_dump() for m in history]
                        msgs = answer.build_history_messages(question, hist_dicts)
                        async for delta, model in llm.stream(msgs):
                            raw.append(delta)
                            yield sse("delta", delta)
                    except Exception as e:
                        log_event("error", question=question, error=f"{type(e).__name__}: {e}")
                        yield sse("error", "The answering service is temporarily unavailable.")
                        return
                    result = {"answer": "".join(raw), "sources": [], "citations": [], "model": model}
            else:
                hits, _ = await retrieve(question, history, page_url=body.page_url)
                if answer.is_weak(hits):
                    result = no_llm_result(answer.IDK_ANSWER, hits)
                elif not take_llm_budget():
                    result = no_llm_result("Ask OLake has reached its daily usage limit. Please try again tomorrow.", hits)
                else:
                    raw, model = [], None
                    try:
                        hist_dicts = [m.model_dump() for m in history]
                        async for delta, model in llm.stream(answer.build_messages(question, hits, hist_dicts)):
                            raw.append(delta)
                            yield sse("delta", delta)
                    except Exception as e:
                        log_event("error", question=question, error=f"{type(e).__name__}: {e}")
                        yield sse("error", "The answering service is temporarily unavailable. Please try again.")
                        return
                    text, sources, citations = answer.finalize("".join(raw), hits)
                    suggestions = await llm.suggest_followups(question, text) if config.SUGGESTIONS_ENABLED else []
                    result = {"answer": text, "sources": sources, "citations": citations, "model": model,
                              "suggestions": suggestions}
                    cache_put(key, result)
                    thread_put(body.session_id, question, text)
        yield sse("final", {"id": answer_id, "answer": result["answer"], "sources": result["sources"],
                            "citations": result.get("citations", []),
                            "suggestions": result.get("suggestions", [])})
        elapsed_ms = round(1000 * (time.perf_counter() - started))
        is_idk = result["answer"].startswith("I couldn't find")
        log_event("ask", question=question, ip=ip, id=answer_id, cached=cached is not None, stream=True,
                  model=result["model"], sources=result["sources"], page_url=body.page_url or None,
                  ms=elapsed_ms)
        analytics.record_ask(question, cached is not None, result["model"], elapsed_ms, is_idk=is_idk)

    return StreamingResponse(events(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


class Feedback(BaseModel):
    id: str = Field(..., max_length=64)
    vote: int = Field(..., ge=-1, le=1)
    question: str = Field("", max_length=1000)
    comment: str = Field("", max_length=1000)
    category: str = Field("", max_length=64)


@app.post("/feedback")
async def feedback(body: Feedback, request: Request):
    check_rate_limit(client_ip(request))
    log_event("feedback", **body.model_dump())
    analytics.record_feedback(body.vote, body.category)
    return {"ok": True}


@app.get("/healthz")
async def healthz():
    return {"ok": True, "chunks": len(index.chunks)}


@app.get("/version")
async def version():
    """Exactly the organizers' contract: which commit and deployment are live, read from the
    platform's environment at call time (Render names first, Vercel names as fallback)."""
    commit = os.getenv("RENDER_GIT_COMMIT") or os.getenv("VERCEL_GIT_COMMIT_SHA") or ""
    # Render has no deploy-ID variable and RENDER_INSTANCE_ID changes on every instance restart,
    # so identify the deployment by service + commit: it only changes when something is deployed.
    service = os.getenv("RENDER_SERVICE_ID")
    deployment = f"{service}@{commit[:12]}" if service and commit else os.getenv("VERCEL_DEPLOYMENT_ID") or ""
    return {"commit": commit, "deployment": deployment}


@app.get("/status")
async def status():
    return {**META, "model": config.LLM_MODEL, "fallback_models": config.LLM_FALLBACK_MODELS,
            "embeddings": index.model is not None, "live_refresh": refresher.status}


def refresh_authorized(request: Request, body: bytes) -> bool:
    """Either a bearer token (manual / cron) or a GitHub webhook HMAC signature."""
    token, secret = os.getenv("REFRESH_TOKEN", ""), os.getenv("WEBHOOK_SECRET", "")
    auth = request.headers.get("authorization", "")
    if token and hmac.compare_digest(auth, f"Bearer {token}"):
        return True
    signature = request.headers.get("x-hub-signature-256", "")
    if secret and signature:
        expected = "sha256=" + hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
        return hmac.compare_digest(signature, expected)
    return False


@app.get("/admin/analytics")
async def admin_analytics(request: Request):
    if not refresh_authorized(request, b""):
        # also allow token via query param for browser dashboard use
        token = request.query_params.get("token", "")
        stored = os.getenv("REFRESH_TOKEN", "")
        if not (stored and hmac.compare_digest(token, stored)):
            raise HTTPException(401, "Unauthorized")
    return analytics.get_stats()


@app.get("/admin/content-gaps")
async def content_gaps(request: Request):
    """Returns IDK questions grouped by shared keywords, sorted by frequency.
    Use this to identify what the docs are missing."""
    if not refresh_authorized(request, b""):
        token = request.query_params.get("token", "")
        stored = os.getenv("REFRESH_TOKEN", "")
        if not (stored and hmac.compare_digest(token, stored)):
            raise HTTPException(401, "Unauthorized")

    stats = analytics.get_stats()
    questions = stats.get("idk_questions", [])
    if not questions:
        return {"total": 0, "groups": []}

    # Simple keyword clustering: extract top content word per question, group by it
    stopwords = {
        "a", "an", "the", "is", "are", "was", "were", "be", "been", "do", "does", "did",
        "how", "what", "why", "when", "where", "which", "who", "can", "could", "should",
        "would", "i", "me", "my", "we", "our", "you", "your", "it", "its", "to", "of",
        "in", "on", "for", "with", "and", "or", "not", "this", "that", "there", "from",
        "by", "as", "at", "if", "then", "so", "up", "use", "using", "have", "has", "had",
        "get", "set", "into", "about", "any", "all", "olake",
    }

    from collections import defaultdict
    groups: dict[str, list[str]] = defaultdict(list)
    for q in questions:
        words = [w for w in re.findall(r"[a-z]{4,}", q.lower()) if w not in stopwords]
        key = words[0] if words else "other"
        groups[key].append(q)

    sorted_groups = sorted(groups.items(), key=lambda x: -len(x[1]))
    return {
        "total": len(questions),
        "groups": [{"keyword": k, "count": len(qs), "questions": qs} for k, qs in sorted_groups],
    }


_ANALYTICS_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ask OLake Analytics</title>
<style>
:root{--bg:#f5f7fa;--card:#fff;--ink:#1a1d23;--muted:#6b7280;--accent:#0ea5e9;--line:#e2e5ea;--good:#10b981;--warn:#f59e0b;--bad:#ef4444;font-size:14px}
*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,sans-serif;background:var(--bg);color:var(--ink);padding:24px}
h1{font-size:1.4rem;font-weight:700;margin-bottom:20px}h2{font-size:1rem;font-weight:600;margin-bottom:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-bottom:24px}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px}
.card .val{font-size:1.6rem;font-weight:700;line-height:1.2}.card .lbl{font-size:.8rem;color:var(--muted);margin-top:4px}
.panel{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:16px;margin-bottom:20px}
table{width:100%;border-collapse:collapse}th{text-align:left;font-size:.8rem;color:var(--muted);padding:6px 8px;border-bottom:1px solid var(--line)}
td{padding:7px 8px;border-bottom:1px solid var(--line);font-size:.88rem}tr:last-child td{border:none}
.bar{height:8px;border-radius:4px;background:var(--accent);display:inline-block;min-width:2px}
.tag{display:inline-block;padding:2px 7px;border-radius:10px;font-size:.75rem;font-weight:600}
.tag-good{background:#d1fae5;color:#065f46}.tag-warn{background:#fef3c7;color:#92400e}.tag-bad{background:#fee2e2;color:#991b1b}
#error{color:var(--bad);padding:20px;font-weight:600}
</style>
</head>
<body>
<h1>Ask OLake Analytics</h1>
<div id="root"><p style="color:var(--muted)">Loading...</p></div>
<script>
const token = new URLSearchParams(location.search).get('token') || '';
async function load() {
  const r = await fetch('/admin/analytics?token=' + encodeURIComponent(token));
  if (!r.ok) { document.getElementById('root').innerHTML = '<div id="error">Auth failed — add ?token=... to the URL</div>'; return; }
  const d = await r.json();
  const total = d.daily.questions;
  const mkcard = (val, lbl, color='var(--ink)') =>
    `<div class="card"><div class="val" style="color:${color}">${val}</div><div class="lbl">${lbl}</div></div>`;
  const pct = (n, tot) => tot ? (100*n/tot).toFixed(1)+'%' : '0%';
  const tag = (v, thresholds) => {
    const cls = v >= thresholds[0] ? 'tag-bad' : v >= thresholds[1] ? 'tag-warn' : 'tag-good';
    return `<span class="tag ${cls}">${v}%</span>`;
  };
  document.getElementById('root').innerHTML = `
    <div style="font-size:.82rem;color:var(--muted);margin-bottom:16px">Session started ${d.session_start} · Today: ${d.date}</div>
    <div class="grid">
      ${mkcard(total, 'Questions today')}
      ${mkcard(d.daily.llm_calls, 'LLM calls')}
      ${mkcard(d.daily.cache_hits, 'Cache hits')}
      ${mkcard(d.daily.errors, 'Errors', d.daily.errors > 0 ? 'var(--bad)' : 'var(--ink)')}
      ${mkcard(d.latency.p50_ms + 'ms', 'Latency p50')}
      ${mkcard(d.latency.p95_ms + 'ms', 'Latency p95', d.latency.p95_ms > 5000 ? 'var(--warn)' : 'var(--ink)')}
      ${mkcard(d.daily.feedback_good + '👍 / ' + d.daily.feedback_bad + '👎', 'Feedback')}
    </div>
    <div class="grid" style="grid-template-columns:repeat(3,1fr)">
      <div class="panel"><h2>IDK rate</h2>${tag(d.rates.idk_pct, [20, 10])} ${d.daily.idk} of ${total} unanswered</div>
      <div class="panel"><h2>Cache hit rate</h2>${tag(100-d.rates.cache_hit_pct, [80, 50])} ${d.daily.cache_hits} of ${total} served from cache</div>
      <div class="panel"><h2>Error rate</h2>${tag(d.rates.error_pct, [5, 2])} ${d.daily.errors} errors</div>
    </div>
    ${d.top_questions.length ? `<div class="panel"><h2>Top questions (session)</h2><table><tr><th>#</th><th>Question</th><th>Count</th></tr>` +
      d.top_questions.map(([q,n],i) => `<tr><td style="color:var(--muted)">${i+1}</td><td>${q}</td><td><span class="bar" style="width:${Math.max(4,n*20)}px"></span> ${n}</td></tr>`).join('') +
      `</table></div>` : ''}
    ${d.idk_questions.length ? `<div class="panel"><h2>Unanswered questions (content gaps)</h2><table><tr><th>Question</th></tr>` +
      d.idk_questions.map(q => `<tr><td>${q}</td></tr>`).join('') +
      `</table></div>` : ''}
    ${Object.keys(d.feedback_categories).length ? `<div class="panel"><h2>Feedback categories (thumbs down)</h2><table><tr><th>Category</th><th>Count</th></tr>` +
      Object.entries(d.feedback_categories).sort((a,b)=>b[1]-a[1]).map(([k,v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('') +
      `</table></div>` : ''}
  `;
}
load();
setInterval(load, 30000);
</script>
</body></html>"""


@app.get("/admin/analytics/ui", response_class=HTMLResponse)
async def analytics_ui():
    return HTMLResponse(_ANALYTICS_HTML)


@app.get("/models")
async def models():
    """Models this deployment's key may use, as reported by OpenRouter (not a typed-out list)."""
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(f"{config.LLM_BASE_URL}/models/user",
                                headers={"Authorization": f"Bearer {config.OPENROUTER_API_KEY}"})
    if resp.status_code != 200:
        raise HTTPException(502, "Could not fetch models from OpenRouter")
    return {"models": [m["id"] for m in resp.json().get("data", [])]}


@app.post("/admin/refresh", status_code=202)
async def admin_refresh(request: Request):
    if not refresh_authorized(request, await request.body()):
        raise HTTPException(401, "Unauthorized")
    asyncio.create_task(refresher.check())
    log_event("refresh_triggered", via="webhook" if request.headers.get("x-github-event") else "token")
    return {"accepted": True, "status": refresher.status}


@app.post("/webhook/github", status_code=202)
async def github_webhook(request: Request):
    """GitHub push webhook → triggers a doc re-index.

    Set up in your GitHub repo: Settings → Webhooks → Payload URL = <this>/webhook/github,
    Content type = application/json, Secret = WEBHOOK_SECRET env var.
    Only push events to WEBHOOK_BRANCH (default: main) trigger a refresh.
    """
    if not config.WEBHOOK_SECRET:
        raise HTTPException(501, "WEBHOOK_SECRET not configured")

    body = await request.body()
    signature = request.headers.get("x-hub-signature-256", "")
    if not signature:
        raise HTTPException(400, "Missing X-Hub-Signature-256")
    expected = "sha256=" + hmac.new(config.WEBHOOK_SECRET.encode(), body, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(signature, expected):
        raise HTTPException(401, "Invalid signature")

    event = request.headers.get("x-github-event", "")
    if event != "push":
        return {"accepted": False, "reason": f"ignored event: {event}"}

    if config.WEBHOOK_BRANCH:
        try:
            ref = json.loads(body).get("ref", "")
        except Exception:
            ref = ""
        if ref and ref != f"refs/heads/{config.WEBHOOK_BRANCH}":
            return {"accepted": False, "reason": f"ignored ref: {ref}"}

    asyncio.create_task(refresher.check())
    log_event("refresh_triggered", via="github_webhook")
    return {"accepted": True}


if WEB_DIR.exists():
    app.mount("/static", StaticFiles(directory=WEB_DIR), name="static")

    @app.get("/widget.js")
    async def widget_js():
        return FileResponse(WEB_DIR / "widget.js", media_type="application/javascript",
                            headers={"Cache-Control": "public, max-age=300"})

    @app.get("/")
    async def demo_page():
        return FileResponse(WEB_DIR / "index.html")
