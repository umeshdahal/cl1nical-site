import { useState, useEffect, useRef } from 'react';
import { isAuthenticated, getCurrentUser, logout } from '../lib/auth';
import Login from './Login';
import Tasks from './Tasks';
import Bookmarks from './Bookmarks';
import PasswordGenerator from './PasswordGenerator';
import HomeLanding from './HomeLanding';
import {
  CheckSquare, Bookmark, Shield,
  Sun, Moon, LogOut, User, Menu, X, Zap,
  ChevronDown, Home
} from 'lucide-react';

type ModuleType = 'home' | 'tasks' | 'bookmarks' | 'password';

const modules: { id: ModuleType; label: string; icon: React.ReactNode; description: string }[] = [
  { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={18} />, description: 'Todo & productivity' },
  { id: 'bookmarks', label: 'Bookmarks', icon: <Bookmark size={18} />, description: 'Saved links' },
  { id: 'password', label: 'Password', icon: <Shield size={18} />, description: 'Generate secure passwords' },
];

export default function Hero() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeModule, setActiveModule] = useState<ModuleType>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize theme and profile on mount
  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('app_theme');
    if (storedTheme) setDarkMode(storedTheme === 'dark');
    
    const profile = localStorage.getItem('app_profile');
    if (profile) {
      const parsed = JSON.parse(profile);
      setDisplayName(parsed.displayName || '');
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const checkAuth = () => setLoggedIn(isAuthenticated());
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('app_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    setActiveModule('home');
  };

  const handleProfileUpdate = (name: string) => {
    setDisplayName(name);
  };

  const user = getCurrentUser();
  const displayUser = displayName || user?.username || 'User';

  if (!loggedIn || !mounted) {
    return <Login onLoginSuccess={() => setLoggedIn(true)} />;
  }

  return (
    <div className={`min-h-screen overflow-hidden relative ${darkMode ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
      {/* Background effects */}
      {darkMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px]"></div>
        </div>
      )}

      {darkMode && (
        <div className="fixed inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <header className={`sticky top-0 z-50 backdrop-blur-2xl ${darkMode ? 'bg-[#0a0a0a]/80 border-b border-white/[0.08]' : 'bg-white/80 border-b border-gray-200'}`}>
          <div className="flex items-center justify-between px-4 py-3 md:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`md:hidden p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <button
                onClick={() => setActiveModule('home')}
                className="flex items-center gap-2.5"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold tracking-tight">cl1</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className={`text-lg font-semibold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>cl1nical</h1>
                  <p className={`text-[10px] font-medium tracking-wide ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>Productivity Suite</p>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-1">
              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-all group ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              >
                {darkMode ? (
                  <Sun size={18} className="text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                ) : (
                  <Moon size={18} className={`group-hover:text-gray-800 transition-colors ${darkMode ? 'text-white/50' : 'text-gray-500'}`} />
                )}
              </button>

              {/* User Menu with Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <User size={14} className="text-white" />
                  </div>
                  <span className={`text-sm hidden md:block font-medium ${darkMode ? 'text-white/70' : 'text-gray-700'}`}>{displayUser}</span>
                  <ChevronDown size={14} className={`transition-transform ${darkMode ? 'text-white/50' : 'text-gray-500'} ${showProfileDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown */}
                {showProfileDropdown && (
                  <div className={`absolute right-0 top-full mt-2 w-56 rounded-xl border shadow-lg overflow-hidden z-50 ${
                    darkMode ? 'bg-[#1a1a1a] border-white/[0.08]' : 'bg-white border-gray-200'
                  }`}>
                    <div className={`p-3 border-b ${darkMode ? 'border-white/[0.08]' : 'border-gray-200'}`}>
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{displayUser}</p>
                      <p className={`text-xs ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>{user?.role || 'user'}</p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => { setActiveModule('home'); setShowProfileDropdown(false); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                          darkMode ? 'hover:bg-white/[0.08] text-white/70' : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <Home size={16} /> Home
                      </button>
                    </div>
                    <div className={`p-2 border-t ${darkMode ? 'border-white/[0.08]' : 'border-gray-200'}`}>
                      <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                          darkMode ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-600'
                        }`}
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="flex min-h-[calc(100vh-57px)]">
          {/* Sidebar */}
          <aside className={`fixed md:sticky top-[57px] left-0 h-[calc(100vh-57px)] w-[260px] overflow-y-auto transition-transform z-40 flex flex-col ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } ${darkMode ? 'bg-[#0a0a0a]/95 md:bg-transparent border-r border-white/[0.08]' : 'bg-white/95 md:bg-gray-50 border-r border-gray-200'}`}>
            <div className="flex-1 p-4 space-y-1.5">
              <p className={`text-[10px] font-semibold tracking-widest uppercase px-3 mb-3 ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>Tools</p>
              {modules.map(mod => (
                <button
                  key={mod.id}
                  onClick={() => { setActiveModule(mod.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    activeModule === mod.id
                      ? darkMode ? 'bg-white/[0.08] text-white shadow-sm' : 'bg-indigo-100 text-indigo-700 shadow-sm'
                      : darkMode ? 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className={activeModule === mod.id 
                    ? darkMode ? 'text-white' : 'text-indigo-600' 
                    : darkMode ? 'text-white/40' : 'text-gray-400'
                  }>
                    {mod.icon}
                  </span>
                  <div className="text-left flex-1">
                    <p className={`text-sm font-medium ${
                      activeModule === mod.id 
                        ? darkMode ? 'text-white' : 'text-indigo-700' 
                        : darkMode ? 'text-white/60' : 'text-gray-600'
                    }`}>
                      {mod.label}
                    </p>
                    <p className={`text-[10px] ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>{mod.description}</p>
                  </div>
                  {activeModule === mod.id && (
                    <div className={`w-1 h-6 rounded-full ${darkMode ? 'bg-white/20' : 'bg-indigo-300'}`}></div>
                  )}
                </button>
              ))}
            </div>

            {/* Sidebar footer */}
            <div className={`sticky bottom-0 left-0 right-0 p-4 ${darkMode ? 'border-t border-white/[0.08] bg-[#0a0a0a]/95' : 'border-t border-gray-200 bg-white/95'}`}>
              <div className={`flex items-center gap-2 ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>
                <Zap size={14} />
                <span className="text-[10px] font-medium tracking-wide">Powered by cl1nical</span>
              </div>
            </div>
          </aside>

          {/* Overlay for mobile sidebar */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-8">
            {activeModule === 'home' && <HomeLanding darkMode={darkMode} onNavigate={(mod) => setActiveModule(mod as ModuleType)} />}
            {activeModule === 'tasks' && <Tasks darkMode={darkMode} />}
            {activeModule === 'bookmarks' && <Bookmarks darkMode={darkMode} />}
            {activeModule === 'password' && <PasswordGenerator />}
          </main>
        </div>
      </div>
    </div>
  );
}
