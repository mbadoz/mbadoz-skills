---
name: 3d-pixel-web
description: >
  Create stunning 3D websites with pixel art and mosaic UI/UX design using Three.js.
  Use this skill when the user asks to build a 3D website or landing page, add Three.js
  3D effects or scenes, create pixel art / mosaic / voxel-style web design, combine 3D
  rendering with retro or pixel aesthetics, animate 3D elements on a webpage, create
  immersive scrollytelling / Z-axis scrolljacking experiences, or build 2.5D HD-2D worlds
  mixing Low-Poly 3D environments with pixel art sprite billboards. Triggers include any
  mention of 3D site, Three.js, pixel design, mosaique 3D, effet 3D pixel, voxel web,
  CRT effect, scanline effect, scrollytelling, scrolljacking, défilement axe Z, 2.5D,
  HD-2D, sprite billboard, Low-Poly world, or caméra sur rail.
---

# 3D Pixel Web

Create immersive 3D websites combining Three.js rendering with pixel art / mosaic aesthetics.

## Core Design Philosophy

- **Pixel/Mosaic grid overlay** on 3D scenes: use low-res canvas scaling, fragment shader posterization, or CSS pixelated filter
- **Voxel/block geometry** as primary 3D elements (BoxGeometry, InstancedMesh)
- **Limited color palettes** (8-32 colors) defined as JS constants
- **Chunky typography**: pixel fonts (Press Start 2P, VT323 from Google Fonts) over 3D canvas
- **CRT / scanline** post-process overlay for authenticity
- `antialias: false` on WebGLRenderer to preserve hard pixel edges

## Project Structure

```
index.html       <- canvas + overlay HTML
style.css        <- pixel font, body bg, canvas sizing, scanline overlay
main.js          <- Three.js scene, animation loop, resize handler
shaders.js       <- optional GLSL pixel/mosaic shaders
scrolly.js       <- scrollytelling / scroll-driven camera rail (optional)
sprites.js       <- 2.5D billboard sprites pixel art (optional)
```

## Quick Start Boilerplate

```html
<!-- index.html -->
<canvas id="canvas"></canvas>
<div id="ui-overlay"><!-- pixel UI here --></div>
<div id="scanlines"></div>
```

```js
// main.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false }); // OFF for pixel look
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const clock = new THREE.Clock();

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
renderer.setSize(innerWidth, innerHeight);

renderer.setAnimationLoop(() => {
  const delta = clock.getDelta();
  controls.update();
  renderer.render(scene, camera);
});
```

## Pixel / Mosaic Rendering Techniques

### Low-Res Scale (simplest, most authentic)
```css
canvas { image-rendering: pixelated; image-rendering: crisp-edges; }
```
```js
// Render at 1/4 res then scale up via CSS
renderer.setSize(innerWidth / 4, innerHeight / 4);
canvas.style.width = '100%';
canvas.style.height = '100%';
```

### CSS Scanline Overlay
```css
#scanlines {
  position: fixed; inset: 0; pointer-events: none; z-index: 10;
  background: repeating-linear-gradient(
    0deg, transparent, transparent 2px,
    rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px
  );
}
```

### GLSL Mosaic Postprocess Shader
See `references/pixel-shaders.md` for the complete mosaic fragment shader using THREE.EffectComposer.

## Voxel / Block Scene Pattern

```js
// InstancedMesh for pixel blocks - very performant
const geo = new THREE.BoxGeometry(1, 1, 1);
const mat = new THREE.MeshStandardMaterial();
const count = 500;
const mesh = new THREE.InstancedMesh(geo, mat, count);
const dummy = new THREE.Object3D();

for (let i = 0; i < count; i++) {
  dummy.position.set(
    Math.floor(Math.random() * 20) - 10,
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 20) - 10
  );
  dummy.updateMatrix();
  mesh.setMatrixAt(i, dummy.matrix);
  mesh.setColorAt(i, new THREE.Color(PALETTE[i % PALETTE.length]));
}
mesh.instanceMatrix.needsUpdate = true;
scene.add(mesh);
```

