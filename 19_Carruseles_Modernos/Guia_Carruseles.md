# Carruseles Modernos (CSS Scroll Snap) 🎠

## 1. ¿Qué vamos a construir?
Olvídate de instalar pesadísimas librerías Javascript (como Slick Carousel, Owl, o Swiper) que destrozan la carga de tu web solo para tener un listado de fotos deslizable.
Hoy aprenderás cómo el CSS moderno incluye un motor de físicas gravitatorias incrustado (Scroll Snap API). Construiremos dos componentes vitales: Un **Carrusel Horizontal "Netflix"** clásico y un **Carrusel Vertical "TikTok"**. El móvil del usuario rebotará las fotos usando el procesador del sistema operativo de Apple o Android directamente, cero JavaScript.

---

## 2. Conceptos Clave antes de empezar
*   **La Pista Magnetizada (El Contenedor):** Para que exista un carrusel sin librerías de JS, le daremos a un `div` padre la propiedad libre de escrollear (`overflow-x: auto`), y a continuación habilitaremos el imán general pasándole el tipo de físicas `scroll-snap-type`.
*   **El Punto de Anclaje (El Hijo):** ¿Debe el imán parar la foto cuando choca por su izquierda? ¿O debe clavarla en el centro exacto de la pantalla? Se lo dictaremos con `scroll-snap-align`.
*   **Mandatory vs Proximity:** "Mandatory" obliga al usuario a caer en el foso magnético de una foto sí o sí, incluso si le da a la rueda del ratón un milímetro, el imán chupará la foto más cercana. "Proximity" es más relajado, si el usuario se queda lejos del imán, el CSS le permite estar a mitad de camino.

---

## 3. Paso a paso

### Fase 1: Estructura HTML Semántica (Tracks y Cards)

Necesitamos dos secciones. Presta atención a los botones `<button>` de control. Tienen que llevar SIEMPRE un `aria-label` descriptivo. Aunque CSS se encarga del touch en teléfonos móviles arrastrando el dedo, seguiremos programando el clic en las flechas clásicas de izquierda/derecha para que los abuelitos del PC de sobremesa con ratón puedan navegar. Pega el siguiente código en `index.html`:

```html
<header class="header">
  <div class="header-container">
    <div class="logo">CreativeSlider<span style="color:var(--color-primary)">.</span></div>
  </div>
</header>

<main class="content">

  <!-- CARRUSEL TIPO 1: HORIZONTAL (El clásico e-commerce / Netflix) -->
  <section class="slider-section">
    <div class="slider-header">
      <h2>Colección Primavera</h2>
      <div class="slider-controls">
        <button class="btn-control" id="btn-prev-h" aria-label="Ver elementos anteriores"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
        <button class="btn-control" id="btn-next-h" aria-label="Ver elementos siguientes"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
      </div>
    </div>

    <div class="slider-horizontal" id="slider-track-h">
      
      <article class="slide-card">
        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400" alt="Item" class="slide-img">
        <div class="slide-info">
          <h3>Sudadera 'Neo-Pastel'</h3>
          <p>129.99 €</p>
        </div>
      </article>
      
      <article class="slide-card">
        <img src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=400" alt="Item" class="slide-img">
        <div class="slide-info">
          <h3>Chaqueta Cortavientos</h3>
          <p>89.50 €</p>
        </div>
      </article>

      <article class="slide-card">
        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400" alt="Item" class="slide-img">
        <div class="slide-info">
          <h3>Pantalón Cargo Black</h3>
          <p>105.00 €</p>
        </div>
      </article>
      
      <article class="slide-card">
        <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=400" alt="Item" class="slide-img">
        <div class="slide-info">
          <h3>Camiseta 'Digital Art'</h3>
          <p>150.00 €</p>
        </div>
      </article>

    </div>
  </section>

  <!-- CARRUSEL TIPO 2: VERTICAL (Estilo TikTok / Catálogo Reels) -->
  <section class="slider-section mt-lg">
    <div class="slider-header">
      <h2>Especialidades</h2>
      <div class="slider-controls vertical-controls">
        <button class="btn-control" id="btn-prev-v" aria-label="Subir"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polyline points="18 15 12 9 6 15"></polyline></svg></button>
        <button class="btn-control" id="btn-next-v" aria-label="Bajar"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
      </div>
    </div>

    <!-- Pista Vertical que gobernará el Snap Imán en Eje Y -->
    <div class="slider-vertical" id="slider-track-v">
      <div class="v-slide" style="background-image: url('https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?auto=format&fit=crop&q=80&w=600')">
        <div class="v-content"><h3>Diseño UI</h3></div>
      </div>
      <div class="v-slide" style="background-image: url('https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600')">
        <div class="v-content"><h3>Desarrollo Web</h3></div>
      </div>
      <div class="v-slide" style="background-image: url('https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=600')">
        <div class="v-content"><h3>Branding</h3></div>
      </div>
    </div>
  </section>

</main>
```

