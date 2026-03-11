# Efectos de Scroll de Alto Rendimiento (Intersection Observer) 🌬️

## 1. ¿Qué vamos a construir?
Vamos a crear una página estilo "Landing de Producto" donde los textos, imágenes y tarjetas irán apareciendo suavemente desde abajo o desde los lados a medida que bajamos (Scroll Reveal).
Históricamente este efecto destruía el rendimiento de los móviles al calcular la posición exacta de cada elemento en la pantalla 60 veces por segundo (`window.onScroll`). 
Hoy aprenderás a crear "Vigías invisibles" usando la modernísima API nativa del navegador: **Intersection Observer**.

---

## 2. Conceptos Clave antes de empezar
*   **El Vigía Asíncrono (Observer):** En lugar de preguntarle 1 millón de veces al navegador cada vez que movemos la rueda del ratón dónde está una caja... le decimos: *"Toma esta lista de cajas. Avísame sólo en el exacto instante en el que choquen con el borde de mi pantalla"*. Esto nos garantiza coste de rendimiento CERO.
*   **Data-Attributes Geométricos (`data-reveal-type`):** Programaremos en CSS 3 tipos distintos de animaciones (Fade Up, Zoom, Slide de lado) asociadas a una palabra. En el HTML simplemente pondremos a nuestras cajas ocultas `data-reveal-type="fade-up"` y listo.
*   **El Stagger Mágico (Cascada) con Variables CSS:** Para hacer que 3 fotos aparezcan 1 detrás de otra con un retraso, los Novatos crearían 3 clases `.retraso1`, `.retraso2` en CSS. Tú, le pondrás directamente al HTML una micro-variable css dentro del style: `style="--delay: 0.1s"`. Y tu hoja de estilos principal la chupará dinámicamente. 1 línea de CSS gobierna miles de posibles configuraciones.

---

## 3. Paso a paso

### Fase 1: HTML y Variables de Cascada

En este HTML tenemos la estructura de una Landing Page. Fíjate detalladamente en los bloques que tienen la clase `reveal-item` (Cuyo CSS las inyecta en estado invisible). Además de esa marca de agua base que les dirá a nuestro JS que deben ser vigiladas, tienen sus directivas `data-reveal-type` y los geniales variables en línea `--delay`.

Copia en `index.html`:

```html
<header class="hero-section">
  <div class="hero-content">
    <h1><span class="text-gradient">Scroll Reveal</span> 60FPS.</h1>
    <p>Baja por la página para activar la API Intersection Observer.</p>
    <div class="scroll-indicator">↓ Sigue bajando ↓</div>
  </div>
</header>

<main class="content-wrapper">
  
  <section class="story-section">
    <!-- Una caja suelta: Nace con -60px Y, y Opacity 0 -->
    <div class="text-block reveal-item" data-reveal-type="fade-up">
      <h2>Innovación Constante</h2>
      <p>Nos dedicamos a transformar ideas complejas en soluciones digitales sencillas y elegantes. Nuestro enfoque se centra en la experiencia del usuario y el rendimiento extremo.</p>
    </div>
    
    <!-- Staggering (Cascada de Retrasos en V) puros por CSS Var -->
    <div class="image-grid">
      <img src="https://images.unsplash.com/photo-1550537687-c9a0c20c02de?auto=format&fit=crop&q=80&w=400" alt="Tech" class="grid-img reveal-item" data-reveal-type="zoom-in" style="--delay: 0s;">
      <img src="https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=400" alt="Tech" class="grid-img reveal-item" data-reveal-type="zoom-in" style="--delay: 0.1s;">
      <img src="https://images.unsplash.com/photo-1510519138131-5f228b34388e?auto=format&fit=crop&q=80&w=400" alt="Tech" class="grid-img reveal-item" data-reveal-type="zoom-in" style="--delay: 0.2s;">
    </div>
  </section>

  <!-- Pasamos otra variable extraña para configurar el desplazamiento horizontal puro -->
  <section class="feature-section">
    <article class="feature-card reveal-item" data-reveal-type="slide-side" style="--slide-dir: -50px;">
      <h3>Diseño Adaptativo</h3>
      <p>Creamos interfaces que se ven increíbles en cualquier dispositivo, desde terminales móviles hasta pantallas de 5K.</p>
    </article>

    <article class="feature-card reveal-item" data-reveal-type="slide-side" style="--slide-dir: 50px;">
      <h3>Velocidad Extrema</h3>
      <p>Optimización de código para asegurar que tu sitio cargue en menos de un segundo, mejorando tu SEO y retención.</p>
    </article>
  </section>

  <section class="showcase-section">
    <div class="showcase-content reveal-item" data-reveal-type="fade-up">
      <h2>Más de 10 años creando el futuro.</h2>
      <p>Nuestra trayectoria nos avala como líderes en el sector de la consultoría tecnológica y el desarrollo creativo.</p>
    </div>
  </section>

</main>

<footer class="footer">
  <p>Fin de la Landing Page</p>
</footer>
```

