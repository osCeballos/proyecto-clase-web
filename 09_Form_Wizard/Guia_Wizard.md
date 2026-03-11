# Construyendo un Wizard (Formulario por Pasos) 🪄

## 1. ¿Qué vamos a construir?
¿Te has fijado en que cuando compras un billete de avión o creas una cuenta bancaria online no te piden los 50 datos de golpe? Te los piden en fases: "1. Datos", "2. Asiento", "3. Pago". 

Esto reduce la carga cognitiva. Un formulario de 15 campos parece interminable, pero 3 pasos de 5 campos parecen rápidos de llenar. Crearemos la "ilusión" de múltiples páginas ocultando y mostrando trozos de HTML con Javascript. 

---

## 2. Conceptos Clave antes de empezar
*   **SPA (Single Page Application):** Todo ocurre en el mismo archivo `index.html`. No viajamos a una "página 2". Simplemente apagamos la visibilidad del Paso 1 e iluminamos el Paso 2. Es como un escenario de teatro cambiando el decorado entre actos.
*   **Gestión de Estado (State):** Javascript, como un "maestro de ceremonias", solo necesita recordar un número: `let currentStep = 1;`. Si es 2, oculta el paso 1 y 3.
*   **Checkbox Hack:** Los botones cuadrados de toda la vida (`checkbox`) los pinta directamente Windows o Mac y son inmodificables, "están atornillados al sistema". Aprenderemos el truco ninja de ocultarlos visualmente de la pantalla, dibujar nosotros un cuadrado falso (`<span>`) y vincularlos.

---

## 3. Paso a paso

### Fase 1: La Barra de Progreso y los Paneles Ocultos (HTML)

Arriba pondremos un navegador (Stepper) que diga por qué paso vamos. Abajo crearemos los 3 grupos de campos (`<fieldset>`). Dejaremos el primero invisible y le pondremos a los dos últimos un `hidden` en el HTML para que nazcan apagados. 

*(Usaremos contenido "Lorem Ipsum" para centrarnos en la mecánica).*

Copia la estructura en `index.html`:

```html
<main class="wizard-container">
  <div class="wizard-card">
    
    <!-- BARRA DE PROGRESO GLOBAL (Stepper) -->
    <nav class="stepper" aria-label="Progreso del formulario">
      <ul class="stepper-list">
        <!-- Paso 1: Activo por defecto -->
        <li class="step step--active" data-step="1" aria-current="step">
          <div class="step-circle">1</div>
          <span class="step-label">Cuenta</span>
        </li>
        <li class="step-line" aria-hidden="true"></li>
        
        <!-- Paso 2 -->
        <li class="step" data-step="2">
          <div class="step-circle">2</div>
          <span class="step-label">Perfil</span>
        </li>
        <li class="step-line" aria-hidden="true"></li>
        
        <!-- Paso 3 -->
        <li class="step" data-step="3">
          <div class="step-circle">3</div>
          <span class="step-label">Finalizar</span>
        </li>
      </ul>
    </nav>

    <!-- EL MEGA-FORMULARIO -->
    <form id="wizard-form" novalidate>
      
      <!-- PANEL 1 -->
      <fieldset class="wizard-panel panel--active" id="panel-1">
        <legend class="sr-only">Paso 1: Información de cuenta</legend>
        <div class="panel-header">
          <h2>Información de Cuenta</h2><p>Indica tus datos básicos para empezar.</p>
        </div>
        <div class="form-group">
          <label for="username">Nombre de Usuario</label>
          <input type="text" id="username" class="form-input" placeholder="Ej: disenador_creativo" required>
        </div>
        <div class="form-group">
          <label for="user-email">Correo Electrónico</label>
          <input type="email" id="user-email" class="form-input" placeholder="tu@email.com" required>
        </div>
      </fieldset>

      <!-- PANEL 2 (Oculto) -->
      <fieldset class="wizard-panel" id="panel-2" hidden>
        <legend class="sr-only">Paso 2: Perfil Profesional</legend>
        <div class="panel-header">
          <h2>Perfil Profesional</h2><p>Queremos conocerte un poco mejor.</p>
        </div>
        <div class="form-group">
          <label for="role">¿Cuál es tu especialidad?</label>
          <select id="role" class="form-input" required>
            <option value="" disabled selected>Selecciona una opción...</option>
            <option value="1">Diseño UI/UX</option>
            <option value="2">Desarrollo Frontend</option>
          </select>
        </div>
      </fieldset>

      <!-- PANEL 3 (Oculto) -->
      <fieldset class="wizard-panel" id="panel-3" hidden>
        <legend class="sr-only">Paso 3: Confirmación</legend>
        <div class="panel-header">
          <h2>Finalizar Registro</h2><p>Acepta los términos para completar el proceso.</p>
        </div>
        <div class="form-group checkbox-group">
          <label class="custom-checkbox-container">
            <!-- CHECKBOX REAL (se esconderá) -->
            <input type="checkbox" id="terms" class="sr-only-input" required>
            <!-- CHECKBOX DIBUJADO A MANO -->
            <span class="custom-checkbox" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </span>
            <div class="checkbox-text">
              <strong>Términos y Condiciones</strong><p>He leído y acepto la política de privacidad del curso.</p>
            </div>
          </label>
        </div>
      </fieldset>

      <!-- CONSOLA DE MANDOS (Atrás y Adelante) -->
      <div class="wizard-controls">
        <button type="button" class="btn btn-secondary" id="btn-prev" hidden>Anterior</button>
        <div class="spacer"></div> 
        <button type="button" class="btn btn-primary" id="btn-next">Siguiente</button>
        <button type="submit" class="btn btn-success" id="btn-submit" hidden>Completar Registro</button>
      </div>

    </form>
  </div>
</main>
```

