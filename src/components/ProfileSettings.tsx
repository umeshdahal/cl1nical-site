import { useState, useEffect } from 'react';
import { Save, User, Palette, Bell, Shield, Globe, Check, X } from 'lucide-react';

interface ProfileSettingsProps {
  darkMode: boolean;
}

interface UserProfile {
  displayName: string;
  bio: string;
  avatar: string;
  email: string;
  location: string;
  website: string;
}

interface Preferences {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
  animations: boolean;
  notifications: boolean;
  soundEffects: boolean;
  autoSave: boolean;
  language: string;
  timezone: string;
}

export default function ProfileSettings({ darkMode }: ProfileSettingsProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'notifications' | 'privacy'>('profile');
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('app_profile');
      return stored ? JSON.parse(stored) : {
        displayName: '',
        bio: '',
        avatar: '',
        email: '',
        location: '',
        website: '',
      };
    }
    return { displayName: '', bio: '', avatar: '', email: '', location: '', website: '' };
  });

  const [preferences, setPreferences] = useState<Preferences>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('app_preferences');
      return stored ? JSON.parse(stored) : {
        theme: 'light',
        accentColor: 'indigo',
        fontSize: 'medium',
        compactMode: false,
        animations: true,
        notifications: true,
        soundEffects: true,
        autoSave: true,
        language: 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
    }
    return {
      theme: 'light',
      accentColor: 'indigo',
      fontSize: 'medium',
      compactMode: false,
      animations: true,
      notifications: true,
      soundEffects: true,
      autoSave: true,
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  });

  const saveProfile = () => {
    localStorage.setItem('app_profile', JSON.stringify(profile));
    localStorage.setItem('app_preferences', JSON.stringify(preferences));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'appearance' as const, label: 'Appearance', icon: Palette },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'privacy' as const, label: 'Privacy', icon: Shield },
  ];

  const accentColors = [
    { name: 'Indigo', value: 'indigo', class: 'bg-indigo-500' },
    { name: 'Purple', value: 'purple', class: 'bg-purple-500' },
    { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
    { name: 'Green', value: 'green', class: 'bg-green-500' },
    { name: 'Red', value: 'red', class: 'bg-red-500' },
    { name: 'Orange', value: 'orange', class: 'bg-orange-500' },
    { name: 'Pink', value: 'pink', class: 'bg-pink-500' },
    { name: 'Teal', value: 'teal', class: 'bg-teal-500' },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ja', name: 'Japanese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ko', name: 'Korean' },
    { code: 'hi', name: 'Hindi' },
  ];

  const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) => (
    <label className="flex items-center justify-between cursor-pointer">
      <span className={`text-sm ${darkMode ? 'text-white/70' : 'text-gray-700'}`}>{label}</span>
      <button
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? 'bg-indigo-500' : darkMode ? 'bg-white/20' : 'bg-gray-300'
        }`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`} />
      </button>
    </label>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/[0.04] rounded-xl mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[100px] py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === tab.id
                ? darkMode ? 'bg-white/[0.1] text-white' : 'bg-indigo-100 text-indigo-700'
                : darkMode ? 'text-white/50 hover:text-white/70' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={16} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-xl border ${darkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>Display Name</label>
                <input
                  type="text"
                  value={profile.displayName}
                  onChange={e => setProfile({ ...profile, displayName: e.target.value })}
                  placeholder="Your name"
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none ${
                    darkMode ? 'bg-white/[0.04] border-white/[0.08] focus:border-white/[0.2] text-white placeholder:text-white/30' : 'bg-white border-gray-200 focus:border-indigo-300 text-gray-900 placeholder:text-gray-400'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                  placeholder="your@email.com"
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none ${
                    darkMode ? 'bg-white/[0.04] border-white/[0.08] focus:border-white/[0.2] text-white placeholder:text-white/30' : 'bg-white border-gray-200 focus:border-indigo-300 text-gray-900 placeholder:text-gray-400'
                  }`}
                />
              </div>
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={e => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none resize-none ${
                    darkMode ? 'bg-white/[0.04] border-white/[0.08] focus:border-white/[0.2] text-white placeholder:text-white/30' : 'bg-white border-gray-200 focus:border-indigo-300 text-gray-900 placeholder:text-gray-400'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>Location</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={e => setProfile({ ...profile, location: e.target.value })}
                  placeholder="City, Country"
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none ${
                    darkMode ? 'bg-white/[0.04] border-white/[0.08] focus:border-white/[0.2] text-white placeholder:text-white/30' : 'bg-white border-gray-200 focus:border-indigo-300 text-gray-900 placeholder:text-gray-400'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>Website</label>
                <input
                  type="url"
                  value={profile.website}
                  onChange={e => setProfile({ ...profile, website: e.target.value })}
                  placeholder="https://yoursite.com"
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none ${
                    darkMode ? 'bg-white/[0.04] border-white/[0.08] focus:border-white/[0.2] text-white placeholder:text-white/30' : 'bg-white border-gray-200 focus:border-indigo-300 text-gray-900 placeholder:text-gray-400'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appearance Tab */}
      {activeTab === 'appearance' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-xl border ${darkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Theme</h3>
            <div className="grid grid-cols-3 gap-3">
              {(['light', 'dark', 'system'] as const).map(theme => (
                <button
                  key={theme}
                  onClick={() => setPreferences({ ...preferences, theme })}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    preferences.theme === theme
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : darkMode ? 'border-white/[0.08] hover:border-white/[0.15]' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-8 h-8 mx-auto mb-2 rounded-lg ${
                    theme === 'light' ? 'bg-white border border-gray-200' :
                    theme === 'dark' ? 'bg-gray-900' :
                    'bg-gradient-to-br from-white to-gray-900'
                  }`} />
                  <span className={`text-sm capitalize ${darkMode ? 'text-white/70' : 'text-gray-700'}`}>{theme}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${darkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Accent Color</h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {accentColors.map(color => (
                <button
                  key={color.value}
                  onClick={() => setPreferences({ ...preferences, accentColor: color.value })}
                  className={`w-full aspect-square rounded-xl ${color.class} transition-all ${
                    preferences.accentColor === color.value ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'hover:scale-105'
                  } ${darkMode ? 'ring-offset-gray-900' : 'ring-offset-white'}`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${darkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Display</h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>Font Size</label>
                <div className="flex gap-2">
                  {(['small', 'medium', 'large'] as const).map(size => (
                    <button
                      key={size}
                      onClick={() => setPreferences({ ...preferences, fontSize: size })}
                      className={`flex-1 py-2 rounded-lg text-sm capitalize transition-all ${
                        preferences.fontSize === size
                          ? darkMode ? 'bg-white/[0.1] text-white' : 'bg-indigo-100 text-indigo-700'
                          : darkMode ? 'bg-white/[0.04] text-white/50' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <Toggle checked={preferences.compactMode} onChange={() => setPreferences({ ...preferences, compactMode: !preferences.compactMode })} label="Compact Mode" />
              <Toggle checked={preferences.animations} onChange={() => setPreferences({ ...preferences, animations: !preferences.animations })} label="Enable Animations" />
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className={`p-6 rounded-xl border space-y-4 ${darkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-gray-50 border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notification Preferences</h3>
          <Toggle checked={preferences.notifications} onChange={() => setPreferences({ ...preferences, notifications: !preferences.notifications })} label="Push Notifications" />
          <Toggle checked={preferences.soundEffects} onChange={() => setPreferences({ ...preferences, soundEffects: !preferences.soundEffects })} label="Sound Effects" />
          <Toggle checked={preferences.autoSave} onChange={() => setPreferences({ ...preferences, autoSave: !preferences.autoSave })} label="Auto-save Changes" />
        </div>
      )}

      {/* Privacy Tab */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-xl border ${darkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Regional Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>Language</label>
                <select
                  value={preferences.language}
                  onChange={e => setPreferences({ ...preferences, language: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none ${
                    darkMode ? 'bg-white/[0.04] border-white/[0.08] text-white' : 'bg-white border-gray-200 text-gray-900'
                  }`}
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code} className={darkMode ? 'bg-gray-900' : 'bg-white'}>{lang.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>Timezone</label>
                <input
                  type="text"
                  value={preferences.timezone}
                  onChange={e => setPreferences({ ...preferences, timezone: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none ${
                    darkMode ? 'bg-white/[0.04] border-white/[0.08] text-white' : 'bg-white border-gray-200 text-gray-900'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${darkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Data Management</h3>
            <div className="flex flex-wrap gap-3">
              <button className={`px-4 py-2 rounded-lg text-sm transition-all ${
                darkMode ? 'bg-white/[0.08] hover:bg-white/[0.12] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}>
                Export Data
              </button>
              <button className={`px-4 py-2 rounded-lg text-sm transition-all ${
                darkMode ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-600'
              }`}>
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="mt-6 flex items-center justify-between">
        <div className={`flex items-center gap-2 text-sm ${saved ? 'text-green-400' : 'text-transparent'}`}>
          <Check size={16} />
          Settings saved!
        </div>
        <button
          onClick={saveProfile}
          className={`px-6 py-2.5 rounded-xl transition-all font-medium text-sm flex items-center gap-2 ${
            darkMode
              ? 'bg-white/[0.08] hover:bg-white/[0.12] text-white'
              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
          }`}
        >
          <Save size={16} />
          Save Settings
        </button>
      </div>
    </div>
  );
}
