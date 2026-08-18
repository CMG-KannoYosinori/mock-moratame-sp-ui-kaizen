import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MIME = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
};

/**
 * src/styles → dist/styles、src/scripts → dist/scripts にそのまま出力する。
 * 開発時も /styles/* /scripts/* で src 配下を配信する。
 */
export function copyStylesScriptsIntegration() {
  return {
    name: 'copy-styles-scripts',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [
              {
                name: 'serve-src-styles-scripts',
                configureServer(server) {
                  for (const subdir of ['styles', 'scripts']) {
                    server.middlewares.use(serveFromSrc(subdir));
                  }
                },
              },
            ],
          },
        });
      },
      'astro:build:done': async ({ dir }) => {
        const outDir = fileURLToPath(dir);
        for (const subdir of ['styles', 'scripts']) {
          const src = path.join(process.cwd(), 'src', subdir);
          const dest = path.join(outDir, subdir);
          await fsPromises.cp(src, dest, { recursive: true });
        }
      },
    },
  };
}

function serveFromSrc(subdir) {
  return (req, res, next) => {
    const url = req.url?.split('?')[0] ?? '';
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