### Fase 2: Magia Visual y el Checkbox Hack (CSS)

Vamos a iluminar en Azul el circulo `[1]` si estamos en el panel activo. Añadiremos el misterioso truco CSS para enlazar el Estado del CheckBox Oculto al Checkbox Pintado a través del Selector Adyacente `+`: *Seleccioname el hermano que tienes inmediatamente a tu derecha*.

Copia este CSS estilizado a `style.css`:

```css
:root {
  --color-bg: #E2E8F0; --color-surface: #FFFFFF; --color-text: #0F172A; 
  --color-muted: #64748B; --color-border: #CBD5E1;
  --color-primary: #3B82F6; --color-success: #10B981;
}

body { font-family: 'Inter', system-ui, sans-serif; background: var(--color-bg); color: var(--color-text); display: flex; justify-content: center; min-height: 100vh; margin:0;}

.wizard-container { width: 100%; max-width: 550px; padding: 1.5rem; }
.wizard-card { background: var(--color-surface); border-radius: 16px; padding: 2.5rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); overflow: hidden; }

/* NAVEGADOR SUPERIOR */
.stepper-list { list-style: none; display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; padding:0;}
.step { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; z-index: 2; }
.step-circle { width: 36px; height: 36px; border-radius: 50%; border: 2px solid var(--color-border); background: var(--color-surface); color: var(--color-muted); display: flex; align-items: center; justify-content: center; font-weight: 700; transition: 0.3s; }
.step-label { font-size: 0.8rem; font-weight: 600; color: var(--color-muted); text-transform: uppercase; }
.step-line { flex-grow: 1; height: 2px; background: var(--color-border); margin-top: -18px; z-index: 1; transition: 0.3s; }

/* Estados del navegador */
.step--active .step-circle { border-color: var(--color-primary); background: var(--color-primary); color: white; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15); }
.step--active .step-label { color: var(--color-primary); }
.step--done .step-circle { border-color: var(--color-primary); color: var(--color-primary); }
.step-line.line--filled { background: var(--color-primary); }

/* PANELES DE FORMULARIO */
fieldset { border: none; margin:0; padding:0; min-width:0; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }

.panel-header { margin-bottom: 2rem; }
.panel-header h2 { font-size: 1.5rem; margin-bottom: 0.25rem; }
.panel-header p { color: var(--color-muted); font-size: 0.95rem; }

.form-group { margin-bottom: 1.25rem; }
.form-group label:not(.custom-checkbox-container) { display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 0.4rem; }
.form-input { width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--color-border); border-radius: 8px; font-family: inherit; font-size: 1rem; outline: none; transition: 0.3s; }
.form-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15); }

/* EL TRUCO DEL CHECKBOX (Magia CSS) */
.sr-only-input { position: absolute; opacity: 0; width:0; height:0;}
.custom-checkbox-container { display: flex; gap: 1rem; padding: 1rem; border: 1px solid var(--color-border); border-radius: 8px; cursor: pointer; transition: 0.3s; }
.custom-checkbox-container:hover { background: #F8FAFC; }
.custom-checkbox { width: 24px; height: 24px; flex-shrink: 0; border: 2px solid var(--color-border); border-radius: 6px; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
.custom-checkbox svg { width: 14px; height: 14px; opacity: 0; transform: scale(0.5); transition: 0.3s; }

/* El momento estelar: Hermano (+) Checked */
.sr-only-input:checked + .custom-checkbox { background: var(--color-primary); border-color: var(--color-primary); }
.sr-only-input:checked + .custom-checkbox svg { opacity: 1; transform: scale(1); }
.sr-only-input:focus + .custom-checkbox { box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2); }

.checkbox-text strong { display: block; font-size: 0.95rem; color: var(--color-text); }
.checkbox-text p { font-size: 0.85rem; color: var(--color-muted); }

/* BOTONES INFERIORES Y ANIMACIONES */
.wizard-controls { display: flex; justify-content: space-between; margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid #E2E8F0; }
.spacer { flex-grow: 1; }
.btn { padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; border: none; transition: 0.3s;}
.btn-secondary { background: var(--color-surface); color: var(--color-muted); border: 1px solid var(--color-border); }
.btn-primary { background: var(--color-primary); color: white; }
.btn-success { background: var(--color-success); color: white; }

.wizard-panel { animation: slideFadeIn 0.4s ease-out; }
@keyframes slideFadeIn { from { opacity: 0; transform: translateX(15px); } to { opacity: 1; transform: translateX(0); } }
```

