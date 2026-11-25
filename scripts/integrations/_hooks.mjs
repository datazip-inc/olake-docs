/**
 * Module resolution hook for the integration scripts: lets Node import the TypeScript data files
 * in src/data/integrations, which use extension-less relative imports (fine for webpack and tsc,
 * not for Node's ESM loader). Registered by the scripts with `module.register`.
 */
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

export async function resolve(specifier, context, next) {
  if (specifier.startsWith('.') && !/\.[a-z]+$/i.test(specifier) && context.parentURL) {
    const base = new URL(specifier, context.parentURL)
    for (const ext of ['.ts', '.tsx', '.js', '.mjs']) {
      const candidate = `${base.href}${ext}`
      if (fs.existsSync(fileURLToPath(candidate))) return next(candidate, context)
    }
  }
  return next(specifier, context)
}
