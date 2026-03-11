// Módulo de Mega Menú: Accesibilidad y Gestión de Foco (Focus Trap)
// Un Mega Menú es un panel grande que requiere un manejo especial del teclado para no perder al usuario.

const megaTrigger = document.getElementById('mega-trigger');
const liParent = megaTrigger.closest('.has-mega-menu');
const megaPanel = document.getElementById('mega-menu-panel');

// Definimos qué elementos pueden recibir el foco (enlaces y botones) para el "atrapado de foco".
const focusableElements = 'a[href], button:not([disabled])';

// --- FUNCIÓN DE APERTURA / CIERRE ---
const toggleMenu = () => {
  const isOpen = liParent.classList.contains('is-open');
  
  if (!isOpen) {
    // 1. Abrir el menú: añadimos clase y actualizamos ARIA.
    liParent.classList.add('is-open');
    megaTrigger.setAttribute('aria-expanded', 'true');
    megaPanel.setAttribute('aria-hidden', 'false');
    
    // 2. Gestión de Foco: movemos el foco al primer elemento del panel para facilitar la navegación.
    const nodes = megaPanel.querySelectorAll(focusableElements);
    if (nodes.length > 0) {
      // Usamos un pequeño delay para asegurar que el navegador ha renderizado el cambio antes de enfocar.
      setTimeout(() => nodes[0].focus(), 100);
    }
    
  } else {
    // 3. Cerrar el menú: revertimos clases y ARIA.
    liParent.classList.remove('is-open');
    megaTrigger.setAttribute('aria-expanded', 'false');
    megaPanel.setAttribute('aria-hidden', 'true');
  }
};

// Listener para el botón principal.
megaTrigger.addEventListener('click', toggleMenu);

// --- CIERRE AL CLICAR FUERA ---
document.addEventListener('click', (event) => {
  if (liParent.classList.contains('is-open') && !liParent.contains(event.target)) {
    toggleMenu();
  }
});

// --- TRAMPA DE FOCO (FOCUS TRAP) ---
// Evita que el usuario salga del panel del menú usando el tabulador.
// Al llegar al último enlace, el siguiente 'Tab' vuelve al primero.
megaPanel.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;

  const nodes = megaPanel.querySelectorAll(focusableElements);
  const firstNode = nodes[0];
  const lastNode = nodes[nodes.length - 1];

  // Si pulsa Shift + Tab (retroceder) y está en el primero, lo mandamos al último.
  if (e.shiftKey) {
    if (document.activeElement === firstNode) {
      e.preventDefault();
      lastNode.focus();
    }
  } 
  // Si pulsa Tab (avanzar) y está en el último, lo mandamos al primero.
  else {
    if (document.activeElement === lastNode) {
      e.preventDefault();
      firstNode.focus();
    }
  }
});

// --- CIERRE CON ESCAPE ---
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && liParent.classList.contains('is-open')) {
    toggleMenu();
    megaTrigger.focus(); // Fundamental: devolvemos el foco al botón para que no se pierda la posición.
  }
});