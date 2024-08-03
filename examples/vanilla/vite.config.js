import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { join } from 'node:path';
import injectProcessEnv from 'rollup-plugin-inject-process-env';

import { defineConfig } from 'vite';
import rollupPluginDrupalSdcGenerator from 'rollup-plugin-drupal-sdc-generator'

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
        rollupPluginDrupalSdcGenerator({
          directory: {
            'my-component': 'vite/my-component',
          },
        }),
      ],
    },
  },
});
