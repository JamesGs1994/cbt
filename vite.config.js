import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.VERCEL ? '/' : '/cbt/',
  build: {
    outDir: 'dist',
  },
});
