import { test, expect } from '@playwright/test';

test('search: solar -> resultados só solar/painel, clique abre #eletrico', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/');
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  // abrir overlay pelo botão
  await page.click('#searchToggle');
  await expect(page.locator('#searchOverlay')).toBeVisible();

  // pesquisar "solar" (com acento noutro termo para validar normalização depois)
  await page.fill('#searchInput', 'solar');
  await page.waitForTimeout(300);
  const results = page.locator('.search-overlay__result');
  const count = await results.count();
  console.log('RESULT_COUNT=' + count);
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThanOrEqual(10);

  for (let i = 0; i < count; i++) {
    const txt = (await results.nth(i).innerText()).toLowerCase();
    console.log(`R${i}: ` + txt.slice(0, 80).replace(/\n/g, ' | '));
    expect(txt.includes('solar') || txt.includes('painel') || txt.includes('sol')).toBeTruthy();
  }

  // clicar no primeiro resultado
  await results.first().click();
  await expect(page.locator('#searchOverlay')).toBeHidden();
  await page.waitForTimeout(1200); // scroll suave
  await expect(page.locator('.manual-tabs__btn[data-target="eletrico"]')).toHaveAttribute('aria-selected', 'true');
  console.log('ELETRICO_TAB_ACTIVE=true');

  const inView = await page.evaluate(() => {
    const r = document.getElementById('eletrico').getBoundingClientRect();
    return r.top > -50 && r.top < window.innerHeight;
  });
  console.log('ELETRICO_IN_VIEW=' + inView);
  expect(inView).toBe(true);

  console.log('PAGE_ERRORS=' + JSON.stringify(errors));
});

test('search: tecla / abre, Escape fecha, acentos normalizados', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/');
  await page.keyboard.press('/');
  await expect(page.locator('#searchOverlay')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#searchOverlay')).toBeHidden();

  // pesquisa sem acento deve encontrar "Água"
  await page.click('#searchToggle');
  await page.fill('#searchInput', 'agua quente');
  await page.waitForTimeout(300);
  const count = await page.locator('.search-overlay__result').count();
  console.log('AGUA_RESULTS=' + count);
  expect(count).toBeGreaterThan(0);
});

test('índice visual: 9 cards, clique em Cama abre #cama', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/');
  const cards = page.locator('.manual-index__card');
  const n = await cards.count();
  console.log('INDEX_CARDS=' + n);
  expect(n).toBe(9);

  await page.locator('.manual-index__card[data-target="cama"]').click();
  await page.waitForTimeout(1200);
  await expect(page.locator('.manual-tabs__btn[data-target="cama"]')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#cama')).toBeVisible();

  // grid responsivo
  await page.setViewportSize({ width: 1280, height: 800 });
  const colsDesktop = await page.evaluate(() =>
    getComputedStyle(document.querySelector('.manual-index__grid')).gridTemplateColumns.split(' ').length);
  await page.setViewportSize({ width: 768, height: 800 });
  const colsTablet = await page.evaluate(() =>
    getComputedStyle(document.querySelector('.manual-index__grid')).gridTemplateColumns.split(' ').length);
  await page.setViewportSize({ width: 390, height: 800 });
  const colsMobile = await page.evaluate(() =>
    getComputedStyle(document.querySelector('.manual-index__grid')).gridTemplateColumns.split(' ').length);
  console.log(`COLS desktop=${colsDesktop} tablet=${colsTablet} mobile=${colsMobile}`);
  expect(colsDesktop).toBe(3);
  expect(colsTablet).toBe(2);
  expect(colsMobile).toBe(1);

  await page.screenshot({ path: '/tmp/search-index/mobile-390.png', fullPage: false });
});
