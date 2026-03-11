# Construyendo un Formulario Amigable (Validación UX) 📝

## 1. ¿Qué vamos a construir?
Rellenar un formulario es, muchas veces, la parte más frustrante para un usuario. Si lo hace mal, a menudo la web se recarga y borra todo, o le grita en rojo con alertas confusas.

Vamos a construir un **Formulario de Registro con Validación en Vivo**. Aplicaremos las mejores reglas de UX (Experiencia de Usuario) modernas:
1. No reñiremos al usuario *mientras* está escribiendo.
2. Si comete un error, se lo perdonaremos *en directo* en cuanto lo arregle (sin esperar al final de todo).
3. Añadiremos validaciones accesibles para personas con problemas de visión y un botón gamificado que se enciende cuando "las dos llaves giran".

---

## 2. Conceptos Clave antes de empezar
*   **Novality (HTML):** Los navegadores traen globitos de error por defecto que son feos y no encajan con nuestro diseño. Usaremos `<form novalidate>` para apagar al navegador y tomar el control total con Javascript.
*   **A11y (ARIA Attributes):** Usaremos atributos invisibles que los lectores de pantallas entienden como: `aria-invalid` ("¡Este campo tiene un error!") y `aria-live` ("Lee este párrafo de error en voz alta ahora mismo").
*   **Eventos de Intención:** Aprender a usar `blur` (El usuario ha terminado y ha salido del input) y distinguirlo de `input` (El usuario está tecleando letra a letra).

---

## 3. Paso a paso

### Fase 1: La estructura (HTML) Semántica y Accesible

Vamos a crear dos bloques principales: Correo y Contraseña. Fíjate muy bien en cómo el `<label for="email">` enlaza sí o sí con el `id="email"` del input. Si clicas en el label, te meterá dentro del campo de texto. Usamos textos "Lorem Ipsum" estructurales para no despistarnos.

Copia esto en tu `index.html`:

```html
<main class="form-container">
  <div class="form-card">
    <header class="form-header">
      <h1>Únete a la Comunidad</h1>
      <p>Crea tu cuenta en pocos segundos y empieza a construir proyectos increíbles.</p>
    </header>

    <!-- 'novalidate' apaga la validación fea por defecto del navegador -->
    <form id="register-form" novalidate autocomplete="off">
      
      <!-- Bloque 1: EMAIL -->
      <div class="form-group">
        <label for="email" class="form-label">Correo Electrónico</label>
        <div class="input-wrapper">
          <input 
            type="email" id="email" class="form-input" 
            placeholder="hola@tudominio.com"
            aria-invalid="false" aria-describedby="email-error">
          <span class="icon-status" aria-hidden="true"></span>
        </div>
        <!-- Este párrafo leerá el error en tiempo real (polite) a usuarios ciegos -->
        <p class="error-text" id="email-error" aria-live="polite"></p>
      </div>

      <!-- Bloque 2: CONTRASEÑA -->
      <div class="form-group">
        <label for="password" class="form-label">Contraseña Segura</label>
        <div class="input-wrapper">
          <input 
            type="password" id="password" class="form-input" 
            placeholder="Mínimo 8 caracteres"
            aria-invalid="false" aria-describedby="password-error">
          
          <!-- Micro-Interacción del Ojo -->
          <button type="button" id="toggle-password" class="btn-toggle-pwd" aria-label="Mostrar contraseña">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
          </button>
        </div>
        
        <p class="error-text" id="password-error" aria-live="polite"></p>
        
        <!-- Gamificación: Viñetas visuales que se tacharán de verde -->
        <ul class="pwd-rules">
          <li id="rule-length" class="rule">Mínimo 8 caracteres</li>
          <li id="rule-number" class="rule">Al menos un número</li>
        </ul>
      </div>

      <!-- El Guardián de la Puerta (Botón apagado por defecto) -->
      <button type="submit" class="btn-submit" id="btn-submit" disabled>Crear Cuenta</button>
    </form>
  </div>
</main>
```

