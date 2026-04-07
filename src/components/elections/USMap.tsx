declare module 'react-simple-maps';

import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { RACE_RATINGS, races } from '../../data/elections';

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const getStateRating = (stateName: string): string | null => {
  const stateRaces = races.filter(r => r.state === stateName && (r.type === 'Senate' || r.type === 'Governor'));
  if (stateRaces.length === 0) return null;
  const weights: Record<string, number> = { SAFE_D: 5, LIKELY_D: 4, TOSS_UP: 3, LIKELY_R: 2, SAFE_R: 1 };
  const avgRating = stateRaces.reduce((acc, r) => acc + (weights[r.rating] || 3), 0) / stateRaces.length;
  if (avgRating >= 4.5) return 'SAFE_D';
  if (avgRating >= 3.5) return 'LIKELY_D';
  if (avgRating >= 2.5) return 'TOSS_UP';
  if (avgRating >= 1.5) return 'LIKELY_R';
  return 'SAFE_R';
};

interface USMapProps {
  onStateClick: (stateName: string) => void;
  selectedState: string | null;
}

export default function USMap({ onStateClick, selectedState }: USMapProps) {
  return (
    <ComposableMap
      projection="geoAlbersUsa"
      width={800}
      height={500}
      style={{ width: '100%', height: 'auto' }}
    >
      <Geographies geography={geoUrl}>
        {({ geographies }: { geographies: any[] }) =>
          geographies.map((geo: any) => {
            const stateName = geo.properties.name;
            const rating = getStateRating(stateName);
            const isSelected = selectedState === stateName;
            const fillColor = rating ? RACE_RATINGS[rating as keyof typeof RACE_RATINGS].bg : '#1a1a1a';

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={fillColor}
                stroke={isSelected ? '#E8A020' : '#333'}
                strokeWidth={isSelected ? 2 : 0.5}
                style={{
                  default: { outline: 'none', cursor: rating ? 'pointer' : 'default' },
                  hover: { fill: rating ? `${RACE_RATINGS[rating as keyof typeof RACE_RATINGS].bg}cc` : '#222', outline: 'none' },
                  pressed: { outline: 'none' },
                }}
                onClick={() => rating && onStateClick(stateName)}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
}
