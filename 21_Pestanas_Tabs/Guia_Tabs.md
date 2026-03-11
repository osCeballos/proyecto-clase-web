# Pestañas (Tabs) con Delegación de Eventos 🗂️

## 1. ¿Qué vamos a construir?
Vamos a crear uno de los componentes más comunes y útiles en diseño web: Un sistema de **Pestañas (Tabs)**.
Permiten organizar mucha información en poco espacio, cambiando el contenido que se muestra al hacer clic en distintos botones.
A nivel de código, la magia real de esta lección no está en el resultado visual, sino en cómo programaremos el JavaScript usando el patrón de Arquitectura Avanzada llamado **Delegación de Eventos**. 

---

## 2. Conceptos Clave antes de empezar
*   **Delegación de Eventos:** Si aprendes a hacer esto, dejarás de ser un programador "Junior". Históricamente, si tenías 5 pestañas, creabas 5 "escuchas" (`addEventListener`) en JavaScript. ¿Y si tuvieras 100 pestañas? El rendimiento caería en picado. La delegación consiste en poner **UN SÓLO** vigilante gigante en la caja padre que envuelva a todas las pestañas. Cuando el usuario hace click, el evento "Burbujea" hacia arriba hasta llegar al Vigilante gigante, y es él quien decide (diciéndole mágicamente gracias al `event.target` a qué botón atinaste) a qué pestaña le toca abrirse.
*   **Gestión de Estados (Active):** Un sistema de pestañas se basa en añadir o quitar una clase simple (como `.active`) a los botones y a los paneles informativos. Con CSS, le decimos que todo panel que **no** tenga `.active`, tendrá `display: none`.
*   **Atributos A11Y (Accesibilidad):** Para que un usuario ciego sepa en qué pestaña está, no le sirve ver el "colorcito cambiado". El lector de pantalla buscará atributos obligatorios como `role="tab"` o `aria-selected="true"`. Si no los pones, eres un mal desarrollador en 2024.

---

## 3. Paso a paso

### Fase 1: El HTML y los puentes "Data-"

Fíjate en cómo están construidos los botones y los paneles. Para que Javascript sepa que el "Botón 1" debe abrir el "Panel 1", usamos los maravillos atributos de datos personalizados de HTML5. En este caso: `data-tab="1"`. También nota los atributos de accesibilidad como `role` y `aria-selected`.

Copia en `index.html`:

```html
<header class="header">
  <div class="header-container">
    <div class="logo">DevTools<span style="color:var(--color-primary)">.</span></div>
  </div>
</header>

<main class="content">
  <section class="tabs-section">
    <div class="section-header">
      <h1>Recursos del Módulo</h1>
      <p>Explora la documentación, los activos visuales y los ejemplos de código para esta sección del curso.</p>
    </div>

    <!-- EL ABUELO: Este es el único <div> que vigilaremos con Javascript -->
    <div class="tabs-container" id="tabs-wrapper">
      
      <!-- LOS BOTONES -->
      <div class="tabs-nav" role="tablist">
        <button class="tab-btn active" data-tab="1" role="tab" aria-selected="true" aria-controls="panel-1">Documentación</button>
        <button class="tab-btn" data-tab="2" role="tab" aria-selected="false" aria-controls="panel-2">Activos</button>
        <button class="tab-btn" data-tab="3" role="tab" aria-selected="false" aria-controls="panel-3">Ejemplos</button>
      </div>

      <!-- LOS PANELES -->
      <div class="tabs-panels">
        
        <!-- Arrancamos la web con el primer panel visible (.active) -->
        <article class="tab-panel active" id="panel-1" role="tabpanel">
          <h2>Guía Teórica</h2>
          <p>En esta sección encontrarás toda la teoría detallada sobre los conceptos clave de este módulo.</p>
        </article>

        <article class="tab-panel" id="panel-2" role="tabpanel">
          <h2>Recursos Visuales</h2>
          <p>Descarga aquí los iconos, imágenes y fuentes necesarias para completar tus ejercicios prácticos.</p>
        </article>

        <article class="tab-panel" id="panel-3" role="tabpanel">
          <h2>Código Fuente</h2>
          <p>Accede a los archivos de código final para comparar tu solución con la propuesta por el profesor.</p>
        </article>

      </div>
    </div>
  </section>
</main>
```

### Fase 2: El CSS, Displays y Keyframes

Vamos a dejarlo todo bonito. Atiende a cómo destruimos el diseño base del `<button>` para que parezcan pestañas puras. Y el detalle más sabroso: la animación `@keyframes`. Cuando le inyectamos `.active` a un panel, este no solo "aparece" de golpe, sino que lo programamos para que baje un poquito (10px) en el eje Y y se desvanezca sutilmente hacia arriba, dando una sensación tremenda de calidad.

Vuelca este estilo en `style.css`:

