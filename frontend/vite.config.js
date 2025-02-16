import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      crypto: path.resolve(__dirname, 'node_modules/crypto-browserify'),
    },
  },
  server: {
    host: '127.0.0.1', // Força o servidor a usar 127.0.0.1
    proxy: {
      '/api': {
        target: 'http://localhost/projeto/backend', // Seu backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: '../public/build', // Isso garante que o build do React seja gerado na pasta 'public/build' no PHP
    emptyOutDir: true, // Limpa o diretório de saída antes de cada build
  },
});