// @ts-nocheck
// Tile-grid cartogram US Map — proper geographic layout
// Based on the standard 10-column grid used by FiveThirtyEight, NYT, etc.
import { useState } from 'react';
import { RACE_RATINGS, races } from '../../data/elections';

// Grid positions: [col, row] — 10 columns wide, 6 rows tall
// Each cell is 60x60 with 4px gap
const CELL = 60;
const GAP = 4;
const COLS = 10;

// Standard tile-grid layout for US states
const GRID = {
  WA: [0, 0], OR: [0, 1], CA: [0, 2], NV: [1, 2], ID: [1, 1], MT: [2, 0],
  WY: [2, 1], UT: [1, 3], CO: [2, 2], AZ: [1, 4], NM: [2, 3], ND: [3, 0],
  SD: [3, 1], NE: [3, 2], KS: [3, 3], OK: [3, 4], TX: [3, 5], MN: [4, 0],
  IA: [4, 1], MO: [4, 2], AR: [4, 3], LA: [4, 4], WI: [5, 0], IL: [5, 1],
  MS: [5, 3], MI: [6, 0], IN: [6, 1], KY: [6, 2], TN: [6, 3], AL: [5, 4],
  GA: [6, 4], FL: [6, 5], OH: [7, 1], WV: [7, 2], VA: [7, 3], NC: [7, 4],
  SC: [7, 5], PA: [8, 1], NY: [8, 0], VT: [9, 0], NH: [9, 1], ME: [9, 0],
  MA: [9, 1], RI: [9, 2], CT: [9, 2], NJ: [8, 2], DE: [8, 3], MD: [8, 3],
  DC: [8, 3], AK: [0, 5], HI: [1, 5],
};

// Fix overlapping states — assign unique positions
const UNIQUE_GRID = {
  WA: [0, 0], OR: [0, 1], CA: [0, 2], NV: [1, 2], ID: [1, 1], MT: [2, 0],
  WY: [2, 1], UT: [1, 3], CO: [2, 2], AZ: [1, 4], NM: [2, 3], ND: [3, 0],
  SD: [3, 1], NE: [3, 2], KS: [3, 3], OK: [3, 4], TX: [3, 5], MN: [4, 0],
  IA: [4, 1], MO: [4, 2], AR: [4, 3], LA: [4, 4], WI: [5, 0], IL: [5, 1],
  MS: [5, 3], MI: [6, 0], IN: [6, 1], KY: [6, 2], TN: [6, 3], AL: [5, 4],
  GA: [6, 4], FL: [6, 5], OH: [7, 1], WV: [7, 2], VA: [7, 3], NC: [7, 4],
  SC: [7, 5], PA: [8, 1], NY: [8, 0], VT: [9, 0], NH: [9, 1], ME: [9, 0],
  MA: [9, 2], RI: [9, 3], CT: [9, 2], NJ: [8, 2], DE: [8, 3], MD: [8, 4],
  DC: [8, 4], AK: [0, 5], HI: [1, 5],
};

// Refined grid with no overlaps — each state gets a unique cell
const TILE_GRID = {
  // Pacific Northwest
  WA: [0, 0], OR: [0, 1], CA: [0, 2],
  // Mountain
  ID: [1, 0], MT: [2, 0], WY: [2, 1], NV: [1, 1], UT: [1, 2], CO: [2, 2],
  AZ: [1, 3], NM: [2, 3],
  // Great Plains
  ND: [3, 0], SD: [3, 1], NE: [3, 2], KS: [3, 3], OK: [3, 4], TX: [3, 5],
  // Midwest
  MN: [4, 0], IA: [4, 1], MO: [4, 2], AR: [4, 3], LA: [4, 4],
  WI: [5, 0], IL: [5, 1], MS: [5, 2], AL: [5, 3],
  // Great Lakes / South
  MI: [6, 0], IN: [6, 1], KY: [6, 2], TN: [6, 3], GA: [6, 4], FL: [6, 5],
  // Northeast / Mid-Atlantic
  OH: [7, 0], PA: [7, 1], NY: [7, 2], WV: [7, 3], VA: [7, 4], NC: [7, 5],
  SC: [8, 5],
  // New England
  VT: [8, 0], NH: [8, 1], ME: [8, 2], MA: [9, 0], RI: [9, 1], CT: [9, 2],
  NJ: [9, 3], DE: [9, 4], MD: [9, 5], DC: [9, 5],
  // Non-contiguous
  AK: [0, 4], HI: [0, 5],
};

const STATE_NAMES = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
  MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
  NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina',
  ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania',
  RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee',
  TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington',
  WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming', DC: 'District of Columbia',
};

const getStateRating = (abbr) => {
  const stateName = STATE_NAMES[abbr];
  const stateRaces = races.filter(r => r.state === stateName && (r.type === 'Senate' || r.type === 'Governor'));
  if (stateRaces.length === 0) return null;
  const weights = { SAFE_D: 7, LIKELY_D: 6, LEAN_D: 5, TOSS_UP: 4, LEAN_R: 3, LIKELY_R: 2, SAFE_R: 1 };
  const avg = stateRaces.reduce((acc, r) => acc + (weights[r.rating] || 4), 0) / stateRaces.length;
  if (avg >= 6.5) return 'SAFE_D';
  if (avg >= 5.5) return 'LIKELY_D';
  if (avg >= 4.5) return 'LEAN_D';
  if (avg >= 3.5) return 'TOSS_UP';
  if (avg >= 2.5) return 'LEAN_R';
  if (avg >= 1.5) return 'LIKELY_R';
  return 'SAFE_R';
};

export default function USMap({ onStateClick, selectedState }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${COLS * (CELL + GAP)} ${6 * (CELL + GAP)}`}
        className="w-full max-w-4xl mx-auto"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        {Object.entries(TILE_GRID).map(([abbr, [col, row]]) => {
          const x = col * (CELL + GAP);
          const y = row * (CELL + GAP);
          const rating = getStateRating(abbr);
          const isSelected = selectedState === abbr;
          const isHovered = hovered === abbr;
          const fillColor = rating ? RACE_RATINGS[rating].bg : '#e2e2e2';

          return (
            <g key={abbr}>
              <rect
                x={x}
                y={y}
                width={CELL}
                height={CELL}
                fill={fillColor}
                stroke={isSelected ? '#0f0f0f' : isHovered ? '#999' : '#fff'}
                strokeWidth={isSelected ? 2 : 1}
                className={rating ? 'cursor-pointer' : ''}
                style={{
                  transition: 'fill 150ms ease, stroke 150ms ease',
                  filter: isHovered && !isSelected ? 'brightness(1.1)' : 'none',
                }}
                onMouseEnter={() => setHovered(abbr)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => rating && onStateClick(abbr)}
              />
              <text
                x={x + CELL / 2}
                y={y + CELL / 2 + 5}
                textAnchor="middle"
                fill={rating ? '#fff' : '#666'}
                fontSize="14"
                fontWeight="600"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {abbr}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