## Color Palettes

Always define palettes as constants, never use Math.random() for colors:
```js
const PALETTE_NEON     = ['#ff00ff', '#00ffff', '#ffff00', '#ff007f', '#7f00ff'];
const PALETTE_GAMEBOY  = ['#0f380f', '#306230', '#8bac0f', '#9bbc0f'];
const PALETTE_CYBERPUNK = ['#0d0221', '#190535', '#6b1fb1', '#f72585', '#4cc9f0'];
const PALETTE_VAPORWAVE = ['#ff71ce', '#01cdfe', '#05ffa1', '#b967ff', '#fffb96'];
```

## Lighting for Pixel Look

```js
// Flat/stylized lighting - avoid soft shadows, they break the pixel aesthetic
const ambient = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambient);
const dir = new THREE.DirectionalLight(0xffffff, 1.2);
dir.position.set(5, 10, 5);
scene.add(dir);
// NO shadow maps - too smooth, breaks pixel look
// Use MeshStandardMaterial or MeshPhongMaterial (NOT MeshBasicMaterial - ignores lights)
```

## Performance Rules

- Use `InstancedMesh` for any repeated geometry
- Call `geometry.dispose(); material.dispose(); texture.dispose()` on cleanup
- Always use `renderer.setAnimationLoop` not manual RAF
- Always use `clock.getDelta()` for frame-independent animation
- Max `pixelRatio`: 2
- Debug with `renderer.info` (draw calls, triangles, textures in GPU memory)

## Three.js Production Patterns

See `references/threejs-patterns.md` for complete production best practices:
- Resource cleanup & GPU memory leaks prevention
- Asset loading (GLTFLoader, DRACOLoader, TextureLoader, LoadingManager)
- Camera setup, near/far planes, z-fighting
- AnimationMixer usage
- OrbitControls damping
- HDR environment maps

---

## Scrollytelling 3D — Z-Axis Scrolljacking

Le scroll de l'utilisateur est "capturé" (scrolljacking) pour déplacer une caméra virtuelle
sur un rail en profondeur (axe Z). L'utilisateur avance dans une scène 3D comme s'il
yoyageait dans un tunnel ou un couloir narratif.

### Principes clés
- Désactiver le scroll natif du navigateur (`overflow: hidden` sur body)
- Capturer `wheel` et `touchmove` pour alimenter une variable `scrollProgress` (0 → 1)
- Utiliser `gsap` ou une interpolation `lerp` manuelle pour une caméra fluide (inertie)
- Définir des **waypoints** (points clé) où des événements narratifs se déclenchent
- Ne JAMAIS utiliser `scrollY` directement → toujours passer par une target + lerp

### Boilerplate Scrollytelling

```html
<!-- index.html -->
<canvas id="canvas"></canvas>
<div id="hud"><!-- textes narratifs overlay --></div>
<!-- body overflow: hidden dans le CSS -->
```

```css
/* style.css */
body { margin: 0; overflow: hidden; background: #000; }
#canvas { display: block; image-rendering: pixelated; }
#hud {
  position: fixed; inset: 0; pointer-events: none;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Press Start 2P', monospace;
  color: #fff; font-size: clamp(0.6rem, 2vw, 1rem);
  text-shadow: 2px 2px #000;
  opacity: 0; transition: opacity 0.5s;
}
```

