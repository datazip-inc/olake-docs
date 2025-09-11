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
  
  // Analyze content to determine schema type and generate appropriate data
  const contentAnalysis = analyzeContent(title, description, content);
  
  // Generate enhanced Article Schema (TechArticle for technical content)
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": contentAnalysis.schemaType,
    "headline": title,
    "alternativeHeadline": contentAnalysis.alternativeHeadline,
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
    "articleSection": contentAnalysis.articleSection,
    "keywords": contentAnalysis.keywords,
    "inLanguage": "en",
    "isPartOf": {
      "@type": "Blog",
      "name": "OLake Blog",
      "url": `${baseUrl}/blog`
    },
    "about": contentAnalysis.about,
    "mentions": contentAnalysis.mentions,
    "url": `${baseUrl}/blog/${slug}`,
    "wordCount": estimateWordCount(content),
    "timeRequired": `PT${Math.ceil(estimateWordCount(content) / 200)}M`
  };

  // Add tutorial schema if content is tutorial-like
  if (contentAnalysis.hasTutorial) {
    articleSchema.tutorial = contentAnalysis.tutorial;
  }

  // Add mainEntity FAQ if content has FAQs
  if (contentAnalysis.hasFAQ) {
    articleSchema.mainEntity = contentAnalysis.faqSchema;
  }

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

// Intelligent content analysis function
function analyzeContent(title, description, content) {
  const contentString = extractContentString(content);
  const titleLower = title.toLowerCase();
  const descLower = description.toLowerCase();
  const contentLower = contentString.toLowerCase();
  
  // Determine schema type based on content
  let schemaType = "Article";
  let articleSection = "Data Engineering";
  
  // Check for technical content patterns
  if (isTechnicalContent(titleLower, descLower, contentLower)) {
    schemaType = "TechArticle";
  }
  
  // Determine article section
  if (titleLower.includes('tutorial') || titleLower.includes('guide') || titleLower.includes('how to')) {
    articleSection = "Tutorial";
  } else if (titleLower.includes('comparison') || titleLower.includes('vs') || titleLower.includes('alternatives')) {
    articleSection = "Comparison";
  } else if (titleLower.includes('architecture') || titleLower.includes('design')) {
    articleSection = "Architecture";
  } else if (titleLower.includes('performance') || titleLower.includes('optimization')) {
    articleSection = "Performance";
  }
  
  // Generate alternative headline
  const alternativeHeadline = generateAlternativeHeadline(title, description, schemaType);
  
  // Generate rich keywords
  const keywords = generateRichKeywords(title, description, contentString);
  
  // Generate about section
  const about = generateAboutSection(title, description, contentString);
  
  // Generate mentions section
  const mentions = generateMentionsSection(title, description, contentString);
  
  // Check for tutorial content
  const tutorialAnalysis = detectTutorialContent(contentString);
  
  // Check for FAQ content
  const faqAnalysis = detectFAQContent(contentString);
  
  return {
    schemaType,
    articleSection,
    alternativeHeadline,
    keywords,
    about,
    mentions,
    hasTutorial: tutorialAnalysis.hasTutorial,
    tutorial: tutorialAnalysis.tutorial,
    hasFAQ: faqAnalysis.hasFAQ,
    faqSchema: faqAnalysis.faqSchema
  };
}

function isTechnicalContent(title, desc, content) {
  const technicalKeywords = [
    'apache', 'iceberg', 'mongodb', 'mysql', 'postgresql', 'kafka', 'spark', 'trino',
    'data lake', 'data warehouse', 'etl', 'elt', 'cdc', 'replication', 'synchronization',
    'kubernetes', 'docker', 'aws', 'gcp', 'azure', 's3', 'glue', 'athena',
    'performance', 'optimization', 'architecture', 'tutorial', 'guide', 'setup',
    'configuration', 'deployment', 'monitoring', 'observability'
  ];
  
  const text = `${title} ${desc} ${content}`;
  const matches = technicalKeywords.filter(keyword => text.includes(keyword));
  return matches.length >= 3; // If 3+ technical keywords, it's technical content
}

function generateAlternativeHeadline(title, description, schemaType) {
  if (schemaType === "TechArticle") {
    // For technical articles, create a more descriptive alternative
    if (title.toLowerCase().includes('mysql to apache iceberg')) {
      return "Complete guide to replicating MySQL data into Apache Iceberg for high-performance analytics";
    } else if (title.toLowerCase().includes('mongodb')) {
      return "Step-by-step tutorial for MongoDB to Apache Iceberg data replication and synchronization";
    } else if (title.toLowerCase().includes('tutorial') || title.toLowerCase().includes('guide')) {
      return `Comprehensive ${title.toLowerCase().includes('tutorial') ? 'tutorial' : 'guide'} for data engineering and lakehouse architecture`;
    } else if (title.toLowerCase().includes('performance')) {
      return "Optimize your data pipeline performance with modern lakehouse technologies";
    }
  }
  
  // Default alternative headline
  return `Learn about ${title.toLowerCase().replace(/[^\w\s]/g, '').split(' ').slice(0, 4).join(' ')} with OLake`;
}

function generateRichKeywords(title, description, content) {
  const baseKeywords = [
    'olake', 'apache iceberg', 'data lakehouse', 'etl', 'elt', 'data replication',
    'mongodb', 'mysql', 'postgresql', 'data engineering', 'analytics', 'performance'
  ];
  
  // Extract keywords from title and description
  const titleWords = title.toLowerCase().replace(/[^\w\s]/g, '').split(' ').filter(word => word.length > 3);
  const descWords = description.toLowerCase().replace(/[^\w\s]/g, '').split(' ').filter(word => word.length > 3);
  
  // Combine and deduplicate
  const allKeywords = [...baseKeywords, ...titleWords, ...descWords];
  const uniqueKeywords = [...new Set(allKeywords)];
  
  return uniqueKeywords.join(', ');
}

