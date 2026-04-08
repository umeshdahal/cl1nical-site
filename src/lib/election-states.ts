import { RACE_RATINGS, races } from '../data/elections';

type RatingKey = keyof typeof RACE_RATINGS;
type Lean = 'D' | 'R' | 'swing';

type StateMeta = {
  abbr: string;
  name: string;
  electoralVotes: number;
  lean: Lean;
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
  { abbr: 'AL', name: 'Alabama', electoralVotes: 9, lean: 'R' },
  { abbr: 'AK', name: 'Alaska', electoralVotes: 3, lean: 'R' },
  { abbr: 'AZ', name: 'Arizona', electoralVotes: 11, lean: 'swing' },
  { abbr: 'AR', name: 'Arkansas', electoralVotes: 6, lean: 'R' },
  { abbr: 'CA', name: 'California', electoralVotes: 54, lean: 'D' },
  { abbr: 'CO', name: 'Colorado', electoralVotes: 10, lean: 'D' },
  { abbr: 'CT', name: 'Connecticut', electoralVotes: 7, lean: 'D' },
  { abbr: 'DE', name: 'Delaware', electoralVotes: 3, lean: 'D' },
  { abbr: 'FL', name: 'Florida', electoralVotes: 30, lean: 'R' },
  { abbr: 'GA', name: 'Georgia', electoralVotes: 16, lean: 'swing' },
  { abbr: 'HI', name: 'Hawaii', electoralVotes: 4, lean: 'D' },
  { abbr: 'ID', name: 'Idaho', electoralVotes: 4, lean: 'R' },
  { abbr: 'IL', name: 'Illinois', electoralVotes: 19, lean: 'D' },
  { abbr: 'IN', name: 'Indiana', electoralVotes: 11, lean: 'R' },
  { abbr: 'IA', name: 'Iowa', electoralVotes: 6, lean: 'R' },
  { abbr: 'KS', name: 'Kansas', electoralVotes: 6, lean: 'R' },
  { abbr: 'KY', name: 'Kentucky', electoralVotes: 8, lean: 'R' },
  { abbr: 'LA', name: 'Louisiana', electoralVotes: 8, lean: 'R' },
  { abbr: 'ME', name: 'Maine', electoralVotes: 4, lean: 'D' },
  { abbr: 'MD', name: 'Maryland', electoralVotes: 10, lean: 'D' },
  { abbr: 'MA', name: 'Massachusetts', electoralVotes: 11, lean: 'D' },
  { abbr: 'MI', name: 'Michigan', electoralVotes: 15, lean: 'swing' },
  { abbr: 'MN', name: 'Minnesota', electoralVotes: 10, lean: 'D' },
  { abbr: 'MS', name: 'Mississippi', electoralVotes: 6, lean: 'R' },
  { abbr: 'MO', name: 'Missouri', electoralVotes: 10, lean: 'R' },
  { abbr: 'MT', name: 'Montana', electoralVotes: 4, lean: 'R' },
  { abbr: 'NE', name: 'Nebraska', electoralVotes: 5, lean: 'R' },
  { abbr: 'NV', name: 'Nevada', electoralVotes: 6, lean: 'swing' },
  { abbr: 'NH', name: 'New Hampshire', electoralVotes: 4, lean: 'swing' },
  { abbr: 'NJ', name: 'New Jersey', electoralVotes: 14, lean: 'D' },
  { abbr: 'NM', name: 'New Mexico', electoralVotes: 5, lean: 'D' },
  { abbr: 'NY', name: 'New York', electoralVotes: 28, lean: 'D' },
  { abbr: 'NC', name: 'North Carolina', electoralVotes: 16, lean: 'swing' },
  { abbr: 'ND', name: 'North Dakota', electoralVotes: 3, lean: 'R' },
  { abbr: 'OH', name: 'Ohio', electoralVotes: 17, lean: 'R' },
  { abbr: 'OK', name: 'Oklahoma', electoralVotes: 7, lean: 'R' },
  { abbr: 'OR', name: 'Oregon', electoralVotes: 8, lean: 'D' },
  { abbr: 'PA', name: 'Pennsylvania', electoralVotes: 19, lean: 'swing' },
  { abbr: 'RI', name: 'Rhode Island', electoralVotes: 4, lean: 'D' },
  { abbr: 'SC', name: 'South Carolina', electoralVotes: 9, lean: 'R' },
  { abbr: 'SD', name: 'South Dakota', electoralVotes: 3, lean: 'R' },
  { abbr: 'TN', name: 'Tennessee', electoralVotes: 11, lean: 'R' },
  { abbr: 'TX', name: 'Texas', electoralVotes: 40, lean: 'R' },
  { abbr: 'UT', name: 'Utah', electoralVotes: 6, lean: 'R' },
  { abbr: 'VT', name: 'Vermont', electoralVotes: 3, lean: 'D' },
  { abbr: 'VA', name: 'Virginia', electoralVotes: 13, lean: 'D' },
  { abbr: 'WA', name: 'Washington', electoralVotes: 12, lean: 'D' },
  { abbr: 'WV', name: 'West Virginia', electoralVotes: 4, lean: 'R' },
  { abbr: 'WI', name: 'Wisconsin', electoralVotes: 10, lean: 'swing' },
  { abbr: 'WY', name: 'Wyoming', electoralVotes: 3, lean: 'R' },
  { abbr: 'DC', name: 'District of Columbia', electoralVotes: 3, lean: 'D' },
];

const raceList = races as ElectionRace[];

export const STATES_BY_ABBR = Object.fromEntries(STATES.map((state) => [state.abbr, state])) as Record<string, StateMeta>;
export const STATE_NAME_TO_ABBR = Object.fromEntries(STATES.map((state) => [state.name, state.abbr])) as Record<string, string>;

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
