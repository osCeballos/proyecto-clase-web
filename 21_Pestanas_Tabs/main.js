// Módulo de Pestañas (Tabs): Delegación de Eventos y Accesibilidad
// Gestiona el cambio de contenido entre paneles al pulsar los botones superiores.

const tabsWrapper = document.getElementById('tabs-wrapper');
const buttons = tabsWrapper.querySelectorAll('.tab-btn');
const panels = tabsWrapper.querySelectorAll('.tab-panel');

// --- DELEGACIÓN DE EVENTOS ---
// En lugar de añadir un listener a cada botón, añadimos uno solo al contenedor padre.
tabsWrapper.addEventListener('click', (event) => {
  
  // Comprobamos si el clic (o el ancestro más cercano) es un botón de pestaña.
  const clickedBtn = event.target.closest('.tab-btn');
  
  // Si clicamos fuera de un botón, no hacemos nada.
  if (!clickedBtn) return;
  
  // Obtenemos el identificador de la pestaña (ej: 'home', 'profile') desde el data-attribute.
  const tabId = clickedBtn.dataset.tab;
  
  // 1. Limpieza global: quitamos la clase 'active' de todos los botones y paneles.
  buttons.forEach(btn => btn.classList.remove('active'));
  panels.forEach(panel => panel.classList.remove('active'));
  
  // 2. Activación: encendemos solo el botón clicado y su panel correspondiente.
  clickedBtn.classList.add('active');
  const targetPanel = document.getElementById(`panel-${tabId}`);
  if (targetPanel) {
    targetPanel.classList.add('active');
  }

  // 3. Accesibilidad ARIA: informamos al lector de pantalla de cuál es la pestaña seleccionada.
  buttons.forEach(btn => btn.setAttribute('aria-selected', 'false'));
  clickedBtn.setAttribute('aria-selected', 'true');
});
