# Toasts Notifications (Notificaciones No Obstructivas) 🍞

## 1. ¿Qué vamos a construir?
¿Has notado esos pequeños "mensajes flotantes" que aparecen desde la esquina inferior de tu pantalla cuando guardas un archivo o te entra un correo nuevo? Se llaman **Toasts** (Tostadas, porque saltan de abajo hacia arriba como en una tostadora).

Vamos a crear un Sistema de Notificaciones dinámico. Serán cajones de colores que aparecerán al invocar una función, correrán una "cuenta atrás" mágica (barra de progreso) y se auto-destruirán sin que nosotros toquemos nada para mantener la pantalla limpia.

---

## 2. Conceptos Clave antes de empezar
*   **Adiós al `alert()`:** La ventanita horrible por defecto de los navegadores bloquea todo el ordenador e interrumpe agresivamente la tarea. Un "Toast" es el estándar moderno: informa pasivamente en una esquina y desaparece.
*   **Aparcamiento Fijo (Position: Fixed):** Da igual en qué lugar de la página estemos leyendo. Queremos que la notificación siempre nazca pegada sobre la pantalla. Construiremos un `Contenedor` transparente como HUD (Heads-Up Display) de videojuegos.
*   **El DOM Virtual (JS):** Esta es la primera vez que NO ocultamos cosas con un `hidden` estático. Con Javascript usaremos el superpoder `document.createElement` para "escupir" (Inyectar) código HTML de la nada según lo vayamos necesitando.

---

## 3. Paso a paso

### Fase 1: El Cuadro de Mandos y El "Aparcamiento" de Toasts (HTML)

Vamos a crear unos botones de "Consola" para disparar nuestros Toasts en modo de prueba. A estos botones les pondremos **Atributos de Datos Personalizados (`data-type` y `data-msg`)**. Estos atributos nos permitirán usar *una sola* función JavaScript para pintar de 4 formas diferentes en vez de escribir 4 funciones.

Y lo más importante de todo, al final del HTML, nuestro Contenedor transparente (`#toast-container`).

*(Utilizamos textos "Lorem Ipsum" estructurales en este laboratorio)*.

```html
<main class="control-panel">
  <header class="panel-header">
    <h1>Consola de Notificaciones</h1>
    <p>Prueba los diferentes tipos de alertas para entender cómo dar feedback al usuario.</p>
  </header>

  <!-- Botonera tipo "Panel de Control" para disparar los Toasts con JS -->
  <section class="action-buttons">
    <button class="btn btn--success" data-type="success" data-msg="¡Perfil actualizado con éxito!">Éxito</button>
    <button class="btn btn--error" data-type="error" data-msg="Error al conectar con el servidor.">Error</button>
    <button class="btn btn--warning" data-type="warning" data-msg="Tu suscripción expira pronto.">Aviso</button>
    <button class="btn btn--info" data-type="info" data-msg="Nuevas funciones disponibles.">Info</button>
  </section>
</main>

<!-- 
  El 'Aparcamiento' de Toasts transparente 
  A11y (ARIA): Le dice al lector de pantalla "Ve leyendo los 
  mensajes nuevos que salgan de aquí, pero sin prisa".
-->
<div class="toast-container" id="toast-container" aria-live="polite">
  <!-- Aquí dentro, JS insertará dinámicamente cada cajita <div class="toast"> nueva -->
</div>
```

### Fase 2: Choreografía de Animaciones y Semántica (CSS)

El color aporta contexto (Semántica). Crearemos tokens para un error (rojo), aviso (naranja) o éxito (verde).

Pero lo más potente serán nuestras animaciones (`@keyframes`). Tendremos un parto visual suave (de abajo a arriba) y sobre todo una **Bomba de Relojería** animada (`.toast-progress`) que menguará la barra inferior de 100% a 0% a lo largo de 4 segundos.

Añade esto a tu `style.css`:

