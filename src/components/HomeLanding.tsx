import { Home, Zap, Shield, Bookmark } from 'lucide-react';

interface HomeLandingProps {
  darkMode: boolean;
  onNavigate: (module: string) => void;
}

export default function HomeLanding({ darkMode, onNavigate }: HomeLandingProps) {
  const quickActions = [
    { id: 'tasks', label: 'Tasks', icon: <Zap size={24} />, desc: 'Todo & productivity' },
    { id: 'bookmarks', label: 'Bookmarks', icon: <Bookmark size={24} />, desc: 'Saved links' },
    { id: 'password', label: 'Password', icon: <Shield size={24} />, desc: 'Generate passwords' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Welcome Section */}
      <div className="text-center mb-12">
        <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
          darkMode ? 'bg-gradient-to-br from-indigo-500 to-purple-500' : 'bg-gradient-to-br from-indigo-500 to-purple-600'
        } shadow-lg`}>
          <Home size={36} className="text-white" />
        </div>
        <h1 className={`text-4xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Welcome to cl1nical
        </h1>
        <p className={`text-lg ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
          Your personal productivity dashboard with powerful developer tools
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        {quickActions.map(action => (
          <button
            key={action.id}
            onClick={() => onNavigate(action.id)}
            className={`p-6 rounded-2xl border transition-all text-left group ${
              darkMode
                ? 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15]'
                : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
              darkMode
                ? 'bg-white/[0.06] text-white/70 group-hover:bg-white/[0.1] group-hover:text-white'
                : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100'
            }`}>
              {action.icon}
            </div>
            <h3 className={`text-lg font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {action.label}
            </h3>
            <p className={`text-sm ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
              {action.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Stats Section */}
      <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-gray-50 border-gray-200'}`}>
        <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Quick Stats
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Tools Available', value: '3' },
            { label: 'Dark Mode', value: 'Yes' },
            { label: 'Secure', value: 'Local' },
          ].map((stat, i) => (
            <div key={i} className={`p-4 rounded-xl ${darkMode ? 'bg-white/[0.04]' : 'bg-white'}`}>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