### Fase 2: El CSS, Modificadores Invisibles y "Will-Change"

Vamos a construir los armazones base.
Lo más importante está abajo: La clase `.reveal-item` dictará las normas de cómo el objeto existirá inicialmente antes de ser tocado por nuestro vigía.
Atento a `transition: ... var(--delay, 0s);`. Absorbe la variable de tu objeto HTML si existe, si no, usa 0. Y muy importante el uso de `will-change`, esto envía una señal a la Memoria VRAM Grafica del Navegador diciendo *"Hey, prepárate para animar el opacity y el transform pronto, empieza a crear los mapas en bajo nivel"*. Previene al 100% los tirones en móviles baratos de 100€.

Añade en tu `style.css`:

```css
:root { --bg-color: #0F172A; --surface-color: #1E293B; --text-main: #F8FAFC; --text-muted: #94A3B8; --accent: #38BDF8; }

body { font-family: 'Inter', system-ui, sans-serif; background: var(--bg-color); color: var(--text-main); margin: 0; overflow-x: hidden; }

/* LAYOUT DE EJEMPLO */
.hero-section { height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 2rem; border-bottom: 1px solid var(--surface-color); }
.hero-content { max-width: 700px; }
h1 { font-size: clamp(3rem, 8vw, 5rem); margin-bottom: 1.5rem; letter-spacing: -0.05em;}
.text-gradient { background: linear-gradient(135deg, #38BDF8, #818CF8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hero-content p { font-size: 1.25rem; color: var(--text-muted); line-height: 1.6; }

.scroll-indicator { margin-top: 4rem; font-size: 0.9rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); animation: bounce 2s infinite ease-in-out; }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(10px); } }

.content-wrapper { max-width: 1000px; margin: 0 auto; padding: 6rem 2rem; display: flex; flex-direction: column; gap: 10rem; }

h2 { font-size: 2.5rem; margin-bottom: 1rem; color: var(--text-main); }
h3 { font-size: 1.5rem; margin-bottom: 0.5rem; }
p { line-height: 1.7; color: var(--text-muted); font-size: 1.1rem; }

.text-block { max-width: 600px; margin: 0 auto; text-align: center; }
.image-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-top: 4rem; }
.grid-img { width: 100%; height: 300px; object-fit: cover; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }

.feature-section { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 3rem; }
.feature-card { background: var(--surface-color); padding: 3rem 2rem; border-radius: 24px; border: 1px solid rgba(255,255,255,0.05); }

.showcase-content { text-align: center; max-width: 700px; margin: 0 auto; padding: 4rem 2rem; border-left: 4px solid var(--accent); background: linear-gradient(90deg, var(--surface-color) 0%, transparent 100%); border-radius: 0 24px 24px 0;}
.footer { text-align: center; padding: 4rem; border-top: 1px solid var(--surface-color); color: var(--text-muted); }


/* ========================================
   ESTADOS DE REVELACIÓN AURA (Animados por GPU)
   ======================================== */

.reveal-item {
  /* Todo nace Oculto e invisible a la espera */
  opacity: 0;
  
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) var(--delay, 0s), 
              transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) var(--delay, 0s);
  
  /* Preparación de Caché Gráfica VRAM */
  will-change: opacity, transform;
}

/* 1. Direcciones Iniciales Puras */
.reveal-item[data-reveal-type="fade-up"] { transform: translateY(60px); }
.reveal-item[data-reveal-type="zoom-in"] { transform: scale(0.85); }
.reveal-item[data-reveal-type="slide-side"] { transform: translateX(var(--slide-dir, -50px)); }

/* 2. El Destino Final (JS te pondrá esta clase cuando llegue tu momento) */
.reveal-item.is-revealed {
  opacity: 1;
  /* Anulamos la posición rara "pre-configurada" que tenías y te devolvemos de golpe a 0x0 exacto originando la animación fluida en destino */
  transform: none; 
}


/* ========================================
   ACCESIBILIDAD MÉDICA
   ======================================== */
@media (prefers-reduced-motion: reduce) {
  .reveal-item {
    transition: none !important;
    transform: none !important;
    opacity: 1 !important;
  }
}
```

