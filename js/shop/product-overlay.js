// VMORDEKAI® · ficha do produto sobre o shop.
// Abre com a forma da marca (polígono do BRIEFING) se expandindo até a tela cheia.
// O endereço ganha #slug, então o link é compartilhável e o "voltar" fecha a ficha.

import { findBySlug, sheetHtml, bindGallery } from "./product-view.js";

const TEMPLATE = `
  <div class="product-overlay__backdrop" data-close-product></div>
  <div class="product-overlay__panel" role="dialog" aria-modal="true" aria-label="Detalhes do produto" tabindex="-1">
    <button type="button" class="product-overlay__close" data-close-product aria-label="Fechar">FECHAR ✕</button>
    <div class="product-overlay__content"></div>
  </div>`;

export function createProductOverlay() {
  const overlay = document.createElement("div");
  overlay.className = "product-overlay";
  overlay.hidden = true;
  overlay.innerHTML = TEMPLATE;
  document.body.append(overlay);

  const panel = overlay.querySelector(".product-overlay__panel");
  const content = overlay.querySelector(".product-overlay__content");
  let lastFocus = null;
  bindGallery(content);

  function show(slug) {
    const product = findBySlug(slug);
    if (!product) return false;
    content.innerHTML = sheetHtml(product, "overlay");
    panel.setAttribute("aria-label", `${product.nome} — ${product.ref}`);
    panel.scrollTop = 0;
    if (overlay.hidden) {
      lastFocus = document.activeElement;
      overlay.hidden = false;
      document.documentElement.classList.add("has-overlay");
      requestAnimationFrame(() => overlay.classList.add("is-open"));
    }
    panel.focus({ preventScroll: true });
    return true;
  }

  function hide() {
    if (overlay.hidden) return;
    overlay.classList.remove("is-open");
    overlay.classList.add("is-closing");
    document.documentElement.classList.remove("has-overlay");
    setTimeout(() => {
      overlay.hidden = true;
      overlay.classList.remove("is-closing");
      lastFocus?.focus({ preventScroll: true });
    }, 420);
  }

  // A URL é a fonte da verdade: #slug aberto, sem hash fechado.
  const syncWithUrl = () => {
    const slug = decodeURIComponent(location.hash.slice(1));
    if (!slug || !show(slug)) hide();
  };

  function open(slug) {
    if (location.hash === `#${slug}`) return show(slug);
    history.pushState({ product: slug }, "", `#${slug}`);
    syncWithUrl();
  }

  function close() {
    if (history.state?.product) history.back();     // desfaz o pushState: o "voltar" do navegador fica coerente
    else {
      history.replaceState(null, "", location.pathname + location.search);
      syncWithUrl();
    }
  }

  overlay.addEventListener("click", e => {
    if (e.target.closest("[data-close-product]")) { close(); return; }
    const link = e.target.closest("[data-open-product]");
    if (link) { e.preventDefault(); open(link.dataset.openProduct); }
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !overlay.hidden) close(); });
  window.addEventListener("popstate", syncWithUrl);

  return { open, syncWithUrl };
}
