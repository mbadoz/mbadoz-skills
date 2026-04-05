# PixelLab API Endpoints Reference

**Base URL**: `https://api.pixellab.ai/v2`  
**Auth**: `Authorization: Bearer YOUR_PIXELLAB_API_KEY`  
**Response envelope**: `{ success, data, error, usage: { remaining_credits, remaining_generations } }`

## Table of Contents
1. [Account](#account)
2. [Character Generation](#character-generation)
3. [Character Animation](#character-animation)
4. [Image Generation](#image-generation)
5. [UI Generation](#ui-generation)
6. [Tileset / Map Generation](#tileset--map-generation)
7. [Background Jobs](#background-jobs)
8. [Image Formats](#image-formats)

---

## Account

### GET /balance
Returns remaining credits and generations. Call before any large batch.

```js
GET /v2/balance
// Response: { data: { usd_credits, remaining_credits, remaining_generations } }
```

---

## Character Generation

### POST /character-from-text-4-directions ⭐ (async)
Generate a character facing 4 cardinal directions (S, W, E, N).

```json
{
  "description": "friendly brown monkey NPC, side view, wearing satchel, pixel art",
  "image_size": { "width": 64, "height": 64 },
  "outline": "medium",
  "shading": "soft",
  "detail": "medium",
  "view": "side",
  "no_background": true,
  "seed": 42
}
```
- Response: `202` → `{ data: { character_id, job_id } }` — poll `/background-jobs/{job_id}`
- Width/Height: `32–400px` each
- `template_id`: `"mannequin"` (human), `"bear"`, `"cat"`, `"dog"`, `"horse"`, `"lion"`

### POST /character-from-text-8-directions (async)
Same as above, generates 8 directions (all cardinal + diagonal).

### POST /character-animation (async)
Animate an existing character.

```json
{
  "character_id": "char_xxxx",
  "template_animation_id": "breathing-idle",
  "action_description": "calm breathing idle animation",
  "directions": ["south", "east"],
  "outline": "medium",
  "shading": "soft"
}
```
Available `template_animation_id` values:
`backflip`, `breathing-idle`, `cross-punch`, `crouched-walking`, `crouching`, `drinking`, `falling-back-death`, `fight-stance-idle-8-frames`, `fireball`, `flying-kick`, `walking`, `running`, `jumping`, `waving`, `sitting-idle`, `sleeping`

### GET /characters
List created characters. Query params: `limit` (1–100), `offset`

### GET /characters/{character_id}
Get character details including all generated direction images.

### GET /characters/{character_id}/export
Download character as ZIP with all animations.

---

## Character Animation (standalone)

### POST /animate-with-text-v3 (sync, fast)
Animate from a first frame image.

```json
{
  "first_frame": { "type": "base64", "base64": "...", "format": "png" },
  "action": "walking left",
  "frame_count": 8,
  "no_background": true,
  "seed": 0
}
```
- `frame_count`: 4–16 (must be even)
- Returns 200 synchronously with frames

### POST /animate-with-text-pro (async)
More powerful animation from a reference image.

```json
{
  "reference_image": { "type": "base64", "base64": "...", "format": "png" },
  "reference_image_size": { "width": 64, "height": 64 },
  "action": "walking",
  "image_size": { "width": 64, "height": 64 },
  "view": "side",
  "direction": "south",
  "no_background": true
}
```

### POST /interpolate (async, Pro)
Generate frames between two keyframes.

```json
{
  "start_image": { "image": { "type": "base64", "base64": "..." }, "size": { "width": 64, "height": 64 } },
  "end_image": { "image": { "type": "base64", "base64": "..." }, "size": { "width": 64, "height": 64 } },
  "action": "morphing",
  "image_size": { "width": 64, "height": 64 }
}
```

---

## Image Generation

### POST /create-image-pixflux (sync) ⭐
Versatile pixel art scene/object generator. Best for environment objects.

```json
{
  "description": "large tropical jungle tree, side view, detailed bark, transparent background, pixel art",
  "image_size": { "width": 128, "height": 160 },
  "text_guidance_scale": 8,
  "outline": "medium",
  "shading": "soft",
  "detail": "high",
  "view": "side",
  "no_background": true,
  "color_image": { "type": "base64", "base64": "...", "format": "png" }
}
```
- `width/height`: 16–400px
- `view`: `"side"`, `"low top-down"`, `"high top-down"`, `"perspective"`
- `outline`: `"thin"`, `"medium"`, `"thick"`, `"none"`
- `shading`: `"soft"`, `"hard"`, `"flat"`, `"none"`
- `detail`: `"low"`, `"medium"`, `"high"`
- Returns 200 synchronously: `{ data: { images: [{ base64, format }] } }`

### POST /create-image-bitforge (sync, smaller)
Fast generator for small images (up to 200×200px). Good for icons, cursors, badges.

```json
{
  "description": "exclamation mark interaction badge, yellow, pixel art icon",
  "image_size": { "width": 16, "height": 16 },
  "outline": "thin",
  "shading": "flat",
  "detail": "low",
  "no_background": true
}
```

### POST /generate-image-pro (async, Pro) ⭐
Highest quality image generator. Best for backgrounds, panoramic scenes.

```json
{
  "description": "tropical jungle sky panorama, warm sunset, palm silhouettes, atmospheric, pixel art",
  "image_size": { "width": 512, "height": 288 },
  "no_background": false,
  "style_image": { "type": "base64", "base64": "...", "format": "png" },
  "style_options": { "color_palette": true, "outline": true, "detail": true }
}
```
- `width`: 16–792px, `height`: 16–688px
- Returns 202 → poll `/background-jobs/{job_id}`

### POST /generate-with-style-pro (async, Pro) ⭐
Generate new assets matching the style of existing generated assets.

```json
{
  "style_images": [
    { "image": { "type": "base64", "base64": "..." }, "size": { "width": 128, "height": 128 } },
    { "image": { "type": "base64", "base64": "..." }, "size": { "width": 64, "height": 64 } }
  ],
  "description": "stone bridge over a river",
  "image_size": { "width": 128, "height": 96 },
  "no_background": true
}
```
- Up to 4 style reference images
- Returns 202 → poll `/background-jobs/{job_id}`

---

## UI Generation

### POST /generate-ui-v2 (async, Pro) ⭐
Generate pixel art UI elements (panels, buttons, bars, dialogue boxes).

```json
{
  "description": "wooden dialogue box with rope border, parchment background, RPG fantasy style, pixel art UI panel",
  "image_size": { "width": 320, "height": 80 },
  "no_background": false,
  "color_palette": "warm brown, cream, dark wood tones",
  "seed": 42
}
```

```json
{
  "description": "stone tablet project card, fantasy RPG item panel, green gem decoration, pixel art",
  "image_size": { "width": 200, "height": 260 },
  "no_background": false,
  "color_palette": "grey stone, gold, emerald green"
}
```

- `width`: 16–792px, `height`: 16–688px
- `color_palette`: free-text color description (e.g. `"brown and gold"`, `"blue and silver"`)
- `concept_image`: optional base64 image to guide layout
- Returns 202 → poll `/background-jobs/{job_id}`

---

## Tileset / Map Generation

### POST /create-tileset-async ⭐ (async)
Generate a Wang tileset (16–23 seamlessly-tiling tiles).

```json
{
  "lower_description": "lush tropical grass with small white flowers",
  "upper_description": "dirt jungle path with small pebbles",
  "transition_description": "grass fading into dirt",
  "tile_size": { "width": 32, "height": 32 },
  "text_guidance_scale": 8,
  "outline": "medium",
  "shading": "soft",
  "detail": "medium",
  "view": "low top-down",
  "transition_size": 0.5,
  "seed": 42
}
```
- `tile_size`: 16 or 32 px
- `view`: `"low top-down"`, `"high top-down"`
- `transition_size`: 0.0 (sharp), 0.25, 0.5, 1.0 (full blend)
- Returns 202 → poll `/background-jobs/{job_id}`
- **Poll result endpoint**: `GET /tilesets/{tileset_id}`

### POST /create-top-down-tileset-async (async)
For complete top-down game maps. Same params as above.

### POST /create-sidescroller-tileset-async (async)
For 2D platformer terrains.

```json
{
  "lower_description": "jungle stone bricks with moss",
  "transition_description": "vines and creeper plants",
  "tile_size": { "width": 32, "height": 32 }
}
```

### POST /create-isometric-tile-async (async)
Single isometric tile.

```json
{
  "description": "lush green grass isometric tile with tropical flowers",
  "image_size": { "width": 64, "height": 48 },
  "isometric_tile_shape": "thick tile",
  "outline": "medium"
}
```
- `isometric_tile_shape`: `"thin tile"`, `"thick tile"`, `"block"`

### POST /create-tiles-pro-async (async)
Advanced tile generation (hex, isometric, square, octagon).

```json
{
  "description": "1). jungle grass 2). dirt path 3). water pond 4). stone ruins",
  "tile_type": "isometric",
  "tile_size": 32,
  "n_tiles": 4,
  "tile_view": "low top-down"
}
```

---

## Background Jobs

### GET /background-jobs/{job_id}
Poll for async job completion.

```js
// Response when pending:
{ "data": { "status": "pending" } }

// Response when complete:
{ "data": { "status": "complete", "images": [{ "base64": "...", "format": "png" }] } }

// Response when failed:
{ "data": { "status": "failed", "error": "..." } }
```

Poll every **2 seconds** with exponential backoff up to 60s timeout.

---

## Image Formats

All images passed to the API must be base64-encoded:

```js
// Node.js: file → base64
const base64 = fs.readFileSync('./image.png').toString('base64');

// Browser: canvas → base64
const base64 = canvas.toDataURL('image/png').split(',')[1];

// Usage in request:
{ "type": "base64", "base64": base64, "format": "png" }
```
