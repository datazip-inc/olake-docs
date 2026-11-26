import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { Env } from '../src/guard.ts'
import { mcp } from '../src/mcp.ts'
import { testDb } from './helpers.ts'

const newEnv = (limit = async (_: { key: string }) => ({ success: true })) =>
  ({
    DB: testDb([
      { url: 'https://olake.io/docs/mysql/#cdc', title: 'MySQL > CDC', text: 'Enable the binlog.' }
    ]),
    RATE_LIMIT: { limit }
  }) as unknown as Env
const send = async (message: unknown, env = newEnv()) => {
  const response = await mcp(
    new Request('https://api.test/mcp', {
      method: 'POST',
      headers: { 'CF-Connecting-IP': '203.0.113.7' },
      body: typeof message === 'string' ? message : JSON.stringify(message)
    }),
    env
  )
  return {
    status: response.status,
    body: response.status === 202 ? null : ((await response.json()) as any)
  }
}
const call = (query: unknown, name = 'search_olake_docs') => ({
  jsonrpc: '2.0',
  id: 7,
  method: 'tools/call',
  params: { name, arguments: { query } }
})

test('greets a client, in its protocol version when the server knows it', async () => {
  const init = (protocolVersion: string) =>
    send({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion } })
  const { status, body } = await init('2025-03-26')
  assert.equal(status, 200)
  assert.deepEqual(body, {
    jsonrpc: '2.0',
    id: 1,
    result: {
      protocolVersion: '2025-03-26',
      capabilities: { tools: {} },
      serverInfo: { name: 'ask-olake', title: 'OLake docs', version: '1.0.0' }
    }
  })
  assert.equal((await init('2099-01-01')).body.result.protocolVersion, '2025-06-18')
  assert.equal((await send({ jsonrpc: '2.0', method: 'notifications/initialized' })).status, 202)
  assert.deepEqual((await send({ jsonrpc: '2.0', id: 2, method: 'ping' })).body.result, {})
})

test('lists its one tool, with the schema of its input', async () => {
  const { body } = await send({ jsonrpc: '2.0', id: 3, method: 'tools/list' })
  assert.deepEqual(
    body.result.tools.map((tool: any) => [tool.name, tool.inputSchema.required]),
    [['search_olake_docs', ['query']]]
  )
})

test('searches the docs and returns the sections with their links, without a model call', async () => {
  const { body } = await send(call('how do I enable the binlog?'))
  assert.deepEqual(body, {
    jsonrpc: '2.0',
    id: 7,
    result: {
      content: [
        {
          type: 'text',
          text: '## MySQL > CDC\nhttps://olake.io/docs/mysql/#cdc\n\nEnable the binlog.'
        }
      ],
      isError: false
    }
  })
  const nothing = await send(call('kubernetes autoscaling'))
  assert.equal(nothing.body.result.content[0].text, 'Nothing in the OLake docs matches this query.')
})

test('limits how fast one caller searches', async () => {
  const keys: string[] = []
  const env = newEnv(async ({ key }) => ({ success: keys.push(key) < 2 }))
  assert.equal((await send(call('binlog'), env)).body.result.isError, false)
  const second = (await send(call('binlog'), env)).body.result
  assert.deepEqual([second.isError, keys], [true, ['mcp:203.0.113.7', 'mcp:203.0.113.7']])
})

test('refuses what is not a request it knows', async () => {
  assert.equal((await send(call('binlog', 'other_tool'))).body.error.code, -32602)
  assert.equal((await send(call(''))).body.error.code, -32602)
  assert.equal((await send(call(5))).body.error.code, -32602)
  assert.equal(
    (await send({ jsonrpc: '2.0', id: 9, method: 'resources/list' })).body.error.code,
    -32601
  )
  for (const bad of ['not json{', [{ jsonrpc: '2.0', id: 1, method: 'ping' }], { id: 1 }]) {
    const { status, body } = await send(bad)
    assert.deepEqual([status, body.error.code], [400, -32600])
  }
  const get = await mcp(new Request('https://api.test/mcp'), newEnv())
  assert.equal(get.status, 405)
})
