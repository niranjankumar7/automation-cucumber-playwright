import { Page } from 'playwright';
import { logStep, logError } from '../utils/logger';

export class BasePage {
  constructor(protected page: Page) {}
// Checks for the presence of an AI assistant popup and closes it if visible.
// Prevents it from interfering with other UI interactions.
  async closeAIPopup(): Promise<void> {
    const closeXPath = "//button[@aria-label='Close' and @data-action='close']";
    try {
      const popupBtn = this.page.locator(closeXPath);
      // Short timeout to check for visibility; do not throw if not found
      if (await popupBtn.isVisible({ timeout: 500 })) {
        logStep('Closing AI popup');
        await popupBtn.click();
        const floater = "//div[contains(@class,'__floater') and contains(@class,'__floater__open')]";
        // Wait briefly for the popup floater to disappear
        await this.page.locator(floater).waitFor({ state: 'hidden', timeout: 2000 });
      }
    } catch (e: any) {
      // Swallow any errors silently – the popup is optional and tests should
      // continue even if it fails to close. Leaving a debug log here would
      // simply clutter the CI output.
      logError(`AI popup handling error: ${e.message}`);
    }
  }
}
