// Interação simples do botão
const ctaButton = document.getElementById('ctaButton');
if (ctaButton) {
    ctaButton.addEventListener('click', () => {
        alert('Você clicou no botão!');
    });
}

// Observer para revelar elementos no scroll
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.2 });

reveals.forEach(reveal => {
    observer.observe(reveal);
});

// ✅ MENU HAMBÚRGUER
const toggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

if (toggle) {
    toggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}
