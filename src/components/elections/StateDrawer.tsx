// @ts-nocheck
import { RACE_RATINGS, PARTIES, races } from '../../data/elections';

export default function StateDrawer({ stateAbbr, onClose, onViewRace }) {
  const stateName = Object.entries({
    AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
    CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
    HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
    KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
    MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
    MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
    NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina',
    ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania',
    RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee',
    TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington',
    WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming', DC: 'District of Columbia',
  }).find(([k]) => k === stateAbbr)?.[1] || stateAbbr;

  const stateRaces = races.filter(r => r.state === stateName);
  const overallRating = stateRaces.length > 0
    ? stateRaces.reduce((a, b) => {
        const w = { SAFE_D: 7, LIKELY_D: 6, LEAN_D: 5, TOSS_UP: 4, LEAN_R: 3, LIKELY_R: 2, SAFE_R: 1 };
        return (w[a.rating] || 4) > (w[b.rating] || 4) ? a : b;
      }).rating
    : null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 w-[380px] bg-white border-l border-[#e2e2e2] z-50 overflow-y-auto" style={{ animation: 'slideIn 200ms ease-out' }}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#0f0f0f]">{stateName}</h2>
              {overallRating && (
                <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: RACE_RATINGS[overallRating].bg + '20', color: RACE_RATINGS[overallRating].color }}>
                  {RACE_RATINGS[overallRating].label}
                </span>
              )}
            </div>
            <button onClick={onClose} className="text-[#666] hover:text-[#0f0f0f] text-2xl leading-none">&times;</button>
          </div>

          {stateRaces.length === 0 ? (
            <p className="text-sm text-[#666]">No races tracked for this state.</p>
          ) : (
            <div className="space-y-3">
              {stateRaces.map(race => {
                const rating = RACE_RATINGS[race.rating];
                const leader = race.candidates.reduce((a, b) => a.polling > b.polling ? a : b);
                return (
                  <div key={race.id} className="border border-[#e2e2e2] rounded p-4 hover:bg-[#f8f8f8] transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-[#666] uppercase tracking-wide">{race.type}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: rating.bg + '20', color: rating.color }}>
                        {rating.label}
                      </span>
                    </div>
                    {race.candidates.map((c, i) => {
                      const party = PARTIES[c.party];
                      const isLeader = c.name === leader.name;
                      const prevPoll = c.trend?.[c.trend.length - 2];
                      const trend = prevPoll ? c.polling - prevPoll : 0;
                      return (
                        <div key={i} className="flex items-center justify-between py-1">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: party.color }} />
                            <span className={`text-sm ${isLeader ? 'font-semibold text-[#0f0f0f]' : 'text-[#666]'}`}>{c.name}</span>
                            {trend !== 0 && (
                              <span className={`text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {trend > 0 ? '↑' : '↓'}{Math.abs(trend).toFixed(1)}
                              </span>
                            )}
                          </div>
                          <span className="text-sm font-mono font-bold tabular-nums" style={{ fontVariantNumeric: 'tabular-nums' }}>
                            {c.polling}%
                          </span>
                        </div>
                      );
                    })}
                    <div className="mt-3 pt-2 border-t border-[#e2e2e2] flex items-center justify-between">
                      <span className="text-xs text-[#999]">
                        {new Date(race.lastUpdated).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => onViewRace(race.id)}
                        className="text-xs font-semibold text-[#1a4a8a] hover:text-[#0f0f0f] transition-colors"
                      >
                        View Full Race →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
