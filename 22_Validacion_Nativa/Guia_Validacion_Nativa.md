# Validación Nativa (Constraint Validation API) 🛡️

## 1. ¿Qué vamos a construir?
Olvídate de instalar monstruosas bibliotecas de JavaScript de 500KB solo para asegurarte de que un usuario ha escrito un email correcto o no ha dejado la contraseña vacía.
Hoy vamos a aprender que el navegador tiene un Superpoder oculto llamado **Constraint Validation API**. Es decir, el navegador ya sabe validar, ya sabe lo que es un email, y ya sabe comprobar si un texto es muy corto. Solo tenemos que enseñarle a nuestro HTML cómo aplicar las reglas, darle estilo con CSS, y usar un miligramo de JavaScript para que los mensajes de error salgan bonitos en lugar de las feas burbujitas blancas que saca Windows/Mac por defecto.

---

## 2. Conceptos Clave antes de empezar
*   **Reglas en el HTML:** Lo primero es ponerle un collar al `input`. Si quieres que sea obligatorio, escribes `required`. Si quieres que mida al menos 8 letras, escribes `minlength="8"`. Si quieres que tenga un formato de email, escribes `type="email"`. Ya está, el HTML hace el 80% del trabajo. 
*   **`novalidate` en el form:** Esta es la palabra mágica. Si se la pones al `<form>`, le estás diciendo al navegador: *"Sé que vas a vigilar las reglas que te puse, pero por favor, NO me muestres tus antiestéticos globos de error americanos. Mantén tu boca cerrada, yo pintaré el texto en rojo por debajo usando JavaScript"*.
*   **Pseudo-clases CSS (`:valid` e `:invalid`):** CSS es súper inteligente. Si un input está vacío, y era `required`, CSS le inyecta invisiblemente la pseudo-clase `:invalid`. Podemos usarla para ponerle el borde rojo sin tener que programar IFs lógicos.
*   **`ValidityState` de JS:** Es un objeto mágico que pertenece a cada Input. Contiene un chivato digital. Le puedes preguntar a JS `if(input.validity.valueMissing)` y si es `true`, sabrás que el usuario se saltó un campo requerido.

---

## 3. Paso a paso

### Fase 1: Enseñar al HTML las reglas del juego

Analiza el siguiente código. Mira bien cada `input`. Tienen su etiqueta `required`, sus `minlength` y hasta un `pattern` de Regex que prohibe escribir números en el apartado del nombre. Abajo del todo observa las franjas para una barra de "fuerza de contraseña".
Fíjate muchísimo en el atributo `novalidate` de la etiqueta `<form>`.

Copia esto en tu `index.html`:

```html
<header class="header">
  <div class="header-container">
    <div class="logo">ValidForm<span style="color:var(--color-primary)">.</span></div>
  </div>
</header>

<main class="content">
  <section class="form-section">
    <div class="section-header">
      <h1>Registro de Alumno</h1>
      <p>Completa tus datos para acceder a la plataforma de aprendizaje y comenzar tu formación.</p>
    </div>

    <!-- EL FORMULARIO MAGISTRAL (Novalidate = Silencia los feos tooltips del sistema operativo) -->
    <form class="custom-form" id="registration-form" novalidate>
      
      <!-- Campo 1: Solo admitirá nombre, letras mayúsculas, minúsculas y espacios gracias a Regex -->
      <div class="form-group">
        <label for="username">Nombre Completo</label>
        <input 
          type="text" 
          id="username" 
          name="username" 
          placeholder="Ej. Juan Pérez" 
          required 
          minlength="3"
          pattern="[A-Za-z\s]+"
        >
        <span class="error-message" aria-live="polite"></span>
        <span class="help-text">Introduce tu nombre y apellidos (mínimo 3 caracteres).</span>
      </div>

      <!-- Campo 2: Obligatorio correo -->
      <div class="form-group">
        <label for="email">Correo Electrónico</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          placeholder="usuario@ejemplo.com" 
          required
        >
        <span class="error-message" aria-live="polite"></span>
      </div>

      <!-- Campo 3: Contraseña, con un añadido estético de medidor de barra -->
      <div class="form-group">
        <label for="password">Contraseña de Seguridad</label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          required
          minlength="8"
        >
        <span class="error-message" aria-live="polite"></span>
        <div class="password-strength">
          <div class="strength-bar"></div>
        </div>
      </div>

      <button type="submit" class="btn-submit">Finalizar Registro</button>

    </form>
  </section>
</main>
```

