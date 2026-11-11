// <vm-footer> · footer comum: mapa do site, copy e versão.
// Conteúdo vem de js/config.js; nenhuma página escreve o footer à mão.

import { SITE, SITE_MAP, isExternal } from "../config.js";

const isCurrent = href => new URL(href, location.href).pathname === location.pathname;

const linkHtml = ({ label, href }) => {
  const external = isExternal(href);
  const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : (isCurrent(href) ? ' aria-current="page"' : "");
  return `<li><a href="${href}"${attrs}>${label}${external ? " ↗" : ""}</a></li>`;
};

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
