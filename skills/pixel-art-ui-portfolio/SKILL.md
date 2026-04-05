---
name: pixel-art-ui-portfolio
description: >
  Expert skill for designing and building narrative pixel art portfolio websites using the PixelLab API.
  Use this skill when the user wants to:
  (1) Build a portfolio website with a pixel art / game-like aesthetic (jungle, dungeon, RPG world, city, space, etc.)
  (2) Generate pixel art assets (characters, environment tiles, UI panels, animated sprites) via the PixelLab API
  (3) Coordinate PixelLab API calls across multiple asset types (NPC sprite + tileset + UI overlay) from a single narrative brief
  (4) Implement CSS/JS patterns for pixel-perfect rendering, sprite animations, dialogue boxes, and interactive scenes
  (5) Translate a metaphorical concept (e.g. "a monkey that tells my story", "a tree containing my projects") into a coherent set of visual assets and web interactions
  Triggers: "pixel art portfolio", "game-like site", "RPG portfolio", "pixel art jungle", "sprite animation", "PixelLab", "8-bit portfolio", "retro UI", "sprite character", "interactive scene", "portfolio game", "pixel art website"
---

# Pixel Art UI Portfolio Skill

## Core Mental Model

When the user describes a **narrative scene** ("a jungle with a monkey and a tree"), your job is to:

1. **Decompose** the brief into every visual object (explicit + implicit)
2. **Map** each object to the right PixelLab endpoint
3. **Plan** the CSS/JS architecture for pixel-perfect rendering
4. **Sequence** the API calls efficiently (tilesets first → characters → UI last)

---

## Phase 1 — Narrative Decomposition

Given any creative brief, extract **all** required assets. Always complete this list before making any API call.

For the **jungle portfolio** example:

**Explicit** (said by user):
- Jungle environment (background scene)
- Tree (interactive object → reveals projects on click)
- Monkey NPC (interactive character → tells experiences on talk)

**Implicit** (required for visual coherence — always infer these):
- Sky layer (parallax background)
- Ground / grass tileset (floor plane)
- Ambient foliage decorations (palm trees, bushes — depth layers)
- Floating "!" interaction indicator above interactive objects
- Dialogue box UI panel (RPG-style, for monkey conversation)
- Project card UI panels (appear inside tree modal)
- Pixel art custom cursor
- Ambient particles (fireflies, leaves)
- Loading / transition overlay
- Navigation HUD (minimal pixel art buttons)
- Sound/music toggle button
- Mobile fallback message

**Rule**: A pixel art scene without a consistent floor, sky, and ambient decoration looks unfinished. Always generate them.

---

## Phase 2 — Asset Mapping to PixelLab

> Full endpoint reference: `references/api-endpoints.md`
> Style parameter combinations: `references/style-guide.md`

**Quick decision table:**

| Asset Type | PixelLab Endpoint | Key params |
|---|---|---|
| NPC character (monkey, hero) | `POST /character-from-text-4-directions` | `view=side`, `no_background=true` |
| Character walk/idle animation | `POST /character-animation` (after char created) | `template_animation_id=breathing-idle` |
| Ground / terrain tiles | `POST /create-tileset-async` | `tile_size.width=32`, `view=low top-down` |
| Environment objects (tree, rock) | `POST /create-image-pixflux` | `no_background=true`, `view=side` |
| Background sky / full scene | `POST /generate-image-pro` | large `image_size`, no `no_background` |
| UI panels, dialogue box, buttons | `POST /generate-ui-v2` | `color_palette` matching scene, `no_background=false` |
| Isometric tiles | `POST /create-isometric-tile-async` | `isometric_tile_shape=thick tile` |
| Style-consistent extra assets | `POST /generate-with-style-pro` | pass first 2 generated images as `style_images` |

**Style lock-in rule**: After generating the first 2 assets, pass them as `style_images` to `/generate-with-style-pro` for all remaining generation. This enforces visual coherence across all assets.

---

## Phase 3 — API Call Workflow

All "pro" endpoints are **asynchronous**. Use this pattern:

```javascript
// 1. POST → get job_id
const { data } = await fetch('https://api.pixellab.ai/v2/<endpoint>', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${PIXELLAB_API_KEY}` },
  body: JSON.stringify(payload)
}).then(r => r.json());

// 2. Poll until complete (use pixellab-client.js)
const result = await pollJob(data.job_id);

