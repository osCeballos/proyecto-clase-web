# Construyendo un Hero Slider Automático 🎬

## 1. ¿Qué vamos a construir?
El **Carrusel o Slider Automático** es uno de los componentes más populares en la web moderna. Se utiliza normalmente en la sección "Hero" (lo primero que ves al entrar a una página) para mostrar varias imágenes o mensajes clave sin obligar al usuario a hacer scroll.

En lugar de un slider aburrido que pasa imágenes como si fuesen diapositivas de PowerPoint, construiremos uno con un efecto **Cinematográfico**: un fundido suave entre imágenes combinado con un ligero movimiento de acercamiento (zoom in) conocido como *Efecto Ken Burns*. 

Este enfoque da mucha más "calidad premium" y vida a tu página. ¡Vamos a ello!

---

## 2. Conceptos Clave antes de empezar
*   **Posicionamiento Absoluto (CSS):** Para que las imágenes se superpongan unas sobre otras (como una baraja de cartas) usaremos `position: absolute`.
*   **Temporizadores (JS):** Aprenderemos a usar `setInterval()` para crear un "reloj" que cambie la foto automáticamente cada X segundos.
*   **Control de Usuario (UX):** Todo lo que se mueve solo debe poder ser controlado. Si el usuario hace clic para ver una imagen específica, reiniciaremos el reloj para no quitarle la foto justo cuando la está leyendo.

---

## 3. Paso a paso

### Fase 1: La estructura (HTML) y Accesibilidad

Nuestro carrusel requiere una estructura robusta. Es fundamental añadir atributos **ARIA** para que las personas que usan lectores de pantalla entiendan que están interactuando con un carrusel y no con contenido estático.

Copia este código en tu `index.html`. Observa cómo usamos textos ficticios (Lorem Ipsum) para enfocarnos en la estructura:

```html
<section class="hero-slider" aria-roledescription="carousel" aria-label="Imágenes destacadas">
  
  <div class="slides-container" id="slider-track">
    <!-- Slide 1 (Activa por defecto) -->
    <article class="slide slide--active" data-index="0" aria-roledescription="slide">
      <img src="https://images.unsplash.com/photo-1541462608143-67571c6738dd?auto=format&fit=crop&q=80&w=1920" alt="Espacio de trabajo creativo" class="slide__bg">
      <div class="slide__content">
        <h2>Diseño de Experiencias</h2>
        <p>Creamos interfaces intuitivas que conectan con tus usuarios.</p>
      </div>
    </article>

    <!-- Slide 2 -->
    <article class="slide" data-index="1" aria-roledescription="slide" aria-hidden="true">
      <img src="https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1920" alt="Desarrollo Frontend moderno" class="slide__bg">
      <div class="slide__content">
        <h2>Desarrollo Frontend</h2>
        <p>Expertos en React, Vue y las tecnologías más punteras del mercado.</p>
      </div>
    </article>

    <!-- Slide 3 -->
    <article class="slide" data-index="2" aria-roledescription="slide" aria-hidden="true">
      <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1920" alt="Estrategia digital y SEO" class="slide__bg">
      <div class="slide__content">
        <h2>Estrategia Digital</h2>
        <p>Potenciamos tu marca para alcanzar los objetivos de negocio.</p>
      </div>
    </article>
  </div>

  <!-- Controles Inferiores (Dots) -->
  <div class="slider-controls">
    <div class="slider-dots" id="dots-container" role="tablist" aria-label="Elegir diapositiva">
      <button class="dot dot--active" aria-label="Ir a diapositiva 1" role="tab" aria-selected="true" data-index="0"></button>
      <button class="dot" aria-label="Ir a diapositiva 2" role="tab" aria-selected="false" data-index="1"></button>
      <button class="dot" aria-label="Ir a diapositiva 3" role="tab" aria-selected="false" data-index="2"></button>
    </div>
  </div>
</section>
```

### Fase 2: El diseño y el efecto "Ken Burns" (CSS)

Ahora apilaremos todas las imágenes y les daremos el efecto de fundido cruzado (crossfade). Añade este código a tu `style.css`:

```css
:root {
  --color-text-light: #F8FAFC;
  --color-overlay: rgba(15, 23, 42, 0.6);
  --color-accent: #38BDF8;
}

.hero-slider {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.slides-container {
  width: 100%;
  height: 100%;
  position: relative;
}

/* Apilamos todas las slides */
.slide {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  opacity: 0; 
  visibility: hidden; 
  transition: opacity 0.8s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* La slide que está visible */
.slide--active {
  opacity: 1;
  visibility: visible;
  z-index: 10;
}

/* Imagen de fondo con zoom ligero inicial */
.slide__bg {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  z-index: -2;
  transform: scale(1.05);
  transition: transform 6s ease-out; /* Animación super lenta */
}

/* Al estar activa, vuelve a su tamaño normal creando el efecto Ken Burns */
.slide--active .slide__bg {
  transform: scale(1);
}

/* Capa oscura para que el texto sea siempre legible */
.slide::after {
  content: '';
  position: absolute;
  inset: 0;
  background-color: var(--color-overlay);
  z-index: -1;
}

/* Estilos de los controles (Puntos) */
.slider-controls {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
}

.slider-dots {
  display: flex;
  gap: 0.75rem;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot--active {
  background: var(--color-accent);
  transform: scale(1.3);
}
```

### Fase 3: La interactividad (JavaScript)

El slider debe cambiar automáticamente, pero también respetar cuando el usuario interviene. Copia esto en tu `main.js`:

```javascript
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

let currentSlideIndex = 0;
const totalSlides = slides.length;
let autoPlayInterval;
const TIME_BETWEEN_SLIDES = 5000; // 5 segundos

// 1. Función para ir a una slide concreta
function goToSlide(index) {
  // Apagamos todas las slides y puntos
  slides.forEach(slide => {
    slide.classList.remove('slide--active');
    slide.setAttribute('aria-hidden', 'true');
  });
  dots.forEach(dot => {
    dot.classList.remove('dot--active');
    dot.setAttribute('aria-selected', 'false');
  });

  // Encendemos solo la actual
  slides[index].classList.add('slide--active');
  slides[index].removeAttribute('aria-hidden');
  
  dots[index].classList.add('dot--active');
  dots[index].setAttribute('aria-selected', 'true');

  currentSlideIndex = index;
}

// 2. Función para saltar a la siguiente
function nextSlide() {
  let newIndex = currentSlideIndex === totalSlides - 1 ? 0 : currentSlideIndex + 1;
  goToSlide(newIndex);
}

// 3. Temporizador automático
function startAutoPlay() {
  autoPlayInterval = setInterval(() => {
    nextSlide();
  }, TIME_BETWEEN_SLIDES);
}

function resetAutoPlay() {
  // Reiniciamos el reloj si el usuario hace clic manualmente
  clearInterval(autoPlayInterval);
  startAutoPlay();
}

// 4. Activar los puntos de control inferiores
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    goToSlide(index);
    resetAutoPlay();
  });
});

// ¡Arrancamos el slider!
startAutoPlay();
```

¡Hecho! Acabas de construir un slider interactivo que luce profesional y respeta la accesibilidad. Modifica el tiempo del `TIME_BETWEEN_SLIDES` para ver cómo se comporta más rápido o más lento.
