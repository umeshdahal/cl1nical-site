import { useState } from 'react';
import { Copy, Check, GitCompare } from 'lucide-react';
import { diffLines } from 'diff';
import type { Change } from 'diff';

interface DiffCheckerProps {
  darkMode: boolean;
}

export default function DiffChecker({ darkMode }: DiffCheckerProps) {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diffResult, setDiffResult] = useState<Change[]>([]);
  const [copied, setCopied] = useState(false);

  const compareTexts = () => {
    const diff = diffLines(text1, text2);
    setDiffResult(diff);
  };

  const copyDiff = () => {
    const text = diffResult
      .map(part => {
        if (part.added) return `+ ${part.value}`;
        if (part.removed) return `- ${part.value}`;
        return `  ${part.value}`;
      })
      .join('');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = {
    added: diffResult.filter(p => p.added).length,
    removed: diffResult.filter(p => p.removed).length,
    unchanged: diffResult.filter(p => !p.added && !p.removed).length,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
            Original Text
          </label>
          <textarea
            value={text1}
            onChange={e => setText1(e.target.value)}
            placeholder="Paste original text here..."
            className={`w-full h-48 p-4 border rounded-xl text-sm font-mono outline-none resize-none ${
              darkMode
                ? 'bg-white/[0.04] border-white/[0.08] focus:border-white/[0.2] text-white placeholder:text-white/30'
                : 'bg-gray-50 border-gray-200 focus:border-indigo-300 text-gray-900 placeholder:text-gray-400'
            }`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
            Modified Text
          </label>
          <textarea
            value={text2}
            onChange={e => setText2(e.target.value)}
            placeholder="Paste modified text here..."
            className={`w-full h-48 p-4 border rounded-xl text-sm font-mono outline-none resize-none ${
              darkMode
                ? 'bg-white/[0.04] border-white/[0.08] focus:border-white/[0.2] text-white placeholder:text-white/30'
                : 'bg-gray-50 border-gray-200 focus:border-indigo-300 text-gray-900 placeholder:text-gray-400'
            }`}
          />
        </div>
      </div>

      <button
        onClick={compareTexts}
        disabled={!text1 || !text2}
        className={`w-full py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center justify-center gap-2 ${
          darkMode
            ? 'bg-white/[0.08] hover:bg-white/[0.12] text-white'
            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
        }`}
      >
        <GitCompare size={16} />
        Compare
      </button>

      {diffResult.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <span className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                +{stats.added} added
              </span>
              <span className={`text-xs ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                -{stats.removed} removed
              </span>
              <span className={`text-xs ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
                {stats.unchanged} unchanged
              </span>
            </div>
            <button
              onClick={copyDiff}
              className={`p-2 rounded-lg transition-all ${
                darkMode ? 'hover:bg-white/[0.1] text-white/60' : 'hover:bg-gray-200 text-gray-500'
              }`}
            >
              {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
            </button>
          </div>

          <div className={`p-4 rounded-xl border font-mono text-sm overflow-auto max-h-96 ${
            darkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-gray-50 border-gray-200'
          }`}>
            {diffResult.map((part, index) => {
              const color = part.added
                ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-800'
                : part.removed
                ? darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-800'
                : darkMode ? 'text-white/60' : 'text-gray-600';

              const prefix = part.added ? '+' : part.removed ? '-' : ' ';

              return (
                <div key={index} className={`px-2 py-0.5 ${color}`}>
                  <span className="select-none mr-2 opacity-50">{prefix}</span>
                  {part.value}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
