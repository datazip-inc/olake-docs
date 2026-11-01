"""Scrape the rendered OLake docs website into heading-level sections.

We scrape olake.io (not the olake-docs MDX files) because shared MDX snippets are
only inlined at build time, so the rendered page is what users actually read.
"""

import hashlib
import re
import time
from pathlib import Path
from xml.etree import ElementTree

import httpx
from bs4 import BeautifulSoup, NavigableString, Tag

SITEMAP_URL = "https://olake.io/sitemap.xml"
USER_AGENT = "AskOLakeBot/0.1 (+hackathon docs assistant)"
RAW_DIR = Path("data/raw/docs")

SKIP_TAGS = {"script", "style", "svg", "button", "nav", "noscript", "img"}


# Official how-to blog posts and comparison pages: useful (Airflow, Debezium comparisons...)
# but lower trust than the reference docs, so they are indexed as source_type "blog".
BLOG_PREFIXES = ("https://olake.io/blog/", "https://olake.io/compare/")


def sitemap_urls(client: httpx.Client) -> list[str]:
    xml = client.get(SITEMAP_URL).text
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    locs = [e.text.strip() for e in ElementTree.fromstring(xml).findall(".//s:loc", ns)]
    wanted = ("https://olake.io/docs/", *BLOG_PREFIXES)
    # skip blog listing/tag/author index pages; keep actual posts
    return sorted(u for u in locs if u.startswith(wanted)
                  and not re.search(r"/blog/(tags|authors|page|archive)(/|$)", u) and u not in BLOG_PREFIXES)


def fetch(client: httpx.Client, url: str, cache: bool = True) -> str:
    """Fetch a page; with cache=True the raw HTML is kept so re-runs don't hit the site again."""
    path = RAW_DIR / (hashlib.sha1(url.encode()).hexdigest()[:16] + ".html")
    if cache and path.exists():
        return path.read_text()
    resp = client.get(url)
    resp.raise_for_status()
    if cache:
        RAW_DIR.mkdir(parents=True, exist_ok=True)
        path.write_text(resp.text)
    time.sleep(0.2)  # be polite
    return resp.text


def content_hash(sections: list[dict]) -> str:
    return hashlib.sha1("".join(s["text"] for s in sections).encode()).hexdigest()


def _inline(node: Tag) -> str:
    return re.sub(r"\s+", " ", node.get_text(" ", strip=True).replace("\u200b", "")).strip()


def _code(pre: Tag) -> str:
    lines = pre.select(".token-line")
    if lines:
        return "\n".join(line.get_text() for line in lines).rstrip()
    return pre.get_text().rstrip()


def _render(node: Tag, out: list[str]) -> None:
    """Append a markdown-ish rendering of node's children to out.

    h2/h3 become section markers: \x00H<level>|<anchor>|<title>\x00
    """
    for child in node.children:
        if isinstance(child, NavigableString):
            text = re.sub(r"\s+", " ", str(child))
            if text.strip():
                out.append(text)
            continue
        if not isinstance(child, Tag) or child.name in SKIP_TAGS:
            continue
        if "hash-link" in (child.get("class") or []):
            continue
        name = child.name
        if name in ("h2", "h3"):
            out.append(f"\n\x00H{name[1]}|{child.get('id', '')}|{_inline(child)}\x00\n")
        elif name in ("h4", "h5", "h6"):
            out.append(f"\n\n**{_inline(child)}**\n\n")
        elif name == "pre":
            out.append(f"\n\n```\n{_code(child)}\n```\n\n")
        elif name == "code":
            out.append(f"`{child.get_text()}`")
        elif name in ("p", "summary"):
            out.append("\n\n")
            _render(child, out)
            out.append("\n\n")
        elif name == "br":
            out.append("\n")
        elif name in ("ul", "ol"):
            out.append("\n")
            for li in child.find_all("li", recursive=False):
                out.append("\n- ")
                _render(li, out)
            out.append("\n\n")
        elif name == "table":
            out.append("\n\n")
            for row in child.find_all("tr"):
                cells = [_inline(c) for c in row.find_all(["th", "td"])]
                out.append("| " + " | ".join(cells) + " |\n")
            out.append("\n")
        elif name == "div" and "tabs-container" in (child.get("class") or []):
            labels = [_inline(li) for li in child.select('[role="tab"]')]
            panels = child.select('[role="tabpanel"]')
            for i, panel in enumerate(panels):
                label = labels[i] if i < len(labels) else f"Tab {i + 1}"
                out.append(f"\n\n**{label}:**\n\n")
                _render(panel, out)
        elif "theme-admonition" in (child.get("class") or []):
            heading = child.select_one('[class*="admonitionHeading"]')
            content = child.select_one('[class*="admonitionContent"]') or child
            out.append(f"\n\n**{_inline(heading) if heading else 'Note'}:** ")
            _render(content, out)
            out.append("\n\n")
        else:
            _render(child, out)


