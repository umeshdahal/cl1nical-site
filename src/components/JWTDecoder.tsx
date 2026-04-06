import { useState } from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';

interface JWTDecoderProps {
  darkMode: boolean;
}

export default function JWTDecoder({ darkMode }: JWTDecoderProps) {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState<{ header: any; payload: any; signature: string } | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const decodeJWT = () => {
    setError('');
    setDecoded(null);
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        setError('Invalid JWT format. Expected 3 parts separated by dots.');
        return;
      }

      const decodeBase64Url = (str: string) => {
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        const pad = str.length % 4;
        if (pad) {
          str += '='.repeat(4 - pad);
        }
        return JSON.parse(atob(str));
      };

      setDecoded({
        header: decodeBase64Url(parts[0]),
        payload: decodeBase64Url(parts[1]),
        signature: parts[2],
      });
    } catch (err: any) {
      setError(`Decode error: ${err.message}`);
    }
  };

  const copyPayload = () => {
    if (decoded?.payload) {
      navigator.clipboard.writeText(JSON.stringify(decoded.payload, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isExpired = () => {
    if (!decoded?.payload?.exp) return false;
    return decoded.payload.exp * 1000 < Date.now();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div>
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
          JWT Token
        </label>
        <textarea
          value={token}
          onChange={e => { setToken(e.target.value); setError(''); }}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          className={`w-full h-32 p-4 border rounded-xl text-sm font-mono outline-none resize-none ${
            darkMode
              ? 'bg-white/[0.04] border-white/[0.08] focus:border-white/[0.2] text-white placeholder:text-white/30'
              : 'bg-gray-50 border-gray-200 focus:border-indigo-300 text-gray-900 placeholder:text-gray-400'
          }`}
        />
      </div>

      <button
        onClick={decodeJWT}
        disabled={!token.trim()}
        className={`w-full py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm ${
          darkMode
            ? 'bg-white/[0.08] hover:bg-white/[0.12] text-white'
            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
        }`}
      >
        Decode Token
      </button>

      {error && (
        <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
          darkMode ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {decoded && (
        <div className="space-y-4">
          {decoded.payload?.exp && (
            <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
              isExpired()
                ? darkMode ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-red-50 border border-red-200 text-red-600'
                : darkMode ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-green-50 border border-green-200 text-green-600'
            }`}>
              {isExpired() ? 'Token is expired' : 'Token is valid'}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border ${darkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-gray-50 border-gray-200'}`}>
              <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                Header
              </h3>
              <pre className={`text-xs font-mono overflow-auto ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </div>

            <div className={`p-4 rounded-xl border ${darkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-sm font-medium ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                  Payload
                </h3>
                <button
                  onClick={copyPayload}
                  className={`p-1.5 rounded transition-all ${
                    darkMode ? 'hover:bg-white/[0.1] text-white/60' : 'hover:bg-gray-200 text-gray-500'
                  }`}
                >
                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
              </div>
              <pre className={`text-xs font-mono overflow-auto ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${darkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
              Signature
            </h3>
            <pre className={`text-xs font-mono break-all ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
              {decoded.signature}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
