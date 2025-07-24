import { request } from '@playwright/test';

export async function sendTrackEvent(dataPlaneUrl: string, writeKey: string) {
  const apiContext = await request.newContext();

  const auth = Buffer.from(`${writeKey}:`).toString('base64');

  const randomNumber = Math.floor(100 + Math.random() * 900); // Generate a random 3-digit number
  const eventName = `Product Purchased ${randomNumber}`; // Construct the event name

  const res = await apiContext.post(`${dataPlaneUrl}/v1/track`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${auth}`
    },
    data: {
      userId: "automation-user",
      event: eventName, // Use the generated event name
      properties: { name: "Shirt", revenue: 9.99 },
      context: {
        library: { name: "http" }
      }
    }
  });

  // Store the event name for validation
  console.log(`Event sent: ${eventName}`);

  if (res.status() !== 200) {
    throw new Error(`Failed to send event! Status: ${res.status()}, Body: ${await res.text()}`);
  }

  await apiContext.dispose();
}
