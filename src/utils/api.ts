import { request } from '@playwright/test';

export async function sendTrackEvent(dataPlaneUrl: string, writeKey: string, expectFailure = false) {
  const apiContext = await request.newContext();
  const auth = Buffer.from(`${writeKey}:`).toString('base64');
  const randomNumber = Math.floor(100 + Math.random() * 900);
  const eventName = `Product Purchased ${randomNumber}`;
  const res = await apiContext.post(`${dataPlaneUrl}/v1/track`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${auth}`
    },
    data: {
      userId: "automation-user",
      event: eventName,
      properties: { name: "Shirt", revenue: 9.99 },
      context: { library: { name: "http" } }
    }
  });

  console.log(`Event sent: ${eventName}, status: ${res.status()}`);

  if (!expectFailure && res.status() !== 200) {
    throw new Error(`Failed to send event! Status: ${res.status()}, Body: ${await res.text()}`);
  } else if (expectFailure && (res.status() === 200)) {
    throw new Error('Expected event to fail, but it succeeded!');
  }
  await apiContext.dispose();
  return res; // in case you want to inspect in the step
}
