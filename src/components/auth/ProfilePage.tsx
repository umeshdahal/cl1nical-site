import { useState, useEffect } from 'react';
import { createClient } from '../../lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface ProfileSettings {
  theme: 'dark' | 'light' | 'auto';
  notifications: boolean;
  compactMode: boolean;
  language: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [settings, setSettings] = useState<ProfileSettings>({
    theme: 'dark',
    notifications: true,
    compactMode: false,
    language: 'en',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
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

      if (data) {
        setProfile(data);
        if (data.settings) {
          setSettings(prev => ({ ...prev, ...data.settings }));
        }
      }
      setLoading(false);
    };

    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: profile?.display_name,
        settings,
      })
      .eq('id', user!.id);

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

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
          <a href="/dashboard" className="font-mono text-sm text-[#8C8882] hover:text-[#F5F0E8] transition-colors">
            Dashboard
          </a>
          <button onClick={handleLogout} className="font-mono text-sm text-red-400 hover:text-red-300 transition-colors">
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="font-heading text-3xl font-semibold mb-8">Profile Settings</h1>

        {/* Profile Info */}
        <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6 mb-6">
          <h2 className="font-heading text-lg font-semibold mb-4">Account</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-[#8C8882] mb-2">Email</label>
              <input
                type="email"
                value={user?.email ?? ''}
                disabled
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-lg text-[#8C8882] font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-mono text-[#8C8882] mb-2">Display Name</label>
              <input
                type="text"
                value={profile?.display_name ?? ''}
                onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-lg text-[#F5F0E8] font-mono text-sm focus:outline-none focus:border-[#E8A020] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6 mb-6">
          <h2 className="font-heading text-lg font-semibold mb-4">Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-[#8C8882] mb-2">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => setSettings({ ...settings, theme: e.target.value as ProfileSettings['theme'] })}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-lg text-[#F5F0E8] font-mono text-sm focus:outline-none focus:border-[#E8A020] transition-colors"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-sm font-mono text-[#F5F0E8]">Notifications</span>
              <button
                onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                className={`w-12 h-6 rounded-full transition-colors ${settings.notifications ? 'bg-[#E8A020]' : 'bg-[#333333]'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-sm font-mono text-[#F5F0E8]">Compact Mode</span>
              <button
                onClick={() => setSettings({ ...settings, compactMode: !settings.compactMode })}
                className={`w-12 h-6 rounded-full transition-colors ${settings.compactMode ? 'bg-[#E8A020]' : 'bg-[#333333]'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.compactMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-mono text-[#8C8882] mb-2">Language</label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-lg text-[#F5F0E8] font-mono text-sm focus:outline-none focus:border-[#E8A020] transition-colors"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-[#E8A020] hover:bg-[#d4911a] disabled:opacity-50 text-[#0a0a0a] font-mono text-sm font-semibold rounded-lg transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {saved && (
            <span className="text-green-400 font-mono text-sm">✓ Saved!</span>
          )}
        </div>
      </main>
    </div>
  );
}
