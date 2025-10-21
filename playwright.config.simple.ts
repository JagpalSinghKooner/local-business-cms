import { defineConfig, devices } from '@playwright/test';

/**
 * Simplified Playwright configuration for basic SEO testing
 * This doesn't require a running application
 */
export default defineConfig({
  testDir: './tests/seo',
  testMatch: '**/basic-seo.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // No webServer configuration - we'll test with static HTML
});
