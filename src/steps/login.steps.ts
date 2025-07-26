// src/steps/login.steps.ts
import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
// Browser management is now handled via Cucumber hooks (see hooks.ts).
// We no longer import or launch Playwright directly in these step definitions.
import { LoginPage } from '../pages/loginPage';
import { logStep } from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config();
setDefaultTimeout(90_000);

// We no longer maintain our own Browser/Page instances here. Instead,
// a LoginPage instance will be stored on the Cucumber World (this.loginPage).

const getEnv = (val: string) =>
  val.startsWith('env:') ? process.env[val.replace('env:', '').toUpperCase()]! : val;

Given('the user is on the login page', async function () {
  // A fresh page is provided by the Before hook via this.page
  this.loginPage = new LoginPage(this.page!);
  await this.loginPage.navigateToLogin();
});

When('the user enters email {string}', async function (email: string) {
  logStep(`Enter email: ${email}`);
  await this.loginPage!.fillEmail(getEnv(email));
});

When('the user enters password {string}', async function (pwd: string) {
  logStep('Enter password');
  await this.loginPage!.fillPassword(getEnv(pwd));
});

When('the user submits the login form', async function () {
  logStep('Submit login');
  await this.loginPage!.clickLogin();
});

Then('the error message {string} should be displayed', async function (msg: string) {
  logStep(`Assert error "${msg}"`);
  await this.loginPage!.assertError(msg);
  // Browser/page cleanup is now handled by the After hook.
});

Then('the user should land on the Connections page', async function () {
  logStep('Assert landing on Connections page');
  await this.loginPage!.assertOnConnections();
});

Then('the login button should be disabled', async function () {
  logStep('Check login button is disabled');
  const isDisabled = await this.loginPage!.isLoginButtonDisabled();
  if (!isDisabled) throw new Error('Expected login button to be disabled');
});