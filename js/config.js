// VMORDEKAI® · configuração institucional.
// Fonte única de versão, copy e contatos. Footer, contato e loja leem daqui.

export const SITE = Object.freeze({
  name: "VMORDEKAI®",
  version: "V02-0. | 26.11",
  copy: "© 2016–2026 VMORDEKAI® | Laboratório de Ideias | Curitiba – PR",
  slogan: "Praticidade ao alcance das mãos",
  cnpj: "26.732.865/0001-36",
  home: "index.html",
  logo: "imagens/logo-corpo.png"
});

export const CONTACT = Object.freeze({
  email: "vmordekai@hotmail.com",
  phone: "5541997584893",                         // (41) 99758-4893
  whatsapp: "https://wa.me/message/LIKDPGYCWU5CF1",
  instagram: "https://instagram.com/vmordekai",
  facebook: "https://www.facebook.com/vmordekai/",
  linkedin: "https://www.linkedin.com/in/victormordekai/",
  formspree: "https://formspree.io/f/xeedjleg"
});

/** Mapa do site exibido no footer de todas as páginas. */
export const SITE_MAP = Object.freeze([
  { label: "INÍCIO", href: "index.html" },
  { label: "SHOP", href: "shop.html" },
  { label: "PORTFÓLIO", href: "portfolio-1.html" },
  { label: "LAB", href: "lab.html" },
  { label: "RETEAR", href: "https://victormordekai.github.io/RE-TEAR/" },
  { label: "INSTAGRAM", href: CONTACT.instagram },
  { label: "LINKEDIN", href: CONTACT.linkedin }
]);

/** Link de WhatsApp com mensagem pronta (ex.: interesse em um produto). */
export const whatsappWith = text => `https://wa.me/${CONTACT.phone}?text=${encodeURIComponent(text)}`;

export const isExternal = href => /^https?:\/\//.test(href);
