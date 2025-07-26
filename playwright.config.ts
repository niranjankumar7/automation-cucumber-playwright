import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 180000, // Global test timeout: 180 seconds per test
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 2000, // Timeout for individual actions (e.g., click, waitFor)
    navigationTimeout: 10000, // Timeout for page navigations
  },
  retries: 1, // Retry failed tests once in CI
  reporter: [['list'], ['json', { outputFile: 'reports/test-results.json' }]],
});