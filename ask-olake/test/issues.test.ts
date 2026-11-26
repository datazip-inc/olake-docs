import assert from 'node:assert/strict'
import { afterEach, mock, test } from 'node:test'
import { issueSection, readIssues } from '../ingest/issues.ts'

afterEach(() => mock.restoreAll())

const issue = (number: number, fields: object = {}) => ({
  number,
  title: `Issue ${number}`,
  state: 'open',
  html_url: `https://github.com/datazip-inc/demo/issues/${number}`,
  body: 'It fails.',
  labels: [],
  ...fields
})

test('writes an issue as its state and labels, the report, then the replies', () => {
  const section = issueSection(
    'demo',
    issue(7, {
      title: 'CDC stops on MariaDB',
      state: 'closed',
      labels: [{ name: 'bug' }, { name: 'mysql' }],
      body:
        '<!-- describe the bug -->\r\n### What happened\r\n\r\n\r\n\r\nERROR 1236 ![shot](x.png)\n' +
        'x'.repeat(4000)
    }),
    ['Fixed in v0.12.0.', 'Thanks!']
  )
  assert.equal(section.pageTitle, 'demo issue #7 (closed): CDC stops on MariaDB')
  assert.equal(section.url, 'https://github.com/datazip-inc/demo/issues/7')
  assert.ok(
    section.text.startsWith(
      'GitHub issue, closed. Labels: bug, mysql.\n\n### What happened\n\nERROR 1236 \nxxx'
    )
  )
  assert.ok(section.text.endsWith('x\n\n**Reply:** Fixed in v0.12.0.\n\n**Reply:** Thanks!'))
  assert.ok(section.text.length < 3200, 'a long report is cut')
  assert.equal(issueSection('demo', issue(8, { body: null }), []).text, 'GitHub issue, open.')
})

test('reads every page of issues and replies, without pull requests and bot comments', async () => {
  const asked: string[] = []
  mock.method(globalThis, 'fetch', async (url: string, init: RequestInit) => {
    asked.push(url.replace('https://api.github.com', ''))
    assert.equal((init.headers as Record<string, string>).Authorization, 'Bearer gh-token')
    const page = Number(/&page=(\d+)/.exec(url)![1])
    if (url.includes('/issues/comments'))
      return Response.json([
        {
          issue_url: 'https://api.github.com/repos/datazip-inc/demo/issues/1',
          body: 'First reply.',
          user: { type: 'User' }
        },
        {
          issue_url: 'https://api.github.com/repos/datazip-inc/demo/issues/1',
          body: 'Stale.',
          user: { type: 'Bot' }
        },
        {
          issue_url: 'https://api.github.com/repos/datazip-inc/demo/issues/1',
          body: 'Second reply.',
          user: { type: 'User' }
        },
        {
          issue_url: 'https://api.github.com/repos/datazip-inc/demo/issues/999',
          body: 'On a pull request.',
          user: null
        }
      ])
    // 100 issues on the first page, 2 on the second.
    return Response.json(
      page === 1
        ? Array.from({ length: 100 }, (_, i) => issue(i + 1, i === 1 ? { pull_request: {} } : {}))
        : [issue(101), issue(102)]
    )
  })
  const sections = await readIssues('datazip-inc/demo', 'gh-token')
  assert.equal(sections.length, 101, '102 issues, one of them a pull request')
  assert.equal(
    sections[0].text,
    'GitHub issue, open.\n\nIt fails.\n\n**Reply:** First reply.\n\n**Reply:** Second reply.'
  )
  assert.equal(sections[1].pageTitle, 'demo issue #3 (open): Issue 3')
  assert.deepEqual(asked.sort(), [
    '/repos/datazip-inc/demo/issues/comments?sort=created&per_page=100&page=1',
    '/repos/datazip-inc/demo/issues?state=all&per_page=100&page=1',
    '/repos/datazip-inc/demo/issues?state=all&per_page=100&page=2'
  ])
})

test('fails the build when GitHub refuses, so a half-read index never goes live', async () => {
  mock.method(globalThis, 'fetch', async () => new Response('rate limited', { status: 403 }))
  await assert.rejects(readIssues('datazip-inc/demo'), /GitHub answered 403/)
})
