import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Info,
  Check,
  Award,
  BookOpen,
} from 'lucide-react';
import {
  NoticeAnalysis,
  StructuredEligibilityRule,
  StudentProfile,
} from '../types';
import {
  calculateOverallEligibility,
  evaluateRule,
  getStructuredRulesForNotice,
} from '../utils/eligibilityEngine';

interface PersonalizedEligibilityQuestionnaireProps {
  noticeId: string;
  analysis: NoticeAnalysis;
  studentProfile: StudentProfile;
  initialAnswers?: Record<string, any>;
  onAnswersChanged?: (answers: Record<string, any>) => void;
}

export const PersonalizedEligibilityQuestionnaire: React.FC<
  PersonalizedEligibilityQuestionnaireProps
> = ({
  noticeId,
  analysis,
  studentProfile,
  initialAnswers = {},
  onAnswersChanged,
}) => {
  const storageKey = `campussignal_answers_${noticeId}`;

  // Load opportunity-specific answers from localStorage
  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return initialAnswers;
  });

  const [lastCheckTimestamp, setLastCheckTimestamp] = useState<number>(Date.now());
  const [justCheckedAnimation, setJustCheckedAnimation] = useState(false);

  // Synchronize state when switching between notices
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`campussignal_answers_${noticeId}`);
      if (saved) {
        setAnswers(JSON.parse(saved));
        return;
      }
    } catch (e) {
      // ignore
    }
    setAnswers(initialAnswers || {});
  }, [noticeId]);

  // Extract structured rules
  const rules = getStructuredRulesForNotice(analysis);
  const mandatoryRules = rules.filter((r) => r.type === 'mandatory');
  const preferredRules = rules.filter((r) => r.type === 'preferred');

  // Evaluate all rules
  const evaluations: Record<string, ReturnType<typeof evaluateRule>> = {};
  for (const rule of rules) {
    evaluations[rule.id] = evaluateRule(rule, studentProfile, answers);
  }

  // Calculate overall status
  const overall = calculateOverallEligibility(rules, evaluations);

  // Sync answers to localStorage
  const updateAnswer = (ruleId: string, val: any) => {
    const nextAnswers = {
      ...answers,
      [ruleId]: val,
    };
    setAnswers(nextAnswers);
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextAnswers));
    } catch (e) {
      // ignore
    }
    if (onAnswersChanged) {
      onAnswersChanged(nextAnswers);
    }
  };

  const handleManualCheck = () => {
    setLastCheckTimestamp(Date.now());
    setJustCheckedAnimation(true);
    setTimeout(() => setJustCheckedAnimation(false), 1200);
  };

  const getStatusBadge = (status: 'met' | 'not_met' | 'unknown' | 'needs_clarification') => {
    switch (status) {
      case 'met':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Met
          </span>
        );
      case 'not_met':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-sm">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            Not Met
          </span>
        );
      case 'needs_clarification':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/50">
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            Needs Clarification
          </span>
        );
      case 'unknown':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/50">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="bg-[#150d2e]/95 border border-purple-600/50 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-purple-800/40">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 shadow-inner">
            <span className="text-2xl">🎃</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                YOUR PERSONALIZED ELIGIBILITY CHECK
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-purple-300">
              Notice requirements evaluated deterministically against your answers &amp; saved profile
            </p>
          </div>
        </div>

        {/* Action button: CHECK MY ELIGIBILITY */}
        <button
          type="button"
          onClick={handleManualCheck}
          className={`px-5 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm cursor-pointer shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 ${
            justCheckedAnimation ? 'scale-105 ring-2 ring-amber-300' : ''
          }`}
        >
          <span className="text-lg">👻</span>
          <span>CHECK MY ELIGIBILITY</span>
        </button>
      </div>

      {/* OVERALL ELIGIBILITY STATUS BANNER */}
      <div
        className={`p-6 rounded-3xl border transition-all ${
          overall.status === 'eligible_met'
            ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-100 shadow-lg shadow-emerald-950/50'
            : overall.status === 'not_met'
            ? 'bg-rose-950/40 border-rose-500/60 text-rose-100 shadow-lg shadow-rose-950/50'
            : 'bg-[#1b1038] border-amber-500/60 text-amber-100 shadow-lg shadow-purple-950/50'
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {overall.status === 'eligible_met' && (
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
            )}
            {overall.status === 'not_met' && (
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40 shrink-0">
                <XCircle className="w-7 h-7" />
              </div>
            )}
            {overall.status === 'not_confirmed' && (
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 shrink-0">
                <span className="text-2xl">👻</span>
              </div>
            )}

            <div>
              <span className="text-[11px] font-black uppercase tracking-widest opacity-80 block">
                Verification Result
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">{overall.headline}</h3>
            </div>
          </div>

          {/* Counts badge */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800">
              {overall.metCount} Met
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-rose-950/80 text-rose-300 border border-rose-800">
              {overall.notMetCount} Not Met
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-950/80 text-amber-300 border border-amber-800">
              {overall.unknownCount} Pending
            </span>
          </div>
        </div>

        <p className="mt-3 text-xs sm:text-sm leading-relaxed opacity-95 max-w-3xl">
          {overall.summary}
        </p>

        {overall.status === 'eligible_met' && (
          <div className="mt-3 pt-3 border-t border-emerald-800/40 flex items-center gap-2 text-xs text-emerald-300/90 font-medium">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Disclaimer: Meeting all stated criteria confirms you are qualified to submit an
              application, but final selection/grant remains with the college or organizing body.
            </span>
          </div>
        )}
      </div>

      {/* MANDATORY REQUIREMENTS QUESTIONNAIRE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-purple-800/40">
          <h3 className="text-sm font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-2">
            <span>🦇</span>
            <span>Mandatory Requirements ({mandatoryRules.length})</span>
          </h3>
          <span className="text-xs text-purple-400">All must be Met to qualify</span>
        </div>

        <div className="space-y-4">
          {mandatoryRules.map((rule) => {
            const evalResult = evaluations[rule.id];
            const currentVal = answers[rule.id];

            return (
              <div
                key={rule.id}
                className="bg-[#170e30] border border-purple-700/50 hover:border-purple-600 rounded-2xl p-5 transition-all shadow-md space-y-3.5"
              >
                {/* Top Row: Rule Name & Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-white">
                      {rule.requirementName}
                    </h4>
                    <p className="text-xs text-purple-300 mt-0.5">
                      <strong className="text-amber-400 font-semibold">Stated Condition:</strong>{' '}
                      {rule.condition}
                    </p>
                  </div>
                  <div>{getStatusBadge(evalResult.status)}</div>
                </div>

                {/* Input Controls */}
                <div className="bg-[#110724] border border-purple-800/50 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-purple-200">
                    {rule.question}
                  </span>

                  {/* Yes / No / Not Sure buttons */}
                  {rule.inputType === 'yes_no' && (
                    <div className="flex items-center gap-1.5 p-1 bg-[#090314] rounded-xl border border-purple-800/60 shrink-0">
                      {(rule.options || ['Yes', 'No', 'Not Sure']).map((opt) => {
                        const active = currentVal === opt;
                        let btnStyle = 'text-purple-300 hover:text-white';
                        if (active) {
                          if (opt === 'Yes') btnStyle = 'bg-emerald-500 text-slate-950 font-black shadow-sm';
                          else if (opt === 'No') btnStyle = 'bg-rose-500 text-white font-black shadow-sm';
                          else btnStyle = 'bg-amber-500 text-slate-950 font-black shadow-sm';
                        }
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => updateAnswer(rule.id, opt)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Numeric Input */}
                  {rule.inputType === 'number' && (
                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                      <input
                        type="number"
                        step="any"
                        value={currentVal !== undefined ? currentVal : ''}
                        onChange={(e) => updateAnswer(rule.id, e.target.value)}
                        placeholder={rule.placeholder || 'Enter value'}
                        className="w-full sm:w-36 bg-[#1a0f38] border border-purple-700/60 rounded-xl px-3 py-1.5 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-amber-400"
                      />
                      {rule.numericCondition?.unit && (
                        <span className="text-xs text-purple-300 font-mono">
                          {rule.numericCondition.unit}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Text / Course confirmation */}
                  {rule.inputType === 'text' && (
                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                      <input
                        type="text"
                        value={
                          currentVal !== undefined
                            ? currentVal
                            : rule.mappedProfileField === 'course'
                            ? studentProfile.course
                            : rule.mappedProfileField === 'academicYear'
                            ? studentProfile.academicYear
                            : ''
                        }
                        onChange={(e) => updateAnswer(rule.id, e.target.value)}
                        placeholder="Confirm details"
                        className="w-full sm:w-48 bg-[#1a0f38] border border-purple-700/60 rounded-xl px-3 py-1.5 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  )}
                </div>

                {/* Explanation text */}
                <div className="text-xs text-purple-300/90 flex items-start gap-2 pt-0.5">
                  <span className="text-amber-400 font-mono text-[11px]">•</span>
                  <span>{evalResult.explanation}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PREFERRED REQUIREMENTS (SEPARATED, DOES NOT DISQUALIFY) */}
      {preferredRules.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-purple-800/40">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-sm font-extrabold text-teal-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Preferred / Bonus Qualifications ({preferredRules.length})</span>
            </h3>
            <span className="text-xs text-teal-400/80 font-medium">
              Optional • Does not disqualify you
            </span>
          </div>

          <div className="space-y-3">
            {preferredRules.map((rule) => {
              const evalResult = evaluations[rule.id];
              const currentVal = answers[rule.id];

              return (
                <div
                  key={rule.id}
                  className="bg-[#140b2a] border border-teal-800/40 rounded-2xl p-4 transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-white">{rule.requirementName}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800/60">
                      Bonus
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <span className="text-purple-300">{rule.question}</span>

                    {rule.inputType === 'yes_no' && (
                      <div className="flex items-center gap-1 p-0.5 bg-[#090314] rounded-lg border border-purple-800/60">
                        {['Yes', 'No', 'Not Sure'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => updateAnswer(rule.id, opt)}
                            className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                              currentVal === opt
                                ? 'bg-teal-500 text-slate-950 font-black'
                                : 'text-purple-300 hover:text-white'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sensitive Information Disclaimer */}
      <div className="p-4 rounded-2xl bg-[#0f0722] border border-purple-800/40 flex items-start gap-2.5 text-xs text-purple-400">
        <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
        <span>
          Opportunity answers are stored exclusively in your current browser against this notice
          (ID: {noticeId.slice(0, 14)}...). They are not synchronized across other notices or uploaded
          to external servers.
        </span>
      </div>
    </div>
  );
};
