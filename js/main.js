/* ============================================
   Manual da Van — Main JavaScript
   ============================================ */

(function () {
  "use strict";

  /* ---------- Dark Mode ---------- */
  const THEME_KEY = "van-manual-theme";
  const themeToggle = document.getElementById("themeToggle");
  const html = document.documentElement;

  function setTheme(theme) {
    html.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (_) {
      /* localStorage pode não estar disponível */
    }
    if (themeToggle) {
      themeToggle.querySelector(".theme-toggle__icon").textContent =
        theme === "dark" ? "☀️" : "🌙";
    }
  }

  function getPreferredTheme() {
    const stored = (() => {
      try {
        return localStorage.getItem(THEME_KEY);
      } catch (_) {
        return null;
      }
    })();
    if (stored === "dark" || stored === "light") return stored;
    /* Fallback: preferência do sistema */
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  /* Aplicar tema antes de renderizar (evita flash) */
  setTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const current = html.getAttribute("data-theme");
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  /* ---------- Accordion ---------- */
  const accordions = document.querySelectorAll(".accordion");

  accordions.forEach(function (accordion) {
    const header = accordion.querySelector(".accordion__header");
    const body = accordion.querySelector(".accordion__body");

    if (!header || !body) return;

    header.addEventListener("click", function () {
      const isOpen = header.getAttribute("aria-expanded") === "true";

      /* Fechar todos os outros accordions (comportamento accordion,
         não acordeão — cada um abre individualmente) */

      if (isOpen) {
        /* Fechar */
        header.setAttribute("aria-expanded", "false");
        body.classList.remove("is-open");
      } else {
        /* Abrir */
        header.setAttribute("aria-expanded", "true");
        body.classList.add("is-open");
      }
    });
  });

  /* ---------- Smooth Scroll para links internos ---------- */
  document.addEventListener("click", function (e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute("href").slice(1);
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();

    const headerHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--header-height"
      )
    );
    const top =
      target.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.scrollTo({
      top: top,
      behavior: "smooth",
    });

    /* Fechar menu mobile após clique */
    const nav = document.querySelector(".header__nav");
    const hamburger = document.querySelector(".header__hamburger");
    if (nav && hamburger) {
      nav.classList.remove("is-open");
      hamburger.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Mobile Hamburger ---------- */
  const hamburger = document.querySelector(".header__hamburger");
  const nav = document.querySelector(".header__nav");

  if (hamburger && nav) {
    hamburger.addEventListener("click", function () {
      const isOpen = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", isOpen ? "false" : "true");
      nav.classList.toggle("is-open");
    });

    /* Fechar menu ao clicar fora */
    document.addEventListener("click", function (e) {
      if (
        nav.classList.contains("is-open") &&
        !nav.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        nav.classList.remove("is-open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Lazy Loading de Imagens ---------- */
  /* Para já não há imagens, mas deixamos o suporte preparado */
  if ("loading" in HTMLImageElement.prototype) {
    /* O browser já suporta loading="lazy" nativo */
  } else {
    /* Fallback para browsers antigos */
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            observer.unobserve(img);
          }
        });
      });
      lazyImages.forEach(function (img) {
        observer.observe(img);
      });
    }
  }

  /* ---------- Header shrink on scroll ---------- */
  let lastScrollY = 0;

  window.addEventListener("scroll", function () {
    const currentScrollY = window.scrollY;
    const headerEl = document.querySelector(".header");

    if (!headerEl) return;

    if (currentScrollY > 80) {
      headerEl.style.boxShadow = "var(--shadow-md)";
    } else {
      headerEl.style.boxShadow = "var(--shadow-sm)";
    }

    lastScrollY = currentScrollY;
  }, { passive: true });

})();
