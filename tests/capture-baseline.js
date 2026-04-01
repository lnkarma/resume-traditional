const puppeteer = require('puppeteer');
const fs = require('fs');
const TEST_CONFIG = require('./test-config');

(async () => {
  let browser;
  try {
    // Launch browser
    browser = await puppeteer.launch(TEST_CONFIG.puppeteerOptions);

    const page = await browser.newPage();

    // Set viewport
    await page.setViewport(TEST_CONFIG.viewport);

    // Load index.html
    const filePath = `file://${TEST_CONFIG.indexPath}`;
    console.log(`Loading: ${filePath}`);
    await page.goto(filePath, TEST_CONFIG.navigationOptions);

    // Wait for content to render
    await page.waitForTimeout(TEST_CONFIG.renderWaitTime);

    // Take full page screenshot
    console.log(`Capturing baseline screenshot...`);
    await page.screenshot({
      path: TEST_CONFIG.baselinePath,
      ...TEST_CONFIG.screenshotOptions,
    });

    console.log(`✅ Baseline screenshot saved to: ${BASELINE_PATH}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error capturing baseline:', error.message);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }TEST_CONFIG.baselinePath
  }
})();
