// @ts-nocheck
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { RACE_RATINGS, PARTIES } from '../../data/elections';

export default function RaceDetail({ race, onClose }) {
  if (!race) return null;
  const rating = RACE_RATINGS[race.rating];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div
        className="bg-white border border-[#e2e2e2] rounded-[2px] p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#0f0f0f]">
              {race.district || race.state} {race.type}
            </h2>
            <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: rating.bg + '20', color: rating.color }}>
              {rating.label}
            </span>
          </div>
          <button onClick={onClose} className="text-[#666] hover:text-[#0f0f0f] text-2xl leading-none">&times;</button>
        </div>

        <div className="space-y-4 mb-6">
          {race.candidates.map((c, i) => {
            const party = PARTIES[c.party];
            const trendData = c.trend.map((v, idx) => ({ idx, value: v }));
            return (
              <div key={i} className="p-4 bg-[#f8f8f8] rounded-[2px]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: party.color }} />
                    <span className="text-sm font-semibold text-[#0f0f0f]">{c.name}</span>
                    <span className="text-xs text-[#666]">({party.label})</span>
                  </div>
                  <span className="text-lg font-mono font-bold text-[#0f0f0f]" style={{ fontVariantNumeric: 'tabular-nums' }}>{c.polling}%</span>
                </div>
                <div className="h-12 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <Line type="monotone" dataKey="value" stroke={party.color} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-xs text-[#999] font-mono">
          Last updated: {new Date(race.lastUpdated).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
