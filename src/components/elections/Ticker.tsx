// @ts-nocheck
import { useState, useEffect } from 'react';
import { fetchTickerUpdates } from '../../data/elections';

export default function Ticker() {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    fetchTickerUpdates().then(setUpdates);
  }, []);

  return (
    <div className="h-[36px] bg-[#0f0f0f] overflow-hidden flex items-center">
      <div className="flex animate-scroll whitespace-nowrap">
        {[...updates, ...updates].map((u, i) => (
          <span key={`${u.id}-${i}`} className="mx-6 text-sm text-white font-mono">
            {u.text}
            <span className="text-[#e8a838] ml-2">→</span>
            <span className="text-[#666] ml-1">{u.time}</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
