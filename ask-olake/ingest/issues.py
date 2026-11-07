"""Closed, discussed GitHub issues -> lower-trust troubleshooting sections.

Uses the GitHub REST API with GITHUB_TOKEN (5,000 req/h; without a token GitHub allows
only 60/h, so we fall back to the committed snapshot data/issues.jsonl).

Refresh the snapshot: uv run python -m ingest.issues
"""

import json
import os
import re
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import httpx

ORG = "datazip-inc"
REPOS = {"olake": "olake", "olake-ui": "olake", "olake-helm": "olake", "olake-fusion": "fusion"}
SNAPSHOT = Path(os.getenv("DATA_DIR", "data")) / "issues.jsonl"
CHATTER = re.compile(r"\b(assign|work on (this|it)|take (this|it) up|pick (this|it) up|interested in|can i (work|take))\b", re.I)
MAX_BODY, MAX_COMMENT, MAX_TOTAL = 1500, 1200, 4000


def github_client() -> httpx.Client | None:
    token = os.getenv("GITHUB_TOKEN", "").strip()
    if not token:
        return None
    return httpx.Client(base_url="https://api.github.com", timeout=30, headers={
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "ask-olake",
    })


def _get_all(client: httpx.Client, path: str, params: dict | None = None) -> list:
    items, url, params = [], path, {"per_page": 100, **(params or {})}
    while url:
        resp = client.get(url, params=params)
        resp.raise_for_status()
        items.extend(resp.json())
        url, params = resp.links.get("next", {}).get("url"), None
    return items


def _clean(text: str | None, limit: int) -> str:
    text = re.sub(r"<!--.*?-->", "", text or "", flags=re.S)
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    return text[:limit] + ("…" if len(text) > limit else "")


def _issue_section(client: httpx.Client, repo: str, product: str, issue: dict) -> dict | None:
    comments = _get_all(client, f"/repos/{ORG}/{repo}/issues/{issue['number']}/comments")
    useful = [c for c in comments if c.get("user", {}).get("type") != "Bot"
              and len(c.get("body") or "") > 60 and not CHATTER.search((c.get("body") or "")[:200])]
    if not useful:
        return None
    parts = [f"Issue ({issue.get('state_reason') or 'closed'}): {_clean(issue.get('body'), MAX_BODY)}", "Discussion:"]
    for c in useful:
        parts.append(f"- {c.get('author_association', 'NONE').lower()}: {_clean(c['body'], MAX_COMMENT)}")
    return {
        "page_title": f"GitHub issue {repo}#{issue['number']}: {issue['title']}",
        "heading": None,
        "url": issue["html_url"],
        "page_url": issue["html_url"],
        "text": "\n\n".join(parts)[:MAX_TOTAL],
        "source_type": "issue",
        "product": product,
    }


def fetch(client: httpx.Client, since: str | None = None) -> list[dict]:
    """Closed issues with useful discussion. With `since` (ISO time) only issues updated after it."""
    sections = []
    for repo, product in REPOS.items():
        params = {"state": "closed", **({"since": since} if since else {})}
        issues = [i for i in _get_all(client, f"/repos/{ORG}/{repo}/issues", params)
                  if "pull_request" not in i and i.get("comments", 0) > 0]
        with ThreadPoolExecutor(max_workers=8) as pool:
            found = [s for s in pool.map(lambda i: _issue_section(client, repo, product, i), issues) if s]
        print(f"issues {repo}: {len(found)}/{len(issues)} kept")
        sections.extend(found)
    return sections


def load_snapshot() -> list[dict]:
    return [json.loads(line) for line in open(SNAPSHOT)] if SNAPSHOT.exists() else []


def save_snapshot(sections: list[dict]) -> None:
    with open(SNAPSHOT, "w") as f:
        for s in sections:
            f.write(json.dumps(s, ensure_ascii=False) + "\n")


def collect() -> list[dict]:
    client = github_client()
    if client:
        try:
            with client:
                sections = fetch(client)
            save_snapshot(sections)
            return sections
        except httpx.HTTPError as e:
            print(f"issues: GitHub API failed ({e}); using snapshot")
    sections = load_snapshot()
    print(f"issues: {len(sections)} from snapshot" if sections else "issues: no token and no snapshot; skipping")
    return sections


if __name__ == "__main__":
    from dotenv import load_dotenv

    load_dotenv()
    collect()
