import { useState, useEffect, useCallback } from 'react';
import type { ComboAsset } from '../data/assetMap';
import { comboAssets, fallbackAsset } from '../data/assetMap';
import { fetchAssets } from '../api/customize';

export function useAssetMap() {
  const [assetMap, setAssetMap] = useState<Record<string, ComboAsset>>(comboAssets);

  useEffect(() => {
    fetchAssets()
      .then((data) => {
        if (data.combos && Object.keys(data.combos).length > 0) {
          setAssetMap(data.combos as Record<string, ComboAsset>);
        }
      })
      .catch(() => {
        // Silently fall back to hardcoded assetMap
      });
  }, []);

  const getCombo = useCallback(
    (key: string): ComboAsset => assetMap[key] || fallbackAsset,
    [assetMap],
  );

  return { assetMap, getCombo };
}
