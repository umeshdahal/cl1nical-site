import { useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { geoAlbersUsa, geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import statesAtlas from 'us-atlas/states-10m.json';
import { FIPS_TO_ABBR, STATES_BY_ABBR } from '../../lib/us-state-meta';
import { getOverlayDetail, getOverlayParty, getPartyTone, type HouseDistrict, type OverlayKey, type StateBoard } from '../../lib/elections-live';

const WIDTH = 1120;
const HEIGHT = 720;

type HoverState = {
  x: number;
  y: number;
  label: string;
  detail: string;
  color: string;
  mode: 'state' | 'district';
};

type USMapProps = {
  selectedState: string | null;
  selectedDistrictId: string | null;
  mapLevel: 'states' | 'districts';
  overlay: OverlayKey;
  stateBoards: Record<string, StateBoard>;
  districts: HouseDistrict[];
  districtsLoading: boolean;
  onStateClick: (abbr: string | null) => void;
  onDistrictSelect: (district: HouseDistrict) => void;
};

export default function USMap({
  selectedState,
  selectedDistrictId,
  mapLevel,
  overlay,
  stateBoards,
  districts,
  districtsLoading,
  onStateClick,
  onDistrictSelect,
}: USMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<HoverState | null>(null);

  const nationalShapes = useMemo(() => {
    const collection = feature(statesAtlas as never, (statesAtlas as never).objects.states) as GeoJSON.FeatureCollection;
    const projection = geoAlbersUsa().fitSize([WIDTH, HEIGHT], collection);
    const path = geoPath(projection);

    return collection.features
      .map((geometry) => {
        const abbr = FIPS_TO_ABBR[String(geometry.id).padStart(2, '0')];
        if (!abbr || !stateBoards[abbr]) return null;

        const party = getOverlayParty(stateBoards[abbr], overlay);
        return {
          abbr,
          d: path(geometry),
          fill: getPartyTone(party).fill,
        };
      })
      .filter(Boolean) as Array<{ abbr: string; d: string | null; fill: string }>;
  }, [overlay, stateBoards]);

  const districtShapes = useMemo(() => {
    if (!districts.length) return [];

    const collection = {
      type: 'FeatureCollection',
      features: districts.map((district) => ({
        type: 'Feature',
        properties: { id: district.id },
        geometry: district.geometry,
      })),
    } satisfies GeoJSON.FeatureCollection;

    const projection = geoMercator().fitSize([WIDTH, HEIGHT], collection);
    const path = geoPath(projection);

    return districts.map((district) => ({
      ...district,
      d: path({
        type: 'Feature',
        properties: { id: district.id },
        geometry: district.geometry,
      } as GeoJSON.Feature),
      fill: getPartyTone(district.party).fill,
    }));
  }, [districts]);

  const setTooltip = (event: ReactMouseEvent, next: Omit<HoverState, 'x' | 'y'>) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;

    setHovered({
      ...next,
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });
  };

  const selectedStateName = selectedState ? STATES_BY_ABBR[selectedState]?.name ?? selectedState : null;

  return (
    <div ref={containerRef} className="relative border border-stone-300 bg-[#f9f4ea] p-4 shadow-[0_28px_80px_rgba(58,44,19,0.08)]">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-stone-300 pb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
            {mapLevel === 'states' ? 'National map' : 'District map'} | {overlay}
          </p>
          <h2 className="mt-2 font-heading text-3xl tracking-[-0.04em] text-stone-950">
            {mapLevel === 'states' ? 'Current control, by state' : `${selectedStateName} congressional districts`}
          </h2>
        </div>

        {selectedState && mapLevel === 'districts' ? (
          <button
            onClick={() => onStateClick(null)}
            className="border border-stone-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-stone-700 transition hover:bg-stone-950 hover:text-white"
          >
            Back to states
          </button>
        ) : null}
      </div>

      <div className="relative overflow-hidden border border-stone-300 bg-[#fcf7ef]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(120,113,108,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(120,113,108,0.08)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="relative h-auto w-full" role="img" aria-label="Current election control map">
          <rect width={WIDTH} height={HEIGHT} fill="#fcf7ef" />

          {mapLevel === 'states' &&
            nationalShapes.map((state) => (
              <path
                key={state.abbr}
                d={state.d ?? undefined}
                fill={state.fill}
                stroke={selectedState === state.abbr ? '#171717' : '#f9f4ea'}
                strokeWidth={selectedState === state.abbr ? 2.2 : 1}
                className="transition-opacity duration-150 hover:opacity-85"
                onMouseEnter={(event) =>
                  setTooltip(event, {
                    mode: 'state',
                    label: stateBoards[state.abbr].name,
                    detail: getOverlayDetail(stateBoards[state.abbr], overlay),
                    color: state.fill,
                  })
                }
                onMouseMove={(event) =>
                  setTooltip(event, {
                    mode: 'state',
                    label: stateBoards[state.abbr].name,
                    detail: getOverlayDetail(stateBoards[state.abbr], overlay),
                    color: state.fill,
                  })
                }
                onMouseLeave={() => setHovered(null)}
                onClick={() => onStateClick(state.abbr)}
              />
            ))}

          {mapLevel === 'districts' &&
            districtShapes.map((district) => (
              <path
                key={district.id}
                d={district.d ?? undefined}
                fill={district.fill}
                stroke={selectedDistrictId === district.id ? '#171717' : '#f9f4ea'}
                strokeWidth={selectedDistrictId === district.id ? 2.2 : 1}
                className="transition-opacity duration-150 hover:opacity-85"
                onMouseEnter={(event) =>
                  setTooltip(event, {
                    mode: 'district',
                    label: district.districtLabel,
                    detail: district.vacant ? 'Seat is currently vacant' : `${district.memberName} (${district.party})`,
                    color: district.fill,
                  })
                }
                onMouseMove={(event) =>
                  setTooltip(event, {
                    mode: 'district',
                    label: district.districtLabel,
                    detail: district.vacant ? 'Seat is currently vacant' : `${district.memberName} (${district.party})`,
                    color: district.fill,
                  })
                }
                onMouseLeave={() => setHovered(null)}
                onClick={() => onDistrictSelect(district)}
              />
            ))}
        </svg>

        {mapLevel === 'districts' && districtsLoading ? (
          <div className="absolute inset-x-6 top-6 border border-stone-300 bg-white/90 px-4 py-3 text-sm text-stone-700 backdrop-blur">
            Loading live district geometry for {selectedStateName}...
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.2em] text-stone-500">
        <span>Live House district feed: USDOT / Census / House Clerk</span>
        <span>Click a state to open its districts</span>
      </div>

      {hovered ? (
        <div
          className="pointer-events-none absolute left-0 top-0 z-20 hidden w-72 border border-stone-300 bg-white/96 p-4 shadow-[0_22px_60px_rgba(58,44,19,0.12)] md:block"
          style={{ transform: `translate(${hovered.x + 18}px, ${hovered.y + 18}px)` }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-stone-950">{hovered.label}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-stone-500">{hovered.mode}</p>
            </div>
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: hovered.color }} />
          </div>
          <p className="mt-4 text-sm leading-6 text-stone-700">{hovered.detail}</p>
        </div>
      ) : null}
    </div>
  );
}
