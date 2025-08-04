/* ──────────────────────────────────────────────────────────────
   script.js  – scroll control con offset dinámico y suave
   Versión ajustada para que el <h2> quede siempre visible
   (incluye margen extra configurable para “aire”)
──────────────────────────────────────────────────────────────── */

/* 1 ▸ Configuración rápida */
const DURATION_MS   = 350;  // velocidad del scroll
const EXTRA_MARGIN  = 12;   // px añadidos bajo la barra (aire)

/* 2 ▸ Calcula el alto TOTAL que debe restarse */
function getTopOffset () {
  const bar = document.querySelector('.categorias');
  const barra = bar ? bar.offsetHeight : 0;

  /* iOS notch y safe-area podrían añadir padding-top al body:
     lo sumamos si existe para asegurarnos */
  const bodyPadding = parseInt(getComputedStyle(document.body).paddingTop || 0);

  return barra + bodyPadding + EXTRA_MARGIN;
}

/* 3 ▸ Animación easeInOutQuad */
function smoothScrollTo (targetY, duration = DURATION_MS) {
  const startY   = window.pageYOffset;
  const diff     = targetY - startY;
  let   startT   = null;

  function step (tstamp) {
    if (!startT) startT = tstamp;
    const t = Math.min(1, (tstamp - startT) / duration);
    const ease = t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOutQuad
    window.scrollTo(0, startY + diff * ease);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* 4 ▸ Intercepta los clics del menú */
document.querySelectorAll('.categorias a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const id = link.getAttribute('href').slice(1);
    const section = document.getElementById(id);
    if (!section) return;

    /* Destino = posición real del <section> – offset barra */
    const y = section.getBoundingClientRect().top + window.pageYOffset - getTopOffset();
    smoothScrollTo(y);

    /* Actualiza el hash sin provocar salto brusco */
    history.replaceState(null, '', `#${id}`);
  });
});

/* 5 ▸ Corrige la posición si la página se abre ya con hash
      (navegador aterriza primero, luego ajustamos) */
window.addEventListener('load', () => {
  const hash = location.hash.slice(1);
  if (hash) {
    const section = document.getElementById(hash);
    if (section) {
      setTimeout(() => {
        const y = section.getBoundingClientRect().top + window.pageYOffset - getTopOffset();
        window.scrollTo(0, y);
      }, 50); // da tiempo a que todo mida bien
    }
  }
});
