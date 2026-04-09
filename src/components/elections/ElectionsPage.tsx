import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ExternalLink, MapPinned } from 'lucide-react';
import USMap from './USMap';
import {
  buildInitialStateBoards,
  fetchDistrictsForState,
  fetchHouseSummaries,
  getOverlayDetail,
  getOverlayParty,
  getPartyTone,
  type HouseDistrict,
  type OverlayKey,
  type StateBoard,
} from '../../lib/elections-live';

const overlayTabs: Array<{ key: OverlayKey; label: string; note: string }> = [
  { key: 'house', label: 'House', note: 'Current House delegation by state, with live district drill-down.' },
  { key: 'senate', label: 'Senate', note: 'Current Senate control by state, including split delegations.' },
  { key: 'governor', label: 'Governor', note: 'Current governor by party in each state.' },
  { key: 'president', label: 'President 2024', note: 'Statewide winner from the 2024 presidential election.' },
];

function SegmentedControl({
  value,
  onChange,
  items,
}: {
  value: string;
  onChange: (next: string) => void;
  items: Array<{ key: string; label: string }>;
}) {
  return (
    <div className="grid gap-2 md:grid-cols-4">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          className={`border px-4 py-3 text-left transition ${
            value === item.key ? 'border-stone-950 bg-stone-950 text-white' : 'border-stone-300 bg-[#fcf7ef] text-stone-700 hover:bg-white'
          }`}
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">{item.label}</span>
        </button>
      ))}
    </div>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="border border-stone-300 bg-[#fcf7ef] p-5">
      <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">{label}</p>
      <p className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-stone-950">{value}</p>
      <p className="mt-3 text-sm leading-6 text-stone-700">{detail}</p>
    </article>
  );
}

function StatPill({ party }: { party: 'D' | 'R' | 'I' | 'Vacant' | 'Split' }) {
  const tone = getPartyTone(party);
  return (
    <span
      className="inline-flex items-center gap-2 border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]"
      style={{ borderColor: tone.text, backgroundColor: tone.tint, color: tone.text }}
    >
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tone.fill }} />
      {tone.label}
    </span>
  );
}

