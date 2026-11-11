// VMORDEKAI® · configuração institucional.
// Fonte única de versão, copy, contatos e endereços do site.
// Footer, contato e loja leem daqui.

/** Raiz do site, calculada a partir deste arquivo (js/config.js → ../).
 *  Funciona igual em index.html, pages/ e pages/produtos/. */
export const ROOT = new URL("../", import.meta.url);

/** Caminho relativo à raiz → endereço absoluto. Ex.: url("pages/shop.html") */
export const url = path => new URL(path, ROOT).href;

/** Endereços das páginas (um só lugar para renomear ou mover). */
export const PAGES = Object.freeze({
  home: url("index.html"),
  shop: url("pages/shop.html"),
  portfolio: url("pages/portfolio-1.html"),
  lab: url("pages/lab.html"),
  product: slug => url(`pages/produtos/produto_${slug}.html`)
});

export const SITE = Object.freeze({
  name: "VMORDEKAI®",
  version: "V02-1. | 26.11",
  copy: "© 2016–2026 VMORDEKAI® | Laboratório de Ideias | Curitiba – PR",
  slogan: "Praticidade ao alcance das mãos",
  cnpj: "26.732.865/0001-36",
  logo: url("imagens/logo-corpo.png")
});

export const CONTACT = Object.freeze({
  email: "vmordekai@hotmail.com",
  phone: "5541997584893",                         // (41) 99758-4893
  whatsapp: "https://wa.me/message/LIKDPGYCWU5CF1",
  instagram: "https://instagram.com/vmordekai",
  facebook: "https://www.facebook.com/vmordekai/",
  linkedin: "https://www.linkedin.com/in/victormordekai/",
  retear: "https://victormordekai.github.io/RE-TEAR/",
  formspree: "https://formspree.io/f/xeedjleg"
});

/** Mapa do site exibido no footer de todas as páginas. */
export const SITE_MAP = Object.freeze([
  { label: "INÍCIO", href: PAGES.home },
  { label: "SHOP", href: PAGES.shop },
  { label: "PORTFÓLIO", href: PAGES.portfolio },
  { label: "LAB", href: PAGES.lab },
  { label: "RETEAR", href: CONTACT.retear },
  { label: "INSTAGRAM", href: CONTACT.instagram },
  { label: "LINKEDIN", href: CONTACT.linkedin }
]);

/** Link de WhatsApp com mensagem pronta (ex.: interesse em um produto). */
export const whatsappWith = text => `https://wa.me/${CONTACT.phone}?text=${encodeURIComponent(text)}`;

/** Externo = outro domínio. Links internos (inclusive absolutos) ficam na mesma aba. */
export function isExternal(href) {
  try {
    return new URL(href, location.href).origin !== location.origin;
  } catch {
    return false;
  }
}
