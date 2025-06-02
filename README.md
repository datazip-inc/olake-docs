# OLake Website – Contributor Handbook

*(The site is built with **Docusaurus**)*

---

### 1. Prerequisites & Local Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/datazip-inc/olake-docs.git
   ```

2. **Install dependencies**

   ```bash
   npm i
   ```

3. **Verify the build**

   ```bash
   npm run build
   ```

   A successful build confirms there are no compile-time errors.

4. **Start the development server**

   ```bash
   npm run start
   ```

   Your default browser will automatically open the local site.

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
static/img/blog/cover/flatten-array-cover.png
static/img/blog/2025/05/flatten-array-1.png
static/img/blog/2025/05/flatten-array-2.png
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

---

### 6. Other Key Information

| Topic               | Details                                                                                         |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| Redirects           | Configure at the end of `docusaurus.config.js`.                                                 |
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
Add work-in-progress content to the `/drafts` folder; it will not be published.

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
