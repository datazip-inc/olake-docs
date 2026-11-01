"""Turn heading-level sections into retrieval chunks of a bounded size."""

import re

MAX_CHARS = 2400   # ~600 tokens
MIN_CHARS = 250    # smaller sections get merged into their neighbour


def _split_long(text: str) -> list[str]:
    """Split text at blank lines (never inside a code fence) into pieces <= MAX_CHARS."""
    blocks, buf, in_fence = [], [], False
    for line in text.split("\n"):
        if line.lstrip().startswith("```"):
            in_fence = not in_fence
        if not line.strip() and not in_fence and buf:
            blocks.append("\n".join(buf))
            buf = []
        else:
            buf.append(line)
    if buf:
        blocks.append("\n".join(buf))

    pieces, cur = [], ""
    for block in blocks:
        if cur and len(cur) + len(block) > MAX_CHARS:
            pieces.append(cur)
            cur = ""
        cur = f"{cur}\n\n{block}" if cur else block
    if cur:
        pieces.append(cur)
    # a single block may still exceed the limit: tables are split by rows with the header
    # row repeated (a headerless row of ✅/❌ is meaningless), anything else is hard-cut
    out = []
    for p in pieces:
        if len(p) <= MAX_CHARS:
            out.append(p)
        elif _is_table(p):
            out.extend(_split_table(p))
        else:
            out.extend(_split_lines(p))
    return out


def _split_lines(text: str) -> list[str]:
    """Split at line boundaries; only a single line longer than the limit is hard-cut."""
    pieces, cur = [], ""
    for line in text.split("\n"):
        while len(line) > MAX_CHARS:
            if cur:
                pieces.append(cur)
                cur = ""
            pieces.append(line[:MAX_CHARS])
            line = line[MAX_CHARS:]
        if cur and len(cur) + len(line) + 1 > MAX_CHARS:
            pieces.append(cur)
            cur = ""
        cur = f"{cur}\n{line}" if cur else line
    if cur:
        pieces.append(cur)
    return pieces


def _is_table(text: str) -> bool:
    lines = [line for line in text.strip().split("\n") if line.strip()]
    return len(lines) > 2 and sum(line.lstrip().startswith("|") for line in lines) >= 0.8 * len(lines)


def _split_table(text: str) -> list[str]:
    lines = [line for line in text.strip().split("\n") if line.strip()]
    header, rows = lines[0], lines[1:]
    pieces, cur = [], [header]
    for row in rows:
        if len(cur) > 1 and sum(len(r) + 1 for r in cur) + len(row) > MAX_CHARS:
            pieces.append("\n".join(cur))
            cur = [header]
        cur.append(row)
    pieces.append("\n".join(cur))
    return pieces


def make_chunks(sections: list[dict]) -> list[dict]:
    merged: list[dict] = []
    for s in sections:
        prev = merged[-1] if merged else None
        if (prev and prev["page_url"] == s["page_url"] and len(prev["text"]) < MIN_CHARS
                and len(prev["text"]) + len(s["text"]) < MAX_CHARS):
            # fold a tiny section (often just a heading intro) into the next one
            prev["text"] = f"{prev['text']}\n\n{s['heading'] or ''}\n{s['text']}".strip()
            if prev["heading"] is None:
                prev["heading"], prev["url"] = s["heading"], s["url"]
            continue
        merged.append(dict(s))

    chunks = []
    for s in merged:
        title = s["page_title"] + (f" > {s['heading']}" if s["heading"] else "")
        for i, piece in enumerate(_split_long(s["text"])):
            chunks.append({
                "id": len(chunks),
                "title": title + (f" (part {i + 1})" if i else ""),
                "url": s["url"],
                "page_url": s["page_url"],
                "source_type": s["source_type"],
                "product": s["product"],
                "text": re.sub(r"\n{3,}", "\n\n", piece).strip(),
            })
    return chunks
