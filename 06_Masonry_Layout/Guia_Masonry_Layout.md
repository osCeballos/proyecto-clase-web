# Construyendo un Masonry Layout (Estilo Pinterest) 🧱

## 1. ¿Qué vamos a construir?
¿Te has fijado cómo en Pinterest las imágenes encajan perfectamente unas debajo de otras sin dejar huecos en blanco molestos, sin importar si la foto es horizontal o super vertical? Ese diseño se llama **Masonry** (Mampostería, como apilar ladrillos). 

Hasta hace poco tiempo, programar esto era una pesadilla matemática. Hoy, combinando CSS moderno (Grid) y una pizca de Javascript para calcular alturas, crearemos un muro de inspiración impecable y responsivo.

---

## 2. Conceptos Clave antes de empezar
*   **CSS Grid Milimétrico:** En lugar de crear un "tablero de ajedrez" (filas fijas), crearemos en CSS una cuadrícula hiper fina con "rallitas invisibles" cada 10 píxeles.
*   **Geometría en JavaScript:** Le pediremos a JS que mida en vivo la altura de la foto que acabamos de descargar. ¿Mide 340px? Entonces le diremos *"ocupa 34 huecos (34x10px) de la cuadrícula"*.
*   **Performance (Asincronía):** Si medimos la foto ANTES de que termine de cargar su alta resolución, pesará "0px" y romperemos el grid. Aprenderemos a escuchar el evento de "fin de carga".

---

## 3. Paso a paso

### Fase 1: La estructura (HTML) y Accesibilidad

Las galerías son listas de elementos visuales. Para que los lectores de pantallas las lean correctamente, debemos usar `<ul aria-label="...">` y `<li>`. Incluiremos algunas imágenes estúpidamente altas y otras bajas para poner a prueba nuestro sistema.

Copia este código en `index.html`. He usado textos ficticios (Lorem Ipsum) para enfocarnos en la geometría:

```html
<main class="page-container">
  <header class="page-header">
    <h1>Muro de Inspiración</h1>
    <p>Descubre nuevas tendencias en diseño visual y arquitectura web para tus próximos proyectos.</p>
  </header>

  <!-- Lista Accesible para la Galería -->
  <ul class="masonry-grid" id="masonry" aria-label="Galería de inspiración">
    
    <!-- Item 1 (Vertical Alto) -->
    <li class="masonry-item">
      <article class="masonry-card">
        <img src="https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=400&h=700" alt="Arquitectura Minimalista" loading="lazy">
        <div class="card-overlay" aria-hidden="true"><span class="btn-save">Guardar</span></div>
      </article>
    </li>

    <!-- Item 2 (Apaisada/Horizontal) -->
    <li class="masonry-item">
      <article class="masonry-card">
        <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400&h=250" alt="Programación Creativa" loading="lazy">
        <div class="card-overlay" aria-hidden="true"><span class="btn-save">Guardar</span></div>
      </article>
    </li>

    <!-- Item 3 (Cuadrada) -->
    <li class="masonry-item">
      <article class="masonry-card">
        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400&h=450" alt="Interfaz de Usuario" loading="lazy">
        <div class="card-overlay" aria-hidden="true"><span class="btn-save">Guardar</span></div>
      </article>
    </li>

    <!-- Añade más li con diferentes alturas para probar -->
  </ul>
</main>
```

### Fase 2: CSS Grid Milimétrico y Micro-interacciones

El secreto de este CSS es `grid-auto-rows: 10px;`. Eso es lo que crea la libreta cuadriculada diminuta en la que apoyaremos nuestras matemáticas más tarde. Además, añadiremos un botón flotante que aparece al posar el ratón.

Añade esto a `style.css`:

```css
:root {
  --color-bg: #FFFFFF;
  --color-text: #111111;
  --color-primary: #E60023; /* Rojo clásico Pinterest */
  --gap-size: 16px; /* Espaciado entre fotos */
  --row-height: 10px; /* Unidad matemática de la cuadrícula vertical */
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: var(--color-bg);
  color: var(--color-text);
  margin: 0; padding: 0;
}

.page-container { max-width: 1400px; margin: 0 auto; padding: 2rem; }
.page-header { text-align: center; margin-bottom: 3rem; }

/* EL TRUCO ESTRELLA DEL MASONRY MODERNO */
.masonry-grid {
  list-style: none; padding: 0;
  display: grid;
  
  /* Auto-responsive: mínimo columnas de 260px */
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  
  /* Creamos las "rallitas" invisibles cada 10px */
  grid-auto-rows: var(--row-height);
  
  column-gap: var(--gap-size); /* Solo espacio horizontal. El vertical lo hará JS */
  align-items: start;
}

.masonry-item {
  /* Separación natural debajo de cada foto */
  margin-bottom: var(--gap-size);
}

/* Diseño de la Tarjeta y Foto */
.masonry-card {
  position: relative; width: 100%; border-radius: 16px; 
  overflow: hidden; cursor: zoom-in;
  background-color: #f0f0f0; /* Color gris suave mientras carga */
}

.masonry-card img {
  display: block; width: 100%; height: auto; /* Mantiene proporciones */
}

/* El botón oscuro de "Guardar" que sale al hacer hover */
.card-overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0; transition: opacity 0.2s;
  display: flex; align-items: flex-start; justify-content: flex-end; padding: 1rem;
}

.masonry-card:hover .card-overlay { opacity: 1; }

.btn-save {
  background-color: var(--color-primary); color: white;
  padding: 0.75rem 1.2rem; border-radius: 30px; font-weight: 700;
  transform: translateY(-10px); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.masonry-card:hover .btn-save { transform: translateY(0); }
```

### Fase 3: Cálculo Geométrico Front-end (JavaScript)

Vamos a medir cada foto y sumarle su Hueco Inferior (`--gap-size`). Lo dividiremos entre la altura de la rallita (`--row-height`). El resultado dirá exactamente cuántos bloques *span* ocupará.

Copia este bloque en `main.js`:

```javascript
// 1. Extraemos los números exactos del CSS para no fallar las mates
const GAP_SIZE = 16;      
const GRID_ROW_HEIGHT = 10; 

// 2. Función clave que mide 1 tarjeta y la amolda
function resizeMasonryItem(item) {
  const card = item.querySelector('.masonry-card');
  
  // Obtenemos la altura real consumida en la pantalla por esta imagen (ej: 421px)
  const itemHeight = card.getBoundingClientRect().height;
  
  // Math.ceil redondea hacia el número superior (ej 42.1 a 43) para asegurar que no haya recortes
  const rowSpan = Math.ceil((itemHeight + GAP_SIZE) / GRID_ROW_HEIGHT);
  
  // Forzamos CSS nativo (grid-row-end: span 43);
  item.style.gridRowEnd = `span ${rowSpan}`;
}

// 3. Recalcular todas
function resizeAllMasonryItems() {
  const allItems = document.querySelectorAll('.masonry-item');
  allItems.forEach(item => resizeMasonryItem(item));
}

// 4. RENDIMIENTO VITAL: Solo calcular CUANDO han terminado de descargar
// Si calculamos ahora, las fotos miden 0px porque internet aún no las ha bajado.
window.addEventListener('load', () => {
  resizeAllMasonryItems();
});

// 5. RESPONSIVE: Recalcular al redimensionar la ventana
// (Usamos un temporizador 'debounce' para no quemar la CPU al encoger la ventana)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    resizeAllMasonryItems();
  }, 100); 
});
```

¡Ya lo tienes! Haz una prueba maravillosa: Abre tu página, empequeñécela como un móvil despacio y observa cómo el JS y CSS actúan como un equipo sincronizado para recalcular las alturas matemáticamente creando fluidez total.
