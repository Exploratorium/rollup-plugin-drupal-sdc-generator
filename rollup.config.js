import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';

export default {
  input: 'src/index.js',
  external: ['node:fs/promises', 'node:path', 'node:url', 'yaml'],
  output: [
    {
      file: 'dist/index.cjs',
      format: 'cjs',
    },
    {
      file: 'dist/index.mjs',
      format: 'es',
    },
  ],
  plugins: [
    commonjs(),
    resolve(),
    copy({
      targets: [
        {
          src: 'templates/**/*',
          dest: 'dist/templates',
        },
      ],
    }),
  ],
};
