// <vm-header> · navbar comum.
// A página declara apenas os próprios links; logo, botão mobile e animação são do componente.
//
//   <vm-header>
//     <a href="#top">INÍCIO</a>
//     <a href="shop.html">SHOP</a>
//   </vm-header>
//
// Atributo opcional `overlay`: o header não reserva altura no fluxo (hero já compensa).

import { SITE, isExternal } from "../config.js";

class SiteHeader extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";

    const links = [...this.querySelectorAll(":scope > a")].map(a => {
      if (isExternal(a.getAttribute("href"))) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
      return a;
    });

    this.innerHTML = `
      <header class="header">
        <a class="logo-container" href="${SITE.home}" aria-label="${SITE.name} — início">
          <img src="${SITE.logo}" alt="" width="45" height="45">
          <span class="logo-text">${SITE.name}</span>
        </a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="nav-menu" aria-label="Abrir menu">☰</button>
        <nav class="nav-menu" id="nav-menu" aria-label="Navegação principal"><ul></ul></nav>
      </header>`;

    const list = this.querySelector("ul");
    links.forEach(a => {
      const li = document.createElement("li");
      li.append(a);
      list.append(li);
    });

    this.#bindMenu();
  }

  #bindMenu() {
    const toggle = this.querySelector(".menu-toggle");
    const nav = this.querySelector(".nav-menu");
    const setOpen = open => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    };
    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
    nav.addEventListener("click", e => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") setOpen(false); });
  }
}

customElements.define("vm-header", SiteHeader);
