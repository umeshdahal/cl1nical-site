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
  Sun, Moon, LogOut, User, Menu, X 
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
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('app_theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });
  const [activeModule, setActiveModule] = useState<ModuleType>('notes');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  if (!loggedIn) {
    return <Login onLoginSuccess={() => setLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                <span className="text-white dark:text-black text-sm font-bold">cl1</span>
              </div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white hidden sm:block">Dashboard</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              {darkMode ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-gray-600" />}
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <User size={16} className="text-gray-600 dark:text-gray-400" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 hidden md:block">{user?.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                title="Logout"
              >
                <LogOut size={18} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed md:sticky top-[57px] left-0 h-[calc(100vh-57px)] w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto transition-transform z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
          <nav className="p-4 space-y-1">
            {modules.map(mod => (
              <button
                key={mod.id}
                onClick={() => { setActiveModule(mod.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                  activeModule === mod.id
                    ? 'bg-gray-100 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <span className={activeModule === mod.id ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                  {mod.icon}
                </span>
                <div className="text-left">
                  <p className={`text-sm font-medium ${activeModule === mod.id ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                    {mod.label}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">{mod.description}</p>
                </div>
              </button>
            ))}
          </nav>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-57px)]">
          <div className="p-4 md:p-8">
            {/* Title */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {modules.find(m => m.id === activeModule)?.label}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {modules.find(m => m.id === activeModule)?.description}
              </p>
            </div>

            {/* Module Content */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              {activeModule === 'notes' && <Notes />}
              {activeModule === 'tasks' && <Tasks />}
              {activeModule === 'bookmarks' && <Bookmarks />}
              {activeModule === 'password' && <PasswordGenerator />}
              {activeModule === 'pomodoro' && <Pomodoro />}
              {activeModule === 'texttools' && <TextTools />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}