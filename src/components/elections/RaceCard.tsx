// @ts-nocheck
import { RACE_RATINGS, PARTIES } from '../../data/elections';

export default function RaceCard({ race, onClick }) {
  const rating = RACE_RATINGS[race.rating];
  const leader = race.candidates.reduce((a, b) => (a.polling > b.polling ? a : b));
  const leaderParty = PARTIES[leader.party];

  return (
    <button
      onClick={() => onClick(race.id)}
      className="w-full text-left p-4 bg-[#111111] border border-[#222222] rounded-xl hover:border-[#333333] transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#8C8882] uppercase">{race.type}</span>
          <span className="text-xs font-mono text-[#555]">•</span>
          <span className="text-sm font-semibold text-[#F5F0E8]">
            {race.district || race.state}
          </span>
        </div>
        <span
          className="text-xs font-mono px-2 py-1 rounded-full"
          style={{ backgroundColor: rating.bg + '33', color: rating.color }}
        >
          {rating.label}
        </span>
      </div>

      <div className="space-y-2">
        {race.candidates.map((c, i) => {
          const party = PARTIES[c.party];
          const isLeader = c.name === leader.name;
          return (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: party.color }} />
                <span className={`text-sm ${isLeader ? 'text-[#F5F0E8] font-medium' : 'text-[#8C8882]'}`}>
                  {c.name}
                </span>
              </div>
              <span className={`text-sm font-mono ${isLeader ? 'text-[#F5F0E8]' : 'text-[#666]'}`}>
                {c.polling}%
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-[#222222] flex items-center justify-between">
        <span className="text-xs text-[#666] font-mono">
          Leader: <span style={{ color: leaderParty.color }}>{leader.name}</span>
        </span>
        <span className="text-xs text-[#555] font-mono">
          {new Date(race.lastUpdated).toLocaleDateString()}
        </span>
      </div>
    </button>
  );
}
