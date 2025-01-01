import react from '@vitejs/plugin-react';
import drupalSdcGenerator from 'rollup-plugin-drupal-sdc-generator';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'js',
  build: {
    outDir: '../components/my-component',
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name].[ext]',
      },
      plugins: [
        injectProcessEnv({
          // eslint-disable-next-line no-undef
          NODE_ENV: process.env.NODE_ENV,
        }),
        drupalSdcGenerator(),
      ],
    },
    lib: {
      formats: ['es'],
      entry: {
        'my-component': 'src/main.jsx',
      },
      cssFileName: 'style',
    },
  },
});
