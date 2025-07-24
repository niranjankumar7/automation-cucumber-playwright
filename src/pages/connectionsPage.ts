import { Page } from 'playwright';

export class ConnectionsPage {
  constructor(private page: Page) {}

  async validateOneSourceAndDestination() {
    await this.closeAIPopup();
    await this.page.waitForSelector('//div[@id="sources-list"]', { timeout: 5000, state: 'visible' });
    await this.page.waitForSelector('//div[@id="destinations-list"]', { timeout: 5000, state: 'visible' });

    const sourcesCount = await this.page.locator('//div[@id="sources-list"]//div[starts-with(@id,"source-")]').count();
    const destinationsCount = await this.page.locator('//div[@id="destinations-list"]//div[starts-with(@id,"destination-")]').count();

    if (sourcesCount !== 1) throw new Error(`Expected 1 source, found ${sourcesCount}`);
    if (destinationsCount !== 1) throw new Error(`Expected 1 destination, found ${destinationsCount}`);

    console.log(`Sources: ${sourcesCount}, Destinations: ${destinationsCount}`);
  }

  // Step 1: Read Data Plane URL from top right
async getDataPlaneUrl(): Promise<string> {
  await this.closeAIPopup();
  // This returns the displayed string, e.g. https://demo-workspace.dataplane.rudderstack.com
  await this.page.waitForSelector("//span[@class='sc-jrkPvW ebfakN text-ellipsis']");
  // Use '!' to assert that textContent will not be null
  return (await this.page.textContent("//span[@class='sc-jrkPvW ebfakN text-ellipsis']"))!;
}

// Step 2: Click Source, open Settings, fetch Write Key
async getHttpSourceWriteKey(): Promise<string> {
  await this.closeAIPopup();
  // Define the XPath for the Write Key element.
  // This XPath assumes the element is already rendered and visible on the current page.
  const writeKeyXPath = "//span[contains(text(), 'Write key')]";

  // Wait for the Write Key element to be present on the page.
  // This is crucial to ensure the element is loaded before attempting to read its text.
  await this.page.waitForSelector(writeKeyXPath);

  // Get the full text content from the element, e.g., "Write key 30KlIIgR5oZMcLlVHb9fIcdRB73".
  // The '!' non-null assertion is used here, assuming waitForSelector ensures content presence.
  const fullText = (await this.page.textContent(writeKeyXPath))!;

  // Extract just the key part using a regular expression.
  // This assumes the format is always "Write key " followed by the actual key.
  const match = fullText.match(/Write key\s+(.*)/);

  // Check if the key was successfully extracted.
  if (match && match[1]) {
    return match[1]; // Return the extracted key string.
  } else {
    // If the format doesn't match or the key part isn't found, throw an error.
    throw new Error(`Could not extract write key from text: '${fullText}'. Expected format "Write key [THE_KEY]".`);
  }
}

async closeAIPopup(): Promise<void> {
  const closeButtonXPath = "//button[@aria-label='Close' and @data-action='close']";
  try {
    await this.page.waitForSelector(closeButtonXPath, { state: 'visible', timeout: 5000 });
    await this.page.click(closeButtonXPath);

    // Wait for popup to disappear
    const floaterXPath = "//div[contains(@class, '__floater') and contains(@class, '__floater__open')]";
    await this.page.waitForSelector(floaterXPath, { state: 'hidden', timeout: 5000 });
    console.log("AI popup closed.");
  } catch (error: any) {
    console.warn(`AI popup or close button not found (maybe already closed). Continuing. Reason: ${error.message || error}`);
  }
}
}