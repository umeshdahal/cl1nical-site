import { motion } from "framer-motion";
import { Terminal, Zap, Shield, ChevronRight } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#030303] overflow-hidden selection:bg-purple-500/30">
      
      {/* 1. Animated Cyber Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-700" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 mix-blend-overlay" />
      </div>

      {/* 2. Content Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-5xl px-6"
      >
        <div className="flex flex-col items-center text-center space-y-8">
          
          {/* Status Badge */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] font-mono tracking-[0.2em] text-purple-400 uppercase"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            Connection Established // 2026
          </motion.div>

          {/* Main Title with Hover Interaction */}
          <motion.h1 
            className="text-7xl md:text-9xl font-black tracking-tighter text-white"
            style={{ textShadow: "0 0 40px rgba(168, 85, 247, 0.4)" }}
          >
            CL1NICAL
          </motion.h1>

          <p className="max-w-xl text-gray-400 text-lg md:text-xl font-light leading-relaxed">
            Architecting <span className="text-white font-medium">high-performance</span> digital systems with a focus on privacy, speed, and open-source infrastructure.
          </p>

          {/* Interactive Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-12">
            {[
              { icon: <Terminal className="w-5 h-5"/>, label: "Self-Hosted", color: "hover:border-purple-500/50" },
              { icon: <Zap className="w-5 h-5"/>, label: "Ultra-Fast", color: "hover:border-blue-500/50" },
              { icon: <Shield className="w-5 h-5"/>, label: "Hardened", color: "hover:border-emerald-500/50" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.08)" }}
                className={`flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm transition-colors cursor-default ${item.color}`}
              >
                <div className="flex items-center gap-3 text-gray-300">
                  {item.icon}
                  <span className="text-sm font-semibold uppercase tracking-wider">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </motion.div>
            ))}
          </div>

          {/* Main CTA */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-8 px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-purple-100 transition-all flex items-center gap-2"
          >
            Initialize Project <ChevronRight size={18} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}