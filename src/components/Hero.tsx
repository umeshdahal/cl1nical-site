import { useState, useEffect } from 'react';
import { isAuthenticated, getCurrentUser, logout } from '../lib/auth';
import Login from './Login';
import Notes from './Notes';
import Tasks from './Tasks';
import Bookmarks from './Bookmarks';
import PasswordGenerator from './PasswordGenerator';
import Pomodoro from './Pomodoro';
import TextTools from './TextTools';
import MarkdownEditor from './MarkdownEditor';
import RegexTester from './RegexTester';
import TimestampConverter from './TimestampConverter';
import JWTDecoder from './JWTDecoder';
import HashGenerator from './HashGenerator';
import ColorConverter from './ColorConverter';
import DiffChecker from './DiffChecker';
import QRCodeGenerator from './QRCodeGenerator';
import ProfileSettings from './ProfileSettings';
import Chat from './Chat';
import {
  FileText, CheckSquare, Bookmark, Shield, Timer, FileType,
  Sun, Moon, LogOut, User, Menu, X, Sparkles, Zap,
  Code, Clock, Key, Hash, Palette, GitCompare, QrCode,
  Settings, MessageCircle
} from 'lucide-react';

type ModuleType = 'notes' | 'tasks' | 'bookmarks' | 'password' | 'pomodoro' | 'texttools' | 'markdown' | 'regex' | 'timestamp' | 'jwt' | 'hash' | 'color' | 'diff' | 'qrcode' | 'profile' | 'chat';

const modules: { id: ModuleType; label: string; icon: React.ReactNode; description: string }[] = [
  { id: 'notes', label: 'Notes', icon: <FileText size={18} />, description: 'Quick notes & ideas' },
  { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={18} />, description: 'Todo & productivity' },
  { id: 'bookmarks', label: 'Bookmarks', icon: <Bookmark size={18} />, description: 'Saved links' },
  { id: 'password', label: 'Password', icon: <Shield size={18} />, description: 'Generate secure passwords' },
  { id: 'pomodoro', label: 'Focus', icon: <Timer size={18} />, description: 'Pomodoro timer' },
  { id: 'texttools', label: 'Text Tools', icon: <FileType size={18} />, description: 'JSON, Base64, URL encode' },
  { id: 'markdown', label: 'Markdown', icon: <Code size={18} />, description: 'Live markdown editor' },
  { id: 'regex', label: 'Regex', icon: <Code size={18} />, description: 'Test regular expressions' },
  { id: 'timestamp', label: 'Timestamp', icon: <Clock size={18} />, description: 'Unix timestamp converter' },
  { id: 'jwt', label: 'JWT', icon: <Key size={18} />, description: 'Decode JWT tokens' },
  { id: 'hash', label: 'Hash', icon: <Hash size={18} />, description: 'Generate SHA hashes' },
  { id: 'color', label: 'Color', icon: <Palette size={18} />, description: 'Convert color formats' },
  { id: 'diff', label: 'Diff', icon: <GitCompare size={18} />, description: 'Compare text differences' },
  { id: 'qrcode', label: 'QR Code', icon: <QrCode size={18} />, description: 'Generate QR codes' },
  { id: 'chat', label: 'Chat', icon: <MessageCircle size={18} />, description: 'Messages & file sharing' },
  { id: 'profile', label: 'Settings', icon: <Settings size={18} />, description: 'Profile & preferences' },
];

