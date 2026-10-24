import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/generated/**'],
      reporter: ['text', 'lcov', 'json-summary'],
      thresholds: { statements: 79.34, branches: 74.89, functions: 83.1, lines: 84.89 },
    },
  },
});
