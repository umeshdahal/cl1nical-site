import { useState, useEffect } from 'react';
import { Plus, Trash2, ExternalLink, Bookmark, Search } from 'lucide-react';

interface Bookmark {
  id: string;
  title: string;
  url: string;
  category: string;
  createdAt: string;
}

interface BookmarksProps {
  darkMode: boolean;
}

const CATEGORIES = ['All', 'Dev', 'Social', 'News', 'Tools', 'Other'];

export default function Bookmarks({ darkMode }: BookmarksProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('app_bookmarks');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState('Dev');
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') localStorage.setItem('app_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks, mounted]);

  const addBookmark = () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    setBookmarks(prev => [{
      id: Date.now().toString(), title: newTitle,
      url: newUrl.startsWith('http') ? newUrl : `https://${newUrl}`,
      category: newCategory, createdAt: new Date().toISOString(),
    }, ...prev]);
    setNewTitle(''); setNewUrl(''); setShowAdd(false);
  };

  const deleteBookmark = (id: string) => setBookmarks(prev => prev.filter(b => b.id !== id));

  const filtered = bookmarks.filter(b => {
    const matchCat = filterCategory === 'All' || b.category === filterCategory;
    const matchSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.url.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-white/30' : 'text-gray-400'}`} />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search bookmarks..." className={`w-full pl-9 pr-4 py-2 border rounded-lg text-sm outline-none ${
              darkMode 
                ? 'bg-white/[0.04] border-white/[0.08] focus:border-white/[0.2] text-white placeholder:text-white/30'
                : 'bg-white border-gray-200 focus:border-indigo-300 text-gray-900 placeholder:text-gray-400'
            }`} />
        </div>
        <button onClick={() => setShowAdd(!showAdd)}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium border ${
            darkMode 
              ? 'bg-white/[0.08] hover:bg-white/[0.12] text-white border-white/[0.06]'
              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-100'
          }`}>
          <Plus size={16} /> Add Bookmark
        </button>
      </div>

      {showAdd && (
        <div className={`mb-6 p-4 rounded-xl border ${darkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-gray-50 border-gray-200'}`}>
          <div className="space-y-3">
            <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)}
              placeholder="Title" className={`w-full px-3 py-2 border rounded-lg text-sm outline-none ${
                darkMode 
                  ? 'bg-white/[0.04] border-white/[0.08] focus:border-white/[0.2] text-white placeholder:text-white/30'
                  : 'bg-white border-gray-200 focus:border-indigo-300 text-gray-900 placeholder:text-gray-400'
              }`} />
            <input type="text" value={newUrl} onChange={e => setNewUrl(e.target.value)}
              placeholder="URL (e.g., github.com)" className={`w-full px-3 py-2 border rounded-lg text-sm outline-none ${
                darkMode 
                  ? 'bg-white/[0.04] border-white/[0.08] focus:border-white/[0.2] text-white placeholder:text-white/30'
                  : 'bg-white border-gray-200 focus:border-indigo-300 text-gray-900 placeholder:text-gray-400'
              }`} />
            <div className="flex gap-2">
              <select value={newCategory} onChange={e => setNewCategory(e.target.value)}
                className={`flex-1 px-2 py-1.5 border rounded text-xs outline-none ${
                  darkMode 
                    ? 'bg-white/[0.04] border-white/[0.08] text-white/60'
                    : 'bg-white border-gray-200 text-gray-600'
                }`}>
                {CATEGORIES.filter(c => c !== 'All').map(cat => <option key={cat} value={cat} className={darkMode ? 'bg-[#0a0a0a]' : 'bg-white'}>{cat}</option>)}
              </select>
              <button onClick={addBookmark} className={`px-4 py-1.5 rounded-lg text-sm transition-all border ${
                darkMode 
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/30'
                  : 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200'
              }`}>Save</button>
              <button onClick={() => setShowAdd(false)} className={`px-4 py-1.5 rounded-lg text-sm transition-all ${
                darkMode 
                  ? 'bg-white/[0.06] text-white/60 hover:bg-white/[0.1]'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              filterCategory === cat
                ? darkMode ? 'bg-white/[0.12] text-white border border-white/[0.15]' : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                : darkMode ? 'bg-white/[0.04] text-white/50 hover:text-white/70 border border-transparent' : 'bg-gray-100 text-gray-500 hover:text-gray-700 border border-transparent'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.length === 0 && (
          <div className={`col-span-full text-center py-12 ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>
            <Bookmark size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No bookmarks found</p>
          </div>
        )}
        {filtered.map(bookmark => (
          <div key={bookmark.id} className={`p-4 rounded-xl border transition-all ${
            darkMode 
              ? 'bg-white/[0.03] border-white/[0.08] hover:border-white/[0.15]'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}>
            <div className="flex items-start justify-between mb-2">
              <h3 className={`text-sm font-medium truncate pr-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{bookmark.title}</h3>
              <button onClick={() => deleteBookmark(bookmark.id)} className={`${darkMode ? 'text-white/30 hover:text-red-400' : 'text-gray-400 hover:text-red-500'} transition-colors opacity-0 group-hover:opacity-100`}>
                <Trash2 size={14} />
              </button>
            </div>
            <a href={bookmark.url} target="_blank" rel="noopener noreferrer"
              className={`text-xs truncate block mb-2 ${darkMode ? 'text-white/40 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'}`}>{bookmark.url}</a>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] px-2 py-0.5 rounded ${darkMode ? 'bg-white/[0.06] text-white/40' : 'bg-gray-100 text-gray-500'}`}>{bookmark.category}</span>
              <ExternalLink size={12} className={darkMode ? 'text-white/30 group-hover:text-white/50 transition-colors' : 'text-gray-400 group-hover:text-gray-500 transition-colors'} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}