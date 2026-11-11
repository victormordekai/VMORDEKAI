// VMORDEKAI® · shop.html
// Catálogo filtrável, vitrine "Últimas unidades" e ficha do produto em overlay.

import "../site.js";
import { PRODUTOS, cardHtml, pageOf } from "./product-view.js";
import { url } from "../config.js";
import { createProductOverlay } from "./product-overlay.js";
import { initReveal } from "../modules/reveal.js";
import { initRotators } from "../modules/rotator.js";

const grid = document.querySelector("[data-catalog]");
const filters = document.querySelector("[data-filters]");
const counter = document.querySelector("[data-count]");

function renderFilters() {
  const categories = [...new Set(PRODUTOS.map(p => p.categoria))];
  const button = (value, label, count) =>
    `<button type="button" data-filter="${value}" aria-pressed="${value === "todos"}">${label} <span>${count}</span></button>`;
  filters.innerHTML = button("todos", "Todos", PRODUTOS.length) +
    categories.map(c => button(c, `${c}s`, PRODUTOS.filter(p => p.categoria === c).length)).join("");
}

function renderCatalog(category = "todos") {
  const items = category === "todos" ? PRODUTOS : PRODUTOS.filter(p => p.categoria === category);
  grid.innerHTML = items.map(cardHtml).join("");
  counter.textContent = `${items.length} ${items.length === 1 ? "peça" : "peças"}`;
  initReveal(grid);
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

filters.addEventListener("click", e => {
  const btn = e.target.closest("[data-filter]");
  if (!btn) return;
  filters.querySelectorAll("[data-filter]").forEach(b => b.setAttribute("aria-pressed", String(b === btn)));
  renderCatalog(btn.dataset.filter);
});

document.addEventListener("click", e => {
  const link = e.target.closest("main [data-open-product]");
  if (!link || e.metaKey || e.ctrlKey || e.shiftKey) return;   // nova aba continua indo para a página do produto
  e.preventDefault();
  overlay.open(link.dataset.openProduct);
});

renderFilters();
renderCatalog();
renderShowcase();
overlay.syncWithUrl();
