# Add to Cart (Micro-interacciones y Estados) 🛒

## 1. ¿Qué vamos a construir?
El botón más importante de internet es el de "Añadir al carrito". Es el interruptor maestro de las ventas online. Cuando un usuario hace clic ahí, está metiendo la mano en el bolsillo.

Si por mala conexión a internet tarda 2 segundos en responder, el usuario entra en pánico ("¿Le he dado bien?") y hace doble click. Consecuencia: le cobramos dos artículos por error. 

Para solucionar esto, crearemos una **Micro-interacción** de 3 estados:
1.  **Reposo:** "Añadir al carrito".
2.  **Cargando:** El botón se bloquea, el texto huye hacia arriba y aparece una rueda girando ("¡Te he escuchado, un segundo!").
3.  **Éxito:** Animación verde de "¡Añadido!" dándole al usuario la certeza dopaminérgica de que todo ha ido bien.

---

## 2. Conceptos Clave antes de empezar
*   **Posiciones Absolutas en CSS:** Envolveremos 5 elementos (Textos e iconos) dentro del botón, todos apelotonados en el punto `(0,0)` y jugando con subir/bajar su opacidad y rotación.
*   **El bloqueo Infranqueable (`disabled`):** En cuanto escuchemos un clic, trancaremos la puerta del botón a nivel HTML. Es imposible hacer doble clic físico.
*   **Gestión Asíncrona (`async / await`):** Las ventas no son instantáneas. Hay que viajar a un servidor lejos. Simularemos ese "lag" o retraso usando promesas de Javascript para detener el tiempo 1.5 segundos a propósito.

---

## 3. Paso a paso

### Fase 1: La Tarjeta de Producto y el Botón de 5 Capas (HTML)

Vamos a armar un típico escaparate de producto. El truco visual reside en el botón: meteremos todos los estados posibles dentro del código fuente desde un inicio, pero los dejaremos invisibles (O bien estirados fuera de la caja o con `opacity: 0`).

*(Utilizamos textos "Lorem Ipsum" como es habitual en la maqueta estructural).*

Añade esto a tu `index.html`:

```html
<main class="product-showcase">
  <article class="product-card">
    
    <div class="product-img-box">
      <!-- Imagen de producto de Unsplash -->
      <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600" alt="Zapatillas Running Pro" class="product-img">
    </div>
    
    <div class="product-info">
      <h1 class="product-title">Running Air Pro</h1>
      <p class="product-price">129.99 €</p>
      
      <!-- 
        El Botón Protagonista. 
        A11y: aria-live="assertive" gritará los cambios de texto al instante 
        para lectores de pantalla.
      -->
      <button class="btn-cart" id="addToCartBtn" aria-live="assertive">
        
        <!-- ESTADO 1: INICIAL -->
        <span class="btn-text btn-text--default">Añadir al Carrito</span>
        <svg class="icon icon-cart" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        
        <!-- ESTADO 2: CARGANDO (Rueda Giratoria) -->
        <svg class="icon icon-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
        
        <!-- ESTADO 3: ÉXITO (Confirmación Verde) -->
        <span class="btn-text btn-text--success">¡Añadido!</span>
        <svg class="icon icon-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        
      </button>

    </div>
  </article>
</main>
```

### Fase 2: El Mago de las Ocultaciones (CSS)

La tarjeta de producto tiene su diseño habitual. La genialidad está en el botón.
Fíjate que CSS controlará dos clases inyectables: `.is-loading` e `.is-success`. 
Mientras tanto, CSS esconde lo no deseado usando `transform: translateY(100%)` (escondiendo todo en un "sótano" ficticio debajo del botón visible).

Copia en `style.css`:

