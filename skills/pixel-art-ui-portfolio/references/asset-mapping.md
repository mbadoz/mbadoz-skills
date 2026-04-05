# Asset Mapping — Narrative Object → PixelLab Endpoint

## How to Use This File

Given a narrative brief, identify each object, then find its row in the tables below:
1. **Category** → which table to use
2. **Endpoint** → which API call to make
3. **Config** → key parameters to set
4. **Implicit needed** → what you must also generate for this asset to work

---

## 🌿 Environment & Background Assets

| Object | Endpoint | Size | Key Config | Implicit Needed |
|---|---|---|---|---|
| Sky / horizon | `/generate-image-pro` | 512×288 | `shading=none`, `detail=high` | — |
| Full background scene | `/generate-image-pro` | 512×288 | use first tileset as `style_image` | Ground tileset |
| Ground / floor tileset | `/create-tileset-async` | tile 32×32 | `view=low top-down` | — |
| Top-down map | `/create-top-down-tileset-async` | tile 32×32 | `view=high top-down` | — |
| Sidescroller platform | `/create-sidescroller-tileset-async` | tile 32×32 | — | — |
| Tree (decorative) | `/create-image-pixflux` | 96×128 | `no_background=true`, `view=side` | Ground |
| Rock / stone | `/create-image-pixflux` | 64×64 | `no_background=true` | Ground |
| Bush / shrub | `/create-image-bitforge` | 32×32 | `no_background=true` | Ground, Tree |
| Flower | `/create-image-bitforge` | 16×16 | `no_background=true` | Bush |
| Water body | `/create-tileset-async` | tile 32×32 | `lower="water"`, `upper="ground"` | Ground |
| Bridge | `/create-image-pixflux` | 128×48 | `view=side`, `no_background=true` | Water, Ground |
| Mountain | `/generate-image-pro` | 256×192 | `no_background=true` | Sky |
| Cave entrance | `/create-image-pixflux` | 128×128 | `no_background=true`, `view=side` | Ground |
| Road / path tiles | `/create-tileset-async` | tile 16×16 | `lower="grass"`, `upper="dirt road"` | — |

---

## 👾 Characters & NPCs

| Object | Endpoint | Size | Key Config | Implicit Needed |
|---|---|---|---|---|
| Main NPC (4 dirs) | `/character-from-text-4-directions` | 64×64 | `view=side`, `no_background=true` | Ground to stand on |
| Main NPC (8 dirs) | `/character-from-text-8-directions` | 64×64 | `view=side`, `no_background=true` | Ground |
| NPC idle animation | `/character-animation` | same | `template_animation_id=breathing-idle` | Char created first |
| NPC walk animation | `/character-animation` | same | `template_animation_id=walking` | Char created first |
| NPC talk animation | `/character-animation` | same | `template_animation_id=waving` | Char created first |
| Player avatar | `/character-from-text-4-directions` | 64×64 | `view=side`, `no_background=true` | — |
| Animal companion | `/character-from-text-4-directions` | 48×48 | `template_id=cat` or `dog` | — |
| Boss character | `/generate-with-style-pro` | 96×128 | use existing char as `style_images` | — |
| Portrait (face close-up) | `/create-image-pixflux` | 64×64 | `view=perspective` or `side`, `no_background=true` | NPC sprite (for style ref) |

**Monkey NPC specifically:**
```json
{
  "endpoint": "/character-from-text-4-directions",
  "description": "friendly brown monkey NPC, cartoon style, side view, wearing small leather satchel bag, warm tropical colors, expressive face, pixel art character sprite",
  "image_size": { "width": 64, "height": 64 },
  "view": "side",
  "outline": "medium",
  "shading": "soft",
  "detail": "medium",
  "no_background": true
}
```

---

## 🖼️ UI Elements

