import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // This allows the app to access process.env.API_KEY from Vercel/Netlify environment variables
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});