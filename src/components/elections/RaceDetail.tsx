// @ts-nocheck
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { RACE_RATINGS, PARTIES } from '../../data/elections';

export default function RaceDetail({ race, onClose }) {
  if (!race) return null;
  const rating = RACE_RATINGS[race.rating];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[#111111] border border-[#222222] rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-heading font-semibold text-[#F5F0E8]">
              {race.district || race.state} {race.type}
            </h2>
            <span
              className="text-xs font-mono px-2 py-1 rounded-full inline-block mt-1"
              style={{ backgroundColor: rating.bg + '33', color: rating.color }}
            >
              {rating.label}
            </span>
          </div>
          <button onClick={onClose} className="text-[#8C8882] hover:text-[#F5F0E8] text-2xl leading-none">&times;</button>
        </div>

        <div className="space-y-4 mb-6">
          {race.candidates.map((c, i) => {
            const party = PARTIES[c.party];
            const trendData = c.trend.map((v, idx) => ({ idx, value: v }));
            return (
              <div key={i} className="p-4 bg-[#1a1a1a] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: party.color }} />
                    <span className="text-sm font-medium text-[#F5F0E8]">{c.name}</span>
                    <span className="text-xs font-mono text-[#666]">({party.label})</span>
                  </div>
                  <span className="text-lg font-mono font-bold text-[#F5F0E8]">{c.polling}%</span>
                </div>
                <div className="h-12 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={party.color}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-xs text-[#555] font-mono">
          Last updated: {new Date(race.lastUpdated).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
