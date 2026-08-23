import { test, expect, devices } from '@playwright/test'

// Testes mobile — viewport iPhone (390x844)
test.describe('Manual da Van — Mobile (iPhone 390x844)', () => {
  const iphone = devices['iPhone 13']
  test.use({
    viewport: iphone.viewport,
    isMobile: iphone.isMobile,
    hasTouch: iphone.hasTouch,
  })

  test('hambúrguer abre e fecha o menu', async ({ page }) => {
    await page.goto('/')

    const hamburger = page.locator('.header__hamburger')
    const nav = page.locator('.header__nav')
    await expect(hamburger).toBeVisible()

    // Começa fechado
    await expect(nav).not.toHaveClass(/is-open/)
    await expect(hamburger).toHaveAttribute('aria-expanded', 'false')

    // Abre
    await hamburger.click()
    await expect(nav).toHaveClass(/is-open/)
    await expect(hamburger).toHaveAttribute('aria-expanded', 'true')

    // Fecha
    await hamburger.click()
    await expect(nav).not.toHaveClass(/is-open/)
    await expect(hamburger).toHaveAttribute('aria-expanded', 'false')
  })

  test('clicar num link do menu fecha o menu e faz scroll para a secção', async ({ page }) => {
    await page.goto('/')

    const hamburger = page.locator('.header__hamburger')
    await hamburger.click()
    await expect(page.locator('.header__nav')).toHaveClass(/is-open/)

    // Clicar em "Água" dentro do menu
    const linkAgua = page.locator('.header__nav-link').filter({ hasText: 'Água' }).first()
    await linkAgua.click()

    // Menu fecha automaticamente
    await expect(page.locator('.header__nav')).not.toHaveClass(/is-open/)
    await expect(hamburger).toHaveAttribute('aria-expanded', 'false')

    // Scroll aconteceu para a secção (smooth scroll — esperar, não ler logo)
    await expect(page.locator('#agua')).toBeVisible()
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
  })

  test('secções principais visíveis com scroll', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('.hero__title')).toBeVisible()

    // Galeria
    await page.locator('#galeria').scrollIntoViewIfNeeded()
    await expect(page.locator('.gallery-section__title')).toBeVisible()

    // FAQ no fim da página
    await page.locator('#faq').scrollIntoViewIfNeeded()
    await expect(page.locator('.faq-section__title')).toBeVisible()
  })

  test('galeria faz scroll e as 9 fotos carregam', async ({ page }) => {
    await page.goto('/')

    // Scroll gradual até ao fundo da galeria para acionar o lazy loading
    await page.evaluate(async () => {
      const gallery = document.querySelector('#galeria')
      if (!gallery) return
      const bottom = gallery.getBoundingClientRect().bottom + window.scrollY
      for (let y = 0; y <= bottom; y += 300) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 50))
      }
    })
    await page.waitForLoadState('networkidle')

    const items = page.locator('.gallery-section__item')
    await expect(items).toHaveCount(9)

    // Cada imagem carregou de facto (naturalWidth > 0)
    const loaded = await page
      .locator('.gallery-section__item img')
      .evaluateAll((imgs) =>
        imgs.every((i) => (i as HTMLImageElement).naturalWidth > 0 && (i as HTMLImageElement).naturalHeight > 0)
      )
    expect(loaded).toBeTruthy()
  })

  test('sem overflow horizontal (scrollWidth <= innerWidth + 2px)', async ({ page }) => {
    await page.goto('/')

    // Scroll pelo documento todo para o estado final
    await page.evaluate(async () => {
      for (let y = 0; y <= document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 30))
      }
    })

    const { bodySW, htmlSW, innerW } = await page.evaluate(() => ({
      bodySW: document.body.scrollWidth,
      htmlSW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
    }))

    expect(bodySW).toBeLessThanOrEqual(innerW + 2)
    expect(htmlSW).toBeLessThanOrEqual(innerW + 2)
  })
})