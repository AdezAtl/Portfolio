import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://abdullah-can-code.vercel.app',
  integrations: [
    tailwind({ applyBaseStyles: false }),
  ],
});