```js
// scrolly.js — moteur de scroll Z-axis
import * as THREE from 'three';

// --- Config ---
const TOTAL_DEPTH = 80;   // distance totale que la caméra parcourt sur Z
const LERP_SPEED  = 0.07; // inertie : 0.04 = très doux, 0.15 = réactif

// --- State ---
let scrollTarget   = 0; // valeur cible accumulée
let scrollCurrent  = 0; // valeur interpolée (smooth)
let scrollProgress = 0; // 0 → 1 normalisé

// --- Capture molette (scrolljacking) ---
window.addEventListener('wheel', (e) => {
  e.preventDefault();
  // deltaY positif = molette vers le bas = avancer dans la scène
  scrollTarget += e.deltaY * 0.05;
  scrollTarget = Math.max(0, Math.min(TOTAL_DEPTH, scrollTarget));
}, { passive: false });

// --- Support tactile ---
let lastTouchY = 0;
window.addEventListener('touchstart', (e) => { lastTouchY = e.touches[0].clientY; });
window.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const delta = lastTouchY - e.touches[0].clientY;
  lastTouchY  = e.touches[0].clientY;
  scrollTarget += delta * 0.1;
  scrollTarget = Math.max(0, Math.min(TOTAL_DEPTH, scrollTarget));
}, { passive: false });

// --- Fonction tick : à appeler dans la boucle de rendu ---
export function tickScroll(camera, waypoints = []) {
  // Interpolation linéaire (inertie)
  scrollCurrent  = scrollCurrent + (scrollTarget - scrollCurrent) * LERP_SPEED;
  scrollProgress = scrollCurrent / TOTAL_DEPTH;

  // Déplacement caméra sur -Z (on avance en profondeur)
  camera.position.z = -scrollCurrent;

  // Optionnel : légère oscillation Y pour effet vol
  camera.position.y = Math.sin(scrollCurrent * 0.15) * 0.3;

  // Déclenchement des waypoints
  waypoints.forEach(wp => {
    const active = scrollProgress >= wp.from && scrollProgress < wp.to;
    wp.onActive?.(active, scrollProgress);
  });
}
```

```js
// main.js — intégration
import * as THREE from 'three';
import { tickScroll } from './scrolly.js';

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: false });
renderer.setSize(innerWidth / 3, innerHeight / 3); // low-res pixel
document.getElementById('canvas').style.width  = '100vw';
document.getElementById('canvas').style.height = '100vh';

const scene  = new THREE.Scene();
scene.fog    = new THREE.Fog(0x000010, 10, 60); // brouillard de profondeur
const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 200);
camera.position.set(0, 1, 0);

// Waypoints narratifs
const waypoints = [
  {
    from: 0.0, to: 0.25,
    onActive: (active) => {
      document.getElementById('hud').style.opacity = active ? '1' : '0';
      document.getElementById('hud').textContent   = active ? 'Chapter I — The Void' : '';
    }
  },
  {
    from: 0.5, to: 0.75,
    onActive: (active) => {
      document.getElementById('hud').style.opacity = active ? '1' : '0';
      document.getElementById('hud').textContent   = active ? 'Chapter II — The Descent' : '';
    }
  },
];

// Boucle de rendu
renderer.setAnimationLoop(() => {
  tickScroll(camera, waypoints);
  renderer.render(scene, camera);
});
```

### Patterns de scène pour l'axe Z

```js
// Tunnel de voxels : générer des blocs le long de l'axe Z
const geo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
const mat = new THREE.MeshStandardMaterial();
const mesh = new THREE.InstancedMesh(geo, mat, 400);
const dummy = new THREE.Object3D();
const PALETTE = ['#ff00ff','#00ffff','#ffff00','#7f00ff'];

for (let i = 0; i < 400; i++) {
  const angle = i * 0.4;
  const radius = 4 + Math.sin(i * 0.3) * 2;
  dummy.position.set(
    Math.cos(angle) * radius,
    Math.sin(angle * 0.5) * 2,
    -i * 0.5 // distribués sur -Z
  );
  dummy.updateMatrix();
  mesh.setMatrixAt(i, dummy.matrix);
  mesh.setColorAt(i, new THREE.Color(PALETTE[i % PALETTE.length]));
}
mesh.instanceMatrix.needsUpdate = true;
mesh.instanceColor.needsUpdate  = true;
scene.add(mesh);
```

### Progress bar pixel

```css
#progress-bar {
  position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%);
  width: 200px; height: 8px; background: #333; border: 2px solid #fff;
  pointer-events: none; z-index: 20; image-rendering: pixelated;
}
#progress-fill {
  height: 100%; background: #ff00ff; transition: none;
}
```

```js
// dans tickScroll ou la boucle de rendu :
document.getElementById('progress-fill').style.width =
  (scrollProgress * 100).toFixed(1) + '%';
```

