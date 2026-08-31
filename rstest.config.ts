import { defineConfig } from '@rstest/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';


export default defineConfig({
  globals: true,
  testEnvironment: 'happy-dom',
  setupFiles: [
    'rstest.setup.ts',
    '@testing-library/jest-dom'
  ],
  plugins: [pluginReact(), pluginSass()],
});
