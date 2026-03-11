# Copiar al Portapapeles (Magia de un Clic) 📋

## 1. ¿Qué vamos a construir?
Vivimos en la era de la velocidad. Si un usuario tiene que seleccionar manualmente con el ratón un código de descuento de 16 caracteres, hacer clic derecho y darle a copiar... probablemente se equivoque, o peor, abandone la compra.
Toda web moderna necesita botones mágicos de "Copiar al portapapeles". 
Vamos a construir un Panel de Datos elegante donde cada fila tenga un botón. Al pulsarlo:
1. El texto se copiará silenciosamente en el sistema operativo del usuario.
2. El botón mostrará un feedback visual ("¡Copiado!") con una animación suave.
3. El botón volverá a su estado normal tras 2 segundos.

---

## 2. Conceptos Clave antes de empezar
*   **La API del Portapapeles (`navigator.clipboard`)**: JavaScript tiene acceso limitado al ordenador por motivos de seguridad. Sin embargo, los navegadores modernos nos abren una pequeña y segura "ventana" para inyectar texto directamente en el portapapeles del usuario usando `navigator.clipboard.writeText("hola")`.
*   **Asincronía (`async / await`)**: Escribir en la memoria de un ordenador lleva unos valiosos milisegundos. Y a veces puede fallar (si el usuario bloquea los permisos). Por eso, `writeText` devuelve una Promesa. Usaremos la pareja `async/await` para decirle a JS: *"Pausa aquí la ejecución de la función hasta que el Sistema Operativo me confirme que ha copiado el texto con éxito y luego sigue"*.
*   **Micro-interacciones y Pseudo-clases**: Un botón estático que no te avisa de si ha hecho su trabajo es frustrante. Usaremos CSS avanzado (`overflow: hidden` combinado con `transform: translateY`) para crear un efecto donde la palabra "Copied!" emerja desde el interior del botón desplazando a la palabra original "Copy".

---

## 3. Paso a paso

### Fase 1: El HTML y la arquitectura de Datos

Pensaremos la interfaz como una Caja (`.copy-card`) que contiene una Lista (`.copy-list`). Cada ítem de la lista será de tipo `.copy-item` y portará la información semántica a copiar (un código, un nombre, un ID...) junto a su respectivo botón ejecutor.

Fíjate muy bien en que cada `<button>` tiene un atributo oscuro llamado `data-target`. Este atributo personalizado (Data Attribute) es el que usaremos para decirle a JS: "Oye botón, cuando te cliquen, ve a buscar el contenido que hay dentro del ID que te indico".

Copia el HTML estructural en `index.html`:

```html
<header class="header">
  <div class="header-container">
    <div class="logo">CopyFlow<span style="color:var(--color-primary)">.</span></div>
  </div>
</header>

<main class="content">
  <!-- TARJETA BASE DE HERRAMIENTA DE COPIADO -->
  <section class="copy-card">
    
    <div class="section-header">
      <h1>Recursos del Alumno</h1>
      <p>Copia rápidamente los accesos y códigos necesarios para tus prácticas de clase. ¡Todo a un solo clic!</p>
    </div>

    <!-- LISTA ESTRUCTURAL DE PARES CLAVE/VALOR -->
    <div class="copy-list">
      
      <!-- Fila 1 -->
      <div class="copy-item">
        <div class="copy-info">
          <span class="copy-label">Email de Soporte</span>
          <code class="copy-value" id="email-text">ayuda@academia.com</code>
        </div>
        <!-- Enlace Vital: Este botón apunta al ID 'email-text' superior -->
        <button class="btn-copy" data-target="email-text" aria-label="Copiar email">
          <span class="btn-text">Copiar</span>
          <span class="btn-success">¡Copiado!</span>
        </button>
      </div>

      <!-- Fila 2 -->
      <div class="copy-item">
        <div class="copy-info">
          <span class="copy-label">Cupón Descuento</span>
          <code class="copy-value" id="coupon-text">FRONTEND-MASTER-25</code>
        </div>
        <!-- Enlace Vital: Este botón apunta al ID 'coupon-text' superior -->
        <button class="btn-copy" data-target="coupon-text" aria-label="Copiar código">
          <span class="btn-text">Copiar</span>
          <span class="btn-success">¡Copiado!</span>
        </button>
      </div>

      <!-- Fila 3 -->
      <div class="copy-item">
        <div class="copy-info">
          <span class="copy-label">Dirección Campus</span>
          <code class="copy-value" id="address-text">Calle de la Tecnología, 42, Hub Digital</code>
        </div>
        <!-- Enlace Vital: Este botón apunta al ID 'address-text' superior -->
        <button class="btn-copy" data-target="address-text" aria-label="Copiar dirección">
          <span class="btn-text">Copiar</span>
          <span class="btn-success">¡Copiado!</span>
        </button>
      </div>

    </div>

  </section>
</main>
```

