import { useState, useEffect } from 'react';
import { createClient } from '../../lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Check if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        window.location.href = '/dashboard';
      }
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="font-heading text-3xl font-semibold text-[#F5F0E8] tracking-tight">
            cl1nical
          </a>
        </div>

        <div className="bg-[#111111] border border-[#222222] rounded-2xl p-8">
          <h1 className="font-heading text-2xl font-semibold text-[#F5F0E8] mb-2">
            Welcome back
          </h1>
          <p className="text-[#8C8882] text-sm mb-6">
            Sign in to your account
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-mono text-[#8C8882] mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-lg text-[#F5F0E8] font-mono text-sm focus:outline-none focus:border-[#E8A020] transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-mono text-[#8C8882] mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-lg text-[#F5F0E8] font-mono text-sm focus:outline-none focus:border-[#E8A020] transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#E8A020] hover:bg-[#d4911a] disabled:opacity-50 text-[#0a0a0a] font-mono text-sm font-semibold rounded-lg transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#8C8882] text-sm">
              Don't have an account?
              <a href="/register" className="text-[#E8A020] hover:text-[#d4911a] ml-1">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
