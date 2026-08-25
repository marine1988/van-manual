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

  /* ---------- Language Switcher ---------- */
  const langCurrent = document.querySelector(".language-switcher__current");
  const langDropdown = document.querySelector(".language-switcher__dropdown");
  const langItems = document.querySelectorAll(
    '.language-switcher__dropdown li[data-lang]'
  );

  if (langCurrent && langDropdown) {
    /* Toggle dropdown no clique do botão */
    langCurrent.addEventListener("click", function (e) {
      e.stopPropagation();
      const isOpen = langCurrent.getAttribute("aria-expanded") === "true";
      langCurrent.setAttribute("aria-expanded", isOpen ? "false" : "true");

      /* Em mobile, fechar hamburger se estiver aberto */
      if (nav && nav.classList.contains("is-open") && hamburger) {
        nav.classList.remove("is-open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });

    /* Fechar dropdown ao clicar fora */
    document.addEventListener("click", function () {
      if (langCurrent.getAttribute("aria-expanded") === "true") {
        langCurrent.setAttribute("aria-expanded", "false");
      }
    });

    /* Selecionar idioma */
    langItems.forEach(function (item) {
      item.addEventListener("click", function (e) {
        e.stopPropagation();

        const lang = item.getAttribute("data-lang");
        if (typeof applyTranslations === "function") {
          applyTranslations(lang);
        }

        /* Atualizar botão: bandeira + código */
        const flag = item.querySelector(".language-switcher__flag");
        const codeSpan = langCurrent.querySelector(
          ".language-switcher__code"
        );
        const flagCurrent = langCurrent.querySelector(
          ".language-switcher__flag"
        );
        if (flag && flagCurrent) {
          flagCurrent.textContent = flag.textContent;
        }
        if (codeSpan) {
          codeSpan.textContent = lang.toUpperCase();
        }

        /* Atualizar aria-selected */
        langItems.forEach(function (li) {
          li.setAttribute("aria-selected", "false");
        });
        item.setAttribute("aria-selected", "true");

        /* Fechar dropdown */
        langCurrent.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Manual Tabs ---------- */
  /* Os capítulos do manual são TABS; só a FAQ mantém accordion. */
  const MANUAL_SECTIONS = [
    "eletrico", "agua", "aquecimento", "cozinha", "cama",
    "wc", "ventilacao", "exterior", "controlo", "bms"
  ];
  const tabButtons = Array.from(
    document.querySelectorAll(".manual-tabs .manual-tabs__btn")
  );
  const tabPanels = new Map(
    MANUAL_SECTIONS
      .map(function (id) {
        const panel = document.getElementById(id);
        return panel ? [id, panel] : null;
      })
      .filter(Boolean)
  );

  /* Indicador de scroll da tabbar em mobile: fades nas bordas.
     Apenas classes visuais — não interfere com a ativação/deep-link. */
  (function initTabScrollIndicator() {
    const tabBar = document.querySelector(".manual-tabs");
    if (!tabBar) return;

    function updateScrollState() {
      var maxScroll = tabBar.scrollWidth - tabBar.clientWidth;
      tabBar.classList.toggle(
        "can-scroll-right",
        maxScroll > 1 && tabBar.scrollLeft < maxScroll - 1
      );
      tabBar.classList.toggle("is-scrolled-left", tabBar.scrollLeft > 1);
    }

    tabBar.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    updateScrollState();
  })();

  function activateTab(sectionId) {
    const panel = tabPanels.get(sectionId);
    if (!panel) return null;

    let activeIndex = 0;
    tabButtons.forEach(function (btn, i) {
      const isActive = btn.getAttribute("data-target") === sectionId;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
      btn.setAttribute("tabindex", isActive ? "0" : "-1");
      if (isActive) activeIndex = i;
    });

    tabPanels.forEach(function (p, id) {
      p.hidden = id !== sectionId;
    });

    /* Sincronizar hash para deep-links sem saltar a página.
       NÃO escrever durante o load: um replaceState com fragmento antes de
       "complete" dispara o scroll nativo do browser para a âncora e a página
       salta do hero para o manual. Depois do load é seguro (não faz scroll). */
    if ("#" + sectionId !== window.location.hash && document.readyState === "complete") {
      try {
        history.replaceState(null, "", "#" + sectionId);
      } catch (_) { /* noop */ }
    }

    return {
      panel: panel,
      button: tabButtons[activeIndex],
      index: activeIndex,
    };
  }

  /* Navegação por setas entre tabs (ARIA) */
  if (tabButtons.length) {
    tabButtons.forEach(function (btn) {
      btn.addEventListener("keydown", function (e) {
        const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
        if (!keys.includes(e.key)) return;
        e.preventDefault();
        const idx = tabButtons.indexOf(btn);
        let next = idx;
        if (e.key === "ArrowRight") next = (idx + 1) % tabButtons.length;
        else if (e.key === "ArrowLeft")
          next = (idx - 1 + tabButtons.length) % tabButtons.length;
        else if (e.key === "Home") next = 0;
        else next = tabButtons.length - 1;
        tabButtons[next].focus();
        activateTab(tabButtons[next].getAttribute("data-target"));
      });
    });
  }

  /* Clique nas tabs */
  tabButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const res = activateTab(btn.getAttribute("data-target"));
      if (res) scrollToTarget(res.panel);
    });
  });

  /* Deep-link: #agua ao carregar ativa a tab Água */
  (function initFromHash() {
    const initialId =
      window.location.hash && tabPanels.has(window.location.hash.slice(1))
        ? window.location.hash.slice(1)
        : "eletrico";
    activateTab(initialId);
  })();

  /* ---------- FAQ Accordion ---------- */
  const faqQuestions = document.querySelectorAll(".faq-item__question");

  faqQuestions.forEach(function (question) {
    question.addEventListener("click", function () {
      const isOpen = question.getAttribute("aria-expanded") === "true";
      const answer = question.nextElementSibling;

      if (!answer || !answer.classList.contains("faq-item__answer")) return;

      question.setAttribute("aria-expanded", isOpen ? "false" : "true");
      answer.setAttribute("aria-hidden", isOpen ? "true" : "false");
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

    /* Se o alvo é um painel do manual, ativar primeiro a tab correspondente */
    if (tabPanels.has(targetId)) {
      activateTab(targetId);
    }

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

  /* ---------- Dropdown "Manual" no header desktop ---------- */
  const dropdownItem = document.querySelector(".header__nav-item--dropdown");
  if (dropdownItem) {
    const dropdownToggle = dropdownItem.querySelector(".header__nav-link");

    dropdownToggle.addEventListener("click", function (e) {
      /* Em <1280px o dropdown está sempre aberto (sublista); deixar o link
         comportar-se como âncora normal. Em desktop, alternar o painel. */
      if (window.matchMedia("(min-width: 1280px)").matches) {
        e.preventDefault();
        const open = dropdownItem.classList.toggle("is-open");
        dropdownToggle.setAttribute("aria-expanded", open ? "true" : "false");
        e.stopPropagation();
      }
    });

    document.addEventListener("click", function (e) {
      if (
        dropdownItem.classList.contains("is-open") &&
        !dropdownItem.contains(e.target)
      ) {
        dropdownItem.classList.remove("is-open");
        dropdownToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (hamburger && nav) {
    hamburger.addEventListener("click", function () {
      const isOpen = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", isOpen ? "false" : "true");
      nav.classList.toggle("is-open");

      /* Fechar language dropdown se estiver aberto (especialmente em mobile) */
      if (langCurrent && langCurrent.getAttribute("aria-expanded") === "true") {
        langCurrent.setAttribute("aria-expanded", "false");
      }
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

  /* ---------- Scroll-spy: marca o link da secção visível ---------- */
  const navLinks = Array.from(
    document.querySelectorAll(".header__nav-link[href^='#']")
  );
  const sections = navLinks
    .map(function (link) {
      return document.getElementById(link.getAttribute("href").slice(1));
    })
    .filter(function (el) {
      /* Excluir paineis escondidos (ex.: tabs do manual) — getBoundingClientRect
         de elementos hidden devolve 0 e engana o scrollspy. */
      return Boolean(el) && el.offsetParent !== null;
    });

  if (navLinks.length && "IntersectionObserver" in window) {
    const visible = new Map(); // section -> ratio visível

    const spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            visible.set(entry.target, entry.intersectionRatio);
          } else {
            visible.delete(entry.target);
          }
        });

        let current = null;
        let bestRatio = 0;
        visible.forEach(function (ratio, section) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            current = section;
          }
        });

        /* Fallback: nenhuma secção cruza a linha — escolher a última acima do topo */
        if (!current) {
          var headerOffset =
            parseInt(
              getComputedStyle(document.documentElement).getPropertyValue(
                "--header-height"
              )
            ) + 1;
          for (var i = sections.length - 1; i >= 0; i--) {
            if (sections[i].getBoundingClientRect().top <= headerOffset) {
              current = sections[i];
              break;
            }
          }
        }

        navLinks.forEach(function (link) {
          link.classList.toggle(
            "is-active",
            !!current &&
              link.getAttribute("href") === "#" + current.id
          );
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.1, 0.25, 0.5] }
    );

    sections.forEach(function (section) {
      spy.observe(section);
    });
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

  /* ---------- Search + Manual Index ---------- */
  const ACCORDION_SECTIONS = MANUAL_SECTIONS;
  const BIG_SECTIONS = ["video", "galeria", "sobre"];

  function normalizeText(str) {
    return String(str)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function stripHtml(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }

  function getCurrentLang() {
    try {
      return localStorage.getItem("van-manual-lang") || "pt";
    } catch (_) {
      return "pt";
    }
  }

  function scrollToTarget(target) {
    if (!target) return;
    const headerHeight =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-height"
        )
      ) || 80;

    /* A expansão de accordions (max-height transition) altera o layout acima
       do alvo — esperar pelo fim da transição ANTES de medir e fazer scroll */
    const body = target.querySelector(".accordion__body");
    const pendingTransitions =
      body && getComputedStyle(body).transitionDuration !== "0s";

    const doScroll = function () {
      /* A barra de tabs sticky cobre o topo do painel — somar à altura do header */
      const tabBar = document.querySelector(".manual-tabs");
      const extra = tabBar ? tabBar.getBoundingClientRect().height : 0;
      const isTabPanel = target.classList.contains("manual-tab-panel");
      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        (isTabPanel ? extra + 8 : 16);
      window.scrollTo({ top: top, behavior: "smooth" });
    };

    let scrolled = false;
    const scrollOnce = function () {
      if (scrolled) return;
      scrolled = true;
      doScroll();
    };

    if (pendingTransitions) {
      body.addEventListener("transitionend", scrollOnce, { once: true });
      /* fallback determinístico caso a transição não dispare transitionend */
      setTimeout(scrollOnce, 500);
    } else {
      /* Layout já estável (rAF duplo garante que a classe .open foi aplicada
         e refluída antes de medir) */
      requestAnimationFrame(function () {
        requestAnimationFrame(scrollOnce);
      });
    }

    target.classList.remove("search-highlight");
    /* forçar reflow para o highlight reiniciar se já estiver presente */
    void target.offsetWidth;
    target.classList.add("search-highlight");
    setTimeout(function () {
      target.classList.remove("search-highlight");
    }, 2000);
  }

  function openAccordionSection(sectionId) {
    /* Os capítulos passaram a tabs: ativar a tab e devolver o painel */
    if (!tabPanels.has(sectionId)) return null;
    return activateTab(sectionId).panel;
  }

  function goToSection(sectionId) {
    const accordion = openAccordionSection(sectionId);
    scrollToTarget(accordion || document.getElementById(sectionId));
  }


  /* --- Construção do índice de pesquisa --- */
  const searchIndex = [];

  ACCORDION_SECTIONS.forEach(function (id) {
    const section = document.getElementById(id);
    if (!section) return;
    const title = stripHtml(section.querySelector(".manual-tab-panel__heading"));
    const content = stripHtml(
      section.querySelector(".accordion__content")
    );
    searchIndex.push({
      sectionId: id,
      title: title,
      text: normalizeText(title + " " + content),
      snippet: content,
      target: section,
      isAccordion: true,
      faqQuestion: null
    });
  });

  document.querySelectorAll(".faq-item").forEach(function (item) {
    const q = item.querySelector(".faq-item__question");
    const a = item.querySelector(".faq-item__answer");
    if (!q || !a) return;
    const question = stripHtml(q);
    const answer = stripHtml(a);
    searchIndex.push({
      sectionId: "faq",
      title: question,
      text: normalizeText(question + " " + answer),
      snippet: answer,
      target: q.closest(".faq-item"),
      isAccordion: false,
      faqQuestion: q
    });
  });

  BIG_SECTIONS.forEach(function (id) {
    const section = document.getElementById(id);
    if (!section) return;
    const sectionTitle = stripHtml(section.querySelector("h2")) || id;
    section.querySelectorAll("h2, h3, p").forEach(function (el) {
      const text = stripHtml(el);
      if (!text) return;
      searchIndex.push({
        sectionId: id,
        title: sectionTitle,
        text: normalizeText(text),
        snippet: text,
        target: section,
        isAccordion: false,
        faqQuestion: null
      });
    });
  });

  /* --- Overlay de pesquisa --- */
  const searchOverlay = document.getElementById("searchOverlay");
  const searchToggle = document.getElementById("searchToggle");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  let lastFocused = null;
  let debounceTimer = null;
  let activeResultIdx = -1;

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function t(key, fallback) {
    const lang = getCurrentLang();
    const dict = typeof translations !== "undefined" ? translations[lang] : null;
    return (dict && dict[key]) || fallback;
  }

  function buildSnippet(snippet, term) {
    const normSnippet = normalizeText(snippet);
    const idx = normSnippet.indexOf(term);
    if (idx === -1) {
      return escapeHtml(snippet.slice(0, 140)) + (snippet.length > 140 ? "…" : "");
    }
    const start = Math.max(0, idx - 40);
    const end = Math.min(snippet.length, idx + term.length + 60);
    const before = (start > 0 ? "…" : "") + snippet.slice(start, idx);
    const match = snippet.slice(idx, idx + term.length);
    const after =
      snippet.slice(idx + term.length, end) + (end < snippet.length ? "…" : "");
    return (
      escapeHtml(before) +
      "<mark>" +
      escapeHtml(match) +
      "</mark>" +
      escapeHtml(after)
    );
  }

  function renderResults(term) {
    searchResults.innerHTML = "";
    activeResultIdx = -1;

    if (!term) {
      const li = document.createElement("li");
      li.className = "search-overlay__empty";
      li.textContent = t(
        "search.hint",
        "Tenta: solar, água quente, cama, wifi..."
      );
      searchResults.appendChild(li);
      return;
    }

    const matches = [];
    for (let i = 0; i < searchIndex.length && matches.length < 10; i++) {
      if (searchIndex[i].text.indexOf(term) !== -1) {
        matches.push(searchIndex[i]);
      }
    }

    if (!matches.length) {
      const li = document.createElement("li");
      li.className = "search-overlay__empty";
      li.textContent = t("search.noResults", "Sem resultados.");
      searchResults.appendChild(li);
      return;
    }

    matches.forEach(function (entry) {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "search-overlay__result";
      btn.setAttribute("data-section", entry.sectionId);
      btn.innerHTML =
        '<span class="search-overlay__result-title">' +
        escapeHtml(entry.title) +
        "</span>" +
        '<span class="search-overlay__result-snippet">' +
        buildSnippet(entry.snippet, term) +
        "</span>";
      btn.addEventListener("click", function () {
        closeSearch();
        if (entry.faqQuestion) {
          if (entry.faqQuestion.getAttribute("aria-expanded") !== "true") {
            entry.faqQuestion.click();
          }
          scrollToTarget(entry.target);
        } else if (entry.isAccordion) {
          goToSection(entry.sectionId);
        } else {
          scrollToTarget(entry.target);
        }
      });
      li.appendChild(btn);
      searchResults.appendChild(li);
    });
  }

  function openSearch() {
    lastFocused = document.activeElement;
    searchOverlay.hidden = false;
    searchToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    searchInput.value = "";
    renderResults("");
    searchInput.focus();
  }

  function closeSearch() {
    searchOverlay.hidden = true;
    searchToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  if (searchOverlay && searchToggle && searchInput && searchResults) {
    searchToggle.addEventListener("click", openSearch);

    searchOverlay
      .querySelectorAll("[data-search-close]")
      .forEach(function (el) {
        el.addEventListener("click", closeSearch);
      });

    searchInput.addEventListener("input", function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        renderResults(normalizeText(searchInput.value.trim()));
      }, 120);
    });

    document.addEventListener("keydown", function (e) {
      const isOpen = !searchOverlay.hidden;
      if (e.key === "/" && !isOpen) {
        const tag = document.activeElement
          ? document.activeElement.tagName.toLowerCase()
          : "";
        if (tag !== "input" && tag !== "textarea") {
          e.preventDefault();
          openSearch();
        }
        return;
      }
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeSearch();
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        const items = searchResults.querySelectorAll(
          ".search-overlay__result"
        );
        if (!items.length) return;
        e.preventDefault();
        activeResultIdx =
          e.key === "ArrowDown"
            ? Math.min(activeResultIdx + 1, items.length - 1)
            : Math.max(activeResultIdx - 1, 0);
        items.forEach(function (item, i) {
          item.classList.toggle("is-active", i === activeResultIdx);
        });
        items[activeResultIdx].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter" && activeResultIdx >= 0) {
        const items = searchResults.querySelectorAll(
          ".search-overlay__result"
        );
        if (items[activeResultIdx]) {
          items[activeResultIdx].click();
        }
      }
    });
  }

})();