export default function Hero() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Initialize theme on mount - default to light mode
  useEffect(() => {
    const stored = localStorage.getItem('app_theme');
    if (stored) {
      setDarkMode(stored === 'dark');
    }
    // If no stored preference, stay with false (light mode default)
  }, []);
  
  const [activeModule, setActiveModule] = useState<ModuleType>('notes');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
    setActiveModule('notes');
  };

  const user = getCurrentUser();

  if (!loggedIn || !mounted) {
    return <Login onLoginSuccess={() => setLoggedIn(true)} />;
  }

  return (
    <div className={`min-h-screen text-white overflow-hidden relative ${darkMode ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
      {/* Subtle mesh gradient background - pure CSS, no JS */}
      {darkMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px]"></div>
        </div>
      )}

      {/* Subtle grid pattern overlay - only in dark mode */}
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
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold tracking-tight">cl1</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className={`text-lg font-semibold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>Dashboard</h1>
                  <p className={`text-[10px] font-medium tracking-wide ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>STUDIO v2.0</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Quick stats pill */}
              <div className={`hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full mr-2 ${darkMode ? 'bg-white/[0.04] border border-white/[0.06]' : 'bg-gray-100 border border-gray-200'}`}>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className={`text-[10px] font-medium ${darkMode ? 'text-white/50' : 'text-gray-600'}`}>Online</span>
                </div>
              </div>

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

              {/* User Menu */}
              <div className={`flex items-center gap-2 pl-1 ml-1 ${darkMode ? 'border-l border-white/[0.08]' : 'border-l border-gray-200'}`}>
                <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                  <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <User size={14} className="text-white" />
                  </div>
                  <span className={`text-sm hidden md:block font-medium ${darkMode ? 'text-white/70' : 'text-gray-700'}`}>{user?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                  title="Logout"
                >
                  <LogOut size={16} className={darkMode ? 'text-white/40 hover:text-white/80 transition-colors' : 'text-gray-400 hover:text-gray-700 transition-colors'} />
                </button>
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

            {/* Sidebar footer - now sticky at bottom, scrolls with content */}
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
            {/* Title */}
            <div className="mb-6 flex items-center gap-3">
              <div className={`w-10 h-10 flex items-center justify-center ${
                darkMode ? 'bg-white/[0.06] border border-white/[0.08]' : 'bg-indigo-50 border border-indigo-100'
              } ${darkMode ? '' : 'text-indigo-600'} rounded-xl`}>
                {modules.find(m => m.id === activeModule)?.icon}
              </div>
              <div>
                <h2 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {modules.find(m => m.id === activeModule)?.label}
                </h2>
                <p className={`text-sm mt-0.5 ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
                  {modules.find(m => m.id === activeModule)?.description}
                </p>
              </div>
            </div>

            {/* Module Content */}
            <div className={`${
              darkMode ? 'bg-white/[0.03] border border-white/[0.08]' : 'bg-white border border-gray-200 shadow-sm'
            } rounded-2xl p-5 md:p-6 backdrop-blur-xl`}>
              {activeModule === 'notes' && <Notes darkMode={darkMode} />}
              {activeModule === 'tasks' && <Tasks darkMode={darkMode} />}
              {activeModule === 'bookmarks' && <Bookmarks darkMode={darkMode} />}
              {activeModule === 'password' && <PasswordGenerator />}
              {activeModule === 'pomodoro' && <Pomodoro />}
              {activeModule === 'texttools' && <TextTools darkMode={darkMode} />}
              {activeModule === 'markdown' && <MarkdownEditor darkMode={darkMode} />}
              {activeModule === 'regex' && <RegexTester darkMode={darkMode} />}
              {activeModule === 'timestamp' && <TimestampConverter darkMode={darkMode} />}
              {activeModule === 'jwt' && <JWTDecoder darkMode={darkMode} />}
              {activeModule === 'hash' && <HashGenerator darkMode={darkMode} />}
              {activeModule === 'color' && <ColorConverter darkMode={darkMode} />}
              {activeModule === 'diff' && <DiffChecker darkMode={darkMode} />}
              {activeModule === 'qrcode' && <QRCodeGenerator darkMode={darkMode} />}
              {activeModule === 'chat' && <Chat darkMode={darkMode} />}
              {activeModule === 'profile' && <ProfileSettings darkMode={darkMode} />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}