# Construyendo un Infinite Scroll (Scroll Infinito) ⚡

## 1. ¿Qué vamos a construir?
¿Odias darle al botón "Siguiente página" en una tienda online o un blog? Vamos a eliminarlo, creando un **Muro Infinito (Infinite Scroll)** exactamente igual que el que usas en Twitter, TikTok o Instagram. 

A medida que el usuario baje, nuestro código de JavaScript detectará silenciosamente que se está acercando al final y descargará más tarjetas mágicamente.

---

## 2. Conceptos Clave antes de empezar
*   **Performance (El gran problema):** Medir continuamente la posición de la barra de scroll usando el viejo evento `scroll` arruinaría la batería del móvil y bloquearía la web.
*   **Intersection Observer API (La solución):** Es un "vigilante" super optimizado incluido en tu navegador. Le pondremos una diana (un elemento Centinela) al final del HTML y le diremos al vigilante: *"Avísame SOLO cuando veas asomar este centinela en pantalla"*.
*   **Skeleton Loading (Diseño UI):** Para que el usuario no sienta que el PC está colgado, dibujaremos temporalmente las cajas en gris con un brillo animado (el famoso *Shimmer effect*). Diseño y código trabajando juntos.

---

## 3. Paso a paso

### Fase 1: La estructura (HTML) y El Centinela

Aquí radica el secreto de esta técnica moderna: no medimos el muro, **vigilamos el final**. Ese `<div id="loading-indicator">` será nuestro Centinela. En HTML usamos un "Lorem Ipsum" estructural para centrarnos en lo técnico.

Añade esto a `index.html`:

```html
<main class="feed-container">
  <header class="feed-header">
    <h1>Feed de Noticias</h1>
    <p>Mantente al día con las últimas novedades del mundo tecnológico y del diseño.</p>
  </header>

  <!-- El contenedor que irá engordando con tarjetas -->
  <section class="feed-grid" id="feed-grid" aria-live="polite">
    <!-- El JS meterá aquí las tarjetas poco a poco -->
  </section>

  <!-- 
    EL CENTINELA (Spinner).
    Cuando el navegador choque visualmente con esto, ¡pediremos datos!
  -->
  <div class="loading-indicator" id="loading-indicator" aria-hidden="true">
    <div class="spinner"></div>
    <span>Cargando más historias...</span>
  </div>
  
  <!-- El estado final cuando ya no haya más datos en la base de datos -->
  <div class="end-message" id="end-message" hidden>
    <p>Has llegado al final. ¡Vuelve pronto por más! 🎉</p>
  </div>
</main>
```

### Fase 2: El diseño y el Efecto "Shimmer" (CSS)

Vamos a estilizar un feed centrado. Y lo más importante, vamos a crear la animación *Skeleton Loader*\*, un degradado gris pálido que se mueve de izquierda a derecha.

Copia esto en `style.css`:

```css
:root {
  --color-bg: #FAFAFA;
  --color-text: #333333;
  --color-primary: #10B981; 
  --color-card-bg: #FFFFFF;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  background-color: var(--color-bg); color: var(--color-text);
  margin: 0; padding: 0;
}

.feed-container { max-width: 800px; margin: 0 auto; padding: 3rem 1.5rem; }
.feed-header { text-align: center; margin-bottom: 3rem; }

.feed-grid {
  display: flex; flex-direction: column; gap: 2rem; margin-bottom: 2rem;
}

/* Diseño de la Tarjeta */
.feed-card {
  background: var(--color-card-bg);
  border: 1px solid #E5E7EB; border-radius: 12px;
  padding: 1.5rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  
  /* Efecto de aparición Fade In cuando nazcan */
  opacity: 0; animation: fadeInUp 0.6s ease-out forwards;
}

/* EL ESQUELETO MÁGICO (Shimmer effect) */
.feed-card__image-placeholder {
  width: 100%; height: 200px; border-radius: 8px; margin-bottom: 1.5rem;
  
  /* Degradado Tricolor y Animación */
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite; 
}

/* Animaciones Modulares */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Estados de Carga Finales */
.loading-indicator {
  display: flex; flex-direction: column; align-items: center; padding: 3rem 0;
  opacity: 0; transition: opacity 0.3s;
}
.loading-indicator.visible { opacity: 1; }

.spinner {
  width: 40px; height: 40px; border: 4px solid #E5E7EB;
  border-top-color: var(--color-primary); border-radius: 50%;
  animation: spin 1s linear infinite; margin-bottom: 1rem;
}
@keyframes spin { to { transform: rotate(360deg); } }

.end-message {
  text-align: center; padding: 3rem; color: var(--color-primary);
  background: #ECFDF5; border-radius: 12px; margin-top: 2rem;
}
```

