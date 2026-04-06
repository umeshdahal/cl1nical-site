import { useState } from 'react';
import { Copy, Check, Shield } from 'lucide-react';

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
    if (score <= 2) return { label: 'Weak', color: 'text-red-400', bg: 'bg-red-500' };
    if (score <= 4) return { label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500' };
    return { label: 'Strong', color: 'text-green-400', bg: 'bg-green-500' };
  };

  const strength = getStrength();

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white/[0.03] rounded-xl border border-white/[0.08] p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white/60">Generated Password</span>
            {generated && <span className={`text-xs font-medium ${strength.color}`}>{strength.label}</span>}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 p-4 bg-white/[0.04] border border-white/[0.08] rounded-lg font-mono text-lg text-white break-all min-h-[56px]">
              {generated || 'Click generate to create a password'}
            </div>
            <button onClick={copyToClipboard} disabled={!generated}
              className="p-3 bg-white/[0.06] rounded-lg hover:bg-white/[0.1] transition-all disabled:opacity-50">
              {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} className="text-white/60" />}
            </button>
          </div>
          {generated && (
            <div className="mt-2 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div className={`h-full ${strength.bg} transition-all`} style={{ 
                width: strength.label === 'Weak' ? '33%' : strength.label === 'Medium' ? '66%' : '100%' 
              }} />
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-white/60">Length</label>
            <span className="text-sm font-mono text-white">{length}</span>
          </div>
          <input type="range" min="8" max="64" value={length}
            onChange={e => setLength(Number(e.target.value))}
            className="w-full accent-white" />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: 'Uppercase (A-Z)', checked: uppercase, onChange: () => setUppercase(!uppercase) },
            { label: 'Lowercase (a-z)', checked: lowercase, onChange: () => setLowercase(!lowercase) },
            { label: 'Numbers (0-9)', checked: numbers, onChange: () => setNumbers(!numbers) },
            { label: 'Symbols (!@#)', checked: symbols, onChange: () => setSymbols(!symbols) },
          ].map(opt => (
            <label key={opt.label}
              className="flex items-center gap-2 p-3 bg-white/[0.04] rounded-lg cursor-pointer hover:bg-white/[0.06] transition-all">
              <input type="checkbox" checked={opt.checked} onChange={opt.onChange} className="w-4 h-4 accent-white" />
              <span className="text-xs text-white/60">{opt.label}</span>
            </label>
          ))}
        </div>

        <button onClick={generatePassword}
          className="w-full py-2.5 bg-white/[0.08] hover:bg-white/[0.12] text-white rounded-lg transition-all flex items-center justify-center gap-2 font-medium text-sm border border-white/[0.06]">
          <Shield size={16} /> Generate Password
        </button>
      </div>
    </div>
  );
}