/*  ──────────────────────────────────────────────
    Scroll con offset dinámico
    (v2025-08-04)
   ────────────────────────────────────────────── */

const DURATION   = 350;   // milisegundos
const EXTRA      = 8;     // ‘aire’ adicional bajo la barra

/* ► Calcula el offset que hay que restar */
function topOffset () {
  const bar  = document.querySelector('.categorias');
  const barH = bar ? bar.getBoundingClientRect().height : 0;

  /* Algunos navegadores aplican padding-top
     por el notch (safe-area). Lo recogemos: */
  const safe = parseInt(getComputedStyle(document.documentElement)
                        .getPropertyValue('padding-top')) || 0;

  return barH + safe + EXTRA;
}

/* ► Animación easeInOutQuad */
function scrollAnim (dest, ms = DURATION) {
  const yIni = window.pageYOffset;
  const delta = dest - yIni;
  let   t0 = null;

  function step (t) {
    if (!t0) t0 = t;
    const p = Math.min(1, (t - t0) / ms);
    const ease = p < .5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
    window.scrollTo(0, yIni + delta * ease);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ► Gestor de clics del menú */
document.querySelectorAll('.categorias a[href^="#"]').forEach(a => {
  a.addEventListener('click', ev => {
    ev.preventDefault();
    const id = a.getAttribute('href').substring(1);
    const sec = document.getElementById(id);
    if (!sec) return;

    const y = sec.getBoundingClientRect().top + window.pageYOffset - topOffset();
    scrollAnim(y);
    history.replaceState(null, '', '#' + id);
  });
});

/* ► Corrige al cargar si ya hay hash */
window.addEventListener('load', () => {
  const id = location.hash.slice(1);
  if (!id) return;
  const sec = document.getElementById(id);
  if (!sec) return;

  /* pequeño timeout para garantizar medidas correctas */
  setTimeout(() => {
    const y = sec.getBoundingClientRect().top + window.pageYOffset - topOffset();
    window.scrollTo(0, y);
  }, 60);
});
