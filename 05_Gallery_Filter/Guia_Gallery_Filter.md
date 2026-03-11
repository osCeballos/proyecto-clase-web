# Construyendo una Galería Filtrable Dinámica 🎨

## 1. ¿Qué vamos a construir?
En este proyecto daremos un gran salto técnico: dejaremos de escribir cada tarjeta a mano en HTML y empezaremos a generar el diseño de forma dinámica con JavaScript basándonos en datos. Esta es la base de cómo funcionan aplicaciones complejas como Netflix, Instagram o Airbnb (arquitectura impulsada por datos).

Crearemos una **Galería de Proyectos con Filtros Categóricos**. 

---

## 2. Conceptos Clave antes de empezar
*   **Data-Driven Design (Diseño basado en datos):** Tendremos una "Base de datos" simulada (un Array de Javascript), y nuestro código leerá esos datos para fabricar automáticamente el HTML necesario.
*   **CSS Grid Automático:** Haremos magia en CSS. En vez de escribir media queries complicadas para que la cuadrícula responda a móviles y tablets, le diremos a CSS Grid que calcule matemáticamente cuántas tarjetas caben por fila.
*   **A11y (Accesibilidad) de Filtros:** Nos aseguraremos de que una persona navegando con el teclado sepa exactamente qué pestaña tiene seleccionada.

---

## 3. Paso a paso

### Fase 1: La estructura (HTML) y los Filtros

El esqueleto es muy sencillo. Observa cómo usamos la etiqueta semántica `<nav role="tablist">` para agrupar los filtros y cómo dejamos `<section id="gallery-grid">` vacío. ¡Javascript lo rellenará por nosotros!

También incluimos un "Estado Vacío" (Empty State) crucial para la UX: qué pasa si alguien filtra por algo que no existe.

Copia esto en tu `index.html`. Usamos Lorem Ipsum para centrarnos en lo técnico:

```html
<main class="gallery-section">
  <div class="container">
    
    <header class="gallery-header">
      <h1>Portfolio Creativo</h1>
      <p>Explora nuestros últimos proyectos en diseño, estrategia y desarrollo web.</p>
      
      <!-- Navegación de Filtros (Tabs) -->
      <nav class="filters" aria-label="Filtros de Portfolio" role="tablist">
        <button class="filter-btn active" data-filter="all" role="tab" aria-selected="true">Todos</button>
        <button class="filter-btn" data-filter="ui" role="tab" aria-selected="false">UI Design</button>
        <button class="filter-btn" data-filter="ux" role="tab" aria-selected="false">UX Research</button>
        <button class="filter-btn" data-filter="branding" role="tab" aria-selected="false">Branding</button>
      </nav>
    </header>

    <!-- 
      El Grid Vacío. 
      aria-live="polite" avisará respetuosamente a los lectores de pantalla cuando cambien las tarjetas.
    -->
    <section class="gallery-grid" id="gallery-grid" aria-live="polite">
      <!-- Las cards se inyectarán aquí dinámicamente -->
    </section>

    <!-- Estado vacío (Empty State) -->
    <div class="empty-state" id="empty-state" hidden>
      <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" fill="none"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
      <h3>No hay resultados</h3>
      <p>Intenta cambiar los filtros para encontrar lo que buscas.</p>
    </div>

  </div>
</main>
```

### Fase 2: CSS Grid Inteligente y Diseño de Tarjetas

Aquí viene el truco maestro de CSS Grid: `repeat(auto-fill, minmax(300px, 1fr))`. ¿Qué significa? "Repite columnas automáticamente. Cada una debe medir mínimo 300px, pero si sobra espacio, que crezcan por igual (1fr)". 

Pega esto en `style.css`:

