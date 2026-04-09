import { CURRENT_STATEWIDE_DATA, FIPS_TO_ABBR, STATES, STATES_BY_ABBR, type PartyCode, type StateMeta } from './us-state-meta';

export type OverlayKey = 'house' | 'senate' | 'governor' | 'president';

export type HouseDistrict = {
  id: string;
  stateAbbr: string;
  stateName: string;
  districtCode: string;
  districtLabel: string;
  memberName: string;
  party: PartyCode | 'Vacant';
  vacant: boolean;
  geometry: GeoJSON.Feature['geometry'];
};

export type HouseSummary = {
  dem: number;
  rep: number;
  ind: number;
  vacant: number;
  total: number;
};

export type StateBoard = StateMeta & {
  governor: { name: string; party: PartyCode };
  senators: Array<{ name: string; party: PartyCode }>;
  presidentialWinner2024: PartyCode;
  house: HouseSummary;
};

const HOUSE_ENDPOINT = 'https://services6.arcgis.com/ptshVLGaRNLSS3T1/arcgis/rest/services/Congressional_Districts/FeatureServer/2/query';

const PARTY_TONES: Record<PartyCode | 'Vacant' | 'Split', { label: string; fill: string; tint: string; text: string }> = {
  D: { label: 'Democratic', fill: '#2563eb', tint: '#dbeafe', text: '#1d4ed8' },
  R: { label: 'Republican', fill: '#dc2626', tint: '#fee2e2', text: '#b91c1c' },
  I: { label: 'Independent', fill: '#0f766e', tint: '#ccfbf1', text: '#0f766e' },
  Vacant: { label: 'Vacant', fill: '#94a3b8', tint: '#e2e8f0', text: '#475569' },
  Split: { label: 'Split', fill: '#9a7b19', tint: '#fef3c7', text: '#92400e' },
};

function getJsonUrl(params: Record<string, string>) {
  return `${HOUSE_ENDPOINT}?${new URLSearchParams(params).toString()}`;
}

function normalizePartyCode(value: string | null | undefined): PartyCode | 'Vacant' {
  if (value === 'D' || value === 'R' || value === 'I') return value;
  return 'Vacant';
}

function buildEmptyHouseSummary(): HouseSummary {
  return { dem: 0, rep: 0, ind: 0, vacant: 0, total: 0 };
}

function formatDistrictLabel(stateAbbr: string, districtCode: string) {
  if (districtCode === '00') return `${stateAbbr} At-large`;
  return `${stateAbbr}-${districtCode}`;
}

export function getPartyTone(party: PartyCode | 'Vacant' | 'Split') {
  return PARTY_TONES[party];
}

export function getHouseMajority(summary: HouseSummary): PartyCode | 'I' | 'Vacant' | 'Split' {
  const ranked = [
    { key: 'D' as const, value: summary.dem },
    { key: 'R' as const, value: summary.rep },
    { key: 'I' as const, value: summary.ind },
    { key: 'Vacant' as const, value: summary.vacant },
  ].sort((left, right) => right.value - left.value);

  if (ranked[0].value === ranked[1].value) return 'Split';
  return ranked[0].key;
}

export function getSenateControl(stateAbbr: string): PartyCode | 'Split' {
  const senators = CURRENT_STATEWIDE_DATA[stateAbbr]?.senators ?? [];
  if (senators.length !== 2) return 'Split';
  return senators[0].party === senators[1].party ? senators[0].party : 'Split';
}

export function getOverlayParty(board: StateBoard, overlay: OverlayKey): PartyCode | 'Vacant' | 'Split' {
  if (overlay === 'house') return getHouseMajority(board.house);
  if (overlay === 'senate') return getSenateControl(board.abbr);
  if (overlay === 'governor') return board.governor.party;
  return board.presidentialWinner2024;
}

export function getOverlayDetail(board: StateBoard, overlay: OverlayKey) {
  if (overlay === 'house') {
    return `${board.house.dem} D | ${board.house.rep} R | ${board.house.ind} I | ${board.house.vacant} vacant`;
  }
  if (overlay === 'senate') {
    return board.senators.map((senator) => `${senator.name} (${senator.party})`).join(' | ');
  }
  if (overlay === 'governor') {
    return `${board.governor.name} (${board.governor.party})`;
  }
  return `${board.presidentialWinner2024 === 'D' ? 'Democratic' : 'Republican'} statewide winner in 2024`;
}

export function buildInitialStateBoards() {
  return Object.fromEntries(
    STATES.map((state) => {
      const statewide = CURRENT_STATEWIDE_DATA[state.abbr];
      return [
        state.abbr,
        {
          ...state,
          governor: statewide.governor,
          senators: statewide.senators,
          presidentialWinner2024: statewide.presidentialWinner2024,
          house: buildEmptyHouseSummary(),
        } satisfies StateBoard,
      ];
    }),
  ) as Record<string, StateBoard>;
}

export async function fetchHouseSummaries() {
  const response = await fetch(
    getJsonUrl({
      where: '1=1',
      outFields: 'STATEFP,PARTY,VACANT,CD119FP',
      returnGeometry: 'false',
      f: 'json',
    }),
  );

  if (!response.ok) {
    throw new Error(`House summary request failed with ${response.status}`);
  }

  const payload = await response.json();
  const summaries = Object.fromEntries(STATES.map((state) => [state.abbr, buildEmptyHouseSummary()])) as Record<string, HouseSummary>;

  for (const feature of payload.features ?? []) {
    const attributes = feature.attributes ?? {};
    if (attributes.CD119FP === 'ZZ') continue;

    const stateAbbr = FIPS_TO_ABBR[String(attributes.STATEFP).padStart(2, '0')];
    if (!stateAbbr) continue;

    const summary = summaries[stateAbbr];
    summary.total += 1;

    if (attributes.VACANT === 'Y') {
      summary.vacant += 1;
      continue;
    }

    const party = normalizePartyCode(attributes.PARTY);
    if (party === 'D') summary.dem += 1;
    else if (party === 'R') summary.rep += 1;
    else if (party === 'I') summary.ind += 1;
    else summary.vacant += 1;
  }

  return summaries;
}

export async function fetchDistrictsForState(stateAbbr: string) {
  const state = STATES_BY_ABBR[stateAbbr];
  if (!state) return [];

  const response = await fetch(
    getJsonUrl({
      where: `STATEFP='${state.fips}'`,
      outFields: 'STATEFP,STNAME,PARTY,VACANT,CD119FP,GEOID,DisplayName,GeoDisplay',
      returnGeometry: 'true',
      f: 'geojson',
    }),
  );

  if (!response.ok) {
    throw new Error(`District request failed with ${response.status}`);
  }

  const payload = await response.json();
  const features = (payload.features ?? []) as GeoJSON.Feature[];

  return features
    .map((feature) => {
      const properties = (feature.properties ?? {}) as Record<string, string>;
      const districtCode = properties.CD119FP;
      if (!districtCode || districtCode === 'ZZ') return null;

      const vacant = properties.VACANT === 'Y';
      return {
        id: properties.GEOID,
        stateAbbr,
        stateName: state.name,
        districtCode,
        districtLabel: formatDistrictLabel(stateAbbr, districtCode),
        memberName: vacant ? 'Vacant' : properties.DisplayName ?? 'Unknown member',
        party: vacant ? 'Vacant' : normalizePartyCode(properties.PARTY),
        vacant,
        geometry: feature.geometry,
      } satisfies HouseDistrict;
    })
    .filter(Boolean)
    .sort((left, right) => Number(left!.districtCode) - Number(right!.districtCode)) as HouseDistrict[];
}
