"""Collect READMEs, markdown docs and Helm values from the OLake GitHub repos."""

import json
import re
import shutil
import subprocess
from pathlib import Path

ORG = "datazip-inc"
REPOS = {"olake": "olake", "olake-ui": "olake", "olake-helm": "olake", "olake-fusion": "fusion"}
RAW_DIR = Path("data/raw/repos")

SKIP_PARTS = {"node_modules", "vendor", ".git", "testdata", "test", "tests", "__tests__", "dist", "build"}
SKIP_NAMES = {"CLAUDE.md", "AGENTS.md", "CHANGELOG.md", "CODE_OF_CONDUCT.md", "LICENSE.md", "SECURITY.md", "PULL_REQUEST_TEMPLATE.md"}
YAML_NAMES = {"values.yaml", "Chart.yaml"}
LICENSE_NAMES = {"LICENSE", "LICENCE", "LICENSE.md", "LICENCE.md"}
LICENSE_KINDS = [(r"Apache License,?\s+Version 2\.0", "Apache License 2.0"), (r"MIT License", "MIT License"),
                 (r"GNU AFFERO GENERAL PUBLIC LICENSE", "AGPL"), (r"GNU GENERAL PUBLIC LICENSE", "GPL")]


def spec_to_text(spec: dict, prefix: str = "") -> list[str]:
    """Flatten a connector's JSON Schema config spec into one readable line per field."""
    lines, required = [], set(spec.get("required", []))
    for name, prop in (spec.get("properties") or {}).items():
        key = f"{prefix}{name}"
        bits = [prop.get("type", "")]
        if "default" in prop:
            bits.append(f"default {json.dumps(prop['default'])}")
        if "enum" in prop:
            bits.append("one of " + ", ".join(map(str, prop["enum"])))
        if name in required:
            bits.append("required")
        desc = " - ".join(x for x in (prop.get("title"), prop.get("description")) if x)
        lines.append(f"- `{key}` ({', '.join(b for b in bits if b)}): {desc}".rstrip(": "))
        lines.extend(spec_to_text(prop, f"{key}."))
        for option in prop.get("oneOf", []) + prop.get("anyOf", []):
            label = option.get("title", "option")
            lines.extend(f"{line} [when {key} is {label}]" for line in spec_to_text(option, f"{key}."))
    return lines


def remote_head(repo: str) -> str | None:
    """Current HEAD commit of a GitHub repo via `git ls-remote` (no API call, no rate limit)."""
    try:
        out = subprocess.run(["git", "ls-remote", f"https://github.com/{ORG}/{repo}.git", "HEAD"],
                             capture_output=True, text=True, timeout=30, check=True).stdout
        return out.split()[0] if out else None
    except (subprocess.SubprocessError, IndexError):
        return None


def clone(repo: str, fresh: bool = False) -> tuple[Path, str]:
    """Shallow-clone (or reuse) a repo and return its path and default branch."""
    dest = RAW_DIR / repo
    if fresh and dest.exists():
        shutil.rmtree(dest)
    if not dest.exists():
        RAW_DIR.mkdir(parents=True, exist_ok=True)
        subprocess.run(["git", "clone", "--depth", "1", "-q", f"https://github.com/{ORG}/{repo}.git", str(dest)], check=True)
    branch = subprocess.run(["git", "-C", str(dest), "rev-parse", "--abbrev-ref", "HEAD"],
                            capture_output=True, text=True, check=True).stdout.strip()
    return dest, branch


def _slug(heading: str) -> str:
    """GitHub-style heading anchor."""
    s = re.sub(r"[^\w\- ]", "", heading.strip().lower())
    return s.replace(" ", "-")


def split_markdown(text: str) -> list[tuple[str | None, str | None, str]]:
    """Split markdown at ##/### headings (outside code fences) -> (heading_path, anchor, body)."""
    sections, buf, titles = [], [], {}
    heading, anchor, in_fence = None, None, False
    for line in text.splitlines():
        if line.lstrip().startswith("```"):
            in_fence = not in_fence
        m = None if in_fence else re.match(r"^(#{2,3})\s+(.*?)\s*#*\s*$", line)
        if m:
            sections.append((heading, anchor, "\n".join(buf).strip()))
            buf = []
            level, title = len(m.group(1)), re.sub(r"[*`]", "", m.group(2))
            titles[level] = title
            if level == 2:
                titles.pop(3, None)
            heading, anchor = " > ".join(titles[k] for k in sorted(titles)), _slug(title)
        else:
            buf.append(line)
    sections.append((heading, anchor, "\n".join(buf).strip()))
    return [s for s in sections if s[2]]


def _page_title(text: str, rel: str) -> str:
    m = re.search(r"^#\s+(.+)$", text, re.M)
    return re.sub(r"[*`]", "", m.group(1)).strip() if m else rel


def collect(only: list[str] | None = None, fresh: bool = False) -> list[dict]:
    sections = []
    for repo, product in REPOS.items():
        if only is not None and repo not in only:
            continue
        root, branch = clone(repo, fresh)
        n_files = 0
        for path in sorted(root.rglob("*")):
            rel = path.relative_to(root).as_posix()
            if not path.is_file() or SKIP_PARTS & set(path.parts) or path.name in SKIP_NAMES:
                continue
            is_md, is_yaml = path.suffix.lower() == ".md", path.name in YAML_NAMES
            is_license = path.name in LICENSE_NAMES and path.parent == root
            is_spec = path.name == "spec.json" and path.parent.name == "resources"
            if not (is_md or is_yaml or is_license or is_spec):
                continue
            text = path.read_text(errors="ignore")
            if len(text.strip()) < 80:
                continue
            page_url = f"https://github.com/{ORG}/{repo}/blob/{branch}/{rel}"
            n_files += 1
            if is_license:
                kind = next((k for pat, k in LICENSE_KINDS if re.search(pat, text[:3000], re.I)), None)
                if not kind:
                    continue
                parts = [(None, None, f"The {repo} repository (github.com/{ORG}/{repo}) is open source, licensed under the {kind}. See {rel} in the repository.")]
                title = f"{repo}: License ({kind})"
            elif is_spec:
                try:
                    lines = spec_to_text(json.loads(text))
                except json.JSONDecodeError:
                    continue
                component = path.parent.parent.name
                kind = "destination writer" if "destination" in path.parts else "source connector"
                parts = [(None, None, f"Configuration fields of the {component} {kind} (from its spec.json; nested fields use dots):\n" + "\n".join(lines))]
                title = f"{repo}: {component} {kind} config spec (spec.json)"
            elif is_yaml:
                parts = [(None, None, f"```yaml\n{text.strip()}\n```")]
                title = f"{repo}: {rel}"
            else:
                text = re.sub(r"<!--.*?-->", "", text, flags=re.S)
                parts = split_markdown(text)
                title = f"{repo}: {_page_title(text, rel)}"
            for heading, anchor, body in parts:
                sections.append({
                    "page_title": title,
                    "heading": heading,
                    "url": f"{page_url}#{anchor}" if anchor else page_url,
                    "page_url": page_url,
                    "text": body,
                    "source_type": "repo",
                    "product": product,
                    "repo": repo,
                })
        print(f"repo {repo}: {n_files} files")
    print(f"repos: {len(sections)} sections")
    return sections
