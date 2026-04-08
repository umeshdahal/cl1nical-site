// @ts-nocheck
import { useState, useEffect, useMemo } from 'react';
import { fetchRaces, fetchSeatCounts, RACE_RATINGS, RACE_TYPES } from '../../data/elections';
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
    Promise.all([fetchRaces(), fetchSeatCounts()]).then(([r, s]) => {
      setRaces(r);
      setSeatCounts(s);
      setLoading(false);
    });
  }, []);

  const filteredRaces = useMemo(() => {
    let result = [...races];
    if (filters.type) result = result.filter(r => r.type === filters.type);
    if (filters.rating) result = result.filter(r => r.rating === filters.rating);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(r =>
        r.state.toLowerCase().includes(q) ||
        r.district?.toLowerCase().includes(q) ||
        r.candidates.some(c => c.name.toLowerCase().includes(q))
      );
    }
    if (selectedState) result = result.filter(r => r.state === selectedState);
    return result;
  }, [races, filters, selectedState]);

  const racesByType = useMemo(() => {
    const grouped = {};
    filteredRaces.forEach(r => {
      if (!grouped[r.type]) grouped[r.type] = [];
      grouped[r.type].push(r);
    });
    return grouped;
  }, [filteredRaces]);

  const handleStateClick = (abbr) => {
    setSelectedState(selectedState === abbr ? null : abbr);
  };

  const handleRaceClick = async (id) => {
    const race = await fetchRaces().then(all => all.find(r => r.id === id));
    setSelectedRace(race);
  };

  const totalSeats = seatCounts.dem + seatCounts.rep + seatCounts.toss;
  const demPct = totalSeats > 0 ? (seatCounts.dem / totalSeats) * 100 : 0;
  const repPct = totalSeats > 0 ? (seatCounts.rep / totalSeats) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-[#0f0f0f] font-mono text-sm">Loading election data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#0f0f0f]" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <Ticker />

      {/* Header */}
      <header className="border-b border-[#e2e2e2] px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">2026 Election Tracker</h1>
              <p className="text-sm text-[#666] mt-0.5">Real-time race ratings and polling data</p>
            </div>
            <a href="/" className="text-sm font-semibold text-[#0f0f0f] hover:text-[#666] transition-colors">
              cl1nical
            </a>
          </div>

          {/* Seat Count Bar */}
          <div className="mb-4">
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#1a4a8a]">DEM</span>
                <span className="text-sm font-mono font-bold tabular-nums">{seatCounts.dem}</span>
              </div>
              <div className="flex-1 h-3 bg-[#e2e2e2] rounded-[2px] overflow-hidden flex">
                <div className="h-full bg-[#1a4a8a] transition-all" style={{ width: `${demPct}%` }} />
                <div className="h-full bg-[#e8a838] transition-all" style={{ width: `${(seatCounts.toss / totalSeats) * 100}%` }} />
                <div className="h-full bg-[#8a1a1a] transition-all" style={{ width: `${repPct}%` }} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-bold tabular-nums">{seatCounts.rep}</span>
                <span className="text-xs font-semibold text-[#8a1a1a]">REP</span>
              </div>
              <div className="text-xs text-[#999] font-mono">
                51 to control
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#666]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#1a4a8a] rounded-[1px]" /> Democrat</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#e8a838] rounded-[1px]" /> Toss-up</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#8a1a1a] rounded-[1px]" /> Republican</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1">
            {[
              { key: 'map', label: 'Map' },
              { key: 'races', label: 'All Races' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setSelectedState(null); }}
                className={`px-4 py-1.5 text-xs font-semibold rounded-[2px] transition-colors ${
                  activeTab === tab.key
                    ? 'bg-[#0f0f0f] text-white'
                    : 'bg-white text-[#666] border border-[#e2e2e2] hover:border-[#999]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        <Filters filters={filters} setFilters={setFilters} />

        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white border border-[#e2e2e2] rounded-[2px] p-4">
                <USMap onStateClick={handleStateClick} selectedState={selectedState} />
                {selectedState && (
                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#e2e2e2]">
                    <span className="text-sm font-semibold text-[#0f0f0f]">
                      {selectedState}
                    </span>
                    <button
                      onClick={() => setSelectedState(null)}
                      className="text-xs font-semibold text-[#1a4a8a] hover:text-[#0f0f0f] transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-[#666] uppercase tracking-wide">
                {selectedState ? `${selectedState} Races` : 'Toss-up Races'}
              </h3>
              {(selectedState
                ? filteredRaces.filter(r => r.state === selectedState)
                : filteredRaces.filter(r => r.rating === 'TOSS_UP')
              ).map(race => (
                <RaceCard key={race.id} race={race} onClick={handleRaceClick} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'races' && (
          <div className="space-y-8">
            {RACE_TYPES.map(type => {
              const typeRaces = racesByType[type];
              if (!typeRaces || typeRaces.length === 0) return null;
              return (
                <div key={type}>
                  <h3 className="text-xs font-semibold text-[#666] uppercase tracking-wide mb-3">{type} ({typeRaces.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {typeRaces.map(race => (
                      <RaceCard key={race.id} race={race} onClick={handleRaceClick} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Race Detail Modal */}
      {selectedRace && (
        <RaceDetail race={selectedRace} onClose={() => setSelectedRace(null)} />
      )}

      {/* State Drawer */}
      {selectedState && (
        <StateDrawer
          stateAbbr={selectedState}
          onClose={() => setSelectedState(null)}
          onViewRace={handleRaceClick}
        />
      )}
    </div>
  );
}