```css
:root {
  --color-bg: #EAEAEA; --color-surface: #FFFFFF; --color-text: #111111; --color-muted: #71717A;
  --color-primary: #111111; --color-success: #10B981;
  --radius-btn: 99px; /* Botón Píldora redondo */
  --transition-smooth: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
  --transition-fast: 0.2s ease-in-out;
}

body { font-family: 'Inter', system-ui, sans-serif; background: var(--color-bg); color: var(--color-text); min-height: 100vh; display: grid; place-items: center; padding: 1rem; margin:0; }

/* LA TARJETA Base */
.product-card { background: var(--color-surface); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); width: 100%; max-width: 380px; }
.product-img-box { background: #F87171; width: 100%; height: 280px; position: relative; overflow: hidden; }
.product-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.product-card:hover .product-img { transform: scale(1.05); }

.product-info { padding: 2rem 1.5rem; text-align: center; }
.product-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 0.25rem; letter-spacing: -0.05em; }
.product-price { color: var(--color-muted); font-size: 1.1rem; font-weight: 600; margin-bottom: 1.5rem; }

/* -------------------------------------
   EL BOTÓN PRINCIPAL CART Y SUS ESTADOS
   ------------------------------------- */
.btn-cart {
  position: relative; width: 100%; height: 54px; /* Altura Fija Crucial para evitar rebotes molestos */
  background: var(--color-primary); color: white; border: none; border-radius: var(--radius-btn);
  font-family: inherit; font-size: 1rem; font-weight: 600; cursor: pointer;
  overflow: hidden; /* Corta la visibilidad de los "sótanos" y los extra-muros */
  transition: background-color var(--transition-fast), transform 0.1s;
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
}
.btn-cart:active:not(:disabled) { transform: scale(0.96); }
.btn-cart:disabled { cursor: not-allowed; }

/* Base para animaciones internas */
.icon { width: 20px; height: 20px; transition: all var(--transition-smooth); }
.btn-text { transition: all var(--transition-smooth); position: absolute; }


/* ESTADO 1: INICIAL POR DEFECTO (Activo al arrancar HTML) */
.btn-text--default { opacity: 1; transform: translateY(0); }
.icon-cart { position: absolute; right: 25%; opacity: 1; transform: translateX(0); }

/* ESTADO 2: EL SPINNER OCULTO */
.icon-spinner { position: absolute; opacity: 0; transform: scale(0); animation: rotate 1s linear infinite; animation-play-state: paused; }

/* ESTADO 3: ÉXITO OCULTO EN EL SÓTANO */
.btn-text--success { opacity: 0; transform: translateY(100%); color: white; }
.icon-check { position: absolute; right: 30%; opacity: 0; transform: scale(0); }


/* =======================================
   INYECTORES JS DE LOS ESTADOS MODERNOS
   ======================================= */

/* Cuando JS inyecta "is-loading" a la caja padre del boton... */
.btn-cart.is-loading { background: var(--color-muted); }
.btn-cart.is-loading .btn-text--default { opacity: 0; transform: translateY(-100%); } /* Sube al ático */
.btn-cart.is-loading .icon-cart { opacity: 0; transform: translateX(100%); } /* Huye a la derecha */
.btn-cart.is-loading .icon-spinner { opacity: 1; transform: scale(1); animation-play-state: running; } /* Nace en el centro */

/* Cuando JS inyecta "is-success" al padre... */
.btn-cart.is-success { background: var(--color-success); }
.btn-cart.is-success .icon-spinner { opacity: 0; transform: scale(0); }
.btn-cart.is-success .btn-text--success { opacity: 1; transform: translateY(0); } /* Ascensor Sótano -> Main Floor */
.btn-cart.is-success .icon-check { opacity: 1; transform: scale(1); }


@keyframes rotate { 100% { transform: rotate(360deg); } }
```

### Fase 3: Controlador de Tiempos y Asincronía (JavaScript)

El código de JS ya no se encarga de cambiar los píxeles (eso es cosa de CSS), se encarga **de gobernar los hilos del tiempo**. 
Poner bloqueos iniciales y cambiar la pegatina de CSS entre fases.

Pega este reloj asíncrono en `main.js`:

```javascript
const cartBtn = document.getElementById('addToCartBtn');

// Variables de estado interno para bloquear trampas
let isProcessing = false;

// Ojo a la palabra 'async', que nos permite parar el tiempo internamente
cartBtn.addEventListener('click', async () => {
  
  // 1. Doble Candado para los obsesos del click
  if (isProcessing) return; 
  isProcessing = true;
  cartBtn.setAttribute('disabled', 'true');
  
  // 2. Avisamos a CSS: Muestra el Spinner y oculta el Texto por Defecto.
  cartBtn.classList.add('is-loading');

  // 3. LA SIMULACIÓN DE INTERNET NEFASTA. 
  // Obligamos al código a parar en esta línea y esperar 1.5 segundos. 
  await new Promise(resolve => setTimeout(resolve, 1500));

  // 4. EL INTERNET HA LLEGADO: Avisamos a CSS de ÉXITO
  cartBtn.classList.remove('is-loading');
  cartBtn.classList.add('is-success');
  
  // 5. AUTOLIMPIEZA Y RESET. (Dejemos al usuario disfrutar el Verde 2.5s antes de borrarlo todo)
  setTimeout(() => {
    cartBtn.classList.remove('is-success');
    cartBtn.removeAttribute('disabled'); // Desplegamos el puente levadizo para permitir otra venta.
    isProcessing = false;
  }, 2500);

});
```

Usando los selectores anidados en CSS tipo `.btn-cart.is-loading .icon-spinner` en combinación con la simple orden `.classList.add()` de JS, has desbloqueado uno de los flujos de trabajo más potentes y mantenibles en el diseño UI interactivo contemporáneo. ¡Increíble!
