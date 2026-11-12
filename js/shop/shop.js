// VMORDEKAI® · shop.html
// Catálogo com filtros (categoria, faixa de preço, ordem), vitrine "Últimas unidades",
// ficha do produto em overlay e seleção enviada pelo WhatsApp.

import "../site.js";
import { PRODUTOS, cardHtml, categoryLabel, pageOf } from "./product-view.js";
import { url } from "../config.js";
import { createProductOverlay } from "./product-overlay.js";
import { initCart } from "./cart.js";
import { initReveal } from "../modules/reveal.js";
import { initRotators } from "../modules/rotator.js";

const grid = document.querySelector("[data-catalog]");
const categoryFilters = document.querySelector("[data-filters]");
const priceFilters = document.querySelector("[data-price-filters]");
const sortSelect = document.querySelector("[data-sort]");
const resetButton = document.querySelector("[data-reset]");
const counter = document.querySelector("[data-count]");
const empty = document.querySelector("[data-empty]");

/** Faixas de preço. Peças sob encomenda não têm preço e só aparecem em "Todos". */
const PRICE_RANGES = [
  { id: "todos", label: "Todos", test: () => true },
  { id: "ate-150", label: "Até R$ 150", test: p => p.preco && p.preco <= 150 },
  { id: "150-300", label: "R$ 150 a 300", test: p => p.preco > 150 && p.preco <= 300 },
  { id: "acima-300", label: "Acima de R$ 300", test: p => p.preco > 300 }
];

const SORTERS = {
  catalogo: null,
  menor: (a, b) => (a.preco ?? Infinity) - (b.preco ?? Infinity),
  maior: (a, b) => (b.preco ?? -Infinity) - (a.preco ?? -Infinity),
  nome: (a, b) => a.nome.localeCompare(b.nome, "pt-BR")
};

const DEFAULTS = Object.freeze({ categoria: "todos", preco: "todos", ordem: "catalogo" });
const state = { ...DEFAULTS };

const inCategory = p => state.categoria === "todos" || p.categoria === state.categoria;
const inPrice = p => PRICE_RANGES.find(r => r.id === state.preco).test(p);

const button = (attr, value, label, count, pressed) =>
  `<button type="button" ${attr}="${value}" aria-pressed="${pressed}"${count ? "" : " disabled"}>${label} <span>${count}</span></button>`;

/** Os contadores de cada grupo consideram o filtro do outro grupo. */
function renderFilters() {
  const byPrice = PRODUTOS.filter(inPrice);
  const byCategory = PRODUTOS.filter(inCategory);
  const categories = [...new Set(PRODUTOS.map(p => p.categoria))];
  categoryFilters.innerHTML =
    button("data-filter", "todos", "Todos", byPrice.length, state.categoria === "todos") +
    categories.map(c => button("data-filter", c, categoryLabel(c), byPrice.filter(p => p.categoria === c).length, state.categoria === c)).join("");
  priceFilters.innerHTML = PRICE_RANGES
    .map(r => button("data-price", r.id, r.label, byCategory.filter(r.test).length, state.preco === r.id))
    .join("");
}

function renderCatalog() {
  const items = PRODUTOS.filter(p => inCategory(p) && inPrice(p));
  if (SORTERS[state.ordem]) items.sort(SORTERS[state.ordem]);
  grid.innerHTML = items.map(cardHtml).join("");
  counter.textContent = `${items.length} ${items.length === 1 ? "peça" : "peças"}`;
  empty.hidden = items.length > 0;
  resetButton.hidden = Object.keys(DEFAULTS).every(k => state[k] === DEFAULTS[k]);
  sortSelect.value = state.ordem;
  initReveal(grid);
}

function update(change) {
  Object.assign(state, change);
  renderFilters();
  renderCatalog();
}

function renderShowcase() {
  const rotator = document.querySelector("[data-showcase]");
  const featured = PRODUTOS.filter(p => p.destaque);
  rotator.innerHTML = featured.map((p, i) => `
    <a class="featured-slide${i === 0 ? " active" : ""}" data-slide href="${pageOf(p)}" data-open-product="${p.slug}">
      <img src="${url(p.imagens[0].src)}" alt="${p.imagens[0].alt}">
      <span class="featured-slide__ref">${p.ref} · ${p.nome}</span>
    </a>`).join("");
  initRotators(rotator.parentElement);
}

const overlay = createProductOverlay();

categoryFilters.addEventListener("click", e => {
  const btn = e.target.closest("[data-filter]");
  if (btn) update({ categoria: btn.dataset.filter });
});
priceFilters.addEventListener("click", e => {
  const btn = e.target.closest("[data-price]");
  if (btn) update({ preco: btn.dataset.price });
});
sortSelect.addEventListener("change", () => update({ ordem: sortSelect.value }));
resetButton.addEventListener("click", () => update(DEFAULTS));

document.addEventListener("click", e => {
  const link = e.target.closest("main [data-open-product]");
  if (!link || e.metaKey || e.ctrlKey || e.shiftKey) return;   // nova aba continua indo para a página do produto
  e.preventDefault();
  overlay.open(link.dataset.openProduct);
});

update({});
renderShowcase();
initCart();
overlay.syncWithUrl();
