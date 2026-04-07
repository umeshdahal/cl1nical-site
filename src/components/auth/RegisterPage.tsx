import { useState } from 'react';
import { createClient } from '../../lib/supabase/client';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
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
            Create account
          </h1>
          <p className="text-[#8C8882] text-sm mb-6">
            Start using cl1nical today
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-mono text-[#8C8882] mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-lg text-[#F5F0E8] font-mono text-sm focus:outline-none focus:border-[#E8A020] transition-colors"
                placeholder="johndoe"
              />
            </div>

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
                minLength={6}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-lg text-[#F5F0E8] font-mono text-sm focus:outline-none focus:border-[#E8A020] transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#E8A020] hover:bg-[#d4911a] disabled:opacity-50 text-[#0a0a0a] font-mono text-sm font-semibold rounded-lg transition-colors"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#8C8882] text-sm">
              Already have an account?
              <a href="/login" className="text-[#E8A020] hover:text-[#d4911a] ml-1">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
