# OLake Website – Contributor Handbook

*(The site is built with **Docusaurus**)*

---

### 1. Prerequisites & Local Setup

Stack: Docusaurus 3.10, React 19, Tailwind CSS 4, strict MDX 3.

1. **Node.** Use the version in `.nvmrc` (currently 24; `package.json` requires 22 or newer).

   ```bash
   nvm use
   ```

2. **Clone and install**

   ```bash
   git clone https://github.com/datazip-inc/olake-docs.git
   cd olake-docs
   npm install
   ```

3. **Clear the cache** after every `git pull`, after `npm install`, and after editing any plugin file in `src/plugins` (the compile cache does not notice plugin changes). A "Module not found" or `ReactContextError` on every page usually means a stale cache.

   ```bash
   npm run clear
   ```

4. **Start the development server**

   ```bash
   npm start
   ```

   Your default browser opens the local site. Some effects are production-only (for example the generated image sizes), so check final results in a build.

5. **Build** (this is what CI runs; with `CI=true` broken links, broken anchors and duplicate routes fail the build instead of warning)

   ```bash
   CI=true npm run build
   ```

   `npm run build` first runs the Open Graph image script, then `docusaurus build`, then the image sitemap script. To preview the output: `npm run serve`.

6. **Checks to run before opening a PR**

   | Command | What it checks |
   | ------- | -------------- |
   | `npm run typecheck` | `tsc --noEmit` over the TypeScript sources |
   | `npm run lint:content` | Strict-MDX rules for docs and blog files (comment and heading-id syntax, admonition titles, links to `/docs/intro/`, front matter paths). Errors fail CI. |
   | `npm run og-images` | Creates any missing 1200x630 social card for a blog cover (add `-- --check` to only report). Generated files are committed. |

#### 1.1 Design system pointers

* **Tokens:** `src/css/tokens.css` holds the `--olake-*` colors, type scale and spacing for light and dark. Use the Tailwind `olake-*` utilities (defined in `src/css/custom.css`) or `var(--olake-*)`; do not hard-code hex values in components.
* **UI primitives:** `src/components/landing/ui/` (`Button`, `Section`, `SectionHeading`, `Card`, `CtaBanner`, `LakesidePage`). Build marketing pages from these.
* **Page titles (h1):** defined once in `src/css/typography.css`; do not set h1 size or weight in a component.
* **Swizzling:** wrap the original (`@theme-original/<Component>`) instead of copying it, so the swizzle survives Docusaurus upgrades.

---

### 2. Adding a Blog Post

| Directory  | When to use             |
| ---------- | ----------------------- |
| `/blog`    | General OLake topics    |
| `/iceberg` | Iceberg-specific topics |

1. **Navigate** to the correct directory.
2. **Create an MDX file**: `YYYY-MM-DD-blog-slug.mdx`.
   *The date reflects the publish date, not the commit date.*
3. **Copy the front-matter** (metadata) from an existing post and update it.
4. **Manage authors**

   * Each directory has its own `authors.yml`.
   * Add new authors here before referencing them in a post.
5. **Append** `<BlogCTA/>` **as the final line** of every blog post.

---

### 3. Blog Image Structure

1. **Root folder:** `static/img/blog/`
2. **Cover images:** `static/img/blog/cover/<slug>-cover.png`
3. **Inline images:** `static/img/blog/YYYY/MM/<slug>-N.png`

*Example – slug `flatten-array`, published May 2025:*

```
static/img/blog/cover/flatten-array-cover.webp
static/img/blog/2025/05/flatten-array-1.webp
static/img/blog/2025/05/flatten-array-2.webp
```

---

### 4. Component Structure

1. Create reusable **React (`.tsx`) components** in `src/components`.

   * Keep them text-agnostic and modular.
2. **Before creating**, scan existing components for reuse.
3. To expose a component globally in MDX, **import it once** in
   `src/theme/MDXComponents/Index.js`.

   * Afterwards, you can use `<MyComponent/>` in any file under `/blog`, `/docs`, or `/iceberg`.
   * **HTML pages** in `src/pages` still require **manual imports**.

---

### 5. Adding Documentation

1. **Create** the MDX file under `/docs`.
2. **Register** the file (and its order) in `sidebars.js`.
   *Order-of-appearance in the sidebar is defined here.*

#### 5.1 Shared Text Components

* Place reusable snippets in `docs/shared/`.
* Import them in `src/theme/MDXComponents/Index.js`.
* Use them anywhere with the usual `<SharedComponent/>` syntax.
* `docs/shared/` is excluded from the docs build (`exclude` in `docusaurus.config.js`), so snippets are **not** published as pages or listed in the sitemap. They only render where they are imported. Do not link to `/docs/shared/...` URLs.

---

### 6. Other Key Information

| Topic               | Details                                                                                         |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| Redirects           | Configure in the `@docusaurus/plugin-client-redirects` list in `docusaurus.config.js`. Never leave a "moved" stub `.mdx` behind (see 6.5). |
| `CNAME`             | Do **not** delete `static/CNAME`; GitHub Pages needs it for **olake.io**.                       |
| Public files        | Any asset in `static` is publicly accessible (e.g. `/reddit.json`).                             |
| Next.js             | We may switch to the Next.js plug-in later for Lighthouse gains.                                |
| Embedding media     | Images: Markdown `![Alt](/img/...)`; use raw HTML for size control.<br/>Videos: embed via HTML. |
| MDX & HTML          | MDX accepts all HTML except **tables** (use Markdown tables).                                   |
| Docusaurus features | Components like `<Tabs>`, `<TabItem>`, `:::info`, etc. are native—see their docs.               |

#### 6.1 Code Block Guidelines

```md
    ```py title="docker-compose.yml"
    # code here
    ````

