const PRIMARY_DISTRICTS_ENDPOINT =
  'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_116th_Congressional_Districts/FeatureServer/0/query?where=1%3D1&outFields=GEOID&f=geojson';

const FALLBACK_DISTRICTS_ENDPOINT =
  'https://services6.arcgis.com/ptshVLGaRNLSS3T1/arcgis/rest/services/Congressional_Districts/FeatureServer/2/query?where=1%3D1&outFields=GEOID%2CCD119FP%2CSTATEFP&returnGeometry=true&f=geojson';

let topoJsonPromise: Promise<any> | null = null;

async function fetchJson(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch districts: ${response.status}`);
  }

  return response.json();
}

export function getTopoJSON(): Promise<any> {
  if (!topoJsonPromise) {
    topoJsonPromise = fetchJson(PRIMARY_DISTRICTS_ENDPOINT).catch(() => fetchJson(FALLBACK_DISTRICTS_ENDPOINT));
  }

  return topoJsonPromise;
}
