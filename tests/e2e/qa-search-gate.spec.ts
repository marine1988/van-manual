import { test, expect } from '@playwright/test';

const BASE = 'http://127.0.0.1:3000';
const SHOTS = '/tmp/search-after';

test('QA a-c: solar, agua quente, normalização acentos + focus', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(String(e.message)));
  await page.goto(BASE + '/');

  // abrir pelo botão; focus deve ir para o input
  await page.click('#searchToggle');
  await expect(page.locator('#searchOverlay')).toBeVisible();
  const focusedIsInput = await page.evaluate(() => document.activeElement?.id === 'searchInput');
  console.log('FOCUS_ON_INPUT=' + focusedIsInput);
  expect(focusedIsInput).toBe(true);

  // (a) solar
  await page.fill('#searchInput', 'solar');
  await page.waitForTimeout(300);
  const results = page.locator('.search-overlay__result');
  const nSolar = await results.count();
  console.log('SOLAR_COUNT=' + nSolar);
  expect(nSolar).toBeGreaterThan(0);
  expect(nSolar).toBeLessThanOrEqual(10);
  for (let i = 0; i < nSolar; i++) {
    const txt = (await results.nth(i).innerText()).toLowerCase();
    console.log(`SOLAR R${i}: ${txt.slice(0, 100).replace(/\n/g, ' | ')}`);
    expect(txt.includes('solar') || txt.includes('painel')).toBeTruthy();
    expect(txt.includes('cama') || txt.includes('wc')).toBeFalsy();
  }
  await page.screenshot({ path: SHOTS + '/desktop-1440-overlay-solar.png' });

  // (b) agua quente
  await page.fill('#searchInput', 'agua quente');
  await page.waitForTimeout(300);
  const nAguaQ = await page.locator('.search-overlay__result').count();
  console.log('AGUA_QUENTE_COUNT=' + nAguaQ);
  expect(nAguaQ).toBeGreaterThan(0);
  for (let i = 0; i < Math.min(nAguaQ, 5); i++) {
    console.log(`AGUAQ R${i}: ${(await page.locator('.search-overlay__result').nth(i).innerText()).slice(0, 90).replace(/\n/g, ' | ')}`);
  }

  // (c) sem acentos
  await page.fill('#searchInput', 'agua');
  await page.waitForTimeout(300);
  const bodyTxt = (await page.locator('#searchResults').innerText()).toLowerCase();
  console.log('AGUA_RESULTS_CONTAIN_AGUA=' + bodyTxt.includes('água'));
  console.log('AGUA_RAW=' + bodyTxt.replace(/\n/g, ' | ').slice(0, 200));
  expect(bodyTxt.includes('água') || bodyTxt.includes('agua')).toBe(true);

  // fechar para o próximo teste
  await page.keyboard.press('Escape');
  await expect(page.locator('#searchOverlay')).toBeHidden();
  console.log('PAGE_ERRORS=' + JSON.stringify(errors));
});

test('QA d: clique resultado accordion fechado #aquecimento abre e scroll abaixo do header', async ({ page }) => {
  await page.goto(BASE + '/');
  const headerH = await page.evaluate(() => document.querySelector('header')?.getBoundingClientRect().height || 0);
  console.log('HEADER_H=' + headerH);

  await page.click('#searchToggle');
  await page.fill('#searchInput', 'aquecimento');
  await page.waitForTimeout(300);
  const first = page.locator('.search-overlay__result').first();
  console.log('AQUEC_FIRST=' + (await first.innerText()).slice(0, 80).replace(/\n/g, ' | '));
  await first.click();

  await expect(page.locator('#searchOverlay')).toBeHidden();
  await page.waitForTimeout(1400); // scroll suave + highlight
  expect(await page.getAttribute('#aquecimento .accordion__header', 'aria-expanded')).toBe('true');

  const top = await page.evaluate(() => document.getElementById('aquecimento').getBoundingClientRect().top);
  console.log('AQUEC_TOP=' + top);
  expect(top).toBeGreaterThanOrEqual(headerH - 2);

  // highlight temporário presente?
  const hl = await page.evaluate(() => !!document.querySelector('.search-highlight, [data-search-highlight], .highlight-target'));
  console.log('HIGHLIGHT_CLASS_PRESENT=' + hl);
});

test('QA e: Escape fecha, / abre', async ({ page }) => {
  await page.goto(BASE + '/');
  await page.keyboard.press('/');
  await expect(page.locator('#searchOverlay')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#searchOverlay')).toBeHidden();
  console.log('ESCAPE_SLASH_OK=true');
});

test('QA f: card índice Cozinha -> scroll #cozinha + accordion abre', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(String(e.message)));
  await page.goto(BASE + '/');

  const cards = page.locator('.manual-index__card');
  console.log('INDEX_CARDS=' + await cards.count());
  await page.locator('.manual-index__card[data-target="cozinha"]').click();
  await page.waitForTimeout(1400);
  expect(await page.getAttribute('#cozinha .accordion__header', 'aria-expanded')).toBe('true');
  const top = await page.evaluate(() => document.getElementById('cozinha').getBoundingClientRect().top);
  const headerH = await page.evaluate(() => document.querySelector('header')?.getBoundingClientRect().height || 0);
  console.log(`COZINHA_TOP=${top} HEADER_H=${headerH}`);
  expect(top).toBeGreaterThanOrEqual(headerH - 2);
  await page.screenshot({ path: SHOTS + '/desktop-1440-indice-cozinha.png' });
  console.log('PAGE_ERRORS=' + JSON.stringify(errors));
});

test('QA mobile-390: overlay solar + indice, zero overflow horizontal', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE + '/');

  // overflow horizontal
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log('MOBILE_OVERFLOW_PX=' + overflow);
  expect(overflow).toBeLessThanOrEqual(1);

  // screenshot do índice em mobile
  await page.locator('#indice').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: SHOTS + '/mobile-390-indice.png' });

  // overlay com resultados
  await page.click('#searchToggle');
  await page.fill('#searchInput', 'solar');
  await page.waitForTimeout(300);
  const n = await page.locator('.search-overlay__result').count();
  console.log('MOBILE_SOLAR_COUNT=' + n);
  expect(n).toBeGreaterThan(0);
  await page.screenshot({ path: SHOTS + '/mobile-390-overlay-solar.png' });
});
