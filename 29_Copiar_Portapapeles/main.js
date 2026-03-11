// Módulo de Copiar al Portapapeles: Clipboard API
// Al pulsar cada botón, copiamos el texto del elemento vinculado via 'data-target'
// y mostramos un feedback visual de éxito durante 2 segundos.

const copyButtons = document.querySelectorAll('.btn-copy');

// Asignamos la funcionalidad a cada botón de copia de la página.
copyButtons.forEach(button => {

    // La función del click debe ser 'async' porque 'clipboard.writeText' es una Promesa.
    button.addEventListener('click', async () => {
        
        // 1. Leemos el atributo data-target del botón para saber qué información copiar.
        const targetId = button.dataset.target;
        const textToCopy = document.getElementById(targetId).textContent;

        try {
            // 2. Escribimos el texto en el portapapeles del sistema operativo.
            //    'await' pausa aquí hasta que el SO confirme que se ha copiado.
            await navigator.clipboard.writeText(textToCopy);

            // 3. Si tuvo éxito, activamos la animación de feedback visual.
            showSuccess(button);
            
        } catch (err) {
            // Si el usuario bloqueó los permisos del portapapeles, mostramos un aviso.
            // Nota: 'navigator.clipboard' requiere HTTPS o localhost para funcionar.
            console.error('[Clipboard] Error al copiar:', err);
            alert('No se pudo copiar el texto. Asegúrate de que tu navegador tiene los permisos activados o que estás en una conexión segura (HTTPS).');
        }
    });
});

// --- FEEDBACK DE ÉXITO ---
// Añade la clase '.copied' al botón (que activa la animación CSS en verde)
// y la elimina automáticamente después de 2 segundos.
function showSuccess(btn) {
    btn.classList.add('copied');

    setTimeout(() => {
        btn.classList.remove('copied');
    }, 2000);
}
