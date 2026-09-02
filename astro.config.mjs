import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://abdullah-can-code.vercel.app',
  vite: {
    plugins: [tailwindcss()],
  },
});