```css
:root { --color-bg: #F8FAFC; --color-surface: #FFFFFF; --color-text: #1E293B; --color-primary: #6366F1; --color-border: #E2E8F0; }

* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Outfit', system-ui, sans-serif; background: var(--color-bg); color: var(--color-text); }

.header { background: var(--color-surface); padding: 1rem; border-bottom: 1px solid var(--color-border); }
.logo { font-size: 1.25rem; font-weight: 800; max-width: 900px; margin: 0 auto; }
.content { max-width: 900px; margin: 0 auto; padding: 4rem 1.5rem; }
.section-header { margin-bottom: 3rem; text-align: center; }
.section-header h1 { font-size: 2.5rem; letter-spacing: -0.02em; margin-bottom: 0.5rem; }

/* ========================================
   CONTENEDOR PRINCIPAL Y BOTONERÍA
   ======================================== */
.tabs-container { background: var(--color-surface); border-radius: 20px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); border: 1px solid var(--color-border); overflow: hidden; }

.tabs-nav {
  display: flex; gap: 0.25rem;
  background: var(--color-bg); padding: 0.5rem; border-bottom: 1px solid var(--color-border);
}

.tab-btn {
  /* Al poner Flex 1, sin importar si hay 3, 4 o 5 botones, todos se partirán el 100% de la caja de forma matemáticamente exacta y equitativa automáticamente. */
  flex: 1; 
  
  padding: 1rem; cursor: pointer; border-radius: 12px;
  background: transparent; border: none; font-family: inherit; font-size: 0.95rem; font-weight: 600; color: #64748B;
  transition: all 0.2s;
}

/* Modificadores de Estado (El Botón Encendido) */
.tab-btn.active { color: var(--color-primary); background: var(--color-surface); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.tab-btn:hover:not(.active) { background: rgba(0,0,0,0.02); color: var(--color-text); }


/* ========================================
   EL FOSO DE LAS RESPUESTAS (PANELES)
   ======================================== */
.tabs-panels { padding: 2.5rem; min-height: 250px; }

.tab-panel {
  display: none; /* Todo oculto por norma obligatoria humana */
  animation: fadeIn 0.4s ease-out; /* Esta micro-animación saltará en el instante exacto en el que JS le cambie el display none a block */
}

/* El Modificador de Estado del Panel Visible */
.tab-panel.active { display: block; }
.tab-panel h2 { margin-bottom: 1rem; color: #0F172A; }
.tab-panel p { line-height: 1.8; color: #475569; }

/* Efecto de Sublimación Suave (Deslizamiento desde abajo) */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsividad (Móvil) */
@media (max-width: 600px) {
  .tabs-nav { flex-direction: column; } /* En móvil las pestañas se apilan para no apretarse */
}
```

### Fase 3: La Elegancia Táctica (JS)

Ha llegado la hora mágica. Vamos a programar toda la página web con UN SÓLO radar de escuchas.
Si te fijas, el `addEventListener` se lo ponemos al Padre Supremo `tabsWrapper`. Como el padre es ciego y recibe el click que en realidad le hemos dado al botón en su interior, necesitamos usar el glorioso comando JS `.closest('.tab-btn')`. Su misión es decir: "Eh evento click, busca entre lo que has tocado o en tus ancestros si alguna caja coincide con ser el botón de la pestaña". Si has tocado fuera de ellos, aborta operaciones (`return`). Si lo tocaste... orquesta el cruce de datos y haz todo el borrado global para re-encender la pareja Botón/Panel correspondientes.

Vuelca tus respetos arquitectónicos en el `main.js`:

```javascript
const tabsWrapper = document.getElementById('tabs-wrapper');
const buttons = tabsWrapper.querySelectorAll('.tab-btn');
const panels = tabsWrapper.querySelectorAll('.tab-panel');

// 1. EL OJO QUE TODO LO VE (DELEGACIÓN DE EVENTOS EN EL ABUELO)
tabsWrapper.addEventListener('click', (event) => {
  
  // 2. Tanteamos lo que hemos tocado. ¿Es un elemento que tenga la clase ".tab-btn"?
  const clickedBtn = event.target.closest('.tab-btn');
  if (!clickedBtn) return; // Si la palpa con el ratón y resulta que le di al espacio en blanco de al lado... ignórame.
  
  // 3. RECUPERACIÓN DE COORDENADAS: Devuélveme el número secreto que escondía ese HTML
  const tabId = clickedBtn.dataset.tab;
  
  // 4. PURIFICACIÓN TÁCTICA (APAGÓN GENERAL). Resetea todas las pestañas.
  buttons.forEach(btn => btn.classList.remove('active'));
  panels.forEach(panel => panel.classList.remove('active'));
  
  // 5. RESURRECCIÓN OBJETIVO. Enciende sólo aquél que ordenaste.
  clickedBtn.classList.add('active');
  
  // Cruzamos el número robado (ej: 2) para encender mágicamente su panel hermano ("panel-2")
  const targetPanel = document.getElementById(`panel-${tabId}`);
  if (targetPanel) {
    targetPanel.classList.add('active');
  }

  // 6. ACTUALIZACIÓN A11Y PARA CIEGOS
  buttons.forEach(btn => btn.setAttribute('aria-selected', 'false'));
  clickedBtn.setAttribute('aria-selected', 'true');
});
```

Increíble. Te invito a hacer un experimento: Ve al HTML. Añade un nuevo botón en la botonera y ponle `data-tab="4"`. Luego, añade un nuevo panel abajo y ponle `id="panel-4"`. Guarda el HTML. Ve a la web y púlsalo.
¡Funciona! No has tenido que añadir nuevas configuraciones al JS, no has creado un cuarto vigilante `addEventListener`. Simplemente por existir, el vigilante global lo ha absorbido y ha escaneado su ADN conectándolo sin fallos a su panel. Escalabilidad de nivel Senior lograda. Mágico.
