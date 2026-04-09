export type PartyCode = 'D' | 'R' | 'I' | 'Vacant';

export type HouseDistrict = {
  id: string;
  stateAbbr: string;
  stateName: string;
  districtCode: string;
  districtLabel: string;
  memberName: string;
  party: PartyCode;
  vacant: boolean;
  geometry: GeoJSON.Feature['geometry'];
};

const PRIMARY_DISTRICTS_ENDPOINT =
  'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_116th_Congressional_Districts/FeatureServer/0/query?where=1%3D1&outFields=*&f=geojson';

const FALLBACK_DISTRICTS_ENDPOINT =
  'https://services6.arcgis.com/ptshVLGaRNLSS3T1/arcgis/rest/services/Congressional_Districts/FeatureServer/2/query?where=1%3D1&outFields=STATEFP%2CSTNAME%2CPARTY%2CVACANT%2CCD119FP%2CGEOID%2CDisplayName&returnGeometry=true&f=geojson';

const STATE_ABBR_BY_FIPS: Record<string, string> = {
  '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA', '08': 'CO', '09': 'CT', '10': 'DE', '11': 'DC',
  '12': 'FL', '13': 'GA', '15': 'HI', '16': 'ID', '17': 'IL', '18': 'IN', '19': 'IA', '20': 'KS', '21': 'KY',
  '22': 'LA', '23': 'ME', '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN', '28': 'MS', '29': 'MO', '30': 'MT',
  '31': 'NE', '32': 'NV', '33': 'NH', '34': 'NJ', '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND', '39': 'OH',
  '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI', '45': 'SC', '46': 'SD', '47': 'TN', '48': 'TX', '49': 'UT',
  '50': 'VT', '51': 'VA', '53': 'WA', '54': 'WV', '55': 'WI', '56': 'WY',
};

function normalizeParty(value: string | null | undefined): PartyCode {
  if (value === 'D' || value === 'R' || value === 'I') return value;
  return 'Vacant';
}

function formatDistrictLabel(stateAbbr: string, districtCode: string) {
  if (districtCode === '00') return `${stateAbbr}-AL`;
  return `${stateAbbr}-${districtCode.padStart(2, '0')}`;
}

function firstDefined(properties: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = properties[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number') return String(value);
  }
  return '';
}

function normalizeDistrictFromPrimary(feature: GeoJSON.Feature): HouseDistrict | null {
  const properties = (feature.properties ?? {}) as Record<string, unknown>;
  const stateAbbr = firstDefined(properties, ['STATE_ABBR', 'STATEABBR', 'ST_ABBREV', 'STUSPS']);
  const districtCode = firstDefined(properties, ['CDFIPS', 'DISTRICTID', 'DISTRICT', 'CD', 'CD116FP', 'CD119FP']).replace(/^0+(\d)$/, '0$1');
  if (!stateAbbr || !districtCode) return null;

  const memberName = firstDefined(properties, ['REP_NAME', 'NAME', 'MEMBER_NAME', 'DisplayName', 'REPRESENTATIVE']) || 'Unknown member';
  const rawParty = firstDefined(properties, ['PARTY', 'PARTY_ABBR', 'PARTYAFFIL']);
  const vacant = memberName.toLowerCase() === 'vacant' || rawParty.toUpperCase() === 'VACANT';
  const party = vacant ? 'Vacant' : normalizeParty(rawParty);

  return {
    id: firstDefined(properties, ['OBJECTID', 'GEOID', 'FID', 'DISTRICTID']) || `${stateAbbr}-${districtCode}`,
    stateAbbr,
    stateName: firstDefined(properties, ['STATE_NAME', 'STATE', 'STNAME']) || stateAbbr,
    districtCode,
    districtLabel: formatDistrictLabel(stateAbbr, districtCode),
    memberName: vacant ? 'Vacant' : memberName,
    party,
    vacant,
    geometry: feature.geometry,
  };
}

function normalizeDistrictFromFallback(feature: GeoJSON.Feature): HouseDistrict | null {
  const properties = (feature.properties ?? {}) as Record<string, unknown>;
  const stateFips = firstDefined(properties, ['STATEFP']).padStart(2, '0');
  const stateAbbr = STATE_ABBR_BY_FIPS[stateFips];
  const districtCode = firstDefined(properties, ['CD119FP']);
  if (!stateAbbr || !districtCode || districtCode === 'ZZ') return null;

  const vacant = firstDefined(properties, ['VACANT']) === 'Y';
  return {
    id: firstDefined(properties, ['GEOID', 'OBJECTID']) || `${stateAbbr}-${districtCode}`,
    stateAbbr,
    stateName: firstDefined(properties, ['STNAME']) || stateAbbr,
    districtCode,
    districtLabel: formatDistrictLabel(stateAbbr, districtCode),
    memberName: vacant ? 'Vacant' : firstDefined(properties, ['DisplayName']) || 'Unknown member',
    party: vacant ? 'Vacant' : normalizeParty(firstDefined(properties, ['PARTY'])),
    vacant,
    geometry: feature.geometry,
  };
}

async function fetchGeoJson(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }
  return response.json();
}

export async function fetchNationalDistricts() {
  try {
    const payload = await fetchGeoJson(PRIMARY_DISTRICTS_ENDPOINT);
    const districts = ((payload.features ?? []) as GeoJSON.Feature[])
      .map(normalizeDistrictFromPrimary)
      .filter(Boolean) as HouseDistrict[];

    if (districts.length > 300) {
      return {
        districts,
        sourceLabel: 'live geojson | arcgis congressional districts',
      };
    }

    throw new Error('Primary feed returned too few districts.');
  } catch (primaryError) {
    const payload = await fetchGeoJson(FALLBACK_DISTRICTS_ENDPOINT);
    const districts = ((payload.features ?? []) as GeoJSON.Feature[])
      .map(normalizeDistrictFromFallback)
      .filter(Boolean) as HouseDistrict[];

    if (!districts.length) {
      throw new Error(primaryError instanceof Error ? primaryError.message : 'District map failed to load.');
    }

    return {
      districts,
      sourceLabel: 'live house clerk fallback | usdot / census / house clerk',
    };
  }
}
