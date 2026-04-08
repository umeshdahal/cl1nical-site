// @ts-nocheck
import { RACE_RATINGS, PARTIES } from '../../data/elections';

export default function RaceCard({ race, onClick }) {
  const rating = RACE_RATINGS[race.rating];
  const leader = race.candidates.reduce((a, b) => (a.polling > b.polling ? a : b));

  return (
    <button
      onClick={() => onClick(race.id)}
      className="w-full text-left p-4 bg-white border border-[#e2e2e2] rounded-[2px] hover:bg-[#f8f8f8] hover:border-[#ccc] transition-all cursor-pointer"
      style={{ borderLeft: `3px solid ${rating.bg}` }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-[#666] uppercase tracking-wide">{race.type}</span>
        <span className="text-xs font-semibold" style={{ color: rating.color }}>{rating.label}</span>
      </div>
      <div className="text-sm font-bold text-[#0f0f0f] mb-2">
        {race.district || race.state}
      </div>
      <div className="space-y-1">
        {race.candidates.map((c, i) => {
          const party = PARTIES[c.party];
          const isLeader = c.name === leader.name;
          return (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: party.color }} />
                <span className={`text-sm ${isLeader ? 'font-semibold text-[#0f0f0f]' : 'text-[#666]'}`}>
                  {c.name}
                </span>
              </div>
              <span className="text-lg font-mono font-bold tabular-nums" style={{ fontVariantNumeric: 'tabular-nums', color: isLeader ? '#0f0f0f' : '#999' }}>
                {c.polling}%
              </span>
            </div>
          );
        })}
      </div>
    </button>
  );
}
