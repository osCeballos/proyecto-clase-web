# Mega Menú Accesible (Subgrid & Focus Trap) 🏬

## 1. ¿Qué vamos a construir?
Un Mega Menú es un cajón expansivo que abarca gran parte del ancho de la pantalla, ideal para e-commerces o webs corporativas con cientos de enlaces. 
Vamos a construir uno nivel "Senior" aplicando dos técnicas modernas que te diferenciarán del 90% de los juniors:
1. Usaremos **CSS Subgrid** para que las columnas interiores del menú se alineen mágicamente con el layout principal de la web.
2. Programaremos un **Focus Trap** (Trampa de Foco) en Javascript, para que usuarios de teclado o ciegos no se pierdan "buceando" fuera del menú modal accidentalmente.

---

## 2. Conceptos Clave antes de empezar
*   **CSS Subgrid:** Una maravilla moderna. En vez de romperse la cabeza calculando porcentajes con flexbox para alinear cajas hijas dentro de un menú expansivo, asestaremos `grid-template-columns: subgrid;`. Esto le dirá al menú: *"Ignora tus medidas e imprímete usando como calco matemático las columnas del layout general de tu abuelo"*.
*   **Aria-Expanded & Aria-Hidden:** Nuestro botón disparador informará al navegador cuando el menú está abierto (`aria-expanded`). A la par, el propio cajón se esconderá y revelará a los lectores de pantalla usando `aria-hidden`.
*   **Tab-Focus Loop:** El secuestro benigno. Si alguien usa el teclado navegando de enlace en enlace usando la tecla Tabulador y llega al último enlace de nuestro Mega Menú... si vuelve a presionar Tab lo enviaremos de vuelta al principio del menú. Nunca le dejaremos salir al contenido trasero de la web a no ser que apriete "Escape" o cierre el menú a propósito.

---

## 3. Paso a paso

### Fase 1: Semántica HTML del Hub

Nuestro HTML contiene un Header normal con algunos enlaces directos y un elemento especial (`li.has-mega-menu`). Dentro de ese elemento reside un botón real `<button>` que, al igual que los acordeones, será el anfitrión que despierte al Mega Menú oculto justo debajo.

Copia en `index.html`:

```html
<header class="header">
  <div class="header-container">
    
    <a href="#" class="logo" aria-label="A Inicio">TechStore<span style="color:var(--color-primary)">.</span></a>

    <nav class="nav" aria-label="Navegación principal">
      <ul class="nav-list">
        <li class="nav-item"><a href="#" class="nav-link">Servicios</a></li>
        <li class="nav-item"><a href="#" class="nav-link">Proyectos</a></li>
        
        <!-- ELEMENTO CON MEGA MENÚ DESPLEGABLE -->
        <li class="nav-item has-mega-menu">
          <!-- El Botón Disparador (Trigger) -->
          <button type="button" class="nav-link btn-mega" id="mega-trigger" aria-controls="mega-menu-panel" aria-expanded="false">
            Explorar
            <svg class="icon-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>

          <!-- EL CAJÓN MEGA MENÚ -->
          <!-- Tabindex -1 permite que el contenedor reciba Focus por JS pero no natural -->
          <div class="mega-menu" id="mega-menu-panel" aria-hidden="true" tabindex="-1">
            <div class="mega-menu__inner">
              
              <!-- Columna de Enlaces 1 -->
              <div class="mega-group">
                <h3 class="mega-title" id="title-1">Desarrollo Web</h3>
                <ul aria-labelledby="title-1">
                  <li><a href="#">Páginas Corporativas</a></li>
                  <li><a href="#">E-commerce</a></li>
                </ul>
              </div>

              <!-- Columna de Enlaces 2 -->
              <div class="mega-group">
                <h3 class="mega-title" id="title-2">Diseño UI/UX</h3>
                <ul aria-labelledby="title-2">
                  <li><a href="#">Prototipado</a></li>
                  <li><a href="#">Identidad Visual</a></li>
                </ul>
              </div>

              <!-- Destacado Promocional -->
              <div class="mega-card">
                <div class="mega-card__image"></div>
                <div class="mega-card__content">
                  <h4>Masterclass Gratis</h4>
                  <p>Aprende las últimas tendencias en desarrollo frontend.</p>
                  <a href="#" class="btn-primary">Reservar Plaza</a>
                </div>
              </div>

            </div>
          </div>
        </li>
      </ul>
    </nav>
  </div>
</header>
```

