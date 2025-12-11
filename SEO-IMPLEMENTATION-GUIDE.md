# OLake SEO Implementation Guide

## Overview

This guide documents the comprehensive SEO practices implemented on the OLake website, including JSON-LD structured data schemas and metadata tags. You can use this as a reference to implement similar SEO enhancements on your website, regardless of whether you're using Docusaurus or any other framework.

---

## 1. JSON-LD Structured Data Schemas

We use JSON-LD (JavaScript Object Notation for Linked Data) to provide structured data to search engines. All schemas follow the Schema.org vocabulary standard.

### 1.1 Organization Schema (Global - Used on All Pages)

This schema identifies your organization and should be included on every page.

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "OLake",
  "url": "https://olake.io/",
  "logo": {
    "@type": "ImageObject",
    "url": "https://olake.io/img/logo/olake-blue.svg",
    "width": 32,
    "height": 32
  },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "hello@olake.io"
    }
  ],
  "sameAs": [
    "https://github.com/datazip-inc/olake",
    "https://x.com/_olake",
    "https://www.linkedin.com/company/datazipio/",
    "https://www.youtube.com/@olakeio"
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "16192 COASTAL HWY",
    "addressLocality": "LEWES",
    "addressRegion": "DE",
    "postalCode": "19958",
    "addressCountry": "US"
  }
}
```

**Key Points:**
- `sameAs`: Include all your social media profiles (GitHub, Twitter/X, LinkedIn, YouTube)
- `address`: Use complete physical address for local SEO
- `logo`: Provide absolute URL to your logo image
- `contactPoint`: Include customer support contact information

### 1.2 WebSite Schema (Global - Used on All Pages)

This schema describes your website and enables search functionality.

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://olake.io/",
  "name": "Fastest Open Source Data Replication Tool",
  "description": "Fastest open-source tool for replicating Databases to Data Lake in Open Table Formats like Apache Iceberg. Efficient, quick and scalable data ingestion for real-time analytics. Supporting Postgres, MongoDB, MySQL, Oracle and Kafka with 5-500x faster than alternatives.",
  "publisher": {
    "@type": "Organization",
    "name": "OLake"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://olake.io/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

**Key Points:**
- `potentialAction`: Enables Google's sitelinks search box feature
- `description`: Should match your main tagline/meta description

### 1.3 WebPage Schema (Page-Specific)

Used for individual pages to provide page-specific information.

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "url": "https://olake.io/about-us/",
  "name": "About Us - OLake Team",
  "description": "Learn about the OLake team and our mission to build the fastest open-source data replication tool.",
  "isPartOf": {
    "@type": "WebSite",
    "url": "https://olake.io/",
    "name": "OLake"
  },
  "publisher": {
    "@type": "Organization",
    "name": "OLake",
    "url": "https://olake.io/",
    "logo": {
      "@type": "ImageObject",
      "url": "https://olake.io/img/logo/olake-blue.svg",
      "width": 32,
      "height": 32
    }
  },
  "primaryImageOfPage": {
    "@type": "ImageObject",
    "url": "https://olake.io/img/site/hero-section.svg",
    "width": 516,
    "height": 605
  }
}
```

### 1.4 TechArticle Schema (For Blog Posts)

Used specifically for technical blog posts to enable rich snippets in search results.

```json
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://olake.io/blog/2025/10/03/iceberg-metadata/"
  },
  "headline": "Apache Iceberg Metadata Explained: Snapshots & Manifests",
  "description": "Deep dive into how Apache Iceberg stores metadata...",
  "url": "https://olake.io/blog/2025/10/03/iceberg-metadata/",
  "author": {
    "@type": "Person",
    "name": "Shruti Mantri",
    "jobTitle": "Staff Software Engineer",
    "url": "https://olake.io/blog/authors/shruti/"
  },
  "publisher": {
    "@type": "Organization",
    "name": "OLake",
    "url": "https://olake.io/",
    "logo": {
      "@type": "ImageObject",
      "url": "https://olake.io/img/logo/olake-blue.svg",
      "width": 32,
      "height": 32
    }
  },
  "datePublished": "2025-10-03",
  "timeRequired": "PT43M",
  "articleSection": ["Apache Iceberg", "Metadata", "Snapshots", "Manifests", "Data Lakehouse"],
  "keywords": "Apache Iceberg, metadata, manifests, snapshots, data lakehouse, OLake",
  "image": "https://olake.io/img/blog/cover/iceberg-metadata-cover.webp",
  "primaryImageOfPage": {
    "@type": "ImageObject",
    "url": "https://olake.io/img/blog/cover/iceberg-metadata-cover.webp"
  }
}
```

