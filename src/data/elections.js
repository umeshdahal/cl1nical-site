// @ts-nocheck
// Mock 2026 Midterm Election Data
// Structured for easy swap to live API later

export const RACE_RATINGS = {
  SAFE_D:   { label: 'Safe D',   color: '#1a4a8a', bg: '#1a4a8a' },
  LIKELY_D: { label: 'Likely D', color: '#4a7ec7', bg: '#4a7ec7' },
  LEAN_D:   { label: 'Lean D',   color: '#89b4e8', bg: '#89b4e8' },
  TOSS_UP:  { label: 'Toss-up',  color: '#e8a838', bg: '#e8a838' },
  LEAN_R:   { label: 'Lean R',   color: '#e88a8a', bg: '#e88a8a' },
  LIKELY_R: { label: 'Likely R', color: '#c94040', bg: '#c94040' },
  SAFE_R:   { label: 'Safe R',   color: '#8a1a1a', bg: '#8a1a1a' },
};

export const RACE_TYPES = ['Presidential', 'Senate', 'House', 'Governor'];

export const PARTIES = {
  D: { label: 'Democrat', color: '#3b82f6' },
  R: { label: 'Republican', color: '#ef4444' },
  I: { label: 'Independent', color: '#6b7280' },
  L: { label: 'Libertarian', color: '#f59e0b' },
  G: { label: 'Green', color: '#22c55e' },
};

// Mock poll trend data for sparklines
function generatePollTrend(base, variance, count = 5) {
  return Array.from({ length: count }, () =>
    Math.round((base + (Math.random() - 0.5) * variance) * 10) / 10
  );
}

