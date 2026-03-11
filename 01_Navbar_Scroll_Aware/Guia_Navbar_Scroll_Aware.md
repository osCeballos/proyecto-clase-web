# Construyendo una Navbar Inteligente (Scroll-Aware) 🚀

## 1. ¿Qué vamos a construir?
¿Alguna vez has estado leyendo un artículo largo en tu móvil y la barra de navegación superior no te deja ver bien el contenido porque ocupa mucho espacio? ¡Es frustrante! 

Hoy vamos a solucionar ese problema creando una barra de navegación "Scroll-Aware" (consciente del scroll). El objetivo es simple pero poderoso: 
- Cuando el usuario baja (hace scroll down) para leer, la barra se oculta suavemente para darle todo el espacio posible al contenido.
- En cuanto el usuario sube un poco (scroll up), la barra reaparece instantáneamente, asumiendo que quiere ir a otra parte de la web.

Esta técnica reduce la **carga cognitiva** (menos cosas en pantalla = más concentración) y mejora enormemente la experiencia de usuario (UX). ¡Vamos a programarlo paso a paso!

---

## 2. Conceptos Clave antes de empezar
*   **Manipulación del DOM (JS):** Aprenderemos a escuchar el evento de `scroll` de la ventana (`window`) para saber en qué dirección se mueve el usuario.
*   **Posicionamiento Fijo (CSS):** Usaremos `position: fixed` para que la barra siempre esté visible (o lista para estarlo) sin importar cuánto bajemos en la página.
*   **Rendimiento en Animaciones:** En lugar de hacer que la barra desaparezca de golpe (`display: none`), jugaremos con la propiedad `transform: translateY()` en CSS para deslizarla suavemente. Animar `transform` es lo más óptimo para el rendimiento gráfico de los navegadores (60fps).

---

## 3. Paso a paso

### Fase 1: La estructura HTML (Los cimientos)

Para empezar, necesitamos construir el esqueleto. Recuerda usar la etiqueta semántica `<nav>` cuando agrupes enlaces de navegación principales. Es vital para la **Accesibilidad (a11y)**, ¡así los lectores de pantalla sabrán de qué va esa sección!

Copia y pega este código en tu archivo `index.html`:

```html
<header class="navbar" id="navbar">
  <div class="navbar-container">
    <a href="#" class="brand" aria-label="Ir a la página de inicio">✨ BrandUI</a>
    <!-- Etiqueta semántica para navegación principal -->
    <nav aria-label="Navegación principal">
      <ul class="nav-links">
        <li><a href="#home">Inicio</a></li>
        <li><a href="#portfolio">Portafolio</a></li>
        <li><a href="#about">Nosotros</a></li>
        <li><a href="#contact">Contacto</a></li>
      </ul>
    </nav>
  </div>
</header>

<main>
  <!-- Contenido de relleno para poder hacer scroll -->
  <section class="hero" id="home">
    <div class="hero-content">
      <h1>Bienvenidos a nuestra Web</h1>
      <p>Explora nuestros servicios y descubre lo que podemos hacer por ti.</p>
    </div>
  </section>
  <section class="content" id="portfolio">
    <h2>Pellentesque habitant morbi</h2>
    <p>Tristique senectus et netus et malesuada fames ac turpis egestas.</p>
    <div class="spacer" aria-hidden="true"></div>
  </section>
</main>
```
*Tip:* Hemos usado una estructura clara para que puedas concentrarte en la lógica del scroll y la navegación.

### Fase 2: Los estilos básicos y la "magia" visual (CSS)

Ahora vamos a darle vida y modernidad. Usaremos **Variables CSS** para tener un control total de los colores y **Glassmorphism** (un efecto de desenfoque muy elegante) en nuestra barra. 

Lo más importante aquí son dos clases: `.navbar` (el estado normal) y `.navbar--hidden` (el estado cuando se oculta). Copia esto en tu `style.css`:

```css
:root {
  --color-primary: #667EEA;
  --color-surface: rgba(255, 255, 255, 0.95);
  --transition-smooth: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.navbar {
  /* position: fixed saca a la barra del flujo normal y la pega arriba */
  position: fixed; 
  top: 0;
  width: 100%;
  
  /* Glassmorphism: Un efecto de desfoque elegante */
  background-color: var(--color-surface);
  backdrop-filter: blur(10px); 

  /* Animamos cualquier cambio en 'transform' con una curva natural */
  transition: transform var(--transition-smooth);
}

/* Esta es la clase que aplicaremos con JavaScript */
.navbar--hidden {
  /* Desplaza la barra hacia arriba exactamente su altura (100%) */
  transform: translateY(-100%);
}

/* Micro-interacción: Línea animada bajo los enlaces */
.nav-links a {
  position: relative;
  text-decoration: none;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--color-primary);
  transform: scaleX(0); 
  transition: transform 0.3s ease;
}

.nav-links a:hover::after,
.nav-links a:focus-visible::after {
  transform: scaleX(1); 
  transform-origin: left;
}
```
*Justificación de diseño:* La curva `cubic-bezier` hace que el movimiento se sienta físico y natural, no robótico. La pequeña animación al pasar el ratón (`hover`) ofrece un **feedback visual inmediato** de que el elemento es interactivo.

### Fase 3: La interactividad (JavaScript)

Solo nos falta el "Cerebro". Queremos que el navegador detecte si estamos subiendo o bajando. La lógica es puramente matemática: si mi posición actual en el scroll es mayor que donde estaba hace un milisegundo, significa que estoy bajando.

Añade este código a tu `main.js`:

```javascript
// 1. Seleccionamos la barra de navegación
const navbar = document.getElementById('navbar');

// 2. Guardamos la posición inicial del scroll
let lastScrollY = window.scrollY;

// 3. Escuchamos el evento de scroll en la ventana
window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  
  // Evitar rebote superior en Mac/iOS (overscroll)
  if (currentScrollY <= 0) {
    navbar.classList.remove('navbar--hidden');
    return;
  }

  // 4. Lógica de deducción:
  // Si estoy más abajo que antes, y pasé los primeros 60px
  if (currentScrollY > lastScrollY && currentScrollY > 60) {
    // Intención: Leer -> Ocultamos la barra
    navbar.classList.add('navbar--hidden');
  } else {
    // Intención: Navegar -> Mostramos la barra
    navbar.classList.remove('navbar--hidden');
  }

  // 5. Actualizamos el pasado para el próximo ciclo
  lastScrollY = currentScrollY;
});
```

¡Eso es todo! Con unas pocas líneas de código, has mejorado radicalmente la usabilidad de tu página aportando una experiencia de navegación mucho más fluida. ¡Pruébalo haciendo scroll en tu navegador!
