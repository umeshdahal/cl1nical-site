import { motion } from "framer-motion";
import { Code2, Cpu, FlaskConical, ShieldCheck, User } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Hero() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleProfileClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    // Force a fresh session check on click
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      window.location.href = '/profile';
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#030303] overflow-hidden">
      
      {/* Top Navigation Auth Button */}
      <div className="absolute top-8 right-8 z-50">
        <button 
          onClick={handleProfileClick}
          className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur hover:bg-white/10 hover:border-purple-500/50 transition-all group cursor-pointer"
        >
          {user ? (
            <>
              <span className="text-[10px] font-mono text-gray-400 group-hover:text-purple-400 transition-colors uppercase tracking-widest">
                ID: {user.email.split('@')[0]}
              </span>
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-xs shadow-[0_0_15px_rgba(147,51,234,0.4)]">
                {user.email.charAt(0).toUpperCase()}
              </div>
            </>
          ) : (
            <>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Guest_Session</span>
              <ShieldCheck size={18} className="text-purple-500" />
            </>
          )}
        </button>
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-5xl px-6 text-center"
      >
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white mb-12 italic">
          CL1NICAL
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <motion.a href="/projects" whileHover={{ scale: 1.05 }} className="px-8 py-4 bg-white text-black font-bold rounded-xl flex items-center gap-2 shadow-xl">
            PROJECTS <Code2 size={18} />
          </motion.a>
          <motion.a href="/lab" whileHover={{ scale: 1.05 }} className="px-8 py-4 border border-white/20 text-white font-bold rounded-xl flex items-center gap-2">
            LAB <FlaskConical size={18} />
          </motion.a>
          <motion.a href="/stack" whileHover={{ scale: 1.05 }} className="px-8 py-4 border border-white/20 text-white font-bold rounded-xl flex items-center gap-2">
            STACK <Cpu size={18} />
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
}