export const races = [
  // PRESIDENTIAL (2028 cycle placeholder)
  {
    id: 'pres-2028',
    type: 'Presidential',
    state: 'US',
    district: null,
    rating: 'TOSS_UP',
    candidates: [
      { name: 'TBD (D)', party: 'D', polling: 47.2, trend: generatePollTrend(47, 4) },
      { name: 'TBD (R)', party: 'R', polling: 46.8, trend: generatePollTrend(47, 4) },
    ],
    lastUpdated: '2026-04-01T00:00:00Z',
  },

  // SENATE RACES (25 races)
  {
    id: 'sen-az',
    type: 'Senate',
    state: 'Arizona',
    stateAbbr: 'AZ',
    district: null,
    rating: 'LIKELY_R',
    candidates: [
      { name: 'Kari Lake', party: 'R', polling: 48.5, trend: generatePollTrend(48, 3) },
      { name: 'Ruben Gallego', party: 'D', polling: 45.2, trend: generatePollTrend(45, 3) },
      { name: 'Blake Masters', party: 'L', polling: 3.1, trend: generatePollTrend(3, 2) },
    ],
    lastUpdated: '2026-04-05T14:30:00Z',
  },
  {
    id: 'sen-nv',
    type: 'Senate',
    state: 'Nevada',
    stateAbbr: 'NV',
    district: null,
    rating: 'TOSS_UP',
    candidates: [
      { name: 'Jacky Rosen', party: 'D', polling: 46.8, trend: generatePollTrend(47, 4) },
      { name: 'Sam Brown', party: 'R', polling: 46.1, trend: generatePollTrend(46, 4) },
    ],
    lastUpdated: '2026-04-06T09:15:00Z',
  },
  {
    id: 'sen-mt',
    type: 'Senate',
    state: 'Montana',
    stateAbbr: 'MT',
    district: null,
    rating: 'LIKELY_R',
    candidates: [
      { name: 'Tim Sheehy', party: 'R', polling: 51.2, trend: generatePollTrend(51, 3) },
      { name: 'Jon Tester', party: 'D', polling: 44.8, trend: generatePollTrend(45, 3) },
    ],
    lastUpdated: '2026-04-04T11:00:00Z',
  },
  {
    id: 'sen-oh',
    type: 'Senate',
    state: 'Ohio',
    stateAbbr: 'OH',
    district: null,
    rating: 'LIKELY_R',
    candidates: [
      { name: 'Bernie Moreno', party: 'R', polling: 49.5, trend: generatePollTrend(49, 3) },
      { name: 'Sherrod Brown', party: 'D', polling: 45.1, trend: generatePollTrend(45, 3) },
    ],
    lastUpdated: '2026-04-03T16:45:00Z',
  },
  {
    id: 'sen-pa',
    type: 'Senate',
    state: 'Pennsylvania',
    stateAbbr: 'PA',
    district: null,
    rating: 'TOSS_UP',
    candidates: [
      { name: 'Bob Casey Jr.', party: 'D', polling: 47.3, trend: generatePollTrend(47, 4) },
      { name: 'Dave McCormick', party: 'R', polling: 47.0, trend: generatePollTrend(47, 4) },
    ],
    lastUpdated: '2026-04-06T08:00:00Z',
  },
  {
    id: 'sen-wi',
    type: 'Senate',
    state: 'Wisconsin',
    stateAbbr: 'WI',
    district: null,
    rating: 'TOSS_UP',
    candidates: [
      { name: 'Tammy Baldwin', party: 'D', polling: 46.5, trend: generatePollTrend(46, 4) },
      { name: 'Eric Hovde', party: 'R', polling: 46.2, trend: generatePollTrend(46, 4) },
    ],
    lastUpdated: '2026-04-05T20:30:00Z',
  },
  {
    id: 'sen-mi',
    type: 'Senate',
    state: 'Michigan',
    stateAbbr: 'MI',
    district: null,
    rating: 'LIKELY_D',
    candidates: [
      { name: 'Elissa Slotkin', party: 'D', polling: 48.9, trend: generatePollTrend(49, 3) },
      { name: 'Mike Rogers', party: 'R', polling: 44.5, trend: generatePollTrend(44, 3) },
    ],
    lastUpdated: '2026-04-04T13:20:00Z',
  },
  {
    id: 'sen-ga',
    type: 'Senate',
    state: 'Georgia',
    stateAbbr: 'GA',
    district: null,
    rating: 'TOSS_UP',
    candidates: [
      { name: 'Jon Ossoff', party: 'D', polling: 47.1, trend: generatePollTrend(47, 4) },
      { name: 'Rick Allen', party: 'R', polling: 46.8, trend: generatePollTrend(47, 4) },
    ],
    lastUpdated: '2026-04-06T10:00:00Z',
  },
  {
    id: 'sen-nc',
    type: 'Senate',
    state: 'North Carolina',
    stateAbbr: 'NC',
    district: null,
    rating: 'LIKELY_R',
    candidates: [
      { name: 'Ted Budd', party: 'R', polling: 49.2, trend: generatePollTrend(49, 3) },
      { name: 'Jeff Jackson', party: 'D', polling: 45.5, trend: generatePollTrend(45, 3) },
    ],
    lastUpdated: '2026-04-03T09:00:00Z',
  },
  {
    id: 'sen-fl',
    type: 'Senate',
    state: 'Florida',
    stateAbbr: 'FL',
    district: null,
    rating: 'SAFE_R',
    candidates: [
      { name: 'Rick Scott', party: 'R', polling: 53.1, trend: generatePollTrend(53, 2) },
      { name: 'Debbie Mucarsel-Powell', party: 'D', polling: 42.5, trend: generatePollTrend(42, 2) },
    ],
    lastUpdated: '2026-04-02T15:00:00Z',
  },
  {
    id: 'sen-tx',
    type: 'Senate',
    state: 'Texas',
    stateAbbr: 'TX',
    district: null,
    rating: 'LIKELY_R',
    candidates: [
      { name: 'Ted Cruz', party: 'R', polling: 50.2, trend: generatePollTrend(50, 3) },
      { name: 'Colin Allred', party: 'D', polling: 45.8, trend: generatePollTrend(46, 3) },
    ],
    lastUpdated: '2026-04-05T11:30:00Z',
  },
  {
    id: 'sen-va',
    type: 'Senate',
    state: 'Virginia',
    stateAbbr: 'VA',
    district: null,
    rating: 'LIKELY_D',
    candidates: [
      { name: 'Tim Kaine', party: 'D', polling: 50.5, trend: generatePollTrend(50, 3) },
      { name: 'Hung Cao', party: 'R', polling: 44.2, trend: generatePollTrend(44, 3) },
    ],
    lastUpdated: '2026-04-04T17:00:00Z',
  },
  {
    id: 'sen-md',
    type: 'Senate',
    state: 'Maryland',
    stateAbbr: 'MD',
    district: null,
    rating: 'SAFE_D',
    candidates: [
      { name: 'Angela Alsobrooks', party: 'D', polling: 58.2, trend: generatePollTrend(58, 2) },
      { name: 'Larry Hogan', party: 'R', polling: 38.5, trend: generatePollTrend(38, 2) },
    ],
    lastUpdated: '2026-04-01T12:00:00Z',
  },
  {
    id: 'sen-ny',
    type: 'Senate',
    state: 'New York',
    stateAbbr: 'NY',
    district: null,
    rating: 'SAFE_D',
    candidates: [
      { name: 'Kirsten Gillibrand', party: 'D', polling: 56.8, trend: generatePollTrend(57, 2) },
      { name: 'Mike Sapraicone', party: 'R', polling: 38.2, trend: generatePollTrend(38, 2) },
    ],
    lastUpdated: '2026-04-02T08:00:00Z',
  },
  {
    id: 'sen-ca',
    type: 'Senate',
    state: 'California',
    stateAbbr: 'CA',
    district: null,
    rating: 'SAFE_D',
    candidates: [
      { name: 'Adam Schiff', party: 'D', polling: 57.5, trend: generatePollTrend(57, 2) },
      { name: 'Steve Garvey', party: 'R', polling: 37.8, trend: generatePollTrend(38, 2) },
    ],
    lastUpdated: '2026-04-03T14:00:00Z',
  },
  {
    id: 'sen-in',
    type: 'Senate',
    state: 'Indiana',
    stateAbbr: 'IN',
    district: null,
    rating: 'SAFE_R',
    candidates: [
      { name: 'Jim Banks', party: 'R', polling: 54.2, trend: generatePollTrend(54, 2) },
      { name: 'Valerie McCray', party: 'D', polling: 40.1, trend: generatePollTrend(40, 2) },
    ],
    lastUpdated: '2026-04-01T10:00:00Z',
  },
  {
    id: 'sen-mo',
    type: 'Senate',
    state: 'Missouri',
    stateAbbr: 'MO',
    district: null,
    rating: 'SAFE_R',
    candidates: [
      { name: 'Josh Hawley', party: 'R', polling: 55.8, trend: generatePollTrend(56, 2) },
      { name: 'Lucas Kunce', party: 'D', polling: 39.5, trend: generatePollTrend(39, 2) },
    ],
    lastUpdated: '2026-04-02T11:00:00Z',
  },
  {
    id: 'sen-nd',
    type: 'Senate',
    state: 'North Dakota',
    stateAbbr: 'ND',
    district: null,
    rating: 'SAFE_R',
    candidates: [
      { name: 'Kevin Cramer', party: 'R', polling: 58.5, trend: generatePollTrend(58, 2) },
      { name: 'Katrina Christiansen', party: 'D', polling: 36.2, trend: generatePollTrend(36, 2) },
    ],
    lastUpdated: '2026-04-01T09:00:00Z',
  },
  {
    id: 'sen-wv',
    type: 'Senate',
    state: 'West Virginia',
    stateAbbr: 'WV',
    district: null,
    rating: 'SAFE_R',
    candidates: [
      { name: 'Jim Justice', party: 'R', polling: 60.2, trend: generatePollTrend(60, 2) },
      { name: 'Glenn Elliott', party: 'D', polling: 34.5, trend: generatePollTrend(34, 2) },
    ],
    lastUpdated: '2026-04-01T08:00:00Z',
  },
  {
    id: 'sen-tn',
    type: 'Senate',
    state: 'Tennessee',
    stateAbbr: 'TN',
    district: null,
    rating: 'SAFE_R',
    candidates: [
      { name: 'Marsha Blackburn', party: 'R', polling: 56.5, trend: generatePollTrend(56, 2) },
      { name: 'Gloria Johnson', party: 'D', polling: 38.8, trend: generatePollTrend(39, 2) },
    ],
    lastUpdated: '2026-04-02T10:00:00Z',
  },
  {
    id: 'sen-ms',
    type: 'Senate',
    state: 'Mississippi',
    stateAbbr: 'MS',
    district: null,
    rating: 'LIKELY_R',
    candidates: [
      { name: 'Roger Wicker', party: 'R', polling: 52.5, trend: generatePollTrend(52, 3) },
      { name: 'Ty Pinkins', party: 'D', polling: 43.2, trend: generatePollTrend(43, 3) },
    ],
    lastUpdated: '2026-04-03T12:00:00Z',
  },
  {
    id: 'sen-la',
    type: 'Senate',
    state: 'Louisiana',
    stateAbbr: 'LA',
    district: null,
    rating: 'SAFE_R',
    candidates: [
      { name: 'Bill Cassidy', party: 'R', polling: 54.8, trend: generatePollTrend(55, 2) },
      { name: 'Jared Golden', party: 'D', polling: 40.5, trend: generatePollTrend(40, 2) },
    ],
    lastUpdated: '2026-04-02T14:00:00Z',
  },
  {
    id: 'sen-nm',
    type: 'Senate',
    state: 'New Mexico',
    stateAbbr: 'NM',
    district: null,
    rating: 'LIKELY_D',
    candidates: [
      { name: 'Martin Heinrich', party: 'D', polling: 50.8, trend: generatePollTrend(51, 3) },
      { name: 'Allan McCorkle', party: 'R', polling: 44.5, trend: generatePollTrend(44, 3) },
    ],
    lastUpdated: '2026-04-04T09:00:00Z',
  },
  {
    id: 'sen-co',
    type: 'Senate',
    state: 'Colorado',
    stateAbbr: 'CO',
    district: null,
    rating: 'SAFE_D',
    candidates: [
      { name: 'John Hickenlooper', party: 'D', polling: 54.2, trend: generatePollTrend(54, 2) },
      { name: 'Darryl Glenn', party: 'R', polling: 40.8, trend: generatePollTrend(41, 2) },
    ],
    lastUpdated: '2026-04-03T10:00:00Z',
  },
  {
    id: 'sen-wa',
    type: 'Senate',
    state: 'Washington',
    stateAbbr: 'WA',
    district: null,
    rating: 'SAFE_D',
    candidates: [
      { name: 'Maria Cantwell', party: 'D', polling: 55.5, trend: generatePollTrend(55, 2) },
      { name: 'Raul Garcia', party: 'R', polling: 39.2, trend: generatePollTrend(39, 2) },
    ],
    lastUpdated: '2026-04-02T16:00:00Z',
  },

  // GOVERNOR RACES (12 races)
  {
    id: 'gov-va',
    type: 'Governor',
    state: 'Virginia',
    stateAbbr: 'VA',
    district: null,
    rating: 'TOSS_UP',
    candidates: [
      { name: 'Abigail Spanberger', party: 'D', polling: 47.5, trend: generatePollTrend(47, 4) },
      { name: 'Winsome Earle-Sears', party: 'R', polling: 46.8, trend: generatePollTrend(47, 4) },
    ],
    lastUpdated: '2026-04-06T11:00:00Z',
  },
  {
    id: 'gov-nj',
    type: 'Governor',
    state: 'New Jersey',
    stateAbbr: 'NJ',
    district: null,
    rating: 'LIKELY_D',
    candidates: [
      { name: 'Mikie Sherrill', party: 'D', polling: 49.2, trend: generatePollTrend(49, 3) },
      { name: 'Jack Ciattarelli', party: 'R', polling: 45.5, trend: generatePollTrend(45, 3) },
    ],
    lastUpdated: '2026-04-05T15:00:00Z',
  },
  {
    id: 'gov-md',
    type: 'Governor',
    state: 'Maryland',
    stateAbbr: 'MD',
    district: null,
    rating: 'SAFE_D',
    candidates: [
      { name: 'Wes Moore', party: 'D', polling: 56.5, trend: generatePollTrend(56, 2) },
      { name: 'Dan Cox', party: 'R', polling: 38.2, trend: generatePollTrend(38, 2) },
    ],
    lastUpdated: '2026-04-01T14:00:00Z',
  },
  {
    id: 'gov-la',
    type: 'Governor',
    state: 'Louisiana',
    stateAbbr: 'LA',
    district: null,
    rating: 'LIKELY_R',
    candidates: [
      { name: 'Jeff Landry', party: 'R', polling: 52.8, trend: generatePollTrend(53, 3) },
      { name: 'Sharon Hewitt', party: 'D', polling: 43.5, trend: generatePollTrend(43, 3) },
    ],
    lastUpdated: '2026-04-03T11:00:00Z',
  },
  {
    id: 'gov-ms',
    type: 'Governor',
    state: 'Mississippi',
    stateAbbr: 'MS',
    district: null,
    rating: 'SAFE_R',
    candidates: [
      { name: 'Tate Reeves', party: 'R', polling: 54.2, trend: generatePollTrend(54, 2) },
      { name: 'Brandon Presley', party: 'D', polling: 41.5, trend: generatePollTrend(41, 2) },
    ],
    lastUpdated: '2026-04-02T09:00:00Z',
  },
  {
    id: 'gov-ky',
    type: 'Governor',
    state: 'Kentucky',
    stateAbbr: 'KY',
    district: null,
    rating: 'LIKELY_R',
    candidates: [
      { name: 'Daniel Cameron', party: 'R', polling: 50.5, trend: generatePollTrend(50, 3) },
      { name: 'Andy Beshear', party: 'D', polling: 46.2, trend: generatePollTrend(46, 3) },
    ],
    lastUpdated: '2026-04-04T10:00:00Z',
  },
  {
    id: 'gov-nh',
    type: 'Governor',
    state: 'New Hampshire',
    stateAbbr: 'NH',
    district: null,
    rating: 'TOSS_UP',
    candidates: [
      { name: 'Joyce Craig', party: 'D', polling: 46.8, trend: generatePollTrend(47, 4) },
      { name: 'Kelly Ayotte', party: 'R', polling: 47.2, trend: generatePollTrend(47, 4) },
    ],
    lastUpdated: '2026-04-06T07:00:00Z',
  },
  {
    id: 'gov-vt',
    type: 'Governor',
    state: 'Vermont',
    stateAbbr: 'VT',
    district: null,
    rating: 'SAFE_D',
    candidates: [
      { name: 'Phil Scott', party: 'R', polling: 55.2, trend: generatePollTrend(55, 2) },
      { name: 'Brenda Siegel', party: 'D', polling: 40.5, trend: generatePollTrend(40, 2) },
    ],
    lastUpdated: '2026-04-01T11:00:00Z',
  },
  {
    id: 'gov-ut',
    type: 'Governor',
    state: 'Utah',
    stateAbbr: 'UT',
    district: null,
    rating: 'SAFE_R',
    candidates: [
      { name: 'Spencer Cox', party: 'R', polling: 58.5, trend: generatePollTrend(58, 2) },
      { name: 'Chris Peterson', party: 'D', polling: 36.2, trend: generatePollTrend(36, 2) },
    ],
    lastUpdated: '2026-04-01T10:00:00Z',
  },
  {
    id: 'gov-id',
    type: 'Governor',
    state: 'Idaho',
    stateAbbr: 'ID',
    district: null,
    rating: 'SAFE_R',
    candidates: [
      { name: 'Brad Little', party: 'R', polling: 56.8, trend: generatePollTrend(57, 2) },
      { name: 'Stephen Heidt', party: 'D', polling: 38.5, trend: generatePollTrend(38, 2) },
    ],
    lastUpdated: '2026-04-02T08:00:00Z',
  },
  {
    id: 'gov-de',
    type: 'Governor',
    state: 'Delaware',
    stateAbbr: 'DE',
    district: null,
    rating: 'LIKELY_D',
    candidates: [
      { name: 'Matt Meyer', party: 'D', polling: 51.2, trend: generatePollTrend(51, 3) },
      { name: 'Ruth Briggs King', party: 'R', polling: 44.5, trend: generatePollTrend(44, 3) },
    ],
    lastUpdated: '2026-04-04T12:00:00Z',
  },
  {
    id: 'gov-nc',
    type: 'Governor',
    state: 'North Carolina',
    stateAbbr: 'NC',
    district: null,
    rating: 'TOSS_UP',
    candidates: [
      { name: 'Josh Stein', party: 'D', polling: 47.8, trend: generatePollTrend(48, 4) },
      { name: 'Mark Robinson', party: 'R', polling: 46.5, trend: generatePollTrend(46, 4) },
    ],
    lastUpdated: '2026-04-06T09:00:00Z',
  },

  // HOUSE RACES (35 sample races - key districts)
  {
    id: 'house-ca-13',
    type: 'House',
    state: 'California',
    stateAbbr: 'CA',
    district: 'CA-13',
    rating: 'LIKELY_D',
    candidates: [
      { name: 'John Duarte', party: 'R', polling: 46.5, trend: generatePollTrend(46, 3) },
      { name: 'Adam Gray', party: 'D', polling: 48.2, trend: generatePollTrend(48, 3) },
    ],
    lastUpdated: '2026-04-05T10:00:00Z',
  },
  {
    id: 'house-ca-22',
    type: 'House',
    state: 'California',
    stateAbbr: 'CA',
    district: 'CA-22',
    rating: 'TOSS_UP',
    candidates: [
      { name: 'David Valadao', party: 'R', polling: 47.5, trend: generatePollTrend(47, 4) },
      { name: 'Rudy Salas', party: 'D', polling: 47.2, trend: generatePollTrend(47, 4) },
    ],
    lastUpdated: '2026-04-06T08:30:00Z',
  },
  {
    id: 'house-ca-27',
    type: 'House',
    state: 'California',
    stateAbbr: 'CA',
    district: 'CA-27',
    rating: 'LIKELY_D',
    candidates: [
      { name: 'Mike Garcia', party: 'R', polling: 45.8, trend: generatePollTrend(46, 3) },
      { name: 'George Whitesides', party: 'D', polling: 48.5, trend: generatePollTrend(48, 3) },
    ],
    lastUpdated: '2026-04-04T14:00:00Z',
  },
  {
    id: 'house-ny-17',
    type: 'House',
    state: 'New York',
    stateAbbr: 'NY',
    district: 'NY-17',
    rating: 'TOSS_UP',
    candidates: [
      { name: 'Mike Lawler', party: 'R', polling: 47.8, trend: generatePollTrend(48, 4) },
      { name: 'Mondaire Jones', party: 'D', polling: 47.2, trend: generatePollTrend(47, 4) },
    ],
    lastUpdated: '2026-04-06T10:30:00Z',
  },
  {
    id: 'house-ny-19',
    type: 'House',
    state: 'New York',
    stateAbbr: 'NY',
    district: 'NY-19',
    rating: 'TOSS_UP',
    candidates: [
      { name: 'Marc Molinaro', party: 'R', polling: 47.5, trend: generatePollTrend(47, 4) },
      { name: 'Josh Riley', party: 'D', polling: 47.8, trend: generatePollTrend(48, 4) },
    ],
    lastUpdated: '2026-04-06T09:45:00Z',
  },
  {
    id: 'house-pa-01',
    type: 'House',
    state: 'Pennsylvania',
    stateAbbr: 'PA',
    district: 'PA-01',
    rating: 'LIKELY_D',
    candidates: [
      { name: 'Brian Fitzpatrick', party: 'R', polling: 45.2, trend: generatePollTrend(45, 3) },
      { name: 'Scott Wallace', party: 'D', polling: 49.5, trend: generatePollTrend(49, 3) },
    ],
    lastUpdated: '2026-04-05T12:00:00Z',
  },
  {
    id: 'house-pa-07',
    type: 'House',
    state: 'Pennsylvania',
    stateAbbr: 'PA',
    district: 'PA-07',
    rating: 'TOSS_UP',
    candidates: [
      { name: 'Susan Wild', party: 'D', polling: 47.2, trend: generatePollTrend(47, 4) },
      { name: 'Ryan Mackenzie', party: 'R', polling: 47.5, trend: generatePollTrend(47, 4) },
    ],
    lastUpdated: '2026-04-06T07:30:00Z',
  },
  {
    id: 'house-pa-08',
    type: 'House',
    state: 'Pennsylvania',
    stateAbbr: 'PA',
    district: 'PA-08',
    rating: 'LIKELY_R',
    candidates: [
      { name: 'Matt Cartwright', party: 'D', polling: 44.8, trend: generatePollTrend(45, 3) },
      { name: 'Jim Bognet', party: 'R', polling: 49.2, trend: generatePollTrend(49, 3) },
    ],
    lastUpdated: '2026-04-04T16:00:00Z',
  },
  {
    id: 'house-mi-07',
    type: 'House',
    state: 'Michigan',
    stateAbbr: 'MI',
    district: 'MI-07',
    rating: 'LIKELY_D',
    candidates: [
      { name: 'Elissa Slotkin', party: 'D', polling: 49.5, trend: generatePollTrend(49, 3) },
      { name: 'Tom Barrett', party: 'R', polling: 45.2, trend: generatePollTrend(45, 3) },
    ],
    lastUpdated: '2026-04-05T09:00:00Z',
  },
  {
    id: 'house-mi-08',
    type: 'House',
    state: 'Michigan',
    stateAbbr: 'MI',
    district: 'MI-08',
    rating: 'TOSS_UP',
    candidates: [
      { name: 'Dan Kildee', party: 'D', polling: 47.5, trend: generatePollTrend(47, 4) },
      { name: 'Paul Junge', party: 'R', polling: 47.2, trend: generatePollTrend(47, 4) },
    ],
    lastUpdated: '2026-04-06T08:00:00Z',
  },
  {
    id: 'house-wi-03',
    type: 'House',
    state: 'Wisconsin',
    stateAbbr: 'WI',
    district: 'WI-03',
    rating: 'LIKELY_D',
    candidates: [
      { name: 'Derrick Van Orden', party: 'R', polling: 45.5, trend: generatePollTrend(45, 3) },
      { name: 'Rebecca Cooke', party: 'D', polling: 48.8, trend: generatePollTrend(49, 3) },
    ],
    lastUpdated: '2026-04-05T11:00:00Z',
  },
  {
    id: 'house-wi-08',
    type: 'House',
    state: 'Wisconsin',
    stateAbbr: 'WI',
    district: 'WI-08',
    rating: 'LIKELY_R',
    candidates: [
      { name: 'Mike Gallagher', party: 'R', polling: 51.2, trend: generatePollTrend(51, 3) },
      { name: 'Tony Wied', party: 'D', polling: 44.5, trend: generatePollTrend(44, 3) },
    ],
    lastUpdated: '2026-04-04T13:00:00Z',
  },
  {
    id: 'house-az-01',
    type: 'House',
    state: 'Arizona',
    stateAbbr: 'AZ',
    district: 'AZ-01',
    rating: 'LIKELY_R',
    candidates: [
      { name: 'David Schweikert', party: 'R', polling: 49.8, trend: generatePollTrend(50, 3) },
      { name: 'Amish Shah', party: 'D', polling: 45.5, trend: generatePollTrend(45, 3) },
    ],
    lastUpdated: '2026-04-05T14:00:00Z',
  },
  {
    id: 'house-az-06',
    type: 'House',
    state: 'Arizona',
    stateAbbr: 'AZ',
    district: 'AZ-06',
    rating: 'TOSS_UP',
    candidates: [
      { name: 'Juan Ciscomani', party: 'R', polling: 47.2, trend: generatePollTrend(47, 4) },
      { name: 'Kirsten Engel', party: 'D', polling: 47.5, trend: generatePollTrend(47, 4) },
    ],
    lastUpdated: '2026-04-06T10:00:00Z',
  },
  {
    id: 'house-nv-03',
    type: 'House',
    state: 'Nevada',
    stateAbbr: 'NV',
    district: 'NV-03',
    rating: 'TOSS_UP',
    candidates: [
      { name: 'Susie Lee', party: 'D', polling: 47.5, trend: generatePollTrend(47, 4) },
      { name: 'Mark Robertson', party: 'R', polling: 47.2, trend: generatePollTrend(47, 4) },
    ],
    lastUpdated: '2026-04-06T09:00:00Z',
  },
  {
    id: 'house-nv-04',
    type: 'House',
    state: 'Nevada',
    stateAbbr: 'NV',
    district: 'NV-04',
    rating: 'LIKELY_D',
    candidates: [
      { name: 'Steven Horsford', party: 'D', polling: 49.2, trend: generatePollTrend(49, 3) },
      { name: 'Sam Peters', party: 'R', polling: 45.5, trend: generatePollTrend(45, 3) },
    ],
    lastUpdated: '2026-04-05T13:00:00Z',
  },
  {
    id: 'house-ga-06',
    type: 'House',
    state: 'Georgia',
    stateAbbr: 'GA',
    district: 'GA-06',
    rating: 'LIKELY_D',
    candidates: [
      { name: 'Rich McCormick', party: 'R', polling: 45.8, trend: generatePollTrend(46, 3) },
      { name: 'Bob Christian', party: 'D', polling: 49.2, trend: generatePollTrend(49, 3) },
    ],
    lastUpdated: '2026-04-05T10:30:00Z',
  },
  {
    id: 'house-ga-07',
    type: 'House',
    state: 'Georgia',
    stateAbbr: 'GA',
    district: 'GA-07',
    rating: 'LIKELY_D',
    candidates: [
      { name: 'Lucy McBath', party: 'D', polling: 50.5, trend: generatePollTrend(50, 3) },
      { name: 'Rich McCormick', party: 'R', polling: 44.8, trend: generatePollTrend(45, 3) },
    ],
    lastUpdated: '2026-04-04T15:00:00Z',
  },
  {
    id: 'house-nc-01',
    type: 'House',
    state: 'North Carolina',
    stateAbbr: 'NC',
    district: 'NC-01',
    rating: 'SAFE_D',
    candidates: [
      { name: 'Don Davis', party: 'D', polling: 54.2, trend: generatePollTrend(54, 2) },
      { name: 'Laurie Buckhout', party: 'R', polling: 41.5, trend: generatePollTrend(41, 2) },
    ],
    lastUpdated: '2026-04-03T10:00:00Z',
  },
  {
    id: 'house-nc-13',
    type: 'House',
    state: 'North Carolina',
    stateAbbr: 'NC',
    district: 'NC-13',
    rating: 'TOSS_UP',
    candidates: [
      { name: 'Wiley Nickel', party: 'D', polling: 47.5, trend: generatePollTrend(47, 4) },
      { name: 'Brad Knott', party: 'R', polling: 47.2, trend: generatePollTrend(47, 4) },
    ],
    lastUpdated: '2026-04-06T08:30:00Z',
  },
  {
    id: 'house-tx-07',
    type: 'House',
    state: 'Texas',
    stateAbbr: 'TX',
    district: 'TX-07',
    rating: 'LIKELY_D',
    candidates: [
      { name: 'Lizzie Fletcher', party: 'D', polling: 50.2, trend: generatePollTrend(50, 3) },
      { name: 'Wesley Hunt', party: 'R', polling: 45.5, trend: generatePollTrend(45, 3) },
    ],
    lastUpdated: '2026-04-05T11:30:00Z',
  },
  {
    id: 'house-tx-23',
    type: 'House',
    state: 'Texas',
    stateAbbr: 'TX',
    district: 'TX-23',
    rating: 'TOSS_UP',
    candidates: [
      { name: 'Tony Gonzales', party: 'R', polling: 47.8, trend: generatePollTrend(48, 4) },
      { name: 'Gina Ortiz Jones', party: 'D', polling: 47.5, trend: generatePollTrend(47, 4) },
    ],
    lastUpdated: '2026-04-06T10:00:00Z',
  },
  {
    id: 'house-tx-34',
    type: 'House',
    state: 'Texas',
    stateAbbr: 'TX',
    district: 'TX-34',
    rating: 'LIKELY_D',
    candidates: [
      { name: 'Vicente Gonzalez', party: 'D', polling: 50.5, trend: generatePollTrend(50, 3) },
      { name: 'Mayra Flores', party: 'R', polling: 45.2, trend: generatePollTrend(45, 3) },
    ],
    lastUpdated: '2026-04-05T09:30:00Z',
  },
  {
    id: 'house-fl-26',
    type: 'House',
    state: 'Florida',
    stateAbbr: 'FL',
    district: 'FL-26',
    rating: 'LIKELY_R',
    candidates: [
      { name: 'Mario Diaz-Balart', party: 'R', polling: 51.5, trend: generatePollTrend(51, 3) },
      { name: 'Phil Ehr', party: 'D', polling: 44.8, trend: generatePollTrend(45, 3) },
    ],
    lastUpdated: '2026-04-04T14:30:00Z',
  },
  {
    id: 'house-fl-27',
    type: 'House',
    state: 'Florida',
    stateAbbr: 'FL',
    district: 'FL-27',
    rating: 'LIKELY_R',
    candidates: [
      { name: 'Maria Elvira Salazar', party: 'R', polling: 50.8, trend: generatePollTrend(51, 3) },
      { name: 'Annette Taddeo', party: 'D', polling: 45.2, trend: generatePollTrend(45, 3) },
    ],
    lastUpdated: '2026-04-04T15:30:00Z',
  },
  {
    id: 'house-oh-09',
    type: 'House',
    state: 'Ohio',
    stateAbbr: 'OH',
    district: 'OH-09',
    rating: 'TOSS_UP',
    candidates: [
      { name: 'Marcy Kaptur', party: 'D', polling: 47.2, trend: generatePollTrend(47, 4) },
      { name: 'Derek Merrin', party: 'R', polling: 47.5, trend: generatePollTrend(47, 4) },
    ],
    lastUpdated: '2026-04-06T07:00:00Z',
  },
  {
    id: 'house-oh-13',
    type: 'House',
    state: 'Ohio',
    stateAbbr: 'OH',
    district: 'OH-13',
    rating: 'LIKELY_D',
    candidates: [
      { name: 'Emilia Sykes', party: 'D', polling: 49.5, trend: generatePollTrend(49, 3) },
      { name: 'Kevin Goldschmidt', party: 'R', polling: 45.2, trend: generatePollTrend(45, 3) },
    ],
    lastUpdated: '2026-04-05T10:00:00Z',
  },
  {
    id: 'house-ia-01',
    type: 'House',
    state: 'Iowa',
    stateAbbr: 'IA',
    district: 'IA-01',
    rating: 'LIKELY_R',
    candidates: [
      { name: 'Mariannette Miller-Meeks', party: 'R', polling: 50.2, trend: generatePollTrend(50, 3) },
      { name: 'Christina Bohannan', party: 'D', polling: 45.5, trend: generatePollTrend(45, 3) },
    ],
    lastUpdated: '2026-04-05T12:30:00Z',
  },
  {
    id: 'house-ia-03',
    type: 'House',
    state: 'Iowa',
    stateAbbr: 'IA',
    district: 'IA-03',
    rating: 'TOSS_UP',
    candidates: [
      { name: 'Zach Nunn', party: 'R', polling: 47.5, trend: generatePollTrend(47, 4) },
      { name: 'Cindy Axne', party: 'D', polling: 47.2, trend: generatePollTrend(47, 4) },
    ],
    lastUpdated: '2026-04-06T09:30:00Z',
  },
  {
    id: 'house-nm-02',
    type: 'House',
    state: 'New Mexico',
    stateAbbr: 'NM',
    district: 'NM-02',
    rating: 'LIKELY_D',
    candidates: [
      { name: 'Gabe Vasquez', party: 'D', polling: 49.8, trend: generatePollTrend(50, 3) },
      { name: 'Yvette Herrell', party: 'R', polling: 45.5, trend: generatePollTrend(45, 3) },
    ],
    lastUpdated: '2026-04-05T11:00:00Z',
  },
  {
    id: 'house-me-02',
    type: 'House',
    state: 'Maine',
    stateAbbr: 'ME',
    district: 'ME-02',
    rating: 'TOSS_UP',
    candidates: [
      { name: 'Jared Golden', party: 'D', polling: 47.5, trend: generatePollTrend(47, 4) },
      { name: 'Austin Theriault', party: 'R', polling: 47.2, trend: generatePollTrend(47, 4) },
    ],
    lastUpdated: '2026-04-06T08:00:00Z',
  },
  {
    id: 'house-nh-01',
    type: 'House',
    state: 'New Hampshire',
    stateAbbr: 'NH',
    district: 'NH-01',
    rating: 'LIKELY_D',
    candidates: [
      { name: 'Chris Pappas', party: 'D', polling: 49.5, trend: generatePollTrend(49, 3) },
      { name: 'Matt Mowers', party: 'R', polling: 45.8, trend: generatePollTrend(46, 3) },
    ],
    lastUpdated: '2026-04-05T10:30:00Z',
  },
  {
    id: 'house-nh-02',
    type: 'House',
    state: 'New Hampshire',
    stateAbbr: 'NH',
    district: 'NH-02',
    rating: 'LIKELY_D',
    candidates: [
      { name: 'Annie Kuster', party: 'D', polling: 50.2, trend: generatePollTrend(50, 3) },
      { name: 'Mike Vlacich', party: 'R', polling: 45.5, trend: generatePollTrend(45, 3) },
    ],
    lastUpdated: '2026-04-05T09:00:00Z',
  },
  {
    id: 'house-ak-al',
    type: 'House',
    state: 'Alaska',
    stateAbbr: 'AK',
    district: 'AK-AL',
    rating: 'LIKELY_R',
    candidates: [
      { name: 'Nick Begich III', party: 'R', polling: 49.5, trend: generatePollTrend(49, 3) },
      { name: 'Mary Peltola', party: 'D', polling: 46.2, trend: generatePollTrend(46, 3) },
    ],
    lastUpdated: '2026-04-05T14:00:00Z',
  },
];

