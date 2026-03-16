import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://ferraro-contactologia.com.ar',
  adapter: vercel(),
  output: 'static',
});