### Fase 2: CSS (Animación Suave y la Magia del Subgrid)

Vamos a ocultar el submenú subiéndolo 10 píxeles hacia arriba (`translateY`) y borrándolo de la visibilidad (`opacity / visibility`). 
Lo interesantísimo viene en la Query `@media (min-width: 768px)`. Declaramos que la cabecera sea un Grid perfecto de 12 columnas. Y declaramos que el contenedor interno del menú herede ese grid de columnas transparente con `subgrid`.

Añade en `style.css`:

```css
:root {
  --color-bg: #F3F4F6; --color-header: #FFFFFF; --color-text: #111827; --color-text-muted: #6B7280;
  --color-primary: #2563EB; --color-primary-hover: #1D4ED8; --color-border: #E5E7EB;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.1); --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
}

* { margin:0; padding:0; box-sizing: border-box; }
body { font-family: system-ui, sans-serif; background: var(--color-bg); color: var(--color-text); min-height:100vh;}

.header { background: var(--color-header); box-shadow: var(--shadow-sm); position: relative; z-index: 100; }
.header-container { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; padding: 1rem; }
.logo { font-size: 1.5rem; font-weight: bold; color: var(--color-text); text-decoration: none; }

.nav-list { list-style: none; display: flex; gap: 1rem; align-items: center; }
.nav-link { background: none; border: none; font-size: 1rem; color: var(--color-text-muted); text-decoration: none; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: 0.2s; }
.nav-link:hover { color: var(--color-primary); }

.icon-chevron { width: 16px; height: 16px; transition: transform 0.3s; }
.btn-mega[aria-expanded="true"] { color: var(--color-primary); }
.btn-mega[aria-expanded="true"] .icon-chevron { transform: rotate(180deg); }


/* ========================================
   CAJÓN DEL MEGA MENÚ
   ======================================== */
.mega-menu {
  position: absolute; top: 100%; left: 0; width: 100%;
  background: var(--color-header); box-shadow: var(--shadow-lg); border-top: 1px solid var(--color-border);
  
  /* ESTADO CERRADO ANIMABLE */
  opacity: 0; visibility: hidden; transform: translateY(-10px);
  transition: all 0.3s ease;
}

/* LA PUERTA SE ABRE */
.has-mega-menu.is-open .mega-menu { opacity: 1; visibility: visible; transform: translateY(0); }

.mega-menu__inner { display: grid; gap: 2rem; padding: 2rem 1rem 3rem 1rem; }

/* Estilo interior grupos */
.mega-title { font-size: 0.85rem; text-transform: uppercase; color: var(--color-text); margin-bottom: 1rem; }
.mega-group ul { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; }
.mega-group a { color: var(--color-text-muted); text-decoration: none; transition: 0.2s; }
.mega-group a:hover, .mega-group a:focus { color: var(--color-primary); outline: 2px solid var(--color-primary); border-radius: 4px; }

/* Promo Card */
.mega-card { background: var(--color-bg); border-radius: 8px; overflow: hidden; }
.mega-card__image { background: #D1D5DB; height: 100px; width: 100%; }
.mega-card__content { padding: 1.5rem; }
.mega-card h4 { margin-bottom: 0.5rem; }
.mega-card p { font-size: 0.9rem; margin-bottom: 1rem; color: var(--color-text-muted); }

.btn-primary { display: inline-block; background: var(--color-primary); color: white; padding: 0.5rem 1rem; text-decoration: none; border-radius: 6px; font-size: 0.9rem; }


/* ========================================
   ESCRITORIO: EL REINO DE SUBGRID
   ======================================== */
@media (min-width: 768px) {
  /* Al Header global le clavamos un Grid brutal de 12 Columnas exactas */
  .header-container { display: grid; grid-template-columns: 1fr repeat(10, minmax(0, 100px)) 1fr; padding: 0; }
  
  .logo { grid-column: 2 / span 2; padding: 1.5rem 0; }
  .nav { grid-column: 5 / 12; justify-self: end; }
  
  /* El interior del Menú se esparce de lado a lado... */
  .mega-menu__inner {
    grid-column: 1 / -1; 
    /* Y calca las 12 columnas exactas imaginarias que trazamos en el Header */
    grid-template-columns: subgrid;
    padding: 3rem 0;
  }

  /* Ahora usamos esas líneas caladas para posicionar milimétricamente el contenido flotante a nuestro gusto */
  .mega-group:nth-child(1) { grid-column: 4 / span 2; }
  .mega-group:nth-child(2) { grid-column: 6 / span 2; }
  .mega-card { grid-column: 9 / span 3; }
}
```

