import { Page } from 'playwright';
import { logStep, logError } from '../utils/logger';

export class BasePage {
  constructor(protected page: Page) {}

  async closeAIPopup(): Promise<void> {
    const closeXPath = "//button[@aria-label='Close' and @data-action='close']";
    try {
      await this.page.waitForSelector(closeXPath, { state: 'visible', timeout: 1000 });
      logStep('Closing AI popup');
      await this.page.click(closeXPath);
      const floater = "//div[contains(@class,'__floater') and contains(@class,'__floater__open')]";
      await this.page.waitForSelector(floater, { state: 'hidden', timeout: 1000 });
    } catch (e: any) {
      logError(`AI popup not found or already closed: ${e.message}`);
    }
  }
}
