import React, { useState } from 'react';
import {
  Bookmark,
  Search,
  Filter,
  Trash2,
  Calendar,
  Clock,
  ArrowRight,
  AlertTriangle,
  FolderOpen,
  Info,
} from 'lucide-react';
import { NoticeCategory, SavedNoticeRecord } from '../types';

interface SavedNoticesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedNotices: SavedNoticeRecord[];
  onSelectNotice: (record: SavedNoticeRecord) => void;
  onDeleteNotice: (id: string) => void;
  onClearAll: () => void;
}

export const SavedNoticesDrawer: React.FC<SavedNoticesDrawerProps> = ({
  isOpen,
  onClose,
  savedNotices,
  onSelectNotice,
  onDeleteNotice,
  onClearAll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isOpen) return null;

  const categories = ['all', 'scholarship', 'internship', 'competition', 'event', 'placement', 'examination', 'workshop'];

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
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md h-full bg-[#140c2a] border-l border-purple-700/50 p-6 flex flex-col shadow-2xl relative text-purple-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">Saved Campus Notices</h3>
              <p className="text-xs text-purple-300">
                {savedNotices.length} saved in this browser
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-purple-400 hover:text-white text-lg p-1"
          >
            ✕
          </button>
        </div>

        {/* Search & Filter */}
        <div className="mt-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-purple-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notices by title, org..."
              className="w-full bg-[#1e133d] border border-purple-700/60 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-purple-950/50 text-purple-300 hover:bg-purple-900/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Notices List */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-purple-400 space-y-2">
              <FolderOpen className="w-12 h-12 mx-auto text-purple-600/60" />
              <p className="text-sm font-semibold text-purple-300">No saved notices found</p>
              <p className="text-xs text-purple-400 max-w-xs mx-auto">
                {savedNotices.length === 0
                  ? 'Analyze a notice and click "Save Notice" to store it here.'
                  : 'No notices match your search or filter.'}
              </p>
            </div>
          ) : (
            filtered.map((record) => {
              const checklistCompleted = Object.values(record.checklistState || {}).filter(Boolean)
                .length;
              return (
                <div
                  key={record.id}
                  className="p-4 rounded-2xl bg-[#1b1038] border border-purple-800/60 hover:border-amber-400/60 transition-all space-y-2.5 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-900/80 text-amber-300">
                      {record.analysis.category || 'Notice'}
                    </span>
                    <button
                      type="button"
                      onClick={() => onDeleteNotice(record.id)}
                      className="text-purple-400 hover:text-rose-400 p-1 opacity-60 group-hover:opacity-100 transition-opacity"
                      title="Delete notice"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="font-bold text-sm text-white line-clamp-2 leading-snug group-hover:text-amber-300 transition-colors">
                    {record.analysis.title}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-purple-300 pt-1 border-t border-purple-900/50">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {record.analysis.deadline?.rawText?.slice(0, 22) || 'No deadline'}
                    </span>
                    <span>
                      Checklist: {checklistCompleted} done
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectNotice(record);
                      onClose();
                    }}
                    className="w-full py-2 bg-purple-800/50 hover:bg-amber-500 hover:text-slate-950 text-purple-200 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Reopen Results</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with browser storage note & clear all */}
        <div className="mt-4 pt-4 border-t border-purple-800/50 space-y-3">
          <div className="flex items-start gap-1.5 text-[11px] text-purple-400">
            <Info className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
            <span>
              Saved data belongs to this browser's local storage and is not synchronized across
              devices.
            </span>
          </div>

          {savedNotices.length > 0 && (
            <div>
              {confirmClear ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClearAll();
                      setConfirmClear(false);
                    }}
                    className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold"
                  >
                    Yes, Clear All
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="px-3 py-1.5 bg-purple-900 text-purple-200 rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="w-full py-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold text-center"
                >
                  Clear All Saved Notices
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
