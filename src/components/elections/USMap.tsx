// @ts-nocheck
import { useMemo, useRef, useState } from 'react';
import { geoAlbersUsa, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import usAtlas from 'us-atlas/states-10m.json';
import { FIPS_TO_ABBR, getStateSummary, type StateSummary } from '../../lib/election-states';

type HoverState = {
  summary: StateSummary;
  x: number;
  y: number;
} | null;

type USMapProps = {
  onStateClick: (abbr: string) => void;
  selectedState: string | null;
};

const WIDTH = 980;
const HEIGHT = 620;

export default function USMap({ onStateClick, selectedState }: USMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<HoverState>(null);

  const { projectedStates, pathFor } = useMemo(() => {
    const topo = usAtlas as any;
    const collection = feature(topo, topo.objects.states);
    const projection = geoAlbersUsa().fitSize([WIDTH, HEIGHT], collection);
    const path = geoPath(projection);

    const states = collection.features
      .map((geometry: any) => {
        const fips = String(geometry.id).padStart(2, '0');
        const abbr = FIPS_TO_ABBR[fips];
        if (!abbr) {
          return null;
        }

        return {
          abbr,
          shape: path(geometry),
        };
      })
      .filter(Boolean);

    return {
      projectedStates: states,
      pathFor: path,
    };
  }, []);

  const updateTooltip = (event: React.MouseEvent<SVGPathElement>, summary: StateSummary) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) {
      return;
    }

    setHovered({
      summary,
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-3 shadow-sm sm:p-5">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full" role="img" aria-label="United States election map">
          <rect width={WIDTH} height={HEIGHT} fill="#f8fafc" />
          <g>
            {projectedStates.map((state: any) => {
              const summary = getStateSummary(state.abbr);
              const isSelected = selectedState === state.abbr;

              return (
                <path
                  key={state.abbr}
                  d={state.shape || ''}
                  fill={summary.fill}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? 2 : 0.85}
                  style={{
                    cursor: 'pointer',
                    transition: 'fill 160ms ease, filter 160ms ease, stroke-width 160ms ease',
                  }}
                  onMouseEnter={(event) => updateTooltip(event, summary)}
                  onMouseMove={(event) => updateTooltip(event, summary)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => onStateClick(state.abbr)}
                />
              );
            })}
          </g>
        </svg>
      </div>

      {hovered && (
        <div
          className="pointer-events-none absolute left-0 top-0 z-20 hidden w-64 -translate-y-full rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur md:block"
          style={{
            transform: `translate(${hovered.x + 14}px, ${hovered.y - 14}px)`,
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{hovered.summary.name}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{hovered.summary.abbr}</p>
            </div>
            <span className="rounded-full px-2 py-1 text-[11px] font-semibold" style={{ backgroundColor: `${hovered.summary.fill}20`, color: hovered.summary.fill }}>
              {hovered.summary.ratingLabel}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-600">
            <div>
              <p className="uppercase tracking-[0.15em] text-slate-400">Electoral Votes</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{hovered.summary.electoralVotes}</p>
            </div>
            <div>
              <p className="uppercase tracking-[0.15em] text-slate-400">Tracked Races</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{hovered.summary.trackedRaces.length}</p>
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-600">{hovered.summary.headline}</p>
        </div>
      )}
    </div>
  );
}
