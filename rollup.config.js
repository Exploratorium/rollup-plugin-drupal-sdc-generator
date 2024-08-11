import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.cjs',
      format: 'cjs',
    },
    {
      name: 'rollup-plugin-drupal-sdc-generator',
      file: 'dist/index.js',
      format: 'umd',
    },
    {
      file: 'dist/index.mjs',
      format: 'es',
    },
  ],
  plugins: [commonjs(), resolve()],
};
