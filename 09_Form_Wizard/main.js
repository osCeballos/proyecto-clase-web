// Lógica Multi-Step: Simulador de Single Page Application (SPA)

// 1. Manejo de Estado Base
let currentStep = 1;         
const TOTAL_STEPS = 3; 

// 2. Selectores Estructurales DOM
const form = document.getElementById('wizard-form');
const panels = document.querySelectorAll('.wizard-panel');
const stepNodes = document.querySelectorAll('.step');
const stepLines = document.querySelectorAll('.step-line');

const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const btnSubmit = document.getElementById('btn-submit');

// 3. Renderizado de Vistas Controlado
function showStep(stepIndex) {
  
  // Actuación sobre visibilidad de paneles
  panels.forEach((panel, index) => {
    if (index + 1 === stepIndex) {
      panel.removeAttribute('hidden');
      panel.classList.add('panel--active');
    } else {
      panel.setAttribute('hidden', 'true');
      panel.classList.remove('panel--active');
    }
  });

  // Render de Stepper visual
  stepNodes.forEach((node, index) => {
    const nodeStepNumber = index + 1;
    
    node.classList.remove('step--active', 'step--done');
    node.removeAttribute('aria-current');

    if (nodeStepNumber === stepIndex) {
      node.classList.add('step--active');
      node.setAttribute('aria-current', 'step'); 
    } else if (nodeStepNumber < stepIndex) {
      node.classList.add('step--done');
    }
  });

  // Modificadores de líneas de recorrido
  stepLines.forEach((line, index) => {
    if (index + 1 < stepIndex) {
      line.classList.add('line--filled');
    } else {
      line.classList.remove('line--filled');
    }
  });

  // Transición de Botoneras Controlador
  if (stepIndex === 1) {
    btnPrev.setAttribute('hidden', 'true');
  } else {
    btnPrev.removeAttribute('hidden');
  }

  if (stepIndex === TOTAL_STEPS) {
    btnNext.setAttribute('hidden', 'true');
    btnSubmit.removeAttribute('hidden');
  } else {
    btnNext.removeAttribute('hidden');
    btnSubmit.setAttribute('hidden', 'true');
  }
}

// 4. Utilidad de Validación Nodal de Bloque
function validateCurrentPanel() {
  const currentPanel = document.getElementById(`panel-${currentStep}`);
  const requiredInputs = currentPanel.querySelectorAll('input[required], select[required]');
  
  let isValid = true;
  
  requiredInputs.forEach(input => {
    if (!input.validity.valid) {
      isValid = false;
      input.reportValidity(); 
    }
  });
  
  return isValid;
}

// 5. Flujos Base Reactivos
btnNext.addEventListener('click', () => {
  if (validateCurrentPanel()) {
    currentStep++;
    showStep(currentStep);
  }
});

btnPrev.addEventListener('click', () => {
  currentStep--;
  showStep(currentStep);
});

form.addEventListener('submit', (e) => {
  e.preventDefault(); 
  
  if (validateCurrentPanel()) {
    alert('¡Registro completado! En producción, aquí se enviarían los datos al servidor.');
    
    form.reset();
    currentStep = 1;
    showStep(1);
  }
});

// 6. Estado Inicial: Al cargar, mostramos el primer paso.
showStep(currentStep);
