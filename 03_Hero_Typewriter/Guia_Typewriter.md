# Construyendo un Hero Typewriter (Máquina de escribir) ⌨️

## 1. ¿Qué vamos a construir?
En el diseño web moderno, mantener la atención del usuario en los primeros segundos es crucial. Una de las formas más dinámicas de lograrlo es el efecto "Typewriter" o máquina de escribir.

Este efecto simula que una persona real está tecleando una frase, luego borrándola para escribir otra. Es ideal para mostrar en un solo lugar (como el título de una página) las diferentes habilidades que tienes o los servicios que ofreces, ahorrando mucho espacio y añadiendo un toque humano e interactivo.

---

## 2. Conceptos Clave antes de empezar
*   **Accesibilidad (a11y):** Un error común en este efecto es olvidar a los lectores de pantalla (usados por personas con problemas de visión). Si no se configura bien, el lector leerá letra por letra como un robot roto. Solucionaremos esto utilizando etiquetas `aria`.
*   **Librerías externas:** Aunque esto se puede programar en JavaScript puro, hoy usaremos una librería externa muy famosa llamada `Typed.js`. En el mundo real, los desarrolladores usan librerías para ahorrar tiempo cuando el trabajo está estandarizado.
*   **Preventing Layout Shift:** Es un problema de diseño donde el contenido "salta" cuando el texto cambia de tamaño o desaparece. Aprenderás a evitarlo fijando alturas con CSS.

---

## 3. Paso a paso

### Fase 1: La estructura (HTML) y la Accesibilidad Crítica

Para que este componente sea hermoso PERO accesible, la estrategia es simple:
1. El título contenedor o `<h1>` tendrá toda la frase completa en su atributo `aria-label` para que los lectores de pantalla la lean de golpe.
2. Ocultaremos la animación a los lectores de pantalla con `aria-hidden="true"`.

Copia este código en tu `index.html`. Usaremos texto de relleno (Lorem Ipsum) para enfocarnos primero en la base:

```html
<main class="hero">
  <div class="hero-container">
    <p class="eyebrow">Agencia Creativa de Alto Rendimiento</p>
    
    <!-- Entregamos el texto consolidado al lector de pantallas -->
    <h1 class="title" aria-label="Desarrollamos ideas, creamos experiencias, construimos el futuro.">
      
      <!-- Esta capa es puramente visual, el lector de pantallas la ignora -->
      <span class="typewriter-text" id="typewriter" aria-hidden="true"></span>
    </h1>
    
    <p class="subtitle">Transformamos tu visión en una realidad digital impactante, escalable y centrada en el usuario desde el primer píxel.</p>
    
    <button class="cta-btn">Empezar Proyecto</button>
  </div>
</main>
```
*No olvides importar la librería `Typed.js` en tu HTML antes de tu script principal:*
`<script src="https://unpkg.com/typed.js@2.1.0/dist/typed.umd.js"></script>`

### Fase 2: Diseño y Layout Shift (CSS)

El objetivo visual de nuestro Typewriter no solo es que las letras se vean bien, ¡es que el bloque general no parpadee al cambiar de palabra! Para esto usamos `min-height`. 

Copia este bloque en tu `style.css`:

```css
:root {
  --color-bg: #0F172A; 
  --color-text: #F8FAFC; 
  --color-primary: #38BDF8; 
  --color-cursor: #38BDF8;
}

/* COMPOSICIÓN BÁSICA */
.hero {
  min-height: 100vh;
  display: grid;
  place-items: center; /* Centrar todo fácil con CSS Grid */
  padding: 2rem;
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: 'Inter', system-ui, sans-serif;
}

.hero-container {
  max-width: 800px;
  width: 100%;
}

/* TIPOGRAFÍA Y JERARQUÍA */
.eyebrow {
  color: var(--color-primary);
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.title {
  font-size: clamp(2.5rem, 5vw, 4.5rem); 
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  
  /* CRUCIAL: Bloqueamos la altura para que el texto de abajo no salte al borrar */
  min-height: 120px; 
}

/* Estilos de la librería para el cursor */
.typed-cursor {
  color: var(--color-cursor);
  font-weight: 300;
}
```

### Fase 3: Activando el "Cerebro" de tecleo (JavaScript)

Como incluimos la librería en nuestro HTML, ahora disponemos de un control maestro que nos soluciona la matemática pura de "poner letras y quitarlas".

Copia el siguiente fragmento en tu archivo `main.js`:

```javascript
/* 
  Instanciamos Typed.js.
  El primer parámetro ('#typewriter') indica dónde incrustar el texto.
  El segundo parámetro configuran el comportamiento.
*/
const typed = new Typed('#typewriter', {
  // 1. Las frases a mostrar (¡Añade tantas como quieras!)
  strings: [
    "Desarrollamos ideas.",
    "Creamos experiencias.",
    "Construimos el futuro."
  ],
  
  // 2. Control de Velocidad (como métricas humanas en milisegundos)
  typeSpeed: 60,       // Tiempo prudencial de escritura
  backSpeed: 30,       // El borrado suele ser más rápido
  startDelay: 1000,    // Un segundo de espera antes de que empiece a escribir
  backDelay: 2000,     // Dejamos la palabra terminada dos segundos para que el usuario pueda leerla
  
  // 3. Estética visual
  loop: true,          // Queremos que se repita infinitamente
  cursorChar: '|',     // Podemos cambiar el cursor (e.g., '_')
  autoInsertCss: true  // Agregará el CSS base para que el cursor parpadee
});
```

¡Boom! Ya lo tienes. Acabas de incluir de forma profesional, escalable y accesible un elemento totalmente dinámico que mejorará el enganche de cualquier landing page.
