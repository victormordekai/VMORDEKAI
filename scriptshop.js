// script.js (modular)
// Dependências: GSAP (already loaded via CDN in HTML)

document.addEventListener('DOMContentLoaded', () => {
  const world = document.getElementById('world');
  const overlay = document.getElementById('overlay');
  const cardTitle = document.getElementById('cardTitle');
  const cardBody = document.getElementById('cardBody');
  const closeBtn = document.getElementById('close');
  const homeBtn = document.getElementById('homeBtn');
  const shareBtn = document.getElementById('shareBtn');

  // POI definitions (replace images/text as needed)
  const POI = {
    duffelAres: {
      title: 'Duffel ARES',
      category: 'ares',
      body: `<div class="media"><div class="media-left"><img src="imagens/duffel_ares_large.jpg" alt="Duffel ARES"></div><div class="media-right"><h3>Duffel ARES — edição robusta</h3><p>Material: lona técnica reforçada...</p><button class="buy-btn" onclick="location.href='shop.html#duffel'">Comprar</button></div></div>`
    },
    urban: {
      title: 'Mochilas Urbanas',
      category: 'urban',
      body: `<div class="media"><div class="media-left"><img src="imagens/mochila_urbana_large.jpg" alt="Mochila"></div><div class="media-right"><h3>Mochilas Urbanas</h3><p>Compactas e resistentes.</p><button class="buy-btn" onclick="location.href='shop.html#urban'">Ver</button></div></div>`
    },
    minimal: {
      title: 'Bolsas Minimalistas',
      category: 'minimal',
      body: `<div class="media"><div class="media-left"><img src="imagens/bolsa_minimal_large.jpg" alt="Bolsa Minimal"></div><div class="media-right"><h3>Bolsas Minimalistas</h3><p>Linhas puras e materiais nobres.</p><button class="buy-btn" onclick="location.href='shop.html#minimal'">Ver</button></div></div>`
    }
  };

  // Focus function (centers + zooms world onto element)
  function focusOn(el, scale = 1.6, duration = 0.9) {
    const stageRect = document.getElementById('stage').getBoundingClientRect();
    const worldRect = world.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    const worldCenterX = worldRect.left + worldRect.width / 2;
    const worldCenterY = worldRect.top + worldRect.height / 2;
    const elCenterX = elRect.left + elRect.width / 2;
    const elCenterY = elRect.top + elRect.height / 2;

    const dx = (worldCenterX - elCenterX);
    const dy = (worldCenterY - elCenterY);

    gsap.to(world, {
      duration,
      ease: 'power2.out',
      scale,
      x: dx,
      y: dy,
      onStart: () => {
        world.style.filter = 'blur(0.6px) saturate(.92)';
      }
    });
  }

  function resetView(duration = 0.8) {
    gsap.to(world, {duration, ease:'power2.out', scale:0.45, x:0, y:0, clearProps:'filter'});
  }

  function openCard(id) {
    const data = POI[id];
    if(!data) return;
    cardTitle.textContent = data.title;
    cardBody.innerHTML = data.body;
    overlay.style.display = 'flex';
    overlay.setAttribute('aria-hidden','false');
    gsap.fromTo('#card',{y:20,opacity:0},{duration:0.45,y:0,opacity:1,ease:'power3.out'});
    world.classList.remove('light-ares','light-urban','light-minimal');
    if(data.category === 'ares') world.classList.add('light-ares');
    if(data.category === 'urban') world.classList.add('light-urban');
    if(data.category === 'minimal') world.classList.add('light-minimal');
    closeBtn.focus();
  }

  // Attach events to POIs
  document.querySelectorAll('.poi').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.id;
      focusOn(el, 1.6);
      setTimeout(()=> openCard(id), 550);
    });

    el.addEventListener('keydown', (ev) => {
      if(ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); el.click(); }
    });
  });

  // HUD
  homeBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden','true');
    resetView();
  });

  shareBtn.addEventListener('click', () => {
    if(navigator.share){
      navigator.share({title:'VMORDEKAI — Showroom', text:'Explore o showroom VMORDEKAI', url:location.href});
    } else {
      navigator.clipboard.writeText(location.href).then(()=> alert('Link copiado'));
    }
  });

  // close modal
  closeBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden','true');
    resetView();
    world.classList.remove('light-ares','light-urban','light-minimal');
  });

  // keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && overlay.style.display === 'flex') closeBtn.click();
  });

  // responsive initialization
  function handleResize(){
    if(window.innerWidth <= 640){
      document.querySelectorAll('.mobile-item .btn').forEach(b => b.addEventListener('click', (ev) => {
        const id = ev.currentTarget.dataset.id;
        openCard(id);
      }));
    }
  }
  window.addEventListener('resize', handleResize);
  handleResize();

  // Nice initial animation: fade in world
  gsap.fromTo(world, {opacity:0, y:20}, {opacity:1, y:0, duration:0.9, ease:'power2.out'});
});

/* =========================================================
   FEATURED FINAL — CARROSSEL OSCILANTE
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const featuredSlides =
  document.querySelectorAll('.featured-slide');

  let featuredIndex = 0;

  if(featuredSlides.length > 1){

    setInterval(() => {

      featuredSlides.forEach(slide => {
        slide.classList.remove('active');
      });

      featuredIndex =
      (featuredIndex + 1) % featuredSlides.length;

      featuredSlides[featuredIndex]
      .classList.add('active');

    }, 4200);

  }

});
