import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// Dev config: adds the Keystatic admin UI at /keystatic.
// Used only by `npm run dev` — never for production builds, since the
// admin needs server-rendered API routes and the production site is
// deployed as plain static files (no Node runtime on the host).
export default defineConfig({
  site: process.env.SITE_URL || 'https://nujeen.org',
  output: 'static',
  redirects: {
    '/': '/en',
  },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    keystatic(),
  ],
});
