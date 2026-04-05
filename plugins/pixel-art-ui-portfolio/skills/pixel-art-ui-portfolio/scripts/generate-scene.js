/**
 * Scene Generator — Generic batch generation orchestrator for pixel art sites
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠️  THIS FILE IS A TEMPLATE — copy it and adapt SCENE_CONFIG for your project.
 *      The SceneGenerator class below is fully generic and works for any theme.
 *
 * HOW TO USE:
 *   1. Copy this file to your project: cp generate-scene.js my-project/gen-assets.js
 *   2. Edit MY_SCENE_CONFIG below to match your narrative brief
 *   3. Run: PIXELLAB_API_KEY=your_key node gen-assets.js
 *   4. Assets are saved to ./public/assets/ + a manifest.json is generated
 *
 * SCENE_CONFIG STRUCTURE:
 *   Each entry in `assets` is one PixelLab generation call.
 *   `order` controls generation sequence (tilesets first → characters → UI → decorations)
 *   `endpoint` maps to a method on PixelLabClient (see pixellab-client.js)
 *   `params` are passed verbatim to the PixelLab API
 *
 * SUPPORTED ENDPOINTS (endpoint field):
 *   'createTileset'        → /create-tileset-async         (ground, terrain)
 *   'generateImagePro'     → /generate-image-pro           (backgrounds, panoramas)
 *   'createImageSync'      → /create-image-pixflux         (objects, sprites ≤400px)
 *   'createImageSmall'     → /create-image-bitforge        (icons, badges ≤200px)
 *   'createCharacter4Dir'  → /character-from-text-4-dirs   (NPC characters)
 *   'generateUI'           → /generate-ui-v2               (panels, buttons, dialogue)
 *
 * STYLE LOCK-IN (automatic):
 *   After the first 2 assets are generated, all subsequent image/object assets
 *   automatically use /generate-with-style-pro to stay visually consistent.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ============================================================
// MINIMAL CONFIG SKELETON — copy this for any new project
// ============================================================
//
// const MY_SCENE_CONFIG = {
//   assets: {
//     ground: {
//       endpoint: 'createTileset', order: 1,
//       params: { lower_description: '...', upper_description: '...', tile_size: { width: 32, height: 32 } }
//     },
//     background: {
//       endpoint: 'generateImagePro', order: 2,
//       params: { description: '...', image_size: { width: 512, height: 288 } }
//     },
//     main_npc: {
//       endpoint: 'createCharacter4Dir', order: 3,
//       params: { description: '...', image_size: { width: 64, height: 64 }, no_background: true },
//       animations: ['breathing-idle'] // optional
//     },
//     ui_panel: {
//       endpoint: 'generateUI', order: 4,
//       description: '...', params: { image_size: { width: 320, height: 80 }, color_palette: '...' }
//     }
//   }
// };
// const gen = new SceneGenerator(MY_SCENE_CONFIG);
// const assets = await gen.generateAll();

// ============================================================
// EXAMPLE CONFIG — Jungle Portfolio (adapt for your project)
// ============================================================

const EXAMPLE_JUNGLE_CONFIG = {
  theme: 'jungle',           // Informational only, used for logging
  palette: 'warm tropical greens, earthy brown, golden amber accents',
  style: { outline: 'medium', shading: 'soft', detail: 'medium' },
  seed: 42,                  // Use same seed across related assets for consistency

  assets: {
    // ─── STEP 1: TILESET (establishes palette) ────────────
    ground_tileset: {
      endpoint: 'createTileset',
      order: 1,
      params: {
        lower_description: 'lush tropical grass with small white wildflowers',
        upper_description: 'packed dirt jungle path with small pebbles',
        transition_description: 'grass gradually fading into dirt',
        tile_size: { width: 32, height: 32 },
        text_guidance_scale: 8,
        outline: 'medium',
        shading: 'soft',
        detail: 'medium',
        view: 'low top-down',
        transition_size: 0.5,
        seed: 42
      }
    },

    // ─── STEP 2: BACKGROUND ───────────────────────────────
    sky_background: {
      endpoint: 'generateImagePro',
      order: 2,
      params: {
        description: 'tropical jungle clearing sky at golden sunset, warm orange haze, dense palm tree silhouettes, atmospheric depth, glowing fireflies, wide panoramic view, pixel art background',
        image_size: { width: 512, height: 288 },
        no_background: false,
        seed: 43
      }
    },

    // ─── STEP 3: MAIN NPC ─────────────────────────────────
    monkey_npc: {
      endpoint: 'createCharacter4Dir',
      order: 3,
      params: {
        description: 'friendly brown monkey NPC, curious and warm expression, side view, wearing small worn leather satchel bag, tropical jungle colors, expressive large eyes, pixel art character sprite',
        image_size: { width: 64, height: 64 },
        view: 'side',
        outline: 'medium',
        shading: 'soft',
        detail: 'medium',
        no_background: true,
        seed: 44
      },
      // After generation: create animations
      animations: ['breathing-idle', 'waving']
    },

    // ─── STEP 4: INTERACTIVE TREE ─────────────────────────
    interactive_tree: {
      endpoint: 'createImageSync',
      order: 4,
      params: {
        description: 'large ancient tropical jungle tree with massive canopy, twisted roots, lush green leaves, glowing golden fruits, detailed rough bark texture, side view, pixel art, transparent background',
        image_size: { width: 128, height: 160 },
        text_guidance_scale: 8,
        outline: 'medium',
        shading: 'soft',
        detail: 'high',
        view: 'side',
        no_background: true,
        seed: 45
      }
    },

    // ─── STEP 5: UI PANELS ────────────────────────────────
    dialogue_box: {
      endpoint: 'generateUI',
      order: 5,
      description: 'rectangular wooden dialogue box with braided rope border, parchment center area, dark wood frame, RPG fantasy adventure style, pixel art UI panel',
      params: {
        image_size: { width: 320, height: 80 },
        no_background: false,
        color_palette: 'dark warm wood, cream parchment, golden rope',
        seed: 46
      }
    },

    project_card: {
      endpoint: 'generateUI',
      order: 6,
      description: 'stone tablet project card with decorative carved border, green emerald gem in top center, dark grey stone texture, RPG item card style, pixel art UI element',
      params: {
        image_size: { width: 200, height: 260 },
        no_background: false,
        color_palette: 'grey stone, gold trim, emerald green',
        seed: 47
      }
    },

    // ─── STEP 7: SMALL DECORATIONS ───────────────────────
    interaction_badge: {
      endpoint: 'createImageSmall',
      order: 7,
      params: {
        description: 'bright yellow exclamation mark badge, rounded square shape, dark outline, pixel art game icon, transparent background',
        image_size: { width: 16, height: 16 },
        outline: 'thin',
        shading: 'flat',
        detail: 'low',
        no_background: true,
        seed: 48
      }
    },

    custom_cursor: {
      endpoint: 'createImageSmall',
      order: 8,
      params: {
        description: 'pixel art cursor arrow pointer, clean shape, white with dark outline, transparent background',
        image_size: { width: 16, height: 16 },
        outline: 'thin',
        shading: 'flat',
        detail: 'low',
        no_background: true,
        seed: 49
      }
    }
  }
};

// ============================================================
// GENERATOR CLASS
// ============================================================

class SceneGenerator {
  constructor(config = SCENE_CONFIG, client = null) {
    this.config = config;
    this.client = client || (typeof PixelLabClient !== 'undefined' ? PixelLabClient : require('./pixellab-client.js').PixelLabClient);
    this.generatedAssets = {};
    this.styleImages = []; // Built up as assets are generated
  }

  /**
   * Generate all assets in order
   * @param {function} onAssetComplete - Callback(assetName, dataUrl, result)
   * @returns {Promise<object>} Map of asset name → { dataUrl, result }
   */
  async generateAll(onAssetComplete = null) {
    // Check balance first
    const balance = await this.client.getBalance();
    console.log(`PixelLab balance: ${balance.remaining_credits} credits, ${balance.remaining_generations} generations`);

    // Sort assets by order
    const sortedAssets = Object.entries(this.config.assets)
      .sort(([, a], [, b]) => (a.order || 99) - (b.order || 99));

    for (const [name, assetConfig] of sortedAssets) {
      console.log(`Generating: ${name}...`);

      try {
        const result = await this._generateAsset(name, assetConfig);
        const dataUrls = this.client.getDataUrls(result);

        this.generatedAssets[name] = { result, dataUrls, dataUrl: dataUrls[0] };

        // Add first 3 generated assets to style reference pool
        if (this.styleImages.length < 3 && result.images?.[0]) {
          this.styleImages.push({
            image: result.images[0],
            size: this._getSizeFromConfig(assetConfig)
          });
        }

        // Handle character animations
        if (assetConfig.animations && result.character_id) {
          for (const animId of assetConfig.animations) {
            console.log(`  Animating ${name}: ${animId}...`);
            const animResult = await this.client.animateCharacter(
              result.character_id,
              animId,
              { directions: ['south', 'east'] }
            );
            this.generatedAssets[`${name}_${animId}`] = {
              result: animResult,
              dataUrls: this.client.getDataUrls(animResult)
            };
          }
        }

        if (onAssetComplete) onAssetComplete(name, dataUrls[0], result);
        console.log(`  ✅ ${name} complete`);

      } catch (err) {
        console.error(`  ❌ ${name} failed:`, err.message);
        this.generatedAssets[name] = { error: err.message };
      }
    }

    return this.generatedAssets;
  }

  async _generateAsset(name, assetConfig) {
    const { endpoint, params, description } = assetConfig;

    // After 2 style images collected, use generateWithStyle for image assets
    if (this.styleImages.length >= 2 && ['createImageSync', 'generateImagePro'].includes(endpoint)) {
      return await this.client.generateWithStyle(
        this.styleImages,
        params.description || description || name,
        { image_size: params.image_size, no_background: params.no_background }
      );
    }

    switch (endpoint) {
      case 'createTileset':      return await this.client.createTileset(params);
      case 'generateImagePro':   return await this.client.generateImagePro(params);
      case 'createImageSync':    return await this.client.createImageSync(params);
      case 'createImageSmall':   return await this.client.createImageSmall(params);
      case 'createCharacter4Dir': return await this.client.createCharacter4Dir(params);
      case 'generateUI':
        return await this.client.generateUI(description || params.description, params);
      default:
        throw new Error(`Unknown endpoint: ${endpoint}`);
    }
  }

  _getSizeFromConfig(assetConfig) {
    const p = assetConfig.params;
    return {
      width: p.image_size?.width || p.tile_size?.width || 64,
      height: p.image_size?.height || p.tile_size?.height || 64
    };
  }

  /**
   * Save all generated assets to files (Node.js only)
   * @param {string} outputDir - Directory to save images
   */
  async saveToFiles(outputDir = './assets') {
    const fs = await import('fs/promises');
    const path = await import('path');

    await fs.mkdir(outputDir, { recursive: true });

    for (const [name, asset] of Object.entries(this.generatedAssets)) {
      if (asset.error || !asset.result) continue;

      const images = asset.result.images || asset.result.frames || [];
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const filename = images.length > 1 ? `${name}_frame${i}.png` : `${name}.png`;
        const filepath = path.join(outputDir, filename);
        const buffer = Buffer.from(img.base64, 'base64');
        await fs.writeFile(filepath, buffer);
        console.log(`Saved: ${filepath}`);
      }
    }
  }

  /**
   * Generate a manifest JSON for the web app to load assets
   * @returns {object} Asset manifest with filenames and metadata
   */
  getManifest() {
    const manifest = { assets: {}, generated_at: new Date().toISOString() };
    for (const [name, asset] of Object.entries(this.generatedAssets)) {
      const images = asset.result?.images || asset.result?.frames || [];
      manifest.assets[name] = {
        files: images.length > 1
          ? images.map((_, i) => `${name}_frame${i}.png`)
          : [`${name}.png`],
        frame_count: images.length,
        error: asset.error || null
      };
    }
    return manifest;
  }
}

// ============================================================
// CLI RUNNER (Node.js)
// ============================================================

if (typeof process !== 'undefined' && process.argv[1]?.endsWith('generate-scene.js')) {
  const { PixelLabClient } = require('./pixellab-client.js');

  // ⚠️ Replace EXAMPLE_JUNGLE_CONFIG with your own config object
  const generator = new SceneGenerator(EXAMPLE_JUNGLE_CONFIG, PixelLabClient);

  generator.generateAll((name, dataUrl) => {
    console.log(`Asset ready: ${name}`);
  })
  .then(async (assets) => {
    await generator.saveToFiles('./public/assets');
    const manifest = generator.getManifest();
    const fs = require('fs');
    fs.writeFileSync('./public/assets/manifest.json', JSON.stringify(manifest, null, 2));
    console.log('\n🎨 Scene generation complete!');
    console.log(`Generated ${Object.keys(assets).length} assets`);
  })
  .catch(err => {
    console.error('Scene generation failed:', err);
    process.exit(1);
  });
}

if (typeof module !== 'undefined') module.exports = { SceneGenerator, EXAMPLE_JUNGLE_CONFIG };
if (typeof window !== 'undefined') window.SceneGenerator = SceneGenerator;
