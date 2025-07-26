import { Page } from 'playwright';
import { logStep, logError } from '../utils/logger';

export class BasePage {
  constructor(protected page: Page) {}

  /**
   * Attempts to close the RudderStack assistant (AI) popup if it is currently visible.
   *
   * The original implementation used a hard 1‑second wait via `waitForSelector()`
   * on each invocation, which resulted in repeated timeout errors and noisy logs
   * when the popup was not present (especially in headless CI runs). To make
   * this helper less intrusive, we now poll for visibility using `locator.isVisible()`
   * with a short timeout. Only when the popup is actually visible do we try to
   * click it and wait for the floater to disappear. If the popup is absent,
   * the call simply returns without logging an error. This prevents the log
   * from being flooded with “AI popup not found or already closed” messages.
   */
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
