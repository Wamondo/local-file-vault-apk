import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'www/app.js',
  output: {
    file: 'www/bundle.js',
    format: 'iife',
    name: 'VaultApp'
  },
  plugins: [resolve()]
};