```css
:root {
  --color-bg: #F3F4F6;
  --color-text: #1F2937;
  --color-muted: #6B7280;
  --color-accent: #6366F1;
  --color-surface: #FFFFFF;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  background-color: var(--color-bg);
  color: var(--color-text);
}

.container { max-width: 1200px; margin: 0 auto; padding: 4rem 2rem; }
.gallery-header { text-align: center; margin-bottom: 3rem; }

/* Estilos de Botones de Filtro (Pills) */
.filters { display: flex; justify-content: center; flex-wrap: wrap; gap: 0.5rem; }
.filter-btn {
  background: var(--color-surface);
  color: var(--color-muted);
  border: 2px solid transparent; padding: 0.5rem 1.25rem;
  border-radius: 99px; cursor: pointer;
  transition: all 0.3s;
}
.filter-btn:hover { color: var(--color-text); border-color: #E5E7EB; }
.filter-btn.active { background: var(--color-text); color: var(--color-surface); }

/* LA MAGIA DEL GRID AUTOMÁTICO */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

/* Diseño de la Tarjeta */
.card {
  background: var(--color-surface);
  border-radius: 12px; overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
  animation: scaleIn 0.4s ease-out forwards; /* Aparecerán super suaves */
}
.card:hover { transform: translateY(-8px); }
.card__image { width: 100%; height: 220px; object-fit: cover; }
.card__content { padding: 1.5rem; }
.card__badge {
  background: #EEF2FF; color: var(--color-accent);
  padding: 0.25rem 0.75rem; border-radius: 4px;
  font-size: 0.75rem; font-weight: bold;
}
.card__title { font-size: 1.25rem; font-weight: bold; margin: 0.5rem 0; }
.card__desc { color: var(--color-muted); font-size: 0.95rem; }

@keyframes scaleIn {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.empty-state { text-align: center; padding: 4rem; color: var(--color-muted); }
```

### Fase 3: El Cerebro de Datos (JavaScript)

Vamos a crear nuestro Array de objetos (nuestros datos) y la función matemática que, dada la palabra "Diseño UI", recorrerá los datos y dibujará solo los correctos usando Literales de Plantilla (Template Literals).

Añade esto a `main.js`:

```javascript
// 1. Nuestros Datos Simples (Base de Datos)
const projects = [
  { id: 1, title: "App Financiera", category: "ui", categoryName: "UI Design", desc: "Rediseño completo de la interfaz bancaria.", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600" },
  { id: 2, title: "User Persona", category: "ux", categoryName: "UX Research", desc: "Investigación profunda de usuarios para e-commerce.", img: "https://images.unsplash.com/photo-1573167101669-476636b96cea?auto=format&fit=crop&q=80&w=600" },
  { id: 3, title: "Identidad Visual", category: "branding", categoryName: "Branding", desc: "Creación de marca para startup tecnológica.", img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=600" }
];

const galleryGrid = document.getElementById('gallery-grid');
const emptyState = document.getElementById('empty-state');
const filterBtns = document.querySelectorAll('.filter-btn');

// 2. Función Constructora de Tarjetas
function renderGallery(items) {
  galleryGrid.innerHTML = ''; // Limpiar lienzo
  
  if (items.length === 0) {
    emptyState.removeAttribute('hidden');
    return;
  } else {
    emptyState.setAttribute('hidden', 'true');
  }

  // Por cada elemento, generamos un bloque de HTML
  items.forEach(proyecto => {
    const cardHTML = `
      <article class="card">
        <img src="${proyecto.img}" alt="Preview" class="card__image" loading="lazy">
        <div class="card__content">
          <span class="card__badge">${proyecto.categoryName}</span>
          <h2 class="card__title">${proyecto.title}</h2>
          <p class="card__desc">${proyecto.desc}</p>
        </div>
      </article>
    `;
    galleryGrid.insertAdjacentHTML('beforeend', cardHTML);
  });
}

// 3. Sistema de Filtros Interactivos
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // A) Cambio Visual del Botón Activo
    filterBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false'); 
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    
    // B) Filtrado Matemático
    const categoryToFilter = btn.getAttribute('data-filter');
    
    if (categoryToFilter === 'all') {
      renderGallery(projects); // Muestra todos
    } else {
      // Magia: Creamos una lista separada que SOLO cumpla esta condición
      const filtered = projects.filter(p => p.category === categoryToFilter);
      renderGallery(filtered);
    }
  });
});

// ¡Arrancar aplicación al inicio mostrando todo!
renderGallery(projects);
```

¡Espectacular! Tienes el esqueleto funcional para un portfolio avanzado usando un renderizado limpio, rápido y preparado para el futuro.
