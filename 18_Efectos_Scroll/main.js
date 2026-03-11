// Módulo de Efectos de Scroll: Intersection Observer API
// Detecta cuando un elemento entra en pantalla para aplicar una animación de entrada (reveal).

const nodesToReveal = document.querySelectorAll('.reveal-item');

// --- CONFIGURACIÓN DEL OBSERVADOR ---
const observerOptions = {
    root: null, // El viewport (la pantalla visible) es el área de referencia.
    
    // Margin negativo para que el efecto ocurra un poco después de que asome (100px dentro).
    rootMargin: '0px 0px -100px 0px',
    
    threshold: 0 // Se activa en cuanto asoma el primer píxel (modificado por el margin).
};

// --- FUNCIÓN DE CALLBACK ---
// Se ejecuta cada vez que un elemento observado entra o sale del área definida.
const revealCallback = (entries, observerController) => {

    entries.forEach(entry => {
        // Si el elemento está entrando en el área visible:
        if (entry.isIntersecting) {
            
            // Añadimos la clase CSS que activa la animación.
            entry.target.classList.add('is-revealed');
            
            // Optimización: una vez revelado, dejamos de observarlo para ahorrar recursos.
            observerController.unobserve(entry.target);
            
        }
    });

};

// Creamos la instancia del observador.
const revealObserver = new IntersectionObserver(revealCallback, observerOptions);

// --- ACTIVACIÓN Y ACCESIBILIDAD ---
nodesToReveal.forEach(node => {
    // Respetamos la preferencia de accesibilidad 'prefers-reduced-motion'.
    // Si el usuario prefiere no ver animaciones, mostramos los elementos directamente.
    const mediaQueryObj = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (mediaQueryObj.matches) {
        node.classList.add('is-revealed');
    } else {
        revealObserver.observe(node);
    }
});
