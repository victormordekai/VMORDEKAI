// VMORDEKAI® · seleção de produtos (carrinho).
// Guarda referências e quantidades no navegador e monta o pedido para o WhatsApp.
// Não há pagamento no site: a seleção vira uma mensagem com os códigos das peças.
//
// Qualquer botão com data-cart-toggle="<ref>" adiciona ou remove a peça.
// Usado em shop.html e nas páginas produto_<slug>.html.

import { PRODUTOS, brl, pageOf, priceText } from "./product-view.js";
import { url, whatsappWith } from "../config.js";

const STORAGE_KEY = "vmordekai.selecao.v1";
const MAX_QTY = 99;
const BY_REF = new Map(PRODUTOS.map(p => [p.ref, p]));
const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- estado ---------- */
const items = new Map();   // ref → quantidade

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    for (const [ref, qty] of Object.entries(saved)) {
      if (BY_REF.has(ref) && Number.isInteger(qty) && qty > 0) items.set(ref, Math.min(qty, MAX_QTY));
    }
  } catch { /* navegação privada ou dado inválido: começa vazio */ }
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(items))); } catch { /* segue só em memória */ }
}

function setQty(ref, qty) {
  if (!BY_REF.has(ref)) return;
  if (qty > 0) items.set(ref, Math.min(qty, MAX_QTY));
  else items.delete(ref);
  save();
  render();
}

const count = () => [...items.values()].reduce((a, b) => a + b, 0);
const lines = () => [...items].map(([ref, qty]) => ({ p: BY_REF.get(ref), qty }));

/* ---------- pedido ---------- */
function summary() {
  const all = lines();
  const priced = all.filter(l => l.p.preco);
  return {
    total: priced.reduce((sum, l) => sum + l.p.preco * l.qty, 0),
    hasFrom: priced.some(l => l.p.preco_prefixo),
    custom: all.length - priced.length
  };
}

export function orderMessage(notes = "") {
  const { total, hasFrom, custom } = summary();
  const rows = lines().map(({ p, qty }) => `• ${qty}× ${p.nome} — ref. ${p.ref} — ${priceText(p)}`);
  const text = ["Olá! Esta é a minha seleção na VMORDEKAI® SHOP:", "", ...rows, ""];
  if (total) text.push(`Estimativa: ${hasFrom ? "a partir de " : ""}${brl(total)}`);
  if (custom) text.push("Peças sob encomenda: aguardo orçamento conforme o lote.");
  if (notes.trim()) text.push("", `Observações: ${notes.trim()}`);
  return text.join("\n").replace(/ /g, " ");
}

/* ---------- interface ---------- */
const TEMPLATE = `
  <button type="button" class="cart-fab" data-cart-open aria-haspopup="dialog">
    <span>SELEÇÃO</span><strong data-cart-count>0</strong>
  </button>
  <div class="cart" hidden>
    <div class="cart__backdrop" data-cart-close></div>
    <aside class="cart__panel" role="dialog" aria-modal="true" aria-labelledby="cart-titulo" tabindex="-1">
      <header class="cart__head">
        <div>
          <span class="product-ref">VMORDEKAI® SHOP</span>
          <h2 id="cart-titulo">Sua seleção</h2>
        </div>
        <button type="button" class="cart__close" data-cart-close aria-label="Fechar seleção">FECHAR ✕</button>
      </header>
      <ul class="cart__list" data-cart-list></ul>
      <p class="cart__empty" data-cart-empty>Nenhuma peça selecionada. Use o botão <b>+</b> nos cards do catálogo.</p>
      <footer class="cart__foot" data-cart-foot>
        <p class="cart__total"><span>Estimativa</span> <strong data-cart-total></strong></p>
        <p class="cart__note" data-cart-note></p>
        <label class="cart__notes">Observações (cor, variação, bordado)
          <textarea rows="2" maxlength="400" data-cart-notes placeholder="Ex.: ZEN na cor Gray"></textarea>
        </label>
        <a class="product-action cart__send" data-cart-send target="_blank" rel="noopener noreferrer">Enviar seleção pelo WhatsApp</a>
        <button type="button" class="cart__clear" data-cart-clear>Limpar seleção</button>
      </footer>
    </aside>
  </div>`;

let root, drawer, panel, lastFocus;
const $ = sel => root.querySelector(sel);

