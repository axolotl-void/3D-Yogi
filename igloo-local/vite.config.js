import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

const DIST_ASSETS = path.resolve('dist/assets');

function localFirstProxy() {
  return {
    name: 'local-first-proxy',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        next();
      });
      server.middlewares.use('/assets', (req, res, next) => {
        const localPath = path.join(DIST_ASSETS, req.url);
        if (fs.existsSync(localPath)) {
          const stream = fs.createReadStream(localPath);
          stream.pipe(res);
        } else {
          next();
        }
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        next();
      });
      server.middlewares.use('/assets', (req, res, next) => {
        const localPath = path.join(DIST_ASSETS, req.url);
        if (fs.existsSync(localPath)) {
          const stream = fs.createReadStream(localPath);
          stream.pipe(res);
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [localFirstProxy()],
  server: {
    port: 3000,
    host: '::', // dual-stack: IPv6 (::1) + IPv4 (127.0.0.1) — biar Safari bisa via localhost
    // Semua aset sekarang lokal di public/assets — proxy ke igloo.inc dihapus (offline total)
  },
  preview: {
    port: 3000,
    host: '::',
    // Semua aset sekarang lokal di public/assets — proxy ke igloo.inc dihapus (offline total)
  },
  build: {
    target: 'es2019',
    minify: false,
    rollupOptions: {
      input: 'index.html',
      output: {
        format: 'es',
        entryFileNames: '[name].js'
      }
    }
  }
});
