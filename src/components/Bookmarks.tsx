import { useState, useEffect } from 'react';
import { Plus, Trash2, ExternalLink, Bookmark, Search } from 'lucide-react';

interface Bookmark {
  id: string;
  title: string;
  url: string;
  category: string;
  createdAt: string;
}

const CATEGORIES = ['All', 'Dev', 'Social', 'News', 'Tools', 'Other'];

export default function Bookmarks() {
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
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search bookmarks..." className="w-full pl-9 pr-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm outline-none focus:border-white/[0.2] text-white placeholder:text-white/30" />
        </div>
        <button onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 bg-white/[0.08] hover:bg-white/[0.12] text-white rounded-lg transition-all flex items-center gap-2 text-sm font-medium border border-white/[0.06]">
          <Plus size={16} /> Add Bookmark
        </button>
      </div>

      {showAdd && (
        <div className="mb-6 p-4 bg-white/[0.03] rounded-xl border border-white/[0.08]">
          <div className="space-y-3">
            <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)}
              placeholder="Title" className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm outline-none focus:border-white/[0.2] text-white placeholder:text-white/30" />
            <input type="text" value={newUrl} onChange={e => setNewUrl(e.target.value)}
              placeholder="URL (e.g., github.com)" className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm outline-none focus:border-white/[0.2] text-white placeholder:text-white/30" />
            <div className="flex gap-2">
              <select value={newCategory} onChange={e => setNewCategory(e.target.value)}
                className="flex-1 px-2 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded text-xs text-white/60 outline-none">
                {CATEGORIES.filter(c => c !== 'All').map(cat => <option key={cat} value={cat} className="bg-[#0a0a0a]">{cat}</option>)}
              </select>
              <button onClick={addBookmark} className="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-all border border-green-500/30">Save</button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-1.5 bg-white/[0.06] text-white/60 rounded-lg text-sm hover:bg-white/[0.1] transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${filterCategory === cat
              ? 'bg-white/[0.12] text-white border border-white/[0.15]'
              : 'bg-white/[0.04] text-white/50 hover:text-white/70 border border-transparent'}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-white/30">
            <Bookmark size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No bookmarks found</p>
          </div>
        )}
        {filtered.map(bookmark => (
          <div key={bookmark.id} className="group p-4 bg-white/[0.03] rounded-xl border border-white/[0.08] hover:border-white/[0.15] transition-all">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-medium text-white truncate pr-2">{bookmark.title}</h3>
              <button onClick={() => deleteBookmark(bookmark.id)} className="text-white/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                <Trash2 size={14} />
              </button>
            </div>
            <a href={bookmark.url} target="_blank" rel="noopener noreferrer"
              className="text-xs text-white/40 hover:text-blue-400 truncate block mb-2">{bookmark.url}</a>
            <div className="flex items-center justify-between">
              <span className="text-[10px] px-2 py-0.5 bg-white/[0.06] text-white/40 rounded">{bookmark.category}</span>
              <ExternalLink size={12} className="text-white/30 group-hover:text-white/50 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}