function DistrictTable({
  districts,
  selectedDistrictId,
  onSelect,
}: {
  districts: HouseDistrict[];
  selectedDistrictId: string | null;
  onSelect: (district: HouseDistrict) => void;
}) {
  if (!districts.length) {
    return <p className="text-sm leading-7 text-stone-600">Pick a state to load its current 119th Congress district boundaries and member roster.</p>;
  }

  return (
    <div className="overflow-hidden border border-stone-300">
      <div className="grid grid-cols-[140px_1fr_120px] border-b border-stone-300 bg-[#f0e7d8] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-600">
        <span>District</span>
        <span>Member</span>
        <span>Party</span>
      </div>
      <div className="divide-y divide-stone-300">
        {districts.map((district) => {
          const tone = getPartyTone(district.party);
          return (
            <button
              key={district.id}
              onClick={() => onSelect(district)}
              className={`grid w-full grid-cols-[140px_1fr_120px] items-center px-4 py-4 text-left transition ${
                selectedDistrictId === district.id ? 'bg-[#f4ecdf]' : 'bg-white hover:bg-[#faf4ea]'
              }`}
            >
              <span className="text-sm font-semibold text-stone-950">{district.districtLabel}</span>
              <span className="text-sm text-stone-700">{district.memberName}</span>
              <span className="text-sm font-semibold" style={{ color: tone.text }}>
                {district.party}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ElectionsPage() {
  const [overlay, setOverlay] = useState<OverlayKey>('house');
  const [mapLevel, setMapLevel] = useState<'states' | 'districts'>('states');
  const [stateBoards, setStateBoards] = useState<Record<string, StateBoard>>(buildInitialStateBoards);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [districts, setDistricts] = useState<HouseDistrict[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<HouseDistrict | null>(null);
  const [loadingHouse, setLoadingHouse] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [houseError, setHouseError] = useState<string | null>(null);
  const [districtError, setDistrictError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadHouse() {
      try {
        setLoadingHouse(true);
        const summaries = await fetchHouseSummaries();
        if (cancelled) return;

        setStateBoards((current) => {
          const next = { ...current };
          for (const [abbr, summary] of Object.entries(summaries)) {
            next[abbr] = { ...next[abbr], house: summary };
          }
          return next;
        });
      } catch (error) {
        if (!cancelled) {
          setHouseError(error instanceof Error ? error.message : 'Failed to load live House summary.');
        }
      } finally {
        if (!cancelled) setLoadingHouse(false);
      }
    }

    void loadHouse();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadDistricts() {
      if (!selectedState || mapLevel !== 'districts') {
        setDistricts([]);
        setSelectedDistrict(null);
        setDistrictError(null);
        return;
      }

      try {
        setLoadingDistricts(true);
        setDistrictError(null);
        const next = await fetchDistrictsForState(selectedState);
        if (cancelled) return;
        setDistricts(next);
        setSelectedDistrict(next[0] ?? null);
      } catch (error) {
        if (!cancelled) {
          setDistrictError(error instanceof Error ? error.message : 'Failed to load districts.');
          setDistricts([]);
          setSelectedDistrict(null);
        }
      } finally {
        if (!cancelled) setLoadingDistricts(false);
      }
    }

    void loadDistricts();
    return () => {
      cancelled = true;
    };
  }, [mapLevel, selectedState]);

  const overlayMeta = overlayTabs.find((item) => item.key === overlay)!;
  const houseNational = useMemo(
    () =>
      Object.values(stateBoards).reduce(
        (totals, state) => ({
          dem: totals.dem + state.house.dem,
          rep: totals.rep + state.house.rep,
          ind: totals.ind + state.house.ind,
          vacant: totals.vacant + state.house.vacant,
        }),
        { dem: 0, rep: 0, ind: 0, vacant: 0 },
      ),
    [stateBoards],
  );

  const governorCounts = useMemo(
    () =>
      Object.values(stateBoards).reduce(
        (totals, state) => {
          totals[state.governor.party] += 1;
          return totals;
        },
        { D: 0, R: 0 },
      ),
    [stateBoards],
  );

  const splitSenateStates = useMemo(
    () => Object.values(stateBoards).filter((state) => getOverlayParty(state, 'senate') === 'Split').length,
    [stateBoards],
  );

  const selectedBoard = selectedState ? stateBoards[selectedState] : null;

  const selectState = (abbr: string | null) => {
    setSelectedState(abbr);
    setSelectedDistrict(null);
    setDistrictError(null);
    setMapLevel(abbr ? 'districts' : 'states');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(184,158,107,0.18),transparent_32%),linear-gradient(180deg,#f5efe4_0%,#f8f4ed_48%,#f0e8db_100%)] text-stone-950">
      <main className="mx-auto max-w-[1380px] px-5 py-8 sm:px-8 lg:px-10">
        <section className="grid gap-8 border border-stone-300 bg-[#fbf7ef]/90 p-6 shadow-[0_36px_120px_rgba(58,44,19,0.1)] backdrop-blur lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-stone-500">Election desk | April 8, 2026</p>
            <h1 className="mt-4 max-w-4xl font-heading text-5xl leading-none tracking-[-0.06em] text-stone-950 sm:text-6xl">
              Clean, current, and actually tied to live district data.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-stone-700">
              The fake forecast board is gone. This page now centers on the current 119th Congress district map,
              current statewide control, and a much cleaner layout instead of stacked pills, bubbles, and filler copy.
            </p>
          </div>

          <div className="grid gap-4 self-end">
            <div className="border border-stone-300 bg-[#f0e7d8] p-5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">Source stack</p>
              <p className="mt-3 text-sm leading-7 text-stone-700">
                Live House district geometry and member attributes come from the USDOT / Census / House Clerk feature service for the 119th Congress.
              </p>
            </div>
            <a
              href="https://services6.arcgis.com/ptshVLGaRNLSS3T1/arcgis/rest/services/Congressional_Districts/FeatureServer/2"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-between border border-stone-300 bg-white px-5 py-4 text-sm text-stone-700 transition hover:bg-stone-950 hover:text-white"
            >
              Open live district source
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <MetricCard
            label="House balance"
            value={`${houseNational.rep}-${houseNational.dem}`}
            detail={`Current seats from the live district feed. ${houseNational.vacant} seats are vacant.`}
          />
          <MetricCard label="Governor map" value={`${governorCounts.R}-${governorCounts.D}`} detail="Current Republican and Democratic governors, by state." />
          <MetricCard label="Split Senate states" value={`${splitSenateStates}`} detail="States where the current Senate delegation is split between parties." />
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="border border-stone-300 bg-[#fbf7ef] p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.26em] text-stone-500">Display mode</p>
                  <h2 className="mt-2 font-heading text-3xl tracking-[-0.05em] text-stone-950">{overlayMeta.label}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-700">{overlayMeta.note}</p>
                </div>
                <div className="inline-flex border border-stone-300 bg-white">
                  <button
                    onClick={() => setMapLevel('states')}
                    className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] transition ${mapLevel === 'states' ? 'bg-stone-950 text-white' : 'text-stone-700 hover:bg-[#f4ecdf]'}`}
                  >
                    States
                  </button>
                  <button
                    onClick={() => {
                      if (!selectedState) setSelectedState('PA');
                      setMapLevel('districts');
                    }}
                    className={`border-l border-stone-300 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] transition ${mapLevel === 'districts' ? 'bg-stone-950 text-white' : 'text-stone-700 hover:bg-[#f4ecdf]'}`}
                  >
                    Districts
                  </button>
                </div>
              </div>

              <div className="mt-5">
                <SegmentedControl value={overlay} onChange={(next) => setOverlay(next as OverlayKey)} items={overlayTabs} />
              </div>
            </div>

            <USMap
              selectedState={selectedState}
              selectedDistrictId={selectedDistrict?.id ?? null}
              mapLevel={mapLevel}
              overlay={overlay}
              stateBoards={stateBoards}
              districts={districts}
              districtsLoading={loadingDistricts}
              onStateClick={selectState}
              onDistrictSelect={setSelectedDistrict}
            />

            {houseError ? (
              <div className="border border-red-300 bg-red-50 px-5 py-4 text-sm text-red-700">
                Live House summary failed to load: {houseError}
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <section className="border border-stone-300 bg-[#fbf7ef] p-6">
              <div className="flex items-center justify-between gap-4 border-b border-stone-300 pb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">Selected state</p>
                  <h2 className="mt-2 font-heading text-3xl tracking-[-0.05em] text-stone-950">
                    {selectedBoard ? selectedBoard.name : 'National view'}
                  </h2>
                </div>
                {selectedBoard ? <StatPill party={getOverlayParty(selectedBoard, overlay)} /> : <MapPinned className="h-5 w-5 text-stone-500" />}
              </div>

              {selectedBoard ? (
                <div className="space-y-5 pt-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="border border-stone-300 bg-white p-4">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500">Governor</p>
                      <p className="mt-3 text-lg font-semibold text-stone-950">{selectedBoard.governor.name}</p>
                      <p className="mt-1 text-sm text-stone-700">{selectedBoard.governor.party}</p>
                    </div>
                    <div className="border border-stone-300 bg-white p-4">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500">House delegation</p>
                      <p className="mt-3 text-lg font-semibold text-stone-950">
                        {selectedBoard.house.dem} D / {selectedBoard.house.rep} R / {selectedBoard.house.ind} I
                      </p>
                      <p className="mt-1 text-sm text-stone-700">{selectedBoard.house.vacant} vacant</p>
                    </div>
                  </div>

                  <div className="border border-stone-300 bg-white p-4">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500">Senators</p>
                    <div className="mt-3 grid gap-3">
                      {selectedBoard.senators.map((senator) => (
                        <div key={senator.name} className="flex items-center justify-between border border-stone-200 px-3 py-3">
                          <span className="text-sm font-semibold text-stone-950">{senator.name}</span>
                          <span className="text-sm text-stone-700">{senator.party}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border border-stone-300 bg-white p-4">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500">Current overlay detail</p>
                    <p className="mt-3 text-sm leading-7 text-stone-700">{getOverlayDetail(selectedBoard, overlay)}</p>
                  </div>
                </div>
              ) : (
                <div className="pt-5">
                  <p className="text-sm leading-7 text-stone-700">
                    Click a state to switch from the national view into its live district map and current statewide control snapshot.
                  </p>
                </div>
              )}
            </section>

            <section className="border border-stone-300 bg-[#fbf7ef] p-6">
              <div className="flex items-end justify-between gap-4 border-b border-stone-300 pb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">District directory</p>
                  <h2 className="mt-2 font-heading text-3xl tracking-[-0.05em] text-stone-950">
                    {selectedBoard ? `${selectedBoard.abbr} districts` : 'Current member list'}
                  </h2>
                </div>
                {selectedBoard ? (
                  <button
                    onClick={() => {
                      setMapLevel('districts');
                    }}
                    className="inline-flex items-center gap-2 border border-stone-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-700 transition hover:bg-stone-950 hover:text-white"
                  >
                    Focus map
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>

              <div className="pt-5">
                {districtError ? <p className="mb-4 text-sm text-red-700">District load failed: {districtError}</p> : null}
                {loadingDistricts && mapLevel === 'districts' ? <p className="mb-4 text-sm text-stone-600">Loading current district roster...</p> : null}
                <DistrictTable districts={districts} selectedDistrictId={selectedDistrict?.id ?? null} onSelect={setSelectedDistrict} />
              </div>
            </section>

            {selectedDistrict ? (
              <section className="border border-stone-300 bg-[#fbf7ef] p-6">
                <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">District focus</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <h2 className="font-heading text-3xl tracking-[-0.05em] text-stone-950">{selectedDistrict.districtLabel}</h2>
                  <StatPill party={selectedDistrict.party} />
                </div>
                <p className="mt-4 text-sm leading-7 text-stone-700">
                  {selectedDistrict.vacant ? 'This seat is currently vacant.' : `${selectedDistrict.memberName} currently represents this district.`}
                </p>
              </section>
            ) : null}
          </div>
        </section>

        <section className="mt-8 border border-stone-300 bg-[#fbf7ef] p-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">What changed</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <div className="border border-stone-300 bg-white p-4 text-sm leading-7 text-stone-700">
              Fake polling, synthetic counties, and made-up district overlays were removed.
            </div>
            <div className="border border-stone-300 bg-white p-4 text-sm leading-7 text-stone-700">
              The district view now loads actual 119th Congress geometry and current member data from the live federal service.
            </div>
            <div className="border border-stone-300 bg-white p-4 text-sm leading-7 text-stone-700">
              The UI was rebuilt into a cleaner editorial layout with real spacing, quieter surfaces, and far less visual clutter.
            </div>
          </div>
        </section>
      </main>

      {loadingHouse ? (
        <div className="fixed bottom-6 right-6 border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700 shadow-[0_18px_40px_rgba(58,44,19,0.12)]">
          Refreshing live House summary...
        </div>
      ) : null}
    </div>
  );
}
