import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Edit3,
  ShieldAlert,
} from 'lucide-react';
import { NoticeAnalysis, PersonalizationResult, StudentProfile } from '../types';
import { personalizeNotice } from '../services/api';
import { PersonalizedEligibilityQuestionnaire } from './PersonalizedEligibilityQuestionnaire';

interface PersonalizedAssistantProps {
  noticeId: string;
  analysis: NoticeAnalysis;
  studentProfile: StudentProfile;
  onEditProfile: () => void;
  cachedResult?: PersonalizationResult;
  onMatchUpdated?: (result: PersonalizationResult) => void;
  opportunityAnswers?: Record<string, any>;
  onAnswersChanged?: (answers: Record<string, any>) => void;
}

export const PersonalizedAssistant: React.FC<PersonalizedAssistantProps> = ({
  noticeId,
  analysis,
  studentProfile,
  onEditProfile,
  cachedResult,
  onMatchUpdated,
  opportunityAnswers = {},
  onAnswersChanged,
}) => {
  const [matchResult, setMatchResult] = useState<PersonalizationResult | null>(cachedResult || null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const runEvaluation = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await personalizeNotice({
        noticeAnalysis: analysis,
        studentProfile: studentProfile,
      });
      setMatchResult(res.data);
      if (onMatchUpdated) onMatchUpdated(res.data);
    } catch (err: any) {
      console.error('Personalization error:', err);
      setError(err.message || 'Failed to evaluate personalized match with Gemma 4.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!cachedResult) {
      runEvaluation();
    }
  }, [analysis.title, studentProfile.course, studentProfile.academicYear, studentProfile.marks]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Potential match':
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
        };
      case 'More information needed':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
          icon: <HelpCircle className="w-5 h-5 text-amber-400" />,
        };
      case 'Verify the requirements':
        return {
          bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
          icon: <HelpCircle className="w-5 h-5 text-cyan-400" />,
        };
      case 'Does not appear to match':
      default:
        return {
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
          icon: <XCircle className="w-5 h-5 text-rose-400" />,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. DYNAMIC NOTICE-SPECIFIC ELIGIBILITY QUESTIONNAIRE */}
      <PersonalizedEligibilityQuestionnaire
        noticeId={noticeId}
        analysis={analysis}
        studentProfile={studentProfile}
        initialAnswers={opportunityAnswers}
        onAnswersChanged={onAnswersChanged}
      />

      {/* 2. GEMMA 4 HOLISTIC PERSONALIZED MATCHING & EXPLANATION */}
      <div className="bg-[#150d2e] border border-purple-600/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-purple-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Personalized Student Assistant
              </h2>
              <p className="text-xs sm:text-sm text-purple-300">
                Gemma 4 holistic assessment and personalized next steps
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onEditProfile}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/50 hover:bg-purple-800 text-xs font-semibold text-purple-200 border border-purple-700/50 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span>Edit Profile</span>
            </button>
            <button
              type="button"
              onClick={runEvaluation}
              disabled={loading}
              className="p-2 rounded-xl bg-purple-900/50 hover:bg-purple-800 text-purple-200 border border-purple-700/50 cursor-pointer disabled:opacity-50"
              title="Re-run evaluation"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Student Profile Quick View */}
        <div className="mt-4 p-4 rounded-2xl bg-[#0f0722] border border-purple-800/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3 text-purple-200">
            <span className="font-semibold text-white">Evaluating for:</span>
            <span className="px-2.5 py-1 rounded-lg bg-purple-950 border border-purple-700/60 font-mono text-amber-300">
              {studentProfile.course}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-purple-950 border border-purple-700/60">
              {studentProfile.academicYear}
            </span>
            {studentProfile.marks && (
              <span className="px-2.5 py-1 rounded-lg bg-purple-950 border border-purple-700/60 text-teal-300">
                Score: {studentProfile.marks}%
              </span>
            )}
          </div>
          <span className="text-[11px] text-purple-400 italic">
            Interests: {(studentProfile.interests || []).join(', ') || 'General'}
          </span>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full border-3 border-amber-400 border-t-transparent animate-spin" />
            <p className="text-sm font-semibold text-purple-200">
              Gemma 4 is matching this notice with your student profile...
            </p>
            <p className="text-xs text-purple-400">Checking eligibility, year restrictions, and skills</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="mt-4 p-4 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-200 flex items-center justify-between">
            <p>{error}</p>
            <button
              onClick={runEvaluation}
              className="px-3 py-1 bg-rose-800 text-white rounded-lg font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Result Display */}
        {matchResult && !loading && (
          <div className="mt-6 space-y-6 animate-fade-in">
            {/* Main Status Callout */}
            {(() => {
              const badge = getStatusBadge(matchResult.status);
              return (
                <div
                  className={`p-5 rounded-2xl border ${badge.bg} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
                >
                  <div className="flex items-center gap-3">
                    {badge.icon}
                    <div>
                      <span className="text-xs uppercase font-extrabold tracking-wider block opacity-80">
                        Gemma 4 Evaluation Result
                      </span>
                      <h3 className="text-xl font-black">{matchResult.status}</h3>
                    </div>
                  </div>
                  <p className="text-xs max-w-sm sm:text-right opacity-90 leading-relaxed font-medium">
                    {matchResult.reasons}
                  </p>
                </div>
              );
            })()}

            {/* Relevance explanation */}
            <div className="p-4 rounded-2xl bg-[#1c123d] border border-purple-700/50">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                Why This Relates To You
              </span>
              <p className="text-sm text-purple-100 leading-relaxed">
                {matchResult.relevanceExplanation}
              </p>
            </div>

            {/* Breakdown columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Matched */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 space-y-2">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Requirements Satisfied
                </span>
                <ul className="space-y-1.5 text-emerald-100">
                  {matchResult.matchedRequirements && matchResult.matchedRequirements.length > 0 ? (
                    matchResult.matchedRequirements.map((r, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span>✓</span>
                        <span>{r}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-emerald-400/70 italic">No direct matches verified.</li>
                  )}
                </ul>
              </div>

              {/* Unmet */}
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/40 space-y-2">
                <span className="font-bold text-rose-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  Unsatisfied Requirements
                </span>
                <ul className="space-y-1.5 text-rose-100">
                  {matchResult.unmetRequirements && matchResult.unmetRequirements.length > 0 ? (
                    matchResult.unmetRequirements.map((u, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span>✗</span>
                        <span>{u}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-rose-400/70 italic">None detected based on stated notice.</li>
                  )}
                </ul>
              </div>

              {/* Missing Info */}
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 space-y-2">
                <span className="font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  Information Still Missing
                </span>
                <ul className="space-y-1.5 text-amber-100">
                  {matchResult.missingInformation && matchResult.missingInformation.length > 0 ? (
                    matchResult.missingInformation.map((m, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span>?</span>
                        <span>{m}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-amber-400/70 italic">All necessary requirements clarified.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Next Steps for Student */}
            <div className="p-5 rounded-2xl bg-[#1c123d] border border-purple-700/50">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                What You Should Do Next
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {matchResult.nextSteps &&
                  matchResult.nextSteps.map((step, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-purple-950/60 border border-purple-800/50 text-xs text-purple-100"
                    >
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-snug">{step}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="flex items-center gap-2 text-[11px] text-purple-400 italic px-2">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                CampusSignal AI evaluation is strictly informational. Official college decisions reside
                with the organizing authority.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
