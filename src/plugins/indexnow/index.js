const fs = require('fs');
const path = require('path');
const https = require('https');

// IndexNow configuration
const INDEXNOW_CONFIG = {
  key: process.env.INDEXNOW_KEY || '6ee2f9f32e194ae8acb93ebd523f51ad',
  keyLocation: 'https://olake.io/indexnow-key.txt',
  // api.indexnow.org forwards every submission to all participating engines (Bing, Yandex, ...),
  // so posting to the others as well only sends the same payload twice.
  searchEngines: ['https://api.indexnow.org/indexnow']
};

// Only the production deploy (a push to master) may notify search engines. Local builds,
// PR test builds and scratch builds must not submit the live sitemap.
function isProductionDeploy() {
  return process.env.GITHUB_EVENT_NAME === 'push' && process.env.GITHUB_REF === 'refs/heads/master';
}

// IndexNow accepts at most 10,000 URLs per request
const MAX_URLS_PER_REQUEST = 10000;
// 200 = URLs received, 202 = received, key validation still pending (both are success)
const SUCCESS_STATUSES = [200, 202];

// Function to submit URLs to IndexNow. Never throws: a failed submission must not fail the build.
async function submitToIndexNow(urls, host = 'https://olake.io') {
  if (!INDEXNOW_CONFIG.key || INDEXNOW_CONFIG.key === 'YOUR_INDEXNOW_KEY_HERE') {
    return;
  }

  for (let i = 0; i < urls.length; i += MAX_URLS_PER_REQUEST) {
    const batch = urls.slice(i, i + MAX_URLS_PER_REQUEST);
    const payload = {
      host: host.replace('https://', '').replace('http://', ''),
      key: INDEXNOW_CONFIG.key,
      keyLocation: INDEXNOW_CONFIG.keyLocation,
      urlList: batch
    };

    for (const searchEngine of INDEXNOW_CONFIG.searchEngines) {
      try {
        const { statusCode, body } = await submitToSearchEngine(searchEngine, payload);
        const ok = SUCCESS_STATUSES.includes(statusCode);
        console.log(
          `[indexnow] ${ok ? 'submitted' : 'FAILED'} ${batch.length} URLs to ${searchEngine}: HTTP ${statusCode}${body ? ` ${body}` : ''}`
        );
      } catch (error) {
        console.warn(`[indexnow] request to ${searchEngine} failed: ${error.message}`);
      }
    }
  }
}

// Submit to individual search engine. Resolves with the status code and a short body for any
// HTTP response; rejects only on network errors and timeouts.
function submitToSearchEngine(url, payload) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 30000
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: data.trim().slice(0, 200) });
      });
    });

    req.on('timeout', () => req.destroy(new Error('timeout after 30s')));
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
      if (!isProductionDeploy()) {
        return;
      }

      try {
        // Generate URLs from sitemap
        const urls = generateUrlsFromSitemap(outDir);

        if (urls.length === 0) {
          console.log('[indexnow] no URLs found in sitemap.xml, nothing to submit');
          return;
        }

        // Submit URLs to IndexNow
        await submitToIndexNow(urls);
      } catch (error) {
        console.warn(`[indexnow] skipped: ${error.message}`);
      }
    }
  };
};
