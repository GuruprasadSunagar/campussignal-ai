import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Flame,
  Plus,
  Trash2,
  CheckSquare,
  ShieldCheck,
  PartyPopper,
  BellOff,
} from 'lucide-react';
import { ActionChecklistItem, NoticeAnalysis } from '../types';

interface DeadlineCurseBreakerProps {
  noticeId: string;
  analysis: NoticeAnalysis;
  initialChecklistState?: Record<string, boolean>;
  customItems?: ActionChecklistItem[];
  onStateChange?: (state: Record<string, boolean>, custom: ActionChecklistItem[]) => void;
}

export const DeadlineCurseBreaker: React.FC<DeadlineCurseBreakerProps> = ({
  noticeId,
  analysis,
  initialChecklistState = {},
  customItems = [],
  onStateChange,
}) => {
  // Load state from local storage or props
  const storageKey = `campussignal_checklist_${noticeId}`;

  const [checkedState, setCheckedState] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return initialChecklistState;
  });

  const [customList, setCustomList] = useState<ActionChecklistItem[]>(customItems);
  const [newStepText, setNewStepText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Combine default items + custom items
  const baseItems: ActionChecklistItem[] =
    analysis.initialActionChecklist && analysis.initialActionChecklist.length > 0
      ? analysis.initialActionChecklist
      : [
          {
            id: 'step_1',
            text: 'Read and confirm the eligibility requirements against your marks and branch',
            category: 'eligibility',
          },
          {
            id: 'step_2',
            text: 'Collect and scan the required documents (ID card, marksheet, certificates)',
            category: 'document',
          },
          {
            id: 'step_3',
            text: 'Complete the official registration/application form online',
            category: 'application',
          },
          {
            id: 'step_4',
            text: 'Verify all entered details and upload required attachments',
            category: 'verification',
          },
          {
            id: 'step_5',
            text: 'Submit final application before stated deadline and save receipt',
            category: 'submission',
          },
        ];

  const allItems = [...baseItems, ...customList];

  const totalCount = allItems.length;
  const completedCount = allItems.filter((item) => checkedState[item.id]).length;
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(checkedState));
    } catch (e) {
      // ignore
    }
    if (onStateChange) {
      onStateChange(checkedState, customList);
    }
  }, [checkedState, customList]);

  const toggleItem = (id: string) => {
    setCheckedState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddStep = () => {
    if (!newStepText.trim()) return;
    const newItem: ActionChecklistItem = {
      id: `custom_${Date.now()}`,
      text: newStepText.trim(),
      category: 'custom',
    };
    const updated = [...customList, newItem];
    setCustomList(updated);
    setNewStepText('');
    setShowAddModal(false);
  };

  const handleDeleteCustom = (id: string) => {
    setCustomList(customList.filter((item) => item.id !== id));
    const nextChecked = { ...checkedState };
    delete nextChecked[id];
    setCheckedState(nextChecked);
  };

  // Determine Deadline Visual State: Urgent, Upcoming, No deadline mentioned, Completed
  const calculateDeadlineStatus = (): {
    label: 'Urgent' | 'Upcoming' | 'No deadline mentioned' | 'Completed';
    color: string;
    description: string;
  } => {
    if (isAllCompleted) {
      return {
        label: 'Completed',
        color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
        description: 'Curse broken! You completed all action items for this notice.',
      };
    }

    const raw = analysis.deadline?.rawText || '';
    const lower = raw.toLowerCase();

    if (!analysis.deadline?.isExplicit || lower.includes('not mentioned') || !raw) {
      return {
        label: 'No deadline mentioned',
        color: 'bg-slate-500/20 text-slate-300 border-slate-500/50',
        description: 'Notice does not specify an official closing date. Proceed promptly.',
      };
    }

    // Try parsing date if isoDate or raw string is available
    const iso = analysis.deadline.isoDate;
    if (iso) {
      const targetTime = new Date(iso).getTime();
      const now = Date.now();
      const diffDays = Math.ceil((targetTime - now) / (1000 * 60 * 60 * 24));

      if (diffDays <= 3) {
        return {
          label: 'Urgent',
          color: 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse',
          description: `Deadline is imminent (${diffDays <= 0 ? 'Due today/passed' : `Only ${diffDays} days left`})!`,
        };
      }
      return {
        label: 'Upcoming',
        color: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
        description: `Scheduled deadline: ${raw}`,
      };
    }

    // Fallback if raw text exists but no ISO
    if (analysis.deadline.urgencyHint === 'urgent') {
      return {
        label: 'Urgent',
        color: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
        description: 'Immediate action needed according to notice text.',
      };
    }

    return {
      label: 'Upcoming',
      color: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
      description: `Official deadline: ${raw}`,
    };
  };

  const deadlineStatus = calculateDeadlineStatus();
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="bg-[#150d2e] border border-purple-600/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-purple-800/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Deadline Curse Breaker
              </h2>
              <span className="text-xs">🎃</span>
            </div>
            <p className="text-xs sm:text-sm text-purple-300">
              Break the procrastination spell before your opportunity vanishes!
            </p>
          </div>
        </div>

        {/* Urgency Badge */}
        <div
          className={`px-4 py-2 rounded-2xl border text-xs font-black uppercase tracking-wider flex items-center gap-2 ${deadlineStatus.color}`}
        >
          {deadlineStatus.label === 'Urgent' ? (
            <AlertOctagon className="w-4 h-4 text-rose-400 animate-spin" />
          ) : deadlineStatus.label === 'Completed' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <Clock className="w-4 h-4 text-amber-400" />
          )}
          <span>{deadlineStatus.label}</span>
        </div>
      </div>

      {/* Prominent Deadline Display Box */}
      <div className="mt-6 p-5 rounded-2xl bg-[#1e123d] border border-purple-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
            Stated Deadline Date &amp; Time
          </span>
          <p className="text-xl sm:text-2xl font-black text-white mt-1">
            {analysis.deadline?.rawText || 'Not mentioned in the notice.'}
          </p>
          <p className="text-xs text-purple-300 mt-1">{deadlineStatus.description}</p>
        </div>

        {/* Progress Gauge */}
        <div className="w-full sm:w-48 bg-[#0f0722] p-3 rounded-xl border border-purple-800/50">
          <div className="flex items-center justify-between text-xs text-purple-200 mb-1.5 font-semibold">
            <span>Progress</span>
            <span className="text-amber-400 font-mono">
              {completedCount} / {totalCount} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-purple-950 rounded-full overflow-hidden border border-purple-800/40">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      {isAllCompleted && (
        <div className="mt-4 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm flex items-center gap-3 animate-fade-in">
          <PartyPopper className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <p className="font-extrabold text-white">All Steps Completed!</p>
            <p className="text-emerald-300/90 text-xs">
              Great job! You have prepared all requirements and submitted in time.
            </p>
          </div>
        </div>
      )}

      {/* Interactive Action Checklist */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-purple-200 uppercase tracking-wider flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-amber-400" />
            Action Plan Checklist
          </h3>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Step</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {allItems.map((item) => {
            const isChecked = !!checkedState[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`group p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isChecked
                    ? 'bg-purple-950/30 border-purple-800/40 opacity-75'
                    : 'bg-[#1a1038] border-purple-700/50 hover:border-amber-400/60 shadow-md'
                }`}
              >
                {/* Checkbox button */}
                <div
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    isChecked
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                      : 'border-purple-600 group-hover:border-amber-400 bg-purple-950/60'
                  }`}
                >
                  {isChecked && <CheckCircle2 className="w-4 h-4" />}
                </div>

                <div className="flex-1">
                  <p
                    className={`text-xs sm:text-sm leading-relaxed transition-all ${
                      isChecked
                        ? 'line-through text-purple-400'
                        : 'text-purple-100 font-medium group-hover:text-white'
                    }`}
                  >
                    {item.text}
                  </p>
                  {item.category && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 mt-1 inline-block">
                      Category: {item.category}
                    </span>
                  )}
                </div>

                {item.id.startsWith('custom_') && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCustom(item.id);
                    }}
                    className="p-1 text-purple-400 hover:text-rose-400 transition-colors"
                    title="Delete step"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Step Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#160e2e] border border-purple-600/50 rounded-2xl p-6 text-purple-100 shadow-2xl">
            <h4 className="font-bold text-base text-white mb-2">Add Checklist Action Step</h4>
            <p className="text-xs text-purple-300 mb-4">
              Add a personal milestone (e.g. "Get HOD signature" or "Photo printout")
            </p>
            <input
              type="text"
              value={newStepText}
              onChange={(e) => setNewStepText(e.target.value)}
              placeholder="Enter action step..."
              className="w-full bg-[#1e133d] border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400"
              autoFocus
            />
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-purple-300 hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddStep}
                disabled={!newStepText.trim()}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs disabled:opacity-50"
              >
                Add Step
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Honest storage note */}
      <div className="mt-6 pt-4 border-t border-purple-800/40 flex items-center gap-2 text-[11px] text-purple-400">
        <BellOff className="w-3.5 h-3.5 text-purple-400 shrink-0" />
        <span>
          Checklist state is saved locally in this browser. No external push notifications or fake
          alerts are claimed or sent.
        </span>
      </div>
    </div>
  );
};