**Key Points:**
- `timeRequired`: Use ISO 8601 duration format (PT43M = 43 minutes)
- `articleSection`: Array of relevant categories/topics
- `keywords`: Comma-separated relevant keywords
- `author`: Link to author profile page if available

### 1.5 BreadcrumbList Schema (Navigation)

Helps search engines understand your site structure and enables breadcrumb rich snippets.

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://olake.io/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://olake.io/blog/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Apache Iceberg Metadata Explained",
      "item": "https://olake.io/blog/2025/10/03/iceberg-metadata/"
    }
  ]
}
```

**Key Points:**
- Always start with "Home" at position 1
- Use absolute URLs for all items
- Position numbers must be sequential (1, 2, 3...)

### 1.6 FAQPage Schema (For FAQ Sections)

Enables FAQ rich snippets in Google search results.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is Iceberg a replacement for Parquet?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. This is the most fundamental misconception. Iceberg does not replace Parquet; it organizes it..."
      }
    },
    {
      "@type": "Question",
      "name": "Can you use Iceberg with other file formats?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, absolutely. The Iceberg specification is file-format-agnostic..."
      }
    }
  ]
}
```

**Key Points:**
- Each question should have a clear, concise answer
- Answers should be at least 50-100 words for best results
- Use natural language, not just keywords

### 1.7 Service Schema (For Service Pages)

Used to describe services offered by your organization.

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "AI Lake",
  "description": "OLake AI Lake enables unified data and AI pipelines over open formats like Apache Iceberg.",
  "provider": {
    "@type": "Organization",
    "name": "OLake",
    "url": "https://olake.io/"
  },
  "serviceType": "Data Lakehouse and AI Integration",
  "termsOfService": "https://datazip.io/terms-of-use",
  "url": "https://olake.io/ai-lake/"
}
```

### 1.8 Person Schema (For Authors/Team Members)

Used for author pages and team member profiles.

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Shruti Mantri",
  "jobTitle": "Staff Software Engineer",
  "worksFor": {
    "@type": "Organization",
    "name": "OLake"
  },
  "image": "https://olake.io/img/authors/shruti-mantri.webp"
}
```

---

## 2. Metadata Tags

### 2.1 Open Graph (OG) Tags

Open Graph tags control how your content appears when shared on social media platforms (Facebook, LinkedIn, Twitter, etc.).

#### Standard OG Tags (All Pages)

```html
<meta property="og:type" content="website" />
<meta property="og:title" content="Your Page Title" />
<meta property="og:description" content="Your page description (150-160 characters recommended)" />
<meta property="og:url" content="https://olake.io/your-page/" />
<meta property="og:site_name" content="OLake" />
<meta property="og:locale" content="en_US" />
<meta property="og:image" content="https://olake.io/img/logo/olake-blue.webp" />
<meta property="og:image:type" content="image/webp" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="OLake Logo" />
```

**Key Points:**
- `og:image`: Use absolute URLs, recommended size 1200x630px
- `og:image:type`: Specify image format (image/webp, image/png, image/jpeg)
- `og:image:width` and `og:image:height`: Required for proper rendering
- `og:url`: Should match canonical URL

#### Enhanced OG Tags (Blog Posts)

```html
<meta property="og:image:secure_url" content="https://olake.io/img/blog/cover/blog-cover.webp" />
```

### 2.2 Twitter Card Tags

