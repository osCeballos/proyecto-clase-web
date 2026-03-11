// Módulo de Carruseles: CSS Scroll Snap + JS Scroll Control
// Aprovecha las propiedades nativas de CSS para el imán de las imágenes (Snap)
// y JavaScript para los botones de navegación (Prev/Next).

// --- CONFIGURACIÓN CARRUSEL HORIZONTAL (ESTILO NETFLIX) ---
const trackH = document.getElementById('slider-track-h');
const btnPrevH = document.getElementById('btn-prev-h');
const btnNextH = document.getElementById('btn-next-h');

// Función genérica para desplazar el scroll lateralmente con suavidad.
const desplazarHorizontal = (pixels) => {
    trackH.scrollBy({
        left: pixels,
        behavior: 'smooth'
    });
};

btnPrevH.addEventListener('click', () => desplazarHorizontal(-320));
btnNextH.addEventListener('click', () => desplazarHorizontal(320));


// --- CONFIGURACIÓN CARRUSEL VERTICAL (ESTILO TIKTOK) ---
const trackV = document.getElementById('slider-track-v');
const btnPrevV = document.getElementById('btn-prev-v');
const btnNextV = document.getElementById('btn-next-v');

// Función genérica para desplazar el scroll verticalmente con suavidad.
const desplazarVertical = (pixels) => {
    trackV.scrollBy({
        top: pixels,
        behavior: 'smooth'
    });
};

btnPrevV.addEventListener('click', () => desplazarVertical(-500));
btnNextV.addEventListener('click', () => desplazarVertical(500));
