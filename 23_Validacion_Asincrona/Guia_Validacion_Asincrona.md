# Validación Asíncrona (Async/Await & Fetch) 📡

## 1. ¿Qué vamos a construir?
En el nivel anterior aprendimos a validar el HTML de un formulario. Pero, ¿y si necesitamos validar algo que el navegador no sabe? Por ejemplo: ¿Está ya registrado este nombre de usuario en nuestra base de datos de usuarios? 
El HTML no lo sabe. Tenemos que salir a internet, llamar a nuestro servidor y preguntarle. Y mientras el servidor busca en su base de datos y nos responde, nuestro JavaScript no se puede quedar congelado. Aprenderemos a manejar el tiempo y la Asincronía para darle vida a ese momento de espera con un "Spinner" y un bloqueo táctico del botón Enviar.

---

## 2. Conceptos Clave antes de empezar
*   **Promesas (Promises) y Async/Await:** Mandar un paquete mágico por internet a un servidor es una "Promesa". Significa: "Te prometo que te traeré un resultado algún día, pero no ahora mismo". Con las palabras mágicas `async` (marca a una función como viajera en el tiempo) y `await` (pausa todo y espera aquí hasta que el servidor devuelva el tesoro), dominaremos ese tiempo de espera como magos.
*   **Debemos tener piedad (Debouncing):** Si el servidor está a 500 kilómetros y cada vez que el usuario teclea "O" ... "s" ... "c" ... "a" ... "r" mandamos una furgoneta al servidor a preguntar si la letra existe, colapsaremos la carretera. Aprenderemos la técnica del "Debouncing", que significa: pon un reloj con una bomba. Si el usuario teclea rápido, resetea el reloj una y otra vez. Si el usuario deja de escribir durante medio segundo... BOOM! Manda la furgoneta con la palabra COMPLETA de una sola vez.

---

## 3. Paso a paso

### Fase 1: El UI Preparado para la Asincronía

Copia la estructura básica en pantalla. Nota cómo debajo del Input del Username tenemos un Div especial `id="username-loader"` preparado pero invisible para dar vueltas cuando lo encendamos, y un span para pintar un tonto icono ✓ ó ✕ según nos conteste el servidor. 

Copia en `index.html`:

```html
<header class="header">
  <div class="header-container">
    <div class="logo">AsyncCheck<span style="color:var(--color-primary)">.</span></div>
  </div>
</header>

<main class="content">
  <section class="form-section">
    <div class="section-header">
      <h1>Registro de Usuario Único</h1>
      <p>Tu nombre de usuario es tu identidad en la plataforma. Comprueba su disponibilidad en tiempo real.</p>
    </div>

    <form class="async-form" id="async-check-form">
      
      <!-- Campo 1: Nombre de Usuario Asíncrono (Simulado en RED) -->
      <div class="form-group" id="group-username">
        <label for="username">Nombre de Usuario</label>
        
        <!-- Envoltorio táctico para superponer el cargador al input de forma absoluta -->
        <div class="input-wrapper">
          <input 
            type="text" 
            id="username" 
            name="username" 
            placeholder="Ej. ninja_frontend" 
            required 
            autocomplete="off"
          >
          <!-- El spinner de carga (Invisible por defecto) -->
          <div class="loader" id="username-loader"></div>
          
          <!-- Los Iconitos estáticos de Aprobado/Denegado -->
          <span class="status-icon" id="status-icon"></span>
        </div>
        
        <!-- Texto final de Veredicto ("La liaste", o "Vas bien") -->
        <span class="feedback-message" id="username-feedback"></span>
        <span class="help-text">Elige un nombre creativo que te identifique como desarrollador.</span>
      </div>

      <!-- Campo 2: Normal y aburrido -->
      <div class="form-group">
        <label for="email">Correo Electrónico</label>
        <input type="email" id="email" name="email" required placeholder="usuario@ejemplo.com">
      </div>

      <!-- El botón Final, que bloquearemos dinámicamente -->
      <button type="submit" class="btn-submit" id="submit-btn">Crear mi Perfil</button>

    </form>
  </section>
</main>
```

### Fase 2: CSS y las Clases Modificadoras de Estado

Copia todo tu código CSS y observa muy detenidamente el final del archivo. ¿Ves cómo el botón `.btn-submit` tiene una pseudo-clase `:disabled` con `cursor: not-allowed`? ¡Eso es para que cuando Javascript congele el botón durante la espera al servidor, parezca muerto e inclicleable! Observa también el giro infinito `@keyframes spin` de nuestro precioso círculo Loader.

