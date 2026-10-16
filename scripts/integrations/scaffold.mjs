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
seo_title: "${source.label} to ${engine.label}: CDC via Apache Iceberg"
description: "TODO: 120 to 160 characters, unique on the site, containing \\"${source.label.toLowerCase()} to ${engine.label.toLowerCase()}\\"."
sidebar_label: ${engine.label}
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

TODO: two or three sentences that answer the query. Name the catalog and say why ${engine.label} can read the result.

<TLDR title='Key takeaways'>

- TODO: four to six bullets that each stand alone.

</TLDR>

**The short answer.** TODO: 40 to 60 words an assistant can quote whole for "how do I sync ${source.label.toLowerCase()} to ${engine.label.toLowerCase()}".

## Ways to move ${source.label} data to ${engine.label}

TODO: a 4 to 6 row table: the vendor's native path, Debezium and Kafka, managed ELT, manual export, and OLake Go to Iceberg. Columns: freshness, deletes, open format, what you run, cost model, where it falls short.

## How ${source.label} CDC reaches ${engine.label} here

TODO: a mermaid diagram of the mechanism, then the two or three source-side traps that matter for ${source.label}.

## What you need

TODO

## Step 1: Prepare ${source.label} for CDC

<I.Partial id="sources/${sourceId}/prereqs" />

## Step 2: Choose the catalog

TODO: one paragraph on why the catalog matters for ${engine.label}.

<I.CatalogStrip />

<I.CatalogTabs>
${catalogTabs('setup')}
</I.CatalogTabs>

## Step 3: Connect ${source.label} to OLake Go

<I.Partial id="sources/${sourceId}/connect" />

## Step 4: Configure the Iceberg destination

<I.CatalogTabs>
${catalogTabs('writer')}
</I.CatalogTabs>

## Step 5: Create the job and run the first sync

<I.Partial id="jobs/create" engines="${engine.label}" upsert="${CATALOGS[pair.defaultCatalog] ? '' : ''}TODO" updateType="${engine.recommendedDelete}" />

TODO: screenshots and the numbers from the real first run.

## Step 6: Query the tables in ${engine.label}

<I.CatalogTabs>
${pair.catalogs.map((c) => `<TabItem value="${c}">\n\n<I.Partial id="engines/${engineId}/query-${c}" />\n\n</TabItem>`).join('\n')}
</I.CatalogTabs>

## Updates and deletes: what ${engine.label} can read

<I.DeleteFormatTable engines={[${pair.alsoRead.map((e) => `'${e}'`).join(', ')}]} />

TODO: the change run, with the commit numbers from the log.

## Data types: ${source.label} to Iceberg to ${engine.label}

TODO: only if something is lossy for this pair.

## Cost and maintenance

TODO

## Troubleshooting

TODO: three or four failures with the exact error text and the fix.

## Read the same tables from other engines

TODO: one tab per engine in alsoRead.

## When not to use this

TODO

## FAQs

<I.IntegrationFaq />

<I.HowWeTested />

## Related guides

<I.RelatedIntegrations />

<I.IntegrationJsonLd />

<BlogCTA />

<I.IntegrationByline />
`

fs.mkdirSync(path.dirname(file), { recursive: true })
fs.writeFileSync(file, page)
console.log(`wrote ${path.relative(ROOT, file)}; fill every TODO, then run node scripts/integrations/check.mjs`)
