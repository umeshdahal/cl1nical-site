import { useMemo } from 'react';
import { geoAlbersUsa, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import statesAtlas from 'us-atlas/states-10m.json';
import { fetchAllDistricts, type HouseDistrict } from '../../lib/elections-live';

const WIDTH = 1120;
const HEIGHT = 760;

type Props = {
  districts: HouseDistrict[];
};

export async function loadNationalDistricts() {
  return fetchAllDistricts();
}

export default function USMap({ districts }: Props) {
  const shapes = useMemo(() => {
    if (!districts.length) return [];

    const states = feature(statesAtlas as never, (statesAtlas as never).objects.states) as GeoJSON.FeatureCollection;
    const projection = geoAlbersUsa().fitSize([WIDTH, HEIGHT], states);
    const path = geoPath(projection);

    return districts
      .map((district) => ({
        id: district.id,
        d: path({
          type: 'Feature',
          geometry: district.geometry,
          properties: {},
        } as GeoJSON.Feature),
        fill: district.vacant ? 'rgba(255,255,255,0.18)' : district.party === 'D' ? 'rgba(122, 170, 255, 0.42)' : district.party === 'R' ? 'rgba(255, 166, 184, 0.34)' : 'rgba(187, 255, 247, 0.34)',
      }))
      .filter((district) => district.d);
  }, [districts]);

  return (
    <div className="mx-auto w-full max-w-[min(60vw,980px)]">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="block h-auto w-full" role="img" aria-label="Congressional district map">
        {shapes.map((district) => (
          <path key={district.id} d={district.d ?? undefined} fill={district.fill} />
        ))}
      </svg>
    </div>
  );
}
