const { test, expect } = require('@playwright/test');
test('game loads', async ({ page }) => {
  await page.goto('http://localhost:3456/index.html');
  await page.waitForTimeout(1000);
  expect(await page.$('canvas')).toBeTruthy();
});
test('game starts on click', async ({ page }) => {
  await page.goto('http://localhost:3456/index.html');
  await page.waitForTimeout(500);
  await page.click('canvas');
  await page.waitForTimeout(500);
  const state = await page.evaluate(() => window.state);
  expect(state).toBe(1);
});