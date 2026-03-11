// Lógica de Renderizado Dinámico y Filtrado de Arrays

// 1. Data: Base de Datos de Proyectos
const projects = [
  {
    id: 1,
    title: "Rediseño Marca Eco",
    category: "ui",
    categoryName: "Diseño UI",
    desc: "Creación de interfaz moderna para startup de ecología.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 2,
    title: "App de Finanzas",
    category: "ux",
    categoryName: "Investigación UX",
    desc: "Test de usuario y arquitectura de información para Fintech.",
    img: "https://images.unsplash.com/photo-1573167101669-476636b96cea?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 3,
    title: "Sistema de Diseño",
    category: "branding",
    categoryName: "Branding",
    desc: "Guía de estilos y componentes para marca global.",
    img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 4,
    title: "Portal E-commerce",
    category: "ui",
    categoryName: "Diseño UI",
    desc: "Maquetación de tienda online con enfoque en conversión.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 5,
    title: "Dashboard Analítica",
    category: "ux",
    categoryName: "Investigación UX",
    desc: "Optimización de flujos de datos complejos para B2B.",
    img: "https://images.unsplash.com/photo-1516321495588-e9f05786bce7?auto=format&fit=crop&q=80&w=600"
  }
];

// 2. DOM Elements: Capturamos los nodos del HTML
const galleryGrid = document.getElementById('gallery-grid');
const emptyState = document.getElementById('empty-state');
const filterBtns = document.querySelectorAll('.filter-btn');

// 3. Función de Renderizado: Transforma Datos en HTML dinámicamente
function renderGallery(itemsToRender) {
  // A. Vaciamos el contenedor primero para que no se sumen a los anteriores
  galleryGrid.innerHTML = '';
  
  // Comprobar estado vacío (Empty State)
  if (itemsToRender.length === 0) {
    emptyState.removeAttribute('hidden');
    return; // Salimos de la función tempranamente
  } else {
    emptyState.setAttribute('hidden', 'true');
  }

  // B. Si hay elementos, iteramos el Array
  itemsToRender.forEach(proyecto => {
    
    // String Template Literals (``) de ES6: Permiten inyectar variables ${} en HTML
    const cardHTML = `
      <article class="card">
        <img src="${proyecto.img}" alt="Preview de ${proyecto.title}" class="card__image" loading="lazy">
        <div class="card__content">
          <span class="card__badge">${proyecto.categoryName}</span>
          <h2 class="card__title">${proyecto.title}</h2>
          <p class="card__desc">${proyecto.desc}</p>
        </div>
      </article>
    `;
    
    // Insertar HTML en el DOM de forma eficiente
    galleryGrid.insertAdjacentHTML('beforeend', cardHTML);
  });
}

// 4. Lógica de Filtrado Interactivo
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    
    // A. Gestión Visual del Botón Activo
    filterBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false'); // A11y
    });
    // Se la ponemos solo al que acaban de hacer clic
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    
    // B. Lógica Matemática del Filtrado
    // Leemos el data-filter del botón (ej: "ux")
    const categoryToFilter = btn.getAttribute('data-filter');
    
    if (categoryToFilter === 'all') {
      // Si el botón es 'Todos', pintamos el array original entero
      renderGallery(projects);
    } else {
      // Filtrar el array por la categoría elegida
      const filteredProjects = projects.filter(proyecto => proyecto.category === categoryToFilter);
      renderGallery(filteredProjects);
    }
  });
});

// 5. Inicialización de la Galería al cargar la página
renderGallery(projects);
