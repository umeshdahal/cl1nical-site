import { useState, useEffect } from 'react';
import { isAuthenticated, getCurrentUser, logout } from '../lib/auth';
import Login from './Login';
import Notes from './Notes';
import Tasks from './Tasks';
import Bookmarks from './Bookmarks';
import PasswordGenerator from './PasswordGenerator';
import Pomodoro from './Pomodoro';
import TextTools from './TextTools';
import { 
  FileText, CheckSquare, Bookmark, Shield, Timer, FileType, 
  Sun, Moon, LogOut, User, Menu, X, Sparkles, Zap 
} from 'lucide-react';

type ModuleType = 'notes' | 'tasks' | 'bookmarks' | 'password' | 'pomodoro' | 'texttools';

const modules: { id: ModuleType; label: string; icon: React.ReactNode; description: string }[] = [
  { id: 'notes', label: 'Notes', icon: <FileText size={18} />, description: 'Quick notes & ideas' },
  { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={18} />, description: 'Todo & productivity' },
  { id: 'bookmarks', label: 'Bookmarks', icon: <Bookmark size={18} />, description: 'Saved links' },
  { id: 'password', label: 'Password', icon: <Shield size={18} />, description: 'Generate secure passwords' },
  { id: 'pomodoro', label: 'Focus', icon: <Timer size={18} />, description: 'Pomodoro timer' },
  { id: 'texttools', label: 'Text Tools', icon: <FileType size={18} />, description: 'JSON, Base64, URL encode' },
];

export default function Hero() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  
  // Initialize theme on mount
  useEffect(() => {
    const stored = localStorage.getItem('app_theme');
    if (stored) {
      setDarkMode(stored === 'dark');
    } else {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
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
    <div className="min-h-screen bg-[#0a0a0a] dark:bg-[#0a0a0a] text-white overflow-hidden relative">
      {/* Subtle mesh gradient background - pure CSS, no JS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="fixed inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-2xl border-b border-white/[0.08]">
          <div className="flex items-center justify-between px-4 py-3 md:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-gradient-to-br from-white to-white/80 rounded-xl flex items-center justify-center shadow-lg shadow-white/10">
                  <span className="text-black text-sm font-bold tracking-tight">cl1</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
                  <p className="text-[10px] text-white/40 font-medium tracking-wide">STUDIO v2.0</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Quick stats pill */}
              <div className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-full mr-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] text-white/50 font-medium">Online</span>
                </div>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all group"
              >
                {darkMode ? (
                  <Sun size={18} className="text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                ) : (
                  <Moon size={18} className="text-white/50 group-hover:text-white/80 transition-colors" />
                )}
              </button>

              {/* User Menu */}
              <div className="flex items-center gap-2 pl-1 ml-1 border-l border-white/[0.08]">
                <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/10 rounded-lg transition-all">
                  <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <User size={14} className="text-white" />
                  </div>
                  <span className="text-sm text-white/70 hidden md:block font-medium">{user?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all"
                  title="Logout"
                >
                  <LogOut size={16} className="text-white/40 hover:text-white/80 transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex min-h-[calc(100vh-57px)]">
          {/* Sidebar */}
          <aside className={`fixed md:sticky top-[57px] left-0 h-[calc(100vh-57px)] w-[260px] bg-[#0a0a0a]/95 md:bg-transparent border-r border-white/[0.08] overflow-y-auto transition-transform z-40 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}>
            <div className="p-4 space-y-1.5">
              <p className="text-[10px] text-white/30 font-semibold tracking-widest uppercase px-3 mb-3">Tools</p>
              {modules.map(mod => (
                <button
                  key={mod.id}
                  onClick={() => { setActiveModule(mod.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    activeModule === mod.id
                      ? 'bg-white/[0.08] text-white shadow-sm'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                  }`}
                >
                  <span className={activeModule === mod.id ? 'text-white' : 'text-white/40'}>
                    {mod.icon}
                  </span>
                  <div className="text-left flex-1">
                    <p className={`text-sm font-medium ${activeModule === mod.id ? 'text-white' : 'text-white/60'}`}>
                      {mod.label}
                    </p>
                    <p className="text-[10px] text-white/30">{mod.description}</p>
                  </div>
                  {activeModule === mod.id && (
                    <div className="w-1 h-6 bg-white/20 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Sidebar footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/[0.08] bg-[#0a0a0a]/95">
              <div className="flex items-center gap-2 text-white/30">
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
              <div className="w-10 h-10 bg-white/[0.06] border border-white/[0.08] rounded-xl flex items-center justify-center">
                {modules.find(m => m.id === activeModule)?.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  {modules.find(m => m.id === activeModule)?.label}
                </h2>
                <p className="text-sm text-white/40 mt-0.5">
                  {modules.find(m => m.id === activeModule)?.description}
                </p>
              </div>
            </div>

            {/* Module Content */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 md:p-6 backdrop-blur-xl">
              {activeModule === 'notes' && <Notes />}
              {activeModule === 'tasks' && <Tasks />}
              {activeModule === 'bookmarks' && <Bookmarks />}
              {activeModule === 'password' && <PasswordGenerator />}
              {activeModule === 'pomodoro' && <Pomodoro />}
              {activeModule === 'texttools' && <TextTools />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
