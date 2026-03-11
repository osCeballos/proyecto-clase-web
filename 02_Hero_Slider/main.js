// Lógica del Hero Slider: Avance automático con control manual del usuario

// 1. Capturamos elementos DOM necesarios
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

// 2. Definición del estado del componente
let currentSlideIndex = 0; // Empezamos en la primera imagen (Índice cero en JS)
const totalSlides = slides.length; // Guardamos cuántas slides hay en total (3)
let autoPlayInterval; // Aquí guardaremos el ID del temporizador para poder matarlo luego
const TIME_BETWEEN_SLIDES = 5000; // 5 segundos en milisegundos

// 3. Función principal para cambiar de slide
function goToSlide(index) {
  // A. Primero "apagamos" todo (Quitar clases y atributos a11y)
  slides.forEach(slide => {
    slide.classList.remove('slide--active');
    slide.setAttribute('aria-hidden', 'true');
  });
  dots.forEach(dot => {
    dot.classList.remove('dot--active');
    dot.setAttribute('aria-selected', 'false');
  });

  // B. Luego "encendemos" solo el correcto
  slides[index].classList.add('slide--active');
  slides[index].removeAttribute('aria-hidden'); // a11y: "estoy visible"
  
  dots[index].classList.add('dot--active');
  dots[index].setAttribute('aria-selected', 'true');

  // Actualizamos nuestra memoria
  currentSlideIndex = index;
}

// 4. Lógica para ir a la siguiente slide
function nextSlide() {
  // Si estamos en la última (2), el siguiente es la primera (0). Si no, suma 1.
  let newIndex = currentSlideIndex === totalSlides - 1 ? 0 : currentSlideIndex + 1;
  goToSlide(newIndex);
}

// 5. Automatización: Reloj para el pase automático
function startAutoPlay() {
  // setInterval ejecuta repetidamente una función cada X ms
  autoPlayInterval = setInterval(() => {
    nextSlide();
  }, TIME_BETWEEN_SLIDES);
}

function resetAutoPlay() {
  // Reiniciamos el reloj para no interrumpir al usuario si cambia de imagen manualmente
  clearInterval(autoPlayInterval);
  startAutoPlay();
}

// 6. Asignar Eventos a los controles inferiores (Dots)

// Clics en los puntitos (Dots) inferiores
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    goToSlide(index);
    resetAutoPlay();
  });
});

// Pausar el slider si el ratón está encima para facilitar la lectura
const sliderContainer = document.querySelector('.hero-slider');
sliderContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
sliderContainer.addEventListener('mouseleave', () => startAutoPlay());

// 7. Arrancar el temporizador al cargar el archivo
startAutoPlay();
