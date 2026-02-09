export interface ColorOption {
  name: string;
  hex: string;
  needsBorder?: boolean;
}

export interface FontOption {
  name: string;
  googleFont: string;
  weight: number;
  italic?: boolean;
  category: 'Serif' | 'Sans Serif' | 'Script';
}

export const boxColors: ColorOption[] = [
  { name: 'Pure Black', hex: '#1a1a1a' },
  { name: 'Navy Blue', hex: '#1a2744' },
  { name: 'Charcoal Grey', hex: '#4a4a4a' },
  { name: 'True Blue', hex: '#2c5aa0' },
  { name: 'Light Grey', hex: '#b0b0b0' },
  { name: 'Camel Tan', hex: '#c4956a' },
  { name: 'Cream Natural', hex: '#f5e6c8' },
  { name: 'Pure White', hex: '#ffffff', needsBorder: true },
  { name: 'Forest Green', hex: '#2d5a3d' },
];

export const foilColors: ColorOption[] = [
  { name: 'Gold', hex: '#c5a059' },
  { name: 'Silver', hex: '#c0c0c0' },
  { name: 'White', hex: '#ffffff', needsBorder: true },
  { name: 'Black', hex: '#1a1a1a' },
];

export const ribbonColors: ColorOption[] = [
  { name: 'Vosges Purple', hex: '#4a2d4d' },
  { name: 'White', hex: '#ffffff', needsBorder: true },
  { name: 'Black', hex: '#1a1a1a' },
];

export const fontOptions: FontOption[] = [
  { name: 'Chronicle Display Light', googleFont: "'Playfair Display'", weight: 300, category: 'Serif' },
  { name: 'Mrs. Eaves Roman', googleFont: "'Libre Baskerville'", weight: 400, category: 'Serif' },
  { name: 'DIDOT ALL CAPS', googleFont: "'Playfair Display SC'", weight: 400, category: 'Serif' },
  { name: 'Grand Cru', googleFont: "'Cormorant Garamond'", weight: 400, category: 'Serif' },
  { name: 'Gotham Book', googleFont: "'Montserrat'", weight: 400, category: 'Sans Serif' },
  { name: 'Roboto Light', googleFont: "'Roboto'", weight: 300, category: 'Sans Serif' },
  { name: 'Chronicle Display Light Italic', googleFont: "'Playfair Display'", weight: 300, italic: true, category: 'Serif' },
  { name: 'Snell Roundhand', googleFont: "'Great Vibes'", weight: 400, category: 'Script' },
];

export const marqueeStyles = ['standard', 'marble', 'border'] as const;
export const hangTagStyles = ['square', 'octagon', 'rectangle'] as const;

export type MarqueeStyle = typeof marqueeStyles[number];
export type HangTagStyle = typeof hangTagStyles[number];

export interface CustomizerState {
  level: 'duet' | 'signature';
  boxColor: ColorOption;
  foilColor: ColorOption;
  ribbonColor: ColorOption;
  marqueeStyle: MarqueeStyle;
  hangTagStyle: HangTagStyle;
  font: FontOption;
  logoFile: File | null;
  logoPreviewUrl: string | null;
  companyName: string;
  email: string;
  quantity: number;
  message: string;
}

export const defaultState: CustomizerState = {
  level: 'duet',
  boxColor: boxColors[0],
  foilColor: foilColors[0],
  ribbonColor: ribbonColors[0],
  marqueeStyle: 'standard',
  hangTagStyle: 'square',
  font: fontOptions[0],
  logoFile: null,
  logoPreviewUrl: null,
  companyName: '',
  email: '',
  quantity: 50,
  message: '',
};