// 3. Use the base64 image
const imgSrc = `data:image/png;base64,${result.data.images[0].base64}`;
```

> Ready-to-use polling client: `scripts/pixellab-client.js`
> Full scene orchestration: `scripts/generate-scene.js`

**Sync endpoints** (no polling needed): `/create-image-bitforge`, `/animate-with-skeleton`

Always check `usage.remaining_credits` in the API response before large batches.

---

## Phase 4 — CSS/JS Architecture

> Full patterns: `references/css-patterns.md`

### Non-negotiable CSS rules for pixel art

```css
/* Always apply to all pixel art images and canvases */
img.pixel, canvas {
  image-rendering: pixelated;   /* Chrome, Edge */
  image-rendering: crisp-edges; /* Firefox */
}

/* Scale only at integer multiples (2x, 3x, 4x) — NEVER 1.5x */
.sprite-2x { transform: scale(2); transform-origin: top left; }
```

### Scene layer architecture

```
<div class="scene">
  <div class="layer-sky">        <!-- Parallax bg, moves 0.1x scroll -->
  <div class="layer-midground">  <!-- Trees, foliage, moves 0.4x scroll -->
  <div class="layer-ground">     <!-- Tileset floor, player level, fixed -->
  <div class="layer-objects">    <!-- Interactive sprites (monkey, tree) -->
  <div class="layer-hud">        <!-- UI overlay: dialogue, cards, nav -->
</div>
```

### Sprite animation pattern

```css
.monkey-idle {
  width: 64px; height: 64px;
  background: url('/assets/monkey-idle.png') 0 0;
  animation: anim-idle 0.6s steps(4) infinite; /* steps = frame count */
}
@keyframes anim-idle {
  to { background-position: -256px 0; } /* 4 frames × 64px wide */
}
```

### Interaction system

Add `data-interact` + floating badge above all interactive objects:

```html
<div class="interactive-object" data-interact="tree" data-label="Mes projets">
  <div class="interact-badge">!</div>
  <img class="pixel sprite-2x" src="/assets/tree.png" />
</div>
```

On click: dispatch a custom event `pixelart:interact` with the object id.

---

## Phase 5 — Prompt Engineering for PixelLab

Format: `"[subject], [style qualifiers], [view], [material/texture], pixel art"`

**Jungle portfolio examples:**

| Asset | Prompt |
|---|---|
| Monkey NPC | `"friendly brown monkey NPC, cartoon style, side view, wearing a small satchel, warm jungle colors, transparent background, pixel art"` |
| Interactive tree | `"large tropical jungle tree with glowing golden fruits, lush green leaves, detailed bark, side view, pixel art, transparent background"` |
| Ground tiles lower | `"lush tropical grass with small flowers"` |
| Ground tiles upper | `"dirt jungle path"` |
| Dialogue box | `"wooden dialogue box panel with rope frame decoration, warm brown parchment tones, RPG fantasy style, pixel art UI"` |
| Project card | `"stone tablet item card with green gem, fantasy RPG inventory style, pixel art UI element"` |
| Sky background | `"tropical jungle sky, warm sunset orange, palm tree silhouettes, atmospheric haze, wide panoramic, pixel art"` |

**Color palette**: Pass `color_palette: "warm greens, earthy browns, golden accents"` to all calls and use the first generated tileset as `color_image` for subsequent character/object calls.

---

## Recommended Generation Order

1. **Ground tileset** (`/create-tileset-async`) → establishes base visual language
2. **Sky background** (`/generate-image-pro`) → use tileset `color_palette`
3. **Main NPC character** (`/character-from-text-4-directions`) → with animations
4. **Interactive environment objects** (tree, etc.) → `/create-image-pixflux`
5. **UI panels** (dialogue box, project cards) → `/generate-ui-v2`
6. **Ambient decorations + particles** → `/create-image-pixflux`, smallest last

---

## References

- [`references/api-endpoints.md`](references/api-endpoints.md) — Complete PixelLab endpoint specs with all parameters
- [`references/style-guide.md`](references/style-guide.md) — Style parameter combinations (outline, shading, detail, view)
- [`references/css-patterns.md`](references/css-patterns.md) — Pixel-perfect CSS/JS patterns (dialogue, tilemap, parallax, sprites)
- [`references/asset-mapping.md`](references/asset-mapping.md) — Full object → endpoint decision tree with examples
- [`scripts/pixellab-client.js`](scripts/pixellab-client.js) — Async API client with polling helper
- [`scripts/generate-scene.js`](scripts/generate-scene.js) — Scene orchestrator: batch generation + save logic
