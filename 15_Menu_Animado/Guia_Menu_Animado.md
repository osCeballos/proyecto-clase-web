# Menú Lateral Animado (Off-Canvas Menu) 🚀

## 1. ¿Qué vamos a construir?
El patrón Off-Canvas consiste en un menú escondido fuera de los bordes del monitor (generalmente a la derecha) que, al pulsar la hamburguesa, "desliza" hacia el interior tapando parcialmente el contenido de la web junto con un fondo negro transparente (`Backdrop Overlay`).
Esta es la forma más bella, suave y profesional de presentar navegación en dispositivos móviles, rindiendo a potentes 60 FPS (Frames Por Segundo).

---

## 2. Conceptos Clave antes de empezar
*   **La CPU vs La Tarjeta Gráfica:** Mover el `ancho (width)` o el `magin-left` de un elemento en CSS es una pesadilla de rendimiento porque obliga al procesador a recalcular las posiciones del resto de elementos de la web, calentando el móvil y dando tirones groseros. Para que una animación sea fluida e impecable, jamás animes posiciones del layout. **Solo puedes animar dos cosas: Transform (Mover/Escalar/Rotar) y Opacity.** Esto delega el trabajo en la Tarjeta Gráfica del superordenador o móvil.
*   **`Visibility` vs `Display`:** El display es on/off (no se puede animar una aparición). Usaremos `visibility: hidden;` a las cosas que estén fuera de la pantalla. Esto permite transiciones suaves, pero a la vez previene que personas usando teclado (Tabulador) o ciegos aterricen sin querer en botones que están escondidos en el borde exterior del monitor.
*   **Contrato Acústico (Aria-Expanded):** JavaScript debe comunicar al lector de pantalla que el menú se ha abierto para que se lo informe al usuario invidente. Además encerraremos el scroll por debajo para que el usuario no pierda su sitio de lectura en la web principal.

---

## 3. Paso a paso

### Fase 1: Anatomía Dinámica (HTML)

Lo vital aquí es añadir el componente extra `div.nav-overlay`. Esa sábana oscura bloqueará el paso al contenido trasero de tu web, garantizando que todo el foco del usuario caiga sobre el menú que acaba de asomar.

*(Textura con textos "Lorem Ipsum").*

Copia en `index.html`:

```html
<header class="header">
  <div class="header-container">
    
    <a href="#" class="logo" aria-label="Ir a la página de inicio">
      CreativeAgency<span style="color:var(--color-primary)">.</span>
    </a>

    <!-- BOTÓN HAMBURGUESA TRIGGER -->
    <button type="button" class="menu-btn" id="menu-trigger" aria-controls="main-nav" aria-expanded="false" aria-label="Abrir menú principal">
      <svg class="hamburger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
        <!-- Las 3 rayas separadas preparadas para rotar geométricamente en cruz -->
        <line class="line-top" x1="3" y1="6" x2="21" y2="6"></line>
        <line class="line-mid" x1="3" y1="12" x2="21" y2="12"></line>
        <line class="line-bot" x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>

    <!-- EL VELO OSCURO -->
    <div class="nav-overlay" id="nav-overlay" aria-hidden="true"></div>

    <!-- EL MENÚ CAJÓN (Fuera de la pantalla arranca) -->
    <nav class="nav" id="main-nav" aria-label="Navegación principal">
      <ul class="nav-list">
        <li class="nav-item"><a href="#" class="nav-link">Inicio</a></li>
        <li class="nav-item"><a href="#" class="nav-link">Servicios</a></li>
        <li class="nav-item"><a href="#" class="nav-link">Porfolio</a></li>
        <li class="nav-item"><a href="#" class="nav-link">Equipo</a></li>
        <li class="nav-item"><a href="#" class="nav-link nav-link--btn">Contacto</a></li>
      </ul>
    </nav>

  </div>
</header>
```

### Fase 2: La Coreografía Translacional (CSS)

El menú móvil (`.nav`) lo posicionaremos en modo fijo (`position: fixed`) pegado arriba y su ancho será del 80%. Pero, para sacarlo de la pantalla le aplicaremos `transform: translateX(100%);` (Muévete hacia la derecha el 100% de tu propia anchura). 
Cuando JS ponga la placa `.is-open`, le quitaremos esa traslación (retorno a 0) deslizándose adentro majestuosamente.

Añade en `style.css`:

