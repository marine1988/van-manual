const { test, expect } = require('@playwright/test');

// Verificação do texto renderizado da condição "aguas limpas" nas 5 línguas
// water -> 10€, grey -> 20€ (inalterado). Verificação por elemento, não body inteiro.
test.describe('Lang render verification — about.return.water', () => {
  const cases = [
    { lang: 'pt', water10: /debitar 10 € da caução/, water20: /debitar 20 € da caução/, grey20: /debitar 20 € da caução/ },
    { lang: 'en', water10: /€10 deducted from the deposit/, water20: /€20 deducted from the deposit/, grey20: /€20 deducted from the deposit/ },
    { lang: 'fr', water10: /10 € débités de la caution/, water20: /20 € débités de la caution/, grey20: /20 € débités de la caution/ },
    { lang: 'es', water10: /10 € debitados de la fianza/, water20: /20 € debitados de la fianza/, grey20: /20 € debitados de la fianza/ },
    { lang: 'de', water10: /10 € von der Kaution abgezogen/, water20: /20 € von der Kaution abgezogen/, grey20: /20 € von der Kaution abgezogen/ },
  ];

  for (const c of cases) {
    test(`${c.lang}: water mostra 10€, grey mantém 20€`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto('/');
      await page.evaluate((lang) => {
        if (window.applyTranslations) window.applyTranslations(lang);
      }, c.lang);
      await page.waitForTimeout(200);

      const waterEl = page.locator('[data-i18n="about.return.water"]');
      const greyEl = page.locator('[data-i18n="about.return.grey"]');
      await expect(waterEl).toContainText(c.water10, `water em ${c.lang} deve mostrar 10€`);
      await expect(waterEl).not.toContainText(c.water20, `water em ${c.lang} NÃO deve mostrar 20€`);
      await expect(greyEl).toContainText(c.grey20, `grey em ${c.lang} deve manter 20€`);
      expect(errors).toEqual([]);
    });
  }
});
