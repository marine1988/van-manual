import { test, expect } from '@playwright/test'

// HOTFIX menu desktop: os 12 itens têm de estar numa ÚNICA linha em ≥1280px
// (antes partiam em 2-3 filas desalinhadas). Em <1280px o hamburger garante
// que o menu nunca parte.
test.describe('Manual da Van — Header desktop (hotfix menu)', () => {
  for (const vp of [
    { name: '1920x1080', w: 1920, h: 1080 },
    { name: '1280x800', w: 1280, h: 800 },
  ]) {
    test(`menu numa única linha em ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.w, height: vp.h })
      await page.goto('/')

      const navList = page.locator('.header__nav-list')
      await expect(navList).toBeVisible()

      // Altura de UMA linha (~32px com o layout compacto) — o bug antigo dava
      // ~131px (3 filas) ou ~86px (2 filas)
      const height = await navList.evaluate((el) => el.getBoundingClientRect().height)
      expect(height).toBeLessThanOrEqual(45)
      expect(height).toBeGreaterThan(20)

      // Todos os links de topo no mesmo offsetTop → 1 única linha
      const rows = await page
        .locator('.header__nav-list > li > .header__nav-link')
        .evaluateAll((links) => new Set(links.map((l) => Math.round(l.getBoundingClientRect().top))).size)
      expect(rows).toBe(1)

      // Sem overflow horizontal no header (os 12 itens cabem de facto)
      const containerOverflow = await page
        .locator('.header__container')
        .evaluate((el) => el.scrollWidth - el.clientWidth)
      expect(containerOverflow).toBeLessThanOrEqual(1)

      // Em desktop o hamburger não aparece
      await expect(page.locator('.header__hamburger')).toBeHidden()
    })
  }

  test('1200x800 — hamburger em vez de menu partido em 2 filas', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.goto('/')

    // Abaixo de 1280px o menu desktop não cabe, por isso entra o hamburger —
    // o menu nunca parte. No menu mobile os capítulos aparecem como sublista.
    await expect(page.locator('.header__hamburger')).toBeVisible()
    await expect(page.locator('.header__nav')).not.toHaveClass(/is-open/)

    // Abrir e confirmar que todos os itens estão acessíveis
    await page.locator('.header__hamburger').click()
    await expect(page.locator('.header__nav')).toHaveClass(/is-open/)
    // 4 grupos de topo (Manual, Galeria, Bateria, FAQ) + 10 capítulos no dropdown
    await expect(page.locator('.header__nav > ul > li > .header__nav-link')).toHaveCount(4)
    await expect(page.locator('.header__nav-link--sub')).toHaveCount(9)
  })

  test('390x844 — hamburger visível e nav fechado', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    await expect(page.locator('.header__hamburger')).toBeVisible()
    await expect(page.locator('.header__nav')).not.toHaveClass(/is-open/)
  })
})