// State to SVG path mapping for react-simple-maps
export const stateAbbreviations = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
  'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
  'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
  'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
  'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
  'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
  'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
  'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
  'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
  'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
  'Wisconsin': 'WI', 'Wyoming': 'WY',
};

// Mock ticker updates
export const tickerUpdates = [
  { id: 1, text: 'Arizona Senate: Toss-up → Likely R', time: '2m ago' },
  { id: 2, text: 'NY-17: Lawler (R) +0.6 → Toss-up', time: '5m ago' },
  { id: 3, text: 'Pennsylvania Senate: Toss-up → Lean D', time: '12m ago' },
  { id: 4, text: 'Georgia Governor: Toss-up → Lean D', time: '18m ago' },
  { id: 5, text: 'TX-23: Gonzales (R) drops 2 pts', time: '25m ago' },
  { id: 6, text: 'Wisconsin Senate: New poll shows Baldwin +1', time: '32m ago' },
  { id: 7, text: 'Nevada Senate: Rosen (D) holds narrow lead', time: '45m ago' },
  { id: 8, text: 'Virginia Governor: Spanberger (D) +0.7', time: '1h ago' },
];

// Service layer for easy API swap
export async function fetchRaces(filters = {}) {
  // In production, replace with: return fetch(`/api/races?${new URLSearchParams(filters)}`).then(r => r.json())
  let filtered = [...races];

  if (filters.type) {
    filtered = filtered.filter(r => r.type === filters.type);
  }
  if (filters.rating) {
    filtered = filtered.filter(r => r.rating === filters.rating);
  }
  if (filters.state) {
    filtered = filtered.filter(r => r.state === filters.state);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(r =>
      r.state.toLowerCase().includes(q) ||
      r.district?.toLowerCase().includes(q) ||
      r.candidates.some(c => c.name.toLowerCase().includes(q))
    );
  }

  return filtered;
}

export async function fetchSeatCounts() {
  // In production, replace with API call
  const senate = races.filter(r => r.type === 'Senate');
  const dem = senate.filter(r => r.rating === 'SAFE_D' || r.rating === 'LIKELY_D').length;
  const rep = senate.filter(r => r.rating === 'SAFE_R' || r.rating === 'LIKELY_R').length;
  const toss = senate.filter(r => r.rating === 'TOSS_UP').length;
  return { dem, rep, toss, total: 100 };
}

export async function fetchStateRaces(state) {
  // In production, replace with API call
  return races.filter(r => r.state === state);
}

export async function fetchTickerUpdates() {
  // In production, replace with API call or WebSocket
  return tickerUpdates;
}

export async function fetchRaceById(id) {
  // In production, replace with API call
  return races.find(r => r.id === id);
}
