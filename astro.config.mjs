import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';

// Single config for dev and production. `output: 'static'` keeps the public
// pages prerendered; the Keystatic admin (/keystatic) and its API routes are
// served on demand via the Vercel adapter.
export default defineConfig({
  site: process.env.SITE_URL || 'https://nujeen.org',
  output: 'static',
  adapter: vercel(),
  redirects: {
    '/': '/en',
  },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    keystatic(),
  ],
});
