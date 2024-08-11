import { join } from 'node:path';

import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import drupalSdcGenerator from 'rollup-plugin-drupal-sdc-generator';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
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
      plugins: [
        injectProcessEnv({
          // eslint-disable-next-line no-undef
          NODE_ENV: process.env.NODE_ENV,
        }),
        nodeResolve(),
        commonjs(),
        drupalSdcGenerator({
          directory: {
            'my-component': 'vite/my-component',
          },
        }),
      ],
    },
  },
});