### Fase 2: CSS y la Magia del Contenido Oculto

Aplicaremos CSS para dejar la lista bonita.
Pero la verdadera maravilla reside al final, en `.btn-copy`. En lugar de tener un botón que cambie de texto internamente con JS de forma agresiva, diseñamos el botón como un "escenario" (`position: relative; overflow: hidden;`). Dentro de este escenario ubicamos dos actores:
1. El texto neutro "Copy" (`.btn-text`).
2. El mensaje de euforia "Copied! en verde" (`.btn-success`), que está posicionado de forma absoluta por debajo del marco visible (`transform: translateY(100%)`).
Cuando JS inyecte la clase `.copied`, el CSS arrastrará hacia arriba la pastilla verde solapando completamente a la gris en unos gloriosos y orgánicos 0.3 segundos.

Transcribe `style.css`:

```css
:root { --color-bg: #F8FAFC; --color-surface: #FFFFFF; --color-text: #1E293B; --color-primary: #10B981; --color-accent: #6366F1; --color-border: #E2E8F0; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', system-ui, sans-serif; background-color: var(--color-bg); color: var(--color-text); line-height: 1.6; }

/* DECORACIÓN MACRO */
.header { background: white; padding: 1.5rem; border-bottom: 1px solid var(--color-border); }
.logo { font-size: 1.5rem; font-weight: 800; max-width: 600px; margin: 0 auto; color: #0F172A; }
.content { max-width: 600px; margin: 0 auto; padding: 4rem 1.5rem; }
.section-header { text-align: center; margin-bottom: 3rem; }

/* ========================================
   LA TARJETA Y LAS FILAS
   ======================================== */
.copy-card { background: var(--color-surface); padding: 2.5rem; border-radius: 20px; box-shadow: 0 4px 15px -1px rgba(0,0,0,0.05); border: 1px solid var(--color-border); }
.copy-list { display: flex; flex-direction: column; gap: 1.5rem; }

.copy-item { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; background: #F1F5F9; border-radius: 12px; border: 1px solid var(--color-border); transition: all 0.2s; }
.copy-item:hover { border-color: var(--color-accent); transform: scale(1.02); }

.copy-info { display: flex; flex-direction: column; }
.copy-label { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #64748B; margin-bottom: 0.25rem; }
.copy-value { font-family: 'Fira Code', monospace; font-size: 0.95rem; color: var(--color-text); font-weight: 600; }

/* ========================================
   DISEÑO AVANZADO: Micro-Animación del Botón
   ======================================== */
.btn-copy {
  /* Todo lo que sobresalga de este marco relativo será guillotinado por el hidden */
  position: relative;
  background: var(--color-accent); color: white; border: none; padding: 0.6rem 1.2rem;
  border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 0.85rem; overflow: hidden; transition: background 0.2s;
}

.btn-copy:active { transform: scale(0.95); }

/* PASTILLA VERDE DE ÉXITO */
.btn-success {
  /* Se coloca de manera absoluta tapando internamente de izquierda a derecha todo el botón */
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: var(--color-primary);
  display: flex; justify-content: center; align-items: center;
  /* Estado Reposo: Desplazado al 100% hacia abajo en el Eje Y (Es decir, invisible por el hidden padre) */
  transform: translateY(100%); 
  /* Un muelle animado y curvo muy atractivo para las subidas */
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* LA INYECCIÓN CLAVE DE JS DE ESTADO */
.btn-copy.copied .btn-success {
  /* Al entrar esta clase... la pastilla verde sube su posición a 0 (Totalmente centrada y visible) */
  transform: translateY(0); 
}

/* Transparencia opcional para borrar el texto subyacente de "Copy" mientras la verde sube */
.btn-copy.copied .btn-text { opacity: 0; }
.btn-text { transition: opacity 0.2s; }
```


