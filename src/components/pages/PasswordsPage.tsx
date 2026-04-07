import { useState, useEffect } from 'react';
import { Copy, RefreshCw, ArrowLeft, Shield, Check } from 'lucide-react';

export default function PasswordsPage() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let chars = lowercase;
    if (includeUppercase) chars += uppercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;
    
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
    setCopied(false);
  };

  useEffect(() => {
    generatePassword();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = () => {
    let score = 0;
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (includeUppercase) score++;
    if (includeNumbers) score++;
    if (includeSymbols) score++;
    if (score <= 2) return { label: 'Weak', color: '#E8572A' };
    if (score <= 4) return { label: 'Medium', color: '#E8A020' };
    return { label: 'Strong', color: '#22C55E' };
  };

  const strength = getStrength();

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#F5F0E8',
      fontFamily: "'DM Mono', monospace", padding: '2rem',
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <a href="/" style={{
            color: '#F5F0E8', textDecoration: 'none', display: 'flex',
            alignItems: 'center', gap: '0.5rem', fontSize: '14px',
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            <ArrowLeft size={16} /> Back
          </a>
        </div>

        <h1 style={{
          fontFamily: "'Clash Display', sans-serif", fontSize: '4rem',
          fontWeight: 600, letterSpacing: '-0.03em', marginBottom: '0.5rem',
        }}>
          PASSWORDS
        </h1>
        
        <p style={{ fontSize: '14px', color: 'rgba(245, 240, 232, 0.5)', marginBottom: '2rem' }}>
          Generate secure passwords
        </p>

        {/* Password Display */}
        <div style={{
          padding: '1.5rem', backgroundColor: 'rgba(245, 240, 232, 0.05)',
          borderRadius: '12px', border: '1px solid rgba(245, 240, 232, 0.1)',
          marginBottom: '1.5rem',
        }}>
          <div style={{
            fontSize: '1.25rem', fontFamily: "'DM Mono', monospace",
            wordBreak: 'break-all', marginBottom: '1rem', letterSpacing: '0.05em',
          }}>
            {password}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={14} style={{ color: strength.color }} />
              <span style={{ fontSize: '12px', color: strength.color }}>{strength.label}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={copyToClipboard} style={{
                padding: '8px 12px', backgroundColor: copied ? '#22C55E' : 'rgba(245, 240, 232, 0.1)',
                border: 'none', borderRadius: '6px', color: '#F5F0E8', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                fontFamily: "'DM Mono', monospace", fontSize: '12px',
              }}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button onClick={generatePassword} style={{
                padding: '8px 12px', backgroundColor: '#E8A020', border: 'none',
                borderRadius: '6px', color: '#0a0a0a', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                fontFamily: "'DM Mono', monospace", fontSize: '12px', fontWeight: 500,
              }}>
                <RefreshCw size={14} /> Generate
              </button>
            </div>
          </div>
        </div>

        {/* Options */}
        <div style={{
          padding: '1.5rem', backgroundColor: 'rgba(245, 240, 232, 0.03)',
          borderRadius: '12px', border: '1px solid rgba(245, 240, 232, 0.05)',
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '12px', color: 'rgba(245, 240, 232, 0.5)', display: 'block', marginBottom: '0.5rem' }}>
              Length: {length}
            </label>
            <input
              type="range" min="8" max="64" value={length}
              onChange={e => { setLength(Number(e.target.value)); generatePassword(); }}
              style={{ width: '100%', accentColor: '#E8A020' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Uppercase (A-Z)', checked: includeUppercase, set: setIncludeUppercase },
              { label: 'Numbers (0-9)', checked: includeNumbers, set: setIncludeNumbers },
              { label: 'Symbols (!@#)', checked: includeSymbols, set: setIncludeSymbols },
            ].map(opt => (
              <label key={opt.label} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                cursor: 'pointer', fontSize: '14px',
              }}>
                <input
                  type="checkbox" checked={opt.checked}
                  onChange={e => { opt.set(e.target.checked); setTimeout(generatePassword, 0); }}
                  style={{ accentColor: '#E8A020', width: '16px', height: '16px' }}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
