// src/steps/login.steps.ts
import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, Page } from 'playwright';
import { LoginPage } from '../pages/loginPage';
import { logStep } from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config();
setDefaultTimeout(90_000);

let browser: Browser;
let page: Page;
let loginPage: LoginPage;

const getEnv = (val: string) =>
  val.startsWith('env:') ? process.env[val.replace('env:', '').toUpperCase()]! : val;

Given('the user is on the login page', async () => {
    logStep('Launch browser & navigate to login');
    browser = await chromium.launch({ headless: true }); 
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
  });

When('the user enters email {string}', async (email: string) => {
    logStep(`Enter email: ${email}`);
    await loginPage.fillEmail(getEnv(email));
});
When('the user enters password {string}', async (pwd: string) => {
    logStep(`Enter password`);
    await loginPage.fillPassword(getEnv(pwd));
});

When('the user submits the login form', async () => {
    logStep('Submit login');
    await loginPage.clickLogin();
});

Then('the error message {string} should be displayed', async (msg: string) => {
    logStep(`Assert error "${msg}"`);
    await loginPage.assertError(msg);
    await browser.close();
});

Then('the user should land on the Connections page', async () => {
    logStep('Assert landing on Connections page');
    await loginPage.assertOnConnections();
    await browser.close();
});

Then('the login button should be disabled', async function () {
    logStep('Check login button is disabled');
    const isDisabled = await loginPage.isLoginButtonDisabled();
    if (!isDisabled) throw new Error('Expected login button to be disabled');
  });