'use client';

import { useLanguage } from '@/context/LanguageContext';
import type { LayerProps } from './layers/Layer';

interface LayerManagerProps {
  layers: LayerProps[];
  activeLayerId: string;
  onAddLayer: () => void;
  onRemoveLayer: (id: string) => void;
  onToggleLayerVisibility: (id: string) => void;
  onSelectLayer: (id: string) => void;
}

const LayerManager = ({
  layers,
  activeLayerId,
  onAddLayer,
  onRemoveLayer,
  onToggleLayerVisibility,
  onSelectLayer,
}: LayerManagerProps) => {
  const { t } = useLanguage();

  const getLayerName = (layer: LayerProps): string => {
    switch (layer.kind) {
      case 'guide':
        return 'Guide'; // TODO: i18n
      case 'grid':
        return 'Grid'; // TODO: i18n
      case 'drawing':
        const drawingLayers = layers.filter(l => l.kind === 'drawing');
        const drawingLayerIndex = drawingLayers.indexOf(layer);
        return `Layer ${drawingLayerIndex + 1}`; // TODO: i18n
      default:
        return 'Layer';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">{t('layerManager.title')}</h3>
      <div className="flex flex-col-reverse gap-2">
        {layers.map(layer => {
          const isDrawingLayer = layer.kind === 'drawing';
          const isActive = isDrawingLayer && layer.id === activeLayerId;

          const layerClasses = [
            'flex items-center justify-between p-2 rounded-md',
            isActive ? 'bg-blue-200' : 'bg-gray-100',
            isDrawingLayer ? 'cursor-pointer' : '',
            isDrawingLayer && !isActive ? 'hover:bg-gray-200' : '',
          ].join(' ');

          return (
            <div
              key={layer.id}
              onClick={() => {
                if (isDrawingLayer) {
                  onSelectLayer(layer.id);
                }
              }}
              className={layerClasses}
            >
              <span>{getLayerName(layer)}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onToggleLayerVisibility(layer.id);
                  }}
                >
                  {layer.props.visible ? '👁️' : '🙈'}
                </button>
                {isDrawingLayer && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onRemoveLayer(layer.id);
                    }}
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          );
        })}
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
