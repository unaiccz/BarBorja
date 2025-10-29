 // @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server', // Modo servidor - permite páginas dinámicas
  adapter: node({
    mode: 'standalone'
  }),
  vite: {
    define: {
      'import.meta.env.PUBLIC_SUPABASE_URL': JSON.stringify(process.env.PUBLIC_SUPABASE_URL),
      'import.meta.env.PUBLIC_SUPABASE_KEY': JSON.stringify(process.env.PUBLIC_SUPABASE_KEY),
      'import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY': JSON.stringify(process.env.PUBLIC_STRIPE_PUBLISHABLE_KEY),
    }
  }
});