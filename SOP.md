# Standard Operating Procedure (SOP) - OLake Documentation Repository

## Document Control

**Last Updated**: October 6, 2025  
**Review Frequency**: Quarterly

## Table of Contents

1. [Introduction](#introduction)
2. [Repository Overview](#repository-overview)
3. [Development Environment Setup](#development-environment-setup)
4. [Project Architecture](#project-architecture)
5. [Content Management](#content-management)
6. [Deployment Procedures](#deployment-procedures)
7. [Maintenance and Updates](#maintenance-and-updates)
8. [Monitoring and Analytics](#monitoring-and-analytics)
9. [Security and Best Practices](#security-and-best-practices)
10. [Troubleshooting](#troubleshooting)

## 1. Introduction

### 1.1 Document Purpose

This Standard Operating Procedure (SOP) establishes the authoritative guidelines for managing and maintaining the OLake documentation repository. The repository serves as the central source for OLake's documentation, blogs, and technical content, built using Docusaurus v3.8.1.

### 1.2 Scope

This SOP covers:

- Documentation repository management
- Content creation and maintenance workflows
- Development and deployment procedures
- Security protocols and compliance requirements
- Monitoring and analytics

### 1.3 Target Audience

This document is intended for:

- Internal Team
- External Contributors

### 1.4 Prerequisites

Readers should have:

- Basic understanding of Git version control
- Familiarity with Markdown/MDX
- Basic knowledge of React and Typescript

### 1.5 Document Conventions

#### Formatting Conventions

- `code` - Commands, file names, directories
- **Bold** - Important notes, warnings
- _Italic_ - Emphasis, new terms
- > Blockquotes - Examples, quotes


### 1.6 Objectives

1. **Quality Assurance**
   - Maintain consistent documentation standards
   - Ensure technical accuracy
   - Implement comprehensive review processes

2. **Efficiency**
   - Streamline content deployment
   - Optimize development workflows

3. **Collaboration**
   - Facilitate team coordination
   - Enable effective communication


## 2. Repository Overview

### 2.1 Repository Structure

```bash
olake-docs/
├── blog/                  # Blog posts and articles
│   ├── authors.yml       # Author information
│   ├── tags.yml         # Blog tag definitions
│   └── YYYY-MM-DD-*.mdx # Blog post files
│
├── docs/                 # Main documentation
│   ├── getting-started/ # Onboarding guides
│   ├── core/           # Core concepts
│   ├── features/       # Feature documentation
│   ├── connectors/     # Connector guides
│   ├── tutorials/      # Step-by-step guides
│   ├── shared/        # Shared MDX components
│   └── writers/       # Documentation writer guides
│
├── iceberg/             # Iceberg-specific documentation
│   ├── authors.yml        # Author information
│   └── tags.yml    # tags
│
├── src/                 # Source code
│   ├── components/     # React components
│   │   ├── site/      # Website current Home Page components (Hero, Features, etc.)
│   │   ├── common/    # Reusable UI components
│   │   └── layouts/   # Layout components
│   │
│   ├── pages/         # Static pages (React)
│   │   ├── index.tsx      # Homepage
│   │   ├── about.tsx      # About page
│   │   └── contact.tsx    # Contact page
│   │
│   ├── theme/         # Docusaurus theme customizations
│   │   ├── MDXComponents.tsx   # Custom MDX components
│   │   ├── Layout/            # Layout overrides
│   │   ├── Navbar/            # Navbar customizations
│   │   └── Footer/            # Footer customizations
│   │
│   └── utils/         # Utility functions
│       ├── helpers.ts      # Helper functions
│       └── constants.ts    # Constants and config
│
├── styles/              # Global styles
│   └── index.css       # Global CSS and Tailwind imports
│
├── utils/              # Utility scripts
│   ├── helpers.js      # Utility helper functions
│   └── config.tsx      # Configuration utilities
│
├── static/              # Static assets
│   ├── img/           # Images
│   │   ├── blog/     # Blog images
│   │   └── docs/     # Documentation images
│   │   └── authors/     # authors images
│   │   └── community/     # Community images
│
├── kubernetes/          # Kubernetes configurations
│   ├── configmaps/    # Configuration maps
│   ├── secrets/       # Secret definitions
│   └── deployments/   # Deployment manifests
│
├── airflow/             # Airflow configurations
│   ├── dags/          # DAG definitions
│   └── plugins/       # Custom plugins
│
├── docusaurus.config.js # Main Docusaurus configuration
│   # - Site metadata and settings
│   # - Theme configuration (navbar, footer, etc.)
│   # - Plugin configuration
│   # - Presets configuration
│   # - Algolia search configuration
│   # - Analytics and tracking
│   # - Redirects and URL rewrites
│
├── sidebars.js          # Documentation sidebar structure
├── sidebarsIcebergQE.js # Iceberg Query Engine sidebar
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies and scripts
└── postcss.config.js    # PostCSS configuration

```

### 2.2 Key Components

#### 2.2.1 Documentation (`/docs`)

- **Purpose**: Core product documentation
- **File Format**: MDX (Markdown + JSX)
- **Organization**:
  - Hierarchical structure based on topics
  - Each section has its own sidebar navigation
  - Shared components for reusability
- **Naming Convention**: `lowercase-with-hyphens.mdx`
- **Special Files**:
  - `intro.mdx`: Landing page
  - `sidebars.js`: Navigation structure

#### 2.2.2 Blog Posts (`/blog`)

- **Purpose**: Technical articles, updates, tutorials
- **File Format**: MDX
- **Naming Convention**: `YYYY-MM-DD-post-title.mdx`
- **Required Frontmatter**:
  ```yaml
  ---
  title: Post Title
  authors: [author_id]
  tags: [tag1, tag2]
  description: Brief description
  image: ./img/blog/YYYY/MM/cover.webp
  ---
  ```
- **Image Organization**:
  - Cover images: `static/img/blog/YYYY/MM/post-title-cover.webp`
  - Content images: `static/img/blog/YYYY/MM/post-title-1.webp`

#### 2.2.3 Source Code (`/src`)

- **Purpose**: Custom React components and functionality
- **Key Directories**:
  - `components/`: Reusable React components
  - `theme/`: Docusaurus theme customizations
  - `pages/`: Custom static pages
  - `utils/`: Helper functions and utilities

#### 2.2.4 Static Assets (`/static`)

- **Purpose**: Images, fonts, downloads
- **Organization**:
  - Images organized by content type and date
  - Fonts in dedicated directory
- **Naming Convention**: `lowercase-with-hyphens.extension`
- **Supported Formats**:
  - Images: `.png`, `.jpg`, `.svg`, `.webp` (prefer webp for more performance)
  - Fonts: `.woff2`, `.woff`
  - Documents: `.pdf`, `.zip`

#### 2.2.5 Configuration Files

- **Root Level**:
  - `docusaurus.config.js`: Main configuration
  - `sidebars.js`: Documentation navigation
  - `package.json`: Dependencies and scripts
  - `tsconfig.json`: TypeScript configuration
  - `tailwind.config.js`: CSS framework config

### 2.3 Version Control

#### 2.3.1 Branch Structure

- `main`: Production-ready code
- `develop`: Development branch
- Feature branches: `feature/feature-name`
- Doc branches: `doc/truncated-doc-name`
- Blog branches: `blog/truncated-blog-name`
- Hotfix branches: `hotfix/issue-description`

#### 2.3.2 Protected Branches

- `master`: Requires PR and approvals

### 2.4 Dependencies

#### 2.4.1 Core Dependencies

- Docusaurus v3.8.1
- React v18.3.1
- TailwindCSS v3.4.17
- TypeScript v5.0.0

#### 2.4.2 Development Dependencies

- ESLint
- Prettier

### 2.5 Build Artifacts

#### 2.5.1 Production Build

- Output directory: `/build`
- Static assets: `/build/static`
- Generated HTML: `/build/docs`, `/build/blog`
- Asset manifests: `/build/asset-manifest.json`

#### 2.5.2 Development Build

- Hot reloading enabled
- Source maps included
- Development server on port 3000

## 3. Development Environment Setup

### 3.1 Required Software

#### 3.1.1 Node.js

- **Version**: 18.x LTS or later

#### 3.2.2 Git

- **Version**: 2.30.0 or later

#### 3.2.3 Code Editor

- **Recommended**: Visual Studio Code
- **Required Extensions**:
  - ESLint
  - Prettier
  - MDX
  - Tailwind CSS IntelliSense
  - GitLens

### 3.3 Initial Setup

#### 3.3.1 Repository Setup

```bash
# Clone the repository
git clone https://github.com/datazip-inc/olake-docs.git

# Navigate to project directory
cd olake-docs

# Install dependencies
npm install
```

### 3.4 Development Workflow

#### 3.4.1 Starting Development Server

```bash
# Start development server
npm start
```

#### 3.4.2 Common Development Commands

```bash

# Build for production
npm run build

# Serve production build
npm run serve
```

### 3.5 Troubleshooting

#### 3.5.1 Common Issues

1. **Node Version Mismatch**

   ```bash
   # Check Node version
   node -v

   # Switch to correct version
   nvm use
   ```

2. **Dependencies Issues**

   ```bash
   # Clear npm cache
   npm cache clean --force

   # Remove node_modules
   rm -rf node_modules

   # Reinstall dependencies
   npm install
   ```

3. **Port Conflicts**

   ```bash
   # Find process using port 3000
   lsof -i :3000

   # Kill process
   kill -9 <PID>
   ```

#### 3.5.2 Build Issues

1. **TypeScript Errors**
   - Check `tsconfig.json` settings
   - Run `npm run typecheck` for detailed errors
   - Update type definitions: `npm install @types/* --save-dev`

2. **MDX Compilation Errors**
   - Verify MDX syntax
   - Check component imports

### 3.6 Best Practices

#### 3.6.1 Git Workflow

1. Create feature branch
2. Make changes
3. Commit with conventional commits
4. Push and create PR

## 4. Project Architecture

### 4.1 System Architecture

#### 4.1.1 High-Level Overview

```mermaid
graph TD
    A[Content Sources] --> B[Build System]
    B --> C[Static Site]
    B --> D[Search Index]
    E[Configuration] --> B
    F[Assets] --> B

    subgraph "Content Sources"
    A1[MDX Files]
    A2[React Components]
    A3[Documentation]
    A4[Blog Posts]
    end

    subgraph "Build System"
    B1[Docusaurus]
    B2[Webpack]
    B3[TypeScript]
    B4[PostCSS]
    end

    subgraph "Static Site"
    C1[HTML]
    C2[CSS]
    C3[JavaScript]
    C4[Assets]
    end
```

#### 4.1.2 Component Architecture

```mermaid
graph LR
    A[Pages] --> B[Layouts]
    B --> C[Components]
    C --> D[Base Components]

    subgraph "Component Layers"
    D[Base Components]
    C[Components]
    B[Layouts]
    A[Pages]
    end
```

### 4.2 Technology Stack

#### 4.2.1 Core Framework

- **Docusaurus v3.8.1**
  - Documentation framework
  - MDX support
  - Plugin system
  - Search integration

#### 4.2.2 Frontend Technologies

- **React 18.3.1**
  - Component-based UI
  - Server Components
  - Suspense
  - Error Boundaries

- **TailwindCSS 3.4.17**
  - Utility-first CSS
  - Responsive design
  - Dark mode support

#### 4.2.3 Build Tools

- **Webpack 5**
  - Module bundling
  - Code splitting
  - Asset optimization
  - Development server

- **TypeScript 5.0**
  - Static typing
  - Type checking
  - Code intelligence
  - Modern JavaScript features

#### 4.2.4 Development Tools

- **ESLint**
  - Code linting
  - Custom rules

- **Prettier**
  - Code formatting
  - Style consistency
  - IDE integration

### 4.3 Component Architecture

#### 4.3.1 Core Components

```typescript
// Base component structure
interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  // Common props
}

// Example component hierarchy
const Page = ({ children, ...props }) => {
  return (
    <Layout {...props}>
      <Main>{children}</Main>
    </Layout>
  );
};
```

#### 4.3.2 Component Categories

1. **Layout Components**
   - `Layout.tsx`: Base layout wrapper
   - `Header.tsx`: Site header
   - `Footer.tsx`: Site footer
   - `Sidebar.tsx`: Documentation sidebar
   - `Navigation.tsx`: Main navigation

2. **Content Components**
   - `MDXComponents.tsx`: MDX renderers
   - `CodeBlock.tsx`: Code highlighting
   - `TableOfContents.tsx`: Content navigation
   - `Pagination.tsx`: Page navigation

3. **Interactive Components**
   - `Search.tsx`: Search interface
   - `ThemeToggle.tsx`: Theme switcher
   - `CopyButton.tsx`: Copy functionality
   - `Tabs.tsx`: Content tabs

4. **Utility Components**
   - `SEO.tsx`: Meta tags management
   - `Analytics.tsx`: Usage tracking
   - `ErrorBoundary.tsx`: Error handling
   - `Loading.tsx`: Loading states

5. **HomePage**

- olake-docs/src/components/site

### 4.4 Data Flow

#### 4.4.1 Build-time Data Flow

```mermaid
graph TD
    A[MDX Content] --> B[Docusaurus]
    B --> C[Static HTML]
    D[Config] --> B
    E[Assets] --> B
    F[Components] --> B
```


### 4.5 Configuration Management

#### 4.5.1 Docusaurus Configuration

```javascript
// docusaurus.config.js
module.exports = {
  title: 'OLake Documentation',
  tagline: ' Data Lake ',
  url: 'https://olake.io/docs',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'datazip-inc',
  projectName: 'olake-docs',

  // Theme configuration
  themeConfig: {
    // Navigation
    navbar: {},

    // Search
    algolia: {},

    // Footer
    footer: {}
  },

  // Presets
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {},
        blog: {},
        theme: {},
        pages: {}
      }
    ]
  ],

  // Plugins
  plugins: []
}
```

#### 4.5.2 TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### 4.6 Plugin Architecture

#### 4.6.1 Core Plugins

- `@docusaurus/plugin-content-docs`
- `@docusaurus/plugin-content-blog`
- `@docusaurus/plugin-content-pages`
- `@docusaurus/plugin-sitemap`
- `@docusaurus/plugin-google-analytics`

#### 4.6.2 Custom Plugins

```javascript
// Example custom plugin
module.exports = function (context, options) {
  return {
    name: 'custom-plugin',

    // Lifecycle hooks
    async loadContent() {},
    async contentLoaded({ content, actions }) {},

    // Configuration
    getThemePath() {},
    getTypeScriptThemePath() {},

    // Client modules
    getClientModules() {}
  }
}
```

### 4.7 Performance Optimization

#### 4.7.1 Build Optimization

- Code splitting
- Tree shaking
- Asset optimization
- Caching strategies
- Compression

#### 4.7.2 Runtime Optimization

- Lazy loading
- Image optimization ( prefer webp with less than 100kb)
- Font loading
- CSS optimization
- JavaScript optimization

#### 4.7.3 Monitoring

- Lighthouse scores
- Web Vitals
- Bundle analysis
- Performance metrics

### 4.8 Third-Party Integrations

The project integrates with several third-party services and plugins to enhance functionality. These are primarily configured in `docusaurus.config.js`.

#### 4.8.1 Algolia Search

- **Purpose**: Provides the search functionality for the documentation and blog.
- **Configuration**: Algolia is configured in the `themeConfig.algolia` section of `docusaurus.config.js`. This includes the App ID, API Key, and Index Name.
- **Updates**: Algolia DocSearch crawler visits website once every 24 hours to index the content, It uses the sitemap to discover the pages (https://olake.io/sitemap.xml) , when we push changes to master branch , github actions deploys those changes and then sitemap will be updated as algolia crawler will reindex the changes within 24 hours , search results will also be updated .

#### 4.8.2 Analytics

- **Purpose**: Google Analytics is used for tracking website traffic, user engagement, and content performance.
- **Configuration**: While not directly configured with a tracking ID in `docusaurus.config.js`, the necessary DNS prefetch links for Google Analytics services are included in the `headTags`.

#### 4.8.3 Diagrams

- **Purpose**: The `@docusaurus/theme-mermaid` plugin is used to render Mermaid diagrams within Markdown files, allowing for the creation of flowcharts, sequence diagrams, and other visualizations from code-like text.

#### 4.8.4 Image Optimization

- **Purpose**: The `plugin-image-zoom` and `ideal-image` plugins are used to provide better user experience with images. They enable responsive image sizes and click-to-zoom functionality.

#### 4.8.5 HubSpot Forms

- **Purpose**: Used for lead generation and user registration on the website. The main registration form for the pilot program is powered by HubSpot.
- **Configuration**:
  - Portal ID: `21798546`
  - Form ID: `86391f69-48e0-4b35-8ffd-13ac212d8208`
  - Location: Embedded in the `RegistrationSection` component on the homepage
- **How it works**:
  - The HubSpot form script loads lazily when the registration section comes into view or when users navigate directly to `#olake-form-product` anchor
  - This improves page load performance by not loading the form script until needed
  - Forms automatically submit lead data to HubSpot for tracking and follow-up
- **Setup in code**: Located in `src/components/site/RegistrationSection.jsx`

#### 4.8.6 Tally Forms

- **Purpose**: Join the waitlist form used at /ai-lake (e.g., AILake waitlist)
- **Configuration**: Form is  embedded using Tally's embed script
- **Location**: Used in the `Glace` component (`src/components/site/Glace.tsx`)
- **Advantages**: Quick to set up

#### 4.8.7 IndexNow

- **Purpose**: Automatically notifies search engines (Bing, Yandex, etc.) when content is updated, speeding up indexing
- **Configuration**: Custom plugin located at `src/plugins/indexnow/index.js`
- **How it works**:
  - After each build, the plugin reads the generated sitemap
  - Extracts all URLs from the sitemap
  - Submits them to IndexNow API endpoints for Bing and Yandex
  - Helps get new content indexed faster than waiting for search engines to crawl naturally
- **API Key**: Stored in `INDEXNOW_KEY` environment variable (also hardcoded as fallback)

## 5. Content Management

### 5.1 Content Strategy

#### 5.1.1 Content Types

1. **Documentation**
   - Product documentation
   - Getting started guides

2. **Blog Posts**
   - Product updates
   - Technical deep dives
   - Case studies
   - Community highlights

3. **Component Library**
   - UI components
   - Documentation components
   - Interactive examples
   - Code snippets

### 5.2 Documentation Management

#### 5.2.1 Documentation Structure

```
docs/
├── getting-started/     # Onboarding documentation
│   ├── introduction.mdx
│   ├── quick-start.mdx
│   └── installation.mdx
├── core/               # Core concepts
│   ├── architecture.mdx
│   └── concepts.mdx
├── features/          # Feature documentation
│   ├── feature-a.mdx
│   └── feature-b.mdx
├── tutorials/         # Step-by-step guides
│   ├── tutorial-1.mdx
│   └── tutorial-2.mdx
└── api/              # API documentation
    ├── overview.mdx
    └── endpoints.mdx
```

#### 5.2.2 Documentation Standards

1. **File Naming**
   - Use kebab-case: `feature-name.mdx`
   - Group related files in directories
   - Use descriptive names

2. **Frontmatter**

   ```yaml
   ---
   id: unique-id
   title: Page Title
   sidebar_label: Sidebar Label
   description: Page description for SEO
   keywords: [keyword1, keyword2]
   image: /img/docs/feature-image.png
   ---
   ```

3. **Content Structure**

   ```markdown
   # Title

   ## Overview

   Brief introduction

   ## Prerequisites

   Required knowledge/setup

   ## Steps

   1. Step one
   2. Step two

   ## Examples

   Code examples

   ## Troubleshooting

   Common issues and solutions
   ```

### 5.3 Blog Post Management

#### 5.3.1 Blog Post Structure

```
blog/
├── 2025/
│   └── 10/
│       ├── post-title.mdx
│       └── images/
│           ├── cover.png
│           └── diagram-1.png
├── authors.yml
└── tags.yml
```

#### 5.3.2 Blog Post Standards

1. **File Naming**

   ```
   YYYY-MM-DD-post-slug.mdx
   ```

2. **Frontmatter**

   ```yaml
   ---
   title: Post Title
   authors: [author_id]
   tags: [tag1, tag2]
   description: Brief description
   image: ./img/blog/2025/10/cover.png
   date: 2025-10-06
   draft: false
   ---
   ```

3. **Author Configuration**

   ```yaml
   # authors.yml
   author_id:
     name: Author Name
     title: Job Title
     url: https://github.com/author
     image_url: https://github.com/author.png
   ```

4. **Content Template**

   ```markdown
   # Introduction

   Brief overview

   ## Problem Statement

   What problem are we solving?

   ## Solution

   How we solved it

   ## Implementation

   Technical details

   ## Results

   Outcomes and benefits

   ## Conclusion

   Summary and next steps
   ```

### 5.4 Component Development

#### 5.4.1 Component Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Button/
│   │   │   ├── index.tsx
│   │   │   ├── styles.module.css
│   │   │   └── types.ts
│   │   └── Card/
│   ├── docs/
│   │   └── CodeBlock/
│   └── blog/
│       └── PostCard/
```

#### 5.4.2 Component Standards

1. **File Structure**

   ```typescript
   // index.tsx
   import { ComponentProps } from './types'
   import styles from './styles.module.css'

   export const Component = ({ prop1, prop2 }: ComponentProps) => {
     // Implementation
   }
   ```

2. **Type Definitions**

   ```typescript
   // types.ts
   export interface ComponentProps {
     prop1: string
     prop2?: number
     children?: React.ReactNode
   }
   ```

3. **Styling**
   ```css
   /* styles.module.css */
   .container {
     /* styles */
   }
   ```

### 5.5 Content Workflow

#### 5.5.1 Documentation Workflow

1. **Planning**
   - Identify documentation needs
   - Create outline
   - Review with stakeholders

2. **Writing**
   - Follow style guide
   - Include examples
   - Add images/diagrams

3. **Review**
   - Technical review
   - Editorial review
   - Stakeholder review

4. **Publishing**
   - Update sidebar
   - Check links
   - Deploy changes

### 5.6 Quality Assurance

#### 5.6.1 Content Checklist

- [ ] Technical accuracy
- [ ] Grammar and spelling
- [ ] Links working
- [ ] Images optimized
- [ ] Mobile responsive
- [ ] SEO optimized

#### 5.6.2 Review Process

1. **Self Review**
   - Run spellcheck
   - Verify code samples
   - Check formatting

2. **Peer Review**
   - Technical accuracy
   - Code review
   - Content flow

3. **Editorial Review**
   - Grammar and style
   - Clarity
   - Consistency


## 6. Deployment Procedures


#### 6.1 Build Process

```bash

# Build the site
npm run build

# Serve locally to verify
npm run serve
```

#### 6.2.3 Deployment Steps

```bash

# Deploy to GitHub Pages
npm run deploy
```

#### 6.2.4 Deployment Verification

1. **Manual Verification**
   - Check homepage loads
   - Verify search functionality
   - Test navigation
   - Check external links
   - Verify assets loading

#### 6.3.1 Build Optimization

- Asset compression
- Code splitting
- Tree shaking
- Cache optimization

#### 6.3.2 Runtime Optimization

- CDN configuration
- Browser caching
- Service worker
- Image optimization

### 6.4 Post-Deployment Tasks

After each deployment, the following happens automatically:

1. **Sitemap Generation**:
   - New sitemap is generated at `https://olake.io/sitemap.xml`
   - Contains all documentation, blog posts, and pages
   - Helps search engines discover new and updated content

2. **IndexNow Notification**:
   - IndexNow plugin automatically notifies Bing and Yandex
   - Sends list of all URLs from sitemap
   - Speeds up indexing of new content

3. **Algolia Search Indexing**:
   - Algolia crawler will reindex the site within 24 hours
   - Can manually trigger reindex from Algolia Crawler dashboard if needed
   - Search results will reflect new content after reindex completes

4. **Manual verification checklist**:
   - Check that new pages are accessible
   - Verify images load correctly
   - Test search functionality with new content (after 24 hours)
   - Check mobile responsiveness
   - Verify forms still work (HubSpot, Tally)

## 7. Monitoring and Analytics

### 7.1 Performance Monitoring

#### 7.1.1 Key Metrics to Track

- **Page Load Time**: Should be under 3 seconds
- **Time to Interactive**: Should be under 5 seconds
- **First Contentful Paint**: Should be under 1.8 seconds
- **Largest Contentful Paint**: Should be under 2.5 seconds
- **Cumulative Layout Shift**: Should be under 0.1

#### 7.1.2 Monitoring Tools

1. **Google Lighthouse**:
   - Run regular audits on key pages
   - Track performance, accessibility, SEO scores
   - Target: All scores above 90

2. **Page Speeddev**
   - https://pagespeed.web.dev/
   -Run analysis on core web vitals


### 8 Performance Best Practices

#### 8.1.1 Image Guidelines

- **Preferred format**: WebP / svg 
- **Maximum size**: 100KB or lower per image
- **Compression**: Always optimize before uploading
- **Alt text**: Always include for accessibility

#### 9.1.2 Code Quality

- Follow ESLint rules
- Use TypeScript for type safety
- Keep components small and focused
- Reuse components when possible

#### 9.1.3 SEO Best Practices

- Include meta descriptions on all pages
- Use proper heading hierarchy (H1 → H2 → H3)
- Add alt text to all images
- Use descriptive URLs
- Add structured data where appropriate
- Keep content fresh and updated

## 10. Troubleshooting

### Common Issues

1. Build failures
   - Check Node.js version
   - Verify dependencies
   - Review build logs

2. Content rendering issues
   - Validate MDX syntax
   - Check component imports
   - Verify image paths

### Support Resources

- Official Docusaurus documentation
- GitHub repository issues
- Internal documentation
- Community support channels

---

## Document Information

- **Last Updated**: October 6, 2025
- **Version**: 1.0
- **Maintainers**: OLake Documentation Team
```
