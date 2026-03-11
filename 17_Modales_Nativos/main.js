// Módulo de Modales Nativos: Uso del elemento HTML <dialog>
// Los diálogos nativos gestionan automáticamente el foco y el bloqueo de fondo (backdrop).

const btnLogin = document.getElementById('btn-login');
const modalLogin = document.getElementById('modal-login');

const btnCart = document.getElementById('btn-cart');
const modalCart = document.getElementById('modal-cart');

// Seleccionamos todos los botones que tengan el atributo para cerrar modales.
const closeButtons = document.querySelectorAll('[data-close-modal]');

// --- APERTURA DE MODALES ---
// '.showModal()' abre el diálogo como un modal (con fondo oscuro y bloqueo de scroll).
btnLogin.addEventListener('click', () => {
    modalLogin.showModal(); 
});

btnCart.addEventListener('click', () => {
    modalCart.showModal();
});

// --- CIERRE DE MODALES ---
// Usamos delegación o un bucle para asignar la misma lógica a todos los botones de cierre.
closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Buscamos el elemento <dialog> más cercano al botón que recibió el clic.
        const dialogMaster = e.target.closest('dialog');
        if(dialogMaster) dialogMaster.close();
    });
});

// --- CIERRE AL CLICAR EN EL BACKDROP ---
// El <dialog> nativo rodea el modal con un '::backdrop'. Podemos detectar clics fuera del rect del diálogo.
const handleBackdropClick = (event) => {
    const dialog = event.currentTarget;
    const rect = dialog.getBoundingClientRect();
    
    // Comprobamos si el clic ocurrió dentro de las coordenadas del diálogo.
    const isInDialog = (
        rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX && event.clientX <= rect.left + rect.width
    );
        
    // Si el clic fue fuera de la "cajita" del diálogo, lo cerramos.
    if (!isInDialog) {
        dialog.close();
    }
};

modalLogin.addEventListener('click', handleBackdropClick);
modalCart.addEventListener('click', handleBackdropClick);
