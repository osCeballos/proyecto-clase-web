// Componente lógico de Validación e Interacción dinámica de Formularios

// 1. Instanciaciones de Interfaz
const form = document.getElementById('register-form');
const emailInput = document.getElementById('email');
const emailError = document.getElementById('email-error');

const pwdInput = document.getElementById('password');
const pwdError = document.getElementById('password-error');
const togglePwdBtn = document.getElementById('toggle-password');
const ruleLength = document.getElementById('rule-length');
const ruleNumber = document.getElementById('rule-number');

const submitBtn = document.getElementById('btn-submit');

// Variables de Estado
let isEmailValid = false;
let isPwdValid = false;

// 2. Definición formal de Patrones (RegEx) para validación escalable
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const numberRegex = /[0-9]/; 

// 3. Modificadores de Estado de Vista (Activar Estilos dinámicos)
function setFieldError(inputElement, errorElement, message) {
  inputElement.classList.remove('is-valid');
  inputElement.classList.add('is-invalid');
  inputElement.setAttribute('aria-invalid', 'true'); // Indicamos al lector de pantalla que hay un error.
  errorElement.textContent = message; // Mostramos el mensaje de error al usuario.
}

// Restaurador de Estado limpio tras subsanación de falla de validación
function setFieldSuccess(inputElement, errorElement) {
  inputElement.classList.remove('is-invalid');
  inputElement.classList.add('is-valid');
  inputElement.setAttribute('aria-invalid', 'false'); // Indicamos que el campo es válido.
  errorElement.textContent = ''; // Limpiamos el mensaje de error anterior.
}

// 4. Ciclo algorítmico independiente de validación
function validateEmail() {
  const value = emailInput.value.trim(); // .trim() quita espacios en blanco inútiles
  
  if (value === '') {
    setFieldError(emailInput, emailError, 'Este campo es obligatorio.');
    isEmailValid = false;
  } else if (!emailRegex.test(value)) {
    setFieldError(emailInput, emailError, 'Introduce un email válido. (ej: hola@web.com)');
    isEmailValid = false;
  } else {
    setFieldSuccess(emailInput, emailError);
    isEmailValid = true;
  }
  
  checkGlobalFormState(); // Ver si encendemos el gran botón final
}

function validatePassword() {
  const value = pwdInput.value;
  
  // Validación complementaria requerida en cadena
  const hasLength = value.length >= 8;
  const hasNumber = numberRegex.test(value);

  // Refresco interactivo
  if (hasLength) ruleLength.classList.add('passed');
  else ruleLength.classList.remove('passed');

  if (hasNumber) ruleNumber.classList.add('passed');
  else ruleNumber.classList.remove('passed');

  // Validación del flujo resultante
  if (value === '') {
    setFieldError(pwdInput, pwdError, 'La contraseña es obligatoria.');
    isPwdValid = false;
  } else if (!hasLength || !hasNumber) {
    setFieldError(pwdInput, pwdError, 'La contraseña debe tener al menos 8 caracteres y un número.');
    isPwdValid = false;
  } else {
    setFieldSuccess(pwdInput, pwdError);
    pwdError.textContent = ''; // Limpiamos el main error text
    isPwdValid = true;
  }

  checkGlobalFormState();
}

// Verifica viabilidad total de emisión Submit
function checkGlobalFormState() {
  if (isEmailValid && isPwdValid) {
    submitBtn.removeAttribute('disabled');
  } else {
    submitBtn.setAttribute('disabled', 'true');
  }
}

// 5. Gestión del Flujo Reactivo a Eventos Físicos del Usuario

// Diferir evaluación crítica hasta finalizar ingreso actual
emailInput.addEventListener('blur', validateEmail);

// Restaurar interactivamente sin recarga la falla existente
emailInput.addEventListener('input', () => {
  // Solo validamos letra a letra si el campo YA estaba manchado de rojo (is-invalid)
  if (emailInput.classList.contains('is-invalid')) {
    validateEmail();
  }
});

// Lógica visual paralela al llenado de datos para guiar usuario
pwdInput.addEventListener('input', validatePassword);

// 6. Actuador Auxiliar: Intercambio Tipo texto a contraseña
togglePwdBtn.addEventListener('click', () => {
  const isPasswordMode = pwdInput.type === 'password';
  
  if (isPasswordMode) {
    pwdInput.type = 'text';
    togglePwdBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>';
    togglePwdBtn.setAttribute('aria-label', 'Ocultar contraseña');
  } else {
    pwdInput.type = 'password'; // Ocultar
    // UX: Restaurar Ojo Abierto
    togglePwdBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>';
    togglePwdBtn.setAttribute('aria-label', 'Mostrar contraseña');
  }
});

// Prevenir reload predefinido, confirmando visual de éxito ficticio
form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (isEmailValid && isPwdValid) {
    alert('¡Formulario enviado correctamente! En producción, aquí se llamaría a fetch() para enviar los datos al servidor.');
  }
});
