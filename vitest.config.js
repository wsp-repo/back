const { resolve } = require('node:path');

const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    environment: 'node',
    exclude: ['node_modules', 'dist'],
    globals: true,
    include: ['src/**/*.spec.ts'],
    root: '.',
  },
});
