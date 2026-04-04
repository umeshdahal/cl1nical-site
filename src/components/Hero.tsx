import { motion, useMotionValue, useSpring } from "framer-motion";
import { Code2, Cpu, FlaskConical, ShieldCheck, Terminal, Zap, Activity } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";

export default function Hero() {
  const [user, setUser] = useState<any>(null);
  const [typedText, setTypedText] = useState("");
  const fullText = "INITIALIZING NEURAL INTERFACE...";
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleProfileClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    window.location.href = session ? '/profile' : '/login';
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex items-center justify-center bg-[#050505] overflow-hidden cursor-crosshair selection:bg-cyan-500/30"
    >
      {/* Dynamic Spotlight */}
      <motion.div
        style={{ left: springX, top: springY, translateX: "-50%", translateY: "-50%" }}
        className="pointer-events-none absolute z-0 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-cyan-500/20 via-purple-500/10 to-transparent blur-[100px]"
      />

      {/* Perspective Grid */}
      <div className="absolute inset-0 z-0 opacity-20" style={{ perspective: "1000px" }}>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [transform:rotateX(60deg)_scale(2)] origin-top" />
      </div>

      {/* CRT Scanline Overlay */}
      <div className="pointer-events-none absolute inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%]" />

      {/* HUD Corners */}
      <div className="absolute top-6 left-6 z-40 flex flex-col gap-2">
        <div className="h-12 w-12 border-l-2 border-t-2 border-cyan-500/50" />
        <span className="font-mono text-[10px] text-cyan-500/70 tracking-widest">SYS.ONLINE</span>
      </div>
      <div className="absolute top-6 right-6 z-40 flex flex-col items-end gap-2">
        <div className="h-12 w-12 border-r-2 border-t-2 border-cyan-500/50" />
        <span className="font-mono text-[10px] text-cyan-500/70 tracking-widest">V.9.0.4</span>
      </div>
      <div className="absolute bottom-6 left-6 z-40 flex flex-col gap-2">
        <div className="h-12 w-12 border-l-2 border-b-2 border-cyan-500/50" />
        <span className="font-mono text-[10px] text-cyan-500/70 tracking-widest">LAT: 34.0522 N</span>
      </div>
      <div className="absolute bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <div className="h-12 w-12 border-r-2 border-b-2 border-cyan-500/50" />
        <span className="font-mono text-[10px] text-cyan-500/70 tracking-widest">LNG: 118.2437 W</span>
      </div>

      {/* Auth Button */}
      <div className="absolute top-8 right-1/2 translate-x-1/2 z-50 md:right-8 md:translate-x-0">
        <button onClick={handleProfileClick} className="group relative flex items-center gap-3 px-5 py-2.5 rounded-sm border border-cyan-500/30 bg-black/40 backdrop-blur-md hover:border-cyan-400 hover:bg-cyan-950/30 transition-all duration-300 cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          {user ? (
            <>
              <span className="font-mono text-[10px] text-cyan-300 tracking-widest uppercase">
                ID: {user.email.split('@')[0]}
              </span>
              <div className="w-6 h-6 rounded-sm bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-[10px] font-bold text-cyan-300">
                {user.email.charAt(0).toUpperCase()}
              </div>
            </>
          ) : (
            <>
              <span className="font-mono text-[10px] text-gray-400 tracking-widest uppercase">AUTH_REQ</span>
              <ShieldCheck size={14} className="text-cyan-400" />
            </>
          )}
        </button>
      </div>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-6xl px-6 text-center flex flex-col items-center"
      >
        {/* Glitch Title */}
        <div className="relative mb-6">
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-500/50 italic select-none">
            WELCOME
          </h1>
          <h1 className="absolute top-0 left-0 w-full text-6xl md:text-9xl font-black tracking-tighter text-cyan-500/30 italic animate-pulse select-none" aria-hidden="true">
            WELCOME
          </h1>
        </div>

        {/* Typing Subtitle */}
        <div className="h-6 mb-12 flex items-center justify-center gap-2">
          <Terminal size={14} className="text-cyan-400" />
          <span className="font-mono text-sm md:text-base text-cyan-300/80 tracking-widest">
            {typedText}<span className="animate-pulse">_</span>
          </span>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
          {[
            { href: "/projects", label: "PROJECTS", icon: <Code2 size={18} />, desc: "DEPLOYED_ARCHIVES" },
            { href: "/lab", label: "LAB", icon: <FlaskConical size={18} />, desc: "EXPERIMENTAL_ZONE" },
            { href: "/stack", label: "STACK", icon: <Cpu size={18} />, desc: "TECH_SPECIFICATIONS" }
          ].map((item, i) => (
            <motion.a 
              key={item.href}
              href={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + (i * 0.1) }}
              whileHover={{ scale: 1.02, borderColor: "rgba(34, 211, 238, 0.6)" }}
              className="group relative flex flex-col items-center justify-center gap-3 p-6 rounded-sm border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-cyan-950/20 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:border-cyan-500/50 group-hover:text-cyan-400 transition-colors">
                {item.icon}
              </div>
              <span className="text-lg font-bold tracking-widest text-white group-hover:text-cyan-300 transition-colors">{item.label}</span>
              <span className="text-[10px] font-mono text-gray-500 group-hover:text-cyan-500/70 transition-colors">{item.desc}</span>
            </motion.a>
          ))}
        </div>

        {/* Status Bar */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 font-mono text-[10px] text-gray-600 tracking-widest">
          <span className="flex items-center gap-2"><Activity size={12} className="text-green-500 animate-pulse" /> SYSTEM_OPTIMAL</span>
          <span className="flex items-center gap-2"><Zap size={12} className="text-yellow-500" /> POWER_100%</span>
          <span>UPTIME: 99.99%</span>
        </div>
      </motion.div>
    </div>
  );
}
