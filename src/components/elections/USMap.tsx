import { useMemo, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { geoAlbersUsa, geoPath } from 'd3-geo';
import type { HouseDistrict } from '../../lib/elections-live';

const WIDTH = 1280;
const HEIGHT = 820;

type TooltipState = {
  x: number;
  y: number;
  districtLabel: string;
  memberName: string;
  party: string;
};

type Props = {
  districts: HouseDistrict[];
  error: string | null;
  loading: boolean;
};

export default function USMap({ districts, error, loading }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const shapes = useMemo(() => {
    if (!districts.length) return [];

    const collection = {
      type: 'FeatureCollection',
      features: districts.map((district) => ({
        type: 'Feature',
        geometry: district.geometry,
        properties: { id: district.id },
      })),
    } satisfies GeoJSON.FeatureCollection;

    const projection = geoAlbersUsa().fitSize([WIDTH, HEIGHT], collection);
    const path = geoPath(projection);

    return districts
      .map((district) => ({
        district,
        d: path({
          type: 'Feature',
          geometry: district.geometry,
          properties: {},
        } as GeoJSON.Feature),
        fill:
          district.party === 'D'
            ? 'rgba(74, 143, 212, 0.75)'
            : district.party === 'R'
              ? 'rgba(192, 57, 43, 0.75)'
              : 'rgba(58, 58, 92, 0.38)',
      }))
      .filter((entry) => entry.d);
  }, [districts]);

  const updateTooltip = (event: ReactMouseEvent<SVGPathElement>, district: HouseDistrict) => {
    const bounds = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!bounds) return;

    setTooltip({
      x: event.clientX - bounds.left + 12,
      y: event.clientY - bounds.top - 12,
      districtLabel: district.districtLabel,
      memberName: district.memberName,
      party: district.party,
    });
  };

  return (
    <div className="relative mx-auto w-[min(65vw,1120px)] max-w-full">
      {loading ? (
        <p className="pb-8 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-[rgba(26,26,46,0.45)]">
          loading live congressional districts
        </p>
      ) : null}

      {error ? (
        <p className="pb-8 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-[#c0392b]">
          map failed to load | {error}
        </p>
      ) : null}

      {!error && shapes.length ? (
        <>
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="block h-auto w-full" role="img" aria-label="Interactive congressional district map">
            {shapes.map(({ district, d, fill }) => {
              const hovered = hoveredId === district.id;
              return (
                <path
                  key={district.id}
                  d={d ?? undefined}
                  fill={fill}
                  opacity={hovered ? 0.98 : 0.86}
                  style={{
                    transform: hovered ? 'translateY(-1px)' : 'translateY(0px)',
                    transformOrigin: 'center center',
                    transition: 'opacity 140ms ease, transform 140ms ease',
                  }}
                  onMouseEnter={(event) => {
                    setHoveredId(district.id);
                    updateTooltip(event, district);
                  }}
                  onMouseMove={(event) => updateTooltip(event, district)}
                  onMouseLeave={() => {
                    setHoveredId(null);
                    setTooltip(null);
                  }}
                />
              );
            })}
          </svg>

          {tooltip ? (
            <div
              className="pointer-events-none absolute left-0 top-0 font-mono text-[11px] leading-5 text-[#1a1a2e]"
              style={{ transform: `translate(${tooltip.x}px, ${tooltip.y}px)` }}
            >
              <div>{tooltip.districtLabel}</div>
              <div>{tooltip.memberName}</div>
              <div>{tooltip.party}</div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
