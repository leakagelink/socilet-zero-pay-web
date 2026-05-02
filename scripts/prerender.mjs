/**
 * Build-time prerendering script for Socilet.
 *
 * After `vite build`, this script:
 *   1. Spins up a static file server serving `dist/`
 *   2. Loads each route in headless Chromium, lets React + Helmet render
 *   3. Saves the fully-rendered HTML to `dist/<route>/index.html`
 *
 * Result: Google, Bing, GPTBot, ClaudeBot, etc. receive unique, fully-populated
 * HTML for every route — no JavaScript execution required.
 */

import { createServer } from 'http';
import { readFile, writeFile, mkdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', 'dist');
const PORT = 4567;

// ---------------------------------------------------------------------------
// Routes to prerender
// ---------------------------------------------------------------------------
const STATIC_ROUTES = [
  '/',
  '/blog',
  '/zero-advance-payment',
  '/website-development',
  '/app-development',
  '/ai-spokesperson',
  '/business-profile',
  '/hire-indian-developer',
  '/faq',
  '/affiliate',
  '/track-project',
  '/terms-of-service',
  '/privacy-policy',
  '/cookie-policy',
];

// Blog slugs are read from src/data/blogData.ts at build time so this list
// stays in sync automatically when new posts are added.
const { getBlogSlugs } = await import('./generate-blog-sitemap.mjs');
const BLOG_SLUGS = await getBlogSlugs();

const ROUTES = [...STATIC_ROUTES, ...BLOG_SLUGS.map((s) => `/blog/${s}`)];

// ---------------------------------------------------------------------------
// Tiny static server
// ---------------------------------------------------------------------------
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
};

function startServer() {
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      let filePath = path.join(DIST, urlPath);
      try {
        const s = await stat(filePath);
        if (s.isDirectory()) filePath = path.join(filePath, 'index.html');
      } catch {
        // SPA fallback for unknown routes — the page itself will set up Helmet.
        filePath = path.join(DIST, 'index.html');
      }
      const ext = path.extname(filePath).toLowerCase();
      const data = await readFile(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(data);
    } catch (err) {
      res.writeHead(404);
      res.end('Not found');
    }
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

// ---------------------------------------------------------------------------
// Prerender one route
// ---------------------------------------------------------------------------
async function prerenderRoute(browser, route) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (compatible; SociletPrerender/1.0)');
  // Block heavy 3rd-party requests to keep build fast & deterministic.
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const url = req.url();
    const blocked = [
      'googletagmanager.com',
      'google-analytics.com',
      'googlesyndication.com',
      'doubleclick.net',
      'facebook.net',
      'agora.io',
    ];
    if (blocked.some((d) => url.includes(d))) return req.abort();
    req.continue();
  });

  const url = `http://localhost:${PORT}${route}`;
  try {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 45000 });
    // Give Helmet + lazy components a beat to settle.
    await new Promise((r) => setTimeout(r, 500));

    const html = await page.evaluate(() => {
      // Strip any dev-only scripts but keep React hydration script tags.
      return '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
    });

    const outDir = route === '/' ? DIST : path.join(DIST, route);
    if (!existsSync(outDir)) await mkdir(outDir, { recursive: true });
    const outFile = path.join(outDir, 'index.html');
    await writeFile(outFile, html, 'utf8');
    console.log(`✓ ${route}  →  ${path.relative(DIST, outFile)}`);
  } catch (err) {
    console.warn(`✗ ${route}  →  ${err.message}`);
  } finally {
    await page.close();
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  if (!existsSync(DIST)) {
    console.error('dist/ not found — run `vite build` first.');
    process.exit(1);
  }

  console.log(`Prerendering ${ROUTES.length} routes…`);
  const server = await startServer();
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  // Render in small batches to avoid Chromium memory spikes.
  const BATCH = 4;
  for (let i = 0; i < ROUTES.length; i += BATCH) {
    const slice = ROUTES.slice(i, i + BATCH);
    await Promise.all(slice.map((r) => prerenderRoute(browser, r)));
  }

  await browser.close();
  server.close();
  console.log('Prerendering complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
