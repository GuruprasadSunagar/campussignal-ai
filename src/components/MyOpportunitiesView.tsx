import React, { useState } from 'react';
import {
  Bookmark,
  Search,
  Filter,
  Trash2,
  Clock,
  ArrowRight,
  Sparkles,
  Building,
  GraduationCap,
} from 'lucide-react';
import { SavedNoticeRecord } from '../types';

interface MyOpportunitiesViewProps {
  savedNotices: SavedNoticeRecord[];
  onSelectNotice: (record: SavedNoticeRecord) => void;
  onDeleteNotice: (id: string) => void;
  onClearAll: () => void;
  onNavigateToAnalyze: () => void;
}

export const MyOpportunitiesView: React.FC<MyOpportunitiesViewProps> = ({
  savedNotices,
  onSelectNotice,
  onDeleteNotice,
  onClearAll,
  onNavigateToAnalyze,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'all',
    'scholarship',
    'internship',
    'competition',
    'event',
    'placement',
    'examination',
    'workshop',
  ];

  const filtered = savedNotices.filter((n) => {
    const matchesSearch =
      n.analysis.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.analysis.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.fileName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' ||
      n.analysis.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Header */}
      <div className="bg-[#160d2f] border border-purple-700/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">My Campus Opportunities</h2>
            <p className="text-xs sm:text-sm text-purple-300">
              {savedNotices.length} opportunities saved in your local browser vault
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNavigateToAnalyze}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm cursor-pointer shadow-md"
        >
          Scan New Opportunity
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#140c2a] border border-purple-800/50 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or organizer..."
            className="w-full bg-[#1e133d] border border-purple-700/60 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-purple-950/60 text-purple-300 hover:bg-purple-900/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-[#140c2a] border border-purple-800/50 rounded-3xl p-12 text-center space-y-3">
          <Bookmark className="w-16 h-16 mx-auto text-purple-600/60" />
          <h3 className="text-lg font-bold text-white">No Saved Opportunities Found</h3>
          <p className="text-xs text-purple-300 max-w-sm mx-auto">
            {savedNotices.length === 0
              ? 'Analyze a poster in "Analyze Poster" and click "Save Notice" to store it here.'
              : 'Try clearing your search query or switching categories.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((record) => {
            const checklistCount = Object.values(record.checklistState || {}).filter(Boolean).length;
            return (
              <div
                key={record.id}
                className="bg-[#160d2e] border border-purple-800/50 hover:border-amber-400/60 rounded-3xl p-5 sm:p-6 transition-all shadow-md group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-900/80 text-amber-300 border border-purple-700/60">
                      {record.analysis.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => onDeleteNotice(record.id)}
                      className="text-purple-400 hover:text-rose-400 p-1 cursor-pointer"
                      title="Delete notice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                    {record.analysis.title}
                  </h3>

                  {record.analysis.organization && (
                    <p className="text-xs text-purple-300 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-amber-400" />
                      <span className="truncate">{record.analysis.organization}</span>
                    </p>
                  )}

                  <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-900/60 text-xs text-purple-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-purple-400">Deadline:</span>
                      <span className="font-bold text-amber-300">
                        {record.analysis.deadline?.rawText || 'None stated'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-purple-900/40 text-xs">
                  <span className="text-[11px] text-purple-400">
                    {checklistCount} checklist tasks done
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectNotice(record)}
                    className="px-4 py-2 bg-purple-900/60 hover:bg-amber-500 hover:text-slate-950 text-purple-200 font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Open Results</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
