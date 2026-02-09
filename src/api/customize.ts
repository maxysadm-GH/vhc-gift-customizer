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

export async function submitPreview(data: {
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
  logo?: File;
}): Promise<PreviewResponse> {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'logo' && value instanceof File) {
      formData.append('logo', value);
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  const res = await fetch(`${API_BASE}/webhook/customize-preview`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json();
}
