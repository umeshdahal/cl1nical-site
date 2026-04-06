import { useState } from 'react';
import { Copy, Check, ArrowDownUp } from 'lucide-react';

type ToolType = 'json' | 'base64' | 'url' | 'case';

interface TextToolsProps {
  darkMode: boolean;
}

export default function TextTools({ darkMode }: TextToolsProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [tool, setTool] = useState<ToolType>('json');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const processInput = () => {
    setError(''); setOutput(''); setCopied(false);
    try {
      switch (tool) {
        case 'json':
          try {
            setOutput(JSON.stringify(JSON.parse(input), null, 2));
          } catch {
            setOutput(JSON.stringify(JSON.parse(input)));
          }
          break;
        case 'base64': setOutput(btoa(input)); break;
        case 'url': setOutput(encodeURIComponent(input)); break;
        case 'case': setOutput(input.toUpperCase()); break;
      }
    } catch (err: any) {
      setError(`Error: ${err.message || 'Invalid input'}`);
    }
  };

  const swapDirection = () => {
    setError('');
    if (tool === 'base64') { setInput(output); setOutput(input); }
    else if (tool === 'url') {
      try { setInput(output); setOutput(decodeURIComponent(output || input)); }
      catch { setError('Invalid URL encoded string'); }
    }
    else if (tool === 'case') { setInput(output.toLowerCase()); setOutput(input.toLowerCase()); }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tools = [
    { id: 'json' as ToolType, label: 'JSON', desc: 'Format / minify JSON' },
    { id: 'base64' as ToolType, label: 'Base64', desc: 'Encode / decode' },
    { id: 'url' as ToolType, label: 'URL', desc: 'Encode / decode URLs' },
    { id: 'case' as ToolType, label: 'Case', desc: 'Change text case' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-6">
        {tools.map(t => (
          <button key={t.id} onClick={() => { setTool(t.id); setError(''); }}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              tool === t.id
                ? darkMode ? 'bg-white/[0.12] text-white font-medium' : 'bg-indigo-100 text-indigo-700 font-medium'
                : darkMode ? 'bg-white/[0.04] text-white/50 hover:text-white/70' : 'bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}>
            {t.label}
            <span className="block text-[10px] opacity-70">{t.desc}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={`text-sm font-medium ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>Input</label>
            <button onClick={() => { setInput(''); setOutput(''); setError(''); }}
              className={`text-xs ${darkMode ? 'text-white/30 hover:text-white/50' : 'text-gray-400 hover:text-gray-600'}`}>Clear</button>
          </div>
          <textarea value={input} onChange={e => { setInput(e.target.value); setError(''); }}
            placeholder="Enter your text here..."
            className={`w-full h-48 p-4 border rounded-xl text-sm font-mono outline-none resize-none ${
              darkMode 
                ? 'bg-white/[0.04] border-white/[0.08] focus:border-white/[0.2] text-white placeholder:text-white/30'
                : 'bg-gray-50 border-gray-200 focus:border-indigo-300 text-gray-900 placeholder:text-gray-400'
            }`} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={`text-sm font-medium ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>Output</label>
            <div className="flex gap-2">
              {['base64', 'url'].includes(tool) && output && (
                <button onClick={swapDirection} className={`p-1.5 ${darkMode ? 'text-white/30 hover:text-white/50' : 'text-gray-400 hover:text-gray-600'}`}><ArrowDownUp size={14} /></button>
              )}
              <button onClick={copyToClipboard} disabled={!output}
                className={`p-1.5 disabled:opacity-50 ${darkMode ? 'text-white/30 hover:text-white/50' : 'text-gray-400 hover:text-gray-600'}`}>
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
          <div className={`w-full h-48 p-4 rounded-xl text-sm font-mono resize-none overflow-auto ${
            output
              ? darkMode ? 'bg-white/[0.04] border border-white/[0.08] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              : darkMode ? 'bg-white/[0.02] border border-white/[0.04] text-white/30' : 'bg-gray-50 border-gray-200 text-gray-400'
          }`}>
            {output || 'Output will appear here...'}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm mb-4">{error}</div>
      )}

      <button onClick={processInput} disabled={!input.trim()}
        className={`w-full py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm border ${
          darkMode 
            ? 'bg-white/[0.08] hover:bg-white/[0.12] text-white border-white/[0.06]'
            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-100'
        }`}>
        Process
      </button>
    </div>
  );
}
