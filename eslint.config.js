const {
  defineConfig,
  getBackConfig,
  getTestsConfig,
} = require('@zalib/devkit/eslint');

module.exports = defineConfig([
  { ignores: ['**/node_modules/**', '**/dist/**'] },
  ...getBackConfig(),
  ...getTestsConfig(),
]);
