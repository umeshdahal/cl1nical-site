import { useRef, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import usAtlasUrl from 'us-atlas/states-10m.json?url';
import { getStateSummary, STATE_NAME_TO_ABBR, type StateSummary } from '../../lib/election-states';

type HoverState = {
  summary: StateSummary;
  x: number;
  y: number;
} | null;

type USMapProps = {
  onStateClick: (abbr: string) => void;
  selectedState: string | null;
};

export default function USMap({ onStateClick, selectedState }: USMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<HoverState>(null);

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
        <ComposableMap
          projection="geoAlbersUsa"
          width={980}
          height={620}
          className="h-auto w-full"
          style={{ width: '100%', height: 'auto' }}
        >
          <Geographies geography={usAtlasUrl}>
            {({ geographies }) => geographies.map((geography) => {
              const abbr = STATE_NAME_TO_ABBR[geography.properties.name];
              if (!abbr) {
                return null;
              }

              const summary = getStateSummary(abbr);
              const isSelected = selectedState === abbr;

              return (
                <Geography
                  key={geography.rsmKey}
                  geography={geography}
                  onMouseEnter={(event) => updateTooltip(event, summary)}
                  onMouseMove={(event) => updateTooltip(event, summary)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => onStateClick(abbr)}
                  style={{
                    default: {
                      fill: summary.fill,
                      stroke: '#ffffff',
                      strokeWidth: isSelected ? 1.8 : 0.75,
                      outline: 'none',
                      transition: 'fill 160ms ease, filter 160ms ease, stroke-width 160ms ease',
                    },
                    hover: {
                      fill: summary.fill,
                      stroke: '#0f172a',
                      strokeWidth: 1.6,
                      outline: 'none',
                      cursor: 'pointer',
                      filter: 'brightness(1.06)',
                    },
                    pressed: {
                      fill: summary.fill,
                      stroke: '#0f172a',
                      strokeWidth: 1.8,
                      outline: 'none',
                    },
                  }}
                />
              );
            })}
          </Geographies>
        </ComposableMap>
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
