// Lógica de Mouse Parallax: Elementos reaccionan posicionalmente al cursor

// 1. Seleccionar Elementos
const parallaxContainer = document.getElementById('parallax-container');
const shapes = document.querySelectorAll('.shape');

// 2. Almacenar el cálculo del centro exacto de la pantalla/contenedor
const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;

// 3. Capturamos el evento sagrado: mousemove (Mover ratón)
parallaxContainer.addEventListener('mousemove', (e) => {
  
  // A. Coordenadas de ratón actuales (clientX, clientY)
  const { clientX, clientY } = e;

  // B. Distancia en píxeles desde el centro
  const mouseX = clientX - centerX;
  const mouseY = clientY - centerY;

  // 4. Iteramos por cada una de nuestras figuras decorativas
  shapes.forEach(shape => {
    
    // C. Distancia * Multiplicador de Velocidad / Atenuador de movimiento
    const speed = shape.getAttribute('data-speed');
    const x = (mouseX * speed) / 100;
    const y = (mouseY * speed) / 100;

    // E. Aplicamos CSS Dinámicamente
    // Mueve esta forma X píxeles e Y píxeles.
    shape.style.transform = `translate(${x}px, ${y}px)`;
  });
});

// 5. Devolver al centro los elementos si el ratón sale del contenedor
parallaxContainer.addEventListener('mouseleave', () => {
  shapes.forEach(shape => {
    shape.style.transform = `translate(0px, 0px)`;
  });
});
