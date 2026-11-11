# VMORDEKAI® · V02-1. | 26.11 · Páginas em pastas e portfólio padronizado

Data: 2026-11-11. Base: V02-0. | 26.11 (ver `V02-0_REESTRUTURACAO_2026-11-11.md`).

## 1. Nova organização das páginas

```
index.html                         única página na raiz
pages/portfolio-1.html
pages/lab.html
pages/shop.html
pages/produtos/produto_<slug>.html (7 páginas, geradas)
```

Removidos por conteúdo duplicado: `index-1.html` e `portfolio.html`. Endereços antigos que apontavam para eles, ou para páginas na raiz (`shop.html`, `lab.html`, `portfolio-1.html`, `produto_*.html`), passam a dar 404. Atualize links externos, como a bio do Instagram e o LinkedIn.

### Caminhos

- HTML: caminhos relativos à própria pasta (`../css/…` em `pages/`, `../../css/…` em `pages/produtos/`).
- Componentes e catálogo: `js/config.js` calcula a raiz do site a partir do próprio arquivo (`ROOT`) e expõe `url()` e `PAGES`. Navbar, footer, cards e fichas de produto geram links corretos em qualquer profundidade de pasta. Para mover ou renomear uma página, basta alterar `PAGES`.
- CSS: `url()` relativo ao arquivo CSS (inalterado).
- Catálogo: caminhos de imagem em `data/produtos.json` continuam relativos à raiz.

### Gerador

`tools/build_produtos.py` grava em `pages/produtos/`, atualiza a lista sem JavaScript em `pages/shop.html` e remove páginas de produtos que saírem do catálogo.

## 2. `pages/portfolio-1.html` padronizada

- Mesma base das demais: `tokens.css` + `base.css` + `components.css` + `pages/portfolio.css`, e `js/site.js` (sem scripts inline).
- Carrosséis via `data-rotator` (mesmos intervalos: 4,5 s e 5 s) e revelação no scroll via módulo comum. As animações da página continuam as mesmas.
- Contato pelo componente `<vm-contato>` (Formspree inalterado). Com isso:
  - o botão Facebook agora leva ao Facebook;
  - "Trabalhe Conosco" duplicando o LinkedIn saiu.
- Correções de marcação: seções aninhadas sem fechamento, `<! <br !>`, item de lista vazio e `<br>` usados como espaçamento (substituídos por `padding` na seção Private Label).
- Links internos (`#vm-editorial`) não abrem mais em nova aba.
- "Quem somos" agora é um bloco compartilhado com o index (`components.css`), com título no vermelho da marca nas duas páginas. A regra saiu de `index.css` e de `portfolio.css`.
- `portfolio.css` ficou só com o que é do portfólio e do LAB: sem reset, corpo, links, revelação, "Quem somos" e formulário antigo.

## 3. Ajustes gerais

- `html{overflow-x:clip}`: elementos que entram pela lateral (`.reveal.right`) e o fundo ampliado do BRIEFING não criam mais rolagem horizontal no celular.
- CTA do portfólio/LAB no celular: `padding` reduzido; o texto vazava da caixa (defeito herdado).
- O footer marca a página atual (`aria-current`), com o mesmo realce do hover.
- Versão: `V02-1. | 26.11` (em `js/config.js`).

## 4. Testes (Chromium/Playwright, servidor local)

- 32 verificações de interação, todas aprovadas, incluindo:
  - links do footer e do logo testados a partir de `pages/produtos/`;
  - duplicatas retornando 404;
  - `portfolio-1` sem scripts inline, com os dois carrosséis ativos e o contato correto.
- Varredura das 11 páginas em 1366 px e 390 px: nenhum erro de JavaScript e nenhum recurso 404.
- Abertura do index (hero, cards e barra) idêntica pixel a pixel à V02-0.
- Nenhuma página com rolagem horizontal em 390 px.
