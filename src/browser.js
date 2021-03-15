const puppeteer = require('puppeteer');

async function startBrowser() {
  let browser;
  try {
    console.log('Opening the browser...');
    browser = await puppeteer.launch({
      headless: false,
      args: ['--disable-setuid-sandbox'],
      'ignoreHTTPSErrors': true
    });
  } catch (err) {
      console.log('Coult not create a browser instance => : ', err);
  }
  return browser;
}

module.exports = {
  startBrowser
};