### Fase 2: Estados Semánticos y Diseño Seguro (CSS)

El color no solo hace que algo se vea bonito, transmite significado. Usaremos variables rojas `--color-error` para cosas malas y `--color-success` para buenas. Lo inyectaremos cambiando clases dinámicas (`.is-invalid`, `.is-valid`) desde Javascript.

Copia estos estilos limpios a tu `style.css`:

```css
:root {
  --color-bg: #F9FAFB; --color-text: #1F2937; --color-muted: #6B7280;
  --color-surface: #FFFFFF; --color-border: #D1D5DB;
  --color-primary: #4F46E5; 
  --color-error: #EF4444; --color-error-bg: #FEF2F2;
  --color-success: #10B981; --color-success-bg: #ECFDF5;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  background-color: var(--color-bg); color: var(--color-text);
  display: flex; align-items: center; justify-content: center; min-height: 100vh;
}

.form-container { width: 100%; max-width: 480px; padding: 1rem; }
.form-card { background: var(--color-surface); padding: 2.5rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }

.form-header { text-align: center; margin-bottom: 2rem; }
.form-group { margin-bottom: 1.5rem; }
.form-label { display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.9rem; }

/* El Input Limpio */
.input-wrapper { position: relative; display: flex; align-items: center; }
.form-input {
  width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--color-border);
  border-radius: 8px; outline: none; transition: 0.2s;
}
.form-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15); }

/* LOS TRES ESTADOS DEL INPUT (Normal, Error, Éxito) */
.form-input.is-invalid { border-color: var(--color-error); background: var(--color-error-bg); }
.form-input.is-valid { border-color: var(--color-success); background: var(--color-success-bg); }

/* Inyección de iconito mágico vía CSS pseudoelemento */
.icon-status { position: absolute; right: 1rem; opacity: 0; transition: 0.2s; }
.form-input.is-valid + .icon-status { opacity: 1; color: var(--color-success); }
.form-input.is-valid + .icon-status::before { content: "✓"; }
.form-input.is-invalid + .icon-status { opacity: 1; color: var(--color-error); }
.form-input.is-invalid + .icon-status::before { content: "✕"; }

/* Textos de Error Dinámicos y Reglas de Password */
.error-text { color: var(--color-error); font-size: 0.85rem; margin-top: 0.35rem; min-height: 20px; }
.btn-toggle-pwd { position: absolute; right: 1rem; background: none; border: none; cursor: pointer; color: var(--color-muted); padding:0; }
.form-input[type="password"] { padding-right: 2.5rem; } /* Hueco pal ojo */

.pwd-rules { list-style: none; font-size: 0.85rem; color: var(--color-muted); display: flex; flex-direction: column; gap: 0.25rem; margin-top: 0.5rem; }
.rule::before { content: "•"; padding-right: 0.5rem;}
.rule.passed { color: var(--color-success); }
.rule.passed::before { content: "✓"; }

/* Botón Final del Formulario */
.btn-submit {
  width: 100%; padding: 0.85rem; background: var(--color-primary); color: white;
  border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s;
}
.btn-submit:disabled { background: var(--color-border); cursor: not-allowed; opacity: 0.7; }
```

### Fase 3: Lógica y Eventos Compasivos (JavaScript)

Vamos a aplicar la "Regla de Oro UX": No valides en el primer `input` (tecla a tecla), valida cuando el usuario se marcha (`blur`). Si comete un error, entonces SÍ pásate a evento `input` para "limpiarle" la mancha roja en vivo y perdonarle en cuanto ponga al arroba.

Añade esto a `main.js`:

```javascript
const emailInput = document.getElementById('email');
const emailError = document.getElementById('email-error');
const pwdInput = document.getElementById('password');
const pwdError = document.getElementById('password-error');
const togglePwdBtn = document.getElementById('toggle-password');
const ruleLength = document.getElementById('rule-length');
const ruleNumber = document.getElementById('rule-number');
const submitBtn = document.getElementById('btn-submit');

let isEmailValid = false;
let isPwdValid = false;

// Magia Matemática de Textos:
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const numberRegex = /[0-9]/; 

// 1. Ayudantes de Diseño
function setFieldError(input, errorElement, msg) {
  input.classList.remove('is-valid');
  input.classList.add('is-invalid');
  input.setAttribute('aria-invalid', 'true');
  errorElement.textContent = msg;
}

function setFieldSuccess(input, errorElement) {
  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
  input.setAttribute('aria-invalid', 'false');
  errorElement.textContent = '';
}

// 2. Comprobador de Cajero
function checkGlobalFormState() {
  if (isEmailValid && isPwdValid) {
    submitBtn.removeAttribute('disabled'); // Luz verde General!
  } else {
    submitBtn.setAttribute('disabled', 'true');
  }
}

// 3. LA GRAN FUNCIÓN DE EMAIL
function validateEmail() {
  const value = emailInput.value.trim();
  
  if (value === '') {
    setFieldError(emailInput, emailError, 'El correo electrónico es obligatorio.');
    isEmailValid = false;
  } else if (!emailRegex.test(value)) {
    setFieldError(emailInput, emailError, 'Introduce un formato válido (ej: usuario@web.com).');
    isEmailValid = false;
  } else {
    setFieldSuccess(emailInput, emailError);
    isEmailValid = true;
  }
  checkGlobalFormState();
}

// 4. LA GRAN FUNCIÓN DE PASSWORD
function validatePassword() {
  const value = pwdInput.value;
  
  const hasLength = value.length >= 8;
  const hasNumber = numberRegex.test(value);

  // Gamificación de las viñetas "En Vivo" (se encienden al teclear la letra número 8)
  if (hasLength) ruleLength.classList.add('passed');
  else ruleLength.classList.remove('passed');

  if (hasNumber) ruleNumber.classList.add('passed');
  else ruleNumber.classList.remove('passed');

  // Evaluación Roja/Verde final de la caja completa
  if (value === '') {
    setFieldError(pwdInput, pwdError, 'La contraseña es obligatoria.');
    isPwdValid = false;
  } else if (!hasLength || !hasNumber) {
    setFieldError(pwdInput, pwdError, 'La contraseña no cumple con los requisitos de seguridad.');
    isPwdValid = false;
  } else {
    setFieldSuccess(pwdInput, pwdError);
    pwdError.textContent = ''; 
    isPwdValid = true;
  }
  checkGlobalFormState();
}

// ----------------------------------------------------
// EL CORAZÓN DE LA UX: CONECTAR LOS EVENTOS
// ----------------------------------------------------

// Regla de Oro Nº1: No grites ANTES de que termine. Espera al BLUR (Ojos hacia afuera)
emailInput.addEventListener('blur', validateEmail);

// Regla de Oro Nº2: Si la ha pifiado y ya lo sabe, sálvale tecla a tecla (INPUT en vivo)
emailInput.addEventListener('input', () => {
  if (emailInput.classList.contains('is-invalid')) {
    validateEmail();
  }
});

// A nivel formativo, evaluamos y damos ticks de regla de password en el evento Input 
pwdInput.addEventListener('input', validatePassword);

// EL OJO MÁGICO
togglePwdBtn.addEventListener('click', () => {
  if (pwdInput.type === 'password') {
    pwdInput.type = 'text'; // Ver lo oculto
  } else {
    pwdInput.type = 'password'; // Volver a camuflar estrellitas
  }
});
```

Increíble nivel de código. Fíjate como cambiando dos Eventos tontos (`blur` y `input`) y combinándolos condicionalmente, has pasado de crear un formulario web "de programador puro" a crear una experiencia de usuario empática, pedagógica y que da ganas de rellenar de principio a fin.
