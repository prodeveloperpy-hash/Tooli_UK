import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const siteUrl = 'https://www.tooli.uk';

const read = (path) => readFile(join(root, path), 'utf8');
const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

// Reads SEO fields from the same route data used by React, keeping generated
// tags in sync with the visible page without maintaining a second large list.
function extractEntries(source, prefix, type = 'website') {
  const entries = [];
  const blocks = source.split(/\n\s*\{\s*slug:\s*/).slice(1);
  for (const block of blocks) {
    const slug = block.match(/^'([^']+)'/)?.[1];
    const title = block.match(/\n\s*metaTitle:\s*'((?:\\'|[^'])*)'/)?.[1];
    const description = block.match(/\n\s*metaDescription:\s*\n?\s*'((?:\\'|[^'])*)'/)?.[1];
    const image = block.match(/\n\s*image:\s*'((?:\\'|[^'])*)'/)?.[1];
    const publishedTime = block.match(/\n\s*datePublished:\s*'([^']+)'/)?.[1];
    if (!slug || !title || !description) continue;
    entries.push({
      path: `${prefix}/${slug}`,
      title: title.replaceAll("\\'", "'"),
      description: description.replaceAll("\\'", "'"),
      image: image ? new URL(image, siteUrl).href : `${siteUrl}/images/logo.webp`,
      type,
      publishedTime,
    });
  }
  return entries;
}

const core = [
  ['/', 'Compare Tool & Plant Hire Prices Across the UK | Tooli UK', 'Compare tool and plant hire prices from trusted UK suppliers. Search by equipment, postcode and hire period to find the right option for your project.'],
  ['/about', 'About Tooli UK | Tool & Plant Hire Comparison', 'Learn how Tooli UK helps customers compare tool and plant hire options from trusted suppliers across the United Kingdom.'],
  ['/how-it-works', 'How Tooli UK Works | Compare Tool Hire Prices', 'See how to compare tool and plant hire prices by equipment, postcode and hire period with Tooli UK.'],
  ['/suppliers', 'Tool Hire Suppliers UK | Join Tooli UK', 'Discover trusted tool and plant hire suppliers across the UK or register your hire business with Tooli UK.'],
  ['/help', 'Help Centre | Tooli UK', 'Get help using Tooli UK to search for equipment and compare tool and plant hire suppliers.'],
  ['/blog', 'Tool Hire & Plant Hire Guides | Tooli UK Blog', 'Read practical UK tool hire and plant hire guides, price comparisons, safety advice and equipment tips from Tooli UK.'],
].map(([path, title, description]) => ({ path, title, description, image: `${siteUrl}/images/logo.webp`, type: 'website' }));

// Application/account URLs must be crawlable so bots can see `noindex`, but
// they must never inherit the homepage canonical from the SPA fallback.
const nonIndexable = [
  ['/search', 'Search Tool & Plant Hire | Tooli UK'],
  ['/login', 'Log in | Tooli UK'],
  ['/signup', 'Create an account | Tooli UK'],
  ['/dashboard', 'Dashboard | Tooli UK'],
].map(([path, title]) => ({
  path,
  title,
  description: 'Tooli UK account and search application page.',
  image: `${siteUrl}/images/logo.webp`,
  type: 'website',
  robots: 'noindex, follow',
}));

const [template, sitemap, equipmentSource, locationSource, blogSource] = await Promise.all([
  read('dist/index.html'),
  read('public/sitemap.xml'),
  read('src/app/data/equipment.tsx'),
  read('src/app/data/locations.tsx'),
  read('src/app/pages/BlogPage.tsx'),
]);

const entries = [
  ...core,
  ...nonIndexable,
  ...extractEntries(equipmentSource, '/equipment'),
  ...extractEntries(locationSource, '/locations'),
  ...extractEntries(blogSource, '/blog', 'article'),
];
const byPath = new Map(entries.map((entry) => [entry.path, entry]));
const sitemapPaths = [...sitemap.matchAll(/<loc>https:\/\/www\.tooli\.uk(\/[^<]*)<\/loc>/g)]
  .map((match) => match[1].replace(/\/$/, '') || '/');
const missing = sitemapPaths.filter((path) => !byPath.has(path));
if (missing.length) throw new Error(`Missing SEO metadata for sitemap routes:\n${missing.join('\n')}`);

function renderHead(entry) {
  const canonical = entry.path === '/' ? `${siteUrl}/` : `${siteUrl}${entry.path}`;
  const tags = [
    `<title>${escapeHtml(entry.title)}</title>`,
    `<meta name="description" content="${escapeHtml(entry.description)}" />`,
    `<meta name="robots" content="${entry.robots ?? 'index, follow'}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    '<meta property="og:site_name" content="Tooli UK" />',
    `<meta property="og:title" content="${escapeHtml(entry.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(entry.description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:type" content="${entry.type}" />`,
    `<meta property="og:image" content="${escapeHtml(entry.image)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeHtml(entry.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(entry.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(entry.image)}" />`,
  ];
  if (entry.publishedTime) tags.push(`<meta property="article:published_time" content="${entry.publishedTime}" />`);
  return tags.join('\n    ');
}

const cleanTemplate = template
  .replace(/\s*<title>[\s\S]*?<\/title>/i, '')
  .replace(/\s*<meta\s+(?:name|property)="(?:description|robots|og:[^"]+|twitter:[^"]+)"[^>]*>/gi, '')
  .replace(/\s*<link\s+rel="canonical"[^>]*>/gi, '');

const outputPaths = [...new Set([...sitemapPaths, ...nonIndexable.map(({ path }) => path)])];
for (const path of outputPaths) {
  const entry = byPath.get(path);
  const html = cleanTemplate.replace('</head>', `    ${renderHead(entry)}\n  </head>`);
  const output = path === '/' ? 'dist/index.html' : `dist${path}/index.html`;
  await mkdir(join(root, dirname(output)), { recursive: true });
  await writeFile(join(root, output), html);
}

console.log(`Generated route-specific initial HTML for ${sitemapPaths.length} sitemap entries and ${nonIndexable.length} noindex application routes.`);
