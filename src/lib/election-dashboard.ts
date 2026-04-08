// @ts-nocheck
import { feature } from 'topojson-client';
import countiesAtlas from 'us-atlas/counties-10m.json';
import { PARTIES, RACE_RATINGS, races } from '../data/elections';
import { STATES_BY_ABBR, getStateSummary, getTrackedStateRaces } from './election-states';

export const HISTORY_LABELS = {
  current: 'Current forecast',
  '2020': '2020 result',
  '2022': '2022 result',
  change: 'Change vs previous',
  swing: 'Swing since last election',
};

export const OVERLAY_LABELS = {
  Presidential: 'Presidential',
  Senate: 'Senate only',
  Governor: 'Governor only',
  House: 'House',
  Generic: 'Generic ballot',
};

export const PRESET_SCENARIOS = [
  { id: 'blue-wall', label: 'Blue Wall holds', locks: { PA: 'D', MI: 'D', WI: 'D' } },
  { id: 'sun-belt-gop', label: 'Republicans sweep Sun Belt', locks: { AZ: 'R', GA: 'R', NV: 'R', NC: 'R' } },
  { id: 'dem-pa', label: 'Democrats win Pennsylvania', locks: { PA: 'D' } },
  { id: 'red-wave', label: 'Red Wave', locks: { AZ: 'R', GA: 'R', MI: 'R', NV: 'R', NH: 'R', NC: 'R', PA: 'R', WI: 'R' } },
];

const COUNTY_FEATURES = feature(countiesAtlas, countiesAtlas.objects.counties).features;

function hashValue(input) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function marginFromRating(ratingKey) {
  return {
    SAFE_D: 13,
    LIKELY_D: 8,
    LEAN_D: 3.5,
    TOSS_UP: 0.4,
    LEAN_R: -3.5,
    LIKELY_R: -8,
    SAFE_R: -13,
  }[ratingKey] ?? 0;
}

function colorFromMargin(margin) {
  if (margin >= 10) return '#3d74f5';
  if (margin >= 5) return '#6d95ff';
  if (margin >= 1) return '#8eb5ff';
  if (margin > -1) return '#d0ab67';
  if (margin > -5) return '#f09b96';
  if (margin > -10) return '#de6661';
  return '#b73f45';
}

function shiftMargin(baseMargin, historyMode, seed) {
  const drift = ((seed % 9) - 4) * 0.45;
  if (historyMode === 'current') return baseMargin;
  if (historyMode === '2020') return baseMargin - 1.8 + drift;
  if (historyMode === '2022') return baseMargin - 0.8 + drift;
  if (historyMode === 'change') return clamp(baseMargin - (baseMargin - 1.8 + drift), -12, 12);
  if (historyMode === 'swing') return clamp((baseMargin - (baseMargin - 0.8 + drift)) * 1.2, -12, 12);
  return baseMargin;
}

export function leaderForRace(race, historyMode = 'current') {
  const sorted = [...race.candidates].sort((left, right) => right.polling - left.polling);
  const first = sorted[0];
  const second = sorted[1];
  const baseMargin = first && second ? first.polling - second.polling : marginFromRating(race.rating);
  const seed = hashValue(`${race.id}:${historyMode}`);
  const margin = shiftMargin(baseMargin, historyMode, seed);
  return {
    leader: first,
    runnerUp: second,
    margin,
    color: colorFromMargin(margin),
  };
}

function raceForOverlay(abbr, overlayMode) {
  const stateRaces = getTrackedStateRaces(abbr);
  if (overlayMode === 'Generic') {
    return {
      id: `generic-${abbr}`,
      type: 'Generic',
      stateAbbr: abbr,
      state: STATES_BY_ABBR[abbr]?.name ?? abbr,
      rating: getStateSummary(abbr).ratingKey,
      candidates: [
        { name: 'Generic D', party: 'D', polling: 48.5, trend: [46.2, 46.9, 47.4, 48.1, 48.5] },
        { name: 'Generic R', party: 'R', polling: 45.9, trend: [47.8, 47.3, 46.8, 46.1, 45.9] },
      ],
      lastUpdated: new Date().toISOString(),
    };
  }

  const direct = stateRaces.find((race) => race.type === overlayMode);
  if (direct) return direct;
  return stateRaces[0] ?? {
    id: `fallback-${abbr}`,
    type: overlayMode,
    stateAbbr: abbr,
    state: STATES_BY_ABBR[abbr]?.name ?? abbr,
    rating: getStateSummary(abbr).ratingKey,
    candidates: [
      { name: 'Democratic coalition', party: 'D', polling: 49, trend: [47.3, 47.9, 48.1, 48.7, 49] },
      { name: 'Republican coalition', party: 'R', polling: 46.2, trend: [47.4, 47.1, 46.8, 46.5, 46.2] },
    ],
    lastUpdated: new Date().toISOString(),
  };
}

