
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Use Astro/Vercel public env variables for build-time and runtime compatibility
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'icj9mmoe';
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

export const client = createClient({
  projectId,
  dataset,
  useCdn: true,
  apiVersion: '2025-01-01'
});

const builder = imageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);