# VMORDEKAI® · V02-0. | 26.11 · Auditoria e reestruturação

Data: 2026-11-11. Base: pacote `VMORDEKAI.rar` (sem histórico git).

Mesma disciplina metodológica aplicada ao FEITURA (fonte única de dados, componentes comuns, CSS/JS por responsabilidade, testes no navegador), **sem fusão estética**: cada página mantém sua identidade e suas animações.

## 1. Auditoria (estado encontrado)

| # | Achado | Efeito |
|---|---|---|
| 1 | Três implementações de navbar (`style.css`, `styleportfolio.css`, `styleshop.css`) com alturas, espaçamentos e animações diferentes | Navegação mudava de página para página |
| 2 | Cinco footers escritos à mão, com textos diferentes e sem versão | Copy inconsistente |
| 3 | `lab.html` carregava só `stylelab.css`, que não tem header, hero nem seções | Página inteira sem estilo; também não era linkada por nenhuma outra |
| 4 | `index.html` com comentário HTML mal fechado (`--` sem `>`) engolindo o carrossel de produtos e script procurando `.next` | Erro de JavaScript em toda carga do index |
| 5 | `html, body { height:100%; overflow-y:auto }` | O body virava o contêiner de rolagem (âncoras, impressão e capturas inconsistentes) |
| 6 | `index.html` ≡ `index-1.html` e `portfolio.html` ≈ `portfolio-1.html` (duplicatas) | Links internos apontando ora para um, ora para outro |
| 7 | Botão "Facebook" levando ao LinkedIn (index e portfolio-1) | Dado de contato errado |
| 8 | `branding_e_producao_06.PNG` (maiúsculas) em `lab.html` | 404 no GitHub Pages |
| 9 | Vermelho da marca em três valores (`rgb(198,72,50)`, `#c44a27`, `--accent-2`) e variáveis inexistentes (`--color-2`, `--accent-2` em portfolio) | Paleta sem fonte única |
| 10 | `scriptshop.js` (showroom GSAP) sem HTML correspondente e não carregado | Código morto; carrossel do shop não girava |
| 11 | Shop: "DARK KNIGHT" com alt "Bolsa Urbana 02", 27 L no texto × 29 L na ficha comercial; alts trocados nos demais | Dados de produto inconsistentes |
| 12 | `README.md` era o do projeto RE-TEAR | Documentação de outro projeto |
| 13 | Imagens de fundo de 4,1 MB e 1,8 MB carregadas como textura | Peso desnecessário |
| 14 | `styleintegrado.css`, `mobile.css`, `script.js` parcialmente sem uso; CSS com regras duplicadas | Ruído |

## 2. Arquitetura nova

```
index.html · portfolio-1.html · lab.html · shop.html · produto_<slug>.html
portfolio.html, index-1.html     redirecionam (preservam links antigos e #âncoras)
css/tokens.css                   paleta, tipografia, formas (polígono da marca), sombras, movimento
css/base.css                     reset, corpo, revelação no scroll
css/components.css               navbar, footer, barra de marca, botão primário, contato
css/pages/<página>.css           estilos e animações próprios de cada página
js/config.js                     versão, copy, contatos, mapa do site (fonte única)
js/components/                   <vm-header>, <vm-footer>, <vm-contato>
js/modules/                      reveal.js, rotator.js
js/shop/                         catálogo, ficha, overlay, página do produto
data/produtos.json               fonte única do catálogo
tools/build_produtos.py          gera js/data/produtos.js, páginas de produto e lista sem JS do shop
imagens/produtos, imagens/padroes  imagens otimizadas
imagens/acervo                   35 imagens que nenhuma página usa (preservadas, fora do caminho do site)
docs/                            este registro e notas antigas
```

### Navbar e footer

- `<vm-header>`: a página declara apenas os próprios links; logo, botão mobile, painel animado e hover vêm do componente. Atributo `overlay` para páginas cujo hero já compensa o header fixo.
- Disposição e animação únicas: as do index (hover com escala 1,06; painel mobile com `slideIn`). O logo ganhou o mesmo hover em escala (pedido registrado em `docs/notas/Testes_codex.txt`).
- `<vm-footer>`: mapa do site + copy `© 2016–2026 VMORDEKAI® | Laboratório de Ideias | Curitiba – PR` + versão **`V02-0. | 26.11`**, lidos de `js/config.js`.
- Links externos ganham `target="_blank" rel="noopener noreferrer"` automaticamente; âncoras internas não abrem nova aba.

## 3. Páginas

| Página | O que mudou |
|---|---|
| `index.html` | Abertura (hero, cards e barra) preservada. Abaixo dela: estrutura limpa, link para o LAB, contato comum, sem erro de JS |
| `portfolio-1.html` | **Apenas navbar e footer** (diff de ~40 linhas): componentes comuns, script de menu removido, barra pós-hero como `div.brand-bar`, `</section>` para o footer não ficar preso dentro de "Quem somos". CSS movido para `css/pages/portfolio.css` sem regras de nav/footer e sem duplicatas |
| `lab.html` | Reconstruída sobre `portfolio.css` + `lab.css`; carrosséis com `data-rotator`; contato comum; linkada pelo index e pelo footer |
| `shop.html` | Regenerada: hero comercial, catálogo filtrável, ficha em overlay, "Últimas unidades" (vitrine com os destaques do catálogo), "Como comprar" |
| `produto_<slug>.html` | 7 páginas geradas, com título, descrição e imagem Open Graph próprios, breadcrumb e "Veja também" |

