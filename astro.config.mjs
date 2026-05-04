import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://meteopolis.com',
  output: 'static',
  adapter: cloudflare({ mode: 'directory' }),
  vite: {
    plugins: [tailwindcss()],
  },
});
