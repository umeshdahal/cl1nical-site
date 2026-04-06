import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';

const WORK_TIME = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;
const SESSIONS_BEFORE_LONG = 4;

type TimerType = 'work' | 'shortBreak' | 'longBreak';

export default function Pomodoro() {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [timerType, setTimerType] = useState<TimerType>('work');
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    let interval: number | undefined;
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = useCallback(() => {
    if (timerType === 'work') {
      const newSessions = sessions + 1;
      setSessions(newSessions);
      if (newSessions % SESSIONS_BEFORE_LONG === 0) {
        setTimerType('longBreak');
        setTimeLeft(LONG_BREAK);
      } else {
        setTimerType('shortBreak');
        setTimeLeft(SHORT_BREAK);
      }
    } else {
      setTimerType('work');
      setTimeLeft(WORK_TIME);
    }
    setIsRunning(false);
  }, [timerType, sessions]);

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(timerType === 'work' ? WORK_TIME : timerType === 'shortBreak' ? SHORT_BREAK : LONG_BREAK);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = timerType === 'work' ? ((WORK_TIME - timeLeft) / WORK_TIME) * 100
    : timerType === 'shortBreak' ? ((SHORT_BREAK - timeLeft) / SHORT_BREAK) * 100
    : ((LONG_BREAK - timeLeft) / LONG_BREAK) * 100;

  return (
    <div className="max-w-sm mx-auto">
      <div className="bg-white/[0.03] rounded-xl border border-white/[0.08] p-6">
        <div className="flex gap-1 p-1 bg-white/[0.04] rounded-lg mb-6">
          {[
            { type: 'work' as TimerType, label: 'Focus', icon: Brain },
            { type: 'shortBreak' as TimerType, label: 'Short', icon: Coffee },
            { type: 'longBreak' as TimerType, label: 'Long', icon: Coffee },
          ].map(tab => (
            <button key={tab.type}
              onClick={() => { setTimerType(tab.type); setIsRunning(false); setTimeLeft(tab.type === 'work' ? WORK_TIME : tab.type === 'shortBreak' ? SHORT_BREAK : LONG_BREAK); }}
              className={`flex-1 py-2 rounded-md text-xs font-medium transition-all ${timerType === tab.type
                ? 'bg-white/[0.1] text-white shadow-sm'
                : 'text-white/40 hover:text-white/60'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-center mb-6">
          <div className="relative w-44 h-44 mx-auto mb-4">
            <svg className="w-44 h-44 -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="6" className="text-white/[0.06]" />
              <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 80}`}
                strokeDashoffset={`${2 * Math.PI * 80 * (1 - progress / 100)}`}
                strokeLinecap="round" className="text-white transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-mono text-white">{formatTime(timeLeft)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button onClick={() => setIsRunning(!isRunning)}
              className="p-3 bg-white/[0.1] hover:bg-white/[0.15] text-white rounded-full transition-all">
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button onClick={reset}
              className="p-3 bg-white/[0.04] hover:bg-white/[0.08] text-white/60 rounded-full transition-all">
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        <div className="p-3 bg-white/[0.04] rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/40">Sessions completed</span>
            <span className="font-medium text-white">{sessions}</span>
          </div>
          <div className="flex gap-1 mt-2">
            {Array.from({ length: SESSIONS_BEFORE_LONG }).map((_, i) => (
              <div key={i} className={`flex-1 h-1.5 rounded-full ${i < (sessions % SESSIONS_BEFORE_LONG) ? 'bg-white' : 'bg-white/[0.08]'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}