### Fase 3: La API del Navegador (JavaScript)

Vamos a configurar a un vigilante cibernético (`Intersection Observer`). Además, deberemos evitar "ataques" por exceso de Scroll: si el usuario baja muy rápido y el PC no ha tenido tiempo de pintar nada, no podemos disparar la descarga en bucle. Crearemos un variable "Semáforo" llamada `isFetching`.

Escribe esto en `main.js`:

```javascript
const feedGrid = document.getElementById('feed-grid');
const loadingIndicator = document.getElementById('loading-indicator');
const endMessage = document.getElementById('end-message');

// Estado y Control
let currentPage = 1;      
const MAX_PAGES = 4; // Límite artificial para el tutorial
let isFetching = false; // SEMÁFORO: ¿Está el PC trabajando ahora mismo?

// La función principal conectándose a "Internet"
const fetchMorePosts = async () => {
  // A. Si estamos trabajando o llegamos al tope del blog, Aborta.
  if (isFetching || currentPage > MAX_PAGES) return;
  
  isFetching = true;  // Bloquea temporalmente más llamadas
  loadingIndicator.classList.add('visible'); // Gira el spinner

  // B. Simulamos que internet tarda 1.5 segundos en responder
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Ojo: Si mientras esperábamos hemos chocado con el tope, paramos de verdad.
  if (currentPage > MAX_PAGES) {
    loadingIndicator.classList.remove('visible');
    endMessage.removeAttribute('hidden');
    return;
  }

  // C. Inyectar HTML nuevo. (Fabrica 3 posts "ficticios")
  for (let i = 1; i <= 3; i++) {
    const postNumber = (currentPage - 1) * 3 + i;
    
    // Al inyectarlos, cada uno aparecerá un poquito después (animation-delay 0.1, 0.2, 0.3...)
    const cardHTML = `
      <article class="feed-card" style="animation-delay: ${i * 0.1}s">
        <div class="feed-card__image-placeholder"></div>
        <h2>Artículo Destacado ${postNumber}</h2>
        <p>Una breve descripción sobre las tendencias actuales en el desarrollo web moderno (Lote ${currentPage}).</p>
      </article>
    `;
    feedGrid.insertAdjacentHTML('beforeend', cardHTML);
  }

  // D. Tareas terminadas: avanzamos página y volvemos a poner SEMÁFORO en verde
  currentPage++;
  isFetching = false;
  loadingIndicator.classList.remove('visible');

  // Si llegamos al final del blog...
  if (currentPage > MAX_PAGES) {
    endMessage.removeAttribute('hidden');
    observer.disconnect(); // Despide al empleado vigilante para ahorrar RAM
  }
};


// ----------------------------------------------------
// LA MAGIA: CONFIGURAR AL EMPLEADO VIGILANTE
// ----------------------------------------------------

const observerOptions = {
  root: null, // "La ventana principal"
  rootMargin: '100px', // TRUCO MAESTRO: Aprieta el gatillo 100px antes de llegar de verdad, así el usuario nunca ve que esté cargando.
  threshold: 0.1 // Avísame al asomar un 10% del Centinela
};

const observerCallback = (entries) => {
  const [entry] = entries; // Coge el primer vigilante de la lista
  
  if (entry.isIntersecting) {
    // EL CENTINELA ACABA DE APARECER EN PANTALLA
    fetchMorePosts();
  }
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

// "Oye, observa fíjamente cómo se comporta este DIV por favor"
observer.observe(loadingIndicator);

// Dar el primer golpe (pintar al aterrizar en la web)
fetchMorePosts();
```

¡Brillante! Has domando una API super nivelada. Si haces zoom, y cambias en tu código `rootMargin: '100px'` por `rootMargin: '0px'`, sentirás exactamente lo frustrante que sería el proceso sin pre-carga psicológica. ¡El diseño web es empatía!
