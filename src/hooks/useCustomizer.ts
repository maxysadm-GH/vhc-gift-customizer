import { useReducer } from 'react';
import type { CustomizerState, ColorOption, FontOption, MarqueeStyle, HangTagStyle } from '../data/customization';
import { defaultState } from '../data/customization';

type Action =
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
  | { type: 'RESET' };

function reducer(state: CustomizerState, action: Action): CustomizerState {
  switch (action.type) {
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
    case 'RESET': return defaultState;
    default: return state;
  }
}

export function useCustomizer() {
  const [state, dispatch] = useReducer(reducer, defaultState);
  // Return state and dispatch, plus convenience setters
  return { state, dispatch };
}
