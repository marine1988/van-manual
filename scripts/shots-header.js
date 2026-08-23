// Regenera os screenshots de verificação do redesign do header (design-review/)
// Estado final: 390 / 768 / 1024 / 1440 / 1920 + variantes dark/menu/lang
const { chromium } = require('@playwright/test')
const { spawn } = require('child_process')

const OUT = 'design-review'
const BASE = 'http://127.0.0.1:3000'

async function main() {
  const server = spawn('node', ['scripts/serve.js'], { stdio: 'ignore' })
  // espera o servidor ficar pronto
  await new Promise((res) => setTimeout(res, 800))

  const browser = await chromium.launch()
  const page = await browser.newPage({ deviceScaleFactor: 1 })

  const shots = [
    { name: 'mobile-390.png', w: 390, h: 844, dark: false, menu: false, lang: false },
    { name: 'tablet-768.png', w: 768, h: 1024, dark: false, menu: false, lang: false },
    { name: 'tablet-1024.png', w: 1024, h: 768, dark: false, menu: false, lang: false },
    { name: 'desktop-1440.png', w: 1440, h: 900, dark: false, menu: false, lang: false },
    { name: 'desktop-1920.png', w: 1920, h: 1080, dark: false, menu: false, lang: false },
    { name: 'dark-390.png', w: 390, h: 844, dark: true, menu: false, lang: false },
    { name: 'menu-open-390.png', w: 390, h: 844, dark: false, menu: true, lang: false },
    { name: 'menu-open-768.png', w: 768, h: 1024, dark: false, menu: true, lang: false },
    { name: 'lang-open-1024.png', w: 1024, h: 768, dark: false, menu: false, lang: true },
    { name: 'lang-open-1440.png', w: 1440, h: 900, dark: false, menu: false, lang: true },
  ]

  for (const s of shots) {
    await page.setViewportSize({ width: s.w, height: s.h })
    await page.goto(BASE, { waitUntil: 'networkidle' })
    if (s.dark) {
      // ativa dark mode (o toggle escreve no localStorage; recarregar)
      await page.click('#themeToggle')
      await page.goto(BASE, { waitUntil: 'networkidle' })
    }
    if (s.menu) {
      await page.click('.header__hamburger')
      await page.waitForTimeout(450) // transição 350ms
    }
    if (s.lang) {
      await page.click('.language-switcher__current')
      await page.waitForTimeout(250) // transição 150ms
    }
    await page.screenshot({ path: `${OUT}/${s.name}`, fullPage: false })
    console.log('ok', s.name)
  }

  await browser.close()
  server.kill()
}

main().catch((e) => { console.error(e); process.exit(1) })