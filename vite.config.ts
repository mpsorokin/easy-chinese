import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { minimal2023Preset } from '@vite-pwa/assets-generator/config';

const PAPER = '#f7f2e8'; // --paper in src/styles/base.css

// The icon already has a full-bleed paper background with the glyph inside the maskable
// safe zone, so the padded variants (Android maskable, iOS home screen) need no extra padding.
const opaque = { padding: 0, resizeOptions: { background: PAPER } };
const iconPreset = {
  ...minimal2023Preset,
  maskable: { ...minimal2023Preset.maskable, ...opaque },
  apple: { ...minimal2023Preset.apple, ...opaque },
};

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      // PNG icons, favicon.ico and apple-touch-icon are generated from icon.svg at build
      // time and injected into the manifest and index.html.
      pwaAssets: {
        image: 'public/icon.svg',
        preset: iconPreset,
        injectThemeColor: false, // index.html sets the browser color from the active theme.
      },
      manifest: {
        name: 'Hanzi Copybook',
        short_name: 'Hanzi',
        lang: 'en',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: PAPER,
        background_color: PAPER,
      },
      workbox: {
        // App shell plus every stroke-data file (public/hanzi/*.json): fully offline.
        globPatterns: ['**/*.{js,css,html,svg,png,webp,ico,json,webmanifest}'],
        // The worksheet PDF code (pdf-lib, ~420 KB) is only needed for printing: keep it out
        // of the install and cache it the first time it is used (below).
        globIgnores: ['**/assets/worksheetPdf-*.js'],
        runtimeCaching: [
          {
            urlPattern: /\/assets\/worksheetPdf-[\w-]+\.js$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'worksheet-pdf',
              expiration: { maxEntries: 2 },
            },
          },
        ],
      },
    }),
  ],
  build: {
    // Raster images stay separate files: inlined as base64 into CSS they are copied once per
    // url() (lesson.css uses hills.webp three times) and cannot be cached on their own.
    // Small SVG icons are still inlined.
    assetsInlineLimit: (file) => (file.endsWith('.webp') ? false : undefined),
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
