# Manual da Van 🚐

Site estático single-page com o manual completo da van — água, eletricidade, gás, checklist pré-viagem, manutenção e dicas.

## Stack

- HTML5 + CSS3 + JavaScript Vanilla
- Sem frameworks, sem build step, sem npm
- Design responsivo mobile-first
- Modo escuro com persistência em localStorage
- Accordion para conteúdo expansível
- Vídeo YouTube embebido

## Como usar

Abre `index.html` diretamente no browser. Não precisa de servidor.

```
firefox index.html
# ou
google-chrome index.html
```

## Estrutura

```
van-manual/
├── index.html       # Página principal
├── css/
│   └── style.css    # Estilos com variáveis CSS
├── js/
│   └── main.js      # Lógica (accordion, dark mode, smooth scroll)
├── img/             # Imagens (para futuro)
└── README.md
```

## TODO

- [ ] Substituir o vídeo placeholder do YouTube pelo link real
- [ ] Adicionar imagens reais (esquemas elétricos, planta da van, etc.)
- [ ] Adicionar PWA manifest + service worker para uso offline
- [ ] Tradução para EN (opcional)