| Object | Endpoint | Size | Key Config | Implicit Needed |
|---|---|---|---|---|
| Dialogue box | `/generate-ui-v2` | 320×80 | `no_background=false`, scene `color_palette` | — |
| Project card / item card | `/generate-ui-v2` | 200×260 | `no_background=false`, card colors | — |
| Inventory grid | `/generate-ui-v2` | 256×256 | `no_background=false` | Project cards |
| Button (standard) | `/generate-ui-v2` | 96×24 | `no_background=false` | — |
| Button (small/icon) | `/create-image-bitforge` | 32×16 | `no_background=false` | — |
| Health / progress bar | `/generate-ui-v2` | 128×16 | `color_palette=red and grey` | — |
| Experience bar | `/generate-ui-v2` | 128×16 | `color_palette=blue and dark` | — |
| HUD frame / border | `/generate-ui-v2` | varies | `no_background=false` | Scene palette |
| Minimap frame | `/generate-ui-v2` | 96×96 | `no_background=false` | — |
| Tooltip panel | `/generate-ui-v2` | 160×60 | small, scene colors | — |
| Menu screen overlay | `/generate-image-pro` | 512×384 | Full-page UI including decorations | — |
| Sound toggle icon | `/create-image-bitforge` | 16×16 | `no_background=true` | — |
| Loading bar fill | `/create-image-bitforge` | 128×16 | `no_background=false` | — |

---

## ✨ Decorations & FX

| Object | Endpoint | Size | Key Config | Implicit Needed |
|---|---|---|---|---|
| Firefly / particle | `/create-image-bitforge` | 8×8 | `no_background=true`, glow effect | — |
| Falling leaf | `/create-image-bitforge` | 8×8 | `no_background=true` | — |
| Exclamation badge "!" | `/create-image-bitforge` | 16×16 | `no_background=true`, yellow | — |
| Question badge "?" | `/create-image-bitforge` | 16×16 | `no_background=true`, yellow | — |
| Star / sparkle | `/create-image-bitforge` | 8×8 | `no_background=true` | — |
| Custom cursor | `/create-image-bitforge` | 16×16 | `no_background=true` | — |
| Shadow ellipse | Generated CSS `border-radius` | — | Pure CSS oval, no API needed | — |
| Chest (closed/open) | `/create-image-pixflux` | 48×48 | `no_background=true`, 2 frames | — |

---

## 🗺️ Portfolio-Specific Metaphor Mappings

| Narrative Object | Meaning | Recommended Approach |
|---|---|---|
| "Un arbre qui montre mes projets" | Interactive tree → project list | Tree: `/create-image-pixflux`; Project cards: `/generate-ui-v2`; Click → modal overlay |
| "Un singe qui parle de mes expériences" | NPC monkey → experience dialogue | Char: `/character-from-text-4-directions` + animations; Dialogue: `/generate-ui-v2` + `DialogueSystem` JS |
| "Un donjon avec mes compétences" | Dungeon rooms = skill categories | Isometric tiles: `/create-isometric-tile-async`; Room preview cards: `/generate-ui-v2` |
| "Une ville avec mes services" | City buildings = service offerings | Tileset (streets): `/create-top-down-tileset-async`; Buildings: `/create-image-pixflux` |
| "Un vaisseau spatial avec mes projets" | Spaceship rooms = projects | Tileset (space floor): `/create-tileset-async`; Ship objects: `/create-image-pixflux` |
| "Une bibliothèque avec mes articles" | Books on shelves = blog posts | Background: `/generate-image-pro`; Book items: `/create-image-bitforge` |
| "Un marché avec mes produits" | Market stalls = product offerings | Tileset (market floor), stall objects: `/create-image-pixflux` |

---

## Generation Sequence Template

Given ANY narrative brief, follow this order:

```
Step 1: Ground/environment tileset (establishes visual palette)
Step 2: Sky/background (match palette from step 1)
Step 3: Main NPC character + animations (core interactive element)
Step 4: Interactive environment objects (trees, buildings, etc.)
Step 5: Portrait images for dialogue (derived from NPC style)
Step 6: UI elements (dialogue box, cards) — use scene palette
Step 7: Small decorations (particles, badges, cursor)
```

**After step 2**: Always use `/generate-with-style-pro` with step 1+2 outputs as `style_images` for all remaining generations to ensure style lock-in.
