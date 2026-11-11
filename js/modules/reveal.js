// Revela elementos .reveal quando entram na tela (classe .active).

export function initReveal(root = document) {
  const items = root.querySelectorAll(".reveal:not(.active)");
  if (!items.length) return;
  if (!("IntersectionObserver" in window)) {
    items.forEach(el => el.classList.add("active"));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("active");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -120px 0px" });
  items.forEach(el => observer.observe(el));
}
