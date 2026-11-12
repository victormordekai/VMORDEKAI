// VMORDEKAI® · apresentação de produtos.
// Um único renderizador para o card do catálogo, a ficha no overlay do shop
// e a página produto_[slug].html. Dados: js/data/produtos.js (gerado).

import { CATALOGO } from "../data/produtos.js";
import { CONTACT, PAGES, url, whatsappWith } from "../config.js";

export const PRODUTOS = CATALOGO.produtos;
const BY_REF = new Map(PRODUTOS.map(p => [p.ref, p]));
const BY_SLUG = new Map(PRODUTOS.map(p => [p.slug, p]));

export const findBySlug = slug => BY_SLUG.get(slug);
export const pageOf = p => PAGES.product(p.slug);
const asset = src => url(src);   // caminhos de imagem do catálogo são relativos à raiz

const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const brl = v => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

/** Plural da categoria para filtros e trilha ("Sob encomenda" não flexiona). */
export const categoryLabel = c => (c.includes(" ") ? c : `${c}s`);

/** Preço de vitrine, "a partir de …" ou o texto de quem não tem preço fixo (sob encomenda). */
export const priceText = p => (p.preco ? `${p.preco_prefixo || ""}${brl(p.preco)}` : p.preco_texto || "Sob consulta");

const isCustom = p => !p.preco && Boolean(p.preco_texto);

const reserveLink = p => whatsappWith(isCustom(p)
  ? `Olá! Gostaria de um orçamento sob encomenda: ${p.nome} (ref. ${p.ref}) da VMORDEKAI®.`
  : `Olá! Tenho interesse no produto ${p.nome} (ref. ${p.ref}) da VMORDEKAI®.`);

/** Card do catálogo. Sem JS, o link abre a página do produto; com JS, abre o overlay. */
export function cardHtml(p) {
  const chips = [p.volume, p.material].filter(Boolean).map(c => `<li>${esc(c)}</li>`).join("");
  return `
    <article class="product-card reveal" data-categoria="${esc(p.categoria)}">
      <a class="product-card__link" href="${pageOf(p)}" data-open-product="${esc(p.slug)}" aria-label="Ver detalhes de ${esc(p.nome)}">
        <div class="product-card__media">
          <img src="${esc(asset(p.imagens[0].src))}" alt="${esc(p.imagens[0].alt)}" loading="lazy">
          <div class="product-card__veil" aria-hidden="true">
            <img src="${asset("imagens/forms_z.png")}" alt="">
            <span>VER DETALHES</span>
          </div>
        </div>
        <div class="product-card__body">
          <span class="product-ref">${esc(p.ref)} · ${esc(p.categoria)}</span>
          <h3>${esc(p.nome)}</h3>
          <p>${esc(p.resumo)}</p>
          ${chips ? `<ul class="product-chips">${chips}</ul>` : ""}
          <div class="product-card__price">${esc(priceText(p))}</div>
        </div>
      </a>
      <button type="button" class="product-card__add" data-cart-toggle="${esc(p.ref)}" aria-pressed="false" aria-label="Adicionar ${esc(p.nome)} à seleção">+</button>
    </article>`;
}

function specsHtml(p) {
  const rows = [
    ["Material", p.material],
    ["Forro", p.forro],
    ["Dimensão", p.dimensoes],
    ["Volume", p.volume],
    ["Cores", p.cores],
    ["Linha", p.linha],
    ["Disponibilidade", p.disponibilidade || "Consulte pelo WhatsApp"]
  ].filter(([, v]) => v);
  return `<dl class="product-sheet__specs">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`;
}

function priceHtml(p) {
  const extras = p.complementos
    .map(ref => BY_REF.get(ref))
    .filter(c => c && c.preco)
    .map(c => ` <span class="product-sheet__plus">+ <a href="${pageOf(c)}" data-open-product="${esc(c.slug)}">${esc(c.nome)}</a> ${brl(c.preco)}</span>`)
    .join("");
  const note = p.preco_nota ? `<small class="product-sheet__note">${esc(p.preco_nota)}</small>` : "";
  return `<p class="product-sheet__price"><span>Valor</span> <strong>${esc(priceText(p))}</strong>${p.preco ? extras : ""}${note}</p>`;
}

