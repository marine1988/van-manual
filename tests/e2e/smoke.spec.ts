import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

test.describe('Manual da Van — Smoke Tests', () => {
  test('página carrega sem erros HTTP', async ({ page }) => {
    const response = await page.goto(BASE_URL)
    expect(response?.status()).toBe(200)
    await expect(page).toHaveTitle(/Manual da Van/)
  })

  test('header e navegação estão visíveis', async ({ page }) => {
    await page.goto(BASE_URL)

    // Header com logo
    const header = page.locator('.header')
    await expect(header).toBeVisible()

    const logo = page.locator('.header__logo')
    await expect(logo).toBeVisible()
    await expect(logo).toHaveText(/Manual da Van/)

    // Navegação com links para as 7 secções
    const navLinks = page.locator('.header__nav-link')
    await expect(navLinks).toHaveCount(7)

    const expectedLinks = ['Água', 'Eletricidade', 'Gás', 'Campervan', 'Checklist', 'Manutenção', 'Dicas']
    const linkTexts = await navLinks.allTextContents()
    for (const expected of expectedLinks) {
      expect(linkTexts.some(t => t.includes(expected))).toBeTruthy()
    }

    // Theme toggle button visível
    const themeToggle = page.locator('#themeToggle')
    await expect(themeToggle).toBeVisible()
  })

  test('hero com título e subtítulo visíveis', async ({ page }) => {
    await page.goto(BASE_URL)

    await expect(page.locator('.hero__title')).toBeVisible()
    await expect(page.locator('.hero__title')).toHaveText('Manual da Van')

    await expect(page.locator('.hero__subtitle')).toBeVisible()
  })

  test('video iframe do YouTube está presente', async ({ page }) => {
    await page.goto(BASE_URL)

    // Existem dois iframes do YouTube: hero e secção campervan
    const iframe = page.locator('iframe[src*="youtube.com/embed"]')
    await expect(iframe).toHaveCount(2)

    // Hero video
    const heroIframe = page.locator('.hero__video-wrapper iframe')
    await expect(heroIframe).toHaveAttribute('src', /youtube\.com\/embed\//)
    await expect(heroIframe).toHaveAttribute('loading', 'lazy')

    // Campervan tour video
    const campervanIframe = page.locator('.campervan__video-wrapper iframe')
    await expect(campervanIframe).toHaveAttribute('src', /youtube\.com\/embed\/daK41KZls5Y/)
    await expect(campervanIframe).toHaveAttribute('loading', 'lazy')

    // O wrapper existe no DOM (animação fadeInUp afecta visibilidade CSS)
    const wrapper = page.locator('.hero__video-wrapper')
    await expect(wrapper).toHaveCount(1)
  })

  test('accordion sections expandem e recolhem', async ({ page }) => {
    await page.goto(BASE_URL)

    // Devem existir 6 secções accordion
    const accordions = page.locator('.accordion')
    await expect(accordions).toHaveCount(6)

    // Verificar que todos os accordions começam fechados
    const headers = page.locator('.accordion__header')
    const headerCount = await headers.count()
    expect(headerCount).toBe(6)

    for (let i = 0; i < headerCount; i++) {
      const body = headers.nth(i).locator('~ .accordion__body')
      // O body não deve estar visível inicialmente
      // Nota: usamos `toBeHidden` que espera o elemento estar escondido
      await expect(body).toBeHidden()
    }

    // Clicar no primeiro accordion (Água) e verificar que expande
    const primeiroHeader = page.locator('.accordion__header').first()
    await primeiroHeader.click()

    // O body do primeiro accordion deve estar visível
    const primeiroBody = page.locator('.accordion__body').first()
    await expect(primeiroBody).toBeVisible()
    await expect(primeiroBody).toContainText('Sistema de Água')

    // Clicar novamente para recolher
    await primeiroHeader.click()
    await expect(primeiroBody).toBeHidden()

    // Clicar no accordion de Eletricidade (segundo) e verificar
    const segundoHeader = page.locator('.accordion__header').nth(1)
    await segundoHeader.click()

    const segundoBody = page.locator('.accordion__body').nth(1)
    await expect(segundoBody).toBeVisible()
    await expect(segundoBody).toContainText('Sistema Elétrico')
  })

  test('modo escuro toggle funciona', async ({ page }) => {
    await page.goto(BASE_URL)

    // Verificar que começa em light mode
    const html = page.locator('html')
    await expect(html).toHaveAttribute('data-theme', 'light')

    // Clicar no toggle para escuro
    const themeToggle = page.locator('#themeToggle')
    await themeToggle.click()

    // Verificar que mudou para dark
    await expect(html).toHaveAttribute('data-theme', 'dark')

    // Clicar novamente para voltar a light
    await themeToggle.click()
    await expect(html).toHaveAttribute('data-theme', 'light')
  })

  test('footer com créditos visível', async ({ page }) => {
    await page.goto(BASE_URL)

    const footer = page.locator('.footer')
    await expect(footer).toBeVisible()
    await expect(footer).toContainText('Rogério')
  })

  test('navegação por âncoras faz scroll para a secção correta', async ({ page }) => {
    await page.goto(BASE_URL)

    // Clicar no link "Água" da navegação
    const linkAgua = page.locator('.header__nav-link').filter({ hasText: 'Água' })
    await linkAgua.click()

    // Verificar que fizemos scroll para a secção #agua
    await expect(page.locator('#agua')).toBeVisible()
  })
})
