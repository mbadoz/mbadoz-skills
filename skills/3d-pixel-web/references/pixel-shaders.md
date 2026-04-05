# Pixel & Mosaic GLSL Shaders for Three.js

## Table of Contents
1. [Mosaic Postprocess with EffectComposer](#mosaic-postprocess)
2. [Posterization Shader](#posterization-shader)
3. [Pixelation via RenderTarget](#pixelation-via-rendertarget)

---

## Mosaic Postprocess

Uses `THREE.EffectComposer` + `ShaderPass` to pixelate the final render in post.

```js
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

const mosaicShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: new THREE.Vector2(innerWidth, innerHeight) },
    pixelSize: { value: 8.0 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float pixelSize;
    varying vec2 vUv;

    void main() {
      vec2 dxy = pixelSize / resolution;
      vec2 coord = dxy * floor(vUv / dxy);
      gl_FragColor = texture2D(tDiffuse, coord);
    }
  `
};

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const mosaicPass = new ShaderPass(mosaicShader);
composer.addPass(mosaicPass);

// In render loop: composer.render() instead of renderer.render()
```

---

## Posterization Shader

Reduces colors to a fixed number of steps — perfect for pixel palette look.

```glsl
// fragmentShader
uniform sampler2D tDiffuse;
uniform float steps; // e.g. 8.0 for 8-color palette
varying vec2 vUv;

void main() {
  vec4 color = texture2D(tDiffuse, vUv);
  color.rgb = floor(color.rgb * steps) / steps;
  gl_FragColor = color;
}
```

Combine with mosaic pass for full pixel art effect.

---

## Pixelation via RenderTarget

Render at low resolution, upscale to full screen:

```js
const pixelRatio = 8; // higher = more pixelated
const rtWidth = Math.floor(innerWidth / pixelRatio);
const rtHeight = Math.floor(innerHeight / pixelRatio);

const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight, {
  minFilter: THREE.NearestFilter,
  magFilter: THREE.NearestFilter, // NEAREST = no interpolation = pixel look
});

// Render scene to low-res target
renderer.setRenderTarget(renderTarget);
renderer.render(scene, camera);
renderer.setRenderTarget(null);

// Display via fullscreen quad (use ShaderPass / custom quad)
```

---

## Tips

- Combine `pixelSize` uniform with a dat.GUI slider for real-time tuning
- Add dithering noise before posterization for retro Amiga/Atari look
- `THREE.NearestFilter` on textures preserves sharp pixel edges

---

## Shaders + Scrollytelling

Pour les scènes Z-axis scrolljacking, animer les uniforms des shaders en fonction de `scrollProgress` :

```js
// Augmenter la pixelisation au fur et à mesure que la caméra avance
// → effet de "zoom arrière dans le passé" ou "plongeon dans la matrice"
renderer.setAnimationLoop(() => {
  mosaicPass.uniforms.pixelSize.value = 4 + scrollProgress * 24; // 4px → 28px
  posterPass.uniforms.steps.value     = Math.max(2, 16 - scrollProgress * 12); // 16 → 4 couleurs
  composer.render();
});
```

- Combiner fog + pixelisation croissante = effet tunnel très immersif
- Réinitialiser les uniforms à 0 lors d'un `waypoint reset` pour des transitions propres

---

## Shaders + Style 2.5D HD-2D

Dans un contexte 2.5D, le postprocess doit être **dosé avec précaution** :

- Appliquer la pixelisation **avant** le billboard pass — sinon les sprites deviennent un blur de pixels
- Préférer la méthode **Low-Res RenderTarget** (canvas divisé par 4) plutôt que le shader mosaic quand des sprites PNG transparents sont présents — le shader mosaic casse les bords alpha
- L'effet de **posterization** est idéal pour unifier la palette couleur entre les meshes 3D et les sprites 2D :

```js
// Forcer la même palette sur tout le rendu = cohérence visuelle 3D + sprites
posterPass.uniforms.steps.value = 8.0; // 8 niveaux = style GBA / DS
```

- **Ne pas utiliser FXAA** avec le style pixel art — l'anti-aliasing détruit les bords nets des sprites
- **Bloom discret** (seuil élevé, radius faible) peut fonctionner pour les effets magiques sur les sprites sans flouter les bords

