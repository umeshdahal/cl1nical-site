import { useState, useEffect } from 'react';
import { Plus, Trash2, ExternalLink, ArrowLeft, Bookmark } from 'lucide-react';

interface Bookmark {
  id: string;
  title: string;
  url: string;
  createdAt: number;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('cl1nical-bookmarks');
    if (saved) {
      try { setBookmarks(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cl1nical-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = () => {
    if (!title.trim() || !url.trim()) return;
    setBookmarks(prev => [...prev, {
      id: Date.now().toString(),
      title: title.trim(),
      url: url.trim(),
      createdAt: Date.now(),
    }]);
    setTitle('');
    setUrl('');
  };

  const deleteBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: '#F5F0E8',
      fontFamily: "'DM Mono', monospace",
      padding: '2rem',
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <a href="/" style={{
            color: '#F5F0E8', textDecoration: 'none', display: 'flex',
            alignItems: 'center', gap: '0.5rem', fontSize: '14px',
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            <ArrowLeft size={16} /> Back
          </a>
        </div>

        <h1 style={{
          fontFamily: "'Clash Display', sans-serif", fontSize: '4rem',
          fontWeight: 600, letterSpacing: '-0.03em', marginBottom: '0.5rem',
        }}>
          BOOKMARKS
        </h1>
        
        <p style={{ fontSize: '14px', color: 'rgba(245, 240, 232, 0.5)', marginBottom: '2rem' }}>
          {bookmarks.length} saved
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
          <input
            type="text" value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Title..."
            style={{
              padding: '12px 16px', backgroundColor: 'rgba(245, 240, 232, 0.05)',
              border: '1px solid rgba(245, 240, 232, 0.1)', borderRadius: '8px',
              color: '#F5F0E8', fontFamily: "'DM Mono', monospace", fontSize: '14px', outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text" value={url} onChange={e => setUrl(e.target.value)}
              placeholder="https://..."
              style={{
                flex: 1, padding: '12px 16px', backgroundColor: 'rgba(245, 240, 232, 0.05)',
                border: '1px solid rgba(245, 240, 232, 0.1)', borderRadius: '8px',
                color: '#F5F0E8', fontFamily: "'DM Mono', monospace", fontSize: '14px', outline: 'none',
              }}
            />
            <button onClick={addBookmark} style={{
              padding: '12px 20px', backgroundColor: '#2D5BE3', border: 'none',
              borderRadius: '8px', color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              fontFamily: "'DM Mono', monospace", fontSize: '14px', fontWeight: 500,
            }}>
              <Plus size={16} /> Save
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {bookmarks.length === 0 && (
            <p style={{ textAlign: 'center', color: 'rgba(245, 240, 232, 0.3)', padding: '3rem 0', fontSize: '14px' }}>
              No bookmarks yet. Add one above.
            </p>
          )}
          
          {bookmarks.map(bookmark => (
            <div key={bookmark.id} style={{
              display: 'flex', alignItems: 'center', gap: '1rem', padding: '12px 16px',
              backgroundColor: 'rgba(245, 240, 232, 0.03)', borderRadius: '8px',
              border: '1px solid rgba(245, 240, 232, 0.05)',
            }}>
              <Bookmark size={16} style={{ color: '#2D5BE3', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', color: '#F5F0E8', marginBottom: '2px' }}>
                  {bookmark.title}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(245, 240, 232, 0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {bookmark.url}
                </div>
              </div>
              <a href={bookmark.url} target="_blank" rel="noopener noreferrer" style={{
                color: 'rgba(245, 240, 232, 0.5)', textDecoration: 'none', display: 'flex',
              }}>
                <ExternalLink size={14} />
              </a>
              <button onClick={() => deleteBookmark(bookmark.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(245, 240, 232, 0.3)', padding: '4px', display: 'flex', opacity: 0.6,
              }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
