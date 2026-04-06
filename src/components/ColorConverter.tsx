import { useState } from 'react';
import { Copy, Check, Palette } from 'lucide-react';

interface ColorConverterProps {
  darkMode: boolean;
}

export default function ColorConverter({ darkMode }: ColorConverterProps) {
  const [input, setInput] = useState('#6366f1');
  const [copied, setCopied] = useState('');

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
      : null;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const rgbToCmyk = (r: number, g: number, b: number) => {
    const c = 1 - r / 255;
    const m = 1 - g / 255;
    const y = 1 - b / 255;
    const k = Math.min(c, m, y);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    return {
      c: Math.round(((c - k) / (1 - k)) * 100),
      m: Math.round(((m - k) / (1 - k)) * 100),
      y: Math.round(((y - k) / (1 - k)) * 100),
      k: Math.round(k * 100),
    };
  };

  const rgb = hexToRgb(input);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
  const cmyk = rgb ? rgbToCmyk(rgb.r, rgb.g, rgb.b) : null;

  const formats = [
    { label: 'HEX', value: input.toUpperCase() },
    { label: 'RGB', value: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : 'Invalid' },
    { label: 'HSL', value: hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : 'Invalid' },
    { label: 'CMYK', value: cmyk ? `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` : 'Invalid' },
  ];

  const copyValue = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className={`p-6 rounded-xl border ${darkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-20 h-20 rounded-xl border-2 border-white/20 shadow-lg"
            style={{ backgroundColor: input }}
          />
          <div className="flex-1">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
              Enter Color (HEX)
            </label>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="#6366f1"
              className={`w-full px-3 py-2 border rounded-lg text-sm font-mono outline-none ${
                darkMode
                  ? 'bg-white/[0.04] border-white/[0.08] focus:border-white/[0.2] text-white placeholder:text-white/30'
                  : 'bg-white border-gray-200 focus:border-indigo-300 text-gray-900 placeholder:text-gray-400'
              }`}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {formats.map(format => (
          <div key={format.label} className={`p-4 rounded-xl border ${darkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <span className={`text-xs font-medium ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
                  {format.label}
                </span>
                <p className={`text-sm font-mono mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {format.value}
                </p>
              </div>
              <button
                onClick={() => copyValue(format.value, format.label)}
                className={`p-2 rounded-lg transition-all ${
                  darkMode ? 'hover:bg-white/[0.1] text-white/60' : 'hover:bg-gray-200 text-gray-500'
                }`}
              >
                {copied === format.label ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={`p-4 rounded-xl border ${darkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-center gap-2 mb-3">
          <Palette size={16} className={darkMode ? 'text-white/60' : 'text-gray-600'} />
          <span className={`text-sm font-medium ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
            Color Preview
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[0, 25, 50, 75, 100].map(opacity => (
            <div
              key={opacity}
              className="h-12 rounded-lg"
              style={{ backgroundColor: input, opacity: opacity / 100 }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          {[0, 25, 50, 75, 100].map(opacity => (
            <span key={opacity} className={`text-[10px] ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>
              {opacity}%
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
