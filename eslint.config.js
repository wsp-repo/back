const {
  defineConfig,
  getBackTsConfig,
  getTestsConfig,
} = require('@zalib/devkit/eslint');

module.exports = defineConfig([
  { ignores: ['**/node_modules/**', '**/dist/**'] },
  ...getBackTsConfig(),
  ...getTestsConfig(),
]);
