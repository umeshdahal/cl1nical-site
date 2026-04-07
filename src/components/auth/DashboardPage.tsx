import { useState, useEffect } from 'react';
import { createClient } from '../../lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        window.location.href = '/login';
        return;
      }

      setUser(session.user);

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      setProfile(data);
      setLoading(false);
    };

    loadData();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        window.location.href = '/login';
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#F5F0E8] font-mono">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#F5F0E8]">
      <nav className="border-b border-[#222222] px-6 py-4 flex items-center justify-between">
        <a href="/" className="font-heading text-xl font-semibold">cl1nical</a>
        <div className="flex items-center gap-4">
          <a href="/profile" className="font-mono text-sm text-[#8C8882] hover:text-[#F5F0E8] transition-colors">
            Profile
          </a>
          <button onClick={handleLogout} className="font-mono text-sm text-red-400 hover:text-red-300 transition-colors">
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="font-heading text-4xl font-semibold mb-2">
          Welcome back, {profile?.display_name ?? profile?.username ?? 'User'}
        </h1>
        <p className="text-[#8C8882] font-mono text-sm mb-12">
          {user?.email}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="/tasks" className="group block p-6 bg-[#111111] border border-[#222222] rounded-2xl hover:border-[#E8A020] transition-colors">
            <div className="text-2xl mb-3">📋</div>
            <h3 className="font-heading text-lg font-semibold mb-1 group-hover:text-[#E8A020] transition-colors">Tasks</h3>
            <p className="text-[#8C8882] text-sm font-mono">Manage your todo list</p>
          </a>

          <a href="/bookmarks" className="group block p-6 bg-[#111111] border border-[#222222] rounded-2xl hover:border-[#2D5BE3] transition-colors">
            <div className="text-2xl mb-3">🔖</div>
            <h3 className="font-heading text-lg font-semibold mb-1 group-hover:text-[#2D5BE3] transition-colors">Bookmarks</h3>
            <p className="text-[#8C8882] text-sm font-mono">Save important links</p>
          </a>

          <a href="/passwords" className="group block p-6 bg-[#111111] border border-[#222222] rounded-2xl hover:border-[#22C55E] transition-colors">
            <div className="text-2xl mb-3">🔐</div>
            <h3 className="font-heading text-lg font-semibold mb-1 group-hover:text-[#22C55E] transition-colors">Passwords</h3>
            <p className="text-[#8C8882] text-sm font-mono">Generate secure passwords</p>
          </a>
        </div>
      </main>
    </div>
  );
}
