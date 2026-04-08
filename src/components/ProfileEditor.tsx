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

    try {
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
    } catch {
      setError('Network error while saving profile changes.');
    }

    setSaving(false);
  };

  return (
    <>
      <div className="mb-6 rounded-2xl border border-[#222222] bg-[#111111] p-6">
        <h2 className="mb-4 font-heading text-lg font-semibold">Account</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-mono text-[#8C8882]">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full rounded-lg border border-[#333333] bg-[#1a1a1a] px-4 py-3 font-mono text-sm text-[#8C8882]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-mono text-[#8C8882]">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border border-[#333333] bg-[#1a1a1a] px-4 py-3 font-mono text-sm text-[#F5F0E8] transition-colors focus:border-[#E8A020] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-mono text-[#8C8882]">Avatar URL</label>
            <input
              type="text"
              value={avatar}
              onChange={(event) => setAvatar(event.target.value)}
              className="w-full rounded-lg border border-[#333333] bg-[#1a1a1a] px-4 py-3 font-mono text-sm text-[#F5F0E8] transition-colors focus:border-[#E8A020] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-[#222222] bg-[#111111] p-6">
        <h2 className="mb-4 font-heading text-lg font-semibold">Preferences</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-mono text-[#8C8882]">Theme</label>
            <select
              value={settings.theme}
              onChange={(event) => setSettings({ ...settings, theme: event.target.value })}
              className="w-full rounded-lg border border-[#333333] bg-[#1a1a1a] px-4 py-3 font-mono text-sm text-[#F5F0E8] transition-colors focus:border-[#E8A020] focus:outline-none"
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
              className={`h-6 w-12 rounded-full transition-colors ${settings.notifications ? 'bg-[#E8A020]' : 'bg-[#333333]'}`}
            >
              <div className={`h-5 w-5 rounded-full bg-white transition-transform ${settings.notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-sm font-mono text-[#F5F0E8]">Compact Mode</span>
            <button
              onClick={() => setSettings({ ...settings, compactMode: !settings.compactMode })}
              className={`h-6 w-12 rounded-full transition-colors ${settings.compactMode ? 'bg-[#E8A020]' : 'bg-[#333333]'}`}
            >
              <div className={`h-5 w-5 rounded-full bg-white transition-transform ${settings.compactMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div>
            <label className="mb-2 block text-sm font-mono text-[#8C8882]">Language</label>
            <select
              value={settings.language}
              onChange={(event) => setSettings({ ...settings, language: event.target.value })}
              className="w-full rounded-lg border border-[#333333] bg-[#1a1a1a] px-4 py-3 font-mono text-sm text-[#F5F0E8] transition-colors focus:border-[#E8A020] focus:outline-none"
            >
              <option value="en">English</option>
              <option value="es">Espanol</option>
              <option value="fr">Francais</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-[#E8A020] px-6 py-3 font-mono text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-[#d4911a] disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {saved && <span className="font-mono text-sm text-green-400">Saved.</span>}
      </div>
    </>
  );
}
