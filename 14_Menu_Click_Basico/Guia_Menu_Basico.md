# Menú de Navegación Móvil (Toggle Básico) 🍔

## 1. ¿Qué vamos a construir?
El patrón de interfaz más famoso de la historia del desarrollo web moderno (y probablemente el más programado) es el **Menú Hamburguesa** para móviles.

A menudo se enseña a hacerlo rápido y mal. Aquí aprenderás a construir la estructura "Sagrada", el cimiento sobre el que se levantan las páginas web accesibles e impecables para el usuario.
Crearemos una cabecera que en escritorio muestra los enlaces horizontales, y en móvil colapsa esos enlaces tras un botón con un icono dinámico (Hamburguesa -> Cierre ✖) y una lógica anti-tontos que cierra el menú cuando pulsas "fuera" o le das a la tecla Escape.

---

## 2. Conceptos Clave antes de empezar
*   **Separación de Poderes (CSS vs JS):** Es un crimen usar JavaScript para escribir estilos como `menu.style.display = 'block'`. JavaScript **sólo** pegará una pegatina (clase CSS) al padre (`<header class="is-open">`). CSS se encargará mágicamente de interpretar que si el padre lleva esa pegatina, el hijo debe ser mostrado.
*   **Contrato de Accesibilidad (A11y):** Cuando escondes elementos importantes de la pantalla, un lector de pantalla (robot) no sabe dónde están. El botón debe avisar en vivo de lo que hace mediante `aria-expanded="true/false"` y a quién controla usando `aria-controls`.
*   **UX de Retirada (Dismiss):** Un elemento molesto encima de la pantalla (Modal) siempre debe ofrecer una salida rápida al usuario sin forzarle a apuntar a la `X`. Programaremos que pinchar en cualquier lado fuera de él (o darle a ESC) lo aborte.

---

## 3. Paso a paso

### Fase 1: Semántica HTML del Header

Aquí reside la arquitectura inicial. Tenemos un `header`, y dentro un contenedor principal que alinea el `logo`, el `button` y el `nav`. Observa que el botón Hamburguesa tiene *dos iconos SVG* por defecto en el HTML (las 3 rayitas, y una X). CSS ocultará inteligentemente uno u otro según el estado.

Copia en `index.html`:

```html
<header class="header">
  <div class="header-container">
    
    <a href="#" class="logo" aria-label="Volver a Inicio">
      StudioDesign<span style="color:var(--color-primary)">.</span>
    </a>

    <!-- BOTÓN TRIGGER -->
    <!-- Sus atributos Aria avisan a las máquinas de estado y relación -->
    <button type="button" class="menu-btn" id="menu-trigger" aria-controls="main-nav" aria-expanded="false" aria-label="Abrir menú principal">
      <!-- Icono Hamburguesa -->
      <svg class="icon icon--menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      <!-- Icono Cerrar (Asomará luego) -->
      <svg class="icon icon--close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>

    <!-- NAVEGACIÓN -->
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

### Fase 2: Mobile First y Control de Estados (CSS)

El paradigma moderno exige diseñar primero para el móvil pequeñito.
Nuestra `<nav>` estará oculta por defecto (`display: none`) flotando por debajo del header usando posición absoluta. La magia sucederá cuando Javascript añada la clase `.is-open` al `<header>` padre: entonces CSS cambiará a `display: block`.

Además, jugaremos con el atributo de HTML `aria-expanded` para cambiar automáticamente los iconos de rayitas por aspa. Todo sin ensuciar Javascript.

Añade a `style.css`:

```css
:root {
  --color-bg: #F8FAFC; --color-header: #FFFFFF; --color-text: #0F172A; --color-text-muted: #64748B; --color-primary: #8B5CF6; --color-border: #E2E8F0;
  --shadow-header: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

body { font-family: 'Inter', system-ui, sans-serif; background: var(--color-bg); color: var(--color-text); min-height: 100vh; margin:0; }

/* LA BARRA MAESTRA */
.header { background: var(--color-header); box-shadow: var(--shadow-header); position: relative; z-index: 100; }
.header-container { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; max-width: 1200px; margin: 0 auto; }
.logo { font-size: 1.5rem; font-weight: 800; color: var(--color-text); text-decoration: none; }

/* EL BOTÓN HAMBURGUESA Y SUS ICONOS MUTANTES */
.menu-btn { background: transparent; border: none; color: var(--color-text); cursor: pointer; padding: 0.5rem; display: flex; align-items: center; border-radius: 6px; }
.menu-btn:focus-visible { outline: 3px solid var(--color-primary); }
.icon { width: 24px; height: 24px; }
.icon--close { display: none; } /* Oculto de inicio */

/* Truco CSS Avanzado: Leer atributos de HTML en vivo para permutar el icono */
.menu-btn[aria-expanded="true"] .icon--menu { display: none; }
.menu-btn[aria-expanded="true"] .icon--close { display: block; }


/* =======================================
   REGLAS PARA MÓVIL (MENOS DE 767px)
   ======================================= */
@media (max-width: 767px) {
  
  .nav {
    position: absolute; top: 100%; left: 0; width: 100%;
    background: var(--color-header); border-top: 1px solid var(--color-border);
    box-shadow: var(--shadow-header);
    display: none; /* ESCONDIDO! El usuario no lo ve */
  }

  /* EL DESPERTAR: Si el padre adopta la clase... tú te muestras */
  .header.is-open .nav { display: block; }
  
  .nav-list { flex-direction: column; padding: 1rem 1.5rem 1.5rem; }
}

/* ESTÉTICA COMÚN DE LOS ENLACES (Válida para todas resoluciones) */
.nav-list { list-style: none; display: flex; gap: 0.5rem; margin:0; padding:0; }
.nav-link { display: block; padding: 0.75rem 1rem; color: var(--color-text-muted); text-decoration: none; font-weight: 500; border-radius: 8px; transition: all 0.2s; }
.nav-link:hover { color: var(--color-primary); background: rgba(139, 92, 246, 0.05); padding-left: 1.5rem; }

.nav-link--btn { background: var(--color-primary); color: white; text-align: center; }
.nav-link--btn:hover { background: #7C3AED; color: white; transform: translateY(-2px); }


/* =======================================
   REGLAS PARA ESCRITORIO (Y MÁS DE 768px)
   ======================================= */
@media (min-width: 768px) {
  .menu-btn { display: none; /* Aniquilamos físicamente la Hamburguesa, ya no sirve */ }
  
  .nav {
    display: block; /* Anulamos el escondite del móvil obligándolo a estar visible siempre */
    position: static; border: none; box-shadow: none; background: transparent;
  }
  
  .nav-list { flex-direction: row; align-items: center; }
  .nav-link { padding: 0.5rem 1rem; }
  .nav-link:hover { background: transparent; padding-left: 1rem; }
}
```

### Fase 3: Controlador y Guardián del Cierre (Javascript)

El Javascript tiene tres partes fundamentales. En la Parte 1 inyecta la clase principal. En las partes 2 y 3, crea paracaídas de accesibilidad y usabilidad global (cerciorándose de cerrar si se detecta clics "en la nada" y escuchando la tecla ESC).

Pega en `main.js`:

```javascript
const header = document.querySelector('.header');
const menuBtn = document.getElementById('menu-trigger');

const toggleMenu = () => {
  // 1. Alterna el modificador visual
  header.classList.toggle('is-open');
  
  // 2. Lee en qué estado ha quedado y sincroniza el atributo de Accesibilidad (Aria-expanded)
  const isMenuOpen = header.classList.contains('is-open');
  menuBtn.setAttribute('aria-expanded', isMenuOpen);
  
  // 3. Informa al Label de la acción futura
  menuBtn.setAttribute('aria-label', isMenuOpen ? 'Cerrar menú principal' : 'Abrir menú principal');
};

menuBtn.addEventListener('click', toggleMenu);

/* =======================================
   GUARDIANES UX FRONT-END JUNIOR/SENIOR
   ======================================= */

// PARACAÍDAS 1: Click "fuera de ti" (Click Outside Pattern)
document.addEventListener('click', (event) => {
  const isMenuOpen = header.classList.contains('is-open');
  // Determina si el pixel pinchado es hijo geométrico (está dentro) del Header.
  const isClickInsideHeader = header.contains(event.target);
  
  // Estaba abierto... PERO has pinchado fuera de las paredes del Header -> CIERRA.
  if (isMenuOpen && !isClickInsideHeader) {
    toggleMenu(); 
  }
});

// PARACAÍDAS 2: Navegación estándar de teclado con Escape
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && header.classList.contains('is-open')) {
    toggleMenu();
    menuBtn.focus(); // Rebotonamos amablemente el tabulador al usuario al botón
  }
});
```

Abre tu web, haz la pantalla más pequeña que 768px y comprueba la solidez matemática de la arquitectura que acabas de desplegar.
