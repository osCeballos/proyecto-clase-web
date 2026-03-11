# Flip Card 3D (Escaparate Interactivo) 🎴

## 1. ¿Qué vamos a construir?
En el diseño de interfaces moderno a menudo nos enfrentamos a un problema de espacio: "Quiero mostrar una foto gigante e inspiradora del producto, pero también necesito mostrar una lista aburrida de tallas y materiales".

La solución más elegante de la Web 3.0 es la **Flip Card** (Tarjeta Giratoria). 
Aprovechando que el ser humano asume que todo cuadrado plano en el mundo real tiene una "espalda", crearemos la ilusión tridimensional de darle la vuelta a la carta al pasar el cursor (o hacer click) para revelar más datos en la parte posterior.

---

## 2. Conceptos Clave antes de empezar
*   **El Eje 3D (La Tríada de CSS):** Por defecto la web es un folio plano (2D). Para girar un elemento necesitamos encender el motor 3D del navegador usando 3 comandos mágicos: la lente de la cámara (`perspective`), conservar el volumen (`transform-style`), y la transparencia de la espalda (`backface-visibility`).
*   **Posiciones Absolutas:** Las dos caras de la carta (`front` y `back`) vivirán superpuestas físicamente en las mismas coordenadas exactas gracias al position absolute, pero una nacerá ya girada espaldas (180 grados).
*   **El Problema Táctil:** El `:hover` funciona perfecto con el ratón, pero en móviles y tablets no hay cursor volando. Necesitaremos JS para que, al tocar la pantalla con el dedo, el giro se quede anclado.

---

## 3. Paso a paso

### Fase 1: El Esqueleto de las Dos Caras (HTML)

Vamos a estructurar nuestra Carta 3D como las `Matrioshkas` rusas.
Necesitamos un escenario padre estático (La Cámara), un hijo intermedio que sea la bisagra que gira (La Carta), y dos nietos que representan las pieles pintadas (Cara Frontal A y Cara Trasera B).

*(Utilizamos textos "Lorem Ipsum" estructurales en este laboratorio)*.

```html
<main class="gallery">
  
  <!-- LA CÁMARA (Padre Exterior Fijo) -->
  <div class="scene">
    
    <!-- LA BISAGRA (Es lo que rotará en código) 
         A11y: tabindex="0" la hace seleccionable con Tab de teclado
    -->
    <article class="card" tabindex="0" role="button" aria-expanded="false">
      
      <!-- CARA A: El Escaparate (Blanco) -->
      <div class="card__face card__face--front">
        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400" alt="Zapatilla Running Roja" class="card__img">
        <div class="card__content">
          <h2 class="card__title">Running Air Pro</h2>
          <p class="card__price">129.99 €</p>
          <span class="card__hint">Ver detalles ↺</span>
        </div>
      </div>
      
      <!-- CARA B: El Reverso de Datos (Negro, Oculto, Accesible) -->
      <div class="card__face card__face--back" aria-hidden="true">
        <div class="back-content">
          <h3 class="back-title">Talla</h3>
          <div class="size-grid">
            <button type="button" class="size-box">38</button>
            <button type="button" class="size-box">39</button>
            <button type="button" class="size-box">40</button>
            <button type="button" class="size-box">41</button>
            <button type="button" class="size-box" disabled>42</button>
            <button type="button" class="size-box">43</button>
          </div>
          
          <h3 class="back-title">Materiales</h3>
          <ul class="material-list">
            <li>Malla transpirable</li>
            <li>Suela de tracción</li>
          </ul>
          
          <button type="button" class="btn-buy">Comprar ahora</button>
        </div>
      </div>

    </article>
  </div>
</main>
```

### Fase 2: El Motor Gráfico 3D (CSS)

La genialidad reside en aplicar `backface-visibility: hidden;` a las dos caras.
Como el Reverso ya nace girado -180º grados (de culo al usuario)... el navegador dirá: *"¡La estoy mirando desde atrás! La volveré transparente de cristal según tu orden de hidden"*.
Cuando el usuario haga `:hover`, la bisagra general girará todo 180º. El Front será ahora quien esté de culo volviéndose de cristal transparente al instante, y el reverso se pondrá de cara recuperando su visibilidad maravillosamente. 

Copia en `style.css`:

