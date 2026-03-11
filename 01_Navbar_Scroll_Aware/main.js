// Lógica principal: Ocultar navbar al bajar (leer) y mostrar al subir (navegar)

// 1. Capturamos en variables los elementos HTML que vamos a manipular
const navbar = document.getElementById('navbar');

// 2. Necesitamos tener memoria. Guardamos la posición del scroll INICIAL (suele ser 0).
let lastScrollY = window.scrollY;

// 3. 'Escuchamos' cada vez que el usuario mueve el ratón o desliza el dedo (evento 'scroll').
window.addEventListener('scroll', () => {
  // Obtenemos la posición Y actual
  const currentScrollY = window.scrollY;
  
  // Evitar rebote superior en macOS e iOS (overscroll)
  if (currentScrollY <= 0) {
    navbar.classList.remove('navbar--hidden');
    return; // Detiene la comprobación aquí
  }

  // Detectar la dirección del scroll: hacia abajo (> inicial) con margen seguro de 60px
  if (currentScrollY > lastScrollY && currentScrollY > 60) {
    // Intención: Leer. Ocultar Navbar.
    navbar.classList.add('navbar--hidden');
  } else {
    // Intención: Navegar. Mostrar Navbar porque está subiendo.
    navbar.classList.remove('navbar--hidden');
  }

  // Actualizamos la posición para calcular en el siguiente frame
  lastScrollY = currentScrollY;
});
