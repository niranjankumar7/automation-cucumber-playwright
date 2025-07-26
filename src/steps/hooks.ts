import { BeforeAll, AfterAll, Before, After, IWorld } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from '@playwright/test';

let browser: Browser;

export interface CustomWorld extends IWorld {
  context?: BrowserContext;
  page?: Page;
}

BeforeAll(async () => {
  browser = await chromium.launch({ headless: true });
});

AfterAll(async () => {
  await browser?.close();
});

Before(async function (this: CustomWorld) {
  this.context = await browser.newContext();
  this.page    = await this.context.newPage();
});

// Dispose of context/page after each scenario
After(async function (this: CustomWorld, { result }) {
    if (result?.status === 'FAILED') {
      await this.page?.screenshot({ path: `reports/screenshots/${Date.now()}.png` });
    }
    await this.page?.close();
    await this.context?.close();
  });
  
