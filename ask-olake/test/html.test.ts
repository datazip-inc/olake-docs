import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parsePage, type Section } from '../ingest/html.ts'

const title = (s: Section) => (s.heading ? `${s.pageTitle} > ${s.heading}` : s.pageTitle)

// A cut-down docs page in the shape Docusaurus writes it: minified, unquoted attributes.
const DOC_PAGE = `<!doctype html><html><head><title data-rh=true>OLake Postgres Connector | OLake</title>
<link data-rh=true rel=canonical href=https://olake.io/docs/connectors/postgres/ /></head><body>
<nav class=navbar><a href=/>Home</a></nav>
<nav class=theme-doc-breadcrumbs><ul class=breadcrumbs><li class=breadcrumbs__item><a aria-label="Home page" href=/></a>
<li class=breadcrumbs__item><span>Sources</span><li class="breadcrumbs__item breadcrumbs__item--active"><span>Postgres</span></ul></nav>
<div class="theme-doc-markdown markdown"><header><h1>Overview</h1></header>
<p>The connector supports   <strong>several</strong> sync modes &amp; resumes failed loads.</p>
<h2 class=anchor id=sync-modes>Sync Modes Supported<a href=#sync-modes class=hash-link aria-label="Direct link">​</a></h2>
<ul><li>Full Refresh</li><li>Full Refresh + CDC</li></ul>
<div class="theme-admonition theme-admonition-tip alert"><div class=admonitionHeading_Gvgb><span><svg viewBox="0 0 1 1"><path d=M0></path></svg></span>tip</div><div class=admonitionContent_BuS1><p>Use <code>pgoutput</code>.</p></div></div>
<h2 id=setup>Setup<a href=#setup class=hash-link>​</a></h2>
<div class="theme-tabs-container tabs-container"><ul role=tablist class=tabs><li role=tab aria-selected=true>OLake UI<li role=tab aria-selected=false>OLake CLI</ul>
<div class=margin-top--md><div role=tabpanel><p>Open the Sources page.</p></div><div role=tabpanel hidden><p>Create source.json.</p></div></div></div>
<h3 id=config>Config file<a href=#config class=hash-link>​</a></h3>
<div class="language-json theme-code-block"><div class=codeBlockContent><pre tabindex=0 class="prism-code language-json"><code><span class=token-line><span class=token>{</span></span><br><span class=token-line><span class=token>  "max_threads": 3</span></span><br><span class=token-line><span class=token>}</span></span><br></code></pre><button type=button aria-label=Copy>Copy</button></div></div>
<table><thead><tr><th>Key</th><th>Default</th></tr></thead><tbody><tr><td><code>max_threads</code></td><td>3</td></tr></tbody></table>
<h4>Notes</h4><p>Line one<br>line two</p>
</div><footer class=theme-doc-footer><a href=/edit>Edit this page</a></footer></body></html>`

test('reads the canonical URL and builds a title from the breadcrumbs and the h1', () => {
  const sections = parsePage(DOC_PAGE)
  assert.equal(sections[0].pageUrl, 'https://olake.io/docs/connectors/postgres/')
  assert.equal(sections[0].pageTitle, 'Sources / Postgres: Overview')
  assert.equal(sections[0].heading, '')
  assert.equal(sections[0].url, 'https://olake.io/docs/connectors/postgres/')
})

test('splits at h2 and h3, with the anchor in the URL and the heading path in the title', () => {
  const sections = parsePage(DOC_PAGE)
  assert.deepEqual(
    sections.map((s) => [title(s), s.url.split('#')[1] ?? '']),
    [
      ['Sources / Postgres: Overview', ''],
      ['Sources / Postgres: Overview > Sync Modes Supported', 'sync-modes'],
      ['Sources / Postgres: Overview > Setup', 'setup'],
      ['Sources / Postgres: Overview > Setup > Config file', 'config']
    ]
  )
})

