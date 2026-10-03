import { chromium } from '@playwright/test';
const OUT = '/tmp/claude-0/-home-user-Arun-Portfolio/30050352-cd8d-51ba-89c3-3075ffb93711/scratchpad/';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
for (const [name, vp] of [['desktop', {width:1440,height:900}], ['mobile', {width:390,height:844}]]) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: name==='mobile', hasTouch: name==='mobile' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type()==='error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const dims = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth, sh: document.documentElement.scrollHeight }));
  console.log(name, dims, 'overflow:', dims.sw !== dims.iw ? 'YES' : 'no', 'errors:', errors);
  await page.screenshot({ path: OUT + name + '-hero.png' });
  // scroll through the page so reveals + pinned sections fire, then full-page shot
  const H = dims.sh;
  for (let y = 0; y < H; y += vp.height * 0.6) { await page.evaluate(v => window.scrollTo(0, v), y); await page.waitForTimeout(120); }
  await page.waitForTimeout(600);
  for (const [id, label] of [['about','about'],['skills','skills'],['work','work'],['certifications','certs'],['experience','exp'],['achievements','ach'],['contact','contact']]) {
    await page.evaluate(i => document.getElementById(i).scrollIntoView(), id);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}${name}-${label}.png` });
  }
  // overflow check after scrolling (achievements track etc.)
  const d2 = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }));
  console.log(name, 'after scroll overflow:', d2.sw !== d2.iw ? 'YES '+JSON.stringify(d2) : 'no');
  await ctx.close();
}
await browser.close();
