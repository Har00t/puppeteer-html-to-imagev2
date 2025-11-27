const express = require('express');
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Puppeteer HTML to Image API v2',
    endpoints: {
      screenshot: 'POST /screenshot'
    }
  });
});

// Screenshot endpoint
app.post('/screenshot', async (req, res) => {
  let browser;

  try {
    const { html, width = 1080, height = 1080, format = 'png' } = req.body;

    if (!html) {
      return res.status(400).json({
        success: false,
        error: 'HTML content is required'
      });
    }

    console.log('Launching browser...');

    // Launch browser with chromium binary
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless
    });

    console.log('Creating page...');
    const page = await browser.newPage();

    // Set viewport
    await page.setViewport({
      width: parseInt(width),
      height: parseInt(height),
      deviceScaleFactor: 1
    });

    console.log('Setting content...');
    // Set content with longer timeout
    await page.setContent(html, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    console.log('Taking screenshot...');
    // Take screenshot
    const screenshot = await page.screenshot({
      type: format,
      encoding: 'base64',
      fullPage: false
    });

    await browser.close();
    console.log('Screenshot complete!');

    // Return base64 image
    res.json({
      success: true,
      image: `data:image/${format};base64,${screenshot}`,
      base64: screenshot
    });

  } catch (error) {
    console.error('Screenshot error:', error);

    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }

    res.status(500).json({
      success: false,
      error: 'Failed to generate screenshot',
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Puppeteer HTML-to-Image API v2 running on port ${PORT}`);
  console.log(`📸 POST /screenshot to convert HTML to image`);
});
