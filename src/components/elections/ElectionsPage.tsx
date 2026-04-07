// @ts-nocheck
import { useState, useEffect, useMemo } from 'react';
import { fetchRaces, fetchSeatCounts, RACE_RATINGS, RACE_TYPES } from '../../data/elections';
import Ticker from './Ticker';
import Filters from './Filters';
import USMap from './USMap';
import RaceCard from './RaceCard';
import RaceDetail from './RaceDetail';

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

  const handleStateClick = (stateName) => {
    setSelectedState(selectedState === stateName ? null : stateName);
  };

  const handleRaceClick = async (id) => {
    const race = await fetchRaces().then(all => all.find(r => r.id === id));
    setSelectedRace(race);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#F5F0E8] font-mono">Loading election data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#F5F0E8]">
      <Ticker />

      {/* Header */}
      <header className="border-b border-[#222222] px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-heading text-3xl font-semibold">2026 Election Tracker</h1>
              <p className="text-[#8C8882] font-mono text-sm mt-1">Real-time race ratings and polling data</p>
            </div>
            <a href="/" className="font-heading text-lg font-semibold text-[#F5F0E8] hover:text-[#E8A020] transition-colors">
              cl1nical
            </a>
          </div>

          {/* Seat Count Tracker */}
          <div className="flex items-center gap-6 mb-4 p-4 bg-[#111111] border border-[#222222] rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-[#3b82f6]">{seatCounts.dem}</div>
              <div className="text-xs font-mono text-[#8C8882]">Democrat</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-[#d97706]">{seatCounts.toss}</div>
              <div className="text-xs font-mono text-[#8C8882]">Toss-up</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-[#ef4444]">{seatCounts.rep}</div>
              <div className="text-xs font-mono text-[#8C8882]">Republican</div>
            </div>
            <div className="ml-auto text-xs font-mono text-[#555]">
              Senate: {seatCounts.dem + seatCounts.rep + seatCounts.toss} seats
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2">
            {[
              { key: 'map', label: 'Interactive Map' },
              { key: 'races', label: 'All Races' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setSelectedState(null); }}
                className={`px-4 py-2 text-sm font-mono rounded-lg transition-colors ${
                  activeTab === tab.key
                    ? 'bg-[#E8A020] text-[#0a0a0a]'
                    : 'bg-[#111111] text-[#8C8882] hover:text-[#F5F0E8]'
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
              <div className="bg-[#111111] border border-[#222222] rounded-xl p-4">
                <USMap onStateClick={handleStateClick} selectedState={selectedState} />
                {selectedState && (
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-mono text-[#8C8882]">
                      Showing: {selectedState}
                    </span>
                    <button
                      onClick={() => setSelectedState(null)}
                      className="text-xs font-mono text-[#E8A020] hover:text-[#d4911a]"
                    >
                      Clear filter
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-mono text-[#8C8882] uppercase">
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
                  <h3 className="text-sm font-mono text-[#8C8882] uppercase mb-4">{type} ({typeRaces.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
    </div>
  );
}
