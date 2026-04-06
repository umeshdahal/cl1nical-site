import { useState } from 'react';
import { AlertCircle, Check, X } from 'lucide-react';

interface RegexTesterProps {
  darkMode: boolean;
}

export default function RegexTester({ darkMode }: RegexTesterProps) {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [error, setError] = useState('');
  const [matches, setMatches] = useState<RegExpMatchArray | null>(null);

  const testRegex = () => {
    setError('');
    setMatches(null);
    try {
      const regex = new RegExp(pattern, flags);
      const result = testString.match(regex);
      setMatches(result);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const flagOptions = [
    { value: 'g', label: 'Global', desc: 'Find all matches' },
    { value: 'i', label: 'Case Insensitive', desc: 'Ignore case' },
    { value: 'm', label: 'Multiline', desc: '^ and $ match line boundaries' },
    { value: 's', label: 'Dot All', desc: '. matches newlines' },
    { value: 'u', label: 'Unicode', desc: 'Unicode support' },
  ];

  const toggleFlag = (flag: string) => {
    setFlags(prev => prev.includes(flag) ? prev.replace(flag, '') : prev + flag);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className={`p-4 rounded-xl border ${darkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-gray-50 border-gray-200'}`}>
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
          Regular Expression Pattern
        </label>
        <div className="flex gap-2">
          <span className={`px-3 py-2 border rounded-l-lg text-sm ${darkMode ? 'bg-white/[0.04] border-white/[0.08] text-white/40' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
            /
          </span>
          <input
            type="text"
            value={pattern}
            onChange={e => { setPattern(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && testRegex()}
            placeholder="[a-z]+"
            className={`flex-1 px-3 py-2 border text-sm font-mono outline-none ${
              darkMode
                ? 'bg-white/[0.04] border-white/[0.08] focus:border-white/[0.2] text-white placeholder:text-white/30'
                : 'bg-white border-gray-200 focus:border-indigo-300 text-gray-900 placeholder:text-gray-400'
            }`}
          />
          <span className={`px-3 py-2 border-r border-t border-b text-sm ${darkMode ? 'bg-white/[0.04] border-white/[0.08] text-white/40' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
            /
          </span>
          <input
            type="text"
            value={flags}
            onChange={e => setFlags(e.target.value)}
            placeholder="g"
            className={`w-20 px-3 py-2 border rounded-r-lg text-sm font-mono outline-none ${
              darkMode
                ? 'bg-white/[0.04] border-white/[0.08] focus:border-white/[0.2] text-white placeholder:text-white/30'
                : 'bg-white border-gray-200 focus:border-indigo-300 text-gray-900 placeholder:text-gray-400'
            }`}
          />
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {flagOptions.map(flag => (
            <button
              key={flag.value}
              onClick={() => toggleFlag(flag.value)}
              className={`px-2 py-1 rounded text-xs transition-all ${
                flags.includes(flag.value)
                  ? darkMode ? 'bg-white/[0.12] text-white' : 'bg-indigo-100 text-indigo-700'
                  : darkMode ? 'bg-white/[0.04] text-white/40' : 'bg-gray-100 text-gray-500'
              }`}
              title={flag.desc}
            >
              {flag.value}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
          Test String
        </label>
        <textarea
          value={testString}
          onChange={e => { setTestString(e.target.value); setError(''); }}
          placeholder="Enter text to test against the pattern..."
          className={`w-full h-32 p-4 border rounded-xl text-sm font-mono outline-none resize-none ${
            darkMode
              ? 'bg-white/[0.04] border-white/[0.08] focus:border-white/[0.2] text-white placeholder:text-white/30'
              : 'bg-gray-50 border-gray-200 focus:border-indigo-300 text-gray-900 placeholder:text-gray-400'
          }`}
        />
      </div>

      <button
        onClick={testRegex}
        disabled={!pattern || !testString}
        className={`w-full py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm ${
          darkMode
            ? 'bg-white/[0.08] hover:bg-white/[0.12] text-white'
            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
        }`}
      >
        Test Pattern
      </button>

      {error && (
        <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
          darkMode ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {matches !== null && (
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm font-medium ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
              Results
            </span>
            <span className={`text-xs px-2 py-1 rounded ${
              matches.length > 0
                ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                : darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
            }`}>
              {matches.length > 0 ? (
                <><Check size={12} className="inline mr-1" /> {matches.length} match{matches.length > 1 ? 'es' : ''}</>
              ) : (
                <><X size={12} className="inline mr-1" /> No matches</>
              )}
            </span>
          </div>
          {matches.length > 0 && (
            <div className="space-y-2">
              {matches.map((match, i) => (
                <div key={i} className={`p-2 rounded font-mono text-sm ${
                  darkMode ? 'bg-white/[0.04] text-white' : 'bg-white text-gray-900'
                }`}>
                  <span className={darkMode ? 'text-white/40' : 'text-gray-400'}>Match {i + 1}:</span> {match}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
