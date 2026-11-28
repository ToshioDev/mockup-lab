import { chromium } from '/Users/macsafe/.qoder/skills/phone-mockup-studio/scripts/node_modules/playwright-core/index.mjs';

const BASE = 'http://127.0.0.1:4177/';
const LAB = '/Users/macsafe/mockup-lab/round-01';
const browser = await chromium.launch({ executablePath: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push('pageerror: ' + e.message));

async function loadPath(file) {
  await page.click('[data-input="path"]');
  await page.fill('#pathInput', file);
  await page.click('#loadPath');
  await page.waitForFunction(() => !document.querySelector('#exportBtn').disabled && !document.querySelector('#stage').classList.contains('busy'), null, { timeout: 120000 });
  await page.waitForTimeout(900);
}

async function exportPng(name) {
  await page.click('#exportBtn');
  await page.waitForSelector('#modal:not([hidden])', { timeout: 120000 });
  const downloadPromise = page.waitForEvent('download', { timeout: 20000 });
  await page.click('#downloadLink');
  const download = await downloadPromise;
  await download.saveAs(`${LAB}/${name}`);
  const meta = await page.textContent('#exportMeta');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  return meta;
}

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForSelector('#empty');

// iOS frame
await loadPath(`${LAB}/screen-ios.html`);
await page.screenshot({ path: `${LAB}/ui-ios-frame.png` });
console.log('• iOS frame preview');

// iOS hero
await page.click('[data-mode="hero"]');
await page.click('[data-bg="sand"]');
await page.fill('#captionInput', 'Autumn in Higashiyama');
await page.fill('#subtitleInput', 'A slow three-day route through Kyoto’s temples and tea houses.');
await page.waitForTimeout(1200);
await page.screenshot({ path: `${LAB}/ui-ios-hero.png` });
console.log('• iOS hero preview');
console.log('• iOS export:', await exportPng('export-ios-hero.png'));

// Android frame
await loadPath(`${LAB}/screen-android.html`);
await page.selectOption('#deviceSelect', 'pixel-9-pro');
await page.waitForFunction(() => !document.querySelector('#exportBtn').disabled && !document.querySelector('#stage').classList.contains('busy'), null, { timeout: 120000 });
await page.waitForTimeout(900);
await page.click('[data-mode="frame"]');
await page.waitForTimeout(700);
await page.screenshot({ path: `${LAB}/ui-android-frame.png` });
console.log('• Android frame preview');

// Android hero
await page.click('[data-mode="hero"]');
await page.click('[data-bg="sage"]');
await page.fill('#captionInput', 'Every day, in motion.');
await page.fill('#subtitleInput', 'Training, sleep and recovery in one calm view.');
await page.waitForTimeout(1200);
await page.screenshot({ path: `${LAB}/ui-android-hero.png` });
console.log('• Android hero preview');
console.log('• Android export:', await exportPng('export-android-hero.png'));

console.log('• console errors:', errors.length ? errors : 'none');
await browser.close();
console.log('DONE');
