// @ts-nocheck
import { useEffect, useMemo, useRef, useState } from 'react';
import { geoAlbersUsa, geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import statesAtlas from 'us-atlas/states-10m.json';
import { FIPS_TO_ABBR, STATES_BY_ABBR } from '../../lib/election-states';

const WIDTH = 1120;
const HEIGHT = 720;

export default function USMap({
  selectedState,
  mapLevel,
  overlayMode,
  historyMode,
  scenarioLocks,
  countyData,
  districtData,
  onStateClick,
  onCountySelect,
  onDistrictSelect,
  getStateFill,
}) {
  const containerRef = useRef(null);
  const dragRef = useRef({ active: false, originX: 0, originY: 0, panX: 0, panY: 0 });
  const [hovered, setHovered] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [selectedState, mapLevel, overlayMode, historyMode]);

  const nationalShapes = useMemo(() => {
    const collection = feature(statesAtlas, statesAtlas.objects.states);
    const projection = geoAlbersUsa().fitSize([WIDTH, HEIGHT], collection);
    const path = geoPath(projection);
    return collection.features
      .map((geometry) => {
        const abbr = FIPS_TO_ABBR[String(geometry.id).padStart(2, '0')];
        if (!abbr) return null;
        return { abbr, geometry, d: path(geometry) };
      })
      .filter(Boolean);
  }, []);

  const localShapes = useMemo(() => {
    if (!selectedState || mapLevel === 'states') return [];
    const collection = {
      type: 'FeatureCollection',
      features: mapLevel === 'counties'
        ? countyData.map((county) => county.geometry)
        : districtData.map((district) => district.geometry),
    };
    const projection = geoMercator().fitSize([WIDTH, HEIGHT], collection);
    const path = geoPath(projection);
    const source = mapLevel === 'counties' ? countyData : districtData;
    return source.map((item) => ({ ...item, d: path(item.geometry) }));
  }, [selectedState, mapLevel, countyData, districtData]);

  const updateTooltip = (event, payload) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setHovered({ ...payload, x: event.clientX - bounds.left, y: event.clientY - bounds.top });
  };

  const startDrag = (event) => {
    dragRef.current = { active: true, originX: event.clientX, originY: event.clientY, panX: pan.x, panY: pan.y };
  };

  const onMove = (event) => {
    if (!dragRef.current.active) return;
    setPan({
      x: dragRef.current.panX + (event.clientX - dragRef.current.originX),
      y: dragRef.current.panY + (event.clientY - dragRef.current.originY),
    });
  };

  const stopDrag = () => {
    dragRef.current.active = false;
  };

  const onWheel = (event) => {
    if (mapLevel === 'states') return;
    event.preventDefault();
    setZoom((current) => Math.min(Math.max(current + (event.deltaY > 0 ? -0.12 : 0.12), 1), 4));
  };

  const overlayTitle = mapLevel === 'states'
    ? 'National forecast map'
    : `${STATES_BY_ABBR[selectedState]?.name ?? selectedState} ${mapLevel === 'counties' ? 'county view' : 'district view'}`;

  return (
    <div ref={containerRef} className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(95,114,255,0.12),_transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))] p-4 shadow-[0_30px_120px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/38">{overlayMode} | {historyMode}</p>
          <h3 className="mt-2 font-heading text-2xl tracking-[-0.03em] text-white">{overlayTitle}</h3>
        </div>
        {selectedState && mapLevel !== 'states' && (
          <button onClick={() => onStateClick(null)} className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 transition hover:bg-white/10 hover:text-white">
            Back to states
          </button>
        )}
      </div>

      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/8 bg-[#08101d]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(80,121,255,0.16),_transparent_45%)]" />
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="relative h-auto w-full"
          role="img"
          aria-label="Election map"
          onPointerMove={onMove}
          onPointerUp={stopDrag}
          onPointerLeave={stopDrag}
          onWheel={onWheel}
        >
          <rect width={WIDTH} height={HEIGHT} fill="#08101d" />
          <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`} style={{ transition: dragRef.current.active ? 'none' : 'transform 280ms ease' }}>
            {mapLevel === 'states' && nationalShapes.map((state) => (
              <path
                key={state.abbr}
                d={state.d}
                fill={getStateFill(state.abbr)}
                stroke={selectedState === state.abbr ? '#f8fafc' : 'rgba(255,255,255,0.18)'}
                strokeWidth={selectedState === state.abbr ? 2.5 : 0.95}
                style={{ cursor: 'pointer', transition: 'fill 220ms ease, stroke 220ms ease, filter 220ms ease' }}
                onMouseEnter={(event) => updateTooltip(event, {
                  mode: 'state',
                  label: STATES_BY_ABBR[state.abbr].name,
                  detail: `EV ${STATES_BY_ABBR[state.abbr].electoralVotes} | ${scenarioLocks[state.abbr] ? `Locked ${scenarioLocks[state.abbr]}` : 'Forecast active'}`,
                  color: getStateFill(state.abbr),
                })}
                onMouseMove={(event) => updateTooltip(event, {
                  mode: 'state',
                  label: STATES_BY_ABBR[state.abbr].name,
                  detail: `EV ${STATES_BY_ABBR[state.abbr].electoralVotes} | ${scenarioLocks[state.abbr] ? `Locked ${scenarioLocks[state.abbr]}` : 'Forecast active'}`,
                  color: getStateFill(state.abbr),
                })}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onStateClick(state.abbr)}
              />
            ))}

            {mapLevel === 'counties' && localShapes.map((county) => (
              <path
                key={county.id}
                d={county.d}
                fill={county.fill}
                stroke="rgba(255,255,255,0.18)"
                strokeWidth={0.65}
                style={{ cursor: 'pointer', transition: 'fill 220ms ease, filter 220ms ease' }}
                onMouseDown={startDrag}
                onMouseEnter={(event) => updateTooltip(event, {
                  mode: 'county',
                  label: `${county.name} County`,
                  detail: `${county.margin >= 0 ? 'D' : 'R'} +${Math.abs(county.margin).toFixed(1)} | ${county.voteShare.D}% / ${county.voteShare.R}%`,
                  color: county.fill,
                })}
                onMouseMove={(event) => updateTooltip(event, {
                  mode: 'county',
                  label: `${county.name} County`,
                  detail: `Previous ${county.previous >= 0 ? 'D' : 'R'} +${Math.abs(county.previous).toFixed(1)}`,
                  color: county.fill,
                })}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onCountySelect(county)}
              />
            ))}

            {mapLevel === 'districts' && localShapes.map((district) => (
              <path
                key={district.id}
                d={district.d}
                fill={district.fill}
                stroke="rgba(255,255,255,0.26)"
                strokeWidth={0.8}
                style={{ cursor: 'pointer', transition: 'fill 220ms ease, filter 220ms ease' }}
                onMouseDown={startDrag}
                onMouseEnter={(event) => updateTooltip(event, {
                  mode: 'district',
                  label: district.district,
                  detail: `${district.race.candidates[0].name} vs ${district.race.candidates[1].name}`,
                  color: district.fill,
                })}
                onMouseMove={(event) => updateTooltip(event, {
                  mode: 'district',
                  label: district.district,
                  detail: `${district.margin >= 0 ? 'D' : 'R'} +${Math.abs(district.margin).toFixed(1)}`,
                  color: district.fill,
                })}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onDistrictSelect(district)}
              />
            ))}
          </g>
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/42">
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Wheel to zoom in local view</span>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Drag to pan</span>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Click states to focus</span>
      </div>

      {hovered && (
        <div
          className="pointer-events-none absolute left-0 top-0 z-20 hidden w-72 rounded-2xl border border-white/10 bg-[#0b1220]/92 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur md:block"
          style={{ transform: `translate(${hovered.x + 18}px, ${hovered.y + 18}px)` }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">{hovered.label}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/42">{hovered.mode}</p>
            </div>
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: hovered.color }} />
          </div>
          <p className="mt-4 text-sm leading-6 text-white/66">{hovered.detail}</p>
        </div>
      )}
    </div>
  );
}
