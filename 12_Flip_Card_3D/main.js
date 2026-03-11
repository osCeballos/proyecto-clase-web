// Módulo de Tarjeta 3D (Flip Card): Perspectiva y Accesibilidad
// La tarjeta gira 180 grados sobre el eje Y al hacer clic o pulsar una tecla.

const card = document.querySelector('.card');
const backFace = document.querySelector('.card__face--back');

// --- FUNCIÓN DE GIRO ---
// Alterna la clase 'is-flipped' y sincroniza los atributos ARIA para los lectores de pantalla.
const toggleCard = () => {
  card.classList.toggle('is-flipped');
  
  const isFlipped = card.classList.contains('is-flipped');
  
  // Sincronización de accesibilidad:
  // Informamos si la tarjeta está "expandida" (mostrando el reverso) y ocultamos el reverso si no lo está.
  card.setAttribute('aria-expanded', isFlipped);
  backFace.setAttribute('aria-hidden', !isFlipped);
};

// 1. Interacción con Ratón o Táctil
card.addEventListener('click', (e) => {
  // Evitamos que el giro ocurra si se pulsa un botón interno (como un link de compra o similar).
  if (e.target.tagName.toLowerCase() !== 'button') {
    toggleCard();
  }
});

// 2. Control por Teclado (Foco)
// Permite que un usuario de teclado gire la tarjeta con 'Enter' o 'Espacio'.
card.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault(); // Evitamos el scroll de página al pulsar Espacio
    toggleCard();
  }
});