function lineHtml({ p, qty }) {
  return `
    <li class="cart__item">
      <a href="${pageOf(p)}"><img src="${esc(url(p.imagens[0].src))}" alt=""></a>
      <div class="cart__info">
        <a href="${pageOf(p)}">${esc(p.nome)}</a>
        <span class="product-ref">${esc(p.ref)}</span>
        <span class="cart__price">${esc(priceText(p))}</span>
      </div>
      <div class="cart__qty" role="group" aria-label="Quantidade de ${esc(p.nome)}">
        <button type="button" data-cart-step="-1" data-ref="${esc(p.ref)}" aria-label="Diminuir">−</button>
        <output>${qty}</output>
        <button type="button" data-cart-step="1" data-ref="${esc(p.ref)}" aria-label="Aumentar">+</button>
      </div>
    </li>`;
}

/** Atualiza painel, contador e todos os botões data-cart-toggle da página. */
function render() {
  const n = count();
  const { total, hasFrom, custom } = summary();
  $("[data-cart-count]").textContent = n;
  $(".cart-fab").classList.toggle("has-items", n > 0);
  $(".cart-fab").setAttribute("aria-label", `Abrir seleção (${n} ${n === 1 ? "peça" : "peças"})`);
  $("[data-cart-list]").innerHTML = lines().map(lineHtml).join("");
  $("[data-cart-empty]").hidden = n > 0;
  $("[data-cart-foot]").hidden = n === 0;
  $("[data-cart-total]").textContent = total ? `${hasFrom ? "a partir de " : ""}${brl(total)}` : "Sob encomenda";
  $("[data-cart-note]").textContent = custom
    ? `${custom} ${custom === 1 ? "peça sob encomenda" : "peças sob encomenda"}: o valor varia conforme a quantidade do lote.`
    : "Valores e disponibilidade são confirmados no atendimento.";
  updateSendLink();
  syncButtons();
}

function updateSendLink() {
  $("[data-cart-send]").href = whatsappWith(orderMessage($("[data-cart-notes]").value));
}

function syncButtons(scope = document) {
  scope.querySelectorAll("[data-cart-toggle]").forEach(btn => {
    const selected = items.has(btn.dataset.cartToggle);
    if (btn.getAttribute("aria-pressed") === String(selected)) return;
    btn.setAttribute("aria-pressed", String(selected));
    const label = btn.querySelector("[data-cart-label]");
    if (label) label.textContent = selected ? "✓ Na seleção" : "+ Adicionar à seleção";
    else btn.textContent = selected ? "✓" : "+";
    const name = BY_REF.get(btn.dataset.cartToggle)?.nome ?? "";
    btn.setAttribute("aria-label", selected ? `Remover ${name} da seleção` : `Adicionar ${name} à seleção`);
  });
}

function open() {
  lastFocus = document.activeElement;
  drawer.hidden = false;
  requestAnimationFrame(() => drawer.classList.add("is-open"));
  panel.focus({ preventScroll: true });
}

function close() {
  if (drawer.hidden) return;
  drawer.classList.remove("is-open");
  setTimeout(() => { drawer.hidden = true; lastFocus?.focus({ preventScroll: true }); }, 300);
}

export function initCart() {
  if (root) return;
  load();
  root = document.createElement("div");
  root.className = "cart-root";
  root.innerHTML = TEMPLATE;
  document.body.append(root);
  drawer = $(".cart");
  panel = $(".cart__panel");

  document.addEventListener("click", e => {
    const toggle = e.target.closest("[data-cart-toggle]");
    if (toggle) {
      e.preventDefault();
      const ref = toggle.dataset.cartToggle;
      setQty(ref, items.has(ref) ? 0 : 1);
      return;
    }
    const step = e.target.closest("[data-cart-step]");
    if (step) return setQty(step.dataset.ref, (items.get(step.dataset.ref) || 0) + Number(step.dataset.cartStep));
    if (e.target.closest("[data-cart-open]")) return open();
    if (e.target.closest("[data-cart-close]")) return close();
    if (e.target.closest("[data-cart-clear]")) { items.clear(); save(); render(); }
  });
  $("[data-cart-notes]").addEventListener("input", updateSendLink);

  // Esc fecha primeiro a seleção; a ficha do produto, se aberta, continua onde está.
  window.addEventListener("keydown", e => {
    if (e.key === "Escape" && !drawer.hidden) { e.stopPropagation(); close(); }
  }, true);

  // Catálogo, ficha e relacionados são renderizados depois: mantém os botões em dia.
  new MutationObserver(() => syncButtons()).observe(document.body, { childList: true, subtree: true });

  // Outra aba alterou a seleção.
  window.addEventListener("storage", e => { if (e.key === STORAGE_KEY) { items.clear(); load(); render(); } });

  render();
}