### Fase 2: CSS y la Magia en tiempo real (touched/valid)

Si solo usáramos CSS `:invalid`, ¡la web nacería con todos los inputs en rojo! Sería un ataque al usuario nada más entrar a vernos. Por eso, en un rato con JS le pondremos la clase artificial llamada `.touched` solo cuando el usuario haya posado el ratón o el dedo en la caja.
Así, la regla de css será: `input.touched:invalid`. (Estará rojo SOLAMENTE si la tocaste alguna vez Y AL MISMO TIEMPO no cumples la regla obligatoria actual).

```css
:root { --color-bg: #F8FAFC; --color-surface: #FFFFFF; --color-text: #1E293B; --color-primary: #3B82F6; --color-success: #10B981; --color-error: #EF4444; --color-border: #E2E8F0; --radius: 12px; --shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', system-ui, sans-serif; background: var(--color-bg); color: var(--color-text); line-height: 1.5; }

/* LAYOUT GENERICO */
.header { background: var(--color-surface); padding: 1rem; border-bottom: 1px solid var(--color-border); }
.logo { font-size: 1.25rem; font-weight: 800; max-width: 600px; margin: 0 auto; }
.content { max-width: 600px; margin: 0 auto; padding: 4rem 1.5rem; }
.section-header { text-align: center; margin-bottom: 3rem; }

/* FORMA DEL FORMULARIO */
.custom-form { background: var(--color-surface); padding: 2.5rem; border-radius: var(--radius); box-shadow: var(--shadow); border: 1px solid var(--color-border); }
.form-group { margin-bottom: 1.5rem; position: relative; }
label { display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.9rem; }
input { width: 100%; padding: 0.8rem 1rem; border: 2px solid var(--color-border); border-radius: 8px; font-family: inherit; font-size: 1rem; transition: all 0.2s; }
input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
.help-text { display: block; font-size: 0.8rem; color: #64748B; margin-top: 0.4rem; }

/* ========================================
   3. MAGIA CSS DINÁMICA: "TOCADO Y HUNDIDO"
   ======================================== */
   
/* Si JS le ha inyectado "touched" porque interactuamos, Y ADEMÁS el HTML nativamente se ha roto (invalid), píntalo de Rojo Furia */
input.touched:invalid { border-color: var(--color-error); background-color: #FEF2F2; }

/* Si JS le ha inyectado "touched", Y el HTML dice que OK, bordéalo en Verde Victoria */
input.touched:valid { border-color: var(--color-success); }

/* Las etiquetas rojas que están abajo del input, nacerán ocultas en invisible */
.error-message { color: var(--color-error); font-size: 0.8rem; font-weight: 500; margin-top: 0.4rem; display: none; }

/* Pero si su hermano anterior (el input rojo), está mal, aparece debajo en bloque como por arte de magia */
input.touched:invalid + .error-message { display: block; }

/* BOTÓN DE ENVIAR */
.btn-submit { width: 100%; padding: 1rem; background: var(--color-primary); color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 700; cursor: pointer; transition: opacity 0.2s; margin-top: 1rem; }
.btn-submit:hover { opacity: 0.9; }
.btn-submit:active { transform: scale(0.98); }

/* SISTEMA EXCLUSIVO ESTÉTICO: BARRA DE FUERZA DE PASS */
.password-strength { height: 4px; background: var(--color-border); margin-top: 8px; border-radius: 2px; overflow: hidden; }
.strength-bar { height: 100%; width: 0%; transition: width 0.3s, background 0.3s; }
```


### Fase 3: La Elegancia Táctica (JS) y la Api Validity

La última pieza. Como hemos silenciado al navegador con `novalidate`, ahora tenemos que interceptar sus fallos mudos y escribirlos nosotros en nuestro bonito elemento `<span class="error-message">`. 
¿Cuándo lo comprobamos? Cuando el usuario aparta el foco/cursor del input (`blur`), le colgamos el cartelito artificial CSS de `.touched` en la espalda, y llamamos a nuestra función policía.

Copia en `main.js`:

