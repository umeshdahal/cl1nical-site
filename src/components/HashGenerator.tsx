import { useState } from 'react';
import { Copy, Check, Shield } from 'lucide-react';

interface HashGeneratorProps {
  darkMode: boolean;
}

export default function HashGenerator({ darkMode }: HashGeneratorProps) {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState('');

  const generateHashes = async () => {
    if (!input) return;
    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
    const results: Record<string, string> = {};

    for (const algo of algorithms) {
      const hashBuffer = await crypto.subtle.digest(algo, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      results[algo] = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    setHashes(results);
  };

  const copyHash = (algo: string) => {
    navigator.clipboard.writeText(hashes[algo]);
    setCopied(algo);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div>
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
          Input Text
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter text to hash..."
          className={`w-full h-24 p-4 border rounded-xl text-sm outline-none resize-none ${
            darkMode
              ? 'bg-white/[0.04] border-white/[0.08] focus:border-white/[0.2] text-white placeholder:text-white/30'
              : 'bg-gray-50 border-gray-200 focus:border-indigo-300 text-gray-900 placeholder:text-gray-400'
          }`}
        />
      </div>

      <button
        onClick={generateHashes}
        disabled={!input.trim()}
        className={`w-full py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center justify-center gap-2 ${
          darkMode
            ? 'bg-white/[0.08] hover:bg-white/[0.12] text-white'
            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
        }`}
      >
        <Shield size={16} />
        Generate Hashes
      </button>

      {Object.keys(hashes).length > 0 && (
        <div className="space-y-3">
          {Object.entries(hashes).map(([algo, hash]) => (
            <div key={algo} className={`p-4 rounded-xl border ${darkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                  {algo}
                </span>
                <button
                  onClick={() => copyHash(algo)}
                  className={`p-1.5 rounded transition-all ${
                    darkMode ? 'hover:bg-white/[0.1] text-white/60' : 'hover:bg-gray-200 text-gray-500'
                  }`}
                >
                  {copied === algo ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
              </div>
              <code className={`text-xs font-mono break-all ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {hash}
              </code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
