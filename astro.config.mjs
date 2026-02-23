import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
  // Replace with your actual domain
  site: 'https://cl1nical.dev/',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()]
});