Twitter-specific metadata for rich card displays.

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@olake.io" />
<meta name="twitter:creator" content="@cappybaradeploy" />
<meta name="twitter:title" content="Your Page Title" />
<meta name="twitter:description" content="Your page description" />
<meta name="twitter:image" content="https://olake.io/img/logo/olake-blue.webp" />
<meta name="twitter:image:alt" content="OLake Logo" />
<meta name="twitter:label1" content="Written by" />
<meta name="twitter:data1" content="Author Name" />
<meta name="twitter:label2" content="Time to read" />
<meta name="twitter:data2" content="5 minutes" />
```

**Twitter Card Types:**
- `summary`: Small card with title, description, and thumbnail
- `summary_large_image`: Large card with prominent image (recommended)
- `app`: For mobile apps
- `player`: For video/audio content

### 2.3 Standard Meta Tags

#### Basic SEO Tags

```html
<meta name="description" content="Your page description (150-160 characters)" />
<meta name="keywords" content="keyword1, keyword2, keyword3" />
<meta name="author" content="Author Name" />
<meta name="robots" content="index, follow" />
```

#### Canonical URL

```html
<link rel="canonical" href="https://olake.io/your-page/" />
```

**Key Points:**
- Always use absolute URLs
- Prevents duplicate content issues
- Should match og:url

#### Language and Locale

```html
<html lang="en">
<meta http-equiv="content-language" content="en" />
```

---

## 3. Implementation Guide

### 3.1 For Non-Docusaurus Websites

#### Option 1: Direct HTML Injection

Add JSON-LD schemas in the `<head>` section:

```html
<head>
  <!-- JSON-LD Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Your Company",
    "url": "https://yourwebsite.com/"
  }
  </script>
  
  <!-- Open Graph Tags -->
  <meta property="og:title" content="Your Page Title" />
  <meta property="og:description" content="Your description" />
  <meta property="og:image" content="https://yourwebsite.com/image.webp" />
  
  <!-- Twitter Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Your Page Title" />
</head>
```

#### Option 2: Server-Side Script

If you're using a server-side language (Node.js, Python, PHP, etc.), generate the schemas dynamically:

**Node.js/Express Example:**

```javascript
function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Your Company",
    "url": "https://yourwebsite.com/",
    "logo": {
      "@type": "ImageObject",
      "url": "https://yourwebsite.com/logo.svg",
      "width": 32,
      "height": 32
    }
  };
}

// In your template
app.get('/page', (req, res) => {
  const schema = generateOrganizationSchema();
  res.render('page', { 
    jsonLdSchema: JSON.stringify(schema)
  });
});
```

**Python/Django Example:**

```python
import json

def generate_organization_schema():
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Your Company",
        "url": "https://yourwebsite.com/"
    }

# In your template
def page_view(request):
    schema = generate_organization_schema()
    return render(request, 'page.html', {
        'json_ld_schema': json.dumps(schema)
    })
