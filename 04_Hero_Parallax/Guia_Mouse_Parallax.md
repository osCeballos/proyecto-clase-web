# Construyendo un Hero Mouse Parallax 🖱️✨

## 1. ¿Qué vamos a construir?
¿Alguna vez has notado cómo, al mirar por la ventana de un coche en movimiento, los árboles cercanos pasan muy deprisa mientras que las montañas del fondo apenas se mueven? Ese es el efecto **Parallax**.

Hoy vas a recrear esa ilusión óptica en la web. Vamos a vincular el movimiento del ratón del usuario con varias figuras geométricas flotantes en el fondo de una sección. Dependiendo de cuán "cerca" o "lejos" queramos que el usuario perciba cada figura, las moveremos más o menos píxeles dando una **sensación de profundidad (3D)** increíblemente pulida y sensorial.

---

## 2. Conceptos Clave antes de empezar
*   **Vector de Distancia (JS):** Calcularemos la distancia matemática que hay entre el centro de tu pantalla y la posición exacta de tu ratón en cada microsegundo.
*   **Atributos Data (`data-*`):** Usaremos el HTML para guardar una pequeña "variable" en cada figura (ej. `data-speed="45"`) que le indicará al JS la "profundidad" de esa figura en concreto. ¡Así el Diseño controla el Código!
*   **Performance (`will-change` en CSS):** Mover cosas con el ratón requiere 60 frames por segundo (60fps). Usaremos aceleración por Tarjeta Gráfica en CSS para que la web no vaya "a tirones".

---

## 3. Paso a paso

### Fase 1: La estructura (HTML) y la configuración visual

Empezamos creando el contenedor principal y nuestras figuras abstractas. Observa cómo cada figura tiene un atributo `data-speed`. 
- Un número alto (ej: `45`) simula que está muy cerca y se moverá muy rápido.
- Un número bajo (ej: `15`) simula lejanía.
- Un número negativo (`-25`) significa que se moverá en dirección contraria al ratón (huye).

Añade este bloque a tu `index.html`. Usaremos Lorem Ipsum en el texto para no distraernos:

```html
<main class="hero" id="parallax-container">
  <!-- El contenido de texto que el usuario leerá -->
  <div class="hero-content">
    <h1>Experiencias Sensoriales</h1>
    <p>Consectetur adipiscing elit. Nullam in dui mauris. Mueve el ratón por la pantalla para ver el efecto Parallax.</p>
  </div>

  <!-- Capa de formas decorativas flotantes -->
  <div class="shapes-layer">
    <!-- Círculo: Se mueve muchísimo (muy cerca) -->
    <div class="shape shape--circle" data-speed="45" aria-hidden="true"></div>
    
    <!-- Cuadrado: Se mueve en dirección contraria -->
    <div class="shape shape--square" data-speed="-25" aria-hidden="true"></div>
    
    <!-- Triángulo: Se mueve muy lento (muy lejos) -->
    <div class="shape shape--triangle" data-speed="15" aria-hidden="true">
      <svg viewBox="0 0 100 100"><polygon points="50,15 100,100 0,100" fill="currentColor"/></svg>
    </div>

    <!-- Puntos abstractos -->
    <div class="shape shape--dots" data-speed="-10" aria-hidden="true"></div>
  </div>
</main>
```

### Fase 2: El diseño, rendimiento gráfico y Accesibilidad (CSS)

El objetivo visual de nuestro Parallax es que el texto principal se lea claramente (usando *Glassmorphism* en su caja contenedora) y que las formas bailen libremente por debajo. 

Por otro lado, a nivel de **Accesibilidad**, es imperativo considerar a usuarios con "cinetosis" o mareos inducidos visualmente. Por eso apagaremos las animaciones si su ordenador lo tiene configurado así usando `@media (prefers-reduced-motion)`.

Copia esto en tu `style.css`:

