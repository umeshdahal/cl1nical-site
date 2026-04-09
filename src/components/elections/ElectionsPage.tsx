import { useEffect, useState, type ReactNode } from 'react';
import USMap, { loadNationalDistricts } from './USMap';
import type { HouseDistrict } from '../../lib/elections-live';

const navItems = [
  { label: 'Map', href: '#map' },
  { label: 'Races', href: '#races' },
  { label: 'News', href: '#news' },
  { label: 'Results', href: '#results' },
];

const hotRaces = [
  { district: 'NC SEN', names: 'Roy Cooper / Michael Whatley', left: 48.5, right: 39.9 },
  { district: 'GA-14', names: 'Clay Fuller / Shawn Harris', left: 55.9, right: 44.1 },
  { district: 'NJ GOV', names: 'Mikie Sherrill / Jack Ciattarelli', left: 56.9, right: 42.5 },
  { district: 'VA REF', names: 'Yes / No', left: 52.4, right: 47.6 },
  { district: 'PA SEN', names: 'Fetterman / McCormick', left: 49.0, right: 48.0 },
];

const newsItems = [
  { headline: 'Georgia 14 runoff narrowed the special-election map again.', time: 'Apr 7' },
  { headline: 'Sherrill carried New Jersey and reshaped the 2026 governor conversation.', time: 'Nov 4' },
  { headline: 'North Carolina Senate polling hardened into a real battleground.', time: 'Apr 6' },
  { headline: 'Virginia ballot margins stayed close enough to keep both parties active.', time: 'Nov 4' },
  { headline: 'House control remains scattered through suburban and at-large districts.', time: 'Apr 8' },
];

const recentResults = [
  { district: 'GA-14', winner: 'Clay Fuller', party: 'R', margin: '+11.8' },
  { district: 'NJ GOV', winner: 'Mikie Sherrill', party: 'D', margin: '+14.4' },
  { district: 'NJ-07', winner: 'Mikie Sherrill', party: 'D', margin: '+2.0' },
  { district: 'NJ-05', winner: 'Mikie Sherrill', party: 'D', margin: '+6.4' },
  { district: 'NJ-04', winner: 'Jack Ciattarelli', party: 'R', margin: '+28.8' },
];

function PollBar({ left, right }: { left: number; right: number }) {
  const total = left + right;
  const leftWidth = `${(left / total) * 100}%`;

  return (
    <div className="mt-2 h-[2px] w-full overflow-hidden bg-[linear-gradient(90deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))]">
      <div
        className="h-full bg-[linear-gradient(90deg,rgba(122,170,255,0.95),rgba(255,182,207,0.68))]"
        style={{ width: leftWidth }}
      />
    </div>
  );
}

function ColumnHeading({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-white/45">{children}</p>
  );
}

export default function ElectionsPage() {
  const [districts, setDistricts] = useState<HouseDistrict[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const next = await loadNationalDistricts();
        if (!cancelled) setDistricts(next);
      } catch {
        if (!cancelled) setDistricts([]);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className="min-h-screen text-white"
      style={{
        backgroundColor: '#c4cfe8',
        backgroundImage:
          'radial-gradient(ellipse at 20% 20%, #b8c8ef, transparent 60%), radial-gradient(ellipse at 80% 10%, #a8c4ee, transparent 50%), radial-gradient(ellipse at 50% 60%, #d4b8e8, transparent 55%), radial-gradient(ellipse at 90% 80%, #e8c4d8, transparent 50%)',
      }}
    >
      <main className="mx-auto max-w-[1440px] px-7 pb-24 pt-8 md:px-10">
        <nav className="flex items-center justify-between">
          <a href="/" className="font-mono text-[11px] font-light uppercase tracking-[0.28em] text-white/82">
            cl1nical
          </a>
          <div className="flex items-center gap-5 md:gap-7">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="font-mono text-[10px] font-light uppercase tracking-[0.24em] text-white/68 no-underline">
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <section id="map" className="pt-16 md:pt-20">
          <USMap districts={districts} />
          <p className="mt-5 text-center font-mono text-[11px] font-light tracking-[0.18em] text-white/40">
            live house district data | usd ot / census / house clerk
          </p>
        </section>

        <section className="grid gap-y-14 pt-24 md:pt-28 lg:grid-cols-3 lg:gap-x-20" style={{ fontFamily: 'var(--font-sans)' }}>
          <div id="races">
            <ColumnHeading>Hot races</ColumnHeading>
            <div className="mt-8 space-y-8">
              {hotRaces.map((race) => (
                <article key={race.district}>
                  <p className="text-[13px] font-light leading-5 text-white/88">
                    <span className="font-mono tracking-[0.14em] text-white/78">{race.district}</span> {race.names}
                  </p>
                  <PollBar left={race.left} right={race.right} />
                </article>
              ))}
            </div>
          </div>

          <div id="news">
            <ColumnHeading>News</ColumnHeading>
            <div className="mt-8 space-y-8">
              {newsItems.map((item) => (
                <article key={item.headline}>
                  <p className="text-[13px] font-light leading-6 text-white/86">{item.headline}</p>
                  <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">{item.time}</p>
                </article>
              ))}
            </div>
          </div>

          <div id="results">
            <ColumnHeading>Recent results</ColumnHeading>
            <div className="mt-8 space-y-8">
              {recentResults.map((result) => (
                <article key={`${result.district}-${result.winner}`} className="flex items-baseline justify-between gap-4">
                  <p className="text-[13px] font-light leading-5 text-white/88">
                    <span className="font-mono tracking-[0.14em] text-white/78">{result.district}</span> {result.winner} {result.party}
                  </p>
                  <span className="shrink-0 font-mono text-[11px] text-white/56">{result.margin}</span>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
