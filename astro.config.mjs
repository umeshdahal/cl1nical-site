import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Enables React components (like your Hero.tsx) to work in Astro
  integrations: [react()],
  
  vite: {
    plugins: [
      // This is the specific requirement for Tailwind v4
      tailwindcss(),
    ],
  },
  
  // Optional: Set your site URL for sitemaps and SEO
  site: 'https://cl1nical.dev',
});