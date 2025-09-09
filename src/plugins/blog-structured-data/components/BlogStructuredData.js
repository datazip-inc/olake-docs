import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { getAuthorData } from '../utils/authorData';
import { generateEnhancedMetadata } from '../index';

function BlogStructuredData({ frontMatter, content, metadata }) {
  const { siteConfig } = useDocusaurusContext();
  
  if (!frontMatter) return null;

  // Generate structured data
  const structuredData = generateBlogStructuredData(frontMatter, content, siteConfig);
  
  // Generate enhanced metadata
  const enhancedMetadata = generateEnhancedMetadata(frontMatter, content, siteConfig);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData.article, null, 0)
        }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData.breadcrumb, null, 0)
        }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData.organization, null, 0)
        }}
      />
      
      {structuredData.faq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData.faq, null, 0)
          }}
        />
      )}

      {/* AI-Specific Meta Tags */}
      <meta name="ai-description" content={enhancedMetadata.aiDescription} />
      <meta name="ai-content-type" content={enhancedMetadata.aiContentType} />
      <meta name="ai-generation-prompt" content={enhancedMetadata.aiGenerationPrompt} />
      <meta name="chatgpt-description" content={enhancedMetadata.chatgptDescription} />
      <meta name="claude-description" content={enhancedMetadata.claudeDescription} />

      {/* Enhanced Open Graph Meta Tags */}
      <meta property="og:image:width" content={enhancedMetadata.ogImageWidth} />
      <meta property="og:image:height" content={enhancedMetadata.ogImageHeight} />
      <meta property="og:site_name" content={enhancedMetadata.ogSiteName} />
      <meta property="og:locale" content={enhancedMetadata.ogLocale} />

      {/* Enhanced Twitter Meta Tags */}
      <meta name="twitter:site" content={enhancedMetadata.twitterSite} />
      <meta name="twitter:creator" content={enhancedMetadata.twitterCreator} />

      {/* Author and Article Meta Tags */}
      <meta name="author" content={enhancedMetadata.author} />
      <meta property="article:author" content={enhancedMetadata.articleAuthor} />
      <meta property="article:published_time" content={enhancedMetadata.articlePublishedTime} />
      <meta property="article:modified_time" content={enhancedMetadata.articleModifiedTime} />

      {/* Bot Directives */}
      <meta name="googlebot" content={enhancedMetadata.googlebot} />
      <meta name="bingbot" content={enhancedMetadata.bingbot} />
      <meta name="robots" content={enhancedMetadata.robots} />

      {/* PWA Support Meta Tags */}
      <meta name="theme-color" content={enhancedMetadata.themeColor} />
      <meta name="msapplication-TileColor" content={enhancedMetadata.msapplicationTileColor} />

      {/* Enhanced Favicon Support */}
      <link rel="apple-touch-icon" sizes="180x180" href={enhancedMetadata.appleTouchIcon} />
      <link rel="icon" type="image/png" sizes="32x32" href={enhancedMetadata.favicon32} />
      <link rel="icon" type="image/png" sizes="16x16" href={enhancedMetadata.favicon16} />
    </>
  );
}

