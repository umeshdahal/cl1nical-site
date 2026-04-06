import { useState } from 'react';
import { Copy, Check, QrCode } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

interface QRCodeGeneratorProps {
  darkMode: boolean;
}

export default function QRCodeGenerator({ darkMode }: QRCodeGeneratorProps) {
  const [text, setText] = useState('https://cl1nical.dev');
  const [size, setSize] = useState(256);
  const [copied, setCopied] = useState(false);

  const downloadQR = () => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = url;
    link.click();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
          Text or URL
        </label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter text or URL to encode..."
          className={`w-full h-24 p-4 border rounded-xl text-sm outline-none resize-none ${
            darkMode
              ? 'bg-white/[0.04] border-white/[0.08] focus:border-white/[0.2] text-white placeholder:text-white/30'
              : 'bg-gray-50 border-gray-200 focus:border-indigo-300 text-gray-900 placeholder:text-gray-400'
          }`}
        />
      </div>

      <div className={`p-4 rounded-xl border ${darkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-sm font-medium ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
            Size: {size}px
          </span>
          <input
            type="range"
            min="128"
            max="512"
            step="32"
            value={size}
            onChange={e => setSize(Number(e.target.value))}
            className="w-32 accent-white"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-white border-gray-200'}`}>
          <QRCodeCanvas
            id="qr-canvas"
            value={text}
            size={size}
            level="H"
            includeMargin={true}
            fgColor={darkMode ? '#ffffff' : '#000000'}
            bgColor={darkMode ? '#0a0a0a' : '#ffffff'}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={downloadQR}
            className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
              darkMode
                ? 'bg-white/[0.08] hover:bg-white/[0.12] text-white'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
            }`}
          >
            <QrCode size={16} />
            Download PNG
          </button>
        </div>
      </div>
    </div>
  );
}
