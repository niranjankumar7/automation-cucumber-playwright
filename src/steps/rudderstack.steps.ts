// src/steps/rudderstack.steps.ts
import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
// Browser and page management are handled in hooks.ts; no direct launch here.
import { LoginPage } from '../pages/loginPage';
import { ConnectionsPage } from '../pages/connectionsPage';
import { WebhookDestinationPage } from '../pages/webhookDestinationPage';
import { sendTrackEvent } from '../utils/api';
import { logStep } from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config();
setDefaultTimeout(180_000);

// Scenario‑scoped variables are now stored on the Cucumber World (this).
// e.g. this.dataPlaneUrl, this.writeKey, this.deliveredBefore, this.expectFailure
Given('I log in to RudderStack', async function () {
  logStep('Log in & skip MFA');
  const login = new LoginPage(this.page!);
  await login.navigateToLogin();
  await login.fillEmail(process.env.RUDDERSTACK_EMAIL!);
  await login.fillPassword(process.env.RUDDERSTACK_PASSWORD!);
  await login.clickLogin();
  await login.handleMfaIfPresent();
});

When('I read and store the data plane URL', async function () {
  logStep('Fetch Data Plane URL');
  const c = new ConnectionsPage(this.page!);
  this.dataPlaneUrl = await c.getDataPlaneUrl();
});

When('I read and store the write key from the HTTP source', async function () {
  logStep('Fetch HTTP source write key');
  const c = new ConnectionsPage(this.page!);
  this.writeKey = await c.getHttpSourceWriteKey();
});

When('I send an event using the HTTP API', async function () {
  logStep('Send track event via API');
  // If negative scenario, pass true:
  await sendTrackEvent(this.dataPlaneUrl, this.writeKey, this.expectFailure || false);
});

Then("I go to the Webhook destination's Events tab", async function () {
  logStep('Open Webhook Events tab & record before count');
  const w = new WebhookDestinationPage(this.page!);
  await w.openEventsTab();
  await w.refreshEvents();
  const counts = await w.getDeliveredAndFailedCounts();
  this.deliveredBefore = counts.delivered;
});

Then('I wait for and measure the delivery time for the event', async function () {
  logStep('Poll until event is delivered');
  const w = new WebhookDestinationPage(this.page!);
  let delivered = 0;
  let found    = false;
  const start  = Date.now();

  for (let i = 0; i < 80; i++) {
    await w.refreshEvents();
    delivered = (await w.getDeliveredAndFailedCounts()).delivered;
    if (delivered > (this.deliveredBefore || 0)) {
      found = true;
      break;
    }
    await this.page!.waitForTimeout(3000);
  }

  const secs = Math.round((Date.now() - start) / 1000);
  if (!found) {
    throw new Error(`Not delivered within ${secs}s (before=${this.deliveredBefore}, after=${delivered})`);
  }
  console.log(`Delivered in ${secs}s`);
  // Browser cleanup is handled by the After hook.
});

Given('I use an invalid write key', function () {
  this.expectFailure = true;
  this.writeKey      = 'INVALID_WRITE_KEY';
});
// 2) “Then I fetch and report the delivered and failed event count”
Then('I fetch and report the delivered and failed event count', async function () {
  const webhookPage = new WebhookDestinationPage(this.page!);
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
  // Browser/page cleanup is handled by the After hook.
});