---

## Style 2.5D HD-2D — Sprites Pixel Art dans un Monde 3D

L'environnement (sol, bâtiments, terrain) est modélisé en 3D Low-Poly avec des textures
pixel art. Les personnages et objets interactifs sont de purs sprites 2D plats (pixel art)
dressés debout dans le monde 3D via la technique du **billboarding**.

### Principes clés
- **Environnement** : meshes 3D Low-Poly + textures pixel art (nearest filtering obligatoire)
- **Sprites** : `PlaneGeometry` avec texture PNG transparente orientée toujours vers la caméra
- **Caméra** : vue plongeante pseudo-isométrique (angle 30-45° sur X)
- **Résolution** : canvas basse résolution + `image-rendering: pixelated` pour unifier le style
- **Pas de shadow maps** : utiliser des faux ombres (décal ou spot plat sous le sprite)

### Setup caméra pseudo-isométrique

```js
// Caméra en vue plongeante dynamique style HD-2D
const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.1, 500);
camera.position.set(0, 12, 14);  // hauteur + recul
camera.lookAt(0, 0, 0);           // regarde le sol
// Optionnel : légère rotation pour la vue en biais
camera.rotation.x = -Math.PI / 5; // ~36° vers le bas
```

### Texture Pixel Art — Nearest Filtering (OBLIGATOIRE)

```js
// Sans ça, les textures pixel art seront floues !
const loader = new THREE.TextureLoader();
const tex = loader.load('textures/ground_pixel.png');
tex.magFilter = THREE.NearestFilter; // ← CRITIQUE pour pixel art
tex.minFilter = THREE.NearestFilter;
tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
tex.repeat.set(8, 8); // carreaux de pixel
```

### Billboarding — Sprite 2D dans le monde 3D

```js
// sprites.js — système de billboard pixel art
import * as THREE from 'three';

/**
 * Crée un sprite billboard pixel art.
 * @param {string} texturePath - chemin PNG transparent (spritesheet ou frame unique)
 * @param {number} pixelW - largeur en pixels dans la texture
 * @param {number} pixelH - hauteur en pixels
 * @param {number} worldScale - taille dans le monde 3D (ex: 2 = 2 unités de haut)
 */
export function createBillboard(texturePath, worldScale = 2) {
  const loader  = new THREE.TextureLoader();
  const texture = loader.load(texturePath);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;

  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.1,    // découpe propre sans anti-aliasing
    depthWrite: false, // évite les artefacts de triage
    side: THREE.DoubleSide,
  });

  const geo   = new THREE.PlaneGeometry(worldScale, worldScale);
  const mesh  = new THREE.Mesh(geo, mat);
  mesh.userData.isBillboard = true;
  return mesh;
}

/**
 * À appeler dans la boucle de rendu pour que tous les sprites
 * fassent face à la caméra (billboarding manuel axe Y uniquement).
 * Ne faire tourner que sur Y pour que le sprite reste "droit".
 */
export function updateBillboards(scene, camera) {
  scene.traverse((obj) => {
    if (obj.userData.isBillboard) {
      // Copie la rotation Y de la caméra seulement → reste vertical
      obj.quaternion.copy(camera.quaternion);
    }
  });
}
```

```js
// main.js — utilisation
import { createBillboard, updateBillboards } from './sprites.js';

const hero = createBillboard('sprites/hero_idle.png', 2);
hero.position.set(0, 1, 0); // Y = demi-hauteur pour poser sur le sol
scene.add(hero);

// Fausse ombre (cercle plat sous le sprite)
const shadowGeo = new THREE.CircleGeometry(0.4, 8);
const shadowMat = new THREE.MeshBasicMaterial({
  color: 0x000000, transparent: true, opacity: 0.4, depthWrite: false
});
const shadow = new THREE.Mesh(shadowGeo, shadowMat);
shadow.rotation.x = -Math.PI / 2; // à plat sur le sol
shadow.position.set(0, 0.01, 0);
scene.add(shadow);

// Boucle de rendu
renderer.setAnimationLoop(() => {
  updateBillboards(scene, camera);
  renderer.render(scene, camera);
});
```

