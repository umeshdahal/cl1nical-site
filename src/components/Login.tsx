import { useState } from 'react';
import { login, register } from '../lib/auth';
import { Lock, User, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';

interface LoginProps {
  onLoginSuccess?: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    try {
      const result = isRegister ? register(username, password) : login(username, password);
      if (result.success && result.user) onLoginSuccess?.();
      else setError(result.error || 'An error occurred');
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/[0.03] rounded-2xl p-8 border border-white/[0.08] backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-white to-white/80 rounded-2xl flex items-center justify-center shadow-lg shadow-white/10">
              <span className="text-black text-2xl font-bold">cl1</span>
            </div>
            <h1 className="text-2xl font-bold text-white">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-white/40 mt-1 text-sm">
              {isRegister ? 'Sign up to get started' : 'Sign in to your dashboard'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Username</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"><User size={18} /></div>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/[0.2] outline-none transition text-white placeholder:text-white/30"
                  placeholder="Enter your username" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"><Lock size={18} /></div>
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/[0.2] outline-none transition text-white placeholder:text-white/30"
                  placeholder="Enter your password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-white/[0.1] hover:bg-white/[0.15] text-white font-medium rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 border border-white/[0.06]">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : isRegister ? (
                <><UserPlus size={18} /> Create Account</>
              ) : (
                <><LogIn size={18} /> Sign In</>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-sm text-white/40 hover:text-white/60 transition">
              {isRegister ? 'Already have an account? ' : "Don't have an account? "}
              <span className="font-medium text-white">{isRegister ? 'Sign In' : 'Sign Up'}</span>
            </button>
          </div>

          {!isRegister && (
            <div className="mt-4 p-3 bg-white/[0.04] rounded-lg text-xs text-white/40 border border-white/[0.06]">
              <p className="font-medium mb-1 text-white/60">Demo Credentials:</p>
              <p>Username: <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-white/60">admin</code> Password: <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-white/60">admin123</code></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}