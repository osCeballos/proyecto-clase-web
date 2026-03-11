# Card Expandible (Acordeón Moderno) 📏

## 1. ¿Qué vamos a construir?
Las interfaces a menudo contienen mucha información (descripciones, etiquetas, medidas). No siempre podemos girar la tarjeta en 3D ni enviar al usuario a otra página.
La solución más habitual es una carta **Expandible** (un Acordeón). Al pulsar "Ver Detalles", la tarjeta crece hacia abajo empujando el resto de elementos suavemente para revelar el contenido.

---

## 2. Conceptos Clave antes de empezar
*   **La Pesadilla Técnica Resuelta:** Tradicionalmente, animar la altura (el `height: auto;`) de un elemento generaba cortes bruscos o tirones horribles, porque CSS no sabe hacer cálculos de *cero a infinito*. Hoy usaremos el estándar de la época moderna: la técnica `Grid 0fr`.
*   **La Prensa Hidráulica de CSS:** Envolveremos el contenido secreto en una caja "Grid". Inicialmente le diremos que su ancho de fila es "0 fracciones" (`0fr`). Automáticamente aplastará la altura a cero. Cuando el usuario haga click, cambiaremos esa fila a "1 fracción" (`1fr`). ¡Pura magia visual!
*   **A11y (ARIA):** Como hay contenido escondido, el botón de abrir debe avisarle al usuario invidente conectado del estado en que se halla (abierto o cerrado) mediante el atributo dinámico `aria-expanded`.

---

## 3. Paso a paso

### Fase 1: El Esqueleto Desplegable (HTML)

Vamos a armar la tarjeta. Presta especial atención a la anidación (los div dentro de div) en la zona inferior. Necesitaremos 3 div vitales para la zona que se esconde: El `padre(grid)`, el `hijo(prensa)` y el `nieto(texto puro)`.

*(Utilizamos textos "Lorem Ipsum" como es habitual).*

Copia la estructura a `index.html`:

```html
<main class="storefront">
  
  <article class="expandable-card">
    
    <!-- CABECERA (Imagen Fija) -->
    <div class="card__header">
      <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600" alt="Zapatillas Retro Limited" class="card__img">
    </div>

    <!-- CUERPO PRINCIPAL -->
    <div class="card__body">
      
      <!-- Bloque Frontal (Nombre, Precio y Flechita) -->
      <div class="card__visible-content">
        <div class="card__meta">
          <h2 class="card__title">Retro Edition</h2>
          <p class="card__price">89.90 €</p>
        </div>
        
        <!-- Botón disparador. Observa los Aria-Labels -->
        <button type="button" class="btn-expand" id="trigger-btn" aria-expanded="false" aria-controls="collapsible-section">
          <span class="btn-expand__text">Detalles</span>
          <svg class="icon-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
      </div>

      <!-- 
        ZONA SECRETA (Sección Acordeón) 
        El Padre (#collapsible-section) controlará la expansión de la altura
      -->
      <div class="card__grid-wrapper" id="collapsible-section">
        <div class="card__collapsible-content">
          
          <p class="product-description">
            Inspiradas en los clásicos de los 80, estas zapatillas combinan un diseño icónico con la comodidad de la tecnología moderna. Perfectas para tu día a día.
          </p>
          
          <div class="actions">
            <button class="btn-primary">Añadir</button>
            <button class="btn-secondary" aria-label="Favoritos">♡</button>
          </div>
          
        </div>
      </div>

    </div>
  </article>

</main>
```

### Fase 2: Configurando el Grid 0fr (CSS)

Vamos a aplicar el truco Maestro. Al padre (`card__grid-wrapper`) le aplicaremos un `grid-template-rows: 0fr`. Eso lo convierte en una cama plana. Y al hijo (`card__collapsible-content`) le pondremos `overflow: hidden;` para que sus textos no se desborden de este emparedado.

Añade esto a `style.css`:

```css
:root {
  --color-bg: #E5E7EB; --color-surface: #FFFFFF; --color-text: #1F2937; --color-text-muted: #6B7280; --color-primary: #111827; --color-accent: #EF4444;
  --radius-card: 16px;
  --shadow-base: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

body { font-family: 'Inter', system-ui, sans-serif; background: var(--color-bg); min-height: 100vh; display: grid; place-items: center; padding: 2rem; margin:0; }

/* LA TARJETA ENVOLTORIO */
.expandable-card { width: 100%; max-width: 340px; background: var(--color-surface); border-radius: var(--radius-card); overflow: hidden; box-shadow: var(--shadow-base); transition: 0.3s ease; }
.card__header { width: 100%; height: 240px; overflow: hidden; }
.card__img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.expandable-card:hover .card__img { transform: scale(1.05); }
.card__body { padding: 1.5rem; }

/* CONTENIDO FIJO POSTERIOR */
.card__visible-content { display: flex; justify-content: space-between; align-items: flex-end; }
.card__title { font-size: 1.25rem; font-weight: 800; color: var(--color-text); margin-bottom: 0.2rem; }
.card__price { font-size: 1.1rem; font-weight: 700; color: var(--color-accent); }

.btn-expand { display: flex; align-items: center; gap: 0.25rem; background: none; border: none; font-family: inherit; font-size: 0.85rem; font-weight: 600; color: var(--color-text-muted); cursor: pointer; padding: 0.5rem; margin-right: -0.5rem; transition: color 0.2s; }
.btn-expand:hover { color: var(--color-primary); }
.icon-chevron { width: 16px; height: 16px; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }

/* ========================================
   LA MAGIA EXTENSIBLE (GRID ACORDEÓN)
   ======================================== */

/* El Muro Padre. Arranca Aplastado con O Fracciones de altura */
.card__grid-wrapper {
  display: grid;
  grid-template-rows: 0fr; 
  transition: grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1); /* Anima suave la fila */
}

/* El Hijo Interno (Contenedor de textos). Si el padre le aplasta la pared a 0, escondemos lo que desborde (letras salientes) */
.card__collapsible-content {
  overflow: hidden;
  opacity: 0;
  transform: translateY(-10px); /* Nace un pelín subido para "caer" al desplegar */
  transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* -------------------------------------
   ESTADOS JS (CUANDO PULSAMOS EL BOTÓN)
   ------------------------------------- */

/* 1. Gira el icono Chevron */
.expandable-card.is-expanded .icon-chevron { transform: rotate(-180deg); }

/* 2. El Acordeón se Abre pidiendo la Fracción Natural Completa */
.expandable-card.is-expanded .card__grid-wrapper { grid-template-rows: 1fr; }

/* 3. El texto recobra su opacidad y cae a su sitio 0 */
.expandable-card.is-expanded .card__collapsible-content { opacity: 1; transform: translateY(0); padding-top: 1.25rem; }


/* Estilos Triviales del Interior */
.product-description { font-size: 0.85rem; line-height: 1.6; color: var(--color-text-muted); margin-bottom: 1.25rem; }
.actions { display: flex; gap: 0.5rem; }
.btn-primary { flex-grow: 1; background: var(--color-primary); color: white; border: none; border-radius: 8px; padding: 0.75rem; font-weight: 600; cursor: pointer; transition: 0.1s; }
.btn-primary:active { transform: scale(0.96); }
.btn-secondary { width: 44px; height: 44px; display: grid; place-items: center; background: transparent; border: 1px solid #D1D5DB; border-radius: 8px; color: var(--color-text); font-size: 1.2rem; cursor: pointer; transition: 0.2s; }
.btn-secondary:hover { background: #F9FAFB; color: var(--color-accent); border-color: var(--color-accent); }
```

### Fase 3: Controlador A11Y (JavaScript)

Como hemos externalizado casi toda la animación 3D de alturas al moderno CSS Grid, Javascript hará principalmente de **Guardián Semántico**: avisar internamente que la tarjeta ha cambiado de estado de Oculto a Visible. 

Añade en `main.js`:

```javascript
const card = document.querySelector('.expandable-card');
const triggerBtn = document.getElementById('trigger-btn');

const toggleCard = () => {
  // 1. Injector de Músculo CSS (Tiramos de la palanca)
  card.classList.toggle('is-expanded');
  
  // 2. Evaluamos el impacto
  const isExpanded = card.classList.contains('is-expanded');
  
  // 3. Accesibilidad Oral: Actualizar la voz de los Lectores
  triggerBtn.setAttribute('aria-expanded', isExpanded);
  
  // 4. Feedback Contextual Lógico de Textos
  const btnText = triggerBtn.querySelector('.btn-expand__text');
  if (isExpanded) {
    btnText.textContent = "Cerrar"; // Botón de colapsar
  } else {
    btnText.textContent = "Detalles"; // Botón original de desplegar
  }
};

triggerBtn.addEventListener('click', toggleCard);
```

¡Es hora de la magia! Dale al botón de *"Lorem"* y maravíllate viendo uno de los retos más duros de la web en 2010 resolverse maravillosamente en 2024 con la técnica `1fr`.
