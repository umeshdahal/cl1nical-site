import { RACE_RATINGS, races } from '../data/elections';

type RatingKey = keyof typeof RACE_RATINGS;
type Lean = 'D' | 'R' | 'swing';

type StateMeta = {
  abbr: string;
  name: string;
  electoralVotes: number;
  lean: Lean;
  fips: string;
};

type Candidate = {
  name: string;
  party: string;
  polling: number;
  trend?: number[];
};

type ElectionRace = {
  id: string;
  type: string;
  state: string;
  stateAbbr?: string;
  district?: string | null;
  rating: RatingKey;
  candidates: Candidate[];
  lastUpdated: string;
};

export type StateSummary = StateMeta & {
  ratingKey: RatingKey;
  ratingLabel: string;
  fill: string;
  headline: string;
  trackedRaces: ElectionRace[];
};

const FALLBACK_RATING: Record<Lean, RatingKey> = {
  D: 'SAFE_D',
  R: 'SAFE_R',
  swing: 'TOSS_UP',
};

const RATING_WEIGHT: Record<RatingKey, number> = {
  SAFE_D: 7,
  LIKELY_D: 6,
  LEAN_D: 5,
  TOSS_UP: 4,
  LEAN_R: 3,
  LIKELY_R: 2,
  SAFE_R: 1,
};

const STATES: StateMeta[] = [
  { abbr: 'AL', name: 'Alabama', electoralVotes: 9, lean: 'R', fips: '01' },
  { abbr: 'AK', name: 'Alaska', electoralVotes: 3, lean: 'R', fips: '02' },
  { abbr: 'AZ', name: 'Arizona', electoralVotes: 11, lean: 'swing', fips: '04' },
  { abbr: 'AR', name: 'Arkansas', electoralVotes: 6, lean: 'R', fips: '05' },
  { abbr: 'CA', name: 'California', electoralVotes: 54, lean: 'D', fips: '06' },
  { abbr: 'CO', name: 'Colorado', electoralVotes: 10, lean: 'D', fips: '08' },
  { abbr: 'CT', name: 'Connecticut', electoralVotes: 7, lean: 'D', fips: '09' },
  { abbr: 'DE', name: 'Delaware', electoralVotes: 3, lean: 'D', fips: '10' },
  { abbr: 'DC', name: 'District of Columbia', electoralVotes: 3, lean: 'D', fips: '11' },
  { abbr: 'FL', name: 'Florida', electoralVotes: 30, lean: 'R', fips: '12' },
  { abbr: 'GA', name: 'Georgia', electoralVotes: 16, lean: 'swing', fips: '13' },
  { abbr: 'HI', name: 'Hawaii', electoralVotes: 4, lean: 'D', fips: '15' },
  { abbr: 'ID', name: 'Idaho', electoralVotes: 4, lean: 'R', fips: '16' },
  { abbr: 'IL', name: 'Illinois', electoralVotes: 19, lean: 'D', fips: '17' },
  { abbr: 'IN', name: 'Indiana', electoralVotes: 11, lean: 'R', fips: '18' },
  { abbr: 'IA', name: 'Iowa', electoralVotes: 6, lean: 'R', fips: '19' },
  { abbr: 'KS', name: 'Kansas', electoralVotes: 6, lean: 'R', fips: '20' },
  { abbr: 'KY', name: 'Kentucky', electoralVotes: 8, lean: 'R', fips: '21' },
  { abbr: 'LA', name: 'Louisiana', electoralVotes: 8, lean: 'R', fips: '22' },
  { abbr: 'ME', name: 'Maine', electoralVotes: 4, lean: 'D', fips: '23' },
  { abbr: 'MD', name: 'Maryland', electoralVotes: 10, lean: 'D', fips: '24' },
  { abbr: 'MA', name: 'Massachusetts', electoralVotes: 11, lean: 'D', fips: '25' },
  { abbr: 'MI', name: 'Michigan', electoralVotes: 15, lean: 'swing', fips: '26' },
  { abbr: 'MN', name: 'Minnesota', electoralVotes: 10, lean: 'D', fips: '27' },
  { abbr: 'MS', name: 'Mississippi', electoralVotes: 6, lean: 'R', fips: '28' },
  { abbr: 'MO', name: 'Missouri', electoralVotes: 10, lean: 'R', fips: '29' },
  { abbr: 'MT', name: 'Montana', electoralVotes: 4, lean: 'R', fips: '30' },
  { abbr: 'NE', name: 'Nebraska', electoralVotes: 5, lean: 'R', fips: '31' },
  { abbr: 'NV', name: 'Nevada', electoralVotes: 6, lean: 'swing', fips: '32' },
  { abbr: 'NH', name: 'New Hampshire', electoralVotes: 4, lean: 'swing', fips: '33' },
  { abbr: 'NJ', name: 'New Jersey', electoralVotes: 14, lean: 'D', fips: '34' },
  { abbr: 'NM', name: 'New Mexico', electoralVotes: 5, lean: 'D', fips: '35' },
  { abbr: 'NY', name: 'New York', electoralVotes: 28, lean: 'D', fips: '36' },
  { abbr: 'NC', name: 'North Carolina', electoralVotes: 16, lean: 'swing', fips: '37' },
  { abbr: 'ND', name: 'North Dakota', electoralVotes: 3, lean: 'R', fips: '38' },
  { abbr: 'OH', name: 'Ohio', electoralVotes: 17, lean: 'R', fips: '39' },
  { abbr: 'OK', name: 'Oklahoma', electoralVotes: 7, lean: 'R', fips: '40' },
  { abbr: 'OR', name: 'Oregon', electoralVotes: 8, lean: 'D', fips: '41' },
  { abbr: 'PA', name: 'Pennsylvania', electoralVotes: 19, lean: 'swing', fips: '42' },
  { abbr: 'RI', name: 'Rhode Island', electoralVotes: 4, lean: 'D', fips: '44' },
  { abbr: 'SC', name: 'South Carolina', electoralVotes: 9, lean: 'R', fips: '45' },
  { abbr: 'SD', name: 'South Dakota', electoralVotes: 3, lean: 'R', fips: '46' },
  { abbr: 'TN', name: 'Tennessee', electoralVotes: 11, lean: 'R', fips: '47' },
  { abbr: 'TX', name: 'Texas', electoralVotes: 40, lean: 'R', fips: '48' },
  { abbr: 'UT', name: 'Utah', electoralVotes: 6, lean: 'R', fips: '49' },
  { abbr: 'VT', name: 'Vermont', electoralVotes: 3, lean: 'D', fips: '50' },
  { abbr: 'VA', name: 'Virginia', electoralVotes: 13, lean: 'D', fips: '51' },
  { abbr: 'WA', name: 'Washington', electoralVotes: 12, lean: 'D', fips: '53' },
  { abbr: 'WV', name: 'West Virginia', electoralVotes: 4, lean: 'R', fips: '54' },
  { abbr: 'WI', name: 'Wisconsin', electoralVotes: 10, lean: 'swing', fips: '55' },
  { abbr: 'WY', name: 'Wyoming', electoralVotes: 3, lean: 'R', fips: '56' },
];