### Animation de spritesheet pixel art

```js
// Découpe et animation d'une spritesheet (4 frames de 32×32px)
const sheet   = loader.load('sprites/hero_walk.png');
sheet.magFilter  = THREE.NearestFilter;
sheet.minFilter  = THREE.NearestFilter;
sheet.repeat.set(1 / 4, 1); // 4 colonnes, 1 ligne
sheet.offset.set(0, 0);

let frame     = 0;
const FRAMES  = 4;
const FPS     = 8;
let lastFrame = 0;

function updateSpriteFrame(now) {
  if (now - lastFrame > 1000 / FPS) {
    frame = (frame + 1) % FRAMES;
    sheet.offset.x = frame / FRAMES;
    lastFrame = now;
  }
}

// Dans la boucle :
renderer.setAnimationLoop((time) => {
  updateSpriteFrame(time);
  updateBillboards(scene, camera);
  renderer.render(scene, camera);
});
```

### Environnement Low-Poly 3D avec textures pixel

```js
// Sol texturé pixel art
const groundTex = loader.load('textures/grass_pixel.png');
groundTex.magFilter = THREE.NearestFilter;
groundTex.minFilter = THREE.NearestFilter;
groundTex.wrapS = groundTex.wrapT = THREE.RepeatWrapping;
groundTex.repeat.set(16, 16);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.MeshStandardMaterial({ map: groundTex })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Bâtiment Low-Poly simple
const buildingTex = loader.load('textures/wall_pixel.png');
buildingTex.magFilter = THREE.NearestFilter;
buildingTex.minFilter = THREE.NearestFilter;

const building = new THREE.Mesh(
  new THREE.BoxGeometry(3, 4, 3),
  new THREE.MeshStandardMaterial({ map: buildingTex })
);
building.position.set(6, 2, -4);
scene.add(building);
```

### Effet de parallaxe HD-2D avec couches

```js
// Les sprites en arrière-plan bougent moins vite que ceux au premier plan
// → effet de profondeur cinématographique

const layers = [
  { sprite: createBillboard('sprites/mountain.png', 10), z: -20, parallax: 0.3 },
  { sprite: createBillboard('sprites/tree.png', 3),     z: -8,  parallax: 0.7 },
  { sprite: createBillboard('sprites/bush.png', 1.5),   z: 2,   parallax: 1.0 },
];

layers.forEach(l => {
  l.sprite.position.z = l.z;
  scene.add(l.sprite);
});

// Dans la boucle — appliquer le décalage parallaxe depuis la position caméra
function updateParallax(camera) {
  layers.forEach(l => {
    l.sprite.position.x = camera.position.x * l.parallax;
  });
}
```

### Éclairage 2.5D authentique

```js
// Lumière ambiante forte pour aplatir les ombres (style cartoon)
const ambient = new THREE.AmbientLight(0xfff5e0, 1.2);
scene.add(ambient);

// Soleil diagonal (haut-droite) pour donner du volume aux bâtiments
const sun = new THREE.DirectionalLight(0xffd080, 1.0);
sun.position.set(8, 20, 5);
scene.add(sun);

// Pas de shadow maps — les sprites seraient mal éclairés
// Utiliser une fausse ombre circulaire sous chaque sprite (cf. createBillboard)
```

### Checklist qualité 2.5D

- [ ] `NearestFilter` sur TOUTES les textures pixel art (sinon floues)
- [ ] `alphaTest: 0.1` sur tous les matériaux de sprites (découpe propre)
- [ ] `depthWrite: false` sur les sprites (évite les artefacts de Z-buffer)
- [ ] Caméra à angle fixe (35-45° sur X) — ne pas laisser l'utilisateur tourner librement
- [ ] Canvas basse résolution + `image-rendering: pixelated` pour uniformité visuelle
- [ ] Ombres fausses (CircleGeometry plat) sous chaque sprite
- [ ] Trier les sprites de l'arrière-plan vers le premier plan pour éviter les glitches
