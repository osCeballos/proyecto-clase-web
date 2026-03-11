// Módulo de Validación: Constraint Validation API
// Interceptamos los errores nativos del navegador para mostrarlos de forma personalizada y accesible.

const form = document.getElementById('registration-form');
const inputs = form.querySelectorAll('input');

// --- VIGILANTES DE CAMPO ---
// Escuchamos dos momentos clave: cuando el usuario sale del campo (blur) y cuando escribe (input).

inputs.forEach(input => {

  // Al salir del campo: marcamos el campo como "tocado" y lo validamos por primera vez.
  input.addEventListener('blur', () => {
    input.classList.add('touched');
    validateInput(input);
  });

  // Al escribir: si el campo ya fue tocado, re-validamos en tiempo real para dar feedback inmediato.
  input.addEventListener('input', () => {
    if (input.classList.contains('touched')) {
      validateInput(input);
      // Si es el campo de contraseña, actualizamos la barra de seguridad.
      if (input.type === 'password') updatePasswordStrength(input.value);
    }
  });
});

// --- FUNCIÓN DE VALIDACIÓN ---
// Comprueba el estado del campo usando la API nativa del navegador ('input.validity').
function validateInput(input) {
  const errorSpan = input.parentElement.querySelector('.error-message');
  
  if (!input.validity.valid) {
    // Si hay un error, obtenemos un mensaje descriptivo y lo mostramos.
    errorSpan.textContent = getCustomMessage(input);
  } else {
    // Si está bien, borramos el mensaje de error.
    errorSpan.textContent = '';
  }
}

// --- TRADUCTOR DE ERRORES ---
// Convierte los códigos de error técnicos de la API en mensajes legibles para el usuario.
function getCustomMessage(input) {
  const v = input.validity;
  
  if (v.valueMissing)    return 'Este campo es obligatorio.';
  if (v.typeMismatch)    return 'Introduce un formato válido (ej: tu@correo.com)';
  if (v.tooShort)        return `Demasiado corto — necesitas al menos ${input.minLength} caracteres.`;
  if (v.patternMismatch) return 'Solo se permiten letras. No uses números ni símbolos.';
  
  return 'Valor no válido. Revisa el formato del campo.';
}

// --- INDICADOR DE SEGURIDAD DE CONTRASEÑA ---
// Calcula una puntuación basada en longitud, mayúsculas y números, y colorea la barra.
function updatePasswordStrength(val) {
  const bar = document.querySelector('.strength-bar');
  let strength = 0;
  
  if (val.length > 5)      strength += 40; // Longitud suficiente
  if (/[A-Z]/.test(val))   strength += 30; // Contiene mayúsculas
  if (/[0-9]/.test(val))   strength += 30; // Contiene números
  
  bar.style.width = strength + '%';
  
  // Rojo = débil, Naranja = media, Verde = fuerte
  if (strength < 40)       bar.style.backgroundColor = '#EF4444';
  else if (strength < 80)  bar.style.backgroundColor = '#F59E0B';
  else                     bar.style.backgroundColor = '#10B981';
}

// --- ENVÍO DEL FORMULARIO ---
// Al enviar: forzamos la validación de todos los campos y comprobamos si el formulario es válido.
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Evitar el refresco de página por defecto
  
  // Marcamos todos los campos como "tocados" para activar los estilos de error si los hay.
  inputs.forEach(input => {
    input.classList.add('touched');
    validateInput(input);
  });

  if (form.checkValidity()) {
    alert('¡Formulario enviado correctamente! En producción, aquí se llamaría a la API del servidor.');
  } else {
    // No hacemos nada más: los estilos de error ya son visibles en el formulario.
  }
});
