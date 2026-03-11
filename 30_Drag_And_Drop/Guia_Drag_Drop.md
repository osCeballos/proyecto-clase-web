# Drag & Drop Zone (Magia de la File API) 📂

## 1. ¿Qué vamos a construir?
Hasta ahora, nuestras páginas web eran como casas sin ventanas: todo lo que pasaba dentro, se quedaba dentro. Hoy vamos a abrir la puerta al mundo real (el ordenador del usuario).
Vamos a construir una **Zona de Arrastre (Drop Zone)**. Permite al usuario agarrar una imagen, un PDF o un ZIP desde su escritorio y soltarlo dentro de nuestra web. Al hacerlo, nuestra interfaz reaccionará leyendo el nombre, peso y formato del archivo, y lo pintará en una lista elegante debajo.

---

## 2. Conceptos Clave antes de empezar
*   **La Guardia del Navegador (`e.preventDefault()`)**: Por seguridad, si arrastras una imagen encima de Chrome, el navegador abandona tu web para abrir la imagen a pantalla completa. Para construir nuestra "zona de aterrizaje segura", lo primero que haremos es usar JS para bloquear este comportamiento por defecto a toda costa en momentos de *"drag"* (arrastre).
*   **La API de Archivos (`e.dataTransfer.files`)**: Cuando el usuario suelta (`drop`) el archivo, el evento nos regala un "paquete" con toda la información. Esta API nos permite acceder a la propiedad `.name` (nombre), `.size` (peso en bytes) y tipo, sin tener que subir nada a ningún servidor.
*   **Micro-Feedback al vuelo (`.drag-over`)**: Una buena interfaz *"habla"*. Si un usuario arrastra un archivo por encima de tu zona interactiva y no pasa nada visualmente, no sabrá si puede soltarlo o no. Usaremos eventos JS para inyectar una clase CSS temporal (`.drag-over`) que encienda la caja (borde destacado, cambio de color) justo durante los segundos que el ratón está sobrevolando.

---

## 3. Paso a paso

### Fase 1: El HTML y el Topo Infiltrado (Input File)

Nuestra interfaz consta de dos partes: La enorme caja de arrastre arriba (`.drop-zone`), y la zona de visualización de resultados abajo (`.file-list-container`).

Ojo al truco maestro de los profesionales dentro de `.drop-zone`: **Hay un `<input type="file">` invisible**. ¿Por qué? Porque a algunos usuarios no les gusta arrastrar archivos, prefieren hacer clic clásico. Al tener este input con opacidad 0 ocupando el 100% del tamaño de la caja padre, conseguimos que tanto si el usuario hace clic como si arrastra... la web funcione perfecto. Es un diseño a prueba de balas.

Escribe esta estructura en `index.html`:

```html
<header class="header">
  <div class="header-container">
    <div class="logo">DropMedia<span style="color:var(--color-primary)">.</span></div>
  </div>
</header>

<main class="content">
  <section class="drop-section">
    <div class="section-header">
      <h1>Cargador de Prácticas</h1>
      <p>Arrastra y suelta tus archivos de proyecto para prepararlos antes de la entrega.</p>
    </div>

    <!-- EL CAMPO MAGNÉTICO (ZONA INTERACTIVA) -->
    <div class="drop-zone" id="drop-zone">
      
      <!-- Iconografía Visual Decorativa -->
      <div class="drop-zone-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
      </div>
      <div class="drop-zone-text">
        <p class="main-text">Arrastra tus archivos aquí</p>
        <p class="sub-text">O haz clic para seleccionar (Máx. 5MB)</p>
      </div>

      <!-- EL TOPO: Input File totalmente transparente para abarcar todo -->
      <input type="file" id="file-input" class="file-input" multiple>
      
    </div>

    <!-- EL TABLÓN DE ANUNCIOS: Resultados post-captura -->
    <div class="file-list-container">
      <h3>Archivos Preparados (<span id="file-count">0</span>)</h3>
      <ul class="file-list" id="file-list">
        <!-- Los li se fabricarán con JS dinámicamente -->
      </ul>
    </div>

  </section>
</main>
```

