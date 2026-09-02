import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://abdullah-can-code.vercel.app',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
});
