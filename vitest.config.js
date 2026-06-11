const { resolve } = require('node:path');

const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  resolve: {
    alias: {
      src: resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    exclude: ['node_modules', 'dist' ],
    globals: true,
    include: ['src/**/*.spec.ts'],
    root: '.',
  },
});