```

Supported lexers: `py`, `bash`, `sh`, `js`, `jsx`, `go`, `yaml`, `yml`, `text`, …

#### 6.2 Heading Style (Do **not** bold the text)
```

## Heading   ✅

### Heading  ✅

## **Heading**   ❌

```

#### 6.3 Swizzling (Advanced)
Use Docusaurus **swizzle** to override core components and UI of how . Swizzled files live in `src/theme/`.  
We have already swizzled: blog pages, doc pages, navbar, and footer.

#### 6.4 Drafts
Add work-in-progress content to the root `/drafts` folder; it will not be published.
A draft that must live inside `docs/`, `blog/` etc. needs `draft: true` in its frontmatter. A folder called `docs/drafts/` is **not** hidden automatically: a page there is published and goes into the sitemap unless it has `draft: true`.

#### 6.5 SEO rules
Breaking these has cost search traffic before. `CI=true npx docusaurus build` and `npm run lint:content` must stay clean.

* **Canonical URLs keep the trailing slash, and Docusaurus writes them.** The site is `trailingSlash: true`; GitHub Pages 301s the no-slash URL to the slash URL, and the sitemap and hreflang use the slash URL. Never add your own `<link rel="canonical">` and never strip the slash from a permalink. `og:url` and JSON-LD `url`/`@id` must match the canonical. Before the fix Google indexed both versions of 172 pages.
* **Hardcoded internal links end in a slash** (`/slack/`, `/contact/`, `/blog/`, also absolute `https://olake.io/...` links in MDX, which Docusaurus does not normalise). Use `SLACK_URL` instead of retyping the Slack link. A link without the slash costs a 301 hop on every click and crawl.
* **Changing or removing a URL needs a redirect.** If you change a post's `slug`, rename a doc or delete a page, add `{ from, to }` to the client-redirects list in `docusaurus.config.js` in the same PR. In 2026-04 a top post changed slug without one and kept 404ing in search with about 500 clicks of history. Do not keep a "(Moved)" stub `.mdx` page. Put a slash before any `#` or `?` in a redirect `to`; `src/plugins/client-redirects-slash` restores it in the generated stubs because Docusaurus drops it.
* **Titles.** The site title is `OLake`, so every `<title>` ends in ` | OLake` (docs too). Keep the rendered title at 60 characters or fewer, so the frontmatter title at about 52. If the visible H1 needs to be longer, add `seo_title: "..."` (about 52 characters) to the frontmatter: it replaces only `<title>`, `og:title` and `twitter:title`, and the H1 keeps `title`. Docs titles under 25 characters get their sidebar section appended automatically. Code: `src/theme/seo/helpers.ts`, `src/theme/DocItem/Metadata`, `src/theme/BlogPostPage`.
* **Descriptions.** Every page needs its own `description` of 120 to 155 characters (max 160, min 100), unique across the site. Do not copy one post's description into another, and do not leave it truncated with "...". Files in `docs/shared` are snippets and have no frontmatter.
* **Pages that must not be indexed** get `noindex, follow`: confirmation pages, archive pages, tag and author pagination, zero-post authors, `/search/`. The theme does this for the generated pages; add it yourself to any new thank-you or utility page. Keep them crawlable (no robots.txt block), otherwise Google never sees the tag.
* **Taxonomy pages** (blog, iceberg, customer-stories archive, authors, tags) get their title, description and H1 from the swizzled components in `src/theme` (`Blog/useBlogInstance.js`). Titles carry no post count (the count made SEO audits report "title changed" on every new post). A new blog instance must be added there, or its pages fall back to the "Blog" wording.
* **Sitemap exclusions** live in the sitemap options of `docusaurus.config.js` (tags, authors, archive, search, `docs/shared`, confirmation pages, pagination). `docs/shared` is not built as pages at all.
* **One `og:type`, one H1, one JSON-LD per schema.** Pages under `src/pages` get `og:type=website` from `src/theme/Layout`; posts emit `article`. Emit JSON-LD with `src/components/JsonLd`, not `<Head><script dangerouslySetInnerHTML>` (Helmet drops it).
* **Images.** Keep every image under about 300 KB (WebP; no GIFs, use short muted looping video).

---

### 7. Git Basics You’ll Need

```bash
git add .                       # stage all changes
git commit -m "Message"         # commit
git commit -am "Message"        # add + commit tracked files
git pull                        # fetch & merge
git push                        # push current branch
git branch                      # list branches
git status                      # show working tree status
git checkout -b <new-branch>    # create and switch
git switch <branch>             # switch existing branch
```

#### 7.1 Push a New Branch

```bash
git push --set-upstream origin <branch-name>
```

---

### 8. Recommended Git Workflow

```bash
# 1. Make sure local master is current
git switch master
git pull origin master

# 2. Create a feature branch
git checkout -b blog/your-slug         # or docs/your-topic, etc.

# 3. Work on your changes
#    (add blog MDX, images, authors.yml, sidebar entry, etc.)

# 4. Stage & commit
git add .
git commit -m "Add <your-slug> blog to OLake docs"

# 5. Push and open a PR
git push --set-upstream origin blog/your-slug
```

#### 8.1 Working on Multiple Branches

1. Finish work on the first branch and push.

2. Ensure `master` is up to date:

   ```bash
   git switch master
   git pull origin master
   ```

3. Create your next branch:

   ```bash
   git checkout -b blog/second-slug
   ```

4. Repeat the *add → commit → push* cycle.

> **Tips**
> • Git can feel tricky—refer to official docs, blog posts, or ask in Slack.
> • Always branch from `master` unless directed otherwise.

---

### 9. Need Assistance?

* Check the official **Docusaurus** docs.
* For Git issues, consult documentation or ChatGPT.

Happy writing and shipping content!
