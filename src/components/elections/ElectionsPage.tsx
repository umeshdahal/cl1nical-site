import { type ReactNode } from 'react';
import USMap from './USMap';

const hotRaces = [
  { district: 'NC SEN', names: 'Roy Cooper / Michael Whatley', dem: 48.5, rep: 39.9 },
  { district: 'GA-14', names: 'Clay Fuller / Shawn Harris', dem: 44.1, rep: 55.9 },
  { district: 'NJ GOV', names: 'Mikie Sherrill / Jack Ciattarelli', dem: 56.9, rep: 42.5 },
  { district: 'PA SEN', names: 'John Fetterman / Dave McCormick', dem: 49.0, rep: 48.0 },
  { district: 'VA GOV', names: 'Abigail Spanberger / Winsome Earle-Sears', dem: 50.2, rep: 47.4 },
];

const newsItems = [
  { headline: 'Georgia special runoff compressed the House battlefield again.', time: 'APR 07' },
  { headline: 'New Jersey stayed blue and reset the national governor map.', time: 'NOV 04' },
  { headline: 'North Carolina Senate positioning hardened into a real target.', time: 'APR 06' },
  { headline: 'Pennsylvania remains one of the cleanest split-ticket tests.', time: 'APR 08' },
  { headline: 'Competitive suburban districts still decide the center of the map.', time: 'APR 08' },
];

const recentResults = [
  { district: 'GA-14', winner: 'Clay Fuller', party: 'R', margin: '+11.8' },
  { district: 'NJ GOV', winner: 'Mikie Sherrill', party: 'D', margin: '+14.4' },
  { district: 'NJ-07', winner: 'Mikie Sherrill', party: 'D', margin: '+2.0' },
  { district: 'NJ-05', winner: 'Mikie Sherrill', party: 'D', margin: '+6.4' },
  { district: 'NJ-04', winner: 'Jack Ciattarelli', party: 'R', margin: '+28.8' },
];

function PollBar({ dem, rep }: { dem: number; rep: number }) {
  const total = dem + rep;
  const demWidth = `${(dem / total) * 100}%`;
  const repWidth = `${(rep / total) * 100}%`;

  return (
    <div className="mt-2 h-[3px] w-full bg-[rgba(26,26,46,0.08)]">
      <div className="flex h-full w-full">
        <div style={{ width: demWidth, backgroundColor: 'rgba(74,143,212,0.6)' }} />
        <div style={{ width: repWidth, backgroundColor: 'rgba(192,57,43,0.6)' }} />
      </div>
    </div>
  );
}

function ColumnHeading({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-[rgba(26,26,46,0.4)]">{children}</p>;
}

export default function ElectionsPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: '#c4cfe8',
        backgroundImage:
          'radial-gradient(ellipse at 20% 20%, #b8c8ef, transparent 60%), radial-gradient(ellipse at 80% 10%, #a8c4ee, transparent 50%), radial-gradient(ellipse at 50% 60%, #d4b8e8, transparent 55%), radial-gradient(ellipse at 90% 80%, #e8c4d8, transparent 50%)',
        color: '#1a1a2e',
      }}
    >
      <main className="mx-auto max-w-[1440px] px-7 pb-24 pt-10 md:px-10 md:pt-12">
        <section id="map">
          <USMap />
        </section>

        <section className="grid gap-y-14 pt-24 md:pt-28 lg:grid-cols-3 lg:gap-x-20" style={{ fontFamily: 'var(--font-sans)' }}>
          <div id="races">
            <ColumnHeading>Hot races</ColumnHeading>
            <div className="mt-7 space-y-[18px]">
              {hotRaces.map((race) => (
                <article key={race.district}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#3a3a5c]">{race.district}</p>
                  <p className="mt-1 text-[13px] font-light leading-5 text-[#1a1a2e]">{race.names}</p>
                  <PollBar dem={race.dem} rep={race.rep} />
                </article>
              ))}
            </div>
          </div>

          <div id="news">
            <ColumnHeading>News</ColumnHeading>
            <div className="mt-7 space-y-5">
              {newsItems.map((item) => (
                <article key={item.headline}>
                  <p className="text-[13px] font-light leading-6 text-[#1a1a2e]">{item.headline}</p>
                  <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[rgba(26,26,46,0.45)]">{item.time}</p>
                </article>
              ))}
            </div>
          </div>

          <div id="results">
            <ColumnHeading>Recent results</ColumnHeading>
            <div className="mt-7 space-y-5">
              {recentResults.map((result) => (
                <article key={`${result.district}-${result.winner}`} className="flex items-baseline justify-between gap-4">
                  <p className="text-[13px] font-light leading-5 text-[#1a1a2e]">
                    <span className="font-mono text-[11px] tracking-[0.14em] text-[#3a3a5c]">{result.district}</span>{' '}
                    {result.winner} {result.party}
                  </p>
                  <span className={`shrink-0 font-mono text-[11px] ${result.party === 'D' ? 'text-[#4a8fd4]' : 'text-[#c0392b]'}`}>
                    {result.margin}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
