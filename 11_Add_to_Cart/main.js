// Módulo de Botón "Añadir al Carrito": Estados Loading / Success
// Simula una llamada asíncrona a una API de carrito con feedback visual de 3 estados.
const cartBtn = document.getElementById('addToCartBtn');

// Flag de estado: evita que el usuario pulse el botón varias veces mientras se procesa.
let isProcessing = false;

// Al pulsar el botón, simulamos una llamada a la API del servidor (1.5 segundos de espera).
cartBtn.addEventListener('click', async () => {
  
  if (isProcessing) return; 
  
  isProcessing = true;
  cartBtn.setAttribute('disabled', 'true');
  
  cartBtn.classList.add('is-loading');

  // En producción, aquí iría: await fetch('/api/cart', { method: 'POST', ... });
  await new Promise(resolve => setTimeout(resolve, 1500));

  // La API respondió con éxito: pasamos al estado visual de confirmación.
  cartBtn.classList.remove('is-loading');
  cartBtn.classList.add('is-success');

  // Después de 2.5 segundos, restauramos el botón a su estado original.
  setTimeout(() => {
    cartBtn.classList.remove('is-success');
    cartBtn.removeAttribute('disabled');
    isProcessing = false;
  }, 2500);

});
