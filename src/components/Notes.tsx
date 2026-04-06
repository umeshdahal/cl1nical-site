import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, FileText } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('app_notes');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('app_notes', JSON.stringify(notes));
    }
  }, [notes, mounted]);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNote(newNote);
    setIsEditing(true);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => 
      n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
    ));
    if (activeNote?.id === id) {
      setActiveNote(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (activeNote?.id === id) {
      setActiveNote(null);
      setIsEditing(false);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-4">
      {/* Sidebar */}
      <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-white/[0.08] p-3 flex flex-col">
        <button
          onClick={createNote}
          className="w-full flex items-center justify-center gap-2 py-2 bg-white/[0.08] hover:bg-white/[0.12] text-white rounded-lg font-medium text-sm transition-all mb-3 border border-white/[0.06]"
        >
          <Plus size={14} /> New Note
        </button>
        
        <div className="flex-1 overflow-y-auto space-y-1 max-h-48 md:max-h-none">
          {notes.length === 0 && (
            <p className="text-sm text-white/30 text-center py-6">No notes yet</p>
          )}
          {notes.map(note => (
            <div
              key={note.id}
              onClick={() => { setActiveNote(note); setIsEditing(false); }}
              className={`p-2.5 rounded-lg cursor-pointer transition-all ${
                activeNote?.id === note.id 
                  ? 'bg-white/[0.08] border border-white/[0.12]' 
                  : 'hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white truncate">
                  {note.title}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                  className="text-white/30 hover:text-red-400 transition-colors ml-2"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <p className="text-[10px] text-white/30 mt-1">
                {new Date(note.updatedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-[300px] md:min-h-[400px]">
        {!activeNote ? (
          <div className="h-full flex items-center justify-center text-white/30">
            <div className="text-center">
              <FileText size={40} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">Select a note or create a new one</p>
            </div>
          </div>
        ) : isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <input
                type="text"
                value={activeNote.title}
                onChange={e => updateNote(activeNote.id, { title: e.target.value })}
                className="text-xl font-semibold bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 outline-none focus:border-white/[0.2] text-white w-full"
                placeholder="Note title"
              />
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-3 py-2 bg-white/[0.08] hover:bg-white/[0.12] text-white rounded-lg text-sm transition-all border border-white/[0.06]"
              >
                <Save size={14} /> Save
              </button>
            </div>
            <textarea
              value={activeNote.content}
              onChange={e => updateNote(activeNote.id, { content: e.target.value })}
              className="w-full h-72 bg-white/[0.02] border border-white/[0.08] rounded-lg p-3 outline-none focus:border-white/[0.2] text-white/80 resize-none text-sm leading-relaxed"
              placeholder="Start typing..."
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">{activeNote.title}</h2>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-white/70 rounded-lg text-sm transition-all border border-white/[0.06]"
              >
                <Edit2 size={14} /> Edit
              </button>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
              <p className="text-white/70 whitespace-pre-wrap leading-relaxed text-sm">
                {activeNote.content || <span className="text-white/30 italic">No content yet</span>}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}