```css
:root {
  --color-bg: #F1F5F9; --color-text: #1E293B; --color-text-invert: #FFFFFF; --color-primary: #EF4444; --color-surface: #FFFFFF;
  --radius-card: 20px;
}

body { font-family: 'Inter', system-ui, sans-serif; background: var(--color-bg); min-height: 100vh; display: grid; place-items: center; padding: 2rem; margin:0; }

/* -------------------------------------
   LA TRÍADA 3D: ESCENA, BISAGRA y CARAS
   ------------------------------------- */

/* 1. LENTE DE CÁMARA (Perspective) - Obligatorio en el padre base */
.scene { width: 320px; height: 480px; perspective: 1000px; }

/* 2. LA BISAGRA MÓVIL (Card) */
.card {
  width: 100%; height: 100%; position: relative; cursor: pointer;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
  transform-style: preserve-3d; /* OBLIGATORIO: Transmite el 3D del padre a los Hijos Face */
}

/* El Detonador HOVER (Desactivado tactilmente gracias al Media Query hover) */
@media (hover: hover) { .card:hover { transform: rotateY(180deg); } }

/* El Detonador JS / A11Y Teclado */
.card:focus-visible, .card.is-flipped { transform: rotateY(180deg); }
.card:focus { outline: none; }
.card:focus-visible { outline: 3px solid var(--color-primary); outline-offset: 6px; border-radius: var(--radius-card); }

/* 3. LAS CARAS (Ambas posiciones solapadas de Frente) */
.card__face {
  position: absolute; width: 100%; height: 100%; top: 0; left: 0;
  border-radius: var(--radius-card); overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  backface-visibility: hidden; /* EL SECRETO: Vuélvete transparente si me das la espalda física */
}

/* A) EL FRONT (Cara A Blanca) */
.card__face--front { background: var(--color-surface); display: flex; flex-direction: column; }
.card__img { width: 100%; height: 60%; object-fit: cover; background: #f1f1f1; }
.card__content { padding: 1.5rem; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; }
.card__title { color: var(--color-text); font-size: 1.5rem; font-weight: 800; letter-spacing: -0.04em; }
.card__price { color: var(--color-primary); font-weight: 600; font-size: 1.2rem; }
.card__hint { font-size: 0.8rem; color: #94A3B8; text-transform: uppercase; font-weight: 600; margin-top: 1rem; }

/* B) EL REVERSO (Cara B Negra Oculta) */
.card__face--back {
  background: var(--color-text); color: var(--color-text-invert); padding: 2rem;
  transform: rotateY(180deg); /* OBLIGATORIO: Nace dada la vuelta dando el culo, por tanto invisible gracias al backface hidden */
}
.back-content { height: 100%; display: flex; flex-direction: column; }
.back-title { font-size: 1rem; text-transform: uppercase; letter-spacing: 0.1em; color: #94A3B8; margin-bottom: 1rem; margin-top: 1.5rem; }
.back-title:first-child { margin-top: 0; }

/* Mini UI Interior */
.size-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
.size-box { background: rgba(255, 255, 255, 0.1); color: white; border: none; padding: 0.5rem; border-radius: 6px; font-weight: 600; cursor: pointer; transition: 0.2s; font-family: inherit;}
.size-box:hover:not(:disabled) { background: var(--color-primary); }
.size-box:disabled { opacity: 0.3; text-decoration: line-through; cursor: not-allowed; }

.material-list { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem; color: #CBD5E1; }
.material-list li::before { content: "•"; color: var(--color-primary); font-weight: bold; margin-right: 0.5rem; }

.btn-buy { margin-top: auto; padding: 1rem; background: var(--color-primary); color: white; border: none; border-radius: 8px; font-weight: 800; text-transform: uppercase; cursor: pointer; transition: 0.2s; }
.btn-buy:active { transform: scale(0.95); }
```

### Fase 3: Parches UX de Tablet y Ceguera (JavaScript)

No podemos permitir que un usuario de móvil no pueda ver el reverso porque no tiene ratón. Además, al usar `aria-hidden`, la tarjeta está "muda" al principio para los ciegos para mantener el misterio de los datos del reverso. Si giran la tarjeta tocando con el teclado virtual, debemos quitar el muro de sonido y mandarla "hablar".

Pega este puente funcional en `main.js`:

```javascript
const card = document.querySelector('.card');
const backFace = document.querySelector('.card__face--back');

const toggleCard = () => {
  // Pinta o quita el inyector que domina el transform de CSS en CSS Line 63
  card.classList.toggle('is-flipped');
  
  const isFlipped = card.classList.contains('is-flipped');
  
  // A11Y Sincronización Oral.
  card.setAttribute('aria-expanded', isFlipped);
  backFace.setAttribute('aria-hidden', !isFlipped);
};

// 1. Escuchar el CLICK físico del Dedo en iPad/Celular
card.addEventListener('click', (e) => {
  // Bugfix: Evitar que hacer click en los botones internos de compra DENTRO de la carta gire la carta de nuevo.
  if (e.target.tagName.toLowerCase() !== 'button') {
    toggleCard();
  }
});

// 2. Escuchar el TECLADO puros para Accesibilidad (Motor Motor-Impaired / Ciegos)
card.addEventListener('keydown', (e) => {
  // Si pulsa Enter (13) o Espacio (32) mientras tiene el selector encima
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault(); // Evita que la página escrollee con el espacio como es normal
    toggleCard();
  }
});
```

Este es el tipo de componente "mágico" y pulido A11y (con teclado y atributos de lectura) que impresiona fuertemente a las Agencias de Frontend modernas.
