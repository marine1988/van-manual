import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000'

test('a) 10 tabs visiveis; #eletrico ativa por defeito', async ({ page }) => {
  await page.goto(BASE_URL)
  const tabs = page.locator('[role="tablist"] [role="tab"]')
  await expect(tabs).toHaveCount(10)
  const active = page.locator('[role="tab"][aria-selected="true"]')
  await expect(active).toHaveAttribute('id', /eletrico/i)
  const panel = page.locator('[role="tabpanel"]:not([hidden])')
  await expect(panel).toBeVisible()
})

test('b) clicar tab Agua: painel Agua visivel, Eletrico escondido', async ({ page }) => {
  await page.goto(BASE_URL)
  const agua = page.locator('[role="tab"]', { hasText: /água|agua/i }).first()
  await agua.click()
  const aguaPanel = page.locator('.manual-tab-panel', { hasText: 'Depósito de água limpa' })
  await expect(aguaPanel).toBeVisible()
  const elecPanel = page.locator('.manual-tab-panel', { hasText: /eletricidade|solar/i }).first()
  await expect(elecPanel).toBeHidden()
})

test('c) pesquisar solar -> resultado abre tab Eletrico com scroll >=72px', async ({ page }) => {
  await page.goto(BASE_URL)
  await page.click('#searchToggle')
  await page.fill('#searchInput', 'solar')
  await page.waitForTimeout(500)
  const result = page.locator('.search-overlay__result').first()
  await result.click()
  await page.waitForTimeout(800)
  const active = page.locator('[role="tab"][aria-selected="true"]')
  await expect(active).toHaveAttribute('id', /eletrico/i)
  const h2 = page.locator('[role="tabpanel"]:not([hidden]) h2').first()
  const box = await h2.boundingBox()
  expect(box).toBeTruthy()
  expect(box!.y).toBeGreaterThanOrEqual(72)
})

test('d) deep-link #cozinha -> tab Cozinha ativa + scroll >=72px (indice removido)', async ({ page }) => {
  await page.goto(BASE_URL)
  await expect(page.locator('#indice')).toHaveCount(0)
  await page.goto('about:blank')
  await page.goto(`${BASE_URL}#cozinha`)
  await page.waitForTimeout(800)
  const active = page.locator('[role="tab"][aria-selected="true"]')
  await expect(active).toHaveAttribute('id', /cozinha/i)
  const h2 = page.locator('[role="tabpanel"]:not([hidden]) h2').first()
  const box = await h2.boundingBox()
  expect(box).toBeTruthy()
  expect(box!.y).toBeGreaterThanOrEqual(72)
})

test('e) deep-link #aquecimento -> tab Aquecimento ativa ao carregar', async ({ page }) => {
  await page.goto(`${BASE_URL}#aquecimento`)
  await page.waitForTimeout(500)
  const active = page.locator('[role="tab"][aria-selected="true"]')
  await expect(active).toHaveAttribute('id', /aquecimento/i)
  const panel = page.locator('[role="tabpanel"]:not([hidden])')
  await expect(panel).toBeVisible()
})

test('f) FAQ continua accordion', async ({ page }) => {
  await page.goto(BASE_URL)
  const faqItem = page.locator('.faq-item, [class*="faq"] button, [class*="faq"] summary').first()
  await faqItem.scrollIntoViewIfNeeded()
  const btn = page.locator('[class*="faq"] button, .faq-item button').first()
  await btn.click()
  await page.waitForTimeout(400)
  const answer = page.locator('.faq-item [aria-hidden="false"], .faq-item .faq-answer:visible').first()
  await expect(answer).toBeVisible()
  await btn.click()
  await page.waitForTimeout(400)
  await expect(answer).toBeHidden()
})

test('g) zero overflow horizontal @390px; tabbar scrolla em mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(BASE_URL)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(0)
  const tablist = page.locator('[role="tablist"]').first()
  const style = await tablist.evaluate(el => {
    const s = getComputedStyle(el)
    return { overflowX: s.overflowX, scrollW: el.scrollWidth, clientW: el.clientWidth }
  })
  expect(style.scrollW).toBeGreaterThan(style.clientW)
})
