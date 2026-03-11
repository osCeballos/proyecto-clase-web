// Módulo de Acordeones Exclusivos: HTML <details> + JS
// Al abrir una sección del acordeón, cerramos automáticamente las demás (modo exclusivo).

// Seleccionamos todos los elementos de acordeón.
const accordions = document.querySelectorAll('.accordion-item');

// Escuchamos el evento nativo 'toggle' que disparan los elementos <details>.
accordions.forEach((currentAccordion) => {
  currentAccordion.addEventListener('toggle', () => {
    
    // Si el acordeón que acaba de cambiar ha sido ABIERTO:
    if (currentAccordion.open) {
      
      // Buscamos todos sus hermanos y los forzamos a cerrarse.
      accordions.forEach((accordion) => {
        if (accordion !== currentAccordion) {
          // Cambiamos el atributo nativo '.open' a false.
          accordion.open = false;
        }
      });
      
    }
  });
});
