# Acordeones Nativos (Details & Summary) 🪗

## 1. ¿Qué vamos a construir?
Es hora de tirar a la basura años de código "Spaghetti" en Javascript y librerías kilométricas para hacer componentes tipo "Preguntas Frecuentes" (FAQ).
Históricamente, los desarrolladores evitaban las etiquetas `<details>` y `<summary>` de HTML5 porque hace 10 años eran feas y su animación de abrirse era seca. Preferían crear decenas de etiquetas `<div>` cargadas de pesadas animaciones con JS. 
Hoy, vamos a usar **HTML Semántico** para obtener de forma nativa Accesibilidad (Uso de Espacio/Enter para abrir sin programar Event Listeners) y lo vestiremos con un truquito ultramoderno de **CSS Grid** para que su animación de apertura y colapso fluya como el agua.

---

## 2. Conceptos Clave antes de empezar
*   **La pareja de hierro:** Así como `<ul>` necesita `<li>`, el elemento contenedor `<details>` solo existe si dentro tiene como primer hijo un `<summary>` (La cabecera o botón) seguido del texto que esconde. No pongas clases absurdas como `.is-open`; HTML le inyecta dinámicamente el atributo booleano `open` cuando se abre.
*   **Animando la Estática:** El navegador cambia el contenido escondido de `display: none` a `block` nativamente, lo que anula cualquier animación `transition`. El truco experto de hoy es rodear la respuesta con un contenedor que funcione con **`display: grid`**, para forzar una transición de `grid-template-rows: 0fr` a `1fr`. ¡Magia física!

---

## 3. Paso a paso

### Fase 1: HTML Semántico Inquebrantable

En tu archivo base, fíjate cómo todos los ítems de FAQ tienen su etiqueta Details con un Summary. Hemos inyectado el atributo `open` en seco en el primero para que el usuario, al entrar, ya vea uno abierto a modo de cebo visual.

Copia la estructura básica en `index.html`:

```html
<header class="header">
  <div class="header-container">
    <div class="logo">HelpCenter<span style="color:var(--color-primary)">.</span></div>
  </div>
</header>

<main class="content">
  <section class="faq-section">
    <div class="section-header">
      <h1>Preguntas Frecuentes</h1>
      <p>Todo lo que necesitas saber sobre nuestro proceso de trabajo y metodología.</p>
    </div>

    <!-- El Sistema Global de Preguntas Cajas -->
    <div class="accordion-container">
      
      <!-- Ítem 1: Nacido Abierto (Lleva 'open') -->
      <details class="accordion-item" open>
        <summary class="accordion-header">
          <span class="header-text">¿Cómo empiezo el curso?</span>
          <!-- Nuestro componente para el '+' o la Flecha -->
          <span class="icon"></span>
        </summary>
        
        <!-- Contenedores clave para animar GRID 0fr -> 1fr -->
        <div class="accordion-content">
          <div class="content-inner">
            <p>Es muy sencillo. Solo necesitas registrarte en nuestra plataforma y tendrás acceso inmediato a todos los módulos y recursos descargables desde el primer día.</p>
          </div>
        </div>
      </details>

      <!-- Ítem 2: Nace colapsado oculto -->
      <details class="accordion-item">
        <summary class="accordion-header">
          <span class="header-text">¿Necesito conocimientos previos?</span>
          <span class="icon"></span>
        </summary>
        <div class="accordion-content">
          <div class="content-inner">
            <p>No es necesario. El curso está diseñado para empezar desde cero, guiándote paso a paso a través de conceptos básicos hasta técnicas avanzadas de desarrollo profesional.</p>
          </div>
        </div>
      </details>

      <!-- Ítem 3 -->
      <details class="accordion-item">
        <summary class="accordion-header">
          <span class="header-text">¿Obtendré un certificado al finalizar?</span>
          <span class="icon"></span>
        </summary>
        <div class="accordion-content">
          <div class="content-inner">
            <p>Sí, al completar todos los proyectos y evaluaciones, recibirás un certificado digital que acredita tus conocimientos y habilidades en desarrollo frontend moderno.</p>
          </div>
        </div>
      </details>

    </div>
  </section>
</main>
```

### Fase 2: Domando a la Bestia de Chrome con CSS

Al añadir `<details>`, verás que a la izquierda del texto el navegador de Google Chrome pinta un feo y prehistórico "triangulito negro". Seremos los dueños del diseño, lo asesinaremos con el selector `::-webkit-details-marker`, y crearemos nuestro propio símbolo de [+] y [-] que girará delicadamente usando el cambio dinámico del selector `[open]`. Echa un buen vistazo al final del archivo al espectacular truco del `grid-template-rows`.

Inyecta este código en `style.css`:

