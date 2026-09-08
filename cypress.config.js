import { defineConfig } from 'cypress';

export default defineConfig({
  viewportWidth: 1200,
  viewportHeight: 1200,
  responseTimeout: 80_000,
  defaultCommandTimeout: 30_000,
  requestTimeout: 20_000,
  screenshotOnRunFailure: false,
  video: false,
  e2e: {
    baseUrl: 'http://localhost:3000/',
  },
});
