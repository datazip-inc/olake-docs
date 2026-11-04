const fs = require('fs');
const path = require('path');
const clientRedirects = require('@docusaurus/plugin-client-redirects');

/**
 * Wraps @docusaurus/plugin-client-redirects.
 *
 * Docusaurus builds each redirect target with normalizeUrl(), which deletes the slash in front of a
 * `#anchor` or `?query` ("/docs/connectors/mysql/#configuration" becomes "/docs/connectors/mysql#configuration").
 * With trailingSlash: true the slash-less path is itself a redirect, so every such stub forwarded
 * through a second hop, and its canonical/meta refresh pointed at a non-canonical URL.
 *
 * After the stubs are written, this puts the slash back in the meta refresh, canonical link and JS
 * fallback of every stub. Nothing else about the plugin changes.
 */

const STUB_URL = /http-equiv="?refresh"? content="?\d+;\s*url=([^"'>\s]+)/i;

function withSlash(target) {
  if (!target.startsWith('/')) return target; // external or relative target: leave alone
  const match = /^([^#?]*)([#?].*)$/.exec(target);
  if (!match) return target;
  const [, pathname, rest] = match;
  if (!pathname || pathname.endsWith('/') || /\.[a-z0-9]{2,5}$/i.test(pathname)) return target;
  return `${pathname}/${rest}`;
}

function fixStubs(dir) {
  let fixed = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      fixed += fixStubs(full);
      continue;
    }
    if (entry.name !== 'index.html') continue;
    const html = fs.readFileSync(full, 'utf8');
    // Real pages are large; redirect stubs are a few hundred bytes
    if (html.length > 2000) continue;
    const match = STUB_URL.exec(html);
    if (!match) continue;
    const next = withSlash(match[1]);
    if (next === match[1]) continue;
    fs.writeFileSync(full, html.split(match[1]).join(next), 'utf8');
    fixed += 1;
  }
  return fixed;
}

module.exports = async function clientRedirectsSlash(context, options) {
  const factory = clientRedirects.default || clientRedirects;
  const plugin = await factory(context, options);
  const originalPostBuild = plugin.postBuild;
  return {
    ...plugin,
    async postBuild(props) {
      await originalPostBuild(props);
      const fixed = fixStubs(props.outDir);
      console.log(`[client-redirects-slash] added the trailing slash to ${fixed} redirect targets`);
    }
  };
};

// Docusaurus validates plugin options with the validateOptions exported by the plugin module
module.exports.validateOptions = clientRedirects.validateOptions;
