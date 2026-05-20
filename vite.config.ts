import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react(), tailwindcss(), cloudflare()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      port: 3000,
      host: '0.0.0.0',
    },
    build: {
      target: 'esnext',
      minify: 'terser',
      cssCodeSplit: true,
      terserOptions: {
        compress: {
          drop_console: true, // Strips all console logs in production
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          // Elite Vendor Chunking Strategy
          manualChunks: {
            'react-core': ['react', 'react-dom'],
            'motion-engine': ['motion/react'],
            'firebase-core': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          },
        },
      },
    },
  };
});