export function getOverlayFillForState(abbr, overlayMode, historyMode, scenarioLocks = {}) {
  const forcedParty = scenarioLocks[abbr];
  if (forcedParty === 'D') return '#3d74f5';
  if (forcedParty === 'R') return '#c95157';
  const race = raceForOverlay(abbr, overlayMode);
  return leaderForRace(race, historyMode).color;
}

export function getMapHeadline(abbr, overlayMode, historyMode, scenarioLocks = {}) {
  const race = raceForOverlay(abbr, overlayMode);
  const state = STATES_BY_ABBR[abbr];
  const leader = leaderForRace(race, historyMode);
  const forcedParty = scenarioLocks[abbr];
  return {
    state,
    race,
    leader,
    forcedParty,
    title: `${state?.name ?? abbr} ${OVERLAY_LABELS[overlayMode]}`,
    subtitle: forcedParty
      ? `Scenario lock: ${forcedParty === 'D' ? 'Democratic hold' : 'Republican pickup'}`
      : `${HISTORY_LABELS[historyMode]} | ${leader.leader?.name ?? 'Coalition lead'} ${leader.margin >= 0 ? '+' : ''}${leader.margin.toFixed(1)}`,
  };
}

export function getRaceGroups(allRaces, filters) {
  const query = (filters.search ?? '').toLowerCase();
  const filtered = allRaces.filter((race) => {
    if (filters.overlayMode && filters.overlayMode !== 'Generic' && race.type !== filters.overlayMode) return false;
    if (!filters.search) return true;
    return race.state.toLowerCase().includes(query) ||
      race.district?.toLowerCase().includes(query) ||
      race.candidates.some((candidate) => candidate.name.toLowerCase().includes(query));
  });

  return {
    tossups: filtered.filter((race) => race.rating === 'TOSS_UP'),
    senate: filtered.filter((race) => race.type === 'Senate'),
    governor: filtered.filter((race) => race.type === 'Governor'),
    house: filtered.filter((race) => race.type === 'House'),
    battlegrounds: filtered.filter((race) => ['AZ', 'GA', 'MI', 'NV', 'NC', 'PA', 'WI'].includes(race.stateAbbr)),
  };
}

export function getScenarioSummary(overlayMode, locks = {}) {
  const trackedStates = Object.keys(STATES_BY_ABBR).filter((abbr) => STATES_BY_ABBR[abbr].electoralVotes > 0);
  const electoral = trackedStates.reduce((accumulator, abbr) => {
    const summary = getStateSummary(abbr);
    const lock = locks[abbr];
    const democratic = lock ? lock === 'D' : summary.ratingKey.includes('_D');
    return {
      dem: accumulator.dem + (democratic ? summary.electoralVotes : 0),
      rep: accumulator.rep + (!democratic ? summary.electoralVotes : 0),
    };
  }, { dem: 0, rep: 0 });

  const filtered = races.filter((race) => overlayMode === 'Generic' ? race.type !== 'House' : race.type === overlayMode);
  const chamber = filtered.reduce((accumulator, race) => {
    const lock = race.stateAbbr ? locks[race.stateAbbr] : undefined;
    const leader = lock ? { leader: { party: lock }, margin: lock === 'D' ? 12 : -12 } : leaderForRace(race, 'current');
    if (leader.leader?.party === 'D') accumulator.dem += 1;
    else if (leader.leader?.party === 'R') accumulator.rep += 1;
    else accumulator.other += 1;
    return accumulator;
  }, { dem: 0, rep: 0, other: 0 });

  const tipping = races
    .filter((race) => ['Presidential', 'Senate', 'Governor', 'House'].includes(race.type))
    .map((race) => ({ race, margin: Math.abs(leaderForRace(race, 'current').margin) }))
    .sort((left, right) => left.margin - right.margin)
    .slice(0, 5)
    .map((item) => item.race);

  return { electoral, chamber, tipping, presets: PRESET_SCENARIOS };
}

