import { chromium } from '@playwright/test';
const OUT = '/tmp/claude-0/-home-user-Arun-Portfolio/faeb2916-aaa8-587f-b6f1-c083308845ec/scratchpad/shots/';
import { mkdirSync } from 'node:fs';
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
for (const [name, vp] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: name === 'mobile', hasTouch: name === 'mobile' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 300)); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  await page.goto('http://localhost:3100/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${OUT}${name}-00-loader.png` });
  await page.waitForTimeout(4500);
  await page.mouse.move(700, 400);
  await page.screenshot({ path: `${OUT}${name}-01-hero.png` });
  const dims = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth, sh: document.documentElement.scrollHeight }));
  console.log(name, dims, 'overflow:', dims.sw !== dims.iw ? 'YES' : 'no');
  // scroll through gradually (lenis listens to wheel; use window.scrollTo which lenis also tracks)
  const H = dims.sh;
  let k = 0;
  for (let y = 0; y < H; y += vp.height * 0.5) { await page.evaluate(v => window.scrollTo(0, v), y); await page.waitForTimeout(90); }
  for (const [frac, label] of [[0.08, 'hero-mid'], [0.17, 'story'], [0.25, 'exploded-a'], [0.3, 'exploded-b'], [0.4, 'pantry'], [0.5, 'craft-a'], [0.55, 'craft-b'], [0.66, 'sauces'], [0.76, 'dining'], [0.83, 'gallery'], [0.9, 'menu'], [0.97, 'reserve'], [1, 'footer']]) {
    await page.evaluate(v => window.scrollTo(0, v), Math.round((H - vp.height) * frac));
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}${name}-${String(++k + 1).padStart(2, '0')}-${label}.png` });
  }
  const d2 = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }));
  console.log(name, 'after scroll overflow:', d2.sw !== d2.iw ? 'YES ' + JSON.stringify(d2) : 'no', 'errors:', errors);
  // video scrub sanity
  const vids = await page.evaluate(() => [...document.querySelectorAll('video')].map(v => ({ src: v.currentSrc.split('/').pop(), t: +v.currentTime.toFixed(2), d: +v.duration.toFixed(1), rs: v.readyState })));
  console.log(name, 'videos', JSON.stringify(vids));
  await ctx.close();
}
await browser.close();
