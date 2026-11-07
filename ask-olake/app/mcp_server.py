"""Ask OLake MCP server — exposes the documentation chatbot as an MCP tool.

Run as a stdio server (Cursor / VS Code):
    uv run python -m app.mcp_server

Configure Cursor: add to .cursor/mcp.json:
    {
      "mcpServers": {
        "ask-olake": {
          "command": "uv",
          "args": ["run", "--directory", "/path/to/olake-docs/ask-olake", "python", "-m", "app.mcp_server"],
          "env": { "OLAKE_API_URL": "https://ask.olake.io" }
        }
      }
    }

Configure VS Code (1.102+, GitHub Copilot required): add to .vscode/mcp.json:
    {
      "servers": {
        "ask-olake": {
          "type": "stdio",
          "command": "uv",
          "args": ["run", "--directory", "/path/to/olake-docs/ask-olake", "python", "-m", "app.mcp_server"],
          "env": { "OLAKE_API_URL": "https://ask.olake.io" }
        }
      }
    }

Environment variables:
    OLAKE_API_URL  Base URL of the running Ask OLake API (default: http://localhost:8000)
    OLAKE_TIMEOUT  Request timeout in seconds (default: 30)
"""

import asyncio
import os

import httpx
from mcp.server.mcpserver import MCPServer

_API_URL = os.getenv("OLAKE_API_URL", "http://localhost:8000").rstrip("/")
_TIMEOUT = float(os.getenv("OLAKE_TIMEOUT", "30"))

mcp = MCPServer(
    "ask-olake",
    instructions=(
        "Ask OLake answers questions about OLake — an open-source data ingestion tool for CDC "
        "and full-refresh replication from databases (Postgres, MySQL, MongoDB, Oracle, MSSQL, DB2) "
        "and Kafka to Apache Iceberg / Parquet. It also covers OLake Fusion (Iceberg table maintenance) "
        "and supported catalogs (Glue, Hive, REST, Nessie, Unity Catalog, Polaris, S3 Tables). "
        "Use search_olake_docs for any config, setup, connector, or troubleshooting question."
    ),
)


@mcp.tool(
    description=(
        "Search the OLake documentation and get a cited answer. "
        "Covers connectors (Postgres, MySQL, MongoDB, Oracle, Kafka, S3), "
        "Iceberg catalogs (Glue, Hive, REST, Nessie, Unity, Polaris, S3 Tables), "
        "sync modes (CDC, Full Refresh, Incremental), OLake Fusion compaction, "
        "Docker / Kubernetes / Helm setup, and config files (source.json, destination.json, streams.json)."
    )
)
async def search_olake_docs(question: str) -> str:
    """Ask a question about OLake and get a cited answer from the official documentation."""
    question = question.strip()
    if not question:
        return "No question provided."

    async with httpx.AsyncClient(timeout=_TIMEOUT) as client:
        try:
            resp = await client.post(
                f"{_API_URL}/ask",
                json={"question": question},
                headers={"Content-Type": "application/json"},
            )
            resp.raise_for_status()
            data = resp.json()
        except httpx.HTTPStatusError as e:
            return f"Ask OLake API error {e.response.status_code}: {e.response.text[:200]}"
        except Exception as e:
            return f"Could not reach Ask OLake API at {_API_URL}: {e}"

    answer = data.get("answer", "No answer returned.")
    citations = data.get("citations", [])
    sources = data.get("sources", [])

    parts = [answer]
    if citations:
        parts.append("\n\nSources:")
        seen: set[str] = set()
        for c in citations:
            url = c.get("section_url") or c.get("url", "")
            if url and url not in seen:
                seen.add(url)
                parts.append(f"  [{c.get('n', '?')}] {c.get('title', url)} — {url}")
    elif sources:
        parts.append("\n\nSources:")
        for url in sources:
            parts.append(f"  {url}")

    return "\n".join(parts)


if __name__ == "__main__":
    asyncio.run(mcp.run_stdio_async())
