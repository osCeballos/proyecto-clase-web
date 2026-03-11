
const typed = new Typed('#typewriter', {
  // Array de frases a mostrar
  strings: [
    "Consectetur adipiscing elit.",
    "Sed do eiusmod tempor.",
    "Incididunt ut labore."
  ],
  
  // Configuración de tiempos y ritmos (milisegundos)
  typeSpeed: 60,       
  backSpeed: 30,       
  startDelay: 1000,    
  backDelay: 2000,     
  
  // Comportamiento de reproducción y visualización
  loop: true,          
  cursorChar: '|',     
  autoInsertCss: true  
});