Pega este estilo en tu `style.css`:

```css
:root { --color-bg: #F1F5F9; --color-surface: #FFFFFF; --color-text: #334155; --color-primary: #0F172A; --color-accent: #6366F1; --color-success: #22C55E; --color-error: #EF4444; --color-border: #CBD5E1; }

* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', system-ui, sans-serif; background: var(--color-bg); color: var(--color-text); line-height: 1.6; }

.header { background: var(--color-surface); padding: 1rem; border-bottom: 1px solid var(--color-border); }
.logo { font-size: 1.25rem; font-weight: 800; max-width: 600px; margin: 0 auto; }
.content { max-width: 600px; margin: 0 auto; padding: 4rem 1.5rem; }
.section-header { text-align: center; margin-bottom: 3rem; }

/* ========================================
   CAJA PRINCIPAL DEL FORMULARIO
   ======================================== */
.async-form { background: var(--color-surface); padding: 2.5rem; border-radius: 16px; box-shadow: 0 4px 20px -5px rgba(0,0,0,0.1); border: 1px solid var(--color-border); }
.form-group { margin-bottom: 2rem; }
label { display: block; font-weight: 700; margin-bottom: 0.5rem; color: #475569; }

/* Wrapper relativo para inyectar iconos voladores encima del input */
.input-wrapper { position: relative; display: flex; align-items: center; }
input { width: 100%; padding: 0.9rem 2.8rem 0.9rem 1rem; /* Dejamos un hueco aleta derecha para el Spinner */ border: 2px solid var(--color-border); border-radius: 10px; font-family: inherit; font-size: 1rem; transition: all 0.2s; }
input:focus { outline: none; border-color: var(--color-accent); }

/* EL SPINNER (Es un círculo con un lado pintado de Lila dando giros locos) */
.loader { position: absolute; right: 12px; width: 18px; height: 18px; border: 2px solid #E2E8F0; border-top-color: var(--color-accent); border-radius: 50%; display: none; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* LOS ICONOS (Se inyectan desde JS con contenido de pseudoesferas nativas) */
.status-icon { position: absolute; right: 12px; font-weight: bold; font-size: 1.1rem; }
.status-icon.success::before { content: '✓'; color: var(--color-success); }
.status-icon.error::before { content: '✕'; color: var(--color-error); }

/* MENSAJE TÁCTICO INFERIOR */
.feedback-message { display: block; font-size: 0.85rem; margin-top: 0.5rem; font-weight: 500; }
.feedback-message.success { color: var(--color-success); }
.feedback-message.error { color: var(--color-error); }
.help-text { font-size: 0.8rem; color: #94A3B8; }

/* CLASES DE COLORES QUE INYECTARÁ SUPER JAVASCRIPT */
input.is-loading { border-color: #E2E8F0; }
input.is-valid { border-color: var(--color-success); }
input.is-invalid { border-color: var(--color-error); }

/* EL BOTÓN (Con su fase inútil Muerta / Bloqueada para no bombardear Servidor) */
.btn-submit { width: 100%; padding: 1rem; background: var(--color-primary); color: white; border: none; border-radius: 10px; font-size: 1rem; font-weight: 700; cursor: pointer; transition: transform 0.2s, opacity 0.2s; }
.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; } /* CASTIGO VISUAL */
.btn-submit:not(:disabled):hover { opacity: 0.9; transform: translateY(-1px); }
```

### Fase 3: La Elegancia Táctica (JS, Await y Promesas)

Aquí empieza el baile. Hemos programado en nuestro código JS una función falsa llamada `simulateApiCall()`, que hace el papel de "nuestro servidor externo al que llamamos por internet". Este servidor artificial tardará exactamente 1.5 segundos en contestarnos, y tendrá prohibidos los nombres "lorem", "ipsum", "oscar" y "admin". Todo lo demás lo dará por bueno. 

Vuelca este código enorme pero súper ordenado en tu `main.js`. Fíjate de arriba a abajo cómo implementa la bomba del Temporizador ("Debouncer") para que solo pida datos si estás sin escribir 500ms... Y fíjate en el asombroso bloque `try/catch/finally` para orquestar la espera de esa Promesa asíncrona.