### Fase 3: Pídele Permiso a la Máquina en JS

En nuestro código JS realizaremos un mapeo general de botones usando `forEach`.
A cada botón le asignaremos la responsabilidad de averiguar por sí mismo a quién tiene que copiar accediendo a su propio subdato `button.dataset.target`.
Y por último el golpe maestro: Como usamos una API que se comunica con el Hardware que usa promesas (`clipboard.writeText`), el interior de la función anónima del click tiene que ser obligatoriamente marcada con la palabra `async`. Solo así podremos usar internamente un `await` que congele la acción a la espera del éxito e injecte finalmente la clase `.copied` para activar el CSS verde.

Instala esta maquinaria asíncrona temporal en tu `main.js`:

```javascript
// Localizamos a todos los botones de la interfaz marcados con el rol ".btn-copy"
const copyButtons = document.querySelectorAll('.btn-copy');

// Inyectamos a todos a la vez sus responsabilidades
copyButtons.forEach(button => {

    // [ATENCIÓN] Marca obligatoria "async" porque usaremos métodos asíncronos del navegador.
    button.addEventListener('click', async () => {
        
        // 1. Extraemos el atributo personalizado data-target="X" del HTML para saber a qué ID buscar
        const targetId = button.dataset.target;
        // 2. Extraemos el contenido de la etiqueta encontrada con dicho ID
        const textToCopy = document.getElementById(targetId).textContent;

        // 3. Bloque Pragmático de Seguridad Try/Catch (Intenta/CapturaFallo) al invocar sistemas externos
        try {
            // ACCIÓN OFICIAL: Congela (await) la ejecución hasta que la API del Navegador confirme la copia.
            await navigator.clipboard.writeText(textToCopy);

            // FEEDBACK VISUAL: Enviamos el mandato a nuestra subrutina Helper
            showSuccess(button);
            
            console.log(`Contenido "${textToCopy}" copiado al portapapeles con éxito.`);
            
        } catch (err) {
            // Manejador en caso de que el usuario haya bloqueado permisos de copia en el navegador web
            console.error('Error crítico al intentar acceder al portapapeles del sistema.', err);
            alert('No se pudo copiar el contenido. Asegúrate de dar los permisos necesarios.');
        }
    });
});


/**
 * RUTINA AUXILIAR CSS TRIGGER
 */
function showSuccess(btn) {
    // Injectamos el gatillo al HTML, el CSS hace rebotar el bloque verde hacia arriba
    btn.classList.add('copied');

    // Despachador de tiempo interno. A los 2000 ms ejecutará su contenido interno:
    setTimeout(() => {
        // Retiramos el evento y el CSS deja caer el verde de nuevo.
        btn.classList.remove('copied');
    }, 2000);
}
```

Es hora de la verdad. Abre tu web, haz clic en el Email. Disfruta de la animación de subida `Copied!`. Abre una nueva pestaña, pega con `Ctrl+V` y alucina viendo que te has convertido en el maestro del Hardware y del UI orgánico a la vez. ¡Suma y Sigue!