### Fase 3: El Gestor de Estados Visual (JavaScript)

El guion consiste en una variable `currentStep` que dice en qué página estamos (1, 2 o 3).
Cada vez que el usuario hace click a "Siguiente": Comprobamos que esa página tenga los "required" rellenos (usando `validity.valid`), y si es así, sumamos 1 a `currentStep` y redibujamos los bloques visuales con nuestra orden a CSS. 

Pega este esqueleto lógico en `main.js`:

```javascript
// La Mente de la Aplicación
let currentStep = 1;         
const TOTAL_STEPS = 3; 

// Reparto de Actores principales
const form = document.getElementById('wizard-form');
const panels = document.querySelectorAll('.wizard-panel');
const stepNodes = document.querySelectorAll('.step');
const stepLines = document.querySelectorAll('.step-line');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const btnSubmit = document.getElementById('btn-submit');

// -----------------------------------------------------------
// 1. LA FUNCIÓN MÁGICA: Pinta el HTML en base a un número
// -----------------------------------------------------------
function showStep(stepIndex) {
  
  // A. Encender y apagar Fieldsets centrales
  panels.forEach((panel, index) => {
    // Los arrays (.forEach) empiezan a contar en 0. Por eso "index + 1" compensa matemáticas
    if (index + 1 === stepIndex) {
      panel.removeAttribute('hidden');
      panel.classList.add('panel--active');
    } else {
      panel.setAttribute('hidden', 'true');
      panel.classList.remove('panel--active');
    }
  });

  // B. Colorear el navegador de progreso superior
  stepNodes.forEach((node, index) => {
    const nodeStepNumber = index + 1;
    // Pincel en blanco por defecto
    node.classList.remove('step--active', 'step--done');
    node.removeAttribute('aria-current');

    if (nodeStepNumber === stepIndex) {
      node.classList.add('step--active'); // Círculo Azul de PRESENTE
      node.setAttribute('aria-current', 'step');
    } else if (nodeStepNumber < stepIndex) {
      node.classList.add('step--done');   // Círculo Azul delineado de PASADO
    }
  });

  // Rellenar tuberías entre círculos que han quedado atrás
  stepLines.forEach((line, index) => {
    if (index + 1 < stepIndex) line.classList.add('line--filled');
    else line.classList.remove('line--filled');
  });

  // C. Esconder los botones según en qué muro de cristal estemos
  if (stepIndex === 1) btnPrev.setAttribute('hidden', 'true');
  else btnPrev.removeAttribute('hidden');

  if (stepIndex === TOTAL_STEPS) {
    btnNext.setAttribute('hidden', 'true');
    btnSubmit.removeAttribute('hidden');
  } else {
    btnNext.removeAttribute('hidden');
    btnSubmit.setAttribute('hidden', 'true');
  }
}

// -----------------------------------------------------------
// 2. FUNCIÓN GUARDAESPALDAS: Evitar que avancen vacíos
// -----------------------------------------------------------
function validateCurrentPanel() {
  const currentPanel = document.getElementById(`panel-${currentStep}`);
  // Dame los input y select OBLIGATORIOS del panel activo
  const requiredInputs = currentPanel.querySelectorAll('input[required], select[required]');
  
  let isValid = true;
  
  requiredInputs.forEach(input => {
    if (!input.validity.valid) { // API NATIVA Javascript de Validación de HTML
      isValid = false;
      input.reportValidity(); // Tira la sacudida de error roja de CSS por defecto
    }
  });
  
  return isValid; // Boleano: Gira la llave o No gira
}

// -----------------------------------------------------------
// 3. EVENTOS: Pulsar Botones
// -----------------------------------------------------------

btnNext.addEventListener('click', () => {
  if (validateCurrentPanel()) {  // Si la llave de Guardaespaldas gira
    currentStep++; // Súmame 1 al estado global
    showStep(currentStep); // Redibuja todo con ese nuevo número
  }
});

btnPrev.addEventListener('click', () => {
  currentStep--; // Quítame 1. No preguntes, déjale volver atrás fácil.
  showStep(currentStep);
});

form.addEventListener('submit', (e) => {
  e.preventDefault(); 
  
  if (validateCurrentPanel()) {
    alert("¡Registro completado con éxito! Bienvenido a la plataforma. 🚀");
    form.reset();
    currentStep = 1;
    showStep(1); // Vuelta a empezar el juego
  }
});

// ¡Arrancar el Motor Inicial!
showStep(currentStep);
```

¡Excelente trabajo! Has construido una *Single Page Application* en crudo. Entendiendo este concepto de separar el "Estado Matemático" (qué número toca) de la "Función Teatral" (`showStep()` dibujando el número), acabas de comprender la pieza clave que mueve las grandes arquitecturas Frontend como **React** o **Angular**.
