"""OpenRouter chat client with model fallback, hedged requests, reasoning off, timeouts and retries."""

import asyncio
from collections.abc import AsyncIterator

from openai import APIStatusError, AsyncOpenAI

from app import config

_client = AsyncOpenAI(
    base_url=config.LLM_BASE_URL,
    api_key=config.OPENROUTER_API_KEY or "missing",
    timeout=config.LLM_TIMEOUT_S,
    max_retries=2,  # SDK retries 429/5xx with backoff
)


def _request(messages: list[dict], reasoning_off: bool, model: str | None = None) -> dict:
    model = model or config.LLM_MODEL
    extra = {}
    fallbacks = [m for m in config.LLM_FALLBACK_MODELS if m != model]
    if fallbacks:
        extra["models"] = fallbacks
    if reasoning_off:
        extra["reasoning"] = {"effort": "none"}
    return dict(
        model=model,
        messages=messages,
        max_tokens=config.MAX_ANSWER_TOKENS,
        temperature=0.1,
        extra_body=extra,
    )


async def _complete_one(messages: list[dict], model: str | None = None) -> tuple[str, str]:
    try:
        resp = await _client.chat.completions.create(**_request(messages, reasoning_off=True, model=model))
    except APIStatusError as e:
        if e.status_code != 400:
            raise
        # some providers reject the reasoning field; retry without it
        resp = await _client.chat.completions.create(**_request(messages, reasoning_off=False, model=model))
    return (resp.choices[0].message.content or "").strip(), resp.model


async def complete(messages: list[dict]) -> tuple[str, str]:
    """Return (text, model_that_answered).

    Hedged request: OpenRouter's fallback only covers errors, not slowness, so if the
    primary model hasn't answered after HEDGE_AFTER_S we also ask the first fallback
    model and take whichever finishes first (extra cost only on slow requests)."""
    primary = asyncio.create_task(_complete_one(messages))
    if not config.LLM_FALLBACK_MODELS or config.HEDGE_AFTER_S <= 0:
        return await primary
    done, _ = await asyncio.wait({primary}, timeout=config.HEDGE_AFTER_S)
    if done:
        return primary.result()
    hedge = asyncio.create_task(_complete_one(messages, model=config.LLM_FALLBACK_MODELS[0]))
    pending = {primary, hedge}
    while pending:
        done, pending = await asyncio.wait(pending, return_when=asyncio.FIRST_COMPLETED)
        for task in done:
            if task.exception() is None:
                for other in pending:
                    other.cancel()
                return task.result()
    return primary.result()  # both failed: surface the primary's error


async def stream(messages: list[dict]) -> AsyncIterator[tuple[str, str]]:
    """Yield (text_delta, model) pairs."""
    try:
        chunks = await _client.chat.completions.create(**_request(messages, reasoning_off=True), stream=True)
    except APIStatusError as e:
        if e.status_code != 400:
            raise
        chunks = await _client.chat.completions.create(**_request(messages, reasoning_off=False), stream=True)
    async for chunk in chunks:
        if chunk.choices and chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content, chunk.model


_DECOMPOSE_PROMPT = (
    "Split the following compound question about OLake documentation into 2-3 independent "
    "search queries. If the question is not compound, return it unchanged on a single line. "
    "Return only the queries, one per line, no numbering."
)

_COMPOUND_SIGNALS = (
    " and also ", " as well as ", " along with ", " in addition to ",
    " combined with ", " together with ", " while also ",
)


