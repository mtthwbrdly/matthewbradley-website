import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: 'icj9mmoe', // find this in sanity/sanity.config.js or on sanity.io/manage
  dataset: 'production',
  useCdn: true,
  apiVersion: '2025-01-01'
});

const builder = imageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);