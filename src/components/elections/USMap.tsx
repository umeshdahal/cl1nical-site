// @ts-nocheck
// Pure SVG US Map — no external dependencies, React 19 compatible
import { RACE_RATINGS, races } from '../../data/elections';

// Simplified state paths (lower-poly for performance)
const STATE_PATHS = {
  AL: "M620,475 L620,520 630,520 630,475Z",
  AK: "M160,540 L160,580 220,580 220,540Z",
  AZ: "M205,440 L205,510 270,510 270,440Z",
  AR: "M540,440 L540,490 580,490 580,440Z",
  CA: "M130,340 L130,480 200,480 200,340Z",
  CO: "M290,340 L290,400 350,400 350,340Z",
  CT: "M830,240 L830,270 860,270 860,240Z",
  DE: "M790,330 L790,360 810,360 810,330Z",
  FL: "M630,500 L630,580 700,580 700,500Z",
  GA: "M640,430 L640,490 690,490 690,430Z",
  HI: "M250,560 L250,590 290,590 290,560Z",
  ID: "M230,200 L230,280 270,280 270,200Z",
  IL: "M540,280 L540,370 590,370 590,280Z",
  IN: "M590,290 L590,370 630,370 630,290Z",
  IA: "M490,270 L490,330 540,330 540,270Z",
  KS: "M400,370 L400,420 470,420 470,370Z",
  KY: "M610,360 L610,410 680,410 680,360Z",
  LA: "M540,500 L540,550 590,550 590,500Z",
  ME: "M860,140 L860,210 900,210 900,140Z",
  MD: "M750,310 L750,350 810,350 810,310Z",
  MA: "M830,210 L830,240 880,240 880,210Z",
  MI: "M570,200 L570,290 630,290 630,200Z",
  MN: "M460,180 L460,270 520,270 520,180Z",
  MS: "M580,470 L580,520 620,520 620,470Z",
  MO: "M500,370 L500,440 560,440 560,370Z",
  MT: "M260,160 L260,230 340,230 340,160Z",
  NE: "M380,300 L380,360 460,360 460,300Z",
  NV: "M180,280 L180,380 230,380 230,280Z",
  NH: "M840,170 L840,220 870,220 870,170Z",
  NJ: "M800,270 L800,320 830,320 830,270Z",
  NM: "M270,440 L270,510 330,510 330,440Z",
  NY: "M730,200 L730,280 830,280 830,200Z",
  NC: "M680,390 L680,440 780,440 780,390Z",
  ND: "M370,180 L370,240 430,240 430,180Z",
  OH: "M630,280 L630,360 690,360 690,280Z",
  OK: "M380,420 L380,470 470,470 470,420Z",
  OR: "M130,200 L130,270 220,270 220,200Z",
  PA: "M690,270 L690,330 780,330 780,270Z",
  RI: "M850,250 L850,270 870,270 870,250Z",
  SC: "M670,430 L670,480 720,480 720,430Z",
  SD: "M370,240 L370,310 440,310 440,240Z",
  TN: "M580,400 L580,440 670,440 670,400Z",
  TX: "M330,470 L330,570 450,570 450,470Z",
  UT: "M230,300 L230,380 280,380 280,300Z",
  VT: "M820,170 L820,220 850,220 850,170Z",
  VA: "M710,340 L710,390 780,390 780,340Z",
  WA: "M150,130 L150,200 230,200 230,130Z",
  WV: "M700,320 L700,380 740,380 740,320Z",
  WI: "M510,190 L510,270 570,270 570,190Z",
  WY: "M280,230 L280,310 350,310 350,230Z",
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
  WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
};

const getStateRating = (abbr) => {
  const stateName = STATE_NAMES[abbr];
  const stateRaces = races.filter(r => r.state === stateName && (r.type === 'Senate' || r.type === 'Governor'));
  if (stateRaces.length === 0) return null;
  const weights = { SAFE_D: 5, LIKELY_D: 4, TOSS_UP: 3, LIKELY_R: 2, SAFE_R: 1 };
  const avg = stateRaces.reduce((acc, r) => acc + (weights[r.rating] || 3), 0) / stateRaces.length;
  if (avg >= 4.5) return 'SAFE_D';
  if (avg >= 3.5) return 'LIKELY_D';
  if (avg >= 2.5) return 'TOSS_UP';
  if (avg >= 1.5) return 'LIKELY_R';
  return 'SAFE_R';
};

export default function USMap({ onStateClick, selectedState }) {
  return (
    <svg viewBox="0 100 1000 520" className="w-full h-auto">
      {Object.entries(STATE_PATHS).map(([abbr, d]) => {
        const rating = getStateRating(abbr);
        const isSelected = selectedState === STATE_NAMES[abbr];
        const fillColor = rating ? RACE_RATINGS[rating].bg : '#1a1a1a';
        const strokeColor = isSelected ? '#E8A020' : '#333';

        return (
          <path
            key={abbr}
            d={d}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={isSelected ? 2 : 0.5}
            className={rating ? 'cursor-pointer' : ''}
            style={{
              transition: 'fill 0.2s ease, stroke 0.2s ease',
              opacity: rating ? 1 : 0.5,
            }}
            onMouseEnter={(e) => {
              if (rating) e.target.style.opacity = '0.8';
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = rating ? '1' : '0.5';
            }}
            onClick={() => rating && onStateClick(STATE_NAMES[abbr])}
          />
        );
      })}
    </svg>
  );
}