```css
:root {
  --color-bg: #F8FAFC; --color-header: #FFFFFF; --color-text: #0F172A; --color-text-muted: #64748B; --color-primary: #ec4899;
  --color-overlay: rgba(15, 23, 42, 0.4);
  --shadow-drawer: -10px 0 25px -5px rgba(0, 0, 0, 0.1);
  --transition-smooth: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

* { margin:0; padding:0; box-sizing: border-box; }
body { font-family: 'Inter', system-ui, sans-serif; background: var(--color-bg); min-height: 100vh; overflow-x: hidden; /* Vital al mover off-canvas o dejarás un agujero blanco visible a la derecha */ }

.header { background: var(--color-header); position: relative; z-index: 100; }
.header-container { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; max-width: 1200px; margin: 0 auto; }
.logo { font-size: 1.5rem; font-weight: 800; color: var(--color-text); text-decoration: none; position: relative; z-index: 102; }

/* ANIMACIÓN BOTÓN SVG A CRUZ (Hamburguesa) */
.menu-btn { background: transparent; border: none; color: var(--color-text); cursor: pointer; padding: 0.5rem; border-radius: 6px; position: relative; z-index: 103; transition: 0.2s; }
.hamburger-icon { width: 26px; height: 26px; }
.line-top, .line-mid, .line-bot { transform-origin: center; transition: transform var(--transition-smooth), opacity var(--transition-smooth); }

/* Activación por variable HTML (aria-expanded) */
.menu-btn[aria-expanded="true"] .line-top { transform: translateY(6px) rotate(45deg); }
.menu-btn[aria-expanded="true"] .line-mid { opacity: 0; transform: scale(0); }
.menu-btn[aria-expanded="true"] .line-bot { transform: translateY(-6px) rotate(-45deg); }

/* CAPA OVERLAY NEGRA */
.nav-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
  background: var(--color-overlay); backdrop-filter: blur(3px); z-index: 101;
  opacity: 0; visibility: hidden; /* Impide clics y vista en reposo */
  transition: opacity var(--transition-smooth), visibility var(--transition-smooth);
}
.header.is-open .nav-overlay { opacity: 1; visibility: visible; }

/* -------------------------------------
   MENÚ CAJÓN FLOTANTE (MÓVIL < 767px)
   ------------------------------------- */
@media (max-width: 767px) {
  .nav {
    position: fixed; top: 0; right: 0; width: 80%; max-width: 320px; height: 100vh;
    background: var(--color-header); box-shadow: var(--shadow-drawer); z-index: 102; padding-top: 5rem;
    
    /* REPOSO INICIAL OFF-CANVAS */
    transform: translateX(100%);
    visibility: hidden;
    will-change: transform, visibility; /* Le dice a la CPU que cargue esto en caché previemante */
    transition: transform var(--transition-smooth), visibility var(--transition-smooth);
  }

  /* ABIERTO */
  .header.is-open .nav { transform: translateX(0); visibility: visible; }
  
  .nav-list { flex-direction: column; padding: 1.5rem; gap: 0.75rem; }
  .nav-link { font-size: 1.25rem; padding: 1rem; }
}

/* Base de Links de Navegación */
.nav-list { list-style: none; display: flex; }
.nav-link { display: block; color: #64748B; text-decoration: none; font-weight: 500; border-radius: 8px; transition: 0.2s; }
.nav-link:hover { color: var(--color-text); background: rgba(0,0,0,0.03); }
.nav-link--btn { background: var(--color-primary); color: white; text-align: center; }

/* ESCRITORIO (> 768px): Todo fuera, Flexbox plano horizontal */
@media (min-width: 768px) {
  .menu-btn { display: none; }
  .nav-overlay { display: none; }
  
  .nav { position: static; width: auto; height: auto; padding-top: 0; transform: none; visibility: visible; box-shadow: none; background: transparent; }
  .nav-list { flex-direction: row; align-items: center; gap: 1rem; padding: 0; }
  .nav-link { font-size: 0.95rem; padding: 0.5rem 1rem; }
}
```

### Fase 3: Controlador Experto y Scroll-Lock (Javascript)

Nuestra experiencia la vamos a completar atando todos los cabos sueltos funcionales y accesibles. Si clicas en lo negro (`nav-overlay`) el menú huirá cerrándose y devolviéndote la libertad. Y si cierras con Escape también. Amputaremos al cuerpo (`document.body`) su capacidad para hacer `overflow` vertical previniendo que la página de debajo de ti se desplace mientras tienes los menús abiertos.

Pegar en `main.js`:

```javascript
const header = document.querySelector('.header');
const menuBtn = document.getElementById('menu-trigger');
const overlay = document.getElementById('nav-overlay');

const toggleMenu = () => {
  header.classList.toggle('is-open');
  
  const isMenuOpen = header.classList.contains('is-open');
  
  // ARIA Accessibilidad de Estado
  menuBtn.setAttribute('aria-expanded', isMenuOpen);
  menuBtn.setAttribute('aria-label', isMenuOpen ? 'Cerrar menú' : 'Abrir menú');
  
  // SCROLL LOCK 🛑: Impide al Body hacer scroll mientas el modal está encima
  if (isMenuOpen) document.body.style.overflow = 'hidden';
  else document.body.style.overflow = '';
};

// Disparador Principal
menuBtn.addEventListener('click', toggleMenu);

// UX Dismiss Click-fuera
// En vez de detectar el body entero, simplemente le atamos el click al Velo Negro
overlay.addEventListener('click', () => {
  if (header.classList.contains('is-open')) toggleMenu();
});

// UX Teclado Fuga
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && header.classList.contains('is-open')) {
    toggleMenu();
    menuBtn.focus(); // Retorna el foco cortésmente al botón hamburguesa
  }
});
```

La suavidad pura al abrir y cerrar (gracias a Transform/Opacity) dota de calidad de App Nativa de iOS o Android a la web. Todo reside en la paciencia y finura de sus configuraciones.
