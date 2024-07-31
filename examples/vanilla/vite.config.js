import { join } from 'node:path';

import { defineConfig } from 'vite';
import vitePluginDrupalSdcGenerator from 'vite-plugin-drupal-sdc-generator'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vitePluginDrupalSdcGenerator({
      directory: {
        'my-component': 'vite/my-component',
      },
    }),
  ],
  root: 'js',
  build: {
    outDir: join('..', 'components', 'my-component'),
    rollupOptions: {
      input: {
        'my-component': 'js/main.js',
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
});
