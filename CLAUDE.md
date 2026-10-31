# olake-docs

Docusaurus site for olake.io (docs, blog, `/compare`, `/learn`, customer stories). See `SOP.md` for the full procedures.

## Vendor claims in `/compare` and `/learn` posts

- Every price, plan, limit or licence claim that comes from a vendor's page links that page and ends with `(checked Oct 2026)` (three-letter month and year of the check) right after the link. Under tables with unlinked cells, a `Sources: ... (checked Oct 2026)` line does the same job. See `SOP.md` section 5.7.
- A claim about what a competitor does not support or limits always links the page that shows it, or is cut.
- No screenshots of other vendors' pages. Use dated text with a link. Our own diagrams and screenshots of OLake's UI or docs are fine.
- Review-site quotes: opinions and cost experience only, one positive and one negative per tool or none, with date and link.
- Folders in scope: `compare/` and `learn/`.
- Run `/refresh-vendor-claims` before publishing a new comparison post and at the start of each month (a monthly issue reminds the owner; the skill runs locally and opens the PR).

Local checks are `npm run lint:content`, `npm run typecheck` and a `CI=true` build. Commit and push only when asked.

## Integration ("X to Y") pages: docs/integrations/

One page per (source, query engine) pair, each backed by a pipeline that was actually run. The data layer and shared blocks keep the pages consistent; the page itself holds only what is unique to the pair.

- **Matrix:** `src/data/integrations/pairs.ts`. Add the pair there first, then `node scripts/integrations/scaffold.mjs <source> <engine>`. Never add a page without a pair.
- **Facts:** `src/data/integrations/{sources,catalogs,engines,people}.ts`. Engine facts (catalogs read, delete formats, versions) carry the vendor page and the check date. Fix facts there, never inline on a page.
- **Shared blocks:** `docs/shared/integrations/**` (source prerequisites and connection steps, catalog setup and writer config, job creation, engine connection and query snippets), registered in `docs/shared/integrations/registry.ts` and rendered with `<I.Partial id="..." />`. Partials have no front matter and no H1.
- **Components:** `src/components/integrations/` (byline, "How we tested this", compatibility strip, delete-format table, catalog tabs, FAQ with FAQPage JSON-LD, HowTo JSON-LD, related links). They read the page's `integration:` front matter; the body never repeats it.
- **Unique per page:** front matter (title 52 characters or fewer with the search query first, which with " | OLake" keeps the `<title>` under 60; `seo_title` only if it is also 52 or fewer; a unique 120 to 155 character description, `keywords`, `image` cover, the `integration` block with author, reviewer, tested run and FAQ), the intro and short answer, the mechanism section with a mermaid diagram, the per-pair gotchas, data types, cost, troubleshooting with real error text, the collapsed comparison table, "when not to use this", and the screenshots from the run.
- **Reader first:** the page gets someone from setup to a query result with as little reading as possible. Key takeaways hold three highlights, never caveats. Decisions OLake Go makes for the user (delete format from the target query engines, schema naming) are stated as done, not as things to pick. Comparisons with other tools sit in a collapsed `<details>` after troubleshooting. Features on the roadmap are not listed as missing.
- **Partials take children:** figures that belong to the UI flow go inside the partial (`<I.Partial id="...">` ... `</I.Partial>`), which renders them in the OLake UI tab, so the CLI tab never shows UI screenshots.
- **Navigation:** every page lives under Integrations, then its query engine, in the main docs sidebar (`sidebars.js`, the collapsible Integrations section (styled as a section label), just above MONITORING AND OBSERVABILITY). The page is hidden there until `unlisted` is removed.
- **Catalog order everywhere:** AWS Glue, Polaris, Lakekeeper, then vendor-native (`rank` in `catalogs.ts`).
- **Tabs:** `<I.CatalogTabs>` (groupId `catalog`, `?catalog=` in the URL), `groupId="engine"` for the cross-engine section, `groupId="interface"` for UI versus CLI. No other groupIds.
- **Checks:** `node scripts/integrations/check.mjs` (front matter against the matrix, partial ids, own-words versus shared words, uniqueness, unlisted state), then `npm run lint:content -- docs/integrations docs/shared/integrations`, `npm run typecheck`, `CI=true npm run build`. A page stays `unlisted: true` until its pair is `live` in `pairs.ts` and every check passes.
- **After a shared change** (`docs/shared/integrations/**`, `src/data/integrations/**`): run `node scripts/integrations/check.mjs --report`, rebuild, and re-read every page the report lists.
- **Writing rules:** no em dashes or curly quotes, paragraphs of three sentences at most, acronyms expanded on first use, every number from the run or from a dated source, OLake Go's limits stated plainly, no "best" or "fastest" without a source.
- Renaming or removing a page needs a redirect in `docusaurus.config.js` in the same change.
