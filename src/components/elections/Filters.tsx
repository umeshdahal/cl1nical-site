// @ts-nocheck
import { RACE_TYPES, RACE_RATINGS } from '../../data/elections';

export default function Filters({ filters, setFilters }) {
  const activeType = filters.type || null;
  const activeRating = filters.rating || null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <input
        type="text"
        placeholder="Search races or candidates..."
        value={filters.search || ''}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        className="flex-1 min-w-[200px] px-3 py-1.5 bg-white border border-[#e2e2e2] rounded-[2px] text-sm text-[#0f0f0f] focus:outline-none focus:border-[#0f0f0f] transition-colors"
      />

      <div className="flex gap-1">
        <button
          onClick={() => setFilters({ ...filters, type: undefined })}
          className={`px-3 py-1.5 text-xs font-semibold rounded-[2px] border transition-colors ${
            !activeType ? 'bg-[#0f0f0f] text-white border-[#0f0f0f]' : 'bg-white text-[#666] border-[#e2e2e2] hover:border-[#999]'
          }`}
        >
          All
        </button>
        {RACE_TYPES.map(t => (
          <button
            key={t}
            onClick={() => setFilters({ ...filters, type: activeType === t ? undefined : t })}
            className={`px-3 py-1.5 text-xs font-semibold rounded-[2px] border transition-colors ${
              activeType === t ? 'bg-[#0f0f0f] text-white border-[#0f0f0f]' : 'bg-white text-[#666] border-[#e2e2e2] hover:border-[#999]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex gap-1">
        {Object.entries(RACE_RATINGS).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setFilters({ ...filters, rating: activeRating === k ? undefined : k })}
            className={`px-2 py-1.5 text-xs font-semibold rounded-[2px] border transition-colors ${
              activeRating === k ? 'text-white border-[#0f0f0f]' : 'bg-white text-[#666] border-[#e2e2e2] hover:border-[#999]'
            }`}
            style={activeRating === k ? { backgroundColor: v.bg, borderColor: v.bg } : {}}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}
