import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Production config: pure static output, no Node runtime required.
// The Keystatic admin (which needs server-rendered API routes) is only
// wired up in astro.config.dev.mjs, used by `npm run dev`.
export default defineConfig({
  site: process.env.SITE_URL || 'https://nujeen.org',
  output: 'static',
  redirects: {
    '/': '/en',
  },
  integrations: [tailwind({ applyBaseStyles: false })],
});
