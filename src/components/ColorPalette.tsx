'use client';

import { useState } from 'react';

interface ColorPaletteProps {
  onColorChange: (color: string) => void;
}

// Based on the default palette from Aseprite
const defaultColors = [
  '#000000',
  '#FFFFFF',
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFFF00',
  '#00FFFF',
  '#FF00FF',
  '#F44336',
  '#E91E63',
  '#9C27B0',
  '#673AB7',
  '#3F51B5',
  '#2196F3',
  '#03A9F4',
  '#00BCD4',
  '#009688',
  '#4CAF50',
  '#8BC34A',
  '#CDDC39',
  '#FFEB3B',
  '#FFC107',
  '#FF9800',
  '#FF5722',
  '#795548',
  '#9E9E9E',
  '#607D8B',
  '#424242',
  '#212121',
  '#BDBDBD',
  '#E0E0E0',
  '#EEEEEE',
];

const ColorPalette = ({ onColorChange }: ColorPaletteProps) => {
  const [selectedColor, setSelectedColor] = useState(defaultColors[0]);

  const handleColorClick = (color: string) => {
    setSelectedColor(color);
    onColorChange(color);
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-gray-200 rounded-md max-w-xs">
      {defaultColors.map((color) => (
        <button
          type="button"
          key={color}
          onClick={() => handleColorClick(color)}
          className={`w-6 h-6 rounded-full cursor-pointer border-2 ${selectedColor === color ? 'border-blue-500 scale-110' : 'border-white'}`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};

export default ColorPalette;