function generateAboutSection(title, description, content) {
  const about = [];
  
  // Always include OLake
  about.push({
    "@type": "Thing",
    "name": "OLake",
    "description": "Fastest way to replicate MongoDB data in Apache Iceberg"
  });
  
  // Add context based on content
  if (content.toLowerCase().includes('apache iceberg')) {
    about.push({
      "@type": "Thing",
      "name": "Apache Iceberg",
      "description": "An open table format for huge analytic datasets"
    });
  }
  
  if (content.toLowerCase().includes('mongodb')) {
    about.push({
      "@type": "Thing",
      "name": "MongoDB",
      "description": "A source-available cross-platform document-oriented database program"
    });
  }
  
  if (content.toLowerCase().includes('mysql')) {
    about.push({
      "@type": "Thing",
      "name": "MySQL",
      "description": "An open-source relational database management system"
    });
  }
  
  if (content.toLowerCase().includes('data lakehouse')) {
    about.push({
      "@type": "Thing",
      "name": "Data Lakehouse",
      "description": "A data management system that combines the benefits of data lakes and data warehouses"
    });
  }
  
  if (content.toLowerCase().includes('etl') || content.toLowerCase().includes('elt')) {
    about.push({
      "@type": "Thing",
      "name": "ETL/ELT",
      "description": "Data integration processes for extracting, transforming, and loading data"
    });
  }
  
  return about;
}

function generateMentionsSection(title, description, content) {
  const mentions = [];
  
  // Always mention OLake
  mentions.push({
    "@type": "SoftwareApplication",
    "name": "OLake",
    "applicationCategory": "Data Replication Tool"
  });
  
  // Add mentions based on content
  if (content.toLowerCase().includes('apache iceberg')) {
    mentions.push({
      "@type": "SoftwareApplication",
      "name": "Apache Iceberg",
      "applicationCategory": "Table Format"
    });
  }
  
  if (content.toLowerCase().includes('mongodb')) {
    mentions.push({
      "@type": "SoftwareApplication",
      "name": "MongoDB",
      "applicationCategory": "Database"
    });
  }
  
  if (content.toLowerCase().includes('mysql')) {
    mentions.push({
      "@type": "SoftwareApplication",
      "name": "MySQL",
      "applicationCategory": "Database"
    });
  }
  
  if (content.toLowerCase().includes('kafka')) {
    mentions.push({
      "@type": "SoftwareApplication",
      "name": "Apache Kafka",
      "applicationCategory": "Stream Processing"
    });
  }
  
  if (content.toLowerCase().includes('spark')) {
    mentions.push({
      "@type": "SoftwareApplication",
      "name": "Apache Spark",
      "applicationCategory": "Data Processing Engine"
    });
  }
  
  if (content.toLowerCase().includes('trino')) {
    mentions.push({
      "@type": "SoftwareApplication",
      "name": "Trino",
      "applicationCategory": "Query Engine"
    });
  }
  
  return mentions;
}

function detectTutorialContent(content) {
  const tutorialPatterns = [
    /step\s*\d+/i,
    /tutorial/i,
    /guide/i,
    /how\s+to/i,
    /setup/i,
    /configuration/i,
    /installation/i
  ];
  
  const hasTutorial = tutorialPatterns.some(pattern => pattern.test(content));
  
  if (!hasTutorial) {
    return { hasTutorial: false, tutorial: null };
  }
  
  // Extract tutorial steps
  const steps = extractTutorialSteps(content);
  
  if (steps.length === 0) {
    return { hasTutorial: false, tutorial: null };
  }
  
  const tutorial = {
    "@type": "HowTo",
    "name": "Data Replication Tutorial",
    "description": "Step-by-step guide for setting up data replication with OLake",
    "step": steps
  };
  
  return { hasTutorial: true, tutorial };
}

function extractTutorialSteps(content) {
  const steps = [];
  const lines = content.split('\n');
  
  let stepNumber = 1;
  for (const line of lines) {
    // Look for step patterns
    const stepMatch = line.match(/^(?:step\s*)?(\d+)[:\.\s]+(.+)/i);
    if (stepMatch) {
      steps.push({
        "@type": "HowToStep",
        "name": `Step ${stepNumber}`,
        "text": stepMatch[2].trim()
      });
      stepNumber++;
    }
  }
  
  return steps;
}

function detectFAQContent(content) {
  const faqPattern = /##\s*FAQ|###\s*FAQ|##\s*Frequently Asked Questions|###\s*Frequently Asked Questions/i;
  const hasFAQ = faqPattern.test(content);
  
  if (!hasFAQ) {
    return { hasFAQ: false, faqSchema: null };
  }
  
  // Use existing FAQ generation logic
  const faqSchema = generateFAQSchema({ source: content }, '', '');
  
  return { hasFAQ: true, faqSchema };
}

function extractContentString(content) {
  if (!content) return '';
  
  if (typeof content === 'string') {
    return content;
  } else if (content && typeof content === 'object') {
    if (content.source) {
      return content.source;
    } else if (content.content) {
      return content.content;
    } else {
      return JSON.stringify(content);
    }
  }
  
  return '';
}

export default BlogStructuredData;
