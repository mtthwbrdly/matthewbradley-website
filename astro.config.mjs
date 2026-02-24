// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

import sanity from '@sanity/astro';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    // Provide Sanity settings explicitly so the integration can initialize
    // the client during SSR/build. These fall back to env vars when available.
    sanity({
      projectId: process.env.PUBLIC_SANITY_PROJECT_ID || 'icj9mmoe',
      dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
      apiVersion: '2025-01-01',
      useCdn: true,
    }),
  ],
});