import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite'; // Use the Vite plugin for v4

export default defineConfig({
  // site: 'https://cl1nical.dev',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()], // This is the v4 requirement
  },
});