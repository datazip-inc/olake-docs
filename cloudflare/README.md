# olake.io on Cloudflare Workers static assets

The site is built in GitHub Actions and uploaded to a Cloudflare Worker named `olake-docs` that has no code, only files. A merge to `master` deploys it (`deploy-cloudflare` job in `.github/workflows/deploy.yml`).

## What runs on every deploy

| Step | Script | What it does |
|---|---|---|
| 1 | `build` job | The normal Docusaurus build, run once per merge. The Cloudflare job downloads its output (the `github-pages` artifact). |
| 2 | `scripts/cloudflare/carry-assets.mjs` | Downloads from the live site the hashed `/assets/` files that a deploy replaced in the last 7 days, so a browser tab that still holds older HTML keeps working. Publishes `asset-manifest.json` for the next deploy. If the live site cannot be read, the job stops (rerun it) so the older assets are not lost. |
| 3 | `scripts/cloudflare/prepare-build.mjs` | Turns the redirect stub pages into 301 rules in `build/_redirects`, adds one `/page /page/ 301` rule per page, deletes the stubs, and copies `cloudflare/_headers` to `build/_headers`. |
| 4 | `npx wrangler deploy` | Uploads `build/` as a new version of the Worker. The switch is atomic. |
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

## The domain

`wrangler.jsonc` attaches `olake.io` to the Worker as a custom domain (`routes`, `"custom_domain": true`). Cloudflare then owns the DNS records and the certificate of `olake.io`. In GitHub Actions, `wrangler deploy` replaces DNS records that conflict with a custom domain without asking, so the first deploy with this entry replaced the GitHub Pages `A` and `AAAA` records.

`www.olake.io` is a proxied DNS record plus the redirect rule `www-to-apex` (Rules, Redirect Rules), which answers 301 to `https://olake.io`. The Configuration Rule `docs-site-no-html-rewrite` turns off Email Obfuscation and Browser Integrity Check for `olake.io`.

Wrangler removes custom domains that are not in `wrangler.jsonc`, so a hostname added in the dashboard disappears on the next deploy.

### Back to GitHub Pages

1. Remove the `routes` entry and merge. The deploy detaches `olake.io` and deletes its DNS record.
2. In the Cloudflare dashboard, DNS, add the GitHub Pages records again, DNS only: `A` `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` and `AAAA` `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.

The site is down between the two steps, so do step 2 as soon as the deploy job ends. GitHub renews its certificate for `olake.io` only while the records point to GitHub, so after that certificate expires a return shows a certificate error for up to an hour.

### After the move is confirmed

Set the repository variable `CLOUDFLARE_SITE_URL` to `https://olake.io`, set `workers_dev` to `false`, and remove the GitHub Pages `deploy` job from `deploy.yml`. Keep the `build` job: the Cloudflare job uses its artifact.
