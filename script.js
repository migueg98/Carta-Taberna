// Duración del scroll en milisegundos (rápido)
const DURATION_MS = 350;

// Calcula el offset para que el <h2> quede visible bajo la barra fija
function getTopOffset() {
  const topbar = document.querySelector('.categorias');
  // Ajusta +10 si quieres un pequeño margen extra
  return (topbar ? topbar.offsetHeight : 0) + 10;
}

// Animación suave personalizada (easeInOut)
function smoothScrollTo(targetY, duration = DURATION_MS) {
  const startY = window.pageYOffset;
  const diff = targetY - startY;
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const t = Math.min(1, (timestamp - startTime) / duration);
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOutQuad
    window.scrollTo(0, startY + diff * ease);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// Intercepta clicks del menú de categorías
document.querySelectorAll('.categorias a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const id = link.getAttribute('href').slice(1);
    const section = document.getElementById(id);
    if (!section) return;

    // Posición de destino teniendo en cuenta el offset de la barra
    const y = section.getBoundingClientRect().top + window.pageYOffset - getTopOffset();
    smoothScrollTo(y);
    // Opcional: actualiza el hash sin saltar
    history.replaceState(null, '', `#${id}`);
  });
});
