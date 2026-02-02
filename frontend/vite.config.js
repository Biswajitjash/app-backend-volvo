  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'
  import tailwindcss from '@tailwindcss/vite'
  import path from "path";

  export default defineConfig({
  
    plugins: [react(), tailwindcss()],
      server: { 
      open: true,
      port: 9998, 
    proxy: {
      '/sap': {
        target: 'https://amwebdisp.ampl.in:44390', // or 44390 for DEV
        changeOrigin: true,
        secure: false
      }
    } 
     },

     resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },


  })
