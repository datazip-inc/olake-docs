"""Analytics aggregator: in-memory with hourly persistence to data/analytics.jsonl.

Tracks:
  - Daily question counts, cache hits, LLM calls, errors, IDK rate
  - Rolling latency percentiles (last 500 requests)
  - Top 50 questions by frequency
  - Last 50 unanswered (IDK) questions — content-gap feed
  - Feedback votes and categories

Persists daily aggregates to data/analytics.jsonl (one JSON line per day) so
metrics survive restarts. Call persist() to flush; call load() on startup.
"""

import json
import os
import threading
from collections import Counter, deque
from datetime import date, datetime, timezone
from pathlib import Path

_DATA_DIR = Path(os.getenv("DATA_DIR", "data"))
_ANALYTICS_FILE = _DATA_DIR / "analytics.jsonl"

_lock = threading.Lock()

_today = date.today()
_daily: dict = {
    "questions": 0,
    "llm_calls": 0,
    "cache_hits": 0,
    "errors": 0,
    "idk": 0,
    "feedback_good": 0,
    "feedback_bad": 0,
}
_latencies_ms: deque = deque(maxlen=500)
_top_questions: Counter = Counter()
_idk_questions: deque = deque(maxlen=50)
_feedback_categories: Counter = Counter()
_session_start = datetime.now(timezone.utc).isoformat(timespec="seconds")
_last_persist: str | None = None


def _reset_if_new_day() -> None:
    global _today, _daily
    today = date.today()
    if today != _today:
        _today = today
        _daily = {k: 0 for k in _daily}


def record_ask(question: str, cached: bool, model: str | None, ms: int, is_idk: bool = False) -> None:
    with _lock:
        _reset_if_new_day()
        _daily["questions"] += 1
        if cached:
            _daily["cache_hits"] += 1
        if model:
            _daily["llm_calls"] += 1
        if is_idk:
            _daily["idk"] += 1
            _idk_questions.appendleft(question)
        _latencies_ms.append(ms)
        q_norm = question.lower().strip().rstrip("?")[:100]
        _top_questions[q_norm] += 1
        # Trim to top 200 by evicting singletons when oversized
        if len(_top_questions) > 200:
            for k in [k for k, v in list(_top_questions.items()) if v == 1]:
                del _top_questions[k]
                if len(_top_questions) <= 200:
                    break


def record_error() -> None:
    with _lock:
        _reset_if_new_day()
        _daily["errors"] += 1


def record_feedback(vote: int, category: str = "") -> None:
    with _lock:
        _reset_if_new_day()
        if vote > 0:
            _daily["feedback_good"] += 1
        elif vote < 0:
            _daily["feedback_bad"] += 1
            if category:
                _feedback_categories[category] += 1


def persist() -> None:
    """Append today's aggregate to analytics.jsonl. Call periodically (e.g. hourly)."""
    global _last_persist
    try:
        snapshot = get_stats()
        line = json.dumps({"persisted_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
                           **snapshot}, ensure_ascii=False)
        _DATA_DIR.mkdir(exist_ok=True)
        with open(_ANALYTICS_FILE, "a") as f:
            f.write(line + "\n")
        with _lock:
            _last_persist = datetime.now(timezone.utc).isoformat(timespec="seconds")
    except Exception:
        pass  # never fatal


def load() -> None:
    """Load today's aggregate from analytics.jsonl on startup to resume counters."""
    global _today, _daily, _feedback_categories
    if not _ANALYTICS_FILE.exists():
        return
    try:
        today_str = str(date.today())
        with open(_ANALYTICS_FILE) as f:
            for raw in f:
                try:
                    row = json.loads(raw)
                except Exception:
                    continue
                if row.get("date") != today_str:
                    continue
                with _lock:
                    for k in _daily:
                        _daily[k] = max(_daily[k], row.get("daily", {}).get(k, 0))
                    for k, v in row.get("feedback_categories", {}).items():
                        _feedback_categories[k] = max(_feedback_categories.get(k, 0), v)
    except Exception:
        pass


def get_stats() -> dict:
    with _lock:
        lats = sorted(_latencies_ms)
        p50 = lats[len(lats) // 2] if lats else 0
        p95 = lats[int(0.95 * len(lats))] if len(lats) >= 20 else (lats[-1] if lats else 0)
        total = _daily["questions"]
        return {
            "date": str(_today),
            "session_start": _session_start,
            "daily": dict(_daily),
            "rates": {
                "idk_pct": round(100 * _daily["idk"] / total, 1) if total else 0,
                "cache_hit_pct": round(100 * _daily["cache_hits"] / total, 1) if total else 0,
                "error_pct": round(100 * _daily["errors"] / total, 1) if total else 0,
            },
            "latency": {
                "p50_ms": round(p50),
                "p95_ms": round(p95),
                "sample_size": len(lats),
            },
            "top_questions": _top_questions.most_common(50),
            "idk_questions": list(_idk_questions),
            "feedback_categories": dict(_feedback_categories),
            "last_persist": _last_persist,
        }