### Verificação da abertura do index

Comparação pixel a pixel (1366 px e 390 px) do header até a barra grafite. Idêntica, exceto:

- botão **SIGA-ME!**: `#c44a27` → vermelho da marca `rgb(198,72,50)` (a 28% de opacidade, diferença de até 11/255);
- ícone ☰ (mobile): preto → roxo da marca;
- cantos dos cards: antialiasing ±4/255 (`div` com `onclick` virou `<a>`).

### Formulários

Mesmo endpoint Formspree (`xeedjleg`) e mesmos nomes de campo. Nova diagramação em grade, com rótulos visíveis, e dois campos ocultos: `_subject` (assunto do e-mail) e `pagina` (origem do contato). O formulário próprio da `portfolio-1.html` não foi alterado.

## 4. Shop e produtos

- Referências próprias: `VMK-MOC-001…005` (mochilas), `VMK-BOL-001…002` (bolsas). Editáveis em `data/produtos.json`.
- Ficha no layout da ficha comercial de referência: imagem à esquerda; à direita referência, nome, descrição, destaques, especificações, valor (com complementos, ex.: DARK KNIGHT + CYLINDER) e ações.
- Abertura do overlay: a fenda vira o **polígono da marca** (forma do BRIEFING) e então a tela cheia; o texto sobe em sequência. Com `prefers-reduced-motion`, só fade.
- O endereço recebe `#slug`: o link é compartilhável, e o voltar e o Esc fecham a ficha. Ctrl/⌘+clique abre a página do produto.
- "Reservar pelo WhatsApp" envia mensagem pronta com nome e referência.
- Sem JavaScript: cards são links para as páginas e o shop traz uma lista estática gerada.

### Dados dos produtos — origem e pendências

Nenhum dado foi inventado. Campo ausente aparece como "Sob consulta" (preço) ou é omitido.

| Ref. | Produto | Fonte | Pendente |
|---|---|---|---|
| VMK-MOC-001 | DARK KNIGHT | ficha comercial de referência | — (**29 L adotado**; o shop antigo dizia 27 L) |
| VMK-MOC-002 | VON HUMBOLDT | shop antigo | dimensões, forro, cores, preço, disponibilidade |
| VMK-MOC-003 | AMBITUS | imagem do site | volume, dimensões, material, forro, preço, disponibilidade |
| VMK-MOC-004 | AMBITUS ITER 2024.002 DARK | nomes das imagens | volume, dimensões, material, forro, preço, disponibilidade |
| VMK-MOC-005 | TEMÁTICA — POKÉMON | shop antigo | dimensões, forro, cores, preço, disponibilidade |
| VMK-BOL-001 | CYLINDER BAG | Briefing B2B 2025 + ficha DARK KNIGHT (R$ 89,90) | disponibilidade |
| VMK-BOL-002 | MINIBAG | Briefing B2B 2025 | volume, preço, disponibilidade |

As fotos da CYLINDER BAG e da MINIBAG foram extraídas da página "Peças pilotos" do PDF do portfólio. `produto3.jpg` (mochila temática com logotipo de terceiro) e `produto5.jpg` (mochila cobre) ficaram fora do catálogo por falta de nome e dados; estão em `imagens/acervo/`.

Para atualizar: edite `data/produtos.json` e rode `python3 tools/build_produtos.py`. O script valida referências, slugs, imagens e complementos, e lista as pendências.

## 5. Pendências fora do escopo autorizado (`portfolio-1.html`, conteúdo)

1. Botões "Facebook" e "Trabalhe Conosco" apontam para o LinkedIn.
2. Links internos `#vm-editorial` no conteúdo usam `target="_blank"`.
3. Marcação `<! <br !>` inválida e seções aninhadas sem fechamento (`#vm-structure` envolve todo o resto).
4. Título "QUEM SOMOS" sai branco (variável `--accent-2` inexistente no CSS original); no index é vermelho.
5. Formulário com a diagramação antiga (no index e no LAB já é o componente novo).

## 6. Testes (Chromium/Playwright, servidor local)

- 29 verificações de interação, todas aprovadas: header e footer comuns com versão em 6 páginas, redirecionamentos com âncora, Formspree e campos, link do Facebook, menu mobile (abrir, animar, fechar ao clicar), filtros, overlay (abrir, conteúdo, WhatsApp, troca por complemento, voltar, Esc, link direto `shop.html#minibag`), página do produto (SEO, preço sob consulta, miniaturas, relacionados) e console sem erros.
- Todas as referências locais (`href`, `src`, `url()`, imports) existem.
- `python3 tools/build_produtos.py --check` em dia.
- Defeito encontrado e corrigido durante os testes: o overlay oculto bloqueava os cliques do shop (`display:grid` vencia `hidden`). A regra `[hidden]{display:none!important}` agora está na base.
