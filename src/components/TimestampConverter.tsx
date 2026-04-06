import { useState, useEffect } from 'react';
import { Copy, Check, Clock } from 'lucide-react';

interface TimestampConverterProps {
  darkMode: boolean;
}

export default function TimestampConverter({ darkMode }: TimestampConverterProps) {
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());
  const [inputTimestamp, setInputTimestamp] = useState('');
  const [convertedDate, setConvertedDate] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTimestamp(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const convertTimestamp = () => {
    if (!inputTimestamp) return;
    const ts = parseInt(inputTimestamp);
    if (isNaN(ts)) {
      setConvertedDate('Invalid timestamp');
      return;
    }
    const date = new Date(ts > 1e12 ? ts : ts * 1000);
    setConvertedDate(date.toString());
  };

  const copyTimestamp = () => {
    navigator.clipboard.writeText(currentTimestamp.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const now = new Date();
  const formats = [
    { label: 'ISO 8601', value: now.toISOString() },
    { label: 'UTC', value: now.toUTCString() },
    { label: 'Local', value: now.toLocaleString() },
    { label: 'Unix (seconds)', value: Math.floor(now.getTime() / 1000).toString() },
    { label: 'Unix (milliseconds)', value: now.getTime().toString() },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className={`p-6 rounded-xl border ${darkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={20} className={darkMode ? 'text-white/60' : 'text-gray-600'} />
            <span className={`text-sm font-medium ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
              Current Timestamp
            </span>
          </div>
          <button
            onClick={copyTimestamp}
            className={`p-2 rounded-lg transition-all ${
              darkMode ? 'hover:bg-white/[0.1] text-white/60' : 'hover:bg-gray-200 text-gray-500'
            }`}
          >
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
          </button>
        </div>
        <div className={`text-3xl font-mono font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {currentTimestamp}
        </div>
        <div className={`text-sm mt-2 ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
          milliseconds since Unix epoch
        </div>
      </div>

      <div className={`p-6 rounded-xl border ${darkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-gray-50 border-gray-200'}`}>
        <h3 className={`text-sm font-medium mb-4 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
          Current Date Formats
        </h3>
        <div className="space-y-3">
          {formats.map(format => (
            <div key={format.label} className="flex items-center justify-between">
              <span className={`text-xs font-medium ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
                {format.label}
              </span>
              <span className={`text-sm font-mono ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {format.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={`p-6 rounded-xl border ${darkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-gray-50 border-gray-200'}`}>
        <h3 className={`text-sm font-medium mb-4 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
          Convert Timestamp to Date
        </h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={inputTimestamp}
            onChange={e => setInputTimestamp(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && convertTimestamp()}
            placeholder="Enter Unix timestamp..."
            className={`flex-1 px-3 py-2 border rounded-lg text-sm font-mono outline-none ${
              darkMode
                ? 'bg-white/[0.04] border-white/[0.08] focus:border-white/[0.2] text-white placeholder:text-white/30'
                : 'bg-white border-gray-200 focus:border-indigo-300 text-gray-900 placeholder:text-gray-400'
            }`}
          />
          <button
            onClick={convertTimestamp}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              darkMode
                ? 'bg-white/[0.08] hover:bg-white/[0.12] text-white'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
            }`}
          >
            Convert
          </button>
        </div>
        {convertedDate && (
          <div className={`p-3 rounded-lg font-mono text-sm ${
            darkMode ? 'bg-white/[0.04] text-white' : 'bg-white text-gray-900'
          }`}>
            {convertedDate}
          </div>
        )}
      </div>
    </div>
  );
}
