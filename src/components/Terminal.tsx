import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const COMMANDS = {
  help: "Available commands: [help, clear, projects, whoami, stack, social]",
  whoami: "User: cl1nical | Status: Lead Architect | Location: encrypted",
  stack: "Astro 5.0, Tailwind 4, React 19, Framer Motion, Docker, Linux",
  projects: "Redirecting to /projects...",
  social: "Github: github.com/cl1nical | Twitter: @cl1nical_dev",
};

export default function TerminalUI() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>(["System initialized...", "Type 'help' to begin."]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.toLowerCase().trim();
    let response = `Command not found: ${cmd}`;

    if (cmd === 'clear') {
      setHistory([]);
    } else if (cmd === 'projects') {
      window.location.href = '/projects';
    } else if (COMMANDS[cmd as keyof typeof COMMANDS]) {
      response = COMMANDS[cmd as keyof typeof COMMANDS];
      setHistory([...history, `> ${input}`, response]);
    } else if (cmd !== '') {
      setHistory([...history, `> ${input}`, response]);
    }
    
    setInput('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[500px] bg-black/90 border border-green-500/30 rounded-lg shadow-[0_0_40px_rgba(34,197,94,0.1)] flex flex-col overflow-hidden font-mono relative">
      {/* Scanline Effect Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-20"></div>

      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/10 text-xs text-gray-500">
        <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
        </div>
        <span className="ml-2">cl1nical@lab:~</span>
      </div>

      {/* Terminal Body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-2 scrollbar-hide text-green-500 text-sm md:text-base selection:bg-green-500 selection:text-black">
        {history.map((line, i) => (
          <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={i} className="leading-relaxed">
            {line}
          </motion.p>
        ))}
        
        <form onSubmit={handleCommand} className="flex items-center gap-2">
          <span className="text-green-500 font-bold">$</span>
          <input
            autoFocus
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-green-400 focus:ring-0 p-0"
            spellCheck="false"
          />
        </form>
      </div>
    </div>
  );
}