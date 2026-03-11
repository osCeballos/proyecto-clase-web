// Módulo de Menú Lateral (Drawer): Animaciones y Control de Scroll
// Gestiona la apertura del menú lateral con un overlay que bloquea el scroll trasero.

const header = document.querySelector('.header');
const menuBtn = document.getElementById('menu-trigger');
const overlay = document.getElementById('nav-overlay');

// --- LÓGICA DE APERTURA / CIERRE ---
const toggleMenu = () => {
  header.classList.toggle('is-open');
  
  const isMenuOpen = header.classList.contains('is-open');
  
  // Sincronización de Atributos de Accesibilidad
  menuBtn.setAttribute('aria-expanded', isMenuOpen);
  menuBtn.setAttribute('aria-label', isMenuOpen ? 'Cerrar menú principal' : 'Abrir menú principal');
  
  // Bloqueo del Scroll: Evita que el usuario haga scroll en el fondo mientras el menú está abierto.
  if (isMenuOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

// 1. Click en el botón de la hamburguesa
menuBtn.addEventListener('click', toggleMenu);

// 2. Click en el overlay (fondo oscuro) para cerrar el menú
overlay.addEventListener('click', () => {
  if (header.classList.contains('is-open')) {
    toggleMenu();
  }
});

// 3. Tecla Escape: Cerramos el menú y devolvemos el foco al botón para no perder al usuario.
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && header.classList.contains('is-open')) {
    toggleMenu();
    menuBtn.focus(); 
  }
});
