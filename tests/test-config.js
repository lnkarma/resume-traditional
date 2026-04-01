const path = require('path');

const TEST_CONFIG = {
  // Viewport settings (A4 size at 96 DPI)
  viewport: {
    width: 816,
    height: 1056,
    deviceScaleFactor: 1,
  },

  // File paths
  baselinePath: path.join(__dirname, 'baselines', 'resume-baseline.png'),
  currentPath: path.join(__dirname, 'baselines', 'resume-current.png'),
  diffPath: path.join(__dirname, 'baselines', 'resume-diff.png'),
  indexPath: path.join(__dirname, '..', 'index.html'),

  // Screenshot options
  screenshotOptions: {
    fullPage: true,
  },

  // Puppeteer options
  puppeteerOptions: {
    headless: 'new',
  },

  // Navigation options
  navigationOptions: {
    waitUntil: 'networkidle2',
  },

  // Wait time for content rendering (ms)
  renderWaitTime: 500,

  // Pixelmatch threshold (0.1 = 10% per-channel difference tolerance)
  pixelmatchThreshold: 0.1,

  // Maximum allowed pixel difference (0.5% of total pixels)
  maxDiffPixelsRatio: 0.005,
};

module.exports = TEST_CONFIG;
