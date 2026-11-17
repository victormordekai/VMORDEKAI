# VMORDEKAI® · V02-4. | 26.11 · Linha conceitual, academias e fotos novas

Data: 2026-11-17. Base: V02-3. | 26.11.

## Catálogo (29 produtos)

- **Nova categoria "Conceitual"** (filtro "Conceituais"): peças feitas de látex e tecido acquablock.
  - `VMK-CON-001` MINIBAG CONCEITUAL (fotos "minibag VMORDEKAI Conceitul 002"), R$ 99,90 como a MINIBAG.
  - `VMK-CON-002` TERMOBAG CONCEITUAL (fotos "Conceitul TERMOBAG", coleção "Da floresta à cidade"), a partir de R$ 104,90.
- **MINIBAG** sem a foto conceitual; ganhou três fotos do acervo (três quartos, vivo azul, bolso frontal).
- **TERMOBAG** passa a ser só a `TB23A001` (ref. `VMK-BOL-007`, mesma página `produto_termobag.html`). Capa: "TERMOBAG TB23A001 VMORDEKAI 001 02".
- **Academias, sem Black Diamond.** LINHA ACADEMIAS, DUFFEL ARES e MALA OLYMPUS usam só as fotos da pasta "Produtos personalizados para academias", com a chamada "Academia? Personalize com sua logo.". DUFFEL ARES ganhou a versão prata.
- **TEMÁTICAS & EQUIPES** é o único lugar com Black Diamond: capa FLYGHT Black Diamond, segunda foto DARK KNIGHT Black Diamond. A foto do Coelho Team veio da LINHA ACADEMIAS para cá.
- **Fotos novas agrupadas:** TERRAE (verde frente e costas, versão preta em estúdio e externa), DARK KNIGHT (em uso, lateral) e o novo produto `VMK-MOC-017` VINTAGE (3 fotos "Mochila Vintage 2016"; nome provisório, preço "Sob consulta").

## Código

- `js/shop/product-view.js` e `tools/build_produtos.py`: plural irregular "Conceitual → Conceituais" no filtro e na trilha.
- `js/config.js`: versão V02-4.

## Arquivos de imagem sem uso (podem ser apagados)

`imagens/produtos/termobag-04.jpg`, `linha-academias-04.jpg`, `linha-academias-05.jpg`.

## Testes (Chromium, servidor local)

Filtros (Todos 29 · Mochilas 15 · Bolsas 7 · Conceituais 2 · Sob encomenda 5), 9 páginas de produto alteradas sem erro de JavaScript nem imagem quebrada, sem rolagem horizontal em 390 px. Nenhum produto além de TEMÁTICAS & EQUIPES menciona Black Diamond.
