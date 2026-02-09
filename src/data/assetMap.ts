/**
 * Asset map for pre-built product images from Airtable Asset_Library.
 *
 * Combo key format: {box-color}_{foil-color}_{ribbon-color}
 * e.g. "pure-black_gold_vosges-purple"
 *
 * When per-combo images are generated via the asset pipeline (WF01),
 * update the URLs here — or switch to dynamic fetching from the backend.
 */

export interface ComboAsset {
  comboKey: string;
  status: 'ready' | 'queued';
  images: string[];  // [hero, angle2, angle5, ...additional angles]
  videoUrl?: string;
}

const CDN = 'https://cdn.shopify.com/s/files/1/0012/8660/2848/files';

// Default product images (used for all TC-VEG-009 combos currently)
const defaultImages = [
  `${CDN}/Vegan_9pc_001.jpg?v=1727797701`,
  `${CDN}/Dalmore9pcTruffleboxVosges_V03.webp`,
  `${CDN}/Dalmore9pcTruffleopenboxVosges_V01.webp`,
  `${CDN}/Exotic_9pc_001.jpg`,
];

// Image labels corresponding to each index
export const imageLabels = [
  'Open Box — Top View',
  'Closed Box — Ribbon Detail',
  'Open Box — Angled View',
  'Truffles — Close Up',
];

/**
 * 6 Priority combos seeded in Airtable (all Status=Ready).
 * Currently all share the same base product photos.
 * When per-combo renders are generated, each will get unique URLs.
 */
export const comboAssets: Record<string, ComboAsset> = {
  'pure-black_gold_vosges-purple': {
    comboKey: 'pure-black_gold_vosges-purple',
    status: 'ready',
    images: [...defaultImages],
  },
  'pure-black_gold_black': {
    comboKey: 'pure-black_gold_black',
    status: 'ready',
    images: [...defaultImages],
  },
  'navy-blue_gold_vosges-purple': {
    comboKey: 'navy-blue_gold_vosges-purple',
    status: 'ready',
    images: [...defaultImages],
  },
  'charcoal-grey_silver_white': {
    comboKey: 'charcoal-grey_silver_white',
    status: 'ready',
    images: [...defaultImages],
  },
  'pure-white_gold_vosges-purple': {
    comboKey: 'pure-white_gold_vosges-purple',
    status: 'ready',
    images: [...defaultImages],
  },
  'forest-green_gold_black': {
    comboKey: 'forest-green_gold_black',
    status: 'ready',
    images: [...defaultImages],
  },
};

/**
 * Build a combo key from color option names (matching Airtable format).
 */
export function buildComboKey(boxColor: string, foilColor: string, ribbonColor: string): string {
  const norm = (s: string) => s.toLowerCase().replace(/ /g, '-');
  return `${norm(boxColor)}_${norm(foilColor)}_${norm(ribbonColor)}`;
}

/**
 * Look up assets for a given combo. Returns the combo asset if found,
 * or a fallback with default images and 'queued' status.
 */
export function getComboAsset(boxColor: string, foilColor: string, ribbonColor: string): ComboAsset {
  const key = buildComboKey(boxColor, foilColor, ribbonColor);
  return comboAssets[key] || {
    comboKey: key,
    status: 'queued' as const,
    images: [...defaultImages],
  };
}