export function getScenarioTimeline(locks = {}) {
  return Object.entries(locks)
    .filter(([, party]) => party)
    .map(([stateAbbr, party], index) => ({
      id: `${stateAbbr}-${party}-${index}`,
      stateAbbr,
      party,
      timestamp: new Date(Date.now() - index * 1000 * 60 * 7).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));
}

export function getCandidateProfile(candidateName, stateAbbr, raceType) {
  const seed = hashValue(candidateName + stateAbbr + raceType);
  const candidateRace = races.find((race) => race.candidates.some((candidate) => candidate.name === candidateName));
  const candidate = candidateRace?.candidates.find((entry) => entry.name === candidateName);
  const party = PARTIES[candidate?.party ?? 'I'];
  const age = 40 + (seed % 28);
  const fundraising = 7.5 + (seed % 180) / 10;
  const portraitStyle = candidate?.party === 'D'
    ? 'linear-gradient(135deg, #315fe8 0%, #7ca4ff 100%)'
    : candidate?.party === 'R'
      ? 'linear-gradient(135deg, #8f2532 0%, #dd6a6f 100%)'
      : 'linear-gradient(135deg, #4b5563 0%, #9ca3af 100%)';
  const slug = candidateName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return {
    name: candidateName,
    party,
    state: STATES_BY_ABBR[stateAbbr]?.name ?? stateAbbr,
    raceType,
    age,
    currentOffice: raceType === 'Senate' ? 'U.S. Senate candidate' : raceType === 'Governor' ? 'Gubernatorial candidate' : 'Federal candidate',
    fundraising: `$${fundraising.toFixed(1)}M`,
    endorsements: ['Labor coalition', 'Metro mayors caucus', 'State legislative leaders'].slice(0, 2 + (seed % 2)),
    trend: candidate?.trend ?? [43, 44, 45, 46, 47],
    favorability: 42 + (seed % 13),
    bio: `${candidateName} is positioned as a ${party.label.toLowerCase()} standard-bearer in ${STATES_BY_ABBR[stateAbbr]?.name ?? stateAbbr}, running on a coalition of urban turnout, suburban persuasion, and targeted fundraising efficiency.`,
    headlines: [
      `${candidateName} sharpens closing argument in ${STATES_BY_ABBR[stateAbbr]?.name ?? stateAbbr}`,
      `New polling snapshot shows movement in the ${raceType.toLowerCase()} contest`,
      `${candidateName} expands media buy as the map tightens`,
    ],
    links: {
      campaign: `https://www.google.com/search?q=${encodeURIComponent(candidateName + ' campaign')}`,
      x: `https://x.com/search?q=${encodeURIComponent(candidateName)}`,
      instagram: `https://www.instagram.com/explore/tags/${slug.replace(/-/g, '')}/`,
    },
    portraitStyle,
  };
}

export function getCountyFeaturesForState(abbr) {
  const fips = STATES_BY_ABBR[abbr]?.fips;
  return COUNTY_FEATURES.filter((county) => String(county.id).startsWith(fips));
}

export function getCountyDashboardData(abbr, overlayMode, historyMode) {
  const baseRace = raceForOverlay(abbr, overlayMode);
  const baseMargin = leaderForRace(baseRace, historyMode).margin;
  return getCountyFeaturesForState(abbr).map((county) => {
    const seed = hashValue(`${county.id}:${overlayMode}:${historyMode}`);
    const margin = clamp(baseMargin + ((seed % 160) / 10 - 8), -28, 28);
    const democraticShare = clamp(50 + margin / 2, 18, 79);
    const republicanShare = clamp(50 - margin / 2, 18, 79);
    const previous = clamp(margin - (((seed >> 2) % 40) / 10 - 2), -28, 28);
    return {
      id: String(county.id),
      name: county.properties.name,
      geometry: county,
      margin,
      voteShare: { D: Number(democraticShare.toFixed(1)), R: Number(republicanShare.toFixed(1)) },
      previous,
      fill: colorFromMargin(historyMode === 'change' || historyMode === 'swing' ? margin * 1.35 : margin),
    };
  });
}

export function getDistrictOverlayData(abbr, historyMode) {
  const houseRaces = getTrackedStateRaces(abbr).filter((race) => race.type === 'House');
  if (houseRaces.length === 0) return [];

  const counties = getCountyFeaturesForState(abbr);
  return counties.map((county) => {
    const seed = hashValue(`${county.id}:${abbr}`);
    const districtRace = houseRaces[seed % houseRaces.length];
    const leader = leaderForRace(districtRace, historyMode);
    return {
      id: String(county.id),
      countyName: county.properties.name,
      district: districtRace.district,
      race: districtRace,
      geometry: county,
      fill: leader.color,
      margin: leader.margin,
    };
  });
}

export function getRaceCardModel(race, historyMode = 'current') {
  const leader = leaderForRace(race, historyMode);
  const rating = RACE_RATINGS[race.rating];
  const previous = shiftMargin(leader.margin, '2022', hashValue(race.id));
  return { ...race, leader, rating, previous, delta: leader.margin - previous };
}

export function getAllRaces() {
  return races;
}

export function getPartyAccent(party) {
  return PARTIES[party]?.color ?? '#94a3b8';
}
