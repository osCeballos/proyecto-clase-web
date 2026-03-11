# Modales Nativos con la API `<dialog>` 🪟

## 1. ¿Qué vamos a construir?
Es hora de tirar a la basura años de código spaghetti para crear ventanas emergentes. Olvídate de los complejos `div` superpuestos, del cálculo de `z-index`, y de pelearte con Javascript para que el tabulador no se escape o para que te funcione la tecla "Escape".
Vamos a invocar el súper-poderoso elemento nativo de HTML5 `<dialog>`.
Crearemos dos componentes clave usando la misma base: Un **Modal Central** clásico (para Iniciar Sesión) y un **Modal Off-canvas** (un panel deslizable lateral tipo "Cesta de la compra").

---

## 2. Conceptos Clave antes de empezar
*   **El Top Layer:** Cuando abres un `<dialog>` a través de Javascript usando su método `.showModal()`, el navegador lo arranca de tu HTML normal y lo "teletransporta" a una capa especial y exclusiva llamada *Top Layer* (La capa Rey). Quedará por encima de absolutamente todo, sin importar si has puesto otros botones piratas con `z-index: 9999999`.
*   **Backdrop Filter:** HTML5 nos regala el pseudo-elemento `::backdrop` para pintar el área sobrante (el "aire" de detrás del modal). Le daremos un difuminado (`blur`) acristalado y oscuro, aplicando el estilo Glassmorphism que usa Apple o Microsoft.
*   **Animación `@starting-style`:** Las ventanas emergentes pasan de `display: none` a `display: block` de golpe. En CSS clásico, eso destruye cualquier animación. Con el modernísimo `@starting-style` que estalló en 2024, podremos por fin dotarlos de un nacimiento y cierre animado, suave y orgánico ("Boing" de apertura).

---

## 3. Paso a paso

### Fase 1: El HTML (Limpieza extrema)

Vamos a tener un Header superior con dos simples botones de llamada (Triggers). Y luego, dos `<dialog>` independientes. Presta atención a cómo, de gratis, un botón de tipo `submit` dentro de un formulario con `method="dialog"` sabe automáticamente que lo que debe hacer es mandar la información contenida en sus inputs y destruir la ventana modal el solito sin que haya que pedírselo.

Copia en `index.html`:

```html
<header class="navbar">
  <div class="navbar-container">
    <div class="logo">StudioPro<span style="color: var(--color-primary)">.</span></div>
    
    <div class="nav-actions">
      <!-- BOTONES INVOCADORES -->
      <button type="button" class="btn btn-ghost" id="btn-login" aria-haspopup="dialog" aria-controls="modal-login">
        Acceder
      </button>
      <button type="button" class="btn btn-primary" id="btn-cart" aria-haspopup="dialog" aria-controls="modal-cart">
        Cesta (3)
      </button>
    </div>
  </div>
</header>

<!-- ==========================================
      1. MODAL CENTRAL TIPO A
      ========================================== -->
<dialog class="modal-dialog modal-center" id="modal-login" aria-labelledby="login-title">
  
  <div class="modal-header">
    <h2 id="login-title">Iniciar Sesión</h2>
    <button type="button" class="btn-close" aria-label="Cerrar ventana" data-close-modal>✕</button>
  </div>

  <div class="modal-body">
    <p class="modal-desc">Accede a tu panel de control para gestionar tus proyectos y descargar tus recursos exclusivos.</p>
    
    <!-- El Formulario destructor Automático -->
    <form class="demo-form" method="dialog">
      <div class="form-group">
        <label for="email">Correo</label>
        <input type="email" id="email" required>
      </div>
      <button type="submit" class="btn btn-primary w-full mt-4">Entrar</button>
    </form>
  </div>
</dialog>

<!-- ==========================================
      2. MODAL OFFCANVAS TIPO B (Panel Lateral)
      ========================================== -->
<dialog class="modal-dialog modal-offcanvas" id="modal-cart" aria-labelledby="cart-title">
  
  <div class="modal-header">
    <h2 id="cart-title">Tu Cesta</h2>
    <button type="button" class="btn-close" aria-label="Cerrar cesta" data-close-modal>✕</button>
  </div>

  <div class="modal-body cart-body">
    <div class="cart-items">
      <div class="cart-item">
        <div class="img-mockup"></div>
        <div>
          <h4>Diseño de Marca (Premium)</h4>
          <p>145.00 €</p>
        </div>
      </div>
    </div>
  </div>
  
  <div class="modal-footer">
    <button type="button" class="btn btn-primary w-full" data-close-modal>Pagar</button>
  </div>
</dialog>
```

### Fase 2: CSS (Cristal Esmerilado y Animación Estelar)

Atención a la directiva `allow-discrete`. Por fin podemos decirle a una transición: "Amortigua tranquilamente las propiedades raras que normalmente suceden de golpe (como display none o block)". Gracias a eso y a su `@starting-style` obtenemos transiciones cremosas.

Pega este bloque nuclear al final de tu archivo en `style.css`:

```css
:root { --color-bg: #F8FAFC; --color-surface: #FFFFFF; --color-text: #0F172A; --color-text-muted: #64748B; --color-primary: #10B981; --color-border: #E2E8F0; --shadow-modal: 0 25px 50px -12px rgba(0,0,0,0.25); }

/* RESET GENÉRICO DE UTILIY-CLASSES MÍNIMO (Míralo entero en tu archivo base) */
.btn { padding: 0.5rem 1rem; border-radius: 8px; font-weight: 600; cursor: pointer; border: none; font-family: inherit; }
.btn-primary { background: var(--color-text); color: white; }
.btn-ghost { background: transparent; color: var(--color-text); border: 1px solid var(--color-border); }
.w-full { width: 100%; }

/* ========================================
   REGLAS MADRE DEL DIALOG NATIVO
   ======================================== */
.modal-dialog {
  border: none; background: var(--color-surface); color: var(--color-text);
  box-shadow: var(--shadow-modal); padding: 0; margin: auto; /* Autocentrado perfecto */
}

/* EL AIRE OSCURO DIFUMINADO DE DETRÁS (BACKDROP) */
.modal-dialog::backdrop {
  background-color: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px); /* Cristal efecto iOS */
  -webkit-backdrop-filter: blur(4px);
}

.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid var(--color-border); }
.btn-close { background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--color-text-muted); width: 32px; height: 32px; border-radius: 6px; }
.modal-body { padding: 1.5rem; }

/* ========================================
   MODAL TIPO A: CENTRAL ANIMADO SCALED
   ======================================== */
.modal-center {
  width: 90%; max-width: 420px; border-radius: 16px;
  
  /* ESTADO CERRADO ANIMABLE */
  opacity: 0; transform: scale(0.95);
  transition: opacity 0.3s ease, transform 0.3s ease, display 0.3s ease allow-discrete;
}

/* ESTADO ABIERTO (Puesto por HTML al hacer .showModal()) */
.modal-center[open] { opacity: 1; transform: scale(1); }

/* ANIMAR LA LLEGADA DEL VELO NEGRO TRASERO */
.modal-center::backdrop { opacity: 0; transition: opacity 0.3s ease, display 0.3s ease allow-discrete; }
.modal-center[open]::backdrop { opacity: 1; }

/* MOMENTO DEL NACIMIENTO PURISTA */
@starting-style {
  .modal-center[open] { opacity: 0; transform: scale(0.95); }
  .modal-center[open]::backdrop { opacity: 0; }
}

/* ========================================
   MODAL TIPO B: OFFCANVAS LATERAL
   ======================================== */
.modal-offcanvas {
  height: 100dvh; max-height: 100dvh; width: 90%; max-width: 400px;
  
  /* Se arranca del centro nativo, y se imanta a la pared derecha */
  margin: 0 0 0 auto; border-radius: 24px 0 0 24px;
  display: flex !important; flex-direction: column;
  
  transform: translateX(100%);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), display 0.4s allow-discrete;
}

.modal-offcanvas[open] { transform: translateX(0); }
.modal-offcanvas::backdrop { opacity: 0; transition: opacity 0.4s ease allow-discrete; }
.modal-offcanvas[open]::backdrop { opacity: 1; }

@starting-style {
  .modal-offcanvas[open] { transform: translateX(100%); }
  .modal-offcanvas[open]::backdrop { opacity: 0; }
}

.cart-body { flex-grow: 1; overflow-y: auto; }
.modal-footer { padding: 1.5rem; border-top: 1px solid var(--color-border); }
```

### Fase 3: Javascript (La Invocación Limpia)

No vas a usar ni un solo "Focus Trap". Ni vas a escuchar el teclado apretar "Escape" para saber qué hacer. TODO eso viene regalado nativamente. Te quedarás de piedra.
Lo único que sí te obligaré a programar, porque a los capos de JavaScript se les olvidó añadir, es: Que si pulsas con el ratón el "aire negro de fondo" (Backdrop), el navegador lo interprete como Cerrar, sin forzarte a llevar el ratón a pulso e impactar en el micro-botón de "la equis" (✕). Esto es fundamental. 

Vuelca esto en `main.js`:

```javascript
const btnLogin = document.getElementById('btn-login');
const modalLogin = document.getElementById('modal-login');
const btnCart = document.getElementById('btn-cart');
const modalCart = document.getElementById('modal-cart');
const closeButtons = document.querySelectorAll('[data-close-modal]');

// 1. INVOCAR API NATIVA
btnLogin.addEventListener('click', () => { modalLogin.showModal(); });
btnCart.addEventListener('click', () => { modalCart.showModal(); });

// 2. DISPARADORES DE CIERRE GENÉRICOS (Encontramos de quién era la 'X' pulsada).
closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const dialogMaster = e.target.closest('dialog');
        if(dialogMaster) dialogMaster.close();
    });
});

// 3. UX PATCH: CERRAR PULSANDO EL FONDO (Aire Negro)
// Como el <dialog> envuelve tanto al cuadrado blanco como a su aire negro que emite (backdrop)
// Usamos "GetBoundingClientRect" para que nos imprima dónde están las esquinas del rectángulo blanco físico.
// Si pinchamos algo que queda matemáticamente "fuera" del encuadre blanco... entonces estamos pisando el negro=Cierra.
const handleBackdropClick = (event) => {
    const dialog = event.currentTarget; 
    const rect = dialog.getBoundingClientRect(); 
    
    // Test de Colisión Exacta
    const isInDialog = (
      rect.top <= event.clientY && 
      event.clientY <= rect.top + rect.height && 
      rect.left <= event.clientX && 
      event.clientX <= rect.left + rect.width
    );
        
    if (!isInDialog) dialog.close();
};

modalLogin.addEventListener('click', handleBackdropClick);
modalCart.addEventListener('click', handleBackdropClick);
```

¡Disfruta enseñando el futuro a los alumnos! Con esto has ahorrado horas de librerías inmensas a tus desarrolladores.
