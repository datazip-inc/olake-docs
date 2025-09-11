// Enhanced metadata generation functions
function generateEnhancedMetadata(frontMatter, content, siteConfig) {
  const { title, description, image, authors, tags, date, permalink } = frontMatter;
  
  // Parse date from filename or frontmatter
  const blogDate = parseBlogDate(frontMatter);
  
  // Get author information
  const authorData = getAuthorData(authors);
  
  // Detect content type
  const contentType = detectContentType(title, description, content);
  
  // Generate AI-optimized descriptions
  const aiDescription = generateAIDescription(description, title, contentType);
  
  // Generate comprehensive metadata
  const metadata = {
    // AI-Specific Meta Tags
    aiDescription: aiDescription,
    aiContentType: contentType,
    aiGenerationPrompt: generateAIPrompt(title, contentType),
    chatgptDescription: generateChatGPTDescription(description, title),
    claudeDescription: generateClaudeDescription(description, title),
    
    // Enhanced Open Graph
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogSiteName: siteConfig.title,
    ogLocale: 'en_US',
    
    // Twitter Meta
    twitterSite: '@olake.io',
    twitterCreator: authorData.length > 0 ? `@${authorData[0].socials?.linkedin || 'olake'}` : '@olake',
    
    // Author & Article Meta
    author: authorData.length > 0 ? authorData[0].name : 'OLake Team',
    articleAuthor: authorData.length > 0 ? authorData[0].name : 'OLake Team',
    articlePublishedTime: blogDate,
    articleModifiedTime: blogDate,
    
    // Bot Directives
    googlebot: 'index, follow',
    bingbot: 'index, follow',
    robots: 'index, follow',
    
    // PWA Support
    themeColor: '#203FDD',
    msapplicationTileColor: '#203FDD',
    
    // Enhanced favicon support
    appleTouchIcon: '/img/logo/olake-blue.svg',
    favicon32: '/img/logo/olake-blue.svg',
    favicon16: '/img/logo/olake-blue.svg'
  };
  
  return metadata;
}

function parseBlogDate(frontMatter) {
  // Try to extract date from filename pattern (YYYY-MM-DD)
  const filename = frontMatter.permalink || '';
  const dateMatch = filename.match(/(\d{4}-\d{2}-\d{2})/);
  
  if (dateMatch) {
    return new Date(dateMatch[1]).toISOString();
  }
  
  // Fallback to current date
  return new Date().toISOString();
}

function detectContentType(title, description, content) {
  const titleLower = title.toLowerCase();
  const descLower = description.toLowerCase();
  
  // Comparison posts
  if (titleLower.includes('vs') || titleLower.includes('comparison') || 
      titleLower.includes('debate') || titleLower.includes('alternative')) {
    return 'comparison';
  }
  
  // Tutorial/Guide posts
  if (titleLower.includes('how to') || titleLower.includes('guide') || 
      titleLower.includes('tutorial') || titleLower.includes('step-by-step') ||
      titleLower.includes('setup') || titleLower.includes('deploy')) {
    return 'tutorial';
  }
  
  // Technical deep dives
  if (titleLower.includes('deep dive') || titleLower.includes('architecture') ||
      titleLower.includes('explained') || titleLower.includes('strategies') ||
      titleLower.includes('troubleshooting') || titleLower.includes('challenges')) {
    return 'technical';
  }
  
  // Feature announcements
  if (titleLower.includes('new') || titleLower.includes('feature') ||
      titleLower.includes('enhancing') || titleLower.includes('introducing')) {
    return 'announcement';
  }
  
  // Default to technical
  return 'technical';
}

function generateAIDescription(description, title, contentType) {
  const baseDesc = description || title;
  const enhancedDesc = `${baseDesc} Learn about OLake's high-performance data replication, CDC capabilities, and Apache Iceberg integration for modern data lakehouse architectures.`;
  return enhancedDesc.substring(0, 160); // Keep under 160 chars
}

function generateAIPrompt(title, contentType) {
  const prompts = {
    'comparison': `Compare data replication tools and platforms for ${title}`,
    'tutorial': `Guide for ${title} with OLake data replication`,
    'technical': `Technical deep dive on ${title} and data engineering`,
    'announcement': `Latest features and updates for ${title}`
  };
  return prompts[contentType] || `Content about ${title} and data replication`;
}

function generateChatGPTDescription(description, title) {
  return `${description || title} This comprehensive guide covers OLake's data replication capabilities, CDC implementation, and Apache Iceberg integration for enterprise data lakehouse solutions.`;
}

function generateClaudeDescription(description, title) {
  return `${description || title} Explore OLake's advanced data engineering features, real-time CDC, and seamless integration with Apache Iceberg for scalable data lakehouse architectures.`;
}

function getAuthorData(authorIds) {
  if (!authorIds || !Array.isArray(authorIds)) return [];
  
  // Author data mapping
  const authorData = {
    'priyansh': {
      name: 'Priyansh Khodiyar',
      title: 'Ex OLake Devrel',
      image_url: '/img/authors/priyansh.jpg',
      email: 'hello@olake.io',
      socials: { linkedin: 'zriyansh' }
    },
    'sandeep': {
      name: 'Sandeep Devarapalli',
      title: 'OLake Maintainer',
      image_url: '/img/authors/sandeep.jpg',
      email: 'hello@olake.io',
      socials: { linkedin: 'sandeepdevarapalli' }
    },
    'ankit': {
      name: 'Ankit Sharma',
      title: 'OLake Maintainer',
      image_url: '/img/authors/ankit.jpg',
      email: 'hello@olake.io',
      socials: { linkedin: 'hashcode-ankit' }
    },
    'shubham': {
      name: 'Shubham Satish Baldava',
      title: 'OLake Maintainer',
      image_url: '/img/authors/shubham.jpg',
      email: 'hello@olake.io',
      socials: { linkedin: 'shubham-baldava' }
    },
    'vaibhav': {
      name: 'Vaibhav Verma',
      title: 'OLake Maintainer',
      image_url: '/img/authors/vaibhav.jpg',
      email: 'hello@olake.io',
      socials: { linkedin: 'vaibhav-verma-iiitr' }
    },
    'vikash': {
      name: 'Vikash Choudhary',
      title: 'OLake Maintainer',
      image_url: '/img/authors/vikash.jpg',
      email: 'hello@olake.io',
      socials: { linkedin: 'vikash-choudhary-939299226' }
    },
    'akshay': {
      name: 'Akshay Kumar Sharma',
      title: 'DevRel',
      image_url: '/img/authors/akshay.jpg',
      email: 'hello@olake.io',
      socials: { linkedin: 'akshay-kumar-sharma-devvoyager' }
    },
    'duke': {
      name: 'Duke',
      title: 'OLake Maintainer',
      image_url: '/img/authors/duke.jpg',
      email: 'hello@olake.io',
      socials: { linkedin: 'dukedhal' }
    },
    'schitiz': {
      name: 'Schitiz Sharma',
      title: 'OLake Maintainer',
      image_url: '/img/authors/schitiz.jpg',
      email: 'hello@olake.io',
      socials: { linkedin: 'schitizsharma' }
    }
  };
  
  return authorIds.map(id => authorData[id]).filter(Boolean);
}

module.exports = function blogStructuredDataPlugin(context, options) {
  return {
    name: 'blog-structured-data',
    configureWebpack(config, isServer) {
      return {
        resolve: {
          alias: {
            '@blog-structured-data': './components'
          }
        }
      };
    }
  };
};

// Export the metadata generation function for use in components
module.exports.generateEnhancedMetadata = generateEnhancedMetadata;