function generateBlogStructuredData(frontMatter, content, siteConfig) {
  const { title, description, image, authors, tags, date } = frontMatter;
  const baseUrl = siteConfig.url;
  const slug = frontMatter.slug || 'unknown';
  
  // Get author information
  const authorData = getAuthorData(authors);
  
  // Generate Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": {
      "@type": "ImageObject",
      "url": `${baseUrl}${image}`,
      "width": 1200,
      "height": 630
    },
    "author": authorData.map(author => ({
      "@type": "Person",
      "name": author.name,
      "jobTitle": author.title,
      "image": `${baseUrl}${author.image_url}`,
      "email": author.email,
      "sameAs": author.socials?.linkedin ? `https://linkedin.com/in/${author.socials.linkedin}` : undefined
    })).filter(author => author.name),
    "publisher": {
      "@type": "Organization",
      "name": "OLake",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/img/logo/olake-blue.svg`,
        "width": 200,
        "height": 60
      },
      "url": baseUrl,
      "sameAs": [
        "https://github.com/datazip-inc/olake",
        "https://join.slack.com/t/getolake/shared_invite/zt-2uyphqf69-KQxih9Gwd4GCQRD_XFcuyw"
      ]
    },
    "datePublished": date,
    "dateModified": date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${slug}`
    },
    "articleSection": "Data Engineering",
    "keywords": tags || [],
    "url": `${baseUrl}/blog/${slug}`,
    "wordCount": estimateWordCount(content),
    "timeRequired": `PT${Math.ceil(estimateWordCount(content) / 200)}M`
  };

  // Generate BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${baseUrl}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": title,
        "item": `${baseUrl}/blog/${slug}`
      }
    ]
  };

  // Generate Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "OLake",
    "description": "Fastest way to replicate MongoDB data in Apache Iceberg",
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/img/logo/olake-blue.svg`,
      "width": 200,
      "height": 60
    },
    "foundingDate": "2023",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "hello@olake.io"
    },
    "sameAs": [
      "https://github.com/datazip-inc/olake",
      "https://join.slack.com/t/getolake/shared_invite/zt-2uyphqf69-KQxih9Gwd4GCQRD_XFcuyw"
    ]
  };

  // Generate FAQ Schema (if content contains FAQ sections)
  const faqSchema = generateFAQSchema(content, baseUrl, slug);

  return {
    article: articleSchema,
    breadcrumb: breadcrumbSchema,
    organization: organizationSchema,
    faq: faqSchema
  };
}

function estimateWordCount(content) {
  if (!content) return 0;
  
  // Handle different content types
  let contentString = '';
  if (typeof content === 'string') {
    contentString = content;
  } else if (content && typeof content === 'object') {
    // If content is an object, try to extract text from it
    if (content.source) {
      contentString = content.source;
    } else if (content.content) {
      contentString = content.content;
    } else {
      // Fallback: convert object to string
      contentString = JSON.stringify(content);
    }
  }
  
  if (!contentString) return 0;
  
  // Remove markdown syntax and count words
  const cleanContent = contentString.replace(/[#*`\[\]()]/g, '').replace(/\s+/g, ' ');
  return cleanContent.split(' ').length;
}

function generateFAQSchema(content, baseUrl, slug) {
  if (!content) return null;
  
  // Handle different content types
  let contentString = '';
  if (typeof content === 'string') {
    contentString = content;
  } else if (content && typeof content === 'object') {
    if (content.source) {
      contentString = content.source;
    } else if (content.content) {
      contentString = content.content;
    } else {
      contentString = JSON.stringify(content);
    }
  }
  
  if (!contentString) return null;
  
  // Look for FAQ patterns in content
  const faqPattern = /##\s*FAQ|###\s*FAQ|##\s*Frequently Asked Questions|###\s*Frequently Asked Questions/i;
  if (!faqPattern.test(contentString)) return null;
  
  // Extract FAQ questions and answers
  const faqs = [];
  const lines = contentString.split('\n');
  
  let currentQuestion = null;
  let currentAnswer = [];
  let inFAQSection = false;
  
  for (const line of lines) {
    if (faqPattern.test(line)) {
      inFAQSection = true;
      continue;
    }
    
    if (inFAQSection) {
      // Check if this is a question (starts with ## or ###)
      if (line.match(/^#{2,3}\s+(.+)/)) {
        // Save previous FAQ if exists
        if (currentQuestion && currentAnswer.length > 0) {
          faqs.push({
            "@type": "Question",
            "name": currentQuestion,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": currentAnswer.join(' ').trim()
            }
          });
        }
        
        // Start new FAQ
        currentQuestion = line.replace(/^#{2,3}\s+/, '').trim();
        currentAnswer = [];
      } else if (currentQuestion && line.trim()) {
        // Add to current answer
        currentAnswer.push(line.trim());
      }
    }
  }
  
  // Add last FAQ
  if (currentQuestion && currentAnswer.length > 0) {
    faqs.push({
      "@type": "Question",
      "name": currentQuestion,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": currentAnswer.join(' ').trim()
      }
    });
  }
  
  if (faqs.length === 0) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs
  };
}

export default BlogStructuredData;
