import { Given, When, Then } from '@cucumber/cucumber';
import { chromium, Browser, Page } from 'playwright';
import { LoginPage } from '../pages/loginPage';
import { ConnectionsPage } from '../pages/connectionsPage';
import { WebhookDestinationPage } from '../pages/webhookDestinationPage';
import { sendTrackEvent } from '../utils/api';
import dotenv from 'dotenv';

dotenv.config();

let browser: Browser;
let page: Page;
let dataPlaneUrl: string;
let writeKey: string;

Given('I log in to RudderStack', async function () {
  browser = await chromium.launch({ headless: false });
  page = await browser.newPage();
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.enterEmail(process.env.RUDDERSTACK_EMAIL!);
  await loginPage.enterPassword(process.env.RUDDERSTACK_PASSWORD!);
  await loginPage.submit();
  await loginPage.handleMfaIfPresent(page);
  // Optionally: handle 2FA as in your login.steps.ts
});

When('I read and store the data plane URL', async function () {
  const connectionsPage = new ConnectionsPage(page);
  dataPlaneUrl = await connectionsPage.getDataPlaneUrl();
  console.log('Data Plane URL:', dataPlaneUrl);
});

When('I read and store the write key from the HTTP source', async function () {
  const connectionsPage = new ConnectionsPage(page);
  writeKey = await connectionsPage.getHttpSourceWriteKey();
  console.log('Write Key:', writeKey);
});


let deliveredBefore = 0;

Then("I go to the Webhook destination's Events tab", async function () {
  const webhookPage = new WebhookDestinationPage(page);
  await webhookPage.openDestination();
  await webhookPage.refreshEventsTab();
  const counts = await webhookPage.getDeliveredAndFailedCounts();
  deliveredBefore = counts.delivered;
  console.log(`Delivered before sending event: ${deliveredBefore}`);
});

When('I send an event using the HTTP API', async function () {
  await sendTrackEvent(dataPlaneUrl, writeKey);
});

Then('I report the count of delivered and failed events', async function () {
  const webhookPage = new WebhookDestinationPage(page);

  // Wait a few seconds for event to propagate and appear
  await webhookPage.refreshEventsTab();
  const { delivered, failed } = await webhookPage.getDeliveredAndFailedCounts();
  console.log(`Delivered after: ${delivered}, Failed: ${failed}`);

  if (delivered <= deliveredBefore) {
    throw new Error(`Expected delivered count to increment! Before: ${deliveredBefore}, After: ${delivered}`);
  } else {
    console.log(`Event successfully delivered. Delivered count incremented by ${delivered - deliveredBefore}.`);
  }
  await browser.close();
});
