const API_BASE = import.meta.env.VITE_API_BASE || '';

export interface PreviewResponse {
  success: boolean;
  preview_images?: string[];
  preview_id?: string;
  session_id?: string;
  company_name?: string;
  product?: { sku: string; name: string; combo: string };
  customization?: Record<string, string>;
  message?: string;
  available_combos?: string[];
}

export interface UploadLogoResponse {
  session_id: string;
  logo_url: string;
  company_name: string;
  email: string;
}

export interface AssetsResponse {
  combos: Record<string, {
    comboKey: string;
    status: 'ready' | 'queued';
    images: string[];
    videoUrl?: string;
  }>;
  fallback: { images: string[] };
}

export async function uploadLogo(file: File, companyName: string, email: string): Promise<UploadLogoResponse> {
  const formData = new FormData();
  formData.append('logo', file);
  formData.append('company_name', companyName);
  formData.append('email', email);

  const res = await fetch(`${API_BASE}/api/upload-logo`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error(`Upload error: ${res.status}`);
  return res.json();
}

export async function fetchAssets(): Promise<AssetsResponse> {
  const res = await fetch(`${API_BASE}/api/assets`);
  if (!res.ok) throw new Error(`Assets error: ${res.status}`);
  return res.json();
}

export async function generatePreview(data: {
  logo_url: string;
  company_name: string;
  box_color: string;
  foil_color: string;
  ribbon_color: string;
  email: string;
  quantity: number;
  level: string;
  font: string;
  marquee_style: string;
  hang_tag_style: string;
  message: string;
}): Promise<PreviewResponse> {
  const res = await fetch(`${API_BASE}/webhook/customize-preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(`Preview error: ${res.status}`);
  return res.json();
}

// Log order initiation to backend (Airtable + optional n8n trigger)
export async function logOrderToBackend(data: {
  company_name: string;
  email: string;
  quantity: number;
  level: string;
  box_color: string;
  foil_color: string;
  ribbon_color: string;
  font: string;
  marquee_style: string;
  hang_tag_style: string;
  message: string;
  logo_url: string;
  session_id: string;
  shopify_cart_id: string;
  checkout_url: string;
}): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/log-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch {
    // Non-fatal — don't block checkout if logging fails
    console.warn('Order logging failed (non-fatal)');
  }
}

// Shopify Storefront API — create a cart with customization attributes and return checkoutUrl
const SHOPIFY_STORE = 'vosgeschocolate.myshopify.com';
const SHOPIFY_STOREFRONT_TOKEN = 'f2cc478bb581be72c2a5f9ac1ecd0cc9';
// Product variant GID for 9-Piece Vegan Truffle Collection (TC-VEG-009, variant 32462280720480)
const VEGAN_9PC_VARIANT_GID = 'gid://shopify/ProductVariant/32462280720480';

export interface ShopifyCheckoutResult {
  checkoutUrl: string;
  cartId: string;
}

export async function createShopifyCheckout(customization: {
  company_name: string;
  email: string;
  quantity: number;
  level: string;
  box_color: string;
  foil_color: string;
  ribbon_color: string;
  font: string;
  marquee_style: string;
  hang_tag_style: string;
  message: string;
  logo_url: string;
  session_id: string;
}): Promise<ShopifyCheckoutResult> {
  const attributes = [
    { key: 'Company Name', value: customization.company_name },
    { key: 'Contact Email', value: customization.email },
    { key: 'Customization Level', value: customization.level === 'signature' ? 'Signature (1,000+ units)' : 'Duet (50+ units)' },
    { key: 'Box Color', value: customization.box_color },
    { key: 'Foil Color', value: customization.foil_color },
    { key: 'Ribbon Color', value: customization.ribbon_color },
    { key: 'Font', value: customization.font },
    { key: 'Marquee Card Style', value: customization.marquee_style },
    { key: 'Hang Tag Style', value: customization.hang_tag_style },
    ...(customization.message ? [{ key: 'Custom Message', value: customization.message }] : []),
    ...(customization.logo_url ? [{ key: 'Logo URL', value: customization.logo_url }] : []),
    { key: 'Session ID', value: customization.session_id || `sess_${Date.now()}` },
  ];

  const mutation = `
    mutation CreateCart($lines: [CartLineInput!]!, $attrs: [AttributeInput!]!) {
      cartCreate(input: {
        lines: $lines
        attributes: $attrs
        buyerIdentity: { email: "${customization.email}" }
      }) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const res = await fetch(`https://${SHOPIFY_STORE}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        lines: [{ quantity: customization.quantity, merchandiseId: VEGAN_9PC_VARIANT_GID }],
        attrs: attributes,
      },
    }),
  });

  if (!res.ok) throw new Error(`Shopify cart error: ${res.status}`);
  const data = await res.json();

  const errors = data?.data?.cartCreate?.userErrors;
  if (errors?.length > 0) throw new Error(`Cart error: ${errors[0].message}`);

  const cart = data?.data?.cartCreate?.cart;
  if (!cart) throw new Error('No cart returned from Shopify');

  return { checkoutUrl: cart.checkoutUrl, cartId: cart.id };
}
