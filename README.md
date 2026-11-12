# VMORDEKAI® · V02-2. | 26.11

Laboratório de design, produto, branding e produção têxtil. Site estático (HTML, CSS e JavaScript) publicado no GitHub Pages.

## Páginas

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Início (única página na raiz) |
| `pages/portfolio-1.html` | Portfólio Briefing Estratégico B2B |
| `pages/lab.html` | LAB: estrutura, estratégia, private label e consultoria |
| `pages/shop.html` | Catálogo com filtros, ficha em overlay e seleção enviada pelo WhatsApp |
| `pages/produtos/produto_<slug>.html` | Uma página por produto (gerada) |

## Estrutura

```
css/tokens.css        cores, tipografia, formas, movimento (fonte única)
css/base.css          reset e revelação no scroll
css/components.css    navbar, footer, contato, botões
css/pages/            estilos e animações de cada página
js/config.js          versão, copy, contatos, endereços das páginas (PAGES)
js/components/        <vm-header>, <vm-footer>, <vm-contato>
js/modules/           reveal, rotator (carrosséis)
js/shop/              catálogo, ficha, overlay e página do produto
data/produtos.json    catálogo (fonte única)
tools/                gerador do catálogo
pages/                páginas internas · produtos/ (geradas)
imagens/              imagens em uso · produtos/ · padroes/ · acervo/ (não usadas)
arquivos/             PDF e materiais do portfólio
docs/                 registros de versão e notas
```

## Navbar e footer

Todas as páginas usam os mesmos componentes. Cada página declara apenas os próprios links:

```html
<vm-header>
  <a href="#top">INÍCIO</a>
  <a href="shop.html">SHOP</a>
</vm-header>
...
<vm-footer></vm-footer>
<script type="module" src="../js/site.js"></script>   <!-- em pages/; na raiz: js/site.js -->
```

Versão, copy, contatos e endereços das páginas ficam em `js/config.js`. Os componentes calculam a raiz do site sozinhos, então funcionam em qualquer pasta.

## Produtos

1. Edite `data/produtos.json` (referência, nome, dados, imagens).
2. Rode `python3 tools/build_produtos.py`.
3. O script atualiza o catálogo, as páginas em `pages/produtos/` e a lista do shop, e mostra os dados ainda pendentes.

`python3 tools/build_produtos.py --check` confirma que tudo está em dia.

## Rodar localmente

Os módulos JavaScript exigem servidor HTTP:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

Registros: `docs/V02-2_CATALOGO_2027_E_SELECAO_2026-11-12.md` (catálogo 2027, filtros e seleção pelo WhatsApp), `docs/V02-0_REESTRUTURACAO_2026-11-11.md` (auditoria e reestruturação) e `docs/V02-1_PAGINAS_E_PORTFOLIO_2026-11-11.md` (pastas e portfólio).
