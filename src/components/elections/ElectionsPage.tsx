// @ts-nocheck
import { useEffect, useMemo, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { ArrowRight, ChevronLeft, ChevronRight, Filter, Layers3, Lock, MapPinned, RotateCcw, Search, Share2, Sparkles, Target } from 'lucide-react';
import USMap from './USMap';
import CandidateDrawer from './CandidateDrawer';
import {
  getAllRaces,
  getCountyDashboardData,
  getDistrictOverlayData,
  getMapHeadline,
  getOverlayFillForState,
  getPartyAccent,
  getRaceCardModel,
  getRaceGroups,
  getScenarioSummary,
  getScenarioTimeline,
  HISTORY_LABELS,
  OVERLAY_LABELS,
} from '../../lib/election-dashboard';
import { PARTIES } from '../../data/elections';
import { STATES_BY_ABBR } from '../../lib/election-states';

const overlayModes = ['Presidential', 'Senate', 'Governor', 'House', 'Generic'];
const historyModes = ['current', '2020', '2022', 'change', 'swing'];
const mapModes = [
  { key: 'states', label: 'States' },
  { key: 'counties', label: 'Counties' },
  { key: 'districts', label: 'Districts' },
];
const laneOrder = [
  ['tossups', 'Toss-up lane'],
  ['senate', 'Senate battlegrounds'],
  ['governor', 'Governor contests'],
  ['house', 'House battlefield'],
  ['battlegrounds', 'Presidential battlegrounds'],
];

function TopTicker({ items }) {
  return (
    <div className="overflow-hidden border-b border-white/6 bg-black/20">
      <div className="flex whitespace-nowrap py-3 [animation:tracker-ticker_40s_linear_infinite]">
        {[...items, ...items].map((item, index) => (
          <div key={`${item.id}-${index}`} className="mx-5 flex items-center gap-3 text-sm text-white/62">
            <span className="text-white">{item.text.replace(/â†’/g, '->')}</span>
            <span className="rounded-full bg-white/6 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white/42">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilterChip({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
        active ? 'bg-white text-slate-950' : 'border border-white/10 bg-white/6 text-white/64 hover:bg-white/10 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

function RaceLane({ title, races, onRaceOpen, onCandidateOpen, historyMode }) {
  if (!races.length) return null;
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/44">{title}</h3>
        <span className="text-xs uppercase tracking-[0.18em] text-white/30">{races.length} races</span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-3 [scrollbar-width:none]">
        {races.map((race) => {
          const model = getRaceCardModel(race, historyMode);
          return (
            <article key={race.id} className="min-w-[320px] max-w-[320px] rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.04))] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] transition hover:-translate-y-1 hover:border-white/18">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/38">{race.type}</p>
                  <h4 className="mt-2 font-heading text-2xl tracking-[-0.04em] text-white">{race.district || race.state}</h4>
                </div>
                <span className="rounded-full px-3 py-1 text-[11px] font-semibold" style={{ backgroundColor: `${model.rating.bg}22`, color: model.rating.color }}>
                  {model.rating.label}
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {race.candidates.slice(0, 2).map((candidate) => {
                  const party = PARTIES[candidate.party];
                  return (
                    <button key={candidate.name} onClick={() => onCandidateOpen(candidate.name, race.stateAbbr, race.type)} className="flex w-full items-center justify-between text-left">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-semibold text-white" style={{ background: `linear-gradient(135deg, ${party.color}, rgba(255,255,255,0.12))` }}>
                          {candidate.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{candidate.name}</p>
                          <p className="text-[11px] uppercase tracking-[0.16em] text-white/38">{party.label}</p>
                        </div>
                      </div>
                      <span className="text-xl font-semibold tabular-nums text-white">{candidate.polling}%</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5">
                <div className="flex h-2 overflow-hidden rounded-full bg-white/8">
                  <div className="h-full" style={{ width: `${race.candidates[0].polling}%`, backgroundColor: getPartyAccent(race.candidates[0].party) }} />
                  <div className="h-full" style={{ width: `${race.candidates[1].polling}%`, backgroundColor: getPartyAccent(race.candidates[1].party) }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-white/36">
                  <span>{model.leader.leader?.name ?? 'Lead pending'}</span>
                  <span>{model.leader.margin >= 0 ? '+' : ''}{model.leader.margin.toFixed(1)} margin</span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">Shift vs previous</p>
                  <p className={`mt-2 text-sm font-semibold ${model.delta >= 0 ? 'text-[#83a8ff]' : 'text-[#ef9898]'}`}>
                    {model.delta >= 0 ? 'D +' : 'R +'}{Math.abs(model.delta).toFixed(1)}
                  </p>
                </div>
                <button onClick={() => onRaceOpen(race)} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 transition hover:bg-white/10 hover:text-white">
                  Details
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function RaceDetailDrawer({ race, onClose, onCandidateOpen, historyMode }) {
  if (!race) return null;
  const model = getRaceCardModel(race, historyMode);
  const trendRows = race.candidates.slice(0, 2).map((candidate, index) => ({
    color: getPartyAccent(candidate.party),
    name: candidate.name,
    dataKey: `series${index}`,
  }));
  const trendData = race.candidates[0].trend.map((_, index) => ({
    label: `W${index + 1}`,
    series0: race.candidates[0].trend[index],
    series1: race.candidates[1]?.trend[index],
  }));

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-950/55 backdrop-blur-sm" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-[65] w-full max-w-2xl overflow-y-auto border-l border-white/10 bg-[#09111c]/96 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">{race.type}</p>
            <h2 className="mt-2 font-heading text-4xl tracking-[-0.05em] text-white">{race.district || race.state}</h2>
            <p className="mt-3 text-sm text-white/58">{new Date(race.lastUpdated).toLocaleString()}</p>
          </div>
          <button onClick={onClose} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white">
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Forecast</p>
            <p className="mt-3 text-lg text-white">{model.rating.label}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Current margin</p>
            <p className="mt-3 text-lg text-white">{model.leader.margin >= 0 ? '+' : ''}{model.leader.margin.toFixed(1)}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Historical mode</p>
            <p className="mt-3 text-lg text-white">{HISTORY_LABELS[historyMode]}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            {race.candidates.map((candidate) => {
              const party = PARTIES[candidate.party];
              return (
                <button key={candidate.name} onClick={() => onCandidateOpen(candidate.name, race.stateAbbr, race.type)} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4 text-left transition hover:border-white/20">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-semibold text-white" style={{ backgroundColor: party.color }}>
                        {candidate.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{candidate.name}</p>
                        <p className="text-[11px] uppercase tracking-[0.16em] text-white/38">{party.label}</p>
                      </div>
                    </div>
                    <span className="text-2xl font-semibold tabular-nums text-white">{candidate.polling}%</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Polling trend</p>
                <p className="mt-2 text-lg text-white">Momentum comparison</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <XAxis dataKey="label" stroke="rgba(255,255,255,0.18)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.18)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
                  <Tooltip contentStyle={{ background: '#0b1220', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                  {trendRows.map((row) => (
                    <Area key={row.name} type="monotone" dataKey={row.dataKey} stroke={row.color} fill={row.color} fillOpacity={0.12} strokeWidth={2.2} />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default function ElectionsPage() {
  const [races, setRaces] = useState([]);
  const [overlayMode, setOverlayMode] = useState('Presidential');
  const [historyMode, setHistoryMode] = useState('current');
  const [mapLevel, setMapLevel] = useState('states');
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedRace, setSelectedRace] = useState(null);
  const [candidateDrawer, setCandidateDrawer] = useState(null);
  const [filters, setFilters] = useState({ search: '' });
  const [scenarioLocks, setScenarioLocks] = useState({});
  const [seatTicker, setSeatTicker] = useState([
    { id: 1, text: 'Pennsylvania Senate edge narrows as suburban vote shifts', time: '4m' },
    { id: 2, text: 'Georgia governor scenario band tightens to under one point', time: '8m' },
    { id: 3, text: 'Arizona counties show new movement in the outer ring', time: '14m' },
    { id: 4, text: 'House battlefield expands as TX-23 and NY-17 drift back to toss-up', time: '22m' },
  ]);

  useEffect(() => {
    setRaces(getAllRaces());
  }, []);

  const groupedRaces = useMemo(() => getRaceGroups(races, { overlayMode, search: filters.search }), [races, overlayMode, filters.search]);
  const countyData = useMemo(() => (selectedState ? getCountyDashboardData(selectedState, overlayMode, historyMode) : []), [selectedState, overlayMode, historyMode]);
  const districtData = useMemo(() => (selectedState ? getDistrictOverlayData(selectedState, historyMode) : []), [selectedState, historyMode]);
  const scenarioSummary = useMemo(() => getScenarioSummary(overlayMode, scenarioLocks), [overlayMode, scenarioLocks]);
  const scenarioTimeline = useMemo(() => getScenarioTimeline(scenarioLocks), [scenarioLocks]);
  const mapHeadline = useMemo(() => getMapHeadline(selectedState ?? 'PA', overlayMode, historyMode, scenarioLocks), [selectedState, overlayMode, historyMode, scenarioLocks]);
  const analyticsBars = scenarioSummary.tipping.map((race) => {
    const model = getRaceCardModel(race, historyMode);
    return { name: race.district || race.stateAbbr || race.state, margin: Number(Math.abs(model.leader.margin).toFixed(1)), color: model.leader.color };
  });

  const handleStateInteraction = (abbr) => {
    if (!abbr) {
      setSelectedState(null);
      setMapLevel('states');
      setSelectedCounty(null);
      setSelectedDistrict(null);
      return;
    }
    setSelectedState(abbr);
    if (mapLevel === 'states') setMapLevel('counties');
  };

  const toggleScenarioLock = (abbr, party) => {
    setScenarioLocks((current) => ({ ...current, [abbr]: current[abbr] === party ? undefined : party }));
  };

  const applyPreset = (preset) => {
    setScenarioLocks(preset.locks);
  };

  const shareScenario = async () => {
    const payload = new URLSearchParams(Object.entries(scenarioLocks).filter(([, party]) => party));
    const shareUrl = `${window.location.origin}/elections?${payload.toString()}`;
    await navigator.clipboard.writeText(shareUrl);
    setSeatTicker((current) => [{ id: Date.now(), text: 'Scenario link copied to clipboard', time: 'now' }, ...current.slice(0, 3)]);
  };

  const topSummaryCards = [
    { label: 'Dem EV', value: scenarioSummary.electoral.dem, tone: 'text-[#7ca4ff]' },
    { label: 'Rep EV', value: scenarioSummary.electoral.rep, tone: 'text-[#ef9898]' },
    { label: 'Active locks', value: Object.entries(scenarioLocks).filter(([, party]) => party).length, tone: 'text-white' },
    { label: 'Tipping races', value: scenarioSummary.tipping.length, tone: 'text-[#f3c97f]' },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(78,102,187,0.15),_transparent_24%),radial-gradient(circle_at_80%_20%,_rgba(125,152,255,0.08),_transparent_18%),linear-gradient(180deg,#08101b_0%,#0b1220_45%,#09111a_100%)] text-white">
      <TopTicker items={seatTicker} />
      <style>{`@keyframes tracker-ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>

      <header className="sticky top-0 z-30 border-b border-white/6 bg-[#08101b]/82 backdrop-blur-xl">
        <div className="mx-auto max-w-[1380px] px-5 py-5 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/36">Political intelligence dashboard</p>
              <h1 className="mt-3 font-heading text-4xl tracking-[-0.05em] text-white sm:text-5xl">Election tracker</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/58">
                A darker, cleaner election surface with map-first interaction, county drill-downs, district overlays,
                historical comparison, and a live scenario lab built underneath the primary forecast view.
              </p>
            </div>
            <a href="/dashboard" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/74 transition hover:bg-white/10 hover:text-white">
              Back to dashboard
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {topSummaryCards.map((card) => (
              <div key={card.label} className="rounded-[1.6rem] border border-white/10 bg-white/[0.05] p-4 backdrop-blur">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">{card.label}</p>
                <p className={`mt-3 text-3xl font-semibold tabular-nums ${card.tone}`}>{card.value}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1380px] space-y-8 px-5 py-8 sm:px-8">
        <section className="rounded-[2.2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_30px_120px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap gap-2">
                {overlayModes.map((mode) => <FilterChip key={mode} active={overlayMode === mode} onClick={() => setOverlayMode(mode)}>{OVERLAY_LABELS[mode]}</FilterChip>)}
              </div>
              <div className="flex flex-wrap gap-2">
                {historyModes.map((mode) => <FilterChip key={mode} active={historyMode === mode} onClick={() => setHistoryMode(mode)}>{HISTORY_LABELS[mode]}</FilterChip>)}
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/34">{mapHeadline.title}</p>
                    <h2 className="mt-2 font-heading text-3xl tracking-[-0.04em] text-white">{mapHeadline.subtitle}</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {mapModes.map((mode) => (
                      <FilterChip
                        key={mode.key}
                        active={mapLevel === mode.key}
                        onClick={() => {
                          if (mode.key === 'states') {
                            setSelectedState(null);
                            setSelectedCounty(null);
                            setSelectedDistrict(null);
                          } else if (!selectedState) {
                            setSelectedState('PA');
                          }
                          setMapLevel(mode.key);
                        }}
                      >
                        {mode.label}
                      </FilterChip>
                    ))}
                  </div>
                </div>

                <USMap
                  selectedState={selectedState}
                  mapLevel={mapLevel}
                  overlayMode={overlayMode}
                  historyMode={historyMode}
                  scenarioLocks={scenarioLocks}
                  countyData={countyData}
                  districtData={districtData}
                  onStateClick={handleStateInteraction}
                  onCountySelect={setSelectedCounty}
                  onDistrictSelect={setSelectedDistrict}
                  getStateFill={(abbr) => getOverlayFillForState(abbr, overlayMode, historyMode, scenarioLocks)}
                />
              </div>

              <div className="space-y-4">
                <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Live controls</p>
                      <h3 className="mt-2 text-lg text-white">Search and filters</h3>
                    </div>
                    <Filter className="h-4 w-4 text-white/40" />
                  </div>
                  <div className="mt-4 flex items-center gap-3 rounded-full border border-white/10 bg-black/20 px-4 py-3">
                    <Search className="h-4 w-4 text-white/35" />
                    <input value={filters.search} onChange={(event) => setFilters({ search: event.target.value })} placeholder="Search state, race, district, candidate" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30" />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['Toss-up', 'Sun Belt', 'Blue Wall', 'House'].map((chip) => (
                      <span key={chip} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-white/46">{chip}</span>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Tipping-point barometer</p>
                      <h3 className="mt-2 text-lg text-white">Closest races on the board</h3>
                    </div>
                    <Target className="h-4 w-4 text-white/40" />
                  </div>
                  <div className="mt-5 h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsBars}>
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.18)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis stroke="rgba(255,255,255,0.18)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                        <Tooltip contentStyle={{ background: '#0b1220', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                        <Bar dataKey="margin" radius={[8, 8, 0, 0]}>
                          {analyticsBars.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Drill-down signal</p>
                      <h3 className="mt-2 text-lg text-white">Focused geography</h3>
                    </div>
                    <Layers3 className="h-4 w-4 text-white/40" />
                  </div>
                  {selectedCounty ? (
                    <div className="mt-4 space-y-2 text-sm text-white/64">
                      <p className="font-semibold text-white">{selectedCounty.name} County</p>
                      <p>Estimated margin: {selectedCounty.margin >= 0 ? 'D' : 'R'} +{Math.abs(selectedCounty.margin).toFixed(1)}</p>
                      <p>Vote share: D {selectedCounty.voteShare.D}% | R {selectedCounty.voteShare.R}%</p>
                      <p>Previous cycle: {selectedCounty.previous >= 0 ? 'D' : 'R'} +{Math.abs(selectedCounty.previous).toFixed(1)}</p>
                    </div>
                  ) : selectedDistrict ? (
                    <div className="mt-4 space-y-2 text-sm text-white/64">
                      <p className="font-semibold text-white">{selectedDistrict.district}</p>
                      <p>{selectedDistrict.race.candidates[0].name} vs {selectedDistrict.race.candidates[1].name}</p>
                      <p>Forecast margin: {selectedDistrict.margin >= 0 ? 'D' : 'R'} +{Math.abs(selectedDistrict.margin).toFixed(1)}</p>
                    </div>
                  ) : (
                    <p className="mt-4 text-sm leading-6 text-white/56">Select a county or district on the map to open localized comparisons, vote shares, and previous-cycle context.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2.2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Race lanes</p>
              <h2 className="mt-2 font-heading text-3xl tracking-[-0.04em] text-white">Cards and comparisons below the map</h2>
            </div>
            <div className="hidden items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/34 md:flex">
              <ChevronLeft className="h-4 w-4" /> horizontal scroll <ChevronRight className="h-4 w-4" />
            </div>
          </div>
          <div className="sticky top-[150px] z-20 mb-6 flex gap-2 overflow-x-auto rounded-full border border-white/10 bg-[#0b1220]/80 p-2 backdrop-blur [scrollbar-width:none]">
            {laneOrder.map(([key, label]) => (
              <a key={key} href={`#lane-${key}`} className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/52 transition hover:bg-white/8 hover:text-white">{label}</a>
            ))}
          </div>
          <div className="space-y-10">
            {laneOrder.map(([key, label]) => (
              <div key={key} id={`lane-${key}`}>
                <RaceLane title={label} races={groupedRaces[key]} onRaceOpen={setSelectedRace} onCandidateOpen={(candidateName, stateAbbr, raceType) => setCandidateDrawer({ candidateName, stateAbbr, raceType })} historyMode={historyMode} />
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Scenario builder</p>
                <h2 className="mt-2 font-heading text-3xl tracking-[-0.04em] text-white">Interactive outcome lab</h2>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setScenarioLocks({})} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 transition hover:bg-white/10 hover:text-white"><RotateCcw className="h-4 w-4" />Reset</button>
                <button onClick={shareScenario} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 transition hover:bg-white/10 hover:text-white"><Share2 className="h-4 w-4" />Save/share</button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {scenarioSummary.presets.map((preset) => (
                <button key={preset.id} onClick={() => applyPreset(preset)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/64 transition hover:bg-white/10 hover:text-white">{preset.label}</button>
              ))}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {['PA', 'MI', 'WI', 'AZ', 'GA', 'NV', 'NC', 'TX'].map((abbr) => (
                <div key={abbr} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">{abbr}</p>
                      <p className="mt-2 text-sm text-white">{STATES_BY_ABBR[abbr].name}</p>
                    </div>
                    <Lock className="h-4 w-4 text-white/35" />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => toggleScenarioLock(abbr, 'D')} className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${scenarioLocks[abbr] === 'D' ? 'bg-[#3d74f5] text-white' : 'border border-white/10 bg-white/5 text-white/60 hover:bg-white/10'}`}>Lock D</button>
                    <button onClick={() => toggleScenarioLock(abbr, 'R')} className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${scenarioLocks[abbr] === 'R' ? 'bg-[#c95157] text-white' : 'border border-white/10 bg-white/5 text-white/60 hover:bg-white/10'}`}>Lock R</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Scenario history</p>
                  <h2 className="mt-2 font-heading text-2xl tracking-[-0.04em] text-white">Timeline of state flips</h2>
                </div>
                <Sparkles className="h-4 w-4 text-white/35" />
              </div>
              <div className="mt-5 space-y-3">
                {scenarioTimeline.length === 0 ? <p className="text-sm leading-6 text-white/56">No locks yet. Use the scenario builder to pin states for either party and watch chamber control update live.</p> : scenarioTimeline.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{entry.stateAbbr}</p>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">{entry.party === 'D' ? 'Democratic lock' : 'Republican lock'}</p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.18em] text-white/38">{entry.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">National environment</p>
                  <h2 className="mt-2 font-heading text-2xl tracking-[-0.04em] text-white">Generic ballot drift</h2>
                </div>
                <MapPinned className="h-4 w-4 text-white/35" />
              </div>
              <div className="mt-5 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[{ month: 'Jan', dem: 47.1, rep: 45.8 }, { month: 'Feb', dem: 47.4, rep: 46.0 }, { month: 'Mar', dem: 47.9, rep: 46.2 }, { month: 'Apr', dem: 48.3, rep: 46.4 }, { month: 'May', dem: 48.0, rep: 46.7 }]}>
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.18)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.18)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                    <Tooltip contentStyle={{ background: '#0b1220', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                    <Area type="monotone" dataKey="dem" stroke="#6f99ff" fill="rgba(111,153,255,0.22)" strokeWidth={2.2} />
                    <Area type="monotone" dataKey="rep" stroke="#dd7176" fill="rgba(221,113,118,0.2)" strokeWidth={2.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>
      </main>

      <RaceDetailDrawer race={selectedRace} onClose={() => setSelectedRace(null)} onCandidateOpen={(candidateName, stateAbbr, raceType) => setCandidateDrawer({ candidateName, stateAbbr, raceType })} historyMode={historyMode} />
      {candidateDrawer && <CandidateDrawer candidateName={candidateDrawer.candidateName} stateAbbr={candidateDrawer.stateAbbr} raceType={candidateDrawer.raceType} onClose={() => setCandidateDrawer(null)} />}
    </div>
  );
}
