// src/steps/rudderstack.steps.ts
import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, Page } from 'playwright';
import { LoginPage } from '../pages/loginPage';
import { ConnectionsPage } from '../pages/connectionsPage';
import { WebhookDestinationPage } from '../pages/webhookDestinationPage';
import { sendTrackEvent } from '../utils/api';
import { logStep } from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config();
setDefaultTimeout(180_000);

let browser: Browser, page: Page;
let dataPlaneUrl = '', writeKey = '', deliveredBefore = 0;
Given('I log in to RudderStack', async () => {
  logStep('Log in & skip MFA');
  browser = await chromium.launch({ headless: false });
  page = await browser.newPage();
  const login = new LoginPage(page);
  await login.navigateToLogin();
  await login.fillEmail(process.env.RUDDERSTACK_EMAIL!);
  await login.fillPassword(process.env.RUDDERSTACK_PASSWORD!);
  await login.clickLogin();
  await login.handleMfaIfPresent();
});

When('I read and store the data plane URL', async () => {
  logStep('Fetch Data Plane URL');
  const c = new ConnectionsPage(page);
  dataPlaneUrl = await c.getDataPlaneUrl();
});

When('I read and store the write key from the HTTP source', async () => {
  logStep('Fetch HTTP source write key');
  const c = new ConnectionsPage(page);
  writeKey = await c.getHttpSourceWriteKey();
});
When('I send an event using the HTTP API', async function () {
  logStep('Send track event via API');
  // If negative scenario, pass true:
  await sendTrackEvent(dataPlaneUrl, writeKey, this.expectFailure || false);
});

Then("I go to the Webhook destination's Events tab", async () => {
  logStep('Open Webhook Events tab & record before count');
  const w = new WebhookDestinationPage(page);
  await w.openEventsTab();
  await w.refreshEvents();
  deliveredBefore = (await w.getDeliveredAndFailedCounts()).delivered;
});

Then('I wait for and measure the delivery time for the event', async () => {
  logStep('Poll until event is delivered');
  const w = new WebhookDestinationPage(page);
  let delivered = 0, found = false;
  const start = Date.now();

  for (let i = 0; i < 80; i++) {
    await w.refreshEvents();
    delivered = (await w.getDeliveredAndFailedCounts()).delivered;
    if (delivered > deliveredBefore) { found = true; break; }
    await page.waitForTimeout(3000);
  }

  const secs = Math.round((Date.now() - start)/1000);
  if (!found) throw new Error(`Not delivered within ${secs}s (before=${deliveredBefore}, after=${delivered})`);
  console.log(`Delivered in ${secs}s`);
  await browser.close();
});

Given('I use an invalid write key', function () {
  this.expectFailure = true;
  writeKey = 'INVALID_WRITE_KEY';
});
// 2) “Then I fetch and report the delivered and failed event count”
Then('I fetch and report the delivered and failed event count', async function () {
  const webhookPage = new WebhookDestinationPage(this.page);
  await webhookPage.refreshEvents();

  const { delivered, failed } = await webhookPage.getDeliveredAndFailedCounts();
  console.log(`Delivered: ${delivered}, Failed: ${failed}`);

  if (failed > 0) {
    throw new Error(`⚠️ Some events failed delivery: ${failed} failed, ${delivered} delivered.`);
  } else if (delivered === 0) {
    throw new Error(`No events delivered! delivered=${delivered}, failed=${failed}`);
  } else {
    console.log(`✅ All events delivered successfully.`);
  }

  // close the browser when done
  const browser = this.page.context().browser();
  if (browser) await browser.close();
});