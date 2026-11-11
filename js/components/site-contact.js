// <vm-contato> · seção de contato comum (formulário Formspree + canais).
// Atributos opcionais: titulo, origem (nome da página enviado junto à mensagem).

import { CONTACT } from "../config.js";

const CHANNELS = [
  ["WhatsApp", CONTACT.whatsapp],
  ["Instagram", CONTACT.instagram],
  ["Facebook", CONTACT.facebook],
  ["LinkedIn", CONTACT.linkedin],
  ["E-mail", `mailto:${CONTACT.email}`]
];

class SiteContact extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";
    const title = this.getAttribute("titulo") || "Inscreva-se ou deixe seu comentário";
    const origin = this.getAttribute("origem") || document.title;

    this.innerHTML = `
      <section class="vm-contact" id="contato" aria-labelledby="contato-titulo">
        <div class="vm-contact__grid">
          <div>
            <span class="vm-contact__tag">VMORDEKAI® CONTATO</span>
            <h2 id="contato-titulo">${title}</h2>
            <form class="vm-form" action="${CONTACT.formspree}" method="POST">
              <input type="hidden" name="_subject" value="Contato pelo site · ${origin}">
              <input type="hidden" name="pagina" value="${origin}">
              <label><span>Nome *</span><input type="text" name="nome" autocomplete="name" required></label>
              <label><span>E-mail *</span><input type="email" name="email" autocomplete="email" required></label>
              <label><span>Telefone</span><input type="tel" name="telefone" autocomplete="tel"></label>
              <label><span>Assunto</span><input type="text" name="assunto"></label>
              <label class="vm-form__wide"><span>Mensagem</span><textarea name="mensagem" rows="5"></textarea></label>
              <div class="vm-form__footer">
                <p class="vm-form__note">* Campos obrigatórios. Os dados são usados apenas para responder ao seu contato.</p>
                <button type="submit" class="btn-primary">ENVIAR</button>
              </div>
            </form>
          </div>
          <aside class="vm-contact__aside">
            <h3>QUER SABER MAIS?</h3>
            <p>Entre em contato pelo WhatsApp ou acompanhe nossos canais, onde compartilhamos bastidores, cases e processos de desenvolvimento.</p>
            <ul class="vm-contact__links">
              ${CHANNELS.map(([label, href]) => `<li><a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a></li>`).join("")}
            </ul>
            <p>LinkedIn e e-mail são os canais para parcerias B2B e contato comercial formal.</p>
          </aside>
        </div>
      </section>`;
  }
}

customElements.define("vm-contato", SiteContact);
