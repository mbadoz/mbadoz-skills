/**
 * PixelLab API Client — Async Polling Helper
 * Usage: import { PixelLabClient } from './pixellab-client.js'
 *
 * Requires: PIXELLAB_API_KEY environment variable (Node.js) or window.PIXELLAB_API_KEY (browser)
 */

const BASE_URL = 'https://api.pixellab.ai/v2';

function getApiKey() {
  if (typeof process !== 'undefined' && process.env.PIXELLAB_API_KEY) {
    return process.env.PIXELLAB_API_KEY;
  }
  if (typeof window !== 'undefined' && window.PIXELLAB_API_KEY) {
    return window.PIXELLAB_API_KEY;
  }
  throw new Error('PIXELLAB_API_KEY not set. Set via env or window.PIXELLAB_API_KEY');
}

/**
 * Core fetch wrapper with auth headers
 */
async function pixelFetch(path, options = {}) {
  const apiKey = getApiKey();
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(`PixelLab API error ${response.status}: ${JSON.stringify(json.error || json)}`);
  }

  return json;
}

/**
 * Poll a background job until completion
 * @param {string} jobId - The background job ID from an async endpoint
 * @param {object} options
 * @param {number} options.intervalMs - Polling interval in ms (default: 2000)
 * @param {number} options.timeoutMs - Max wait time in ms (default: 120000)
 * @param {function} options.onProgress - Optional callback with { status, jobId }
 * @returns {Promise<object>} - The completed job data
 */