```javascript
const form = document.getElementById('registration-form');
const inputs = form.querySelectorAll('input');

// 1. EL VIGILANTE DE EVENTOS
inputs.forEach(input => {
  
  // Cuando perdemos el Foco (Quitamos el cursor del texto). Castigamos clavándole la clase 'touched' de por vida y evaluamos el Input.
  input.addEventListener('blur', () => {
    input.classList.add('touched');
    validateInput(input);
  });

  // Cuando tecleamos (Input puro en tiempo real). Evaluamos si está 'touched', para dar buen feedback al momento de estar re-corrigiendo errores pasados.
  input.addEventListener('input', () => {
    if (input.classList.contains('touched')) {
      validateInput(input);
      if (input.type === 'password') updatePasswordStrength(input.value); // Decoración visual de la barra de Fuerza de contraseña.
    }
  });
});

// 2. EL AGENTE EVALUADOR
function validateInput(input) {
  // Buscamos la cajita invisible roja de alerta que tiene abajo para inyectarle un texto...
  const errorSpan = input.parentElement.querySelector('.error-message');
  
  // .validity ES LA CLAVE NATIVA HTML5 DE ESTA LECCIÓN //
  if (!input.validity.valid) {
    // Si la api dice que hay un problema moral o matemático, le suplicamos que nos especifique el delito...
    errorSpan.textContent = getCustomMessage(input);
  } else {
    // Si la api nos dice maravillas, vaciamos el texto error para que la altura de caja sea 0.
    errorSpan.textContent = '';
  }
}

// 3. LA IMPRENTA DE MULTAS
function getCustomMessage(input) {
  const v = input.validity; // Extraemos el objeto de Leyes Naturales del Input.
  
  // ¿Has metido un "Required" y al enviar estaba vacío? Pilla su multa correspondiente.
  if (v.valueMissing) return 'Este campo es de relleno obligatorio.';
  // ¿Has puesto Type Email y pusiste "holaamigo"?
  if (v.typeMismatch) return 'Introduce un formato válido (pej: tú@correo.com)';
  // ¿Te pusimos minlength=8 y tiene 5?
  if (v.tooShort) return `Demasiado corto (te obligo al menos a ${input.minLength} letras y números).`;
  // ¿Vulneraste mi Pattern y escribiste en sánscrito cuando pedí A-Z?
  if (v.patternMismatch) return 'Formato no válido. Solo se permiten letras.';
  
  return 'Valor no válido. Revisa el formato.';
}

// 4. EL CÓDIGO GAMIFICACIÓN: La Píldora Adictiva
function updatePasswordStrength(val) {
  const bar = document.querySelector('.strength-bar');
  let strength = 0;
  
  // Asignamos una puntuación basada en reglas de seguridad...
  if (val.length > 5) strength += 40;
  if (/[A-Z]/.test(val)) strength += 30; // ¿Tiene letras mayus?
  if (/[0-9]/.test(val)) strength += 30; // ¿Tiene numerito del 0 al 9?

  // Llenamos el ancho en porcentaje
  bar.style.width = strength + '%';
  
  // Ponemos colorines de premio psicólogico
  if (strength < 40) bar.style.backgroundColor = '#EF4444'; // Rojo (DANGER)
  else if (strength < 80) bar.style.backgroundColor = '#F59E0B'; // Naranja (Meh)
  else bar.style.backgroundColor = '#10B981'; // Verde (Masterhacker)
}

// 5. CAZANDO EL BOTONAZO AZUL FINAL AL ENVÍO DEL PEDIDO
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Parar el refresco inminente maldito histórico de JS.
  
  // Escaneamos a la fuerza todos los inputs y los damos por 'clicados/touched' a la fuerza bruta, se abre el telón de los horrores rojos si estaban vacíos.
  inputs.forEach(input => {
    input.classList.add('touched');
    validateInput(input);
  });

  // SI LA VALIDACIÓN NATIVA DIOS LO APRUEBA TODO... ¡A producción base de datos!
  if (form.checkValidity()) {
    alert('¡El Formulario ha llegado perfectamente y legal a mis servidores falsos de clase!');
  } else {
    console.log('Te faltan cosas rojas que corregir');
  }
});
```

Pruébalo. Intenta darle al botón Enviar sin escribir. ¡Magia roja por todas partes! Escribe en el Email un número sin arroba... ¡Magia roja en vivo que desaparece en verde si añades una arroba y un ".com"! Eres un campeón.
