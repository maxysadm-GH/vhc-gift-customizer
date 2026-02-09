import { useReducer } from 'react';
import { defaultState, customizerReducer } from '../data/customization';

export function useCustomizer() {
  const [state, dispatch] = useReducer(customizerReducer, defaultState);
  return { state, dispatch };
}
