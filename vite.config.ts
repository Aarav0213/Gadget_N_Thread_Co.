import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // @ = src/
    },
  },
  server: {
    host: '0.0.0.0', // listen on all network interfaces
    port: Number(process.env.PORT) || 5173, // use Render's port, fallback to 5173 locally
    strictPort: true, // fail if port is unavailable
    allowedHosts: ['gadget-n-thread-co.onrender.com', 'gadgetandthreadco.onrender.co'],
  },
});
