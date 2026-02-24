import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

const COMMANDS = {
  help: "AVAILABLE: [help, clear, projects, login, profile, whoami, stack, ping, exit]",
  whoami: "IDENT: cl1nical | ROLE: Architect | STATUS: Online",
  stack: "Astro 5.0 // Tailwind 4 // React 19 // Supabase // Framer",
  ping: "PONG! Response time: 09ms",
  projects: "Opening project database...",
  login: "Redirecting to authentication portal...",
  profile: "Accessing user identity settings...",
  exit: "Terminating secure session..."
};

export default function TerminalUI() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>(["Connection established...", "Terminal v4.0.1 Ready.", "Type 'help' for available directives."]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [history]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.toLowerCase().trim();
    
    if (cmd === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    const navCommands = ['login', 'projects', 'profile'];
    if (navCommands.includes(cmd)) {
      setHistory([...history, `> ${input}`, COMMANDS[cmd as keyof typeof COMMANDS]]);
      setTimeout(() => window.location.href = `/${cmd}`, 800);
      setInput('');
      return;
    }

    if (cmd === 'exit') {
      setHistory([...history, `> ${input}`, COMMANDS.exit]);
      await supabase.auth.signOut();
      setTimeout(() => window.location.href = '/', 800);
      setInput('');
      return;
    }

    if (COMMANDS[cmd as keyof typeof COMMANDS]) {
      setHistory([...history, `> ${input}`, COMMANDS[cmd as keyof typeof COMMANDS]]);
    } else if (cmd !== '') {
      setHistory([...history, `> ${input}`, `ERR: Command '${cmd}' unrecognized.`]);
    }
    
    setInput('');
  };

  return (
    <div className="w-full h-[500px] bg-black/80 border border-green-500/20 rounded-xl flex flex-col overflow-hidden font-mono shadow-[0_0_60px_rgba(0,0,0,1)] relative z-10">
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
        <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
        </div>
        <span className="text-[10px] text-gray-600 tracking-widest uppercase">Console_Output</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-2 scrollbar-hide">
        {history.map((line, i) => (
          <motion.p 
            initial={{ opacity: 0, x: -5 }} 
            animate={{ opacity: 1, x: 0 }} 
            key={i} 
            className={`${line.startsWith('>') ? 'text-white' : 'text-green-500/80'} text-sm leading-relaxed terminal-glow`}
          >
            {line}
          </motion.p>
        ))}
        
        <form onSubmit={handleCommand} className="flex items-center gap-2 mt-4">
          <span className="text-green-500 font-bold">$</span>
          <input
            autoFocus
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-green-400 focus:ring-0 p-0 text-sm"
            spellCheck="false"
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  );
}