function galleryHtml(p) {
  const [first] = p.imagens;
  const thumbs = p.imagens.length > 1
    ? `<div class="product-sheet__thumbs">${p.imagens.map((img, i) => `
        <button type="button" data-thumb="${i}" title="${esc(img.rotulo || "")}" aria-label="${esc(img.rotulo || `Imagem ${i + 1}`)} (${i + 1} de ${p.imagens.length})"${i === 0 ? ' aria-current="true"' : ""}>
          <img src="${esc(asset(img.src))}" alt="">
        </button>`).join("")}</div>`
    : "";
  return `
    <div class="product-sheet__media">
      <img class="product-sheet__main" src="${esc(asset(first.src))}" alt="${esc(first.alt)}">
      <span class="product-sheet__label" data-label${first.rotulo ? "" : " hidden"}>${esc(first.rotulo || "")}</span>
      ${thumbs}
    </div>`;
}

/** Ficha completa (layout da ficha comercial VMORDEKAI®). context: "overlay" | "page". */
export function sheetHtml(p, context = "page") {
  const highlights = p.destaques.length
    ? `<ul class="product-chips product-chips--light">${p.destaques.map(d => `<li>${esc(d)}</li>`).join("")}</ul>`
    : "";
  const instagram = p.instagram
    ? `<a class="product-action product-action--ghost" href="${esc(p.instagram)}" target="_blank" rel="noopener noreferrer">Ver no Instagram ↗</a>`
    : `<a class="product-action product-action--ghost" href="${CONTACT.instagram}" target="_blank" rel="noopener noreferrer">Instagram VMORDEKAI® ↗</a>`;
  const pageLink = context === "overlay"
    ? `<a class="product-action product-action--ghost" href="${pageOf(p)}">Página do produto →</a>`
    : "";

  return `
    <article class="product-sheet" data-product="${esc(p.slug)}">
      ${galleryHtml(p)}
      <div class="product-sheet__info">
        <span class="product-ref">${esc(p.ref)} · ${esc(p.categoria)}</span>
        <h2 class="product-sheet__title">${esc(p.nome)} <span>VMORDEKAI</span></h2>
        <p class="product-sheet__desc">${esc(p.descricao)}</p>
        ${highlights}
        ${specsHtml(p)}
        ${priceHtml(p)}
        <div class="product-sheet__actions">
          <button type="button" class="product-action product-action--select" data-cart-toggle="${esc(p.ref)}" aria-pressed="false"><span data-cart-label>+ Adicionar à seleção</span></button>
          <a class="product-action product-action--ghost" href="${reserveLink(p)}" target="_blank" rel="noopener noreferrer">${isCustom(p) ? "Pedir orçamento pelo WhatsApp" : "Reservar pelo WhatsApp"}</a>
          ${instagram}
          ${pageLink}
        </div>
      </div>
    </article>`;
}

/** Troca de imagem pela miniatura (delegação, funciona no overlay e na página). */
export function bindGallery(root) {
  root.addEventListener("click", e => {
    const thumb = e.target.closest("[data-thumb]");
    if (!thumb) return;
    const sheet = thumb.closest(".product-sheet");
    const p = findBySlug(sheet.dataset.product);
    const img = p.imagens[Number(thumb.dataset.thumb)];
    const main = sheet.querySelector(".product-sheet__main");
    main.classList.remove("is-swapping");
    void main.offsetWidth;                       // reinicia a animação de troca
    main.src = asset(img.src);
    main.alt = img.alt;
    main.classList.add("is-swapping");
    const label = sheet.querySelector("[data-label]");
    label.textContent = img.rotulo || "";
    label.hidden = !img.rotulo;
    sheet.querySelectorAll("[data-thumb]").forEach(b => b.toggleAttribute("aria-current", b === thumb));
  });
}
