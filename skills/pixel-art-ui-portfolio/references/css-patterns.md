# CSS/JS Patterns for Pixel Art Portfolio Sites

## Table of Contents
1. [Pixel-Perfect Rendering](#pixel-perfect-rendering)
2. [Scene Layer Architecture](#scene-layer-architecture)
3. [Parallax Scrolling](#parallax-scrolling)
4. [Sprite Sheet Animation](#sprite-sheet-animation)
5. [Interactive Objects & Proximity UI](#interactive-objects--proximity-ui)
6. [Dialogue Box System](#dialogue-box-system)
7. [Project Card Modal](#project-card-modal)
8. [Custom Pixel Art Cursor](#custom-pixel-art-cursor)
9. [Pixel Art Typography](#pixel-art-typography)
10. [Ambient Particles](#ambient-particles)
11. [Loading Screen](#loading-screen)
12. [Responsive & Mobile Fallback](#responsive--mobile-fallback)

---

## Pixel-Perfect Rendering

**Always on — the most important rule.**

```css
/* Apply globally to prevent blur */
* {
  image-rendering: pixelated;
  image-rendering: crisp-edges; /* Firefox */
}

/* For canvas elements */
canvas {
  image-rendering: pixelated;
}

/* Integer scale only — never use fractional scales */
:root {
  --pixel-scale: 2; /* Or 3 for small monitors */
}
.sprite { transform: scale(var(--pixel-scale)); transform-origin: top left; }
```

---

## Scene Layer Architecture

```html
<div class="scene-container">
  <!-- Z layers: back to front -->
  <div class="scene-layer layer-sky"        data-speed="0.05"></div>
  <div class="scene-layer layer-clouds"     data-speed="0.15"></div>
  <div class="scene-layer layer-far-bg"     data-speed="0.25"></div>
  <div class="scene-layer layer-midground"  data-speed="0.40"></div>
  <div class="scene-layer layer-ground">
    <!-- Tiled floor using CSS background -->
  </div>
  <div class="scene-layer layer-objects">
    <!-- Interactive sprites (monkey, tree) -->
  </div>
  <div class="scene-layer layer-hud">
    <!-- Fixed UI: dialogue, cards, nav -->
  </div>
</div>
```

```css
.scene-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #1a0f2e; /* Fallback color */
}

.scene-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.layer-sky    { z-index: 1; }
.layer-clouds { z-index: 2; }
.layer-far-bg { z-index: 3; }
.layer-midground { z-index: 4; }
.layer-ground { z-index: 5; }
.layer-objects { z-index: 6; }
.layer-hud    { z-index: 10; pointer-events: none; }
.layer-hud > * { pointer-events: auto; }
```

---

## Parallax Scrolling

### Mouse-driven parallax (no scroll)

```js
document.addEventListener('mousemove', (e) => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx; // -1 to 1
  const dy = (e.clientY - cy) / cy;

  document.querySelectorAll('.scene-layer').forEach(layer => {
    const speed = parseFloat(layer.dataset.speed) || 0;
    const x = dx * speed * 40; // max 40px offset
    const y = dy * speed * 20;
    layer.style.transform = `translate(${x}px, ${y}px)`;
  });
});
```

### Scroll-driven parallax

```js
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  document.querySelectorAll('.scene-layer').forEach(layer => {
    const speed = parseFloat(layer.dataset.speed) || 0;
    layer.style.transform = `translateY(${scrollY * speed}px)`;
  });
});
```

---

## Sprite Sheet Animation

### CSS-only sprite animation

```css
/* Sprite sheet: N frames in a horizontal strip */
.sprite-monkey-idle {
  width: 64px;
  height: 64px;
  background-image: url('/assets/monkey-idle-strip.png');
  background-repeat: no-repeat;
  background-position: 0 0;
  image-rendering: pixelated;
  /* steps(N) = number of frames */
  animation: sprite-monkey-idle 0.8s steps(4) infinite;
}

@keyframes sprite-monkey-idle {
  from { background-position: 0 0; }
  to   { background-position: calc(-64px * 4) 0; } /* width × frame count */
}

/* Walk animation */
.sprite-monkey-walk {
  width: 64px; height: 64px;
  background-image: url('/assets/monkey-walk-strip.png');
  animation: sprite-monkey-walk 0.5s steps(8) infinite;
}
@keyframes sprite-monkey-walk {
  to { background-position: calc(-64px * 8) 0; }
}
```

### Direction-aware sprite (4-direction, JS)

```js
const directions = { south: 0, west: 1, east: 2, north: 3 };

function setCharacterDirection(el, dir) {
  const row = directions[dir] ?? 0;
  el.style.backgroundPositionY = `${-row * 64}px`; // 64px = sprite height
}
```

### Animation state machine

```js
class SpriteAnimator {
  constructor(el, anims) {
    this.el = el;
    this.anims = anims; // { idle: 'url', walk: 'url', talk: 'url' }
    this.current = null;
  }

  play(name) {
    if (this.current === name) return;
    this.current = name;
    const anim = this.anims[name];
    this.el.style.backgroundImage = `url('${anim.src}')`;
    this.el.style.animationDuration = `${anim.duration}s`;
    this.el.style.animationName = anim.keyframe;
  }
}

const monkey = new SpriteAnimator(document.querySelector('.monkey'), {
  idle: { src: '/assets/monkey-idle.png', duration: 0.8, keyframe: 'sprite-monkey-idle' },
  talk: { src: '/assets/monkey-talk.png', duration: 0.4, keyframe: 'sprite-monkey-talk' }
});
```

---

## Interactive Objects & Proximity UI

```html
<div class="interactive-object" data-interact="monkey" data-label="Parler à Koko">
  <div class="interact-badge" aria-label="Interagir">!</div>
  <img class="sprite-2x pixel" src="/assets/monkey.png" alt="Monkey NPC" />
</div>
```

```css
.interactive-object {
  position: absolute;
  cursor: pointer;
  bottom: 80px;
  left: 30%;
}

.interact-badge {
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 16px;
  background: url('/assets/badge-exclamation.png') no-repeat center;
  image-rendering: pixelated;
  background-size: 100%;
  /* Bob animation */
  animation: badge-bob 1s ease-in-out infinite alternate;
  opacity: 0; /* Hidden by default */
  transition: opacity 0.2s;
}

.interactive-object:hover .interact-badge,
.interactive-object.player-near .interact-badge {
  opacity: 1;
}

@keyframes badge-bob {
  from { transform: translateX(-50%) translateY(0); }
  to   { transform: translateX(-50%) translateY(-4px); }
}
```

```js
// Dispatch interaction event on click
document.querySelectorAll('[data-interact]').forEach(obj => {
  obj.addEventListener('click', () => {
    const event = new CustomEvent('pixelart:interact', {
      detail: { id: obj.dataset.interact, label: obj.dataset.label }
    });
    window.dispatchEvent(event);
  });
});

// Handle interactions
window.addEventListener('pixelart:interact', ({ detail }) => {
  if (detail.id === 'monkey') DialogueSystem.open('monkey');
  if (detail.id === 'tree')   ProjectModal.open();
});
```

---

## Dialogue Box System

```html
<div class="dialogue-box" id="dialogue-box" aria-live="polite" hidden>
  <div class="dialogue-portrait">
    <img class="pixel" src="" alt="" id="dialogue-portrait-img" />
  </div>
  <div class="dialogue-content">
    <p class="dialogue-name" id="dialogue-name"></p>
    <p class="dialogue-text" id="dialogue-text"></p>
  </div>
  <div class="dialogue-continue">▼</div>
</div>
```

```css
.dialogue-box {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  width: min(640px, 90vw);
  height: 96px;
  background: url('/assets/dialogue-box.png') no-repeat;
  background-size: 100% 100%;
  image-rendering: pixelated;
  padding: 12px 16px 12px 100px; /* left space for portrait */
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: 'Press Start 2P', monospace;
  font-size: 8px;
  line-height: 1.8;
  color: #3d2b1f;
  z-index: 100;
}

.dialogue-portrait {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 80px;
  height: 80px;
}

.dialogue-portrait img {
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
}

.dialogue-name {
  font-size: 6px;
  color: #8b4513;
  margin-bottom: 4px;
  text-transform: uppercase;
}

.dialogue-continue {
  position: absolute;
  bottom: 8px;
  right: 16px;
  animation: blink 0.8s steps(1) infinite;
  font-size: 10px;
}

@keyframes blink {
  50% { opacity: 0; }
}
```

```js
class DialogueSystem {
  static scripts = {
    monkey: [
      { portrait: '/assets/monkey-portrait.png', name: 'Koko', text: "Hé ! Tu veux savoir ce que j'ai accompli ?" },
      { portrait: '/assets/monkey-portrait.png', name: 'Koko', text: "J'ai travaillé sur des projets incroyables... laisse-moi te raconter." },
      { name: 'Koko', text: "Stage chez Acme Corp (2023) — développement React & Node.js, intégration API." }
    ]
  };

  static index = 0;
  static currentScript = null;

  static open(characterId) {
    this.currentScript = this.scripts[characterId];
    this.index = 0;
    this.show();
    document.getElementById('dialogue-box').removeAttribute('hidden');
    document.getElementById('dialogue-box').addEventListener('click', () => this.next());
  }

  static show() {
    const line = this.currentScript[this.index];
    this.typewrite(line.text, document.getElementById('dialogue-text'));
    document.getElementById('dialogue-name').textContent = line.name;
    const portrait = document.getElementById('dialogue-portrait-img');
    if (line.portrait) { portrait.src = line.portrait; portrait.hidden = false; }
    else portrait.hidden = true;
  }

  static next() {
    this.index++;
    if (this.index >= this.currentScript.length) {
      document.getElementById('dialogue-box').setAttribute('hidden', '');
    } else {
      this.show();
    }
  }

  static typewrite(text, el) {
    el.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) clearInterval(interval);
    }, 40); // 40ms per char = typewriter effect
  }
}
```

---

## Project Card Modal

```html
<div class="project-modal" id="project-modal" aria-modal="true" hidden>
  <div class="modal-overlay"></div>
  <div class="modal-container">
    <div class="modal-tree-decoration"></div>
    <h2 class="modal-title pixel-font">Mes Projets</h2>
    <div class="project-cards-grid" id="project-cards-grid">
      <!-- Cards injected by JS -->
    </div>
    <button class="modal-close pixel-btn">✕ Fermer</button>
  </div>
</div>
```

```css
.project-modal {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(10, 5, 20, 0.85);
}

.modal-container {
  position: relative;
  background: url('/assets/panel-bg.png');
  image-rendering: pixelated;
  background-size: 100% 100%;
  padding: 32px;
  max-width: 800px;
  width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
}

.project-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.project-card {
  background: url('/assets/project-card.png') no-repeat;
  background-size: 100% 100%;
  image-rendering: pixelated;
  padding: 16px 12px;
  cursor: pointer;
  transition: transform 0.1s steps(1);
}
.project-card:hover { transform: translateY(-4px); }

.pixel-btn {
  background: url('/assets/button.png') no-repeat;
  background-size: 100% 100%;
  image-rendering: pixelated;
  border: none;
  padding: 8px 16px;
  font-family: 'Press Start 2P', monospace;
  font-size: 8px;
  cursor: pointer;
  color: #f0d060;
}
```

---

## Custom Pixel Art Cursor

```css
body {
  cursor: url('/assets/cursor.png') 0 0, auto;
  /* cursor.png must be exactly 16×16 or 32×32 */
}

/* Hover state on interactive objects */
[data-interact]:hover,
.pixel-btn:hover {
  cursor: url('/assets/cursor-pointer.png') 8 0, pointer;
}
```

---

## Pixel Art Typography

```html
<!-- In <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
```

```css
:root {
  --font-pixel: 'Press Start 2P', monospace;
}

.pixel-font {
  font-family: var(--font-pixel);
  font-size: 8px;        /* Base: 8px — scale with em/rem */
  line-height: 2;        /* Double line height for readability */
  letter-spacing: 0.05em;
  text-rendering: optimizeSpeed;
}

/* Scale levels */
.pixel-h1 { font-size: 16px; }
.pixel-h2 { font-size: 12px; }
.pixel-body { font-size: 8px; }
.pixel-small { font-size: 6px; }
```

---

## Ambient Particles

```js
class PixelParticles {
  constructor(container, count = 20) {
    this.container = container;
    this.particles = [];
    for (let i = 0; i < count; i++) this.spawn();
  }

  spawn() {
    const el = document.createElement('div');
    el.className = 'particle';
    el.style.cssText = `
      position: absolute;
      width: 4px; height: 4px;
      background: #f0d060;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      image-rendering: pixelated;
      opacity: ${0.3 + Math.random() * 0.7};
      animation: particle-float ${3 + Math.random() * 4}s ease-in-out infinite alternate;
      animation-delay: ${-Math.random() * 4}s;
    `;
    this.container.appendChild(el);
  }
}
```

```css
@keyframes particle-float {
  from { transform: translateY(0) translateX(0); opacity: 0.3; }
  50%  { opacity: 0.9; }
  to   { transform: translateY(-20px) translateX(${Math.random()*10-5}px); opacity: 0.1; }
}
```

---

## Loading Screen

```html
<div id="loading-screen" class="loading-screen">
  <div class="loading-scene">
    <img class="loading-character pixel" src="/assets/monkey-walk.png" alt="" />
    <div class="loading-bar-container">
      <div class="loading-bar" id="loading-bar"></div>
    </div>
    <p class="pixel-font" style="font-size:6px; color:#f0d060;">Chargement...</p>
  </div>
</div>
```

```css
.loading-screen {
  position: fixed;
  inset: 0;
  background: #0e1a0e;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: opacity 0.5s steps(8);
}

.loading-screen.done { opacity: 0; pointer-events: none; }

.loading-bar-container {
  width: 200px; height: 16px;
  background: url('/assets/bar-empty.png') no-repeat;
  background-size: 100% 100%;
  image-rendering: pixelated;
  margin: 16px auto;
}

.loading-bar {
  height: 100%;
  background: url('/assets/bar-fill.png') no-repeat left;
  background-size: auto 100%;
  image-rendering: pixelated;
  width: 0%;
  transition: width 0.3s steps(10);
}
```

```js
// Track asset loading
const assets = ['/assets/monkey.png', '/assets/tree.png', /* ... */];
let loaded = 0;

assets.forEach(src => {
  const img = new Image();
  img.onload = () => {
    loaded++;
    const pct = (loaded / assets.length) * 100;
    document.getElementById('loading-bar').style.width = pct + '%';
    if (loaded >= assets.length) {
      setTimeout(() => {
        document.getElementById('loading-screen').classList.add('done');
      }, 500);
    }
  };
  img.src = src;
});
```

---

## Responsive & Mobile Fallback

```css
/* Pixel art sites work best on desktop */
@media (max-width: 768px) {
  .scene-container { display: none; }
  .mobile-fallback  { display: flex; }
}

.mobile-fallback {
  display: none;
  position: fixed;
  inset: 0;
  background: #0e1a0e;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 32px;
  text-align: center;
}

.mobile-fallback img {
  width: 96px;
  image-rendering: pixelated;
}

.mobile-fallback p {
  font-family: 'Press Start 2P', monospace;
  font-size: 7px;
  line-height: 2;
  color: #f0d060;
}
```

```html
<div class="mobile-fallback">
  <img src="/assets/monkey-sad.png" alt="Monkey looking sad" class="pixel" />
  <p>Ce portale pixel art<br>est optimisé<br>pour desktop 🖥️</p>
  <p style="font-size:6px; color:#4a7c3f;">Retourne sur ton PC !</p>
</div>
```
