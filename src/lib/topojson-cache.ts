let topoJsonPromise: Promise<any> | null = null;

export function getTopoJSON(): Promise<any> {
  if (!topoJsonPromise) {
    topoJsonPromise = fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/districts-10m.json').then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch TopoJSON: ${response.status}`);
      }

      return response.json();
    });
  }

  return topoJsonPromise;
}