### Fase 2: Magia CSS Magnética y Estilos "Hide Scrollbar"

Cuidado al diseñar esto: el peor enemigo de un buen Carrusel CSS es una fea barra de desplazamiento gris nativa de Windows ensuciándote tu bonito diseño flotante web en el PC. Aprenderás a usar el selector fantasma oscuro `::-webkit-scrollbar` para asesinarla sin piedad.
Observa detenidamente cómo encendemos el Motor de Físicas en `.slider-horizontal` (usando el eje X, `x mandatory`). 

En tu `style.css`:

```css
  :root { --color-bg: #F8FAFC; --color-surface: #FFFFFF; --color-text: #0F172A; --color-text-muted: #64748B; --color-primary: #8B5CF6; --color-border: #E2E8F0; --shadow-card: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); }
  
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: system-ui, -apple-system, sans-serif; background: var(--color-bg); color: var(--color-text); }
  
  /* LAYOUT DE EJERCcICIO */
  .header { background: var(--color-surface); padding: 1.5rem; border-bottom: 1px solid var(--color-border); }
  .logo { font-size: 1.5rem; font-weight: 800; max-width: 1200px; margin: 0 auto;}
  .content { max-width: 1200px; margin: 0 auto; padding: 4rem 1.5rem; }
  .mt-lg { margin-top: 6rem; }
  
  .slider-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem; }
  .slider-header h2 { font-size: 1.75rem; font-weight: 700; letter-spacing: -0.02em; }
  .slider-controls { display: flex; gap: 0.5rem; }
  .btn-control { background: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text); width: 44px; height: 44px; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; transition: all 0.2s; }
  .btn-control:hover, .btn-control:focus-visible { background: var(--color-text); color: var(--color-surface); outline: none; transform: translateY(-2px); }

  /* ========================================
     3. MOTOR HORIZONTAL - El Rail del Tren
     ======================================== */
  .slider-horizontal {
    display: flex; gap: 1.5rem;
    overflow-x: auto; /* Encender Ruedas Vías Nativo */
    
    scrollbar-width: none; /* Auto-Destruir feas Scrollbars Firefox */
    -ms-overflow-style: none; /* Auto-Destruir IE/Edge */
    
    /* ENCIENDE EL IMÁN EN EL EJE X, IMPARABLE */
    scroll-snap-type: x mandatory;
    
    /* Margen virtual del Imán por la izquierda */
    scroll-padding-inline: 1.5rem;
    padding-bottom: 1.5rem;
  }
  
  .slider-horizontal::-webkit-scrollbar { display: none; } /* Ocultar barra en Chrome/Safari */
  
  /* LAS TARJETAS / VAGONES */
  .slide-card {
    /* La tarjeta medirá lo que deba, pero nunca menos de 260px, y en PC unos 320px */
    flex: 0 0 clamp(260px, 70vw, 320px);
    
    /* Por dónde la agarra el tren? Por el inicio/start. */
    scroll-snap-align: start;
    
    /* Evita que un arrastre loco de un usuario con TDAH salte 14 fotos de una vez ignorando paradas */
    scroll-snap-stop: always; 
    
    background: var(--color-surface); border-radius: 16px; box-shadow: var(--shadow-card); overflow: hidden;
  }
  
  /* Deco tarjetas */
  .slide-img { width: 100%; height: 250px; object-fit: cover; }
  .slide-info { padding: 1.5rem; }
  .slide-info h3 { font-size: 1.1rem; margin-bottom: 0.5rem; }
  .slide-info p { color: var(--color-primary); font-weight: 600; }
  

  /* ========================================
     4. MOTOR VERTICAL - Efecto Reels / TikTok
     ======================================== */
  .slider-vertical {
    height: 600px;
    display: flex; flex-direction: column; gap: 1rem; border-radius: 24px;
    
    overflow-y: auto; scrollbar-width: none;
    
    /* IMÁN VERTICAL, O AL TIKTOK DE ARRIBA O AL TIKTOK DE ABAJO, O TE CHUPA AL CENTRO. */
    scroll-snap-type: y mandatory;
  }

  .slider-vertical::-webkit-scrollbar { display: none; }
  
  .v-slide {
    flex: 0 0 100%; /* Cada tarjeta ocupará OBLIGATORIAMENTE un 100% de la altura disponible de su Padre (600px) */
    
    scroll-snap-align: center; 
    
    background-size: cover; background-position: center; border-radius: 24px; position: relative;
    box-shadow: inset 0 -150px 100px -50px rgba(0,0,0,0.7);
  }
  
  .v-content { position: absolute; bottom: 2rem; left: 2rem; color: white; }
  .v-content h3 { font-size: 2rem; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
```

