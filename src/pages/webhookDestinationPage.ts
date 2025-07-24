import { Page } from 'playwright';

export class WebhookDestinationPage {
  constructor(private page: Page) {}

  async openDestination() {
    // Click the Destinations tab/menu
    await this.page.click("//a[@data-testid='sub-menu-destinations']");
    // Click the "web hook" destination card
    await this.page.click("//div[@class='sc-ksJhlw sc-kMTTew fxuygx gAfgtY' and text()='web hook']");
    // Click the Events tab
    await this.page.click("//div[@data-node-key='Events']");
  }

  async getDeliveredAndFailedCounts(): Promise<{delivered: number, failed: number}> {
    const deliveredSelector = "//span[text()='Delivered']/following-sibling::div//h2/span";
    const failedSelector = "//span[text()='Failed']/following-sibling::div//h2/span";
  
    // Ensure elements are present before attempting to read text content
    await this.page.waitForSelector(deliveredSelector);
    await this.page.waitForSelector(failedSelector);
  
    // Delivered count
    // If textContent is null, default to "0" before parsing
    const deliveredText = await this.page.textContent(deliveredSelector) ?? '0';
    const delivered = parseInt(deliveredText, 10);
  
    // Failed count
    // If textContent is null, default to "0" before parsing
    const failedText = await this.page.textContent(failedSelector) ?? '0';
    const failed = parseInt(failedText, 10);
  
    return { delivered, failed };
  }

  async refreshEventsTab() {
    // Click the refresh button
    await this.page.click("//button[./span[text()='Refresh']]");
    // Wait a little for events to reload
    await this.page.waitForTimeout(1500);
  }
}
