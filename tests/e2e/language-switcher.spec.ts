import { test, expect } from '@playwright/test'

// Language switcher real: clica no seletor e valida que o texto do hero muda
// para cada uma das 5 línguas (frase âncora por idioma).
const cases = [
  { lang: 'pt', code: 'PT', anchor: 'Furgão Transformado de Rogério' },
  { lang: 'en', code: 'EN', anchor: "Rogério's Converted Van" },
  { lang: 'fr', code: 'FR', anchor: 'Furgon Aménagé de Rogério' },
  { lang: 'es', code: 'ES', anchor: 'Furgoneta Camperizada de Rogério' },
  { lang: 'de', code: 'DE', anchor: 'Rogérios Ausgebauter Van' },
]

test.describe('Language switcher — 5 línguas', () => {
  for (const c of cases) {
    test(`muda o texto do hero para ${c.lang}`, async ({ page }) => {
      const errors: string[] = []
      page.on('pageerror', (e) => errors.push(e.message))

      await page.goto('/')

      // Abrir o dropdown (clique real no seletor)
      const current = page.locator('.language-switcher__current')
      await expect(current).toBeVisible()
      await current.click()
      await expect(current).toHaveAttribute('aria-expanded', 'true')

      // Clicar na opção da língua
      await page.locator(`.language-switcher__dropdown li[data-lang="${c.lang}"]`).click()

      // O texto âncora do hero muda
      await expect(page.locator('.hero__title')).toContainText(c.anchor)

      // O botão mostra o código novo e o dropdown fecha
      await expect(page.locator('.language-switcher__code')).toHaveText(c.code)
      await expect(current).toHaveAttribute('aria-expanded', 'false')

      // Sem erros de JavaScript
      expect(errors).toEqual([])
    })
  }
})