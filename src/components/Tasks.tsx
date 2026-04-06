import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Flag, Calendar } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: string;
}

interface TasksProps {
  darkMode: boolean;
}

const CATEGORIES = ['All', 'Work', 'Personal', 'Shopping', 'Health'];

export default function Tasks({ darkMode }: TasksProps) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('app_tasks');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const [newTask, setNewTask] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newCategory, setNewCategory] = useState('Work');
  const [filterCategory, setFilterCategory] = useState('All');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('app_tasks', JSON.stringify(tasks));
    }
  }, [tasks, mounted]);

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      text: newTask,
      completed: false,
      priority: newPriority,
      category: newCategory,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [task, ...prev]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const filteredTasks = filterCategory === 'All' 
    ? tasks 
    : tasks.filter(t => t.category === filterCategory);

  const priorityStyles = darkMode ? {
    low: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    high: 'bg-red-500/20 text-red-400 border border-red-500/30',
  } : {
    low: 'bg-blue-100 text-blue-700 border border-blue-200',
    medium: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    high: 'bg-red-100 text-red-700 border border-red-200',
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Add Task */}
      <div className={`mb-6 p-4 rounded-xl border ${darkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            placeholder="Add a new task..."
            className={`flex-1 px-3 py-2 border rounded-lg text-sm outline-none ${
              darkMode 
                ? 'bg-white/[0.04] border-white/[0.08] focus:border-white/[0.2] text-white placeholder:text-white/30' 
                : 'bg-white border-gray-200 focus:border-indigo-300 text-gray-900 placeholder:text-gray-400'
            }`}
          />
          <button
            onClick={addTask}
            className={`px-4 rounded-lg transition-all flex items-center gap-2 text-sm font-medium border ${
              darkMode 
                ? 'bg-white/[0.08] hover:bg-white/[0.12] text-white border-white/[0.06]'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-100'
            }`}
          >
            <Plus size={16} /> Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={newPriority}
            onChange={e => setNewPriority(e.target.value as 'low' | 'medium' | 'high')}
            className={`px-2 py-1.5 rounded-lg text-xs outline-none ${
              darkMode 
                ? 'bg-white/[0.04] border-white/[0.08] text-white/60'
                : 'bg-white border-gray-200 text-gray-600'
            }`}
          >
            <option value="low" className={darkMode ? 'bg-[#0a0a0a]' : 'bg-white'}>Low Priority</option>
            <option value="medium" className={darkMode ? 'bg-[#0a0a0a]' : 'bg-white'}>Medium Priority</option>
            <option value="high" className={darkMode ? 'bg-[#0a0a0a]' : 'bg-white'}>High Priority</option>
          </select>
          <select
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            className={`px-2 py-1.5 rounded-lg text-xs outline-none ${
              darkMode 
                ? 'bg-white/[0.04] border-white/[0.08] text-white/60'
                : 'bg-white border-gray-200 text-gray-600'
            }`}
          >
            {CATEGORIES.filter(c => c !== 'All').map(cat => (
              <option key={cat} value={cat} className={darkMode ? 'bg-[#0a0a0a]' : 'bg-white'}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              filterCategory === cat
                ? darkMode ? 'bg-white/[0.12] text-white border border-white/[0.15]' : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                : darkMode ? 'bg-white/[0.04] text-white/50 hover:text-white/70 border border-transparent' : 'bg-gray-100 text-gray-500 hover:text-gray-700 border border-transparent'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {filteredTasks.length === 0 && (
          <div className={`text-center py-12 ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>
            <Check size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No tasks yet. Add one above!</p>
          </div>
        )}
        {filteredTasks.map(task => (
          <div
            key={task.id}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
              darkMode ? 'bg-white/[0.03] border-white/[0.08] hover:border-white/[0.15]' : 'bg-white border-gray-200 hover:border-gray-300'
            } ${task.completed ? 'opacity-40' : ''}`}
          >
            <button
              onClick={() => toggleTask(task.id)}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                task.completed 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : darkMode ? 'border-white/20 hover:border-green-500' : 'border-gray-300 hover:border-green-500'
              }`}
            >
              {task.completed && <Check size={12} />}
            </button>
            
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'} ${task.completed ? 'line-through' : ''}`}>
                {task.text}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${priorityStyles[task.priority]}`}>
                  {task.priority}
                </span>
                <span className={`text-[10px] flex items-center gap-1 ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>
                  <Flag size={10} /> {task.category}
                </span>
                <span className={`text-[10px] flex items-center gap-1 ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>
                  <Calendar size={10} /> {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => deleteTask(task.id)}
              className={darkMode ? 'text-white/30 hover:text-red-400 transition-colors' : 'text-gray-400 hover:text-red-500 transition-colors'}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Stats */}
      {tasks.length > 0 && (
        <div className={`mt-6 p-4 rounded-xl border ${darkMode ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-gray-50 border-gray-200'}`}>
          <div className={`flex justify-between text-xs ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
            <span>Total: {tasks.length}</span>
            <span>Completed: {tasks.filter(t => t.completed).length}</span>
            <span>Remaining: {tasks.filter(t => !t.completed).length}</span>
            <span>Progress: {Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}