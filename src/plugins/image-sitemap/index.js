/**
 * @type {import('@docusaurus/types').Plugin}
 */
function imageSitemapPlugin() {
  return {
    name: 'image-sitemap',
    async postBuild({ siteConfig, outDir }) {
      const fs = require('fs').promises;
      const path = require('path');
      
      console.log('🔄 Starting image sitemap generation...');
      
      const { url } = siteConfig;
      const staticDir = path.join(process.cwd(), 'static');
      const imageSitemapPath = path.join(outDir, 'image-sitemap.xml');
      
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
        
        console.log(`📸 Found ${imageFiles.length} images for sitemap generation`);
        
        // Generate XML sitemap for images
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
        xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';
        
        // Sort images by path for consistent output
        const sortedImages = imageFiles.sort((a, b) => a.path.localeCompare(b.path));
        
        for (const image of sortedImages) {
          const imageUrl = `${url}${image.path}`;
          const lastMod = image.lastModified.toISOString().split('T')[0];
          
          xml += '  <url>\n';
          xml += `    <loc>${url}/</loc>\n`;
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
          }
          
          xml += `      <image:caption>${caption}</image:caption>\n`;
          xml += '    </image:image>\n';
          xml += '  </url>\n';
        }
        
        xml += '</urlset>';
        
        // Write the sitemap file
        await fs.writeFile(imageSitemapPath, xml, 'utf8');
        
        console.log(`✅ Generated image sitemap with ${imageFiles.length} images: ${imageSitemapPath}`);
      } catch (error) {
        console.error('❌ Error generating image sitemap:', error);
      }
    },
  };
}

module.exports = imageSitemapPlugin;
