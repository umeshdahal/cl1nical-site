// @ts-nocheck
import { useEffect, useMemo, useState } from 'react';
import { fetchRaceById, fetchRaces, fetchSeatCounts, RACE_TYPES } from '../../data/elections';
import { getStateSummary } from '../../lib/election-states';
import Ticker from './Ticker';
import Filters from './Filters';
import USMap from './USMap';
import RaceCard from './RaceCard';
import RaceDetail from './RaceDetail';
import StateDrawer from './StateDrawer';

export default function ElectionsPage() {
  const [races, setRaces] = useState([]);
  const [seatCounts, setSeatCounts] = useState({ dem: 0, rep: 0, toss: 0 });
  const [selectedRace, setSelectedRace] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [activeTab, setActiveTab] = useState('map');
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchRaces(), fetchSeatCounts()]).then(([nextRaces, nextSeatCounts]) => {
      setRaces(nextRaces);
      setSeatCounts(nextSeatCounts);
      setLoading(false);
    });
  }, []);

  const filteredRaces = useMemo(() => {
    let result = [...races];

    if (filters.type) result = result.filter((race) => race.type === filters.type);
    if (filters.rating) result = result.filter((race) => race.rating === filters.rating);
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter((race) =>
        race.state.toLowerCase().includes(query) ||
        race.district?.toLowerCase().includes(query) ||
        race.candidates.some((candidate) => candidate.name.toLowerCase().includes(query))
      );
    }
    if (selectedState) result = result.filter((race) => race.stateAbbr === selectedState);

    return result;
  }, [races, filters, selectedState]);

  const racesByType = useMemo(() => {
    const grouped = {};
    filteredRaces.forEach((race) => {
      if (!grouped[race.type]) grouped[race.type] = [];
      grouped[race.type].push(race);
    });
    return grouped;
  }, [filteredRaces]);

  const handleStateClick = (abbr) => {
    setSelectedState((current) => current === abbr ? null : abbr);
  };

  const handleRaceClick = async (id) => {
    const race = await fetchRaceById(id);
    setSelectedRace(race);
  };

  const totalSeats = seatCounts.dem + seatCounts.rep + seatCounts.toss;
  const demPct = totalSeats > 0 ? (seatCounts.dem / totalSeats) * 100 : 0;
  const tossPct = totalSeats > 0 ? (seatCounts.toss / totalSeats) * 100 : 0;
  const repPct = totalSeats > 0 ? (seatCounts.rep / totalSeats) * 100 : 0;
  const selectedStateSummary = selectedState ? getStateSummary(selectedState) : null;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100">
        <div className="text-sm font-mono text-slate-600">Loading election data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 text-slate-950" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <Ticker />

      <header className="border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">2026 Election Tracker</h1>
              <p className="mt-0.5 text-sm text-slate-500">Responsive state map, live-style race ratings, and drill-down panels.</p>
            </div>
            <a href="/dashboard" className="text-sm font-semibold text-slate-900 transition hover:text-slate-600">
              Dashboard
            </a>
          </div>

          <div className="mb-4">
            <div className="mb-2 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#1a4a8a]">DEM</span>
                <span className="text-sm font-mono font-bold tabular-nums">{seatCounts.dem}</span>
              </div>
              <div className="flex h-3 flex-1 overflow-hidden rounded-[2px] bg-slate-200">
                <div className="h-full bg-[#1a4a8a] transition-all" style={{ width: `${demPct}%` }} />
                <div className="h-full bg-[#e8a838] transition-all" style={{ width: `${tossPct}%` }} />
                <div className="h-full bg-[#8a1a1a] transition-all" style={{ width: `${repPct}%` }} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-bold tabular-nums">{seatCounts.rep}</span>
                <span className="text-xs font-semibold text-[#8a1a1a]">REP</span>
              </div>
              <div className="text-xs font-mono text-slate-500">51 to control</div>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-[1px] bg-[#1a4a8a]" /> Democrat</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-[1px] bg-[#e8a838]" /> Toss-up</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-[1px] bg-[#8a1a1a]" /> Republican</span>
            </div>
          </div>

          <div className="flex gap-1">
            {[
              { key: 'map', label: 'Map' },
              { key: 'races', label: 'All Races' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setSelectedState(null);
                }}
                className={`rounded-[2px] px-4 py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === tab.key
                    ? 'bg-slate-950 text-white'
                    : 'border border-slate-200 bg-white text-slate-500 hover:border-slate-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-6">
        <Filters filters={filters} setFilters={setFilters} />

        {activeTab === 'map' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                <USMap onStateClick={handleStateClick} selectedState={selectedState} />
                {selectedStateSummary && (
                  <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
                    <div>
                      <span className="text-sm font-semibold text-slate-950">{selectedStateSummary.name}</span>
                      <p className="mt-0.5 text-xs text-slate-500">{selectedStateSummary.headline}</p>
                    </div>
                    <button onClick={() => setSelectedState(null)} className="text-xs font-semibold text-sky-700 transition hover:text-slate-950">
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {selectedStateSummary ? `${selectedStateSummary.name} Races` : 'Toss-up Races'}
              </h3>
              {(selectedStateSummary
                ? filteredRaces.filter((race) => race.stateAbbr === selectedState)
                : filteredRaces.filter((race) => race.rating === 'TOSS_UP')
              ).map((race) => (
                <RaceCard key={race.id} race={race} onClick={handleRaceClick} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'races' && (
          <div className="space-y-8">
            {RACE_TYPES.map((type) => {
              const typeRaces = racesByType[type];
              if (!typeRaces || typeRaces.length === 0) return null;

              return (
                <div key={type}>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{type} ({typeRaces.length})</h3>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {typeRaces.map((race) => (
                      <RaceCard key={race.id} race={race} onClick={handleRaceClick} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {selectedRace && <RaceDetail race={selectedRace} onClose={() => setSelectedRace(null)} />}
      {selectedState && <StateDrawer stateAbbr={selectedState} onClose={() => setSelectedState(null)} onViewRace={handleRaceClick} />}
    </div>
  );
}