### Fase 2: CSS y la Transformación en Vuelo

Un diseño impecable. Fíjate en la clase principal `.drop-zone`. Tiene bordes discontinuos, típicos de estas zonas. 
La clave es la regla especial `.drop-zone.drag-over`. El JS añadirá esta clase miles de veces por segundo y la quitará en décimas de segundo cada vez que entremos y salgamos flotando con un archivo. Las piezas bailarán (`transform: scale(1.02)`), y el icono saltará ligeramente hacia arriba, todo envuelto de un fondo tintado. 

Copia esto en tu `style.css`:

```css
:root { --color-bg: #F8FAFC; --color-surface: #FFFFFF; --color-text: #1E293B; --color-accent: #6366F1; --color-accent-soft: rgba(99, 102, 241, 0.05); --color-border: #E2E8F0; --color-success: #10B981; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', system-ui, sans-serif; background-color: var(--color-bg); color: var(--color-text); line-height: 1.6; }

/* BASES MACRO */
.header { background: white; padding: 1.5rem; border-bottom: 1px solid var(--color-border); }
.logo { font-size: 1.5rem; font-weight: 800; max-width: 800px; margin: 0 auto; }
.content { max-width: 800px; margin: 0 auto; padding: 4rem 1.5rem; }
.section-header { text-align: center; margin-bottom: 3rem; }

/* ========================================
   LA PISTA DE ATERRIZAJE (DROP ZONE)
   ======================================== */
.drop-zone { position: relative; background: var(--color-surface); border: 2px dashed var(--color-border); border-radius: 20px; padding: 4rem 2rem; text-align: center; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; }

/* LA METAMORFOSIS AL SOBREVOLAR (Controlada por JS) */
.drop-zone.drag-over { border-color: var(--color-accent); background-color: var(--color-accent-soft); transform: scale(1.02); box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.1); }

/* Decoración Iconográfica Interna */
.drop-zone-icon { width: 64px; height: 64px; margin: 0 auto 1.5rem; color: #94A3B8; transition: color 0.3s, transform 0.3s; }
.drop-zone.drag-over .drop-zone-icon { color: var(--color-accent); transform: translateY(-5px); }
.main-text { font-size: 1.25rem; font-weight: 700; color: #334155; margin-bottom: 0.5rem; }
.sub-text { color: #94A3B8; font-size: 0.9rem; }

/* MASTERCLASS MENTAL: El Input Invisible que abarca todo */
.file-input { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }


/* ========================================
   DISEÑO TARJETAS DE RESULTADO POST-CAPTURA
   ======================================== */
.file-list-container { margin-top: 3rem; }
.file-list-container h3 { font-size: 1.1rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; }
.file-list { list-style: none; display: grid; gap: 1rem; }

.file-card { background: white; padding: 1rem; border-radius: 12px; border: 1px solid var(--color-border); display: flex; align-items: center; gap: 1rem; animation: slideIn 0.3s ease-out forwards; }

@keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }

/* Falsa Generación de Icono de Archivo Extraído por JS (PDF, JPG, ZIP...) */
.file-icon { width: 40px; height: 40px; background: #F1F5F9; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--color-accent); font-weight: 800; font-size: 0.7rem; }
.file-info { flex: 1; min-width: 0; }
.file-name { font-weight: 600; font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.file-size { font-size: 0.8rem; color: #94A3B8; }

/* Botón Destructor */
.btn-remove { background: none; border: none; color: #EF4444; cursor: pointer; font-size: 1.25rem; padding: 0.5rem; transition: opacity 0.2s; }
.btn-remove:hover { opacity: 0.6; }
```


### Fase 3: Domar a la Bestia y Fabricar el DOM

