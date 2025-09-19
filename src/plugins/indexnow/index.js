const fs = require('fs');
const path = require('path');
const https = require('https');

// IndexNow configuration
const INDEXNOW_CONFIG = {
  key: process.env.INDEXNOW_KEY || '6ee2f9f32e194ae8acb93ebd523f51ad',
  keyLocation: 'https://olake.io/indexnow-key.txt',
  searchEngines: [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow'
  ]
};

// Function to submit URLs to IndexNow
async function submitToIndexNow(urls, host = 'https://olake.io') {
  if (!INDEXNOW_CONFIG.key || INDEXNOW_CONFIG.key === 'YOUR_INDEXNOW_KEY_HERE') {
    return;
  }

  const payload = {
    host: host.replace('https://', '').replace('http://', ''),
    key: INDEXNOW_CONFIG.key,
    keyLocation: INDEXNOW_CONFIG.keyLocation,
    urlList: urls
  };


  for (const searchEngine of INDEXNOW_CONFIG.searchEngines) {
    try {
      await submitToSearchEngine(searchEngine, payload);
    } catch (error) {
      // Silently handle errors
    }
  }
}

// Submit to individual search engine
function submitToSearchEngine(url, payload) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Generate all URLs from sitemap
function generateUrlsFromSitemap(siteDir) {
  const sitemapPath = path.join(siteDir, 'sitemap.xml');
  
  if (!fs.existsSync(sitemapPath)) {
    return [];
  }

  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const urls = [];
  
  // Extract URLs from sitemap.xml
  const urlMatches = sitemap.match(/<loc>(.*?)<\/loc>/g);
  if (urlMatches) {
    urlMatches.forEach(match => {
      const url = match.replace(/<\/?loc>/g, '');
      if (url.startsWith('https://olake.io/')) {
        urls.push(url);
      }
    });
  }

  return urls;
}

// Docusaurus plugin
module.exports = function indexNowPlugin(context, options) {
  return {
    name: 'indexnow-plugin',
    
    async postBuild({ siteDir, routesPaths, outDir }) {
      // Generate URLs from sitemap
      const urls = generateUrlsFromSitemap(outDir);
      
      if (urls.length === 0) {
        return;
      }
      
      // Submit URLs to IndexNow
      await submitToIndexNow(urls);
    }
  };
};
