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

export type WizardStep = 'onboarding' | 'customizer' | 'preview';

export interface CustomizerState {
  step: WizardStep;
  sessionId: string | null;
  logoUrl: string | null;
  logoUploading: boolean;
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

export type CustomizerAction =
  | { type: 'SET_STEP'; payload: WizardStep }
  | { type: 'SET_SESSION'; payload: { sessionId: string; logoUrl: string } }
  | { type: 'SET_LOGO_UPLOADING'; payload: boolean }
  | { type: 'SET_LEVEL'; payload: 'duet' | 'signature' }
  | { type: 'SET_BOX_COLOR'; payload: ColorOption }
  | { type: 'SET_FOIL_COLOR'; payload: ColorOption }
  | { type: 'SET_RIBBON_COLOR'; payload: ColorOption }
  | { type: 'SET_MARQUEE_STYLE'; payload: MarqueeStyle }
  | { type: 'SET_HANG_TAG_STYLE'; payload: HangTagStyle }
  | { type: 'SET_FONT'; payload: FontOption }
  | { type: 'SET_LOGO'; payload: { file: File; previewUrl: string } }
  | { type: 'CLEAR_LOGO' }
  | { type: 'SET_FIELD'; payload: { field: 'companyName' | 'email' | 'message'; value: string } }
  | { type: 'SET_QUANTITY'; payload: number }
  | { type: 'SET_PREVIEW'; payload: { images: string[]; message: string } }
  | { type: 'RESET' };

export const defaultState: CustomizerState = {
  step: 'onboarding',
  sessionId: null,
  logoUrl: null,
  logoUploading: false,
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

export function customizerReducer(state: CustomizerState, action: CustomizerAction): CustomizerState {
  switch (action.type) {
    case 'SET_STEP': return { ...state, step: action.payload };
    case 'SET_SESSION': return { ...state, sessionId: action.payload.sessionId, logoUrl: action.payload.logoUrl, logoUploading: false };
    case 'SET_LOGO_UPLOADING': return { ...state, logoUploading: action.payload };
    case 'SET_LEVEL': return { ...state, level: action.payload };
    case 'SET_BOX_COLOR': return { ...state, boxColor: action.payload };
    case 'SET_FOIL_COLOR': return { ...state, foilColor: action.payload };
    case 'SET_RIBBON_COLOR': return { ...state, ribbonColor: action.payload };
    case 'SET_MARQUEE_STYLE': return { ...state, marqueeStyle: action.payload };
    case 'SET_HANG_TAG_STYLE': return { ...state, hangTagStyle: action.payload };
    case 'SET_FONT': return { ...state, font: action.payload };
    case 'SET_LOGO': return { ...state, logoFile: action.payload.file, logoPreviewUrl: action.payload.previewUrl };
    case 'CLEAR_LOGO': return { ...state, logoFile: null, logoPreviewUrl: null };
    case 'SET_FIELD': return { ...state, [action.payload.field]: action.payload.value };
    case 'SET_QUANTITY': return { ...state, quantity: action.payload };
    case 'SET_PREVIEW': return { ...state, step: 'preview' };
    case 'RESET': return defaultState;
    default: return state;
  }
}
