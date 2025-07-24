import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, Page } from 'playwright';
import { LoginPage } from '../pages/loginPage';
import { ConnectionsPage } from '../pages/connectionsPage';
import dotenv from 'dotenv';

dotenv.config();
setDefaultTimeout(90 * 1000);

let browser: Browser;
let page: Page;
let loginPage: LoginPage;

const getEnvValue = (val: string) => {
  if (val.startsWith('env:')) {
    const envVar = val.replace('env:', '').toUpperCase();
    if (envVar === "VALID_EMAIL") return process.env.RUDDERSTACK_EMAIL!;
    if (envVar === "VALID_PASSWORD") return process.env.RUDDERSTACK_PASSWORD!;
    return process.env[envVar]!;
  }
  return val;
};

Given('the user is on the login page', async function () {
  browser = await chromium.launch({ headless: false, slowMo: 100 }); // headed mode!
  page = await browser.newPage();
  loginPage = new LoginPage(page);
  await loginPage.goto();
});

When('the user enters email {string}', async function (email: string) {
  await loginPage.enterEmail(getEnvValue(email));
});

When('the user enters password {string}', async function (password: string) {
  await loginPage.enterPassword(getEnvValue(password));
});

When('the user submits the login form', async function () {
    try {
      await loginPage.submit();
    } catch (e) {
      // Cast e to Error or any to safely access .message
      this.lastError = (e as Error).message || String(e);
    }
  });

Then('the error message {string} should be displayed', async function (expectedError: string) {
  if (this.lastError) {
    if (!expectedError.toLowerCase().includes('required')) {
      throw new Error(`Expected error message "${expectedError}", but button was disabled`);
    }
  } else {
    const errorMsg = await loginPage.getErrorMessage();
    if (!errorMsg || !errorMsg.toLowerCase().includes(expectedError.toLowerCase())) {
      throw new Error(`Expected error message "${expectedError}", but got "${errorMsg}"`);
    }
  }
  await browser.close();
});
