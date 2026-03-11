const header = document.querySelector('.header');
const menuBtn = document.getElementById('menu-trigger');

// La función 'toggleMenu' es el interruptor central. Añade/quita la clase y sincroniza los atributos ARIA.
const toggleMenu = () => {
  header.classList.toggle('is-open');
  
  // Leemos el estado actual del menú para saber qué valor dar a aria-expanded.
  const isMenuOpen = header.classList.contains('is-open');
  menuBtn.setAttribute('aria-expanded', isMenuOpen);
  
  // Actualizamos el aria-label del botón para que los lectores de pantalla anuncien la acción correcta.
  menuBtn.setAttribute('aria-label', isMenuOpen ? 'Cerrar menú principal' : 'Abrir menú principal');
};

menuBtn.addEventListener('click', toggleMenu);

// Guardián UX: si el menú está abierto y el usuario hace clic fuera de él, lo cerramos.
document.addEventListener('click', (event) => {
  const isMenuOpen = header.classList.contains('is-open');
  const isClickInsideHeader = header.contains(event.target);
  
  if (isMenuOpen && !isClickInsideHeader) {
    toggleMenu(); 
  }
});

// Guardián de teclado: la tecla Escape cierra el menú y devuelve el foco al botón de apertura.
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && header.classList.contains('is-open')) {
    toggleMenu();
    menuBtn.focus();
  }
});