```

#### Option 3: Static Site Generators

For static site generators (Jekyll, Hugo, Gatsby, Next.js), create template partials:

**Jekyll Example:**

```liquid
<!-- _includes/json-ld-organization.html -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "{{ site.organization.name }}",
  "url": "{{ site.url }}"
}
</script>
```

**Next.js Example:**

```jsx
// components/SEO.jsx
export default function SEO({ title, description, image }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Your Company",
    "url": "https://yourwebsite.com/"
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  );
}
```

### 3.2 Best Practices

1. **Always Use Absolute URLs**: Never use relative URLs in schemas or meta tags
2. **Validate Your Schemas**: Use [Google's Rich Results Test](https://search.google.com/test/rich-results) to validate
3. **Image Requirements**:
   - OG images: 1200x630px minimum
   - Twitter images: 1200x675px for large cards
   - Use WebP format for better compression
   - Always include width and height attributes
4. **Canonical URLs**: Every page should have a canonical URL
5. **Consistent Branding**: Use the same logo and brand name across all schemas
6. **Update Regularly**: Keep social media links (`sameAs`) up to date

### 3.3 Testing Your Implementation

1. **Google Rich Results Test**: https://search.google.com/test/rich-results
2. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
3. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
4. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/

---

## 4. Complete Example: Blog Post Page

Here's a complete example of all metadata and schemas for a blog post:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Standard Meta Tags -->
  <title>Your Blog Post Title - OLake</title>
  <meta name="description" content="Your blog post description (150-160 characters)" />
  <meta name="keywords" content="keyword1, keyword2, keyword3" />
  <link rel="canonical" href="https://olake.io/blog/2025/10/03/your-post/" />
  
  <!-- Open Graph Tags -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="Your Blog Post Title" />
  <meta property="og:description" content="Your blog post description" />
  <meta property="og:url" content="https://olake.io/blog/2025/10/03/your-post/" />
  <meta property="og:site_name" content="OLake" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:image" content="https://olake.io/img/blog/cover/your-post-cover.webp" />
  <meta property="og:image:type" content="image/webp" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Blog post cover image" />
  
  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@olake.io" />
  <meta name="twitter:creator" content="@authorhandle" />
  <meta name="twitter:title" content="Your Blog Post Title" />
  <meta name="twitter:description" content="Your blog post description" />
  <meta name="twitter:image" content="https://olake.io/img/blog/cover/your-post-cover.webp" />
  <meta name="twitter:image:alt" content="Blog post cover image" />
  
  <!-- JSON-LD Schemas -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "OLake",
    "url": "https://olake.io/",
    "logo": {
      "@type": "ImageObject",
      "url": "https://olake.io/img/logo/olake-blue.svg",
      "width": 32,
      "height": 32
    },
    "sameAs": [
      "https://github.com/datazip-inc/olake",
      "https://x.com/_olake",
      "https://www.linkedin.com/company/datazipio/"
    ]
  }
  </script>
  
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Your Blog Post Title",
    "description": "Your blog post description",
    "url": "https://olake.io/blog/2025/10/03/your-post/",
    "author": {
      "@type": "Person",
      "name": "Author Name",
      "jobTitle": "Job Title"
    },
    "publisher": {
      "@type": "Organization",
      "name": "OLake",
      "logo": {
        "@type": "ImageObject",
        "url": "https://olake.io/img/logo/olake-blue.svg"
      }
    },
    "datePublished": "2025-10-03",
    "image": "https://olake.io/img/blog/cover/your-post-cover.webp"
  }
  </script>
  
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://olake.io/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://olake.io/blog/"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Your Blog Post Title",
        "item": "https://olake.io/blog/2025/10/03/your-post/"
      }
    ]
  }
  </script>
</head>
<body>
  <!-- Your page content -->
</body>
</html>
```

---

## 5. Quick Reference Checklist

### For Every Page:
- [ ] Organization schema
- [ ] WebSite schema
- [ ] WebPage schema
- [ ] Canonical URL
- [ ] Open Graph tags (og:title, og:description, og:image, og:url)
- [ ] Twitter Card tags
- [ ] Meta description tag

### For Blog Posts:
- [ ] TechArticle schema
- [ ] BreadcrumbList schema
- [ ] Author information in TechArticle
- [ ] Date published
- [ ] Reading time (if available)
- [ ] Article sections/keywords

### For FAQ Pages:
- [ ] FAQPage schema
- [ ] At least 3-5 questions with detailed answers

### For Service Pages:
- [ ] Service schema
- [ ] Service description and provider information

---

## 6. Additional Resources

- **Schema.org Documentation**: https://schema.org/
- **Google Search Central**: https://developers.google.com/search
- **Open Graph Protocol**: https://ogp.me/
- **Twitter Cards Documentation**: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards

---

## Questions?

If you have questions about implementing these SEO practices on your website, feel free to reach out! You can:
- Contact us on Twitter: [@_olake](https://x.com/_olake)
- Email us: hello@olake.io
- Check our GitHub: [github.com/datazip-inc/olake](https://github.com/datazip-inc/olake)

---

*Last Updated: December 2025*