async function pollJob(jobId, options = {}) {
  const {
    intervalMs = 2000,
    timeoutMs = 120000,
    onProgress = null
  } = options;

  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    const result = await pixelFetch(`/background-jobs/${jobId}`);

    const status = result.data?.status;
    if (onProgress) onProgress({ status, jobId, elapsed: Date.now() - startTime });

    if (status === 'complete') return result;
    if (status === 'failed') throw new Error(`Job ${jobId} failed: ${result.data?.error}`);

    // Exponential backoff: 2s → 3s → 4s → max 8s
    const backoff = Math.min(intervalMs * Math.pow(1.3, Math.floor((Date.now() - startTime) / 10000)), 8000);
    await sleep(backoff);
  }

  throw new Error(`Job ${jobId} timed out after ${timeoutMs}ms`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Convert a base64 string to a data URL for use in <img> src
 * @param {string} base64 - Base64 image data
 * @param {string} format - Image format ('png', 'jpeg')
 * @returns {string} Data URL
 */
function base64ToDataUrl(base64, format = 'png') {
  return `data:image/${format};base64,${base64}`;
}

/**
 * Convert a File or Blob to base64 (browser only)
 * @param {File|Blob} file
 * @returns {Promise<{base64: string, format: string}>}
 */
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const [header, base64] = dataUrl.split(',');
      const format = header.includes('jpeg') ? 'jpeg' : 'png';
      resolve({ base64, format });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ============================================================
// HIGH-LEVEL API METHODS
// ============================================================

const PixelLabClient = {

  /**
   * Check account balance before generating
   */
  async getBalance() {
    const res = await pixelFetch('/balance');
    return res.data;
  },

  // ─── CHARACTERS ──────────────────────────────────────────

  /**
   * Generate a character facing 4 directions (async)
   * @param {object} params - PixelLab /character-from-text-4-directions params
   * @returns {Promise<{character_id, images}>} Character ID + direction images
   */
  async createCharacter4Dir(params) {
    const res = await pixelFetch('/character-from-text-4-directions', {
      method: 'POST',
      body: JSON.stringify(params)
    });
    const { job_id } = res.data;
    const result = await pollJob(job_id);
    return result.data;
  },

  /**
   * Animate an existing character with a template animation (async)
   * @param {string} characterId
   * @param {string} templateAnimationId - e.g. 'breathing-idle', 'walking'
   * @param {object} extraParams - Additional params
   */
  async animateCharacter(characterId, templateAnimationId, extraParams = {}) {
    const res = await pixelFetch('/character-animation', {
      method: 'POST',
      body: JSON.stringify({
        character_id: characterId,
        template_animation_id: templateAnimationId,
        ...extraParams
      })
    });
    const { job_id } = res.data;
    const result = await pollJob(job_id);
    return result.data;
  },

  // ─── IMAGES ──────────────────────────────────────────────

  /**
   * Fast sync image generation (up to 400×400px)
   * @param {object} params - /create-image-pixflux params
   * @returns {Promise<{images: Array<{base64, format}>}>}
   */
  async createImageSync(params) {
    const res = await pixelFetch('/create-image-pixflux', {
      method: 'POST',
      body: JSON.stringify(params)
    });
    return res.data;
  },

  /**
   * Fast sync small image (up to 200×200px) — good for icons, badges
   * @param {object} params - /create-image-bitforge params
   */
  async createImageSmall(params) {
    const res = await pixelFetch('/create-image-bitforge', {
      method: 'POST',
      body: JSON.stringify(params)
    });
    return res.data;
  },

  /**
   * High-quality async image generation (up to 792×688px)
   * @param {object} params - /generate-image-pro params
   */
  async generateImagePro(params) {
    const res = await pixelFetch('/generate-image-pro', {
      method: 'POST',
      body: JSON.stringify(params)
    });
    const { job_id } = res.data;
    const result = await pollJob(job_id);
    return result.data;
  },

  /**
   * Generate new assets matching the style of existing assets
   * @param {Array} styleImages - Array of {image: {type, base64, format}, size: {width, height}}
   * @param {string} description - What to generate
   * @param {object} extraParams
   */
  async generateWithStyle(styleImages, description, extraParams = {}) {
    const res = await pixelFetch('/generate-with-style-pro', {
      method: 'POST',
      body: JSON.stringify({ style_images: styleImages, description, ...extraParams })
    });
    const { job_id } = res.data;
    const result = await pollJob(job_id);
    return result.data;
  },

  // ─── UI ──────────────────────────────────────────────────

  /**
   * Generate a pixel art UI element (async)
   * @param {string} description - e.g. "wooden dialogue box with rope border, RPG style"
   * @param {object} params - { image_size, color_palette, no_background, seed }
   */
  async generateUI(description, params = {}) {
    const res = await pixelFetch('/generate-ui-v2', {
      method: 'POST',
      body: JSON.stringify({ description, ...params })
    });
    const { job_id } = res.data;
    const result = await pollJob(job_id);
    return result.data;
  },

  // ─── TILESETS ────────────────────────────────────────────

  /**
   * Create a Wang tileset (async)
   * @param {object} params - { lower_description, upper_description, tile_size, view, ... }
   * @returns {Promise<object>} Tileset data with base64 image
   */
  async createTileset(params) {
    const res = await pixelFetch('/create-tileset-async', {
      method: 'POST',
      body: JSON.stringify(params)
    });
    const { job_id, tileset_id } = res.data;

    // Tilesets use their own polling endpoint
    if (tileset_id) {
      return await this._pollTileset(tileset_id);
    }
    const result = await pollJob(job_id);
    return result.data;
  },

  async _pollTileset(tilesetId, timeoutMs = 120000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
      const res = await pixelFetch(`/tilesets/${tilesetId}`);
      if (res.data?.status !== 'pending') return res.data;
      await sleep(3000);
    }
    throw new Error(`Tileset ${tilesetId} timed out`);
  },

  // ─── UTILITIES ───────────────────────────────────────────

  base64ToDataUrl,
  fileToBase64,

  /**
   * Convert base64 images from API result to <img> data URLs
   * @param {object} result - API response data containing images array
   * @returns {string[]} Array of data URLs
   */
  getDataUrls(result) {
    const images = result.images || result.frames || [];
    return images.map(img => base64ToDataUrl(img.base64, img.format || 'png'));
  },

  /**
   * Create an image element from API result (browser only)
   * @param {object} result - API response data
   * @param {number} index - Frame index (default: 0)
   * @returns {HTMLImageElement}
   */
  createImageEl(result, index = 0) {
    const images = result.images || result.frames || [];
    const img = document.createElement('img');
    img.src = base64ToDataUrl(images[index].base64, images[index].format || 'png');
    img.style.imageRendering = 'pixelated';
    return img;
  }
};

// Export for Node.js or browser module
if (typeof module !== 'undefined') module.exports = { PixelLabClient, pollJob, base64ToDataUrl };
if (typeof window !== 'undefined') window.PixelLabClient = PixelLabClient;