```css
:root { --color-bg: #F0F4F8; --color-surface: #FFFFFF; --color-text: #1A202C; --color-primary: #3182CE; --color-border: #E2E8F0; --color-accent: #EBF8FF; --transition-speed: 0.3s; }

* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', system-ui, sans-serif; background-color: var(--color-bg); color: var(--color-text); line-height: 1.6; }

/* DECORADOS GENÉRICOS DE CADA TALLER */
.header { background: var(--color-surface); padding: 1rem; border-bottom: 1px solid var(--color-border); }
.logo { font-size: 1.25rem; font-weight: 700; max-width: 800px; margin: 0 auto; }
.content { max-width: 800px; margin: 0 auto; padding: 4rem 1.5rem; }
.section-header { margin-bottom: 3rem; text-align: center; }
.section-header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; color: #2D3748; }

/* ========================================
   CAJAS DEL ACORDEÓN
   ======================================== */
.accordion-container { display: flex; flex-direction: column; gap: 1rem; }

.accordion-item {
  background: var(--color-surface);
  border: 1px solid var(--color-border); border-radius: 12px;
  overflow: hidden;
  transition: all var(--transition-speed);
}

/* LA MAGIA DEL ATRIBUTO INYECTADO "OPEN" (Bordecito luminoso sexy) */
.accordion-item[open] { border-color: var(--color-primary); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }

/* RESET DEL MARCADOR NATIVO 🔫 */
.accordion-header {
  list-style: none; /* Estándar Web Firefox */
  padding: 1.25rem 1.5rem; cursor: pointer;
  display: flex; justify-content: space-between; align-items: center;
  user-select: none; font-weight: 600;
  transition: background 0.2s;
}

/* El verdugo del Triángulo de Chrome / WebKit */
.accordion-header::-webkit-details-marker { display: none; }
.accordion-header:hover { background-color: var(--color-accent); }

/* ICONO PERSONALIZADO (Construimos un signo [+] con psuedo-elementos sin meter un feo SVG en el HTML) */
.icon { width: 20px; height: 20px; position: relative; transition: transform var(--transition-speed); }
.icon::before, .icon::after { content: ''; position: absolute; background-color: var(--color-primary); border-radius: 2px; transition: all var(--transition-speed); }
/* Línea Vertical y Horizontal del "Más (+)" */
.icon::before { width: 2px; height: 12px; left: 9px; top: 4px; }
.icon::after { width: 12px; height: 2px; left: 4px; top: 9px; }

/* CUANDO HTML5 ABRA EL ELEMENTO... Transformamos la cruz "+" en un Lado "-"  */
.accordion-item[open] .icon { transform: rotate(90deg); }
.accordion-item[open] .icon::before { opacity: 0; }

/* ========================================
   LA MÁGICA ANIMACIÓN FRACCIONARIA GRID CSS 🔮
   ======================================== */
.accordion-content {
  display: grid;
  /* Altura base nula, la aplastamos como un papel de Fila a 0px */
  grid-template-rows: 0fr; 
  transition: grid-template-rows var(--transition-speed) ease-out;
}

.accordion-item[open] .accordion-content {
  /* ¡Milagro Matemático! Se autocalcula a la altura 100% que necesite su div hijo interno y se anima suave */
  grid-template-rows: 1fr; 
}

/* Para que este truco CSS funcione sin rebanar por la mitad el texto interno, requería esto: */
.content-inner { overflow: hidden; padding: 0 1.5rem; }
.accordion-item[open] .content-inner { padding-bottom: 1.5rem; }
.content-inner p { color: #4A5568; font-size: 1rem; }
```

### Fase 3: La Elegancia Táctica (JS)

¡Acabas de montar y diseñar el acordeón! Préndelo al navegador: Ya es funcional... Ábrelos, clickéalos, y navega tu web dándole a la tecla 'Tabulador' en PC de mesa verás que tiene accesibilidad ciega lista y que con el botón Espacio abres y cierras las respuestas. Brutal.

**El Problema UX:** Los usuarios abren una pregunta en el FAQ, pero nunca la cierran. Siguen haciendo scroll y abriendo nuevas preguntas hasta que tienen 4 páginas tamaño Biblia A4 abiertas consumiendo memoria visual en la pantalla.
**La Solución:** Un micro script súper tonto de 14 líneas de JavaScript que, al disparar el evento `toggle` de un acordeón que esté abierto, escanee el resto de sus hermanos... y los cierre automáticamente cortando de lado su atributo `.open`.

Pega en `main.js`:

```javascript
// ACUERDOS EXCLUSIVOS: Sólo "Los inmortales" puede quedar uno.
const accordions = document.querySelectorAll('.accordion-item');

// Escuchamos el evento nativo del nodo de DOM "<details>"
accordions.forEach((currentAccordion) => {
  currentAccordion.addEventListener('toggle', () => {
    
    // Si la compuerta acaba de pasar a estar abierta físicamente...
    if (currentAccordion.open) {
      
      // ...buscamos por tu vecindario al resto de compuertas
      accordions.forEach((accordion) => {
        // Y a las que no son como yo (La que he disparado el suceso)
        if (accordion !== currentAccordion) {
          // Las apago re-escribiendo su cualidad booleana nativa como Incierta
          accordion.open = false;
        }
      });
      
    }
  });
});
```
Y si tu conexión a la página o motor Javascript "Crashea" o casca... este Acordeón seguirá funcionando puramente en HTML/CSS, sólo perdiendo esa cualidad de auto-cierre exclusivo de entre sus hermanos. Eso se llama Programación Responsable con Mejora Progresiva para todos.