def _tidy(text: str) -> str:
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def parse_page(url: str, html: str) -> list[dict]:
    """Split one rendered docs page into sections at h2/h3 headings."""
    soup = BeautifulSoup(html, "lxml")
    body = soup.select_one(".theme-doc-markdown") or soup.select_one("article .markdown") or soup.select_one("main")
    if body is None:
        return []
    h1 = body.find("h1")
    h1_text = _inline(h1) if h1 else ""
    if h1:
        h1.decompose()
    # Connector pages all have the h1 "Overview", so prefix the breadcrumb trail
    # ("Sources / Postgres") to make titles specific.
    crumbs = [t for t in (_inline(a) for a in soup.select(".breadcrumbs__item")) if t]
    page_title = " / ".join(crumbs) if crumbs else ""
    if h1_text and h1_text.lower() != (crumbs[-1].lower() if crumbs else ""):
        page_title = f"{page_title}: {h1_text}" if page_title else h1_text
    page_title = page_title or (soup.title.get_text(strip=True) if soup.title else url)
    if url.startswith(BLOG_PREFIXES):
        page_title = ("Blog: " if "/blog/" in url else "Compare: ") + page_title

    out: list[str] = []
    _render(body, out)
    parts = "".join(out).split("\x00")

    sections = []
    heading, anchor, level_titles = None, "", {}
    for part in parts:
        if part.startswith("H") and "|" in part[:4]:
            level, (anchor, title) = part[1], part[3:].split("|", 1)
            level_titles[level] = title
            if level == "2":
                level_titles.pop("3", None)
            heading = " > ".join(level_titles[k] for k in sorted(level_titles))
            continue
        text = _tidy(part)
        if not text:
            continue
        sections.append({
            "page_title": page_title,
            "heading": heading,
            "url": f"{url}#{anchor}" if heading else url,
            "page_url": url,
            "text": text,
        })
    return sections


def scrape(cache: bool = True) -> list[dict]:
    sections = []
    with httpx.Client(headers={"User-Agent": USER_AGENT}, timeout=30, follow_redirects=True) as client:
        urls = sitemap_urls(client)
        for i, url in enumerate(urls, 1):
            try:
                page_sections = parse_page(url, fetch(client, url, cache))
            except httpx.HTTPError as e:
                print(f"  ! {url}: {e}")
                continue
            for s in page_sections:
                s["source_type"] = "blog" if url.startswith(BLOG_PREFIXES) else "docs"
                s["product"] = "fusion" if "/fusion/" in url else "olake"
            sections.extend(page_sections)
            if i % 20 == 0:
                print(f"  {i}/{len(urls)} pages")
    summary = release_summary(sections)
    if summary:
        sections.append(summary)
    print(f"docs+blog: {len(urls)} pages -> {len(sections)} sections")
    return sections


def _version_key(text: str) -> tuple:
    m = re.search(r"v(\d+)\.(\d+)\.(\d+)", text)
    return tuple(int(x) for x in m.groups()) if m else (-1,)


def release_summary(sections: list[dict]) -> dict | None:
    """Release pages don't say which one is newest, so add one section that lists every
    release newest first ("what is the latest version?" then has a direct answer)."""
    out = []
    for product, prefix in (("OLake Go (ingestion)", "/docs/release/ingestion/"), ("OLake Fusion", "/docs/fusion/release/maintenance/")):
        pages = {}
        for sec in sections:
            url = sec["page_url"]
            if prefix in url and not url.rstrip("/").endswith("overview"):
                pages.setdefault(url, sec["page_title"].split(":")[0])
        if not pages:
            continue
        ordered = sorted(pages.items(), key=lambda kv: _version_key(kv[1] + " " + kv[0]), reverse=True)
        latest_url, latest_title = ordered[0]
        out.append(f"**{product}**: the latest release is {latest_title.split('/')[-1].strip()} ({latest_url}).\n"
                   "All releases, newest first:\n" + "\n".join(f"- {t.split('/')[-1].strip()}: {u}" for u, t in ordered))
    if not out:
        return None
    return {"page_title": "Release notes: latest versions (newest first)", "heading": None,
            "url": "https://olake.io/docs/release/ingestion/overview/", "page_url": "https://olake.io/docs/release/ingestion/overview/",
            "text": "\n\n".join(out), "source_type": "docs", "product": "olake"}
