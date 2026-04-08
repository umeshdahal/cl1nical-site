import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://cl1nical.dev',
  output: 'server',
  adapter: vercel(),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
