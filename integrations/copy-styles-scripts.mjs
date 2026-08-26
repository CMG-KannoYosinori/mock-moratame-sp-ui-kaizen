import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as sass from 'sass';

const MIME = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
};

const STYLES_DIR = path.join(process.cwd(), 'src', 'styles');

/** 公開する CSS 名 → Sass エントリ */
const STYLE_ENTRIES = {
  'theme-2026.css': 'theme-2026.scss',
  'drawer.css': 'drawer.scss',
  'ui.css': 'ui.scss',
};

function compileStyleEntry(cssName) {
  const scssName = STYLE_ENTRIES[cssName];
  if (!scssName) {
    return null;
  }

  return sass.compile(path.join(STYLES_DIR, scssName), {
    loadPaths: [STYLES_DIR],
    style: 'expanded',
  }).css;
}

function prependDevMiddleware(server) {
  // Vite の CSS 変換が /styles/*.css を先に掴んで 404 にするため、先頭に置く。
  server.middlewares.stack.unshift(
    { route: '', handle: serveFromSrc('scripts') },
    { route: '', handle: serveStyles() },
  );
}

/**
 * Sass エントリを CSS にコンパイルして /styles/*.css で配信する。
 * src/scripts は開発時も /scripts/* でそのまま配信する。
 * ビルド後の HTML では /styles/ /scripts/ /s/ を相対パスにする（Live Server 用）。
 */
export function copyStylesScriptsIntegration() {
  return {
    name: 'copy-styles-scripts',
    hooks: {
      'astro:server:setup': ({ server }) => {
        prependDevMiddleware(server);
      },
      'astro:build:done': async ({ dir }) => {
        const outDir = fileURLToPath(dir);
        const stylesDest = path.join(outDir, 'styles');
        await fsPromises.mkdir(stylesDest, { recursive: true });

        for (const cssName of Object.keys(STYLE_ENTRIES)) {
          await fsPromises.writeFile(path.join(stylesDest, cssName), compileStyleEntry(cssName));
        }

        await fsPromises.cp(path.join(process.cwd(), 'src', 'scripts'), path.join(outDir, 'scripts'), {
          recursive: true,
        });
        await rewriteLocalUrlsRelative(outDir);
        await rewriteCssIconUrlsRelative(stylesDest);
      },
    },
  };
}

/**
 * Live Server はワークスペース直下をルートにすることが多い。
 * GitHub Pages もリポジトリ名配下（/mock-moratame-sp-ui-kaizen/）がルートになる。
 * `/styles/` などのサイトルート相対だと 404 になるので、
 * 各 HTML から見た相対パスに直す（astro preview でも問題ない）。
 */
async function rewriteLocalUrlsRelative(outDir) {
  const htmlFiles = await collectHtml(outDir);
  const localUrl = /(?:href|src)="(\/(?:styles|scripts|s|ui|icons)\/[^"]+)"/g;

  for (const htmlFile of htmlFiles) {
    const htmlDir = path.dirname(htmlFile);
    let html = await fsPromises.readFile(htmlFile, 'utf8');
    html = html.replace(localUrl, (match, absPath) => {
      const target = path.join(outDir, absPath.slice(1));
      let rel = path.relative(htmlDir, target).split(path.sep).join('/');
      if (!rel.startsWith('.')) rel = `./${rel}`;
      return match.replace(absPath, rel);
    });
    await fsPromises.writeFile(htmlFile, html);
  }
}

/** dist/styles/*.css 内の /icons/ を styles からの相対パスにする（Pages 配下でも解決する） */
async function rewriteCssIconUrlsRelative(stylesDest) {
  const entries = await fsPromises.readdir(stylesDest);
  for (const name of entries) {
    if (!name.endsWith('.css')) continue;
    const filePath = path.join(stylesDest, name);
    let css = await fsPromises.readFile(filePath, 'utf8');
    const next = css.replace(/url\((['"]?)\/icons\//g, 'url($1../icons/');
    if (next !== css) {
      await fsPromises.writeFile(filePath, next);
    }
  }
}

async function collectHtml(dir) {
  const entries = await fsPromises.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectHtml(full)));
    } else if (entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

function requestPath(req) {
  return (req.originalUrl ?? req.url ?? '').split('?')[0];
}

function serveStyles() {
  return (req, res, next) => {
    const url = requestPath(req);
    if (!url.startsWith('/styles/')) return next();

    const name = decodeURIComponent(url.slice('/styles/'.length));
    if (!name || name.includes('..') || name.includes('/')) return next();

    if (!STYLE_ENTRIES[name]) return next();

    try {
      const css = compileStyleEntry(name);
      res.setHeader('Content-Type', MIME['.css']);
      res.end(css);
    } catch (error) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end(error instanceof Error ? error.message : String(error));
    }
  };
}

function serveFromSrc(subdir) {
  return (req, res, next) => {
    const url = requestPath(req);
    const prefix = `/${subdir}/`;
    if (!url.startsWith(prefix)) return next();

    const name = decodeURIComponent(url.slice(prefix.length));
    if (!name || name.includes('..') || name.includes('/')) return next();

    const filePath = path.join(process.cwd(), 'src', subdir, name);
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return next();

    res.setHeader('Content-Type', MIME[path.extname(filePath)] ?? 'application/octet-stream');
    fs.createReadStream(filePath).pipe(res);
  };
}
