// Carrossel por troca de classe .active.
//
//   <div data-rotator data-interval="4500">
//     <div data-slide class="active">…</div>
//     <div data-slide>…</div>
//   </div>
//
// Pausa quando a aba fica oculta e respeita prefers-reduced-motion.

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initRotators(root = document) {
  root.querySelectorAll("[data-rotator]:not([data-rotating])").forEach(rotator => {
    const slides = [...rotator.querySelectorAll("[data-slide]")];
    if (slides.length < 2 || reduced()) return;
    rotator.dataset.rotating = "true";
    const interval = Number(rotator.dataset.interval) || 5000;
    let index = Math.max(0, slides.findIndex(s => s.classList.contains("active")));

    setInterval(() => {
      if (document.hidden) return;
      slides[index].classList.remove("active");
      index = (index + 1) % slides.length;
      slides[index].classList.add("active");
    }, interval);
  });
}
