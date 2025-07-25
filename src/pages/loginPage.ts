// src/pages/loginPage.ts
import { Page } from 'playwright';
import { BasePage } from './basePage';
import { logStep, logInfo } from '../utils/logger';

export class LoginPage extends BasePage {
  private loginButton = "//button[@type='button']/span[text()='Log in']";
  private emailInput = '[data-testid="Email"]';
  private passwordInput = '[data-testid="Password"]';
  private errorMsg = '.sc-fnOeCC.qPpXN';
  private mfaLater = 'a[href="/addmfalater"]';
  private goToDashboard = 'button:has-text("Go to dashboard")';
  private connHeader = 'h3.sc-iBAcGC.fJpLL';

  constructor(page: Page) { super(page); }

  /* Actions */
  async navigateToLogin(): Promise<void> {
    await this.closeAIPopup();
    logStep('Navigating to login page');
    const url = process.env.RUDDERSTACK_URL!;
    if (!url) throw new Error('RUDDERSTACK_URL missing');
    await this.page.goto(url);
  }

  async fillEmail(email: string): Promise<void> {
    await this.closeAIPopup();
    logStep(`Entering email: ${email}`);
    await this.page.fill(this.emailInput, email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.closeAIPopup();
    logStep('Entering password');
    await this.page.fill(this.passwordInput, password);
  }

  async clickLogin(): Promise<void> {
    await this.closeAIPopup();
    logStep('Clicking Log in');
    const btn = this.page.locator(this.loginButton);
    if (!(await btn.isEnabled())) {
      throw new Error('Login button is disabled');
    }
    await btn.click();
  }

  async handleMfaIfPresent(): Promise<void> {
    await this.closeAIPopup();
    try {
      await this.page.waitForSelector(this.connHeader, { timeout: 5000 });
      return;
    } catch {}
    const link = await this.page.$(this.mfaLater);
    if (!link) throw new Error('MFA prompt not found and not on Connections');
    logStep("Skipping MFA ('I'll do this later')");
    await link.click();
    await this.closeAIPopup();
    await this.page.click(this.goToDashboard);
    await this.closeAIPopup();
    await this.page.waitForSelector(this.connHeader, { timeout: 10000 });
  }

  /* Assertions */
  async assertError(expected: string): Promise<void> {
    await this.closeAIPopup();
    logStep(`Verifying error message contains "${expected}"`);
    await this.page.waitForSelector(this.errorMsg, { timeout: 5000 });
    const actual = (await this.page.textContent(this.errorMsg))?.trim() || '';
    if (!actual.includes(expected)) {
      throw new Error(`Expected "${expected}", got "${actual}"`);
    }
    logInfo('Error message verified');
  }

  async assertOnConnections(): Promise<void> {
    await this.handleMfaIfPresent();
    await this.closeAIPopup();
    logStep('Verifying Connections page');
    await this.page.waitForSelector(this.connHeader, { timeout: 10000 });
    const text = (await this.page.textContent(this.connHeader))?.trim().toLowerCase();
    if (!text?.includes('connections')) throw new Error('Not on Connections page');
    logInfo('On Connections page');
  }
  async isLoginButtonDisabled(): Promise<boolean> {
    const button = this.page.locator(this.loginButton);
    return !(await button.isEnabled());
  }
  
}
