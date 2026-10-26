# olake-docs

Docusaurus site for olake.io (docs, blog, `/compare`, `/learn`, customer stories). See `SOP.md` for the full procedures.

## Vendor claims in `/compare` and `/learn` posts

- Every price, plan, limit or licence claim that comes from a vendor's page links that page and ends with `(checked Oct 2026)` (month and year of the check) right after the link. See `SOP.md` section 5.7.
- A claim about what a competitor does not support or limits always links the page that shows it, or is cut.
- No screenshots of other vendors' pages. Use dated text with a link. Our own diagrams and screenshots of OLake's UI or docs are fine.
- Review-site quotes: opinions and cost experience only, one positive and one negative per tool or none, with date and link.
- Folders in scope: `compare/` and `learn/`.
- Run `/refresh-vendor-claims` before publishing a new comparison post and at the start of each month (a monthly issue reminds the owner; the skill runs locally and opens the PR).
