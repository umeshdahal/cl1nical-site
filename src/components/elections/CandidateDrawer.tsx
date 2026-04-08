// @ts-nocheck
import { useMemo, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { ExternalLink, X } from 'lucide-react';
import { getCandidateProfile } from '../../lib/election-dashboard';

const tabs = ['Overview', 'Polling', 'Fundraising', 'News'];

export default function CandidateDrawer({ candidateName, stateAbbr, raceType, onClose }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const profile = useMemo(() => getCandidateProfile(candidateName, stateAbbr, raceType), [candidateName, stateAbbr, raceType]);
  const trendData = profile.trend.map((value, index) => ({ index, value }));

  return (
    <>
      <div className="fixed inset-0 z-[70] bg-slate-950/55 backdrop-blur-sm" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-[80] w-full max-w-xl overflow-y-auto border-l border-white/10 bg-[#0a101a]/95 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="sticky top-0 z-10 border-b border-white/8 bg-[#0a101a]/90 px-6 py-5 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-semibold text-white shadow-[0_16px_40px_rgba(0,0,0,0.28)]"
                style={{ background: profile.portraitStyle }}
              >
                {profile.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/42">{profile.party.label} | {profile.state}</p>
                <h2 className="mt-2 font-heading text-3xl tracking-[-0.04em] text-white">{profile.name}</h2>
                <p className="mt-1 text-sm text-white/58">{profile.currentOffice}</p>
              </div>
            </div>
            <button onClick={onClose} className="rounded-full border border-white/10 bg-white/5 p-2 text-white/75 transition hover:bg-white/10 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                  activeTab === tab ? 'bg-white text-slate-950' : 'border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6 p-6">
          {(activeTab === 'Overview' || activeTab === 'Polling') && (
            <section className="rounded-[1.8rem] border border-white/10 bg-white/[0.05] p-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Age</p>
                  <p className="mt-2 text-lg text-white">{profile.age}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Fundraising</p>
                  <p className="mt-2 text-lg text-white">{profile.fundraising}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Favorability</p>
                  <p className="mt-2 text-lg text-white">{profile.favorability}%</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-white/64">{profile.bio}</p>
            </section>
          )}

          {(activeTab === 'Overview' || activeTab === 'Polling') && (
            <section className="rounded-[1.8rem] border border-white/10 bg-white/[0.05] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Recent polling trend</p>
                  <p className="mt-2 text-lg text-white">Momentum snapshot</p>
                </div>
                <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: `${profile.party.color}22`, color: profile.party.color }}>
                  {profile.raceType}
                </span>
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="candidateTrend" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor={profile.party.color} stopOpacity={0.45} />
                        <stop offset="95%" stopColor={profile.party.color} stopOpacity={0.03} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke={profile.party.color} fill="url(#candidateTrend)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}

          {(activeTab === 'Overview' || activeTab === 'Fundraising') && (
            <section className="rounded-[1.8rem] border border-white/10 bg-white/[0.05] p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Key endorsements</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.endorsements.map((endorsement) => (
                  <span key={endorsement} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.18em] text-white/70">
                    {endorsement}
                  </span>
                ))}
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <a href={profile.links.campaign} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/74 transition hover:border-white/20 hover:text-white">
                  Campaign search
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a href={profile.links.x} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/74 transition hover:border-white/20 hover:text-white">
                  Social signal
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </section>
          )}

          {(activeTab === 'Overview' || activeTab === 'News') && (
            <section className="rounded-[1.8rem] border border-white/10 bg-white/[0.05] p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Latest headlines</p>
              <div className="mt-4 space-y-3">
                {profile.headlines.map((headline) => (
                  <article key={headline} className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4">
                    <h3 className="text-sm font-semibold text-white">{headline}</h3>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/38">Signal desk | Updated today</p>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </aside>
    </>
  );
}