```javascript
/* VARIABLES EN PUESTO DE CONTROL */
const usernameInput = document.getElementById('username');
const loader = document.getElementById('username-loader');
const statusIcon = document.getElementById('status-icon');
const feedback = document.getElementById('username-feedback');
const submitBtn = document.getElementById('submit-btn');

// ===================================
// 1. GESTOR DE TRÁFICO CARRETERA (DEBOUNCING)
// ===================================
let typingTimer; // Creamos la bomba

usernameInput.addEventListener('input', () => {
    resetState(); // Borra todos los iconos y colores cada vez que tocas una tecla.
    clearTimeout(typingTimer); // Desarma la bomba anterior y la destruye del tiempo/espacio.
    
    // Si ha escrito al menos 3 letras... Montamos la bomba nueva. Estallará tras medio segundo llamando a la función Principal.
    if (usernameInput.value.length >= 3) {
        typingTimer = setTimeout(performAsyncCheck, 500); 
    }
});

// ===================================
// 2. FUNCIÓN VIAJERA DEL TIEMPO (ASYNC PRO)
// ===================================
async function performAsyncCheck() {
    const value = usernameInput.value;
    
    // ENCENDER FASE PREVIA: Enciende Ruedecita Visual y Asesina/Bloquea Botón Azul.
    showLoading(true);
    submitBtn.disabled = true;

    try {
        // En un trabajo futuro real aquí pondrías: await fetch( ... )
        // Pero usamos nuestra máquina del tiempo en pruebas (1.5 sec)
        const result = await simulateApiCall(value); 
        
        if (result.available) {
            setValidState('¡Nombre disponible! ✓');
        } else {
            setInvalidState('Este nombre de usuario ya está registrado. ✕');
        }
        
    } catch (error) { // Si fallase internet
        setInvalidState('Error del Metaverso Conexión Cortada. Resetea Rooter.');
    } finally { // HAYA IDO BIEN, O HAYA IDO MAL... TERMINA APAGANDO EL MOTOR
        showLoading(false); // Apagamos la Ruedecita
    }
}

// ===================================
// 3. NUESTRO SERVIDOR FAKE INTERNO
// ===================================
// Devuelve una "Promesa" que tardará 1500ms en concedernos su Gracia.
function simulateApiCall(username) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const blockListNombres = ['admin', 'root', 'soporte', 'moderador'];
            resolve({
                // ¿Está disponible? Sí, Peeeero siempre y cuando lo que escribas no esté incluido en la BlackList pasándolo todo a minúscula.
                available: !blockListNombres.includes(username.toLowerCase())
            });
        }, 1500); 
    });
}

// ===================================
// 4. MAQUILADORAS DE CLASES ESTÉTICAS (Ayudantes Visuales CSS)
// ===================================
function showLoading(isLoading) {
    loader.style.display = isLoading ? 'block' : 'none';
    statusIcon.className = 'status-icon';
    if (isLoading) usernameInput.classList.add('is-loading');
    else usernameInput.classList.remove('is-loading');
}

function setValidState(msg) {
    usernameInput.classList.add('is-valid');
    statusIcon.classList.add('success');
    feedback.textContent = msg;
    feedback.className = 'feedback-message success';
    submitBtn.disabled = false; // Devuélvenos el botón final!
}

function setInvalidState(msg) {
    usernameInput.classList.add('is-invalid');
    statusIcon.classList.add('error');
    feedback.textContent = msg;
    feedback.className = 'feedback-message error';
    submitBtn.disabled = true; // Sigue asesinado
}

function resetState() {
    usernameInput.classList.remove('is-valid', 'is-invalid');
    statusIcon.className = 'status-icon';
    feedback.textContent = '';
    feedback.className = 'feedback-message';
}

// ===================================
// 5. CAZANDO EL BOTÓN AZUL (Cierre del Form)
// ===================================
document.getElementById('async-check-form').addEventListener('submit', (e) => {
    e.preventDefault(); 
    alert('¡Perfil creado con éxito! Bienvenido a la comunidad de desarrolladores de élite.');
});
```

Abre la web, teclea rápidamente tu nombre real "Oscar". ¡Verás cómo sale de inmediato la ruecedita cargando...! Y de repente todo se vuelve rojo. Borra y escribe "Fernando". Ruedecita carga un rato y luego pinta Verde y el Botón Azul final recobra su vida para que puedas hacer click. Acabas de dominar el arte asíncrono mejor que el 45% del mercado laboral de Junior.
