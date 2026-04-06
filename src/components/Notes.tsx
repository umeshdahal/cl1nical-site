import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, FileText } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NotesProps {
  darkMode: boolean;
}

export default function Notes({ darkMode }: NotesProps) {
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
      <div className={`w-full md:w-56 border-b md:border-b-0 md:border-r p-3 flex flex-col ${darkMode ? 'border-white/[0.08]' : 'border-gray-200'}`}>
        <button
          onClick={createNote}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-sm transition-all mb-3 border ${
            darkMode 
              ? 'bg-white/[0.08] hover:bg-white/[0.12] text-white border-white/[0.06]' 
              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-100'
          }`}
        >
          <Plus size={14} /> New Note
        </button>
        
        <div className="flex-1 overflow-y-auto space-y-1 max-h-48 md:max-h-none">
          {notes.length === 0 && (
            <p className={`text-sm text-center py-6 ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>No notes yet</p>
          )}
          {notes.map(note => (
            <div
              key={note.id}
              onClick={() => { setActiveNote(note); setIsEditing(false); }}
              className={`p-2.5 rounded-lg cursor-pointer transition-all ${
                activeNote?.id === note.id 
                  ? darkMode ? 'bg-white/[0.08] border border-white/[0.12]' : 'bg-indigo-50 border border-indigo-200'
                  : darkMode ? 'hover:bg-white/[0.04] border border-transparent' : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {note.title}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                  className={`${darkMode ? 'text-white/30 hover:text-red-400' : 'text-gray-400 hover:text-red-500'} transition-colors ml-2`}
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <p className={`text-[10px] mt-1 ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>
                {new Date(note.updatedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-[300px] md:min-h-[400px]">
        {!activeNote ? (
          <div className={`h-full flex items-center justify-center ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>
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
                className={`text-xl font-semibold border rounded-lg px-3 py-2 outline-none w-full ${
                  darkMode 
                    ? 'bg-white/[0.04] border-white/[0.08] focus:border-white/[0.2] text-white' 
                    : 'bg-gray-50 border-gray-200 focus:border-indigo-300 text-gray-900'
                }`}
                placeholder="Note title"
              />
              <button
                onClick={() => setIsEditing(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all border ${
                  darkMode 
                    ? 'bg-white/[0.08] hover:bg-white/[0.12] text-white border-white/[0.06]'
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-100'
                }`}
              >
                <Save size={14} /> Save
              </button>
            </div>
            <textarea
              value={activeNote.content}
              onChange={e => updateNote(activeNote.id, { content: e.target.value })}
              className={`w-full h-72 border rounded-lg p-3 outline-none resize-none text-sm leading-relaxed ${
                darkMode 
                  ? 'bg-white/[0.02] border-white/[0.08] focus:border-white/[0.2] text-white/80'
                  : 'bg-gray-50 border-gray-200 focus:border-indigo-300 text-gray-700'
              }`}
              placeholder="Start typing..."
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{activeNote.title}</h2>
              <button
                onClick={() => setIsEditing(true)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all border ${
                  darkMode 
                    ? 'bg-white/[0.06] hover:bg-white/[0.1] text-white/70 border-white/[0.06]'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
                }`}
              >
                <Edit2 size={14} /> Edit
              </button>
            </div>
            <div className={`border rounded-lg p-4 ${darkMode ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-gray-50 border-gray-200'}`}>
              <p className={`whitespace-pre-wrap leading-relaxed text-sm ${darkMode ? 'text-white/70' : 'text-gray-700'}`}>
                {activeNote.content || <span className={darkMode ? 'text-white/30 italic' : 'text-gray-400 italic'}>No content yet</span>}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}