```css
:root {
  --color-bg: #F8FAFC; --color-text: #1E293B; --color-surface: #FFFFFF; --color-border: #E2E8F0;
  
  /* Tokenc de Color Semántico */
  --color-success: #10B981; --color-error: #EF4444; --color-warning: #F59E0B; --color-info: #3B82F6;
  
  --toast-duration: 4000ms; /* Duración clavada para sincronizar CSS y JS */
}

body { font-family: 'Inter', system-ui, sans-serif; background: var(--color-bg); color: var(--color-text); display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }

/* Botones Falsos de Control */
.control-panel { text-align: center; padding: 2rem; }
.panel-header { margin-bottom: 3rem; }
.action-buttons { display: flex; gap: 1rem; justify-content: center; }
.btn { padding: 0.8rem 1.5rem; border-radius: 8px; font-weight: 600; border: none; cursor: pointer; color: white; transition: transform 0.2s; }
.btn:active { transform: scale(0.95); }
.btn--success { background: var(--color-success); }
.btn--error { background: var(--color-error); }
.btn--warning { background: var(--color-warning); color: #78350F; }
.btn--info { background: var(--color-info); }

/* EL APARCAMIENTO PRINCIPAL FIJO */
.toast-container {
  position: fixed; bottom: 2rem; right: 2rem;
  display: flex; flex-direction: column; gap: 1rem;
  z-index: 9999; pointer-events: none; /* Que el container invisible no bloquee clics en la web! */
}

/* -------------------------------------
   LA CAJA REAL DEL TOAST (Tostada)
   ------------------------------------- */
.toast {
  width: 320px; background: var(--color-surface); border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); padding: 1rem 1rem 1rem 1.25rem;
  position: relative; overflow: hidden; pointer-events: auto; /* Devolvemos el click */
  display: flex; align-items: flex-start; gap: 0.85rem;
  
  /* Animación de entrada inicial desde abajo de la pantalla */
  animation: slideInBottom 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}

/* Una pinza de color gordita a la izquierda para distinguirlo */
.toast::before {
  content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 5px;
  background-color: var(--theme-color); /* Usamos Variable Inyectada por la Modalidad */
}

/* Inyectar las variables de CSS cruzadas por Herencia del modificador */
.toast--success { --theme-color: var(--color-success); }
.toast--error { --theme-color: var(--color-error); }
.toast--warning { --theme-color: var(--color-warning); }
.toast--info { --theme-color: var(--color-info); }

.toast-icon { width: 24px; height: 24px; flex-shrink: 0; color: var(--theme-color); margin-top: 2px;}
.toast-content { flex-grow: 1; }
.toast-content h4 { font-size: 0.95rem; margin-bottom: 0.25rem; }
.toast-content p { color: #64748B; font-size: 0.85rem; line-height: 1.4; }

.toast-close { background: none; border: none; color: #94A3B8; font-size: 1.2rem; cursor: pointer; transition: 0.2s; }
.toast-close:hover { color: var(--color-text); }

/* LA BARRA ESPECTACULAR INFERIOR (Reloj de arena) */
.toast-progress {
  position: absolute; bottom: 0; left: 0; height: 3px; width: 100%;
  background-color: var(--theme-color); opacity: 0.7;
  /* Animación que empuja de Width=100 a Width=0% en exactamente 4000ms a vel constante (linear) */
  animation: progress var(--toast-duration) linear forwards;
}

/* -------------------------------------
   LA MAGIA DE ANIMACIÓN AÑADIDA
   ------------------------------------- */
@keyframes slideInBottom {
  from { transform: translateY(100%) scale(0.9); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

/* Esta clase se la añadiremos violentamente desde JS para forzar su muerte y expulsión CSS */
.toast--closing { animation: fadeOutRight 0.3s ease-in forwards; }

@keyframes fadeOutRight {
  to { transform: translateX(100%); opacity: 0; }
}

@keyframes progress {
  from { width: 100%; }
  to { width: 0%; }
}
```

### Fase 3: La Fábrica Asíncrona (JavaScript)