test('keeps prose readable: entities decoded, whitespace collapsed, no link icons or nav text', () => {
  const [intro] = parsePage(DOC_PAGE)
  assert.equal(intro.text, 'The connector supports **several** sync modes & resumes failed loads.')
  const all = parsePage(DOC_PAGE)
    .map((s) => s.text)
    .join('\n')
  assert.ok(!all.includes('Edit this page') && !all.includes('Home') && !all.includes('​'))
  assert.ok(!all.includes('Copy'), 'the code block copy button is not content')
})

test('renders lists, admonitions and inline code', () => {
  const modes = parsePage(DOC_PAGE)[1].text
  assert.equal(modes, '- Full Refresh\n- Full Refresh + CDC\n\n**Tip:** Use `pgoutput`.')
})

test('labels every tab panel, including the hidden ones', () => {
  const setup = parsePage(DOC_PAGE)[2].text
  assert.equal(
    setup,
    '**OLake UI:**\n\nOpen the Sources page.\n\n**OLake CLI:**\n\nCreate source.json.'
  )
})

test('renders code blocks line by line, tables as Markdown tables, h4 as bold, br as a newline', () => {
  const config = parsePage(DOC_PAGE)[3].text
  assert.equal(
    config,
    [
      '```json\n{\n  "max_threads": 3\n}\n```',
      '| Key | Default |\n| --- | --- |\n| `max_threads` | 3 |',
      '**Notes**',
      'Line one\nline two'
    ].join('\n\n')
  )
})

const BLOG_PAGE = `<html><head><title>Deep dive into OLake Go | OLake</title><link rel=canonical href=https://olake.io/blog/deep-dive/></head>
<body><article class=ob-post><header><h1>Deep dive into OLake Go</h1><span>12 min read</span></header>
<nav class=ob-toc><a href=#a>Why</a></nav>
<div id=__blog-post-container class=markdown><p><img src=/x.webp alt="cover"></p><p>Intro text.</p>
<h2 id=a>Why</h2><p>Because.</p></div></article></body></html>`

test('reads blog posts: title from the h1, content from the post container only', () => {
  const sections = parsePage(BLOG_PAGE)
  assert.deepEqual(
    sections.map((s) => [title(s), s.url, s.text]),
    [
      ['Deep dive into OLake Go', 'https://olake.io/blog/deep-dive/', 'Intro text.'],
      ['Deep dive into OLake Go > Why', 'https://olake.io/blog/deep-dive/#a', 'Because.']
    ]
  )
})

test('skips pages that must not be indexed', () => {
  const noindex = DOC_PAGE.replace(
    '<link data-rh',
    '<meta name=robots content="noindex, nofollow"><link data-rh'
  )
  assert.deepEqual(parsePage(noindex), [])
  const redirect =
    '<html><head><meta http-equiv="refresh" content="0; url=/docs/x/"><link rel="canonical" href="/docs/x/" /></head></html>'
  assert.deepEqual(parsePage(redirect), [], 'a redirect stub has no content container')
  const listPage =
    '<html><head><link rel=canonical href=https://olake.io/blog/></head><body><article class=ob-card><h2>Post</h2></article></body></html>'
  assert.deepEqual(parsePage(listPage), [], 'a list of posts is not a post')
  assert.deepEqual(
    parsePage(DOC_PAGE.replace(/<link[^>]*canonical[^>]*>/, '')),
    [],
    'no canonical URL'
  )
})

test('drops sections that have a heading but no text', () => {
  const html = BLOG_PAGE.replace(
    '<p>Because.</p>',
    '<h2 id=b>Empty</h2><h2 id=c>Next</h2><p>Text.</p>'
  )
  assert.deepEqual(
    parsePage(html).map((s) => s.url.split('#')[1] ?? ''),
    ['', 'c']
  )
})

