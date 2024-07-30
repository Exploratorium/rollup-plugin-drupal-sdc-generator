import { join } from 'node:path';

import { defineConfig,  } from 'vite'
import react from '@vitejs/plugin-react'
import vitePluginDrupalSdcGenerator from '../../index';

// https://vitejs.dev/config/
export default defineConfig({
  name: 'foo',
  plugins: [
    react(),
    vitePluginDrupalSdcGenerator(),
  ],
  root: 'js',
  build: {
    outDir: join('..', 'components'),
    rollupOptions: {
      input: 'js/src/main.jsx',
      output: {
        entryFileNames: '[name]/[name].js',
        assetFileNames: '[name]/[name].[ext]',
      },
    },
  }
})
