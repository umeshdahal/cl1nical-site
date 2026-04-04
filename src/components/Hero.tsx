import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { Terminal, Cpu, Activity, Zap, Globe, Shield, ChevronRight, X, Command, Radio, Wifi, MousePointer2 } from "lucide-react";

// --- Interactive Particle Network ---
const ParticleNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; vx: number; vy: number; size: number; color: string }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 150);
      const colors = ['rgba(0, 255, 255, 0.6)', 'rgba(168, 85, 247, 0.6)', 'rgba(255, 255, 255, 0.4)'];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 2 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          p.x -= dx * 0.03;
          p.y -= dy * 0.03;
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (d < 140) {
            ctx.strokeStyle = `rgba(0, 255, 255, ${0.15 * (1 - d / 140)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    });
    
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

// --- 3D Tilt Holo Card ---
const HoloCard = ({ title, icon, desc, delay }: { title: string; icon: React.ReactNode; desc: string; delay: number }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative p-6 rounded-xl border border-cyan-500/20 bg-black/40 backdrop-blur-md overflow-hidden cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      
      <div className="relative z-10 flex flex-col items-center text-center gap-3">
        <div className="p-3 rounded-lg bg-white/5 border border-white/10 group-hover:border-cyan-400/50 group-hover:text-cyan-300 transition-all duration-300 shadow-[0_0_15px_rgba(0,255,255,0.1)]">
          {icon}
        </div>
        <h3 className="text-lg font-bold tracking-widest text-white group-hover:text-cyan-200 transition-colors">{title}</h3>
        <p className="text-xs font-mono text-gray-500 group-hover:text-cyan-400/70 transition-colors">{desc}</p>
      </div>
    </motion.div>
  );
};

// --- Interactive Terminal ---
const InteractiveTerminal = () => {
  const [history, setHistory] = useState<{ type: 'input' | 'output'; text: string }[]>([
    { type: 'output', text: 'NEXUS_OS v4.2.0 [BOOT SEQUENCE COMPLETE]' },
    { type: 'output', text: 'Type "help" for available commands.' }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    const newHistory = [...history, { type: 'input' as const, text: input }];

    let response = '';
    switch (cmd) {
      case 'help':
        response = 'AVAILABLE COMMANDS: help, status, clear, matrix, ping, whoami, reboot';
        break;
      case 'status':
        response = 'SYSTEM: OPTIMAL | CORE TEMP: 34°C | MEMORY: 12.4GB/32GB | UPTIME: 99.99%';
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'matrix':
        response = 'FOLLOWING THE WHITE RABBIT... 🐇';
        break;
      case 'ping':
        response = 'PONG! Latency: 12ms';
        break;
      case 'whoami':
        response = 'GUEST_USER [ACCESS LEVEL: 1]';
        break;
      case 'reboot':
        response = 'REINITIALIZING CORE SYSTEMS...';
        setTimeout(() => window.location.reload(), 1500);
        break;
      default:
        response = `COMMAND NOT RECOGNIZED: "${cmd}"`;
    }

    setHistory([...newHistory, { type: 'output', text: response }]);
    setInput('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 rounded-lg border border-cyan-500/20 bg-black/60 backdrop-blur-md overflow-hidden font-mono text-xs">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Terminal size={12} className="text-cyan-400" />
          <span className="text-gray-400 tracking-widest">TERMINAL_ACCESS</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
        </div>
      </div>
      <div ref={scrollRef} className="h-32 p-4 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-transparent">
        {history.map((line, i) => (
          <div key={i} className={`${line.type === 'input' ? 'text-cyan-300' : 'text-gray-400'}`}>
            {line.type === 'input' ? '> ' : ''}{line.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleCommand} className="flex items-center px-4 py-2 border-t border-white/10 bg-black/40">
        <span className="text-cyan-400 mr-2">{'>'}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none text-white placeholder-gray-600"
          placeholder="Enter command..."
          autoFocus
        />
      </form>
    </div>
  );
};

// --- Main Hero Component ---
export default function Hero() {
  const [booted, setBooted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const springX = useSpring(0, { stiffness: 150, damping: 20 });
  const springY = useSpring(0, { stiffness: 150, damping: 20 });

  useEffect(() => {
    const timer = setTimeout(() => setBooted(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    springX.set(x);
    springY.set(y);
  }, [springX, springY]);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#030305] overflow-hidden text-white selection:bg-cyan-500/30"
    >
      {/* Boot Sequence Overlay */}
      <AnimatePresence>
        {!booted && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center font-mono text-cyan-400"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "300px" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-1 bg-cyan-500 mb-4"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs tracking-[0.3em]"
            >
              INITIALIZING NEXUS CORE...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Layers */}
      <ParticleNetwork />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030305_70%)]" />
      <div className="absolute inset-0 z-0 opacity-10 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      {/* Mouse Spotlight */}
      <motion.div
        style={{ left: springX, top: springY, translateX: "-50%", translateY: "-50%" }}
        className="pointer-events-none absolute z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-cyan-500/15 via-purple-500/10 to-transparent blur-[80px]"
      />

      {/* CRT Scanlines & Vignette */}
      <div className="pointer-events-none absolute inset-0 z-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[size:100%_4px,3px_100%]" />
      <div className="pointer-events-none absolute inset-0 z-40 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.6)_100%)]" />

      {/* HUD Elements */}
      <div className="absolute top-6 left-6 z-30 flex flex-col gap-2">
        <div className="h-10 w-10 border-l-2 border-t-2 border-cyan-500/40" />
        <span className="font-mono text-[10px] text-cyan-500/60 tracking-widest">SYS.ONLINE</span>
      </div>
      <div className="absolute top-6 right-6 z-30 flex flex-col items-end gap-2">
        <div className="h-10 w-10 border-r-2 border-t-2 border-cyan-500/40" />
        <span className="font-mono text-[10px] text-cyan-500/60 tracking-widest">V.4.2.0</span>
      </div>
      <div className="absolute bottom-6 left-6 z-30 flex flex-col gap-2">
        <div className="h-10 w-10 border-l-2 border-b-2 border-cyan-500/40" />
        <span className="font-mono text-[10px] text-cyan-500/60 tracking-widest">LAT: 34.0522 N</span>
      </div>
      <div className="absolute bottom-6 right-6 z-30 flex flex-col items-end gap-2">
        <div className="h-10 w-10 border-r-2 border-b-2 border-cyan-500/40" />
        <span className="font-mono text-[10px] text-cyan-500/60 tracking-widest">LNG: 118.2437 W</span>
      </div>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={booted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-20 w-full max-w-6xl px-6 flex flex-col items-center text-center"
      >
        {/* Central Holographic Core */}
        <div className="relative mb-8 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-48 h-48 rounded-full border border-dashed border-cyan-500/30"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute w-36 h-36 rounded-full border border-dotted border-purple-500/40"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 blur-md"
          />
          <div className="relative z-10 w-20 h-20 rounded-full bg-black border-2 border-cyan-400/50 flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.3)]">
            <Radio size={28} className="text-cyan-300 animate-pulse" />
          </div>
        </div>

        {/* Glitch Title */}
        <div className="relative mb-4">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-500/50 select-none">
            NEXUS
          </h1>
          <h1 className="absolute top-0 left-0 w-full text-6xl md:text-8xl font-black tracking-tighter text-cyan-500/20 select-none animate-pulse" aria-hidden="true">
            NEXUS
          </h1>
        </div>
        <p className="font-mono text-sm md:text-base text-cyan-300/70 tracking-[0.2em] mb-10">
          NEXT-GEN DIGITAL INTERFACE
        </p>

        {/* Holo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl mb-10">
          <HoloCard title="CORE" icon={<Cpu size={20} />} desc="PROCESSING_ENGINE" delay={0.2} />
          <HoloCard title="NETWORK" icon={<Globe size={20} />} desc="GLOBAL_CONNECTIVITY" delay={0.3} />
          <HoloCard title="SECURITY" icon={<Shield size={20} />} desc="ENCRYPTION_LAYER" delay={0.4} />
        </div>

        {/* Interactive Terminal */}
        <InteractiveTerminal />

        {/* Status Footer */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 font-mono text-[10px] text-gray-600 tracking-widest">
          <span className="flex items-center gap-2"><Activity size={12} className="text-green-500 animate-pulse" /> SYSTEM_OPTIMAL</span>
          <span className="flex items-center gap-2"><Zap size={12} className="text-yellow-500" /> POWER_100%</span>
          <span className="flex items-center gap-2"><Wifi size={12} className="text-cyan-500" /> SIGNAL_STRONG</span>
          <span className="flex items-center gap-2"><MousePointer2 size={12} className="text-purple-500" /> TRACKING_ACTIVE</span>
        </div>
      </motion.div>
    </div>
  );
}
