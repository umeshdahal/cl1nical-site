import { useState } from 'react';
import { Copy, Check, ArrowDownUp } from 'lucide-react';

type ToolType = 'json' | 'base64' | 'url' | 'case';

export default function TextTools() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [tool, setTool] = useState<ToolType>('json');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const processInput = () => {
    setError('');
    setOutput('');
    setCopied(false);

    try {
      switch (tool) {
        case 'json':
          try {
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed, null, 2));
          } catch {
            // Try to minify
            const minified = JSON.stringify(JSON.parse(input));
            setOutput(minified);
          }
          break;

        case 'base64':
          setOutput(btoa(input));
          break;

        case 'url':
          setOutput(encodeURIComponent(input));
          break;

        case 'case':
          setOutput(input.toUpperCase());
          break;
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Invalid input'}`);
    }
  };

  const swapDirection = () => {
    setError('');
    switch (tool) {
      case 'base64':
        setInput(output);
        setOutput(input);
        break;
      case 'url':
        try {
          setInput(output);
          setOutput(decodeURIComponent(output || input));
        } catch {
          setError('Invalid URL encoded string');
        }
        break;
      case 'case':
        setInput(output.toLowerCase());
        setOutput(input.toLowerCase());
        break;
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const tools: { id: ToolType; label: string; description: string }[] = [
    { id: 'json', label: 'JSON', description: 'Format or minify JSON' },
    { id: 'base64', label: 'Base64', description: 'Encode/decode Base64' },
    { id: 'url', label: 'URL', description: 'Encode/decode URLs' },
    { id: 'case', label: 'Case', description: 'Change text case' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tool Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tools.map(t => (
          <button
            key={t.id}
            onClick={() => { setTool(t.id); setError(''); }}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              tool === t.id
                ? 'bg-black dark:bg-white text-white dark:text-black font-medium'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {t.label}
            <span className="block text-[10px] opacity-70">{t.description}</span>
          </button>
        ))}
      </div>

      {/* Input/Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Input</label>
            <button
              onClick={clearAll}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={e => { setInput(e.target.value); setError(''); }}
            placeholder="Enter your text here..."
            className="w-full h-48 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-mono outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-gray-900 dark:text-white resize-none"
          />
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Output</label>
            <div className="flex gap-2">
              {['base64', 'url'].includes(tool) && output && (
                <button
                  onClick={swapDirection}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                >
                  <ArrowDownUp size={14} />
                </button>
              )}
              <button
                onClick={copyToClipboard}
                disabled={!output}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition disabled:opacity-50"
              >
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
          <div className={`w-full h-48 p-4 rounded-xl text-sm font-mono resize-none ${
            output 
              ? 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white' 
              : 'bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600'
          } overflow-auto`}>
            {output || 'Output will appear here...'}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm mb-4">
          {error}
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={processInput}
        disabled={!input.trim()}
        className="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
      >
        Process
      </button>
    </div>
  );
}