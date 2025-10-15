'use client';

import { useLanguage } from '@/context/LanguageContext';
import type { LayerProps } from './layers/Layer';

interface LayerManagerProps {
  layers: LayerProps[];
  onAddLayer: () => void;
  onRemoveLayer: (id: string) => void;
  onToggleLayerVisibility: (id: string) => void;
  // onMoveLayer: (id: string, direction: 'up' | 'down') => void;
}

const LayerManager = ({
  layers,
  onAddLayer,
  onRemoveLayer,
  onToggleLayerVisibility,
}: LayerManagerProps) => {
  const { t } = useLanguage();

  const getLayerName = (layer: LayerProps): string => {
    switch (layer.kind) {
      case 'guide':
        return 'Guide'; // TODO: i18n
      case 'grid':
        return 'Grid'; // TODO: i18n
      case 'drawing':
        // Calculate the index among drawing layers
        const drawingLayers = layers.filter(l => l.kind === 'drawing');
        const drawingLayerIndex = drawingLayers.indexOf(layer);
        return `Layer ${drawingLayerIndex + 1}`; // TODO: i18n
      default:
        // This should not be reached if all kinds are handled
        return 'Layer';
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">{t('layerManager.title')}</h3>
      {/* Display layers in reverse order (top is front) */}
      <div className="flex flex-col-reverse gap-2">
        {layers.map((layer) => (
          <div key={layer.id} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
            <span>{getLayerName(layer)}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => onToggleLayerVisibility(layer.id)}>
                {layer.props.visible ? '👁️' : '🙈'}
              </button>
              {/* Show delete button only for drawing layers */}
              {layer.kind === 'drawing' && (
                <button onClick={() => onRemoveLayer(layer.id)}>
                  🗑️
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onAddLayer}
        className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        {t('layerManager.addLayer')}
      </button>
    </div>
  );
};

export default LayerManager;