### Fase 3: Javascript (Simulando Empujones Abstractos) 🚀

En este punto el Carrusel en un iPhone te funciona mágicamente al 100% solo deslizando. 
Pero necesitamos "click" para la gente de escritorio. ¿Cómo hacemos la cuenta matemática precisa en Javascript para caer en la coordenada milimétrica de la tarjeta 3 multiplicando el ancho de la tarjeta 1?
Respuesta: NO la hacemos.

Le decimos al Carrusel `track.scrollBy({ left: 320 })`. ¿320 píxeles? ¿Acaso mide nuestra Foto 320 píxeles exactamente? No lo sabemos ni nos importa. Literalmente es como pegarle "Un empujón ciego" de fuerza +320 en dirección contraria. Como la pared de tu tren está magnetizada con `Scroll Snap` en el CSS, el CSS frenará la tarjeta y la imantará encajándola al milímetro ignorando la imprecisión de nuestra fuerza calculada en JS. ¡Viva HTML5!

Copia y pega este simplísimo script en tu `main.js`:

```javascript
// ==========================================
// 1. EL CARRUSEL HORIZONTAL
// ==========================================
const trackH = document.getElementById('slider-track-h');
const btnPrevH = document.getElementById('btn-prev-h');
const btnNextH = document.getElementById('btn-next-h');

// Generador de Físicas Abstractas 
const desplazarHorizontal = (pixels) => {
    trackH.scrollBy({
        left: pixels,
        behavior: 'smooth' // El navegador lo animará, sin dar un corte seco
    });
};

btnPrevH.addEventListener('click', () => { desplazarHorizontal(-320); });
btnNextH.addEventListener('click', () => { desplazarHorizontal(320); });

// ==========================================
// 2. EL CARRUSEL VERTICAL (Tiktok reels)
// ==========================================
const trackV = document.getElementById('slider-track-v');
const btnPrevV = document.getElementById('btn-prev-v');
const btnNextV = document.getElementById('btn-next-v');

const desplazarVertical = (pixels) => {
    trackV.scrollBy({
        top: pixels,
        behavior: 'smooth'
    });
};

btnPrevV.addEventListener('click', () => { desplazarVertical(-500); });
btnNextV.addEventListener('click', () => { desplazarVertical(500); });
```

Un código ultra robusto y ridículamente pequeño. Tus usuarios de ordenador harán "Click" felices deslizándose magnéticamente, y tus usuarios de Móvil / Tablet arrastrarán el dedo disfrutando los 60 Frames Cúbicos que arroja el procesador en bruto frente un viejo Carrusel jQuery de 1.5MB de peso. ¡Menudo progreso!
