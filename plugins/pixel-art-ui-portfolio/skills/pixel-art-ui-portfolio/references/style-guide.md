# Pixel Art Style Guide

## Core Style Parameters

All image generation endpoints accept these style parameters. Use them consistently across all assets in a scene for visual coherence.

### outline
Controls the pixel outline around shapes.
| Value | Use case |
|---|---|
| `"thin"` | Icons, UI elements, small sprites (≤32px) |
| `"medium"` | Characters, environment objects (32–128px) ⭐ default |
| `"thick"` | Bold cartoon style, dialogue boxes |
| `"none"` | Background art, atmospheric elements |

### shading
Controls light/shadow rendering style.
| Value | Use case |
|---|---|
| `"flat"` | Minimalist, mobile-first, icons |
| `"soft"` | Friendly cartoon, NPC characters ⭐ default |
| `"hard"` | Action games, dramatic contrast |
| `"none"` | Silhouette art, UI overlays |

### detail
Controls pixel density and texture complexity.
| Value | Use case |
|---|---|
| `"low"` | Icons, small UI elements (≤32px) |
| `"medium"` | Characters, interactive objects ⭐ default |
| `"high"` | Backgrounds, tilesets, hero environment art |

### view
Camera angle.
| Value | Use case |
|---|---|
| `"side"` | Characters, NPCs, side-scrollers |
| `"low top-down"` | Tilesets, RPG maps, top-down scenes |
| `"high top-down"` | Aerial maps, bird's-eye environments |
| `"perspective"` | Isometric objects, 3D-looking assets |

---

## Presets by Scene Theme

### 🌴 Jungle / Tropical Portfolio
```json
{
  "outline": "medium",
  "shading": "soft",
  "detail": "medium",
  "color_palette": "warm greens, earthy browns, golden yellow accents",
  "text_guidance_scale": 8
}
```

Palette hex reference (for CSS):
- Primary green: `#4a7c3f`
- Dark jungle: `#2d4a1e`
- Earth/bark: `#6b4226`
- Golden accent: `#d4a017`
- Sky orange: `#e8823a`
- Highlight: `#f0d060`

### 🏰 Fantasy / Medieval
```json
{
  "outline": "thick",
  "shading": "hard",
  "detail": "high",
  "color_palette": "stone grey, royal purple, gold, parchment"
}
```

### 🚀 Sci-Fi / Space
```json
{
  "outline": "thin",
  "shading": "hard",
  "detail": "high",
  "color_palette": "dark navy, neon cyan, electric blue, white highlights"
}
```

### 🏙️ City / Urban
```json
{
  "outline": "medium",
  "shading": "flat",
  "detail": "medium",
  "color_palette": "concrete grey, brick red, warm light yellow, neon accents"
}
```

### 🌊 Ocean / Underwater
```json
{
  "outline": "medium",
  "shading": "soft",
  "detail": "medium",
  "color_palette": "deep ocean blue, turquoise, coral pink, seafoam green"
}
```

---

## Size Recommendations by Asset Type

| Asset | Recommended Size | Notes |
|---|---|---|
| NPC character (idle) | 64×64 | Render at 2x–3x in CSS |
| Character (4 directions) | 64×64 per direction | Sprite sheet per animation |
| Environment object (tree) | 96×128 | No background |
| Background panorama | 512×288 | 16:9 ratio |
| Ground tile | 32×32 | Wang tileset |
| Dialogue box UI | 320×80 | Bottom third of screen |
| Project card UI | 200×260 | Portrait card |
| Icon / badge | 16×16 | Bitforge endpoint |
| Nav button | 48×16 | Horizontal button |
| Custom cursor | 16×16 | Must be exact |

---

## Color Palette Consistency Strategy

1. Generate the **ground tileset first** — its colors define the palette
2. Pass the tileset image as `color_image` to all subsequent character/object generations
3. For UI elements, extract the 3 dominant colors from the tileset and pass as `color_palette` text
4. After 2–3 generated assets, switch to `/generate-with-style-pro` passing them as `style_images`

### Extracting palette for `color_palette` param
Describe it as: `"[dominant color], [accent color], [highlight color]"`

Example: `"warm tropical green, earthy dark brown, golden amber highlights"`

---

## Prompt Templates by Asset Type

### NPC Character
```
"[adjective] [species] [role], [personality trait], side view, [clothing detail], [color description], pixel art character sprite, transparent background"
```
Example: `"friendly brown monkey NPC, curious expression, side view, wearing small leather satchel, warm jungle colors, pixel art character sprite, transparent background"`

### Environment Object
```
"[size] [adjective] [object], [style detail], [view] view, [texture detail], pixel art, transparent background"
```
Example: `"large ancient jungle tree, twisted roots, lush canopy, side view, rough bark texture with glowing fruits, pixel art, transparent background"`

### Background Scene
```
"[environment] [mood], [time of day], [atmospheric effect], [specific details], wide panoramic view, pixel art background"
```
Example: `"tropical jungle clearing at golden hour, warm sunset haze, dense foliage silhouettes, fireflies, wide panoramic view, pixel art background"`

### UI Panel
```
"[material] [shape] [function], [decorative detail], [style reference] style, [color description], pixel art UI [element type]"
```
Example: `"wooden rectangular dialogue box, rope border decoration, parchment center, RPG fantasy style, warm brown and cream colors, pixel art UI panel"`

### Tileset
- `lower_description`: `"[terrain type] with [surface detail]"`
- `upper_description`: `"[elevated terrain] with [surface detail]"`

Example: `lower="lush tropical grass with small white wildflowers"`, `upper="packed dirt jungle path with small pebbles"`

---

## Common Mistakes to Avoid

| ❌ Wrong | ✅ Correct |
|---|---|
| Mixing outline styles (thin NPC + thick tree) | Use same `outline` for all assets in scene |
| Generating char at 32×32 then upscaling in CSS to 200px | Keep CSS scale ≤4x; generate larger if needed |
| Using `/generate-image-pro` for icons | Use `/create-image-bitforge` for ≤200px assets |
| Not setting `no_background: true` for sprites | Always set it for any asset placed over a background |
| Random seeds for each asset | Reuse same or sequential seeds for style consistency |
| Generating all assets simultaneously | Generate tileset first → use as style reference for others |
