// An MCP server, so that coding agents (Cursor, Claude Code, VS Code) can search the OLake docs.
// It has one tool and makes no model call: the agent gets the sections that match its query and
// writes its own answer. The transport is MCP's "streamable HTTP" without sessions: every request
// is one JSON-RPC message and gets one JSON answer.

import { MAX_QUESTION_CHARS, parse, readBody, type Env } from './guard.ts'
import { redactSecrets } from './redact.ts'
import { search } from './search.ts'

// The protocol versions this server has been written against. The newest is last.
const VERSIONS = ['2024-11-05', '2025-03-26', '2025-06-18']
const RESULTS = 6

const TOOL = {
  name: 'search_olake_docs',
  title: 'Search the OLake docs',
  description:
    'Searches the OLake documentation (olake.io and the docs of the OLake Go, OLake UI, OLake Helm and OLake Fusion repositories) and returns the sections that match best, each with its title and link. Use it for questions about setting up sources and CDC, Iceberg catalogs and destinations, configuration fields, installation, errors, and OLake Fusion table maintenance.',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'What to look for, as a question or as keywords.' }
    },
    required: ['query']
  }
}

type Message = {
  id?: string | number
  method?: unknown
  params?: { protocolVersion?: unknown; name?: unknown; arguments?: { query?: unknown } }
}

export async function mcp(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST')
    return new Response(null, { status: 405, headers: { Allow: 'POST' } })
  const message = parse((await readBody(request)) ?? '') as Message | null
  const answer = (body: object, status = 200) =>
    Response.json({ jsonrpc: '2.0', id: message?.id ?? null, ...body }, { status })
  const refuse = (code: number, text: string, status = 200) =>
    answer({ error: { code, message: text } }, status)
  if (!message || Array.isArray(message) || typeof message.method !== 'string')
    return refuse(-32600, 'Send one JSON-RPC request.', 400)
  // A message without an id is a notification ("initialized", "cancelled"): nothing to answer.
  if (message.id === undefined) return new Response(null, { status: 202 })

  switch (message.method) {
    case 'initialize': {
      const asked = message.params?.protocolVersion
      return answer({
        result: {
          protocolVersion: VERSIONS.includes(asked as string) ? asked : VERSIONS.at(-1),
          capabilities: { tools: {} },
          serverInfo: { name: 'ask-olake', title: 'OLake docs', version: '1.0.0' }
        }
      })
    }
    case 'ping':
      return answer({ result: {} })
    case 'tools/list':
      return answer({ result: { tools: [TOOL] } })
    case 'tools/call': {
      const query = message.params?.arguments?.query
      if (message.params?.name !== TOOL.name) return refuse(-32602, 'Unknown tool.')
      if (typeof query !== 'string' || !query.trim()) return refuse(-32602, 'Give a query.')
      const said = (text: string, isError = false) =>
        answer({ result: { content: [{ type: 'text', text }], isError } })
      const visitor = request.headers.get('CF-Connecting-IP') ?? 'unknown'
      if (!(await env.RATE_LIMIT.limit({ key: `mcp:${visitor}` })).success)
        return said('Too many searches. Wait a minute and try again.', true)
      const hits = await search(env, redactSecrets(query.slice(0, MAX_QUESTION_CHARS)), {
        limit: RESULTS
      })
      return said(
        hits.map((hit) => `## ${hit.title}\n${hit.url}\n\n${hit.text}`).join('\n\n---\n\n') ||
          'Nothing in the OLake docs matches this query.'
      )
    }
    default:
      return refuse(-32601, 'Method not found.')
  }
}
