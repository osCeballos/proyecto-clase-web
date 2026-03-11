// Lógica de Infinite Scroll con Intersection Observer API

// 1. Elementos del DOM
const feedGrid = document.getElementById('feed-grid');
const loadingIndicator = document.getElementById('loading-indicator');
const endMessage = document.getElementById('end-message');

// 2. Estado de control del Feed
let currentPage = 1;      
const MAX_PAGES = 4; // Límite artificial para no crear un bucle literal infinito hoy
let isFetching = false; // Flag para bloquear múltiples llamadas colindantes

// 3. Simulación Asíncrona (Fetch) de obtención de datos
const fetchMorePosts = async () => {
  // Validar si proceso de petición previo está activo
  if (isFetching || currentPage > MAX_PAGES) return;
  
  isFetching = true;
  loadingIndicator.classList.add('visible');

  // Simulamos carga de un backend (1.5s)
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Validar si hemos llegado al límite final tras la espera
  if (currentPage > MAX_PAGES) {
    loadingIndicator.classList.remove('visible');
    endMessage.removeAttribute('hidden');
    return;
  }

  // Renderizado dinámico de tarjetas inyectadas HTML
  for (let i = 1; i <= 3; i++) {
    const postNumber = (currentPage - 1) * 3 + i;
    
    // Inyectamos la carta
    const cardHTML = `
      <article class="feed-card" style="animation-delay: ${i * 0.1}s">
        <div class="feed-card__image-placeholder"></div>
        <h2>Publicación #${postNumber}</h2>
        <p>Contenido educativo sobre desarrollo web. Aprendiendo a implementar carga progresiva (Lote ${currentPage}).</p>
      </article>
    `;
    feedGrid.insertAdjacentHTML('beforeend', cardHTML);
  }

  // Actualizar indicadores de estado de UI
  currentPage++;
  isFetching = false;
  loadingIndicator.classList.remove('visible');

  // Terminar observador si no restan más elementos
  if (currentPage > MAX_PAGES) {
    endMessage.removeAttribute('hidden');
    
    observer.disconnect();
  }
};

// 4. Configurar el Intersection Observer API
const observerOptions = {
  root: null, // Viewport general
  rootMargin: '100px', // Empieza la precarga 100px antes
  threshold: 0.1
};

const observerCallback = (entries) => {
  const [entry] = entries;
  
  // Ejecutar petición cuando el centinela cargador intercepta a la pantalla
  if (entry.isIntersecting) {
    fetchMorePosts();
  }
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

// 5. Acoplar observador al centinela y disparar un estado de inicio
observer.observe(loadingIndicator);

fetchMorePosts();
