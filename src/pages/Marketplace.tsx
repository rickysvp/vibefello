import React, { useState, useMemo } from 'react';
import { Search, X, Zap, Sparkles } from 'lucide-react';
import { MOCK_MARKETPLACE, UserTier } from '../types';

interface MarketplaceProps {
  onSelect: (r: any) => void;
  isExpert: boolean;
  userTier: UserTier;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ onSelect, isExpert }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'latest' | 'budget'>('latest');

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    MOCK_MARKETPLACE.forEach(req => req.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, []);

  const requestStats = useMemo(() => MOCK_MARKETPLACE.map(req => ({
    ...req,
    claimCount: Math.floor(Math.random() * 8) + 1,
    maxClaims: 10,
    aiDiagnosis: req.id === 'm1' || req.id === 'm3' ? {
      summary: 'Detected potential performance issues and security vulnerabilities in code',
      severity: 'medium',
      issues: ['Memory leak', 'XSS risk', 'Unoptimized queries']
    } : null
  })), []);

  const filteredRequests = useMemo(() => {
    let filtered = requestStats;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(req =>
        req.title.toLowerCase().includes(query) ||
        req.description.toLowerCase().includes(query) ||
        req.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    if (selectedTags.length > 0) {
      filtered = filtered.filter(req =>
        selectedTags.some(tag => req.tags.includes(tag))
      );
    }
    const sorted = [...filtered];
    if (sortBy === 'budget') {
      sorted.sort((a, b) => {
        const aBudget = parseInt(a.budget.replace(/[^0-9]/g, ''));
        const bBudget = parseInt(b.budget.replace(/[^0-9]/g, ''));
        return bBudget - aBudget;
      });
    }
    return sorted;
  }, [requestStats, searchQuery, selectedTags, sortBy]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSortBy('latest');
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Vibe Request Hall</h2>
            <p className="text-slate-500 font-medium">
              {isExpert
                ? 'Browse latest technical rescue requests. Up to 10 experts can bid simultaneously.'
                : 'Your request will be visible to experts. Up to 10 experts can bid with solutions.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">{filteredRequests.length} requests</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description, or tech tags..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-vibe-accent focus:ring-2 focus:ring-vibe-accent/20 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Tech Tags:</span>
            {allTags.slice(0, 12).map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-vibe-primary text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
            {allTags.length > 12 && (
              <span className="text-xs text-slate-400">+{allTags.length - 12} more</span>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort:</span>
              {[
                { key: 'latest', label: 'Latest' },
                { key: 'budget', label: 'Highest Budget' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSortBy(key as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    sortBy === key
                      ? 'bg-vibe-accent/10 text-vibe-primary border border-vibe-accent/20'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {(searchQuery || selectedTags.length > 0 || sortBy !== 'latest') && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {isExpert && (
        <div className="mb-8 p-4 bg-vibe-accent/10 rounded-xl border border-vibe-accent/20 flex items-center gap-3">
          <div className="w-10 h-10 bg-vibe-accent/20 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-vibe-accent" />
          </div>
          <div>
            <div className="font-bold text-slate-900">Expert Bidding Rules</div>
            <div className="text-sm text-slate-600">Each request allows up to 10 experts to bid. Users choose the best expert based on analysis and quote.</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No matching requests found</h3>
            <p className="text-slate-500 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-vibe-primary text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              onClick={() => onSelect(req)}
              className="bg-white p-6 rounded-2xl border border-slate-200 vibe-card-shadow hover:border-vibe-accent transition-all cursor-pointer group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider border border-indigo-100">New</span>
                    <span className="text-xs text-slate-400 font-medium">{req.time}</span>
                    {req.aiDiagnosis && (
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-black border border-emerald-100 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> AI Diagnosed
                      </span>
                    )}
                  </div>
                  <h4 className="text-xl font-black text-vibe-primary group-hover:text-vibe-accent transition-colors tracking-tight mb-3">{req.title}</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {req.tags.map(s => <span key={s} className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{s}</span>)}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 max-w-[200px]">
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-vibe-accent rounded-full transition-all"
                          style={{ width: `${(req.claimCount / req.maxClaims) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">
                      <span className="font-bold text-vibe-primary">{req.claimCount}</span> / {req.maxClaims} experts bidding
                    </span>
                    {req.claimCount >= 8 && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                        Almost Full
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-900">{req.budget}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Est. Reward</div>
                  </div>
                  <button className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg ${
                    req.claimCount >= 10 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                      : 'bg-vibe-primary text-white hover:bg-slate-800 shadow-vibe-primary/10'
                  }`}>
                    {req.claimCount >= 10 ? 'Full' : 'Bid Now'}
                  </button>
                </div>
              </div>

              {isExpert && req.aiDiagnosis && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-900 mb-1">AI Diagnosis Summary</div>
                      <p className="text-sm text-slate-600 mb-2">{req.aiDiagnosis.summary}</p>
                      <div className="flex flex-wrap gap-1">
                        {req.aiDiagnosis.issues.map((issue: string, idx: number) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded">{issue}</span>
                        ))}
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      req.aiDiagnosis.severity === 'high' ? 'bg-red-100 text-red-600' :
                      req.aiDiagnosis.severity === 'medium' ? 'bg-amber-100 text-amber-600' :
                      'bg-emerald-100 text-emerald-600'
                    }`}>
                      {req.aiDiagnosis.severity === 'high' ? 'High' : req.aiDiagnosis.severity === 'medium' ? 'Medium' : 'Low'} Risk
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Marketplace;
