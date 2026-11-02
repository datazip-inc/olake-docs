#!/usr/bin/env node
/**
 * Creates a new integration page from the pairs matrix, with TODO markers where the page's own
 * copy goes. It refuses to overwrite an existing page.
 *
 *   node scripts/integrations/scaffold.mjs <source> <engine>
 *
 * The pair must already exist in src/data/integrations/pairs.ts. Needs Node 23.6 or later.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { register } from 'node:module'

// Node prints experimental-feature warnings for the TypeScript imports; they are noise here.
process.emitWarning = () => {}
register('./_hooks.mjs', import.meta.url)

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const [sourceId, engineId] = process.argv.slice(2)
if (!sourceId || !engineId) {
  console.error('usage: node scripts/integrations/scaffold.mjs <source> <engine>')
  process.exit(2)
}

const { SOURCES, ENGINES, CATALOGS, PAIRS } = await import('../../src/data/integrations/index.ts')
const source = SOURCES[sourceId]
const engine = ENGINES[engineId]
const pair = PAIRS.find((p) => p.source === sourceId && p.engine === engineId)
if (!source || !engine) {
  console.error(`unknown source or engine: ${sourceId} -> ${engineId}`)
  process.exit(2)
}
if (!pair) {
  console.error(`add { source: '${sourceId}', engine: '${engineId}', ... } to src/data/integrations/pairs.ts first`)
  process.exit(2)
}
const file = path.join(ROOT, 'docs', 'integrations', `${pair.slug}.mdx`)
if (fs.existsSync(file)) {
  console.error(`${path.relative(ROOT, file)} already exists; edit it instead`)
  process.exit(2)
}

const catalogTabs = (partialKind) =>
  pair.catalogs
    .map((c) => `<TabItem value="${c}">\n\n<I.Partial id="catalogs/${c}/${partialKind}" />\n\n</TabItem>`)
    .join('\n')

const page = `---
title: "${source.label} to ${engine.label}: CDC via Apache Iceberg"
description: "TODO: 120 to 160 characters, unique on the site, containing \\"${source.label.toLowerCase()} to ${engine.label.toLowerCase()}\\"."
sidebar_label: ${source.label} to ${engine.label}
keywords:
  - ${source.label.toLowerCase()} to ${engine.label.toLowerCase()}
unlisted: true
integration:
  source: ${sourceId}
  engine: ${engineId}
  catalogs: [${pair.catalogs.join(', ')}]
  default: ${pair.defaultCatalog}
  author: TODO
  reviewer: TODO
  tested:
    date: "TODO: YYYY-MM-DD"
    olake: TODO
    catalogs: [${pair.tested.join(', ')}]
    engines:
      - "TODO: ${engine.label} version"
    summary: "TODO: what the run did, in one sentence."
  faq:
    - q: "TODO: a question people actually search, word for word"
      a: "TODO: a self-contained answer that names OLake Go once."
---

import * as I from '@site/src/components/integrations';

TODO: two or three sentences that answer the query. Name the default catalog and, if the page offers a second catalog, say where the files sit with each.

<I.IntegrationByline />

<TLDR title='Key takeaways'>

- TODO: three highlight bullets, no caveats. What lands where, what you query it with, which other engines read the same tables.

</TLDR>

**The short answer.** TODO: 40 to 60 words an assistant can quote whole for "how do I sync ${source.label.toLowerCase()} to ${engine.label.toLowerCase()}". Say the historical snapshot runs first and the change stream follows on its own.

## How ${source.label} ${source.cdc ? 'CDC' : 'data'} reaches ${engine.label} here

TODO: a mermaid diagram of the real flow (source log or cursor, OLake Go writer, catalog: credentials then upload then commit, readers). Then one paragraph on the snapshot-then-changes order and one on the single source-side thing to watch.

## What you need

- **TODO** bold the main points.

## Step 1: Prepare ${source.label} for ${source.cdc ? 'CDC' : 'incremental sync'}

<details>
<summary>The two sample tables used on this page</summary>

TODO: the sample schema in ${source.label}'s dialect, with "then insert whatever you like".

</details>

<I.Partial id="sources/${sourceId}/prereqs" tables="customers, orders" />

## Step 2: Set up the catalog in ${engine.label}

TODO: two short paragraphs: what each offered catalog means for ${engine.label} (where files sit, whether a refresh is needed) and which one this page uses.

<I.CatalogStrip />

<I.CatalogTabs>
${catalogTabs('setup')}
</I.CatalogTabs>

## Step 3: Connect ${source.label} to OLake Go

<I.Partial id="sources/${sourceId}/connect">

TODO: one sentence on the source form from the run, then the source form figure and the test dialog figure (they render in the OLake UI tab only).

</I.Partial>

## Step 4: Configure the Iceberg destination

<I.CatalogTabs>
${catalogTabs('writer')}
</I.CatalogTabs>

## Step 5: Create the job and run the first sync

<I.Partial id="jobs/create" engines="${engine.label}" upsert="TODO: the upsert type OLake Go resolved" updateType="${engine.recommendedDelete}">

TODO: one sentence on the target query engines, then the job form, streams and job history figures.

</I.Partial>

TODO: the first run's numbers (rows, seconds) and how the destination schema was named.

## Step 6: Query the tables in ${engine.label}

<I.CatalogTabs>
${pair.catalogs.map((c) => `<TabItem value="${c}">\n\n<I.Partial id="engines/${engineId}/query-${c}" />\n\n</TabItem>`).join('\n')}
</I.CatalogTabs>

<I.Cta />

## Step 7: Change rows in ${source.label} and sync again

TODO: the 12 changes, the second run's numbers and the commit report line from the log, the engine screenshot after the change sync, one short "Schema changes" paragraph.

## Query the same tables from other engines

TODO: one tab per engine in alsoRead (groupId="engine"), each with its connect partial and a figure, then the roll-up that matched.

## Data types: ${source.label} to Iceberg to ${engine.label}

TODO: only if something is lossy for this pair; say OLake Go made the mapping.

## Cost and maintenance

TODO

## Troubleshooting

TODO: three or four failures with the exact error text and the fix.

<details>
<summary>How this compares with other ways to move ${source.label} data to ${engine.label}</summary>

TODO: a 5 row table (native path, Debezium and Kafka, managed ELT, manual export, OLake Go). Columns: freshness, updates and deletes, where the data lands, what you run. Competitor facts only from their docs, no prices.

</details>

## When not to use this

TODO: hard limits only.

## FAQs

<I.IntegrationFaq />

<I.HowWeTested />

## Related guides

<I.RelatedIntegrations />

<I.IntegrationJsonLd />

<I.Cta />
`

fs.mkdirSync(path.dirname(file), { recursive: true })
fs.writeFileSync(file, page)
console.log(`wrote ${path.relative(ROOT, file)}; fill every TODO, then run node scripts/integrations/check.mjs`)
