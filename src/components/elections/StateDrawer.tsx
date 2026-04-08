import { PARTIES, RACE_RATINGS } from '../../data/elections';
import { getStateSummary, getTrackedStateRaces } from '../../lib/election-states';

type StateDrawerProps = {
  stateAbbr: string;
  onClose: () => void;
  onViewRace: (id: string) => void;
};

export default function StateDrawer({ stateAbbr, onClose, onViewRace }: StateDrawerProps) {
  const summary = getStateSummary(stateAbbr);
  const stateRaces = getTrackedStateRaces(stateAbbr);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[1px]" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto border-l border-slate-200 bg-white shadow-2xl" style={{ animation: 'slideIn 180ms ease-out' }}>
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{summary.abbr}</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">{summary.name}</h2>
              <span className="mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: `${summary.fill}20`, color: summary.fill }}>
                {summary.ratingLabel}
              </span>
            </div>
            <button onClick={onClose} className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-500 transition hover:border-slate-300 hover:text-slate-900">
              Close
            </button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Electoral Votes</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{summary.electoralVotes}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Map Lean</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{summary.ratingLabel}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Tracked Races</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{stateRaces.length}</p>
            </div>
          </div>

          <p className="mt-6 text-sm leading-6 text-slate-600">{summary.headline}</p>

          {stateRaces.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
              No statewide races are tracked for this state in the current dataset. The map color falls back to a partisan lean placeholder so every state still renders with meaningful data.
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {stateRaces.map((race) => {
                const rating = RACE_RATINGS[race.rating];
                const leader = race.candidates.reduce((currentLeader, candidate) => (
                  candidate.polling > currentLeader.polling ? candidate : currentLeader
                ));

                return (
                  <article key={race.id} className="rounded-3xl border border-slate-200 p-5 transition hover:border-slate-300 hover:bg-slate-50">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{race.type}</p>
                        <h3 className="mt-2 text-lg font-semibold text-slate-950">{race.district || race.state}</h3>
                      </div>
                      <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ backgroundColor: `${rating.bg}20`, color: rating.color }}>
                        {rating.label}
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      {race.candidates.map((candidate) => {
                        const party = PARTIES[candidate.party];
                        const previous = candidate.trend?.[candidate.trend.length - 2];
                        const delta = typeof previous === 'number' ? candidate.polling - previous : 0;
                        const isLeader = leader.name === candidate.name;

                        return (
                          <div key={candidate.name} className="flex items-center justify-between gap-4">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: party.color }}></span>
                                <span className={`truncate text-sm ${isLeader ? 'font-semibold text-slate-950' : 'text-slate-700'}`}>{candidate.name}</span>
                              </div>
                              <p className="mt-1 text-xs text-slate-400">
                                {party.label}
                                {delta !== 0 && ` | ${delta > 0 ? '+' : ''}${delta.toFixed(1)} trend`}
                              </p>
                            </div>
                            <span className="text-sm font-semibold tabular-nums text-slate-950">{candidate.polling}%</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                      <span className="text-xs text-slate-400">{new Date(race.lastUpdated).toLocaleString()}</span>
                      <button onClick={() => onViewRace(race.id)} className="text-sm font-semibold text-sky-700 transition hover:text-slate-950">
                        View race
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