### Fase 3: La construcción del Observador (API `IntersectionObserver`)

Las 4 fases puras del IntersectionObserver:
1. Lo configuramos (Le pasamos los Settings "RootMargin" diciendo que salte la alarma no exactamente en la frontera, sino un poquito por debajo de la pantalla para verlo nacer delante de nosotros de forma orgánica).
2. Creamos la Función Callback (La lógica que hace qué hacer en caso de chutar la alarma).
3. "Unobserve" (Crucial). El JS que escribimos dirá: "Ok, acabo de chocar y de añadirle la clase al nodo HTML de la Foto1. Así que a partir de ahora, borra a ese nodo del listado global de vigilancia y olvídale para siempre". (Ahorro astronómico de memoria en webs con cientos de scroll en fotos).
4. Le pasamos todos los elementos con `.`reveal-item al ojo ciego del observador para que arranque.

Pega el alma de tu proyecto en `main.js`:

```javascript
// 1. Array de elementos a vigilar
const nodesToReveal = document.querySelectorAll('.reveal-item');

// 2. Configuración de Límite Espacial
const observerOptions = {
    root: null, // Que nuestro radar sea Todo el Monitor Entero.
    rootMargin: '0px 0px -100px 0px', // Restamos -100px al límite inferior. Así el usuario lo ve nacer "cerca pero dentro" orgánicamente.
    threshold: 0
};

// 3. El Motor / Cerebro Lógico de Colisión
const revealCallback = (entries, observerController) => {
    entries.forEach(entry => {
        // ¿El elemento acaba de intersectar la mirilla ajustada?
        if (entry.isIntersecting) {
            
            // Disparo CSS Transition de nacimiento de Destino a 0,0,0
            entry.target.classList.add('is-revealed');
            
            // OPTIMIZACIÓN LEY DE GESTIÓN DE BASURA (UNOBSERVE)
            // Ya se ha mostrado y bailado bonito, sácalo de la base de datos mental
            // del radar del navegador para siempre.
            observerController.unobserve(entry.target);
            
        }
    });
};

// 4. Construcción Física del Ojo Observador 👁️
const revealObserver = new IntersectionObserver(revealCallback, observerOptions);


// ENGANCHANDO LOS CARPETAS DE DATOS AL OJO
nodesToReveal.forEach(node => {
     // A11Y Médica Detectada al vuelo: Evitamos vigilar siquiera si el paciente no quiere movimiento
    const mediaQueryObj = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (mediaQueryObj.matches) {
        node.classList.add('is-revealed');
    } else {
        revealObserver.observe(node);
    }
});
```

Baja sutilmente por tu web y disfruta cómo el rendimiento estelar hace flotar cada componente a tu paso rindiendo perfecto hasta en tostadoras, con 0 calentamiento. Y recuerda, como tiene un "unobserve" y no hay Javascript dictando la animación... ¡las imágenes no volverán a esconderse jamás aunque subas y bajes! Puro Performance!