Esta vez no estamos encendiendo o apagando una luz. Estamos fabricando bombillas a mano usando el comando `document.createElement('div')` y metiéndoles iconos SVG gigantes dentro. Así podremos añadir infinitos Toasts desde cualquier rincón de nuestra Web sin haber escrito 400 líneas HTML en el archivo inicial.

Pega este motor constructor en `main.js`:

```javascript
const toastContainer = document.getElementById('toast-container');
const DURATION = 4000; 

// Librería Visual en Texto Plano (Dibujaremos el SVG a martillazos en HTML)
const icons = {
  success: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11V12A10 10 0 1 1 16 2.8"></path><polyline points="22 4 12 14 9 11"></polyline></svg>`,
  error: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
  warning: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.3 3.9L1.8 18A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12" y2="17"></line></svg>`,
  info: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="8"></line></svg>`
};

const titles = {
  success: "Operación Exitosa",
  error: "Error del Sistema",
  warning: "Atención",
  info: "Notificación"
};

// -----------------------------------------------------------
// 1. LA FÁBRICA (Dios creando el DOM de la Nada)
// -----------------------------------------------------------
function createToast(type, message) {
  
  // A. Crea las "paredes maestras de cristal" en código, no en pantalla aún.
  const toastElement = document.createElement('div');
  
  // Le atiza los modificadores BEM CSS de color
  toastElement.classList.add('toast', `toast--${type}`);

  // B. Rellena las tripas usando nuestro catálogo diccionario de arriba (Template Literals)
  toastElement.innerHTML = `
    ${icons[type]}
    <div class="toast-content">
      <h4>${titles[type]}</h4>
      <p>${message}</p>
    </div>
    <button class="toast-close">&times;</button>
    <div class="toast-progress"></div>
  `;

  // C. EL PARTO AL MUNDO REAL VISUAL: Lo incrustamos en su Aparcamiento lateral
  toastContainer.appendChild(toastElement);

  // D. ⏲️ LA BOMBA DE RELOJERÍA (Se autodestruye en 4s limpiando nuestra RAM)
  const autoDestroyTimer = setTimeout(() => {
    removeToast(toastElement); 
  }, DURATION);

  // E. BOTÓN MANUAL de SALVAMENTO: Si no quieres esperar los 4s, pulsas la 'x'.
  const closeBtn = toastElement.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    clearTimeout(autoDestroyTimer); // Cancela la Bomba principal de JS
    removeToast(toastElement); // Actívalo tú manualmente ya mismo.
  });
}

// -----------------------------------------------------------
// 2. LA FUNCIÓN DE DESTRUCCIÓN FÍSICA Y VISUAL
// -----------------------------------------------------------
function removeToast(toastElement) {
  // A. Activamos la animación de muerte bonita de CSS (Deslizar derecha difuminado).
  toastElement.classList.add('toast--closing');
  
  // B. Peeeeero, esperamos 300ms a que la animación de CSS termine y lo borramos de memoria TOTAL
  setTimeout(() => {
    toastElement.remove(); // Esta API mata la etiqueta desde la Raíz del servidor del Navegador
  }, 300);
}


// -----------------------------------------------------------
// 3. ENLAZAR CON LOS BOTONES DE PRUEBA 
// -----------------------------------------------------------
const triggerButtons = document.querySelectorAll('.action-buttons .btn');

// Bucle forEach: "A todos mis botones les enchufas un receptor de ratón"
triggerButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Al clicar, escaneamos los metadatos HTML5 personalizados para saber de qué calaña es...
    const type = btn.getAttribute('data-type');
    const message = btn.getAttribute('data-msg');
    
    // Y corremos la cinta de la fábrica
    createToast(type, message);
  });
});
```

Aprender la diferencia de empatía entre cortar de golpe con JS `toastElement.remove()` a lo bestia vs. dejarle 300ms de `setTimeout` tras invocar una clase de CSS Final Animada es la **Magia Real del FrontEnd Moderno**. ¡El mundo en 60FPS!
