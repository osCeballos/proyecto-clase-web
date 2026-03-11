// Módulo de Tarjeta Expandible: Manipulación de Clases y Textos
// Al pulsar el botón, la tarjeta cambia su altura mediante transiciones CSS.

const card = document.querySelector('.expandable-card');
const triggerBtn = document.getElementById('trigger-btn');

const toggleCard = () => {
  card.classList.toggle('is-expanded');
  
  const isExpanded = card.classList.contains('is-expanded');
  
  // Sincronización de Accesibilidad (ARIA)
  triggerBtn.setAttribute('aria-expanded', isExpanded);
  
  // Actualización del texto del botón para guiar al usuario
  const btnText = triggerBtn.querySelector('.btn-expand__text');
  if (isExpanded) {
    btnText.textContent = "Ver menos";
  } else {
    btnText.textContent = "Ver más";
  }
};

// Escuchamos el clic en el botón disparador para iniciar la animación.
triggerBtn.addEventListener('click', toggleCard);
