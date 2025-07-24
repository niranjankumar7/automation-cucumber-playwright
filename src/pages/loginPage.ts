import { Page } from 'playwright';

export class LoginPage {
  private loginButton = "//button[@type='button']/span[text()='Log in']";
  private errorMessageSelector = '.sc-fnOeCC.qPpXN';

  constructor(private page: Page) {}

  async goto() {
    const RUDDERSTACK_URL = process.env.RUDDERSTACK_URL;
    if (!RUDDERSTACK_URL) throw new Error('RUDDERSTACK_URL is not defined in the environment variables');
    await this.page.goto(RUDDERSTACK_URL);
  }

  async enterEmail(email: string) {
    await this.page.fill('[data-testid="Email"]', email);
  }

  async enterPassword(password: string) {
    await this.page.fill('[data-testid="Password"]', password);
  }

  async submit() {
    const button = this.page.locator(this.loginButton);
    if (await button.isEnabled()) {
      await button.click();
    } else {
      throw new Error('Login button is disabled—form is not valid');
    }
  }

  async getErrorMessage(): Promise<string | null> {
    try {
      await this.page.waitForSelector(this.errorMessageSelector, { timeout: 5000 });
      return this.page.textContent(this.errorMessageSelector);
    } catch {
      return null;
    }
  }

  async handleMfaIfPresent(page: Page): Promise<void> {
    // Try to detect Connections page header
    try {
      await page.waitForSelector('h3.sc-iBAcGC.fJpLL', { timeout: 5000 });
      const headerText = await page.textContent('h3.sc-iBAcGC.fJpLL');
      if (headerText?.trim().toLowerCase().includes('connections')) {
        return; // Already on connections page!
      }
    } catch { /* continue to MFA check if header not found */ }
  
    // Check for "I'll do this later" link
    const doLaterLink = await page.$('a[href="/addmfalater"]');
    if (doLaterLink) {
      console.log("MFA setup prompt detected. Clicking 'I'll do this later'...");
      await doLaterLink.click();
  
      // After skipping MFA, wait for "Go to dashboard" button
      const goToDashboardBtn = await page.waitForSelector('button:has-text("Go to dashboard")', { timeout: 10000 });
      if (goToDashboardBtn) {
        await goToDashboardBtn.click();
      }
  
      // Wait for Connections page header again
      await page.waitForSelector('h3.sc-iBAcGC.fJpLL', { timeout: 10000 });
      const headerText = await page.textContent('h3.sc-iBAcGC.fJpLL');
      if (!headerText?.trim().toLowerCase().includes('connections')) {
        throw new Error('Connections header not found after skipping MFA.');
      }
    } else {
      throw new Error('Neither Connections page nor MFA setup flow appeared after login.');
    }
  }
  
}
