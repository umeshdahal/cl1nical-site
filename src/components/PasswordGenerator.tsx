import { useState } from 'react';
import { Copy, RefreshCw, Check, Shield } from 'lucide-react';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [generated, setGenerated] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let chars = '';
    if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (!chars) return;
    
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGenerated(password);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (!generated) return;
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = () => {
    let score = 0;
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (uppercase) score++;
    if (lowercase) score++;
    if (numbers) score++;
    if (symbols) score++;
    
    if (score <= 2) return { label: 'Weak', color: 'text-red-500', bg: 'bg-red-500' };
    if (score <= 4) return { label: 'Medium', color: 'text-yellow-500', bg: 'bg-yellow-500' };
    return { label: 'Strong', color: 'text-green-500', bg: 'bg-green-500' };
  };

  const strength = getStrength();

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        {/* Password Display */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Generated Password</span>
            {generated && (
              <span className={`text-xs font-medium ${strength.color}`}>
                {strength.label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-mono text-lg text-gray-900 dark:text-white break-all min-h-[56px]">
              {generated || 'Click generate to create a password'}
            </div>
            <button
              onClick={copyToClipboard}
              disabled={!generated}
              className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition disabled:opacity-50"
            >
              {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
            </button>
          </div>
          {/* Strength Bar */}
          {generated && (
            <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className={`h-full ${strength.bg} transition-all`} style={{ 
                width: strength.label === 'Weak' ? '33%' : strength.label === 'Medium' ? '66%' : '100%' 
              }} />
            </div>
          )}
        </div>

        {/* Length Slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">Length</label>
            <span className="text-sm font-mono text-gray-900 dark:text-white">{length}</span>
          </div>
          <input
            type="range"
            min="8"
            max="64"
            value={length}
            onChange={e => setLength(Number(e.target.value))}
            className="w-full accent-black dark:accent-white"
          />
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: 'Uppercase (A-Z)', checked: uppercase, onChange: () => setUppercase(!uppercase) },
            { label: 'Lowercase (a-z)', checked: lowercase, onChange: () => setLowercase(!lowercase) },
            { label: 'Numbers (0-9)', checked: numbers, onChange: () => setNumbers(!numbers) },
            { label: 'Symbols (!@#)', checked: symbols, onChange: () => setSymbols(!symbols) },
          ].map(opt => (
            <label
              key={opt.label}
              className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <input
                type="checkbox"
                checked={opt.checked}
                onChange={opt.onChange}
                className="w-4 h-4 accent-black dark:accent-white"
              />
              <span className="text-xs text-gray-700 dark:text-gray-300">{opt.label}</span>
            </label>
          ))}
        </div>

        {/* Generate Button */}
        <button
          onClick={generatePassword}
          className="w-full py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition flex items-center justify-center gap-2 font-medium text-sm"
        >
          <Shield size={16} /> Generate Password
        </button>
      </div>
    </div>
  );
}