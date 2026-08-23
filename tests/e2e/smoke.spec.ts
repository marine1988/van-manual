import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000'

test.describe('Manual da Van — Smoke Tests', () => {
  test('página carrega sem erros HTTP', async ({ page }) => {
    const response = await page.goto(BASE_URL)
    expect(response?.status()).toBe(200)
    await expect(page).toHaveTitle(/Manual da Campervan/)
  })

  test('header e navegação estão visíveis', async ({ page }) => {
    await page.goto(BASE_URL)

    // Header com logo
    const header = page.locator('.header')
    await expect(header).toBeVisible()

    const logo = page.locator('.header__logo')
    await expect(logo).toBeVisible()
    await expect(logo).toHaveText(/Manual da Campervan/)

    // Navegação com links para as 12 secções
    const navLinks = page.locator('.header__nav-link')
    await expect(navLinks).toHaveCount(12)

    const expectedLinks = ['Elétrico', 'Água', 'Aquecimento', 'Cozinha', 'Cama', 'WC', 'Ventilação', 'Exterior', 'Galeria', 'Controlo', 'Bateria', 'FAQ']
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
    await expect(page.locator('.hero__title')).toHaveText('Furgão Transformado de Rogério')

    await expect(page.locator('.hero__subtitle')).toBeVisible()
    await expect(page.locator('.hero__subtitle')).toHaveText('Renault Master 2.5 dCi — Tour Completo')
  })

  test('video iframe do YouTube está presente', async ({ page }) => {
    await page.goto(BASE_URL)

    // Existe um iframe do YouTube na secção de vídeo
    const iframe = page.locator('iframe[src*="youtube.com/embed"]')
    await expect(iframe).toHaveCount(1)

    // Vídeo section iframe
    const videoIframe = page.locator('.video-section__wrapper iframe')
    await expect(videoIframe).toHaveAttribute('src', /youtube\.com\/embed\/daK41KZls5Y/)
    await expect(videoIframe).toHaveAttribute('loading', 'lazy')

    // O wrapper existe no DOM
    const wrapper = page.locator('.video-section__wrapper')
    await expect(wrapper).toHaveCount(1)
  })

  test('secção Sobre esta Van está presente', async ({ page }) => {
    await page.goto(BASE_URL)

    const aboutTitle = page.locator('.about-van__title')
    await expect(aboutTitle).toBeVisible()
    await expect(aboutTitle).toHaveText('Sobre esta Van')

    await expect(page.locator('.about-van__description')).toContainText('Renault Master 2.5 dCi')
    await expect(page.locator('.about-van__specs')).toContainText('3300 kg')
    await expect(page.locator('.about-van__specs')).toContainText('Carta de condução: B')
  })

  test('tabs do manual: 9 tabs, eletrico ativa por defeito', async ({ page }) => {
    await page.goto(BASE_URL)

    // Barra de tabs com 9 botões
    const tabs = page.locator('.manual-tabs__btn')
    await expect(tabs).toHaveCount(9)
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true')

    // Painel #eletrico visível, os restantes escondidos
    await expect(page.locator('#eletrico')).toBeVisible()
    const panels = page.locator('.manual-tab-panel')
    expect(await panels.count()).toBe(9)
    for (let i = 1; i < 9; i++) {
      await expect(panels.nth(i)).toBeHidden()
    }

    // Clicar na tab Água mostra o painel dela e esconde o anterior
    await page.locator('.manual-tabs__btn[data-target="agua"]').click()

    await expect(page.locator('#agua')).toBeVisible()
    await expect(page.locator('#agua')).toContainText('Depósito de água limpa')
    await expect(page.locator('#eletrico')).toBeHidden()
    await expect(page.locator('.manual-tabs__btn[data-target="agua"]')).toHaveAttribute('aria-selected', 'true')
    await expect(page.locator('.manual-tabs__btn[data-target="eletrico"]')).toHaveAttribute('aria-selected', 'false')

    // Voltar à tab Elétrico via clique
    await page.locator('.manual-tabs__btn[data-target="eletrico"]').click()
    await expect(page.locator('#eletrico')).toBeVisible()
    await expect(page.locator('#agua')).toBeHidden()
  })

  test('deep-link #agua abre a tab Agua diretamente', async ({ page }) => {
    await page.goto(BASE_URL + '#agua')
    await expect(page.locator('#agua')).toBeVisible()
    await expect(page.locator('#eletrico')).toBeHidden()
    await expect(page.locator('.manual-tabs__btn[data-target="agua"]')).toHaveAttribute('aria-selected', 'true')
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

  test('galeria de imagens está presente com 10 fotos reais', async ({ page }) => {
    await page.goto(BASE_URL)

    // Secção galeria existe
    const gallerySection = page.locator('#galeria')
    await expect(gallerySection).toBeVisible()

    // Título visível
    await expect(page.locator('.gallery-section__title')).toBeVisible()

    // Grid com 10 imagens (apenas fotos reais da van)
    const galleryItems = page.locator('.gallery-section__item')
    await expect(galleryItems).toHaveCount(10)

    // Nenhuma imagem de outra van (van-03, van-04, van-06 foram removidas)
    const fakeRefs = await page.locator('img[src*="van-03"], img[src*="van-04"], img[src*="van-06"]').count()
    expect(fakeRefs).toBe(0)

    // Todas as imagens têm loading=lazy
    const images = page.locator('.gallery-section__item img')
    const imgCount = await images.count()
    for (let i = 0; i < imgCount; i++) {
      await expect(images.nth(i)).toHaveAttribute('loading', 'lazy')
    }
  })
})
