// Reads the issues of a repository from GitHub: what users reported, and what was answered.
// They let the bot say whether a problem is known, and what fixed it.

import type { Section } from './html.ts'

type Issue = {
  number: number
  title: string
  state: string
  html_url: string
  body: string | null
  labels: Array<{ name: string }>
  pull_request?: unknown
}
type Comment = { issue_url: string; body: string | null; user: { type: string } | null }

// A long log or stack trace is cut: its first lines are what a search matches.
const MAX_BODY_CHARS = 3000
const MAX_COMMENT_CHARS = 1500
const MAX_COMMENTS = 6
// HTML comments (issue templates are full of them), tags, and images.
const NOT_TEXT = /<!--[\s\S]*?-->|<\/?[a-z][^>]*>|!\[[^\]]*\]\([^)]*\)/gi
const clean = (text: string | null, limit: number) =>
  (text ?? '')
    .replace(NOT_TEXT, '')
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, limit)

/** One issue as a section: its state and labels, the report, then the replies. */
export function issueSection(repo: string, issue: Issue, replies: string[]): Section {
  const labels = issue.labels.map((label) => label.name).join(', ')
  const parts = [
    `GitHub issue, ${issue.state}${labels ? `. Labels: ${labels}` : ''}.`,
    clean(issue.body, MAX_BODY_CHARS),
    ...replies.slice(0, MAX_COMMENTS).map((reply) => `**Reply:** ${reply}`)
  ]
  return {
    pageUrl: issue.html_url,
    url: issue.html_url,
    // The state is in the title, which every part of a long issue carries.
    pageTitle: `${repo} issue #${issue.number} (${issue.state}): ${issue.title}`,
    heading: '',
    text: parts.filter(Boolean).join('\n\n')
  }
}

/** Every page of a GitHub list. */
async function all<T>(path: string, token?: string): Promise<T[]> {
  const items: T[] = []
  for (let page = 1; ; page++) {
    const response = await fetch(`https://api.github.com${path}&per_page=100&page=${page}`, {
      headers: {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'ask-olake-index',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      signal: AbortSignal.timeout(60_000)
    })
    if (!response.ok) throw new Error(`GitHub answered ${response.status} for ${path}`)
    const batch = (await response.json()) as T[]
    items.push(...batch)
    if (batch.length < 100) return items
  }
}

/**
 * The issues of a repository, open and closed, each with its replies. Pull requests are left
 * out (GitHub lists them as issues), and so are the comments of bots.
 * @param repo owner and name, as in "datazip-inc/olake-go"
 */
export async function readIssues(repo: string, token?: string): Promise<Section[]> {
  const [issues, comments] = await Promise.all([
    all<Issue>(`/repos/${repo}/issues?state=all`, token),
    all<Comment>(`/repos/${repo}/issues/comments?sort=created`, token)
  ])
  const replies = new Map<string, string[]>()
  for (const comment of comments) {
    const text = comment.user?.type === 'Bot' ? '' : clean(comment.body, MAX_COMMENT_CHARS)
    const number = comment.issue_url.slice(comment.issue_url.lastIndexOf('/') + 1)
    if (text) replies.set(number, [...(replies.get(number) ?? []), text])
  }
  const name = repo.slice(repo.lastIndexOf('/') + 1)
  return issues
    .filter((issue) => !issue.pull_request)
    .map((issue) => issueSection(name, issue, replies.get(String(issue.number)) ?? []))
}
