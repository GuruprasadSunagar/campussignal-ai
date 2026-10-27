import React from 'react';
import {
  Clock,
  Calendar,
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Flame,
  CheckSquare,
} from 'lucide-react';
import { SavedNoticeRecord } from '../types';

interface DeadlineTrackerViewProps {
  savedNotices: SavedNoticeRecord[];
  onSelectNotice: (record: SavedNoticeRecord) => void;
  onNavigateToAnalyze: () => void;
}

export const DeadlineTrackerView: React.FC<DeadlineTrackerViewProps> = ({
  savedNotices,
  onSelectNotice,
  onNavigateToAnalyze,
}) => {
  const computeUrgency = (record: SavedNoticeRecord) => {
    const raw = record.analysis.deadline?.rawText || '';
    const lower = raw.toLowerCase();

    if (!record.analysis.deadline?.isExplicit || lower.includes('not mentioned') || !raw) {
      return {
        label: 'No deadline mentioned',
        color: 'bg-slate-500/20 text-slate-300 border-slate-500/50',
        badge: 'Omitted',
      };
    }

    const iso = record.analysis.deadline.isoDate;
    if (iso) {
      const targetTime = new Date(iso).getTime();
      const now = Date.now();
      const diffDays = Math.ceil((targetTime - now) / (1000 * 60 * 60 * 24));

      if (diffDays <= 3) {
        return {
          label: 'Urgent',
          color: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
          badge: `${diffDays <= 0 ? 'Today / Expired' : `${diffDays}d left`}`,
        };
      }
      return {
        label: 'Upcoming',
        color: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
        badge: `${diffDays} days away`,
      };
    }

    return {
      label: 'Upcoming',
      color: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
      badge: 'Scheduled',
    };
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Header */}
      <div className="bg-[#160d2f] border border-purple-700/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">Deadline Curse Tracker</h2>
              <span>🎃</span>
            </div>
            <p className="text-xs sm:text-sm text-purple-300">
              Never let an opportunity expire into the darkness. Track all official submission dates.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNavigateToAnalyze}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm cursor-pointer shadow-md"
        >
          Scan New Notice
        </button>
      </div>

      {savedNotices.length === 0 ? (
        <div className="bg-[#140c2a] border border-purple-800/50 rounded-3xl p-12 text-center space-y-4">
          <Calendar className="w-16 h-16 mx-auto text-purple-600/60" />
          <h3 className="text-lg font-bold text-white">No Tracked Deadlines Yet</h3>
          <p className="text-xs text-purple-300 max-w-sm mx-auto">
            Scan any college poster or circular to extract verified deadlines and add them to your
            tracker.
          </p>
          <button
            type="button"
            onClick={onNavigateToAnalyze}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold rounded-xl text-xs cursor-pointer shadow-lg"
          >
            Scan a Notice Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {savedNotices.map((record) => {
            const urgency = computeUrgency(record);
            const totalSteps =
              (record.analysis.initialActionChecklist?.length || 4) +
              (record.customChecklistItems?.length || 0);
            const completedSteps = Object.values(record.checklistState || {}).filter(Boolean).length;
            const isFinished = totalSteps > 0 && completedSteps === totalSteps;

            return (
              <div
                key={record.id}
                className="bg-[#160d2e] border border-purple-800/50 hover:border-amber-400/60 rounded-3xl p-5 sm:p-6 transition-all shadow-md group flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-900/80 text-amber-300 border border-purple-700/60">
                      {record.analysis.category}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${urgency.color}`}
                    >
                      {isFinished ? 'Completed' : urgency.label} ({urgency.badge})
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                    {record.analysis.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-purple-300">
                    <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {record.analysis.deadline?.rawText || 'Not stated'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <CheckSquare className="w-3.5 h-3.5 text-teal-400" />
                      {completedSteps} of {totalSteps} checklist tasks done
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => onSelectNotice(record)}
                    className="w-full md:w-auto px-5 py-2.5 bg-purple-900/60 hover:bg-amber-500 hover:text-slate-950 text-purple-200 text-xs font-bold rounded-xl transition-all cursor-pointer border border-purple-700/50 flex items-center justify-center gap-2"
                  >
                    <span>View Action Plan</span>
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
