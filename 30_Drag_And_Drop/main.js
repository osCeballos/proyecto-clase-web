// Módulo de Drag & Drop: File API del navegador
// Permite al usuario arrastrar archivos desde el escritorio o seleccionarlos con un clic.
// En ambos casos, mostramos el nombre, tipo y tamaño de cada archivo en una lista.

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const fileList = document.getElementById('file-list');
const fileCount = document.getElementById('file-count');

// --- PASO 1: NEUTRALIZAR EL COMPORTAMIENTO POR DEFECTO ---
// Por seguridad, si arrastras un archivo sobre Chrome, el navegador abandonaría tu web
// para abrir el archivo directamente. Interceptamos esos 4 eventos para impedirlo.
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();   // Cancela la acción por defecto del navegador
        e.stopPropagation(); // Evita que el evento suba al documento (document)
    }, false);
});

// --- PASO 2: FEEDBACK VISUAL DURANTE EL ARRASTRE ---
// Cuando el usuario sobrevuela la zona con un archivo, añadimos la clase '.drag-over'
// para cambiar el estilo (borde iluminado, fondo coloreado) y dar una pista visual.
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => { dropZone.classList.add('drag-over'); });
});

// Cuando el usuario sale de la zona o suelta el archivo, eliminamos el efecto.
['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => { dropZone.classList.remove('drag-over'); });
});

// --- PASO 3: CAPTURA DE ARCHIVOS POR ARRASTRE ---
// 'e.dataTransfer.files' contiene la lista de archivos que el usuario soltó.
dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
});

// --- PASO 4: CAPTURA DE ARCHIVOS POR CLIC ---
// El <input type="file"> invisible actúa como alternativa para usuarios que prefieren
// el selector de archivos clásico en lugar de arrastrar y soltar.
fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

// --- PROCESADO DE ARCHIVOS ---
// Convierte la FileList (objeto especial) a un Array común y añade cada archivo a la lista.
function handleFiles(files) {
    const filesArr = Array.from(files);
    filesArr.forEach(file => { addFileToList(file); });
    updateCount();
}

// --- CREACIÓN DE TARJETA DE ARCHIVO EN EL DOM ---
// Para cada archivo, creamos dinámicamente un <li> con su extensión, nombre y tamaño.
function addFileToList(file) {
    const li = document.createElement('li');
    li.classList.add('file-card');

    // Extraemos la extensión del archivo: dividimos por '.' y tomamos el último fragmento.
    const extension = file.name.split('.').pop().toUpperCase();
    
    // Convertimos el tamaño de bytes a kilobytes para que sea legible (ej: 243 KB).
    const size = (file.size / 1024).toFixed(1) + ' KB';

    li.innerHTML = `
        <div class="file-icon">${extension}</div>
        <div class="file-info">
            <p class="file-name">${file.name}</p>
            <p class="file-size">${size}</p>
        </div>
        <button class="btn-remove" aria-label="Eliminar ${file.name}">×</button>
    `;

    // Añadimos la funcionalidad para eliminar la tarjeta al pulsar el botón de borrado.
    li.querySelector('.btn-remove').addEventListener('click', () => {
        li.remove();
        updateCount();
    });

    fileList.appendChild(li);
    console.log(`[Sistema] Archivo preparado: ${file.name}`);
}

// --- ACTUALIZACIÓN DEL CONTADOR ---
// Cuenta los <li> hijos de la lista y actualiza el número visible en el título.
function updateCount() {
    fileCount.textContent = fileList.children.length;
}
