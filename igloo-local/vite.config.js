import { defineConfig } from 'vite';

export default defineConfig({
  // Semua aset runtime 100% lokal di public/assets — proxy igloo.inc & dist-fallback dihapus (offline total)
  server: {
    port: 3000,
    host: '::', // dual-stack IPv6+IPv4 — biar Safari & Chrome bisa akses via localhost
  },
  preview: {
    port: 3000,
    host: '::',
  },
  build: {
    target: 'es2019',
    minify: false,
    rollupOptions: {
      input: 'index.html',
      output: {
        format: 'es',
        entryFileNames: '[name].js',
      },
    },
  },
});