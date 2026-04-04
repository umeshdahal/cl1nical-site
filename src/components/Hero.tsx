import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, Eye,
  Copy, Check, Loader2, Database, Globe, Shield,
  ArrowRight, Terminal, Zap, Activity, Wifi, Cpu,
  FileSpreadsheet, Image, Mic, BarChart3, Users, Search
} from "lucide-react";
import { API_CONFIG } from '../lib/supabase';

// --- Interactive Particle Network (Optimized) ---
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
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 100);
      const colors = ['rgba(0, 255, 255, 0.4)', 'rgba(168, 85, 247, 0.4)', 'rgba(255, 255, 255, 0.2)'];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 1.5 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) { p.x -= dx * 0.02; p.y -= dy * 0.02; }

        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (d < 120) {
            ctx.strokeStyle = `rgba(0, 255, 255, ${0.1 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => { mouseRef.current.x = e.clientX; mouseRef.current.y = e.clientY; });
    resize(); draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animationFrameId); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

// Fix: Explicit color mapping to prevent Tailwind JIT from dropping dynamic classes
const TAB_COLORS = {
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/40', shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.1)]' },
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/40', shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.1)]' },
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40', shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.1)]' },
} as const;

// Fix: Replace `any` with strict interfaces
interface EarningItem { type: string; date: string; title: string; link: string; }
interface ReepEntity { reep_id: string; name: string; type: string; dob: string; nationality: string; position: string; ids: Record<string, string>; }

// --- Module 2: EARNINGS (Earnings Feed API) ---
const EarningsModule = () => {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<EarningItem[]>([]);

  const handleScan = async () => {
    if (!ticker) return;
    setLoading(true);
    
    if (!API_CONFIG.EARNINGS_FEED_API_KEY) {
      setTimeout(() => {
        setData([
          { type: '10-K', date: '2024-02-15', title: 'Annual Report', link: '#' },
          { type: '10-Q', date: '2024-05-01', title: 'Quarterly Report', link: '#' },
          { type: '8-K', date: '2024-06-12', title: 'Executive Change', link: '#' },
          { type: 'INSIDER', date: '2024-06-10', title: 'CEO Purchase: 50,000 shares', link: '#' },
        ]);
        setLoading(false);
      }, 1200);
      return;
    }

    try {
      const res = await fetch(`https://api.earningsfeed.com/v1/ticker/${ticker}`, {
        headers: { 'Authorization': `Bearer ${API_CONFIG.EARNINGS_FEED_API_KEY}` }
      });
      if (!res.ok) throw new Error('Fetch failed');
      const json = await res.json();
      setData(json.results || []);
    } catch (err) {
      console.error('Earnings Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="flex gap-3">
        <input 
          value={ticker} onChange={e => setTicker(e.target.value.toUpperCase())}
          placeholder="ENTER TICKER (e.g. AAPL)"
          className="flex-1 bg-black/40 border border-cyan-500/30 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
        />
        <button 
          onClick={handleScan} disabled={loading}
          className="px-6 bg-purple-500/10 border border-purple-500/40 hover:bg-purple-500/20 text-purple-300 font-mono text-sm tracking-widest rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <><Search size={16} /> SCAN</>}
        </button>
      </div>

      <div className="space-y-3">
        {data.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-600 font-mono text-xs tracking-widest">AWAITING TICKER INPUT...</div>
        )}
        {data.map((item, i) => (
          <motion.div 
            key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between p-4 bg-black/30 border border-white/10 rounded-lg hover:border-purple-500/40 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <span className={`px-2 py-1 text-[10px] font-mono rounded ${item.type === 'INSIDER' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-cyan-500/20 text-cyan-300'}`}>
                {item.type}
              </span>
              <div>
                <div className="text-sm text-white font-medium">{item.title}</div>
                <div className="text-[10px] text-gray-500 font-mono">{item.date}</div>
              </div>
            </div>
            <ArrowRight size={16} className="text-gray-600 group-hover:text-purple-400 transition-colors" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- Module 3: VISION (OCR.space API) ---
const VisionModule = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleExtract = async () => {
    if (!imageUrl) return;
    setLoading(true); setExtractedText('');
    
    if (!API_CONFIG.OCR_SPACE_API_KEY) {
      setTimeout(() => {
        setExtractedText(`INVOICE #9942\nDATE: 2024-06-15\nAMOUNT: $1,240.50\nVENDOR: NEXUS SYSTEMS LTD.\nSTATUS: PAID\n\n[OCR CONFIDENCE: 98.4%]`);
        setLoading(false);
      }, 1500);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('url', imageUrl);
      formData.append('apikey', API_CONFIG.OCR_SPACE_API_KEY);
      formData.append('language', 'eng');

      const res = await fetch('https://api.ocr.space/parse/image', { method: 'POST', body: formData });
      const json = await res.json();
      if (json.OCRExitCode === 1) {
        setExtractedText(json.ParsedResults[0].ParsedText);
      } else {
        throw new Error(json.ErrorMessage || 'OCR Failed');
      }
    } catch (err) {
      console.error('OCR Error:', err);
      setExtractedText('ERROR EXTRACTING TEXT. CHECK API KEY OR URL.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="flex gap-3">
        <input 
          value={imageUrl} onChange={e => setImageUrl(e.target.value)}
          placeholder="IMAGE URL OR PASTE LINK"
          className="flex-1 bg-black/40 border border-cyan-500/30 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
        />
        <button 
          onClick={handleExtract} disabled={loading}
          className="px-6 bg-blue-500/10 border border-blue-500/40 hover:bg-blue-500/20 text-blue-300 font-mono text-sm tracking-widest rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <><Eye size={16} /> EXTRACT</>}
        </button>
      </div>

      <div className="relative">
        <div className="absolute top-3 right-3 flex gap-2">
          <button onClick={copyToClipboard} className="p-2 bg-white/5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
        <div className="min-h-[160px] bg-black/40 border border-white/10 rounded-lg p-4 font-mono text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
          {extractedText || <span className="text-gray-600">EXTRACTED TEXT WILL APPEAR HERE...</span>}
        </div>
      </div>
    </div>
  );
};

// --- Module 4: REEP (Football Register API) ---
const ReepModule = () => {
  const [query, setQuery] = useState('');
  const [provider, setProvider] = useState('transfermarkt');
  const [loading, setLoading] = useState(false);
  const [entity, setEntity] = useState<ReepEntity | null>(null);

  const handleResolve = async () => {
    if (!query) return;
    setLoading(true); setEntity(null);
    
    if (!API_CONFIG.RAPIDAPI_KEY) {
      setTimeout(() => {
        setEntity({
          reep_id: 'reep_p2804f5db',
          name: 'Cole Palmer',
          type: 'player',
          dob: '2002-05-06',
          nationality: 'England',
          position: 'Attacking Midfielder',
          ids: { transfermarkt: '568177', fbref: 'dc7f8a28', sofascore: '982780', opta: '7cwgrmorsb42qaj5vrhp8fhzp', premier_league: '49293' }
        });
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      const res = await fetch(`https://the-reep-register.p.rapidapi.com/resolve?q=${encodeURIComponent(query)}&provider=${provider}`, {
        headers: { 'X-RapidAPI-Key': API_CONFIG.RAPIDAPI_KEY, 'X-RapidAPI-Host': 'the-reep-register.p.rapidapi.com' }
      });
      if (!res.ok) throw new Error('Resolve failed');
      const json = await res.json();
      setEntity(json);
    } catch (err) {
      console.error('REEP Resolve Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input 
          value={query} onChange={e => setQuery(e.target.value)}
          placeholder="NAME OR ID"
          className="md:col-span-2 bg-black/40 border border-cyan-500/30 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
        />
        <select 
          value={provider} onChange={e => setProvider(e.target.value)}
          className="bg-black/40 border border-cyan-500/30 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors appearance-none"
        >
          <option value="transfermarkt">Transfermarkt</option>
          <option value="fbref">FBref</option>
          <option value="sofascore">Sofascore</option>
          <option value="opta">Opta</option>
        </select>
      </div>
      <button 
        onClick={handleResolve} disabled={loading}
        className="w-full py-4 bg-emerald-500/10 border border-emerald-500/40 hover:bg-emerald-500/20 text-emerald-300 font-mono text-sm tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <><Database size={16} /> RESOLVE ENTITY</>}
      </button>

      <AnimatePresence>
        {entity && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-black/40 border border-emerald-500/30 rounded-xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{entity.name}</h3>
                <p className="text-xs font-mono text-emerald-400 mt-1">{entity.reep_id} • {entity.type.toUpperCase()}</p>
              </div>
              <div className="text-right text-xs font-mono text-gray-400">
                <div>{entity.dob}</div>
                <div>{entity.nationality}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t border-white/10">
              {Object.entries(entity.ids).map(([key, val]) => (
                <div key={key} className="p-2 bg-white/5 rounded border border-white/10">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">{key.replace('_', ' ')}</div>
                  <div className="text-sm text-white font-mono truncate">{val}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Hero Component ---
export default function Hero() {
  const [activeTab, setActiveTab] = useState('earnings');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: 'earnings', label: 'EARNINGS', icon: <TrendingUp size={14} />, color: 'purple' as const },
    { id: 'vision', label: 'VISION', icon: <Eye size={14} />, color: 'blue' as const },
    { id: 'reep', label: 'REEP', icon: <Globe size={14} />, color: 'emerald' as const },
  ];

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#030305] overflow-hidden text-white selection:bg-cyan-500/30"
    >
      <ParticleNetwork />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030305_70%)]" />
      <div className="absolute inset-0 z-0 opacity-10 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <motion.div
        style={{ left: mousePos.x, top: mousePos.y, translateX: "-50%", translateY: "-50%" }}
        className="pointer-events-none absolute z-10 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-transparent blur-[80px]"
      />

      <div className="pointer-events-none absolute inset-0 z-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[size:100%_4px,3px_100%]" />

      {/* HUD Corners */}
      <div className="absolute top-6 left-6 z-30 flex flex-col gap-2">
        <div className="h-10 w-10 border-l-2 border-t-2 border-cyan-500/40" />
        <span className="font-mono text-[10px] text-cyan-500/60 tracking-widest">SYS.ONLINE</span>
      </div>
      <div className="absolute top-6 right-6 z-30 flex flex-col items-end gap-2">
        <div className="h-10 w-10 border-r-2 border-t-2 border-cyan-500/40" />
        <span className="font-mono text-[10px] text-cyan-500/60 tracking-widest">V.5.0.0</span>
      </div>

      {/* Main Dashboard */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 w-full max-w-5xl px-6 flex flex-col items-center"
      >
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-500/50 select-none">
            NEXUS CONTROL
          </h1>
          <p className="font-mono text-xs md:text-sm text-cyan-300/60 tracking-[0.3em] mt-2">MULTI-MODAL API INTERFACE</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 p-1.5 bg-black/40 border border-white/10 rounded-xl backdrop-blur-md">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono tracking-widest transition-all ${
                activeTab === tab.id 
                  ? `${TAB_COLORS[tab.color].bg} ${TAB_COLORS[tab.color].text} ${TAB_COLORS[tab.color].border} ${TAB_COLORS[tab.color].shadow}` 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Active Module Panel */}
        <div className="w-full p-6 md:p-8 bg-black/30 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'earnings' && <EarningsModule />}
              {activeTab === 'vision' && <VisionModule />}
              {activeTab === 'reep' && <ReepModule />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Status Footer */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 font-mono text-[10px] text-gray-600 tracking-widest">
          <span className="flex items-center gap-2"><Activity size={12} className="text-green-500 animate-pulse" /> SYSTEM_OPTIMAL</span>
          <span className="flex items-center gap-2"><Zap size={12} className="text-yellow-500" /> POWER_100%</span>
          <span className="flex items-center gap-2"><Wifi size={12} className="text-cyan-500" /> SIGNAL_STRONG</span>
          <span className="flex items-center gap-2"><Cpu size={12} className="text-purple-500" /> CORE_ACTIVE</span>
        </div>
      </motion.div>
    </div>
  );
}