const raceList = races as ElectionRace[];

export const STATES_BY_ABBR = Object.fromEntries(STATES.map((state) => [state.abbr, state])) as Record<string, StateMeta>;
export const STATE_NAME_TO_ABBR = Object.fromEntries(STATES.map((state) => [state.name, state.abbr])) as Record<string, string>;
export const FIPS_TO_ABBR = Object.fromEntries(STATES.map((state) => [state.fips, state.abbr])) as Record<string, string>;

function averageRating(ratingKeys: RatingKey[]) {
  const average = ratingKeys.reduce((sum, key) => sum + RATING_WEIGHT[key], 0) / ratingKeys.length;

  return (Object.entries(RATING_WEIGHT) as [RatingKey, number][])
    .reduce((best, current) => (
      Math.abs(current[1] - average) < Math.abs(best[1] - average) ? current : best
    ))[0];
}

export function getTrackedStateRaces(abbr: string) {
  return raceList.filter((race) => race.stateAbbr === abbr || STATE_NAME_TO_ABBR[race.state] === abbr);
}

export function getStateSummary(abbr: string): StateSummary {
  const meta = STATES_BY_ABBR[abbr];
  if (!meta) {
    throw new Error(`Unknown state abbreviation: ${abbr}`);
  }

  const trackedRaces = getTrackedStateRaces(abbr);
  const ratingKey = trackedRaces.length > 0
    ? averageRating(trackedRaces.map((race) => race.rating))
    : FALLBACK_RATING[meta.lean];
  const rating = RACE_RATINGS[ratingKey];

  return {
    ...meta,
    ratingKey,
    ratingLabel: rating.label,
    fill: rating.bg,
    headline: trackedRaces.length > 0
      ? `${rating.label} with ${trackedRaces.length} tracked race${trackedRaces.length === 1 ? '' : 's'}`
      : `${meta.lean === 'swing' ? 'Swing' : meta.lean === 'D' ? 'Democratic' : 'Republican'} presidential lean`,
    trackedRaces,
  };
}
