// VMORDEKAI® · produto_[slug].html
// A página declara <body data-produto="slug">; ficha e relacionados vêm do catálogo.

import "../site.js";
import { PRODUTOS, findBySlug, sheetHtml, cardHtml, bindGallery } from "./product-view.js";
import { initReveal } from "../modules/reveal.js";
import { initCart } from "./cart.js";

const slug = document.body.dataset.produto;
const product = findBySlug(slug);
const sheet = document.querySelector("[data-product-sheet]");
const related = document.querySelector("[data-related]");

if (product) {
  sheet.innerHTML = sheetHtml(product, "page");
  bindGallery(sheet);

  // Complementos primeiro, depois a mesma categoria, até 3 sugestões.
  const others = PRODUTOS.filter(p => p.slug !== slug);
  const ranked = [
    ...others.filter(p => product.complementos.includes(p.ref)),
    ...others.filter(p => !product.complementos.includes(p.ref) && p.categoria === product.categoria),
    ...others.filter(p => !product.complementos.includes(p.ref) && p.categoria !== product.categoria)
  ].slice(0, 3);
  related.innerHTML = ranked.map(cardHtml).join("");
  initReveal(related);
}

initCart();
