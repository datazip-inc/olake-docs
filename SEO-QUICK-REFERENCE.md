# OLake SEO Practices - Quick Reference

## JSON-LD Schemas We Use

### 1. **Organization Schema** (All Pages)
- Company name, logo, contact info
- Social media profiles (GitHub, Twitter, LinkedIn, YouTube)
- Physical address for local SEO

### 2. **WebSite Schema** (All Pages)
- Site name and description
- SearchAction for Google sitelinks search box

### 3. **TechArticle Schema** (Blog Posts)
- Author info, publish date, reading time
- Article sections and keywords
- Enables rich snippets in search results

### 4. **BreadcrumbList Schema** (All Pages)
- Site navigation structure
- Enables breadcrumb rich snippets

### 5. **FAQPage Schema** (FAQ Sections)
- Q&A format for rich snippets
- Helps with featured snippets

### 6. **Service Schema** (Service Pages)
- Service descriptions and provider info

### 7. **Person Schema** (Author/Team Pages)
- Team member profiles

---

## Metadata Tags We Use

### Open Graph Tags (Social Sharing)
```
og:type, og:title, og:description, og:url, og:image
og:image:width (1200), og:image:height (630)
og:image:type (image/webp)
```

### Twitter Card Tags
```
twitter:card (summary_large_image)
twitter:site, twitter:creator
twitter:title, twitter:description, twitter:image
twitter:label1/data1 (for author, reading time)
```

### Standard Meta Tags
```
description (150-160 chars)
keywords
canonical URL
robots (index, follow)
```

---

## Implementation Tips

1. **Always use absolute URLs** in schemas and meta tags
2. **Image specs**: 1200x630px for OG, WebP format preferred
3. **Validate**: Use Google Rich Results Test before going live
4. **Canonical URLs**: Every page needs one
5. **Consistent branding**: Same logo/name across all schemas

---

## Quick Implementation Example

```html
<!-- JSON-LD Organization Schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company",
  "url": "https://yourwebsite.com/",
  "logo": {
    "@type": "ImageObject",
    "url": "https://yourwebsite.com/logo.svg"
  },
  "sameAs": [
    "https://github.com/yourcompany",
    "https://x.com/yourhandle"
  ]
}
</script>

<!-- Open Graph Tags -->
<meta property="og:title" content="Your Page Title" />
<meta property="og:description" content="Your description" />
<meta property="og:image" content="https://yourwebsite.com/image.webp" />
<meta property="og:url" content="https://yourwebsite.com/page/" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Your Page Title" />
```

---

## Testing Tools

- Google Rich Results Test: https://search.google.com/test/rich-results
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator

---

**Full detailed guide available in SEO-IMPLEMENTATION-GUIDE.md**

Questions? Reach out on Twitter [@_olake](https://x.com/_olake) or email hello@olake.io

