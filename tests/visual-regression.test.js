const puppeteer = require('puppeteer');
const fs = require('fs');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');
const TEST_CONFIG = require('./test-config');

describe('Visual Regression Tests', () => {
  let browser;

  beforeAll(async () => {
    browser = await puppeteer.launch(TEST_CONFIG.puppeteerOptions);
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  test('Resume UI should match baseline screenshot', async () => {
    const page = await browser.newPage();

    // Set viewport
    await page.setViewport(TEST_CONFIG.viewport);

    // Load index.html
    const filePath = `file://${TEST_CONFIG.indexPath}`;
    await page.goto(filePath, TEST_CONFIG.navigationOptions);
    await page.waitForTimeout(TEST_CONFIG.renderWaitTime);

    // Capture current screenshot
    await page.screenshot({
      path: TEST_CONFIG.currentPath,
      ...TEST_CONFIG.screenshotOptions,
    });

    // Compare with baseline
    const baselineBuffer = fs.readFileSync(TEST_CONFIG.baselinePath);
    const currentBuffer = fs.readFileSync(TEST_CONFIG.currentPath);

    const baselineImg = PNG.sync.read(baselineBuffer);
    const currentImg = PNG.sync.read(currentBuffer);

    const { width, height } = baselineImg;

    // Check dimensions match
    expect(currentImg.width).toBe(width);
    expect(currentImg.height).toBe(height);

    // Create diff image
    const diff = new PNG({ width, height });

    // Calculate pixel difference
    const pixelsDiff = pixelmatch(
      baselineImg.data,
      currentImg.data,
      diff.data,
      width,
      height,
      { threshold: TEST_CONFIG.pixelmatchThreshold }
    );

    // Save diff image for inspection if there are differences
    if (pixelsDiff > 0) {
      fs.writeFileSync(TEST_CONFIG.diffPath, PNG.sync.write(diff));
      console.log(`\n⚠️  Visual differences detected!`);
      console.log(`   Diff image saved to: ${TEST_CONFIG.diffPath}`);
      console.log(`   Different pixels: ${pixelsDiff}`);
      console.log(`   Compare: ${TEST_CONFIG.baselinePath} vs ${TEST_CONFIG.currentPath}`);
    }

    // Allow for very small rendering differences
    const maxDiffPixels = (width * height) * TEST_CONFIG.maxDiffPixelsRatio;
    expect(pixelsDiff).toBeLessThan(maxDiffPixels);

    await page.close();
  });
});