async def decompose_query(question: str) -> list[str]:
    """Split compound questions into sub-queries for multi-hop retrieval.

    Returns [question] unchanged if not compound or if the LLM call fails/times out.
    Heuristic gate avoids the LLM call for simple questions.
    """
    q_lower = question.lower()
    is_compound = (
        any(s in q_lower for s in _COMPOUND_SIGNALS)
        or q_lower.count(" and ") >= 2
    )
    if not is_compound or len(question.split()) < 8:
        return [question]
    msgs = [
        {"role": "system", "content": _DECOMPOSE_PROMPT},
        {"role": "user", "content": question[:500]},
    ]
    try:
        resp = await asyncio.wait_for(
            _client.chat.completions.create(
                model=config.SUGGESTIONS_MODEL or config.LLM_MODEL,
                messages=msgs,
                max_tokens=150,
                temperature=0,
                extra_body={"reasoning": {"effort": "none"}},
            ),
            timeout=3.0,
        )
        raw = (resp.choices[0].message.content or "").strip()
        lines = [l.strip().lstrip("0123456789.-) \"'") for l in raw.splitlines() if l.strip()]
        sub_queries = [l for l in lines if len(l) > 5][:3]
        return sub_queries if len(sub_queries) > 1 else [question]
    except Exception:
        return [question]


_SUGGEST_PROMPT = (
    "Given a Q&A about OLake documentation, generate exactly 3 short follow-up questions "
    "(under 10 words each) the user might ask next. "
    "Return only the 3 questions, one per line, no numbers or bullets."
)


async def suggest_followups(question: str, answer: str) -> list[str]:
    """Generate 2-3 follow-up questions from a completed Q&A. Never raises."""
    msgs = [
        {"role": "system", "content": _SUGGEST_PROMPT},
        {"role": "user", "content": f"Q: {question[:300]}\nA: {answer[:400]}"},
    ]
    try:
        resp = await asyncio.wait_for(
            _client.chat.completions.create(
                model=config.SUGGESTIONS_MODEL or config.LLM_MODEL,
                messages=msgs,
                max_tokens=config.MAX_SUGGESTIONS_TOKENS,
                temperature=0.3,
                extra_body={"reasoning": {"effort": "none"}},
            ),
            timeout=5.0,
        )
        raw = (resp.choices[0].message.content or "").strip()
        lines = [l.strip().lstrip("0123456789.-) \"'") for l in raw.splitlines() if l.strip()]
        return [l for l in lines if 5 < len(l) < 120][:3]
    except Exception:
        return []


REWRITE_PROMPT = """You turn a user's question about OLake into a search query for the OLake documentation.
OLake docs vocabulary: OLake Go (ingestion), sources/connectors (Postgres, MySQL, MongoDB, Oracle, MSSQL, DB2, Kafka, S3),
destinations/writers (Apache Iceberg, Parquet, S3, GCS, ADLS), catalogs (Glue, Hive, JDBC, REST, Nessie, Polaris, Unity, S3 Tables),
sync modes (Full Refresh, Full Refresh + Incremental, Full Refresh + CDC, CDC Only, Strict CDC), cursor field, state.json, streams.json,
source.json, destination.json, replication slot, publication, pgoutput, wal_level, binlog, oplog, replica set, OLake UI (Docker Compose
quickstart, docker-compose, localhost:8000), Helm/Kubernetes, OLake Fusion (Iceberg table maintenance, compaction Lite/Medium/Full).
Generic setup guides are called "Generic ... Setup Guide" (self-hosted / on-prem servers).
Reply with ONE line of 5-15 search keywords using the docs' terms (no sentences, no explanation)."""


async def rewrite_query(question: str) -> str | None:
    """Docs-vocabulary keywords for the question, or None if the call fails or is slow.
    Retrieval falls back to the original question, so this can only add recall."""
    try:
        resp = await asyncio.wait_for(_client.chat.completions.create(
            model=config.REWRITE_MODEL, max_tokens=60, temperature=0,
            messages=[{"role": "system", "content": REWRITE_PROMPT}, {"role": "user", "content": question[:1000]}],
            extra_body={"reasoning": {"effort": "none"}}), timeout=config.REWRITE_TIMEOUT_S)
        text = (resp.choices[0].message.content or "").strip().splitlines()[0][:300]
        return text or None
    except Exception:
        return None
