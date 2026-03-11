// Lógica geométrica para Masonry Layout usando CSS Grid y JS

// Variables que leen configuración core del diseño (mismas medidas que en CSS)
const GAP_SIZE = 16;      // Pixels de espaciado inferior (--gap-size)
const GRIP_ROW_HEIGHT = 10; // Pixels de la cuadrícula base (--row-height)

// Recalculo individual de dimensión y asignación del tamaño del "rowSpan"
function resizeMasonryItem(item) {
  // A. Buscamos la tarjeta real (que contiene la foto) dentro de nuestra caja LI
  const card = item.querySelector('.masonry-card');
  
  // Extraemos la altura calculada actual del contenedor de la tarjeta
  const itemHeight = card.getBoundingClientRect().height;
  
  // Se divide la altura deseada total (height + gap) entre la base de celda (10px)
  const rowSpan = Math.ceil((itemHeight + GAP_SIZE) / GRIP_ROW_HEIGHT);
  
  // Forzar un final de fila (row span) dinámico específico para que coincida con la altura visual
  item.style.gridRowEnd = `span ${rowSpan}`;
}

// Función en bucle para que se aplique en cada uno de los elementos internos
function resizeAllMasonryItems() {
  const allItems = document.querySelectorAll('.masonry-item');
  allItems.forEach(item => {
    resizeMasonryItem(item);
  });
}

// RENDIMIENTO: Validar cálculos puramente tras el proceso carga asíncrono de las imágenes

// Recalculo total tras finalizar la carga completa del viewport y los assets
window.addEventListener('load', () => {
  resizeAllMasonryItems();
});

// Adaptación de los tamaños calculados tras detectar redimensiones dinámicas por el usuario
// Se implementa un mini-debounce (100ms) para mejorar fluidez de proceso de resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    resizeAllMasonryItems();
  }, 100); 
});

// Carga anticipada basada en promesas o delegación individual (mejor rendimiento de UX)
const allImages = document.querySelectorAll('.masonry-card img');
allImages.forEach(img => {
  // Si la imagen todavía no está lista en la caché...
  if (!img.complete) {
    // Al finalizar su descarga, cogemos a su 'abuelo' (li.masonry-item) y lo recalculamos
    img.addEventListener('load', () => {
      const parentItem = img.closest('.masonry-item');
      if(parentItem) resizeMasonryItem(parentItem);
    });
  }
});
