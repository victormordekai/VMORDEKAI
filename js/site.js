// VMORDEKAI® · entrada comum das páginas.
// Componentes (navbar, footer, contato) + comportamentos compartilhados.
// Animações próprias de cada página ficam no CSS da página e usam estes mesmos módulos.

import "./components.js";
import "./components/site-contact.js";
import { initReveal } from "./modules/reveal.js";
import { initRotators } from "./modules/rotator.js";

initReveal();
initRotators();
