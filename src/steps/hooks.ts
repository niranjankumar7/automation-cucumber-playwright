import { BeforeAll, AfterAll, Before, After, IWorldOptions, World } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from '@playwright/test';

let browser: Browser;

// BeforeAll: Runs once before any scenario.
BeforeAll(async () => {
  browser = await chromium.launch({ headless: true });
});

// AfterAll: Runs once after all scenarios are finished.
AfterAll(async () => {
  // It closes the browser and allows the process to exit.
  if (browser) {
    await browser.close();
  }
});