```css
:root {
  --color-bg: #E0E7FF; 
  --color-text: #312E81;
  --color-shape-1: #818CF8;
  --color-shape-2: #F472B6;
  --color-shape-3: #34D399;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  background-color: var(--color-bg);
  overflow-x: hidden; /* Evita scrolls horizontales feos cuando el cuadrado salga de pantalla */
}

.hero {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center; /* Centrado perfecto */
  overflow: hidden;
}

/* La caja central con Glassmorphism */
.hero-content {
  text-align: center;
  max-width: 700px;
  padding: 2rem;
  z-index: 10;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(8px);
  border-radius: 24px;
}

.shapes-layer {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 1; 
  pointer-events: none; /* Así el ratón "atraviesa" la forma sin chocar contra ella */
}

/* ESTILO SAGRADO PARA PERFORMANCE 60fps */
.shape {
  position: absolute;
  will-change: transform; /* Preparativos para la tarjeta gráfica (GPU) */
  transition: transform 0.1s ease-out; /* Fricción sutil para un movimiento orgánico */
}

/* Formas Decorativas */
.shape--circle {
  width: 300px; height: 300px; border-radius: 50%;
  background: var(--color-shape-1);
  top: -50px; left: -50px;
  filter: blur(40px); opacity: 0.5;
}
.shape--square {
  width: 150px; height: 150px; border-radius: 20px;
  background: var(--color-shape-2);
  bottom: 20%; right: 15%;
  transform: rotate(15deg);
}
.shape--triangle {
  width: 80px; height: 80px;
  color: var(--color-shape-3);
  bottom: 10%; left: 20%;
}

/* ACCESIBILIDAD CRÍTICA */
@media (prefers-reduced-motion: reduce) {
  .shape {
    transition: none !important;
    transform: translate(0, 0) !important; 
  }
}
```

### Fase 3: La interactividad magnética (JavaScript)

Vamos a darle vida real. Leeremos constantemente dónde está el ratón (`mousemove`) desde el centro y empujaremos las diferentes formas calculando su `data-speed`.

Copia el siguiente fragmento en tu archivo `main.js`:

```javascript
const parallaxContainer = document.getElementById('parallax-container');
const shapes = document.querySelectorAll('.shape');

// 1. Calculamos el "Punto Zero" (Centro magnético exacto de la pantalla)
const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;

// 2. Escuchar el ratón sobre nuestro hero (Contenedor general)
parallaxContainer.addEventListener('mousemove', (e) => {
  
  // A. Extraemos las coordenadas X e Y exactas del momento
  const { clientX, clientY } = e;

  // B. Convertimos esas coordenadas en vectores desde el Centro
  const mouseX = clientX - centerX;
  const mouseY = clientY - centerY;

  // C. Movemos independientemente cada forma
  shapes.forEach(shape => {
    // Leemos el valor del HTML: ¿Cómo de rápido quiere el diseñador que se mueva esto?
    const speed = shape.getAttribute('data-speed');
    
    // Ecuación de distancia (distancia * peso_velocidad / 100_para_suavizar)
    const x = (mouseX * speed) / 100;
    const y = (mouseY * speed) / 100;

    // Inyectarlo dinámicamente al CSS
    shape.style.transform = `translate(${x}px, ${y}px) rotate(${shape.classList.contains('shape--square') ? '15deg' : '0deg'})`;
  });
});

// 3. Detalle UX: El Reset Elegante
// Si sacamos el ratón del cuadro, volvemos a poner las imágenes en su centro
parallaxContainer.addEventListener('mouseleave', () => {
  shapes.forEach(shape => {
    shape.style.transform = `translate(0px, 0px) rotate(${shape.classList.contains('shape--square') ? '15deg' : '0deg'})`;
  });
});
```

¡Hecho! Fíjate como con conceptos matemáticos simplificados y un código limpio conseguimos un nivel de calidad (o *crafting*) que separa a un desarrollador junior de un nivel Senior. ¡Mueve tu ratón y disfruta de la magia del 3D!
