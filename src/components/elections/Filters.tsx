// @ts-nocheck
import { RACE_TYPES, RACE_RATINGS } from '../../data/elections';

export default function Filters({ filters, setFilters }) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <input
        type="text"
        placeholder="Search races or candidates..."
        value={filters.search || ''}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        className="flex-1 min-w-[200px] px-4 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-[#F5F0E8] font-mono text-sm focus:outline-none focus:border-[#E8A020] transition-colors"
      />

      <select
        value={filters.type || ''}
        onChange={(e) => setFilters({ ...filters, type: e.target.value || undefined })}
        className="px-4 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-[#F5F0E8] font-mono text-sm focus:outline-none focus:border-[#E8A020] transition-colors"
      >
        <option value="">All Types</option>
        {RACE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
      </select>

      <select
        value={filters.rating || ''}
        onChange={(e) => setFilters({ ...filters, rating: e.target.value || undefined })}
        className="px-4 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-[#F5F0E8] font-mono text-sm focus:outline-none focus:border-[#E8A020] transition-colors"
      >
        <option value="">All Ratings</option>
        {Object.keys(RACE_RATINGS).map(k => <option key={k} value={k}>{RACE_RATINGS[k].label}</option>)}
      </select>
    </div>
  );
}
