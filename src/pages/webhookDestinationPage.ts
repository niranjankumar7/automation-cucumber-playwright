import { Page } from 'playwright';
import { BasePage } from './basePage';
import { logStep, logInfo } from '../utils/logger';

export class WebhookDestinationPage extends BasePage {
  private tabDest     = "//a[@data-testid='sub-menu-destinations']";
  private cardWebhook = "//div[text()='web hook']";
  private tabEvents   = "//div[@data-node-key='Events']";
  private selDelivered= "//span[text()='Delivered']/following-sibling::div//h2/span";
  private selFailed   = "//span[text()='Failed']/following-sibling::div//h2/span";
  private btnRefresh  = "//button[./span[text()='Refresh']]";
  private xpathNames  = "//tbody//tr/td[2]//div[contains(@class,'sc-ksJhlw')]";

  constructor(page: Page) { super(page); }

// Navigates to the "Events" tab of the selected Webhook destination.
// Required before reading delivered/failed events.
  async openEventsTab(): Promise<void> {
    await this.closeAIPopup();
    logStep('Opening Webhook Events tab');
    await this.page.waitForSelector(this.tabDest, { state: 'attached', timeout: 15_000 });
    await this.page.click(this.tabDest);
    await this.page.click(this.cardWebhook);
    await this.page.click(this.tabEvents);
    logInfo('Events tab opened');
  }

// Refreshes the Events tab to update delivery counts.
// Helps with polling logic while waiting for an event to arrive.
  async refreshEvents(): Promise<void> {
    await this.closeAIPopup();
    logStep('Refreshing events');
    await this.page.click(this.btnRefresh);
    await this.page.waitForTimeout(1500);
  }

// Reads the delivery statistics (delivered & failed) from the Webhook Events tab.
// Ensures selectors are loaded, extracts and parses both counts as integers.
// This is typically used to compare event delivery metrics before and after sending a track event.
  async getDeliveredAndFailedCounts(): Promise<{ delivered: number; failed: number }> {
    await this.closeAIPopup();
    logStep('Reading delivered/failed counts');

    await this.page.waitForSelector(this.selDelivered, { timeout: 5000 });
    await this.page.waitForSelector(this.selFailed,    { timeout: 5000 });

    const deliveredText = await this.page.textContent(this.selDelivered) ?? '0';
    const failedText    = await this.page.textContent(this.selFailed)    ?? '0';

    const delivered = parseInt(deliveredText.trim(), 10);
    const failed    = parseInt(failedText.trim(),    10);

    logInfo(`Counts → Delivered=${delivered}, Failed=${failed}`);
    return { delivered, failed };
  }

// Fetches all event names listed in the Events table.
// Useful for verifying that specific named events were delivered to the Webhook destination.
// Returns a list of string names extracted from the UI.
// Not fully implemented - can be implemented for futurue validation
  async getAllEventNames(): Promise<string[]> {
    await this.closeAIPopup();
    logStep('Fetching all event names');
    await this.page.waitForSelector("//table//tbody");
    const cells = await this.page.$$('xpath=' + this.xpathNames);
    const names = [];
    for (const c of cells) names.push((await c.textContent())?.trim()||'');
    logInfo(`Event names: ${names.join(',')}`);
    return names;
  }
}