### Fase 3: Javascript (Guardián del Teclado)

Este bloque hará algo muy simple: Modificar clases y Aria-attributes. Y hará algo muy avanzado: Enjaular al usuario en el menú para que si viaja con TAB no se salga del contexto visual. Si apreta "Esc", todo se plegará a su origen.

Escribe en `main.js`:

```javascript
const megaTrigger = document.getElementById('mega-trigger');
const liParent = megaTrigger.closest('.has-mega-menu');
const megaPanel = document.getElementById('mega-menu-panel');

// Selector de todo elemento "interactuable" estándar
const focusableElementsSelector = 'a[href], button:not([disabled])';

const toggleMenu = () => {
  const isOpen = liParent.classList.contains('is-open');
  
  if (!isOpen) { 
    // ABRIR
    liParent.classList.add('is-open');
    megaTrigger.setAttribute('aria-expanded', 'true');
    megaPanel.setAttribute('aria-hidden', 'false');
    
    // UX Focus Instantáneo: Llevo la mente (y cursor) del usuario de golpe adentro.
    const firstItem = megaPanel.querySelectorAll(focusableElementsSelector)[0];
    if (firstItem) setTimeout(() => firstItem.focus(), 100);
    
  } else { 
    // CERRAR
    liParent.classList.remove('is-open');
    megaTrigger.setAttribute('aria-expanded', 'false');
    megaPanel.setAttribute('aria-hidden', 'true');
  }
};

megaTrigger.addEventListener('click', toggleMenu);

// Paracaídas Universal de Clicks fuera
document.addEventListener('click', (event) => {
  if (liParent.classList.contains('is-open') && !liParent.contains(event.target)) {
    toggleMenu();
  }
});

/* ==========================================
   TRAMPA DE FOCO INFINITO (A11Y Pattern)
   ========================================== */
megaPanel.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;

  const nodes = megaPanel.querySelectorAll(focusableElementsSelector);
  const firstNode = nodes[0];
  const lastNode = nodes[nodes.length - 1]; 

  // Escenario Retroceso (Shift + Tab)
  if (e.shiftKey) {
    if (document.activeElement === firstNode) {
      e.preventDefault(); 
      lastNode.focus(); // Reenvío al final
    }
  } 
  // Escenario Avance (Tab normal)
  else {
    if (document.activeElement === lastNode) {
      e.preventDefault(); 
      firstNode.focus(); // Reenvío al principio
    }
  }
});

// Botón de Pánico
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && liParent.classList.contains('is-open')) {
    toggleMenu();
    megaTrigger.focus();
  }
});
```

Abre la página, dale al tabulador, muévete por los enlaces con las flechas y maravíllate sintiendo cómo el "Focus" ha sido domado magistralmente como debe de ser en una aplicación empresarial moderna.
