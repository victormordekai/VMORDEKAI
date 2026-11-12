# VMORDEKAI® · V02-2. | 26.11 · Catálogo 2027, filtros e seleção pelo WhatsApp

Data: 2026-11-12. Base: V02-1. | 26.11 (ver `V02-1_PAGINAS_E_PORTFOLIO_2026-11-11.md`).

## 1. Catálogo (26 produtos, 84 imagens)

Fontes: Portfólio Store 2025 (.pptx), Store Academias 2026, Briefing B2B 2025 (.pdf), acervo "Produtos anúncios" e decisões da marca em 2026-11-12. O Instagram não pôde ser lido nesta rodada.

### Regra de preços

1. Base Store 2025 + 4,5% (matriz 2027).
2. Resultado acima de R$ 260: menos R$ 10.
3. Vitrine: múltiplo de R$ 5 mais próximo, menos R$ 0,10 (… 4,90 / … 9,90).

Valores já informados para 2027 (PEREGRINE R$ 335, FLY e VON HUMBOLDT R$ 365, TERRAE = AMBITUS ITER − R$ 15) receberam só o passo 3.

| Ref. | Produto | 2025 | 2027 |
|---|---|---|---|
| VMK-MOC-001 | DARK KNIGHT | 335,00 | 339,90 |
| VMK-MOC-016 | DK WAR VINTAGE | 335,00 | 339,90 |
| VMK-MOC-003 | AMBITUS ITER | 265,00 | 264,90 |
| VMK-MOC-006 | MUTATIO BAG | 375,00 | 379,90 |
| VMK-MOC-007 | ZEN | 250,00 | 249,90 |
| VMK-MOC-008 | WILK | 345,00 | 349,90 |
| VMK-MOC-011 | TYPES | 295,00 | 299,90 |
| VMK-MOC-012 | INCEPTION | 275,00 | 274,90 |
| VMK-MOC-004 | TERRAE (roll-top) | — | 249,90 |
| VMK-MOC-015 | BABY | 195,00 | 204,90 |
| VMK-MOC-013 | PEREGRINE | — | 334,90 |
| VMK-MOC-014 | FLY | — | 364,90 |
| VMK-MOC-002 | VON HUMBOLDT | — | 364,90 |
| VMK-MOC-005 | TEMÁTICA — POKÉMON | 335,00 (tabela "com bordado") | 339,90 |
| VMK-BOL-001 | CYLINDER BAG | 99,90 | 104,90 |
| VMK-BOL-003 | MALA CYLINDER | 190,00 | 199,90 |
| VMK-BOL-004 | MESSENGER | 185,00 | 194,90 |
| VMK-BOL-005 | BOLSA BOX | 149,00 | 154,90 |
| VMK-BOL-006 | POCKET BAG | 99,90 | 104,90 |
| VMK-BOL-007 | TERMOBAG | a partir de 99,90 | a partir de 104,90 |
| VMK-BOL-002 | MINIBAG | 95,00 | 99,90 |
| VMK-PER-001…005 | DUFFEL ARES, MALA OLYMPUS, LINHA ACADEMIAS, LINHA UNIVERSITÁRIA, TEMÁTICAS & EQUIPES | — | Sob encomenda (valor conforme o lote) |

### Decisões

- Produtos de mesmo nome agrupados; cores e texturas viram variações com rótulo na galeria (ZEN, AMBITUS ITER, CYLINDER, WILK, INCEPTION, BOLSA BOX…).
- DK WAR VINTAGE é produto próprio, separado da DARK KNIGHT. VON HUMBOLDT usa só as 4 fotos enviadas em 2026-11-12.
- Peças Pokémon: produto próprio e também exemplo em TEMÁTICAS & EQUIPES.
- Fora desta rodada por falta de fotos adequadas: URBAN, POCHETE, ESTOJOS e WIN.
- Hero do shop: apenas "Praticidade ao alcance das mãos."

### Campos novos em `data/produtos.json`

`imagens[].rotulo` (nome da variação), `preco_prefixo` ("a partir de "), `preco_texto` e `preco_nota` (peças sem preço fixo), `fonte` (origem do dado; não aparece no site).

## 2. Shop interativo

- **Filtros**: categoria, faixa de preço (até R$ 150 · R$ 150 a 300 · acima de R$ 300) e ordem (catálogo, menor preço, maior preço, nome). Os contadores de um grupo consideram o filtro do outro; combinações vazias ficam desativadas. "Ver todos os produtos" limpa tudo.
- **Seleção** (`js/shop/cart.js`): botão **+** nos cards e "Adicionar à seleção" na ficha. O botão flutuante SELEÇÃO abre o painel com quantidades, estimativa, observações e **Enviar seleção pelo WhatsApp**, que monta a mensagem com quantidade, nome, referência e valor de cada peça.
- A seleção fica no navegador do visitante (`localStorage`) e acompanha a navegação entre o shop e as páginas de produto. Não há pagamento nem dado enviado ao site.
- "Reservar pelo WhatsApp" (uma peça) continua na ficha; em peças sob encomenda vira "Pedir orçamento pelo WhatsApp".

## 3. Testes (Chromium/Playwright, servidor local)

- 30 páginas em 1366 px e 390 px: sem erro de JavaScript, sem 404, sem rolagem horizontal, versão no footer.
- 13 verificações de catálogo (preços, variações, sob encomenda, trilha) e 17 de filtros e seleção (contadores, ordenação, total, mensagem do WhatsApp, persistência, Esc), todas aprovadas.
- `index.html`, `lab.html`, `portfolio-1.html` e seus CSS não foram alterados nesta versão.

## 4. Pendências de dados

`python3 tools/build_produtos.py` lista os campos em aberto (volume, dimensões, material, forro ou disponibilidade de TERRAE, PEREGRINE, BABY, MESSENGER, BOLSA BOX, POCKET BAG, VON HUMBOLDT, entre outros). Campo vazio é omitido na ficha.
