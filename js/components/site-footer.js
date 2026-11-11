// <vm-footer> · footer comum: mapa do site, copy e versão.
// Conteúdo vem de js/config.js; nenhuma página escreve o footer à mão.

import { SITE, SITE_MAP, isExternal } from "../config.js";

const linkHtml = ({ label, href }) =>
  `<li><a href="${href}"${isExternal(href) ? ' target="_blank" rel="noopener noreferrer"' : ""}>${label}${isExternal(href) ? " ↗" : ""}</a></li>`;

class SiteFooter extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";
    this.innerHTML = `
      <footer class="site-footer">
        <nav aria-label="Mapa do site"><ul class="site-footer__links">${SITE_MAP.map(linkHtml).join("")}</ul></nav>
        <p class="site-footer__copy">${SITE.copy}</p>
        <span class="site-footer__version">${SITE.version}</span>
      </footer>`;
  }
}

customElements.define("vm-footer", SiteFooter);
