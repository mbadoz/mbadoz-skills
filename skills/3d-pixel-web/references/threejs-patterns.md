# Three.js Production Patterns

## Table of Contents
1. [Resource Cleanup](#resource-cleanup)
2. [Render Loop](#render-loop)
3. [Responsive Canvas](#responsive-canvas)
4. [Imports and Setup](#imports-and-setup)
5. [Lighting](#lighting)
6. [Loading Assets](#loading-assets)
7. [Camera](#camera)
8. [Performance](#performance)
9. [Animation](#animation)

---

## Resource Cleanup

- Call `.dispose()` on geometries, materials, and textures before removing objects — Three.js never garbage collects GPU resources automatically
- When removing a mesh: `mesh.geometry.dispose(); mesh.material.dispose(); scene.remove(mesh)` — missing any step causes memory leaks
- Textures loaded via TextureLoader stay in GPU memory forever unless explicitly disposed — track and clean up on scene transitions

---

## Render Loop

- Always use `renderer.setAnimationLoop(animate)` instead of manual `requestAnimationFrame` — handles VR, pauses when tab is hidden, provides proper timing
- For animations, use `clock.getDelta()` for frame-independent movement — raw frame counting breaks on different refresh rates

---

## Responsive Canvas

- On window resize, update both camera aspect AND renderer size:
  ```js
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  ```
- Missing `updateProjectionMatrix()` after aspect change causes stretched/squished rendering
- Use `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` — values above 2 kill performance with minimal visual benefit

---

## Imports and Setup

- OrbitControls and other addons:
  ```js
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  ```
  (path varies by bundler)
- Always set `controls.enableDamping = true` with OrbitControls and call `controls.update()` in render loop — without this, damping silently fails

---

## Lighting

- `MeshBasicMaterial` ignores all lights — use `MeshStandardMaterial` or `MeshPhongMaterial` for lit scenes
- Add ambient light as baseline:
  ```js
  new THREE.AmbientLight(0xffffff, 0.5)
  ```
  Scenes with only directional lights have pitch-black shadows
- HDR environment maps via `PMREMGenerator` give far better reflections than point lights on metallic materials

---

## Loading Assets

- `GLTFLoader` is the standard for 3D models — use Draco compression for large meshes (add `DRACOLoader`)
- Texture loading is async — models may render black until textures load; use `LoadingManager` for loading screens
- CORS blocks textures from other domains — host assets on same origin or configure proper CORS headers

---

## Camera

- Default near/far planes (0.1 to 1000) cause z-fighting on large scenes — adjust to smallest range that fits your scene
- Camera inside an object renders nothing — check position after loading external models (they may have unexpected transforms)
- `PerspectiveCamera` FOV is vertical, not horizontal — 75 degrees is a common default

---

## Performance

- Merge static geometries with `BufferGeometryUtils.mergeBufferGeometries()` — each mesh is a draw call, fewer meshes = faster
- Use `InstancedMesh` for many identical objects — hundreds of draw calls become one
- Set `object.frustumCulled = true` (default) but verify large objects aren't disappearing at edges — bounding sphere may be wrong
- Call `renderer.info` to debug draw calls, triangles, and textures in memory

---

## Animation

- `AnimationMixer` requires `mixer.update(delta)` every frame with actual delta time — passing 0 or skipping frames breaks animations
- Skinned meshes (characters) need `SkeletonHelper` during development to debug bone issues

---

## Scrollytelling / Z-Axis Camera Rail

- **Never read `window.scrollY` directly** — always accumulate into a `scrollTarget`, then lerp toward it each frame; direct reads cause jittery camera
- **`overflow: hidden` on body is mandatory** — without it the browser scroll bar fights the custom scroll logic
- **Register wheel listener with `{ passive: false }`** and call `e.preventDefault()` — otherwise Chrome ignores the capture
- Lerp formula: `current += (target - current) * speed` where `speed` ∈ [0.04, 0.15] — lower = more cinematic inertia
- Expose `scrollProgress` (0 → 1) and use it to drive waypoints, opacity fades, and HUD transitions — never hard-code pixel distances
- Add `scene.fog` (Fog or FogExp2) to fade far geometry naturally — avoids the "pop" when InstancedMesh instances enter view
- For touch support, track `touchstart` / `touchmove` separately — `deltaY` is absent on touch events
- Keyboard arrow keys should also increment `scrollTarget` for accessibility
- **Performance trap**: checking waypoints inside the lerp function each frame is fine — but avoid DOM writes every frame; throttle with a dirty flag instead

```js
// Dirty flag pattern to avoid DOM write every frame
let lastChapter = -1;
function checkWaypoints(progress) {
  const chapter = Math.floor(progress * 4); // 4 chapters
  if (chapter !== lastChapter) {
    lastChapter = chapter;
    document.getElementById('hud').textContent = CHAPTERS[chapter] ?? '';
  }
}
```

---

## 2.5D Billboarding

- **`NearestFilter` on ALL pixel art textures** (both `magFilter` AND `minFilter`) — forgetting `minFilter` causes blurry mipmaps at distance
- **`alphaTest: 0.1` instead of `opacity`** — full transparency cutout with no sorting artifacts; `opacity < 1` requires transparent sorting which breaks with many sprites
- **`depthWrite: false` on sprite materials** — prevents a sprite from occluding geometry behind it due to Z-buffer writes
- **Billboard rotation**: copy `camera.quaternion` to sprite, NOT Euler angles — quaternion copy is gimbal-lock-free and handles any camera angle
- **Y-axis only billboard** (sprites stay vertical regardless of camera tilt): extract only Y rotation from camera quaternion using `THREE.Euler`
- **Sorting sprites by depth** is critical when `transparent: true` — Three.js sorts transparent objects automatically only if `renderOrder` or `depthWrite` is managed
- **Fake shadows** (flat `CircleGeometry` with dark semi-transparent material) must have `position.y = 0.01` — any lower causes Z-fighting with the ground plane
- **SpriteSheet animation**: use `texture.offset.x = frame / totalFrames` and `texture.repeat.x = 1 / totalFrames` — changing `offset` does not trigger a texture reupload; it's free
- Never use `THREE.Sprite` (built-in) for pixel art — it uses its own material that doesn't support `NearestFilter` easily; use `PlaneGeometry` + custom material instead

```js
// Y-axis only billboard (sprite stays upright even when camera tilts)
const euler = new THREE.Euler();
euler.setFromQuaternion(camera.quaternion, 'YXZ');
euler.x = 0; euler.z = 0; // lock to Y only
sprite.quaternion.setFromEuler(euler);
```

