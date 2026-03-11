// Módulo de Validación Asíncrona: Async/Await + Debouncing
// Simula una consulta al servidor para comprobar si un nombre de usuario está disponible.

const usernameInput = document.getElementById('username');
const loader = document.getElementById('username-loader');
const statusIcon = document.getElementById('status-icon');
const feedback = document.getElementById('username-feedback');
const submitBtn = document.getElementById('submit-btn');

// --- DEBOUNCING ---
// Técnica para no lanzar llamadas al servidor en cada tecla pulsada.
// Solo ejecutamos la comprobación si el usuario deja de escribir durante 500ms.
let typingTimer;

usernameInput.addEventListener('input', () => {
    resetState();
    clearTimeout(typingTimer); // Cancelamos el temporizador anterior
    
    if (usernameInput.value.length >= 3) {
        // Iniciamos un nuevo temporizador: si el usuario no sigue escribiendo, disparamos la comprobación.
        typingTimer = setTimeout(performAsyncCheck, 500);
    }
});

// --- FUNCIÓN ASÍNCRONA PRINCIPAL ---
// Gestiona el estado de la UI (cargando, éxito, error) mientras espera la respuesta del servidor.
async function performAsyncCheck() {
    const value = usernameInput.value;
    
    // Activamos el modo carga: spinner visible y botón de envío bloqueado.
    showLoading(true);
    submitBtn.disabled = true;

    try {
        // 'await' pausa la ejecución hasta que el servidor responda.
        // En producción, aquí iría: const result = await fetch('/api/check-username?q=' + value);
        const result = await simulateApiCall(value);
        
        if (result.available) {
            setValidState('¡Nombre de usuario disponible! ✓');
        } else {
            setInvalidState('Este nombre de usuario ya está en uso. ✕');
        }
    } catch (error) {
        // Si hay un error de red o del servidor, lo comunicamos al usuario.
        setInvalidState('Error de conexión. Revisa tu red e inténtalo de nuevo.');
    } finally {
        // 'finally' se ejecuta siempre, haya error o no: desactivamos el spinner.
        showLoading(false);
    }
}

// --- SIMULADOR DE API (SOLO PARA DESARROLLO) ---
// En producción, esta función se reemplaza por una llamada real con fetch().
// Simula una respuesta del servidor con 1.5 segundos de retraso.
function simulateApiCall(username) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Lista de nombres reservados (en producción, esta comprobación la haría el servidor).
            const takenNames = ['admin', 'root', 'soporte', 'moderador'];
            resolve({
                available: !takenNames.includes(username.toLowerCase())
            });
        }, 1500);
    });
}

// --- FUNCIONES DE ESTADO DE LA UI ---
// Cada función actualiza el aspecto visual del campo según el resultado.

function showLoading(isLoading) {
    loader.style.display = isLoading ? 'block' : 'none';
    statusIcon.className = 'status-icon'; // Limpia el icono anterior
    if (isLoading) usernameInput.classList.add('is-loading');
    else           usernameInput.classList.remove('is-loading');
}

function setValidState(msg) {
    usernameInput.classList.add('is-valid');
    statusIcon.classList.add('success');
    feedback.textContent = msg;
    feedback.className = 'feedback-message success';
    submitBtn.disabled = false; // Desbloqueamos el botón de envío
}

function setInvalidState(msg) {
    usernameInput.classList.add('is-invalid');
    statusIcon.classList.add('error');
    feedback.textContent = msg;
    feedback.className = 'feedback-message error';
    submitBtn.disabled = true; // El botón sigue bloqueado
}

function resetState() {
    usernameInput.classList.remove('is-valid', 'is-invalid');
    statusIcon.className = 'status-icon';
    feedback.textContent = '';
    feedback.className = 'feedback-message';
}

// --- ENVÍO FINAL DEL FORMULARIO ---
document.getElementById('async-check-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('¡Perfil creado con éxito! Bienvenido a la comunidad de desarrolladores de élite.');
});
