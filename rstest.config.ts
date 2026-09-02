import { defineConfig } from '@rstest/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';

export default defineConfig({
  globals: true,
  testEnvironment: 'happy-dom',
  setupFiles: ['rstest.setup.ts', '@testing-library/jest-dom'],
  plugins: [pluginReact(), pluginSass()],
  coverage: {
    enabled: true,
    provider: 'istanbul',
    reportsDirectory: './coverage',
    reportOnFailure: true,
    reporters: ['lcov', 'text', 'html', 'text-summary'],
    include: ['src/**/*.{js,jsx,ts,tsx}'],
    exclude: [
      '**/cypress/**',
      '**/postcss/**',
      'src/index.js',
      '**/constants/**',
      '**/__fixtures__/**',
      '**/fixtures/**',
      '**/dist/**',
      '**/*config*',
      '**/serviceWorker.js',
    ],
    thresholds: {
      branches: 81,
      functions: 91,
      lines: 91,
      statements: 90,
    },
  },
});