test('reads a page whose breadcrumb is only the home link and the page itself', () => {
  // `<a href=/>` is an unquoted attribute, not a self-closing tag.
  const html = `<html><head><link rel=canonical href=https://olake.io/docs/install/ /></head><body><article>
<nav><ul class=breadcrumbs><li class=breadcrumbs__item><a aria-label="Home page" href=/><svg></svg></a><li class=breadcrumbs__item><span>Install</span></ul></nav>
<div class="theme-doc-markdown markdown"><header><h1>Install</h1></header><p>Run the image.</p></div></article></body></html>`
  assert.deepEqual(
    parsePage(html).map((s) => [title(s), s.text]),
    [['Install', 'Run the image.']]
  )
})

test('keeps a tab group nested in a tab panel with its own labels', () => {
  const tabs = (labels: string[], panels: string[]) =>
    `<div class=tabs-container><ul role=tablist>${labels.map((l) => `<li role=tab>${l}`).join('')}</ul>` +
    `<div>${panels.map((p) => `<div role=tabpanel>${p}</div>`).join('')}</div></div>`
  const html = BLOG_PAGE.replace(
    '<p>Because.</p>',
    tabs(
      ['UI', 'CLI'],
      ['<p>Click.</p>', tabs(['Docker', 'Binary'], ['<p>Pull.</p>', '<p>Download.</p>'])]
    )
  )
  assert.equal(
    parsePage(html)[1].text,
    '**UI:**\n\nClick.\n\n**CLI:**\n\n**Docker:**\n\nPull.\n\n**Binary:**\n\nDownload.'
  )
})

test('indents a code block under its list item, and keeps code in a table cell on the row', () => {
  const pre =
    '<pre class="prism-code language-sql"><code><span class=token-line>SELECT 1;</span><br><span class=token-line>SELECT 2;</span><br></code></pre>'
  const body = `<ol><li><p>Run:</p><div class=olake-code><div class=olake-code__header><span class=olake-code__lang>sql</span></div>${pre}</div></li><li>Done</li></ol>
<table><tr><th>Key</th><th>Example</th></tr><tr><td>q</td><td>${pre}</td></tr></table>`
  assert.equal(
    parsePage(BLOG_PAGE.replace('<p>Because.</p>', body))[1].text,
    '- Run:\n  ```sql\n  SELECT 1;\n  SELECT 2;\n  ```\n- Done\n\n| Key | Example |\n| --- | --- |\n| q | `SELECT 1; SELECT 2;` |'
  )
})

test('leaves out call-to-action cards and empty tab panels', () => {
  const body = `<p>Because.</p><aside class="not-prose my-10"><p>Try it</p><a href=/q>Quickstart</a></aside>
<div class=tabs-container><ul role=tablist><li role=tab>UI<li role=tab>CLI</ul><div><div role=tabpanel><p>Click.</p></div><div role=tabpanel></div></div></div>
<aside class=olake-how-tested><p>Run on Postgres 16.</p></aside>`
  assert.equal(
    parsePage(BLOG_PAGE.replace('<p>Because.</p>', body))[1].text,
    'Because.\n\n**UI:**\n\nClick.\n\nRun on Postgres 16.'
  )
})

test('indents a nested list under its item', () => {
  const body =
    '<ul><li>Sources<ul><li>Postgres</li><li>MySQL<ul><li>8.0</li></ul></li></ul></li><li>Destinations</li></ul>'
  assert.equal(
    parsePage(BLOG_PAGE.replace('<p>Because.</p>', body))[1].text,
    '- Sources\n  - Postgres\n  - MySQL\n    - 8.0\n- Destinations'
  )
})

test('does not repeat the breadcrumb in the title when the h1 starts with it', () => {
  const page = (h1: string) =>
    parsePage(DOC_PAGE.replace('<h1>Overview</h1>', `<h1>${h1}</h1>`))[0].pageTitle
  assert.equal(page('Postgres to ClickHouse'), 'Sources / Postgres to ClickHouse')
  assert.equal(page('postgres'), 'Sources / postgres')
})

test('names a page without an h1 by its <title>', () => {
  const [intro] = parsePage(BLOG_PAGE.replace('<h1>Deep dive into OLake Go</h1>', ''))
  assert.equal(intro.pageTitle, 'Deep dive into OLake Go')
  assert.equal(intro.text, 'Intro text.')
})
