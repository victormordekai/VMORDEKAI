# VMORDEKAI® · V02-3. | 26.11 · Foto da ficha e escala do shop

Data: 2026-11-16. Base: V02-2. | 26.11.

## Problema

Na ficha do produto, a coluna da foto esticava até a altura do texto e a imagem usava `object-fit:cover`. Fotos quadradas eram cortadas e ampliadas (até ~1,6× em notebook), como em DK WAR VINTAGE e TERRAE. Além disso, os tamanhos gerais do shop pediam zoom de 80% em telas de notebook.

## O que mudou

- **Palco da foto** (`.product-sheet__stage`): proporção 1:1, limitado à altura visível da tela, com a foto inteira (`contain`). Fotos não quadradas recebem a própria imagem desfocada como fundo.
- **Coluna fixa**: a foto fica parada enquanto o texto da ficha rola (overlay e página do produto).
- **Zoom out ao passar o mouse**: a foto descansa a 1,14× e recua até a imagem inteira, partindo do ponto onde o cursor está. Só em dispositivos com mouse; no toque a foto já aparece inteira.
- **Escala**: ficha, cards e cabeçalho do catálogo mais compactos. Em 1280 px o catálogo passa de 4 para 5 colunas; o resumo do card ocupa no máximo 3 linhas.
- Arquivos alterados: `css/pages/shop.css`, `js/shop/product-view.js`, `js/config.js` (versão).

## Testes

30 páginas em 1366 px e 390 px e as 30 verificações de catálogo, filtros e seleção, todas aprovadas. Conferência visual em 1280 × 650 e 1366 × 768.
