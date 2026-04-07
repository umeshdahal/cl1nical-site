// @ts-nocheck
import { useState, useEffect } from 'react';
import { fetchTickerUpdates } from '../../data/elections';

export default function Ticker() {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    fetchTickerUpdates().then(setUpdates);
  }, []);

  return (
    <div className="bg-[#111111] border-b border-[#222222] overflow-hidden py-2">
      <div className="flex animate-scroll whitespace-nowrap">
        {[...updates, ...updates].map((u, i) => (
          <span key={`${u.id}-${i}`} className="mx-6 text-sm font-mono text-[#8C8882]">
            {u.text}
            <span className="text-[#555] ml-2">{u.time}</span>
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
