import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

export default function AuthUI() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = '/'; // Redirect home on success
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { data: { role: 'user' } }
        });
        if (error) throw error;
        setMessage('Registration successful! Check your email for a link.');
      }
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
    >
      <h2 className="text-3xl font-black mb-6 text-center tracking-tighter italic">
        {isLogin ? 'SYSTEM_ACCESS' : 'CREATE_IDENT'}
      </h2>

      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-widest ml-1">Email</label>
          <input 
            required
            type="email" 
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 outline-none transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-widest ml-1">Password</label>
          <input 
            required
            type="password" 
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 outline-none transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {message && <p className="text-xs text-purple-400 text-center font-mono">{message}</p>}

        <button 
          disabled={loading}
          className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-purple-500 hover:text-white transition-all disabled:opacity-50"
        >
          {loading ? 'PROCESSING...' : isLogin ? 'LOGIN' : 'REGISTER'}
        </button>
      </form>

      <button 
        onClick={() => setIsLogin(!isLogin)}
        className="w-full mt-6 text-[10px] text-gray-500 hover:text-white transition-colors uppercase tracking-[0.2em]"
      >
        {isLogin ? "Need Access? Register" : "Have Access? Login"}
      </button>
    </motion.div>
  );
}
