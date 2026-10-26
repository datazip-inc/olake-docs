---
name: refresh-vendor-claims
description: Refresh the dated price, plan, limit and licence claims in the /compare and /learn posts. Use when the user types /refresh-vendor-claims (optionally with a post path or a vendor name), at the start of each month, or before publishing a new comparison post. Fetches each linked vendor page, compares it with the claim, and proposes the edit (new number, new date, same link), or flags the claim when it cannot be verified.
---

# Refresh vendor claims

Comparison posts state prices, plan terms, limits and licences taken from other vendors' pages. Those change. This skill re-checks them and opens one PR per run.

## The pattern it looks for

A vendor claim is a sentence or table row that has a link to the vendor's page and ends with `(checked <Mon YYYY>)` right after the link, for example:

`Standard starts at $20 a month ([pricing page](https://example.com/pricing)) (checked Oct 2026).`

See SOP section 5.7. Claims that are missing the suffix or the link are findings too: list them in the report, do not guess a source for them.

## Scope

- Posts in `compare/` and `learn/`. If the user names a post path or a vendor, only those posts or only claims linking that vendor's domain.
- Skip OLake's own pages and docs, and quotes from review sites (quotes keep their own date).

## Steps

1. Find every claim by the pattern: `grep -rn "(checked " compare learn`. Build a list of: file, line, claim text, vendor URL, date checked.
2. For each distinct vendor URL, fetch the page once (WebFetch, or the browser for pages that need it). Do not use search snippets as the source.
3. Compare the claim with the page:
   - Same number, term or limit: change only the date suffix to the current month.
   - Different: change the number or wording to what the page says now, keep the same link, set the date to the current month. If the claim appears in a quiz (`src/data/quizzes/<slug>.json`), a table, the TL;DR or the FAQ, change it there too so the post stays consistent.
   - Page moved or removed, claim no longer on the page, or page behind a login or JavaScript you cannot read: do not edit the number. Flag it.
4. Do not touch anything else: no rewrites, no new claims, no removed claims unless the page shows the claim is false (then flag it for the owner and wait).
5. Keep the style rules in `CLAUDE.md` (no em-dashes, plain sentences, vendor-neutral tone, OLake facts only from our docs).
6. Run `npm run build` once, check there are no broken links or image warnings.
7. Open one PR from a fork or branch named `content/refresh-vendor-claims-YYYY-MM` with a short table in the body: claim, old value, new value, link. Add a second table for the claims it could not verify and for claims missing the pattern. Keep the title short, for example "Refresh vendor claims, October 2026".

## Report format

| Post | Claim | Old | New | Link |
|---|---|---|---|---|

Could not verify:

| Post | Claim | Reason |
|---|---|---|

Missing the pattern:

| Post | Line | Text |
|---|---|---|

## Rules

- Never commit or push without the user's OK.
- Never invent a source. If the vendor page does not say it, flag it.
- A competitor's limit always keeps its link. Cut the claim instead of leaving it unlinked.
