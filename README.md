# VMORDEKAI® · V02-0. | 26.11

Laboratório de design, produto, branding e produção têxtil. Site estático (HTML, CSS e JavaScript) publicado no GitHub Pages.

## Páginas

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Início |
| `portfolio-1.html` | Portfólio Briefing Estratégico B2B |
| `lab.html` | LAB: estrutura, estratégia, private label e consultoria |
| `shop.html` | Catálogo com ficha do produto em overlay |
| `produto_<slug>.html` | Uma página por produto (gerada) |
| `portfolio.html`, `index-1.html` | Endereços antigos que redirecionam |

## Estrutura

```
css/tokens.css        cores, tipografia, formas, movimento (fonte única)
css/base.css          reset e revelação no scroll
css/components.css    navbar, footer, contato, botões
css/pages/            estilos e animações de cada página
js/config.js          versão, copy, contatos e mapa do site
js/components/        <vm-header>, <vm-footer>, <vm-contato>
js/modules/           reveal, rotator (carrosséis)
js/shop/              catálogo, ficha, overlay e página do produto
data/produtos.json    catálogo (fonte única)
tools/                gerador do catálogo
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
<script type="module" src="js/site.js"></script>
```

Versão, copy e contatos ficam em `js/config.js`.

## Produtos

1. Edite `data/produtos.json` (referência, nome, dados, imagens).
2. Rode `python3 tools/build_produtos.py`.
3. O script atualiza o catálogo, as páginas `produto_<slug>.html` e a lista do shop, e mostra os dados ainda pendentes.

`python3 tools/build_produtos.py --check` confirma que tudo está em dia.

## Rodar localmente

Os módulos JavaScript exigem servidor HTTP:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

Registro desta versão: `docs/V02-0_REESTRUTURACAO_2026-11-11.md`.
