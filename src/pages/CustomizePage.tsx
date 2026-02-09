import { useReducer, useState } from 'react';
import { OnboardingGate } from '../components/OnboardingGate';
import { VideoCustomizer } from '../components/VideoCustomizer';
import { PreviewResults } from '../components/PreviewResults';
import { defaultState, customizerReducer } from '../data/customization';

export function CustomizePage() {
  const [state, dispatch] = useReducer(customizerReducer, defaultState);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewMessage, setPreviewMessage] = useState('');

  switch (state.step) {
    case 'onboarding':
      return <OnboardingGate state={state} dispatch={dispatch} />;
    case 'customizer':
      return (
        <VideoCustomizer
          state={state}
          dispatch={dispatch}
          previewImages={previewImages}
          setPreviewImages={setPreviewImages}
          previewMessage={previewMessage}
          setPreviewMessage={setPreviewMessage}
        />
      );
    case 'preview':
      return (
        <PreviewResults
          previewImages={previewImages}
          previewMessage={previewMessage}
          companyName={state.companyName}
          dispatch={dispatch}
        />
      );
  }
}
