// API Notificaciones Toast Dinámicas
const toastContainer = document.getElementById('toast-container');
const DURATION = 4000; // Si modificas esto, modifícalo también en CSS (--toast-duration)

// Catálogo de Elementos e Íconos SVG
const icons = {
  success: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
  error: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
  warning: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  info: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
};

const titles = {
  success: "Éxito",
  error: "Error",
  warning: "Atención",
  info: "Información"
};

// Función Constructora (Render & Append DOM)
function createToast(type, message) {
  
  // A. Contenedor HTML (Cascarón en bruto previo a render)
  const toastElement = document.createElement('div');
  
  // Le pegamos su clase y la variable de color CSS asociada a su Tipo.
  toastElement.classList.add('toast', `toast--${type}`);
  toastElement.setAttribute('role', 'alert'); // A11y

  // B. Rellenado y Formateado de interior
  toastElement.innerHTML = `
    ${icons[type]}
    <div class="toast-content">
      <h4>${titles[type]}</h4>
      <p>${message}</p>
    </div>
    <button class="toast-close" aria-label="Cerrar notificación">&times;</button>
    <div class="toast-progress"></div>
  `;

  // C. Inyección al DOM
  toastContainer.appendChild(toastElement);

  // D. Detonador Auto-Destructivo asíncrono
  const autoDestroyTimer = setTimeout(() => {
    removeToast(toastElement);
  }, DURATION);

  // E. Detonador Manual con Parche Paralelo
  const closeBtn = toastElement.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    clearTimeout(autoDestroyTimer);
    removeToast(toastElement);
  });
}

// Destructor de Toast Seguro (Con Retardo de Animación)
function removeToast(toastElement) {
  // Le añadimos la clase que causa la animación de CSS FadeOutRight a la derecha
  toastElement.classList.add('toast--closing');
  
  // Timeout buffer sincronizado con keyframes de CSS Outwards
  setTimeout(() => {
    toastElement.remove(); // Adiós del DOM de Chromium / Safari
  }, 300);
}

// Escuchador de Invocación desde Botones Demo
const triggerButtons = document.querySelectorAll('.action-buttons .btn');

triggerButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.getAttribute('data-type');
    const message = btn.getAttribute('data-msg');
    
    createToast(type, message);
  });
});
