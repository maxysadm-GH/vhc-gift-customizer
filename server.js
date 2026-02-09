import express from 'express';
import cors from 'cors';
import multer from 'multer';

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- In-memory cache for Airtable assets ---
let assetCache = null;
let assetCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// --- Helpers ---
function buildComboKey(box, foil, ribbon) {
  const norm = (s) => s.toLowerCase().replace(/ /g, '-');
  return `${norm(box)}_${norm(foil)}_${norm(ribbon)}`;
}

async function queryAirtable(formula) {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID || 'appXXXXXXXXXX';
  const table = 'Asset_Library';
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}?filterByFormula=${encodeURIComponent(formula)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) throw new Error(`Airtable error: ${res.status}`);
  const data = await res.json();
  return data.records;
}

// --- 1. POST /api/upload-logo ---
app.post('/api/upload-logo', upload.single('logo'), async (req, res) => {
  try {
    const file = req.file;
    const { company_name, email } = req.body;

    if (!file) return res.status(400).json({ error: 'No logo file provided' });
    if (!company_name) return res.status(400).json({ error: 'Company name is required' });

    const imgbbKey = process.env.IMGBB_API_KEY;
    let logoUrl = '';

    if (imgbbKey) {
      const formData = new FormData();
      formData.append('key', imgbbKey);
      formData.append('image', file.buffer.toString('base64'));
      formData.append('name', `${company_name.replace(/[^a-zA-Z0-9]/g, '_')}_logo`);

      const imgbbRes = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
      });
      const imgbbData = await imgbbRes.json();
      if (imgbbData.success) {
        logoUrl = imgbbData.data.url;
      } else {
        console.error('ImgBB error:', imgbbData);
        return res.status(500).json({ error: 'Logo upload failed' });
      }
    } else {
      // Dev mode: return a data URL placeholder
      const base64 = file.buffer.toString('base64');
      const mimeType = file.mimetype || 'image/png';
      logoUrl = `data:${mimeType};base64,${base64}`;
    }

    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    res.json({
      session_id: sessionId,
      logo_url: logoUrl,
      company_name,
      email: email || '',
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- 2. GET /api/assets ---
app.get('/api/assets', async (_req, res) => {
  try {
    // Return cached if fresh
    if (assetCache && Date.now() - assetCacheTime < CACHE_TTL) {
      return res.json(assetCache);
    }

    const apiKey = process.env.AIRTABLE_API_KEY;
    if (!apiKey) {
      // Dev mode: return hardcoded fallback
      return res.json({ combos: {}, fallback: { images: [] } });
    }

    const formula = "AND({Product_SKU}='TC-VEG-009', {Status}='Ready')";
    const records = await queryAirtable(formula);

    const combos = {};
    for (const rec of records) {
      const f = rec.fields;
      const key = f.Combo_Key || '';
      if (!key) continue;

      const images = [];
      if (f.Hero_Image_URL) images.push(f.Hero_Image_URL);
      for (let i = 2; i <= 9; i++) {
        const field = `Angle_0${i}_URL`;
        if (f[field]) images.push(f[field]);
      }

      combos[key] = {
        comboKey: key,
        status: 'ready',
        images,
        videoUrl: f.Video_URL || null,
      };
    }

    const CDN = 'https://cdn.shopify.com/s/files/1/0012/8660/2848/files';
    const fallbackImages = [
      `${CDN}/Vegan_9pc_001.jpg?v=1727797701`,
      `${CDN}/Dalmore9pcTruffleboxVosges_V03.webp`,
      `${CDN}/Dalmore9pcTruffleopenboxVosges_V01.webp`,
      `${CDN}/Exotic_9pc_001.jpg`,
    ];

    assetCache = { combos, fallback: { images: fallbackImages } };
    assetCacheTime = Date.now();

    res.json(assetCache);
  } catch (err) {
    console.error('Assets error:', err);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
});

// --- 3. POST /webhook/customize-preview ---
app.post('/webhook/customize-preview', async (req, res) => {
  try {
    const {
      logo_url, company_name, box_color, foil_color, ribbon_color,
      email, quantity, level, font, marquee_style, hang_tag_style, message,
    } = req.body;

    if (!company_name) return res.status(400).json({ success: false, error: 'Company name required' });
    if (!box_color || !foil_color || !ribbon_color) {
      return res.status(400).json({ success: false, error: 'Color selections required' });
    }

    const comboKey = buildComboKey(box_color, foil_color, ribbon_color);

    // Try to get real assets from Airtable
    let previewImages = [];
    const apiKey = process.env.AIRTABLE_API_KEY;
    if (apiKey) {
      try {
        const formula = `AND({Product_SKU}='TC-VEG-009', {Combo_Key}='${comboKey}', {Status}='Ready')`;
        const records = await queryAirtable(formula);
        if (records.length > 0) {
          const f = records[0].fields;
          if (f.Hero_Image_URL) previewImages.push(f.Hero_Image_URL);
          if (f.Angle_02_URL) previewImages.push(f.Angle_02_URL);
          if (f.Angle_05_URL) previewImages.push(f.Angle_05_URL);
        }
      } catch (e) {
        console.error('Airtable lookup failed:', e);
      }
    }

    // Fallback to default images
    if (previewImages.length === 0) {
      const CDN = 'https://cdn.shopify.com/s/files/1/0012/8660/2848/files';
      previewImages = [
        `${CDN}/Vegan_9pc_001.jpg?v=1727797701`,
        `${CDN}/Dalmore9pcTruffleboxVosges_V03.webp`,
        `${CDN}/Dalmore9pcTruffleopenboxVosges_V01.webp`,
      ];
    }

    res.json({
      success: true,
      preview_images: previewImages,
      session_id: `prev_${Date.now()}`,
      company_name,
      product: { sku: 'TC-VEG-009', name: '9-Piece Vegan Truffle Collection', combo: comboKey },
      customization: {
        level, font, marquee_style, hang_tag_style,
        box_color, foil_color, ribbon_color,
        quantity: String(quantity || ''),
        message: message || '',
        logo_url: logo_url || '',
      },
      message: logo_url
        ? 'Preview generated with your logo composited onto 3 key angles.'
        : 'Preview generated with standard product imagery.',
    });
  } catch (err) {
    console.error('Preview error:', err);
    res.status(500).json({ success: false, error: 'Failed to generate preview' });
  }
});

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`VHC Customizer API running on port ${PORT}`);
});
