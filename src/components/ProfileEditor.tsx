import { useState } from 'react';

interface ProfileSettings {
  theme: string;
  notifications: boolean;
  compactMode: boolean;
  language: string;
}

interface ProfileEditorProps {
  email: string;
  displayName: string;
  avatarUrl: string;
  settings: Partial<ProfileSettings>;
}

export default function ProfileEditor({ email, displayName, avatarUrl, settings: initialSettings }: ProfileEditorProps) {
  const [name, setName] = useState(displayName);
  const [avatar, setAvatar] = useState(avatarUrl);
  const [settings, setSettings] = useState<ProfileSettings>({
    theme: initialSettings.theme ?? 'dark',
    notifications: initialSettings.notifications ?? true,
    compactMode: initialSettings.compactMode ?? false,
    language: initialSettings.language ?? 'en',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError('');

    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ display_name: name, avatar_url: avatar, settings }),
    });

    const result = await res.json();

    if (!res.ok) {
      setError(result.error ?? 'Failed to save');
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  return (
    <>
      <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6 mb-6">
        <h2 className="font-heading text-lg font-semibold mb-4">Account</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-mono text-[#8C8882] mb-2">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-lg text-[#8C8882] font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-mono text-[#8C8882] mb-2">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-lg text-[#F5F0E8] font-mono text-sm focus:outline-none focus:border-[#E8A020] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-mono text-[#8C8882] mb-2">Avatar URL</label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-lg text-[#F5F0E8] font-mono text-sm focus:outline-none focus:border-[#E8A020] transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6 mb-6">
        <h2 className="font-heading text-lg font-semibold mb-4">Preferences</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-mono text-[#8C8882] mb-2">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
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

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-[#E8A020] hover:bg-[#d4911a] disabled:opacity-50 text-[#0a0a0a] font-mono text-sm font-semibold rounded-lg transition-colors"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {saved && <span className="text-green-400 font-mono text-sm">✓ Saved!</span>}
      </div>
    </>
  );
}
