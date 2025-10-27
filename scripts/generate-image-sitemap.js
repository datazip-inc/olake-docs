#!/usr/bin/env node

/**
 * Script to generate image sitemap for all static images
 */

const fs = require('fs').promises;
const path = require('path');

async function generateImageSitemap() {
  
  const staticDir = path.join(__dirname, '../static');
  const buildDir = path.join(__dirname, '../build');
  const imageSitemapPath = path.join(buildDir, 'image-sitemap.xml');
  const siteUrl = 'https://olake.io';
  
  try {
    // Recursively find all image files
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif'];
    const imageFiles = [];
    
    const scanDirectory = async (dir) => {
      const items = await fs.readdir(dir, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        
        if (item.isDirectory()) {
          await scanDirectory(fullPath);
        } else if (item.isFile()) {
          const ext = path.extname(item.name).toLowerCase();
          if (imageExtensions.includes(ext)) {
            // Convert to web path (remove static/ prefix)
            const webPath = fullPath.replace(staticDir, '');
            imageFiles.push({
              path: webPath,
              fullPath: fullPath,
              name: item.name,
              ext: ext,
              lastModified: (await fs.stat(fullPath)).mtime
            });
          }
        }
      }
    };
    
    await scanDirectory(staticDir);
    
    
    // Generate XML sitemap for images only (no page URLs to avoid duplicates)
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';
    
    // Sort images by path for consistent output
    const sortedImages = imageFiles.sort((a, b) => a.path.localeCompare(b.path));
    
    // Only include images that are referenced on actual pages
    // Skip standalone images that aren't used on pages
    const pageImages = sortedImages.filter(image => {
      // Only include images that are likely used on pages
      return image.path.includes('/blog/') || 
             image.path.includes('/docs/') || 
             image.path.includes('/webinar/') ||
             image.path.includes('/connectors/') ||
             image.path.includes('/iceberg/') ||
             image.path.includes('/logo/') ||
             image.path.includes('/authors/');
    });
    
    // Group images by their page context for better organization
    const imagesByPage = {};
    
    for (const image of pageImages) {
      // Determine the page URL based on image path
      let pageUrl = siteUrl + '/';
      if (image.path.includes('/blog/')) {
        pageUrl = siteUrl + '/blog';
      } else if (image.path.includes('/docs/')) {
        pageUrl = siteUrl + '/docs';
      } else if (image.path.includes('/iceberg/')) {
        pageUrl = siteUrl + '/iceberg';
      } else if (image.path.includes('/webinar/')) {
        pageUrl = siteUrl + '/webinar';
      } else if (image.path.includes('/connectors/')) {
        pageUrl = siteUrl + '/connectors';
      }
      
      // Group images by page URL
      if (!imagesByPage[pageUrl]) {
        imagesByPage[pageUrl] = [];
      }
      imagesByPage[pageUrl].push(image);
    }
    
    // Generate XML for each page with its images
    for (const [pageUrl, pageImages] of Object.entries(imagesByPage)) {
      const lastMod = pageImages[0].lastModified.toISOString().split('T')[0];
      
      xml += '  <url>\n';
      xml += `    <loc>${pageUrl}</loc>\n`;
      xml += `    <lastmod>${lastMod}</lastmod>\n`;
      
      // Add all images for this page
      for (const image of pageImages) {
        const imageUrl = `${siteUrl}${image.path}`;
        
        xml += '    <image:image>\n';
        xml += `      <image:loc>${imageUrl}</image:loc>\n`;
        
        // Generate title from filename
        const title = image.name
          .replace(/\.[^/.]+$/, '') // Remove extension
          .replace(/[-_]/g, ' ') // Replace dashes and underscores with spaces
          .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize words
        
        xml += `      <image:title>${title}</image:title>\n`;
        
        // Generate caption based on path context
        let caption = title;
        if (image.path.includes('/blog/')) {
          caption = `Blog image: ${title}`;
        } else if (image.path.includes('/docs/')) {
          caption = `Documentation image: ${title}`;
        } else if (image.path.includes('/webinar/')) {
          caption = `Webinar image: ${title}`;
        } else if (image.path.includes('/connectors/')) {
          caption = `Connector image: ${title}`;
        } else if (image.path.includes('/iceberg/')) {
          caption = `Iceberg image: ${title}`;
        } else if (image.path.includes('/logo/')) {
          caption = `OLake logo: ${title}`;
        } else if (image.path.includes('/authors/')) {
          caption = `Author image: ${title}`;
        }
        
        xml += `      <image:caption>${caption}</image:caption>\n`;
        xml += '    </image:image>\n';
      }
      
      xml += '  </url>\n';
    }
    
    xml += '</urlset>';
    
    // Ensure build directory exists
    await fs.mkdir(buildDir, { recursive: true });
    
    // Write the sitemap file
    await fs.writeFile(imageSitemapPath, xml, 'utf8');
    
    
    // Show some sample images
    
  } catch (error) {
    console.error('❌ Error generating image sitemap:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  generateImageSitemap();
}

module.exports = generateImageSitemap;