1. Pasamos una lista de 4 eventos de ratón para interceptarlos en un bucle ciego y decirle a la web *"Alto, ni se te ocurra abrir la imagen del usuario"*, reseteando sus intenciones con `.preventDefault()`.
2. Encendemos o apagamos el efecto estanque (`.drag-over`) leyendo la entrada y la salida física del ratón en la zona del div HTML.
3. El momento clave: Al evento de "Gota" (`drop`), abrimos un portal interceptando la matriz de datos con `e.dataTransfer.files`.
4. Una vez nos de los datos puros, pasamos los archivos a una cadena de montaje llamada `addFileToList(file)` donde usamos matemáticas divinas `(file.size / 1024)` para reducir el abismal número de **bytes** a legibles **KiloBytes**.

Inserta el motor final en `main.js`:

```javascript
// Localizamos los Nodos Vitales de control
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const fileList = document.getElementById('file-list');
const fileCount = document.getElementById('file-count');

// PASO 1 - ANESTESIAR EVENTOS (Inhibidores Reactivos Por Defecto)
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
        // Inhibición Fundamental del comportamiento de navegador clásico
        e.preventDefault();
        e.stopPropagation();
    }, false);
});

// PASO 2 - RADAR VISUAL REACTIVO
// Encendido Óptico cuando hay sobrevuelo de amenaza
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => { dropZone.classList.add('drag-over'); });
});
// Apagado Óptico en retirada y caída a base
['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => { dropZone.classList.remove('drag-over'); });
});

// PASO 3 - ATRApar EL BOTÍN (DragDrop Clásico)
dropZone.addEventListener('drop', (e) => {
    // Aquí interceptamos el paquete comprimido DataTransfer del Sistema Operativo
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files); // Ejecutar rutina de Inyección HTML
});

// PASO 4 - RUTA ALTERNATIVA A SALVO DE FALLOS (Doble Vía de entrada para el usuario que hace click)
fileInput.addEventListener('change', (e) => {
    // Captura estandar de Target en Input type='file'
    handleFiles(e.target.files);
});

// SUB SISTEMAS RUTINARIOS HTML GENERATOR: 
function handleFiles(files) {
    // Conversor Seguro a Array Nato
    const filesArr = Array.from(files);
    
    filesArr.forEach(file => { addFileToList(file); });
    updateCount();
}

function addFileToList(file) {
    const li = document.createElement('li');
    li.classList.add('file-card');

    // MÁGIA DE RECONOCIMIENTO: 1) Partimos el nombre por el punto (.) 2) Extraemos la punta final, 3) Lo convertimos a Mayúsculas Gigantes
    const extension = file.name.split('.').pop().toUpperCase();
    
    // REDUCCIÓN MATEMÁTICA: Nos manda bytes (243204 bytes) que asustan al usuario normal. Los dividimos entre 1024 a para darlos en formato (KB). Decimal truncado a 1 con toFixed.
    const size = (file.size / 1024).toFixed(1) + ' KB';

    // Generador Visual Creado al Ojo Humano
    li.innerHTML = `
        <div class="file-icon">${extension}</div>
        <div class="file-info">
            <p class="file-name">${file.name}</p>
            <p class="file-size">${size}</p>
        </div>
        <button class="btn-remove">×</button>
    `;

    // Botón de asesinato condicionado intra-li extra
    li.querySelector('.btn-remove').addEventListener('click', () => {
        li.remove();
        updateCount();
    });

    fileList.appendChild(li);
    console.log(`Sistema: Archivo "${file.name}" detectado y procesado.`);
}

function updateCount() {
    // Calculador Constante en tiempo Real (Longitud de hijos Array)
    fileCount.textContent = fileList.children.length;
}
```

Precioso. Arrastra una imagen desde el escritorio de tu ordenador hacia el cuadrado del código de tu navegador y observa el nivel 99 del diseño Frontend: interactuar con el ecosistema de la máquina del usuario final. Has entrado en las Grandes Ligas.
