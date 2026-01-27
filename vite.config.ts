import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // <- tells Vite that @ = src/
    },
  },
  server: {
    allowedHosts: ['gadget-n-thread-co.onrender.com'],
  },
});
