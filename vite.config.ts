import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

export default defineConfig({
  plugins: [react(), componentTagger()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // @ = src/
    },
  },
  server: {
    host: '0.0.0.0', // listen on all network interfaces
    port: 8080,
    strictPort: true, // fail if port is unavailable
    allowedHosts: ['gadget-n-thread-co.onrender.com', 'gadgetandthreadco.onrender.com','gadgetandthread.onrender.com'],
  },
});
