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
    const stored = localStorage.getItem('app_notes');
    return stored ? JSON.parse(stored) : [];
  });
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    localStorage.setItem('app_notes', JSON.stringify(notes));
  }, [notes]);

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
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col">
        <button
          onClick={createNote}
          className="w-full flex items-center justify-center gap-2 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition mb-4"
        >
          <Plus size={16} /> New Note
        </button>
        
        <div className="flex-1 overflow-y-auto space-y-1">
          {notes.length === 0 && (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">No notes yet</p>
          )}
          {notes.map(note => (
            <div
              key={note.id}
              onClick={() => { setActiveNote(note); setIsEditing(false); }}
              className={`p-3 rounded-lg cursor-pointer transition ${
                activeNote?.id === note.id 
                  ? 'bg-gray-100 dark:bg-gray-800' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {note.title}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(note.updatedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {!activeNote ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-sm">Select a note or create a new one</p>
            </div>
          </div>
        ) : isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={activeNote.title}
                onChange={e => updateNote(activeNote.id, { title: e.target.value })}
                className="text-xl font-semibold bg-transparent border-none outline-none text-gray-900 dark:text-white w-full"
                placeholder="Note title"
              />
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition"
              >
                <Save size={14} /> Save
              </button>
            </div>
            <textarea
              value={activeNote.content}
              onChange={e => updateNote(activeNote.id, { content: e.target.value })}
              className="w-full h-80 bg-transparent border-none outline-none text-gray-700 dark:text-gray-300 resize-none text-sm leading-relaxed"
              placeholder="Start typing..."
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{activeNote.title}</h2>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <Edit2 size={14} /> Edit
              </button>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {activeNote.content || <span className="text-gray-400 italic">No content yet</span>}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}