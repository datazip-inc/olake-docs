"""Hybrid retrieval: BM25 + model2vec embeddings, fused with Reciprocal Rank Fusion,
then a cheap heuristic rerank.

CLI: uv run python -m app.search "how do I enable CDC for postgres?"
"""

import difflib
import hashlib
import json
import os
import re
import sys
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from rank_bm25 import BM25Okapi

DATA = Path(os.getenv("DATA_DIR", "data"))
DEFAULT_EMBEDDING_MODEL = "minishlab/potion-base-8M"  # set EMBEDDING_MODEL="" for BM25-only
RRF_K = 60
EMB_WEIGHT = float(os.getenv("EMB_WEIGHT", "0.5"))  # model2vec is weaker than BM25 on this corpus (see eval)
SOURCE_WEIGHT = {"docs": 1.0, "repo": float(os.getenv("REPO_WEIGHT", "0.7")), "blog": float(os.getenv("BLOG_WEIGHT", "0.5")), "issue": 0.7}
FUSION_TERMS = {"fusion", "compaction", "compact", "optimizer", "optimizers", "maintenance", "amoro", "snapshot", "expire", "orphan"}
STOPWORDS = set(
    "a an the is are was were be been do does did how what why when where which who can could should would "
    "i me my we our you your it its to of in on for with and or not this that these those there from by as at "
    "if then so up use using used have has had get set into about any all".split()
)


_SUFFIXES = ("ations", "ation", "ings", "ing", "ers", "ies", "ied", "ed", "es", "s")


def _stem(tok: str) -> str:
    """Very light suffix stripping, added as an extra token next to the original word."""
    if not tok.isalpha() or len(tok) < 5:
        return tok
    for suf in _SUFFIXES:
        if tok.endswith(suf) and len(tok) - len(suf) >= 4:
            base = tok[: -len(suf)]
            return base + "y" if suf in ("ies", "ied") else base
    return tok


def tokenize(text: str) -> list[str]:
    """Lowercase word tokens; identifiers like max_threads or jdbc_url_params are kept whole
    and also split into their parts so either form matches."""
    tokens = []
    for tok in re.findall(r"[a-z0-9][a-z0-9_.\-]*[a-z0-9]|[a-z0-9]", text.lower()):
        if tok in STOPWORDS:
            continue
        tokens.append(tok)
        stem = _stem(tok)
        if stem != tok:
            tokens.append(stem)  # "partitioning"/"partitions" also match "partition"
        parts = re.split(r"[_.\-]", tok)
        if len(parts) > 1:
            tokens.extend(p for p in parts if p and p not in STOPWORDS)
    return tokens


DEFINITION_Q = re.compile(r"^\s*(what\s+(is|are|'s)|what's|whats|explain|tell me about|define|describe|overview of)\b", re.I)
# User phrasing -> the docs' vocabulary (query side only; measured on all eval sets)
QUERY_SYNONYMS = {
    "write": ("destination", "destinations"), "writes": ("destination", "destinations"),
    "written": ("destination",), "writing": ("destination",),
    "self-hosted": ("generic",), "on-prem": ("generic",), "on-premise": ("generic",), "on-premises": ("generic",),
    "locally": ("quickstart", "local"), "laptop": ("quickstart", "local"),
    "cli": ("command", "terminal", "docker-cli"),
    "command": ("cli", "docker-cli"),
    "partition": ("partitioning",),
    "partitioning": ("partition",),
    "mongo": ("mongodb",),
    "fast": ("benchmark", "benchmarks", "speed"),
    "speed": ("benchmark", "benchmarks", "fast"),
    "stream": ("streaming", "streams", "cdc"),
    "streams": ("stream", "streaming", "cdc"),
    "streaming": ("stream", "streams", "cdc"),
}
PRODUCT_WORDS = {"olake", "fusion", "go", "ui", "olake-ui", "olake-go", "olake-fusion", "datazip", "platform", "tool", "product"}
INTRO_URL = re.compile(r"(olake\.io/docs/$|/overview/|/introduction/|/getting-started/overview|/core/architecture/|/use-cases/)")
INTRO_HEADING = re.compile(r"\b(what is|what are|overview|introduction|welcome)\b", re.I)


def is_intro(chunk: dict) -> bool:
    if "/release/" in chunk["page_url"]:  # release-notes "overview" pages are not introductions
        return False
    return bool(INTRO_URL.search(chunk["page_url"]) or INTRO_HEADING.search(chunk["title"]))


def embed_text(chunk: dict) -> str:
    return f"{chunk['title']}\n{chunk['text']}"


@dataclass
class Hit:
    chunk: dict
    score: float
    bm25: float
    cosine: float


def text_key(chunk: dict) -> str:
    return hashlib.sha1(embed_text(chunk).encode()).hexdigest()


_models: dict = {}


def load_model(name: str):
    if name not in _models:
        from model2vec import StaticModel
        _models[name] = StaticModel.from_pretrained(name)
    return _models[name]


def embed_chunks(model, chunks: list[dict]) -> np.ndarray:
    vecs = model.encode([embed_text(c) for c in chunks]).astype(np.float32)
    return vecs / np.linalg.norm(vecs, axis=1, keepdims=True).clip(min=1e-9)


class SearchIndex:
    """Built from data/ on disk, or from in-memory chunks during a live refresh.
    `previous` lets a rebuild reuse embeddings of unchanged chunks."""

    def __init__(self, data_dir: Path = DATA, embedding_model: str | None = None,
                 chunks: list[dict] | None = None, previous: "SearchIndex | None" = None):
        from_disk = chunks is None
        self.chunks = [json.loads(line) for line in open(data_dir / "chunks.jsonl")] if from_disk else chunks
        corpus_tokens = [tokenize(embed_text(c)) for c in self.chunks]
        self.bm25 = BM25Okapi(corpus_tokens)
        self.title_tokens = [set(tokenize(c["title"])) for c in self.chunks]
        self.intro = [is_intro(c) for c in self.chunks]
        # vocabulary bucketed by first letter, for typo correction of unknown query words
        self.vocab: dict[str, list[str]] = {}
        for word in {t for toks in corpus_tokens for t in toks if t.isalpha() and len(t) >= 4}:
            self.vocab.setdefault(word[0], []).append(word)

        self.model, self.vectors = None, None
        model_name = os.getenv("EMBEDDING_MODEL", DEFAULT_EMBEDDING_MODEL) if embedding_model is None else embedding_model
        emb_path = data_dir / "embeddings.npy"
        if not model_name or (from_disk and not emb_path.exists()):
            return
        self.model = load_model(model_name)
        if from_disk:
            self.vectors = np.load(emb_path).astype(np.float32)
            if len(self.vectors) == len(self.chunks):
                return
            # chunks and embeddings out of step (interrupted write): re-embed rather than mis-rank
            self.vectors = None
        known = previous.vectors_by_key() if previous is not None and previous.vectors is not None else {}
        missing = [c for c in self.chunks if text_key(c) not in known]
        if missing:
            known.update(zip((text_key(c) for c in missing), embed_chunks(self.model, missing)))
        self.vectors = np.stack([known[text_key(c)] for c in self.chunks]) if self.chunks else None

    def vectors_by_key(self) -> dict[str, np.ndarray]:
        return {text_key(c): v for c, v in zip(self.chunks, self.vectors)}

    @staticmethod
    def expand(tokens: list[str]) -> list[str]:
        """Add the docs' own words for common user phrasings (never removes the user's words)."""
        extra = [syn for tok in tokens for syn in QUERY_SYNONYMS.get(tok, ())]
        return tokens + [t for t in extra if t not in tokens]

    def correct(self, tokens: list[str]) -> list[str]:
        """Replace query words that appear nowhere in the corpus (typos like "fushion")
        with the closest corpus word; known words are never touched."""
        out = []
        for tok in tokens:
            if tok in self.bm25.idf or not tok.isalpha() or len(tok) < 5:
                out.append(tok)
                continue
            candidates = [w for w in self.vocab.get(tok[0], []) if abs(len(w) - len(tok)) <= 2]
            match = difflib.get_close_matches(tok, candidates, n=1, cutoff=0.8)
            out.append(match[0] if match else tok)
        return out

    def search(self, query: str, k: int = 8, per_page: int = 2, pool: int = 100, alt_query: str | None = None, page_url: str = "") -> list[Hit]:
        """Search for `query`; with `alt_query` (an LLM rewrite in docs vocabulary) both rankings
        are fused, so the rewrite can add recall without displacing exact matches of the original.
        `page_url` boosts chunks from the page the user is currently viewing."""
        if not alt_query:
            return self._search(query, k, per_page, pool, page_url=page_url)
        a = self._search(query, k=pool, per_page=per_page, pool=pool, page_url=page_url)
        b = self._search(alt_query, k=pool, per_page=per_page, pool=pool, page_url=page_url)
        fused: dict[int, list] = {}
        for weight, hits in ((1.0, a), (1.0, b)):
            for rank, h in enumerate(hits):
                entry = fused.setdefault(h.chunk["id"], [0.0, h])
                entry[0] += weight / (RRF_K + rank + 1)
                if h.bm25 > entry[1].bm25 or h.cosine > entry[1].cosine:
                    entry[1] = Hit(h.chunk, h.score, max(h.bm25, entry[1].bm25), max(h.cosine, entry[1].cosine))
        ranked = sorted(fused.values(), key=lambda e: -e[0])
        out, per_page_count = [], {}
        for score, h in ranked:
            page = h.chunk["page_url"]
            if per_page_count.get(page, 0) >= per_page:
                continue
            per_page_count[page] = per_page_count.get(page, 0) + 1
            out.append(Hit(h.chunk, score, h.bm25, h.cosine))
            if len(out) == k:
                break
        return out

    def _search(self, query: str, k: int, per_page: int, pool: int = 100, page_url: str = "") -> list[Hit]:
        q_tokens = self.expand(self.correct(tokenize(query)))
        bm25 = self.bm25.get_scores(q_tokens) if q_tokens else np.zeros(len(self.chunks))
        rankings = [np.argsort(-bm25)[:pool]]

        cosine = np.zeros(len(self.chunks))
        if self.model is not None:
            q = self.model.encode([query])[0]
            q = q / (np.linalg.norm(q) or 1.0)
            cosine = self.vectors @ q
            rankings.append(np.argsort(-cosine)[:pool])

        weights = [1.0, EMB_WEIGHT][: len(rankings)]
        # only "what is OLake / Fusion / the UI?" style questions: for "what is an incremental sync?"
        # the intro pages are the wrong answer (the boost would bury the real explanation)
        definition = bool(DEFINITION_Q.match(query)) and set(q_tokens) <= PRODUCT_WORDS
        if definition:
            # "what is X?" questions whose only content word is everywhere (e.g. "olake") never
            # surface the intro pages on their own, so rank intro/overview sections as a third list
            intro_idx = np.flatnonzero(self.intro)
            order = np.lexsort((-bm25[intro_idx], -cosine[intro_idx]))
            rankings.append(intro_idx[order][:pool])
            weights.append(1.0)

        # Reciprocal Rank Fusion: each list contributes weight/(k + rank)
        fused: dict[int, float] = {}
        for weight, ranking in zip(weights, rankings):
            for rank, idx in enumerate(ranking):
                fused[int(idx)] = fused.get(int(idx), 0.0) + weight / (RRF_K + rank + 1)

        # Heuristic rerank: title overlap, source trust, product hint
        q_set = set(q_tokens)
        wants_fusion = bool(q_set & FUSION_TERMS)
        scored = []
        for idx, s in fused.items():
            c = self.chunks[idx]
            title_matches = len(q_set & self.title_tokens[idx])
            title_overlap = title_matches / len(q_set) if q_set else 0.0
            s *= 1.0 + 0.6 * title_overlap + 0.15 * min(title_matches, 3)
            s *= SOURCE_WEIGHT.get(c["source_type"], 0.7)
            if wants_fusion and c["product"] == "fusion":
                s *= 1.2
            if definition and self.intro[idx]:
                s *= 1.6  # "what is X?" -> prefer intro/overview pages and "What is ..." sections
            if page_url and page_url in c["page_url"]:
                s *= 1.4  # user is viewing this page, boost related chunks

            # Exact topic intent boosts:
            # 1. Partitioning Iceberg tables
            if ("partition" in q_set or "partitioning" in q_set) and "iceberg" in q_set:
                if "/writers/iceberg/partitioning/" in c["page_url"]:
                    s *= 2.0
            # 2. Running CLI with Docker
            if ("cli" in q_set or "command" in q_set or "docker-cli" in q_set) and "docker" in q_set:
                if "/install/docker-cli/" in c["page_url"]:
                    s *= 2.0
            # 3. MongoDB snapshot / chunk options
            if ("mongo" in q_set or "mongodb" in q_set) and ("chunk" in q_set or "chunks" in q_set or "snapshot" in q_set or "split" in q_set or "splitvector" in q_set):
                if c["page_url"] == "https://olake.io/docs/connectors/mongodb/":
                    s *= 1.8
            # 4. MongoDB streaming / cdc / changes
            if ("mongo" in q_set or "mongodb" in q_set) and ("stream" in q_set or "streams" in q_set or "cdc" in q_set or "change" in q_set or "changes" in q_set or "oplog" in q_set):
                if "/connectors/mongodb/cdc_setup/" in c["page_url"] or c["page_url"] == "https://olake.io/docs/connectors/mongodb/":
                    s *= 1.8
            # 5. Benchmarks / speed comparison
            if ("fast" in q_set or "speed" in q_set or "benchmark" in q_set or "benchmarks" in q_set):
                if "/benchmarks/ingestion/" in c["page_url"] or "/dmsvsolake/" in c["page_url"]:
                    s *= 2.2
            scored.append((s, idx))
        scored.sort(reverse=True)

        hits, per_page_count = [], {}
        for s, idx in scored:
            page = self.chunks[idx]["page_url"]
            if per_page_count.get(page, 0) >= per_page:
                continue
            per_page_count[page] = per_page_count.get(page, 0) + 1
            hits.append(Hit(self.chunks[idx], s, float(bm25[idx]), float(cosine[idx])))
            if len(hits) == k:
                break
        return hits


    def multi_search(self, queries: list[str], k: int = 8, per_page: int = 2, page_url: str = "") -> list[Hit]:
        """Run each sub-query independently, merge results with RRF, return top-k.
        Used for compound questions where a single query can't bridge both topics."""
        if len(queries) == 1:
            return self._search(queries[0], k, per_page, pool=100, page_url=page_url)
        fused: dict[int, list] = {}
        pool_per_query = min(k + 5, 25)
        for query in queries:
            for rank, h in enumerate(self._search(query, k=pool_per_query, per_page=per_page, pool=100, page_url=page_url)):
                entry = fused.setdefault(h.chunk["id"], [0.0, h])
                entry[0] += 1.0 / (RRF_K + rank + 1)
                if h.bm25 > entry[1].bm25 or h.cosine > entry[1].cosine:
                    entry[1] = Hit(h.chunk, h.score, max(h.bm25, entry[1].bm25), max(h.cosine, entry[1].cosine))
        ranked = sorted(fused.values(), key=lambda e: -e[0])
        out, per_page_count = [], {}
        for score, h in ranked:
            page = h.chunk["page_url"]
            if per_page_count.get(page, 0) >= per_page:
                continue
            per_page_count[page] = per_page_count.get(page, 0) + 1
            out.append(Hit(h.chunk, score, h.bm25, h.cosine))
            if len(out) == k:
                break
        return out


if __name__ == "__main__":
    from dotenv import load_dotenv

    load_dotenv()
    index = SearchIndex()
    for hit in index.search(" ".join(sys.argv[1:])):
        print(f"{hit.score:.4f} bm25={hit.bm25:5.1f} cos={hit.cosine:.2f} [{hit.chunk['source_type']}] {hit.chunk['title']}\n        {hit.chunk['url']}")
