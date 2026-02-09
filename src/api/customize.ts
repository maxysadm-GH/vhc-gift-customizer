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
