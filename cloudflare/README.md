# olake.io on Cloudflare Workers static assets

The site is built in GitHub Actions and uploaded to a Cloudflare Worker named `olake-docs` that has no code, only files. A merge to `master` deploys it (`deploy-cloudflare` job in `.github/workflows/deploy.yml`).

## What runs on every deploy

| Step | Script | What it does |
|---|---|---|
| 1 | `npm run build` | The normal Docusaurus build. |
| 2 | `scripts/cloudflare/carry-assets.mjs` | Downloads the hashed `/assets/` files of the last 7 days of deploys from the live site, so a browser tab that still holds older HTML keeps working. Publishes `asset-manifest.json` for the next deploy. |
| 3 | `scripts/cloudflare/prepare-build.mjs` | Turns the redirect stub pages into 301 rules in `build/_redirects`, adds one `/page /page/ 301` rule per page, deletes the stubs, and copies `cloudflare/_headers` to `build/_headers`. |
| 4 | `wrangler deploy` | Uploads `build/` as a new version of the Worker. The switch is atomic. |
| 5 | `scripts/cloudflare/test-deploy.mjs` | Requests every redirect rule, every sitemap URL and a set of unknown paths on the deployed site, and fails the job on any wrong answer. |

Redirects are still edited only in `docusaurus.config.js`. Response headers are edited in `cloudflare/_headers`.

## Limits to watch

Cloudflare allows 2,000 static redirect rules ([Workers redirects](https://developers.cloudflare.com/workers/static-assets/redirects/), checked Nov 2026). Each old URL costs two rules and each page costs one. `prepare-build.mjs` prints the count, warns at 90 percent and fails above the limit.

## Try it locally

```bash
npm run build
node scripts/cloudflare/prepare-build.mjs build
npx wrangler@4.159.0 dev --port 8791
node scripts/cloudflare/test-deploy.mjs build http://127.0.0.1:8791
```

`prepare-build.mjs` changes `build/` in place, so run `npm run build` again before `npm run serve`.

## Repository settings the workflows read

| Name | Kind | Value |
|---|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | variable | The Cloudflare account ID. The Cloudflare job is skipped while this is empty. |
| `CLOUDFLARE_API_TOKEN` | secret | A token from the "Edit Cloudflare Workers" template, limited to this account. |
| `CLOUDFLARE_SITE_URL` | variable | Where the Worker is reachable: its `workers.dev` URL before the domain is moved, `https://olake.io` after. Used for the asset carry-forward and the post-deploy test. |
| `CLOUDFLARE_PREVIEWS` | variable | `true` turns on a preview URL per pull request in `test-deploy.yml`. |

## Roll back

A bad deploy: `npx wrangler rollback` (or Workers, `olake-docs`, Deployments in the dashboard). The previous version is live again at once.

## Moving the domain

`wrangler.jsonc` has no `routes` entry on purpose. The first deploy that carries a route with `"custom_domain": true` moves olake.io to this Worker, so that line is added only on the day of the move, after the zone settings are reviewed. After the move, set `workers_dev` to `false` and remove the GitHub Pages jobs from `deploy.yml`.
