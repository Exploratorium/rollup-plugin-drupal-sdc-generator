import { join } from 'node:path'

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite'
import vitePluginDrupalSdcGenerator from 'vite-plugin-drupal-sdc-generator'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vitePluginDrupalSdcGenerator()],
  root: 'js',
  build: {
    outDir: join('..', 'components', 'my-component'),
    rollupOptions: {
      input: {
        'my-component': 'js/src/main.jsx',
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
})
