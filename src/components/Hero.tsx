import { motion } from "framer-motion";
import { Code2, Cpu, FlaskConical, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Hero() {
  const [user, setUser] = useState<any>(null);
  
  // Game State
  const [dice, setDice] = useState(1);
  const [rolls, setRolls] = useState(0);
  const [sixes, setSixes] = useState(0);
  const [inHome, setInHome] = useState(0); // Counter for how many are in home

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleRoll = () => {
    let newValue: number;
    const chance = Math.random();

    // Probability Logic
    if (sixes === 0 && rolls < 5) {
      // 60% chance for first 6
      newValue = chance < 0.6 ? 6 : Math.floor(Math.random() * 5) + 1;
    } else if (sixes === 1) {
      // 40% chance for second 6
      newValue = chance < 0.4 ? 6 : Math.floor(Math.random() * 5) + 1;
    } else {
      // Random after two 6s
      newValue = Math.floor(Math.random() * 6) + 1;
    }

    if (newValue === 6) setSixes(s => s + 1);
    setRolls(r => r + 1);
    setDice(newValue);
  };

  const handleProfileClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    window.location.href = session ? '/profile' : '/login';
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#030303] overflow-hidden">
      
      {/* DICE & HOME COUNTER - Top Center */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">
        <div className="px-4 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-gray-400 uppercase tracking-widest">
          Home_Status: <span className="text-white">{inHome}</span>
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={handleRoll}
          className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer"
        >
          <span className="text-3xl font-black text-black">{dice}</span>
        </motion.button>
      </div>

      {/* Auth Button (Stayed Top Right) */}
      <div className="absolute top-8 right-8 z-50">
        <button onClick={handleProfileClick} className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur hover:bg-white/10 hover:border-purple-500/50 transition-all group cursor-pointer">
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

      {/* Background Orbs with Swapped Colors (Red Left, Yellow Right) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-yellow-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-5xl px-6 text-center"
      >
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white mb-12 italic">
          chup lag muji
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