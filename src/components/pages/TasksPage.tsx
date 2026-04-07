import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, ArrowLeft } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('cl1nical-tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cl1nical-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks(prev => [...prev, {
      id: Date.now().toString(),
      text: input.trim(),
      completed: false,
      createdAt: Date.now(),
    }]);
    setInput('');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: '#F5F0E8',
      fontFamily: "'DM Mono', monospace",
      padding: '2rem',
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <a 
            href="/"
            style={{
              color: '#F5F0E8',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '14px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            <ArrowLeft size={16} />
            Back
          </a>
        </div>

        <h1 style={{
          fontFamily: "'Clash Display', sans-serif",
          fontSize: '4rem',
          fontWeight: 600,
          letterSpacing: '-0.03em',
          marginBottom: '0.5rem',
        }}>
          TASKS
        </h1>
        
        <p style={{
          fontSize: '14px',
          color: 'rgba(245, 240, 232, 0.5)',
          marginBottom: '2rem',
        }}>
          {completedCount} / {tasks.length} completed
        </p>

        {/* Input */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '2rem',
        }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            placeholder="Add a task..."
            style={{
              flex: 1,
              padding: '12px 16px',
              backgroundColor: 'rgba(245, 240, 232, 0.05)',
              border: '1px solid rgba(245, 240, 232, 0.1)',
              borderRadius: '8px',
              color: '#F5F0E8',
              fontFamily: "'DM Mono', monospace",
              fontSize: '14px',
              outline: 'none',
            }}
          />
          <button
            onClick={addTask}
            style={{
              padding: '12px 20px',
              backgroundColor: '#E8A020',
              border: 'none',
              borderRadius: '8px',
              color: '#0a0a0a',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: "'DM Mono', monospace",
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        {/* Task List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tasks.length === 0 && (
            <p style={{
              textAlign: 'center',
              color: 'rgba(245, 240, 232, 0.3)',
              padding: '3rem 0',
              fontSize: '14px',
            }}>
              No tasks yet. Add one above.
            </p>
          )}
          
          {tasks.map(task => (
            <div
              key={task.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '12px 16px',
                backgroundColor: task.completed 
                  ? 'rgba(232, 160, 32, 0.05)' 
                  : 'rgba(245, 240, 232, 0.03)',
                borderRadius: '8px',
                border: `1px solid ${task.completed 
                  ? 'rgba(232, 160, 32, 0.2)' 
                  : 'rgba(245, 240, 232, 0.05)'}`,
              }}
            >
              <button
                onClick={() => toggleTask(task.id)}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: `2px solid ${task.completed ? '#E8A020' : 'rgba(245, 240, 232, 0.2)'}`,
                  backgroundColor: task.completed ? '#E8A020' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {task.completed && <Check size={14} color="#0a0a0a" />}
              </button>
              
              <span style={{
                flex: 1,
                fontSize: '14px',
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed 
                  ? 'rgba(245, 240, 232, 0.4)' 
                  : '#F5F0E8',
              }}>
                {task.text}
              </span>
              
              <button
                onClick={() => deleteTask(task.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(245, 240, 232, 0.3)',
                  padding: '4px',
                  display: 'flex',
                  opacity: 0.6,
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
