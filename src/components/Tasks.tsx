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

const CATEGORIES = ['All', 'Work', 'Personal', 'Shopping', 'Health'];

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem('app_tasks');
    return stored ? JSON.parse(stored) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newCategory, setNewCategory] = useState('Work');
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    localStorage.setItem('app_tasks', JSON.stringify(tasks));
  }, [tasks]);

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

  const priorityColors = {
    low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Add Task */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            placeholder="Add a new task..."
            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-gray-900 dark:text-white"
          />
          <button
            onClick={addTask}
            className="px-4 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition flex items-center gap-2 text-sm font-medium"
          >
            <Plus size={16} /> Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={newPriority}
            onChange={e => setNewPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300 outline-none"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <select
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300 outline-none"
          >
            {CATEGORIES.filter(c => c !== 'All').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
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
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              filterCategory === cat
                ? 'bg-black dark:bg-white text-white dark:text-black'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {filteredTasks.length === 0 && (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500">
            <Check size={32} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">No tasks yet. Add one above!</p>
          </div>
        )}
        {filteredTasks.map(task => (
          <div
            key={task.id}
            className={`flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition ${
              task.completed ? 'opacity-50' : ''
            }`}
          >
            <button
              onClick={() => toggleTask(task.id)}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                task.completed 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
              }`}
            >
              {task.completed && <Check size={12} />}
            </button>
            
            <div className="flex-1 min-w-0">
              <p className={`text-sm text-gray-900 dark:text-white ${task.completed ? 'line-through' : ''}`}>
                {task.text}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                  <Flag size={10} /> {task.category}
                </span>
                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                  <Calendar size={10} /> {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => deleteTask(task.id)}
              className="text-gray-400 hover:text-red-500 transition"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Stats */}
      {tasks.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
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