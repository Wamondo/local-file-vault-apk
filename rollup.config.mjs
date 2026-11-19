import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'www/app.js',
  output: {
    dir: 'www',
    format: 'esm',
    sourcemap: false
  },
  plugins: [resolve()]
};
