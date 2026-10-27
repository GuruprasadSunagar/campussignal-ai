import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  GraduationCap,
  FileCheck,
  CreditCard,
  Gift,
  ListOrdered,
  PhoneCall,
  Link as LinkIcon,
  AlertTriangle,
  HelpCircle,
  Building,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
  Bookmark,
  Share2,
} from 'lucide-react';
import { NoticeAnalysis } from '../types';

interface AnalysisResultsProps {
  analysis: NoticeAnalysis;
  previewDataUrl?: string;
  rawText?: string;
  sourceType: 'image' | 'text';
  fileName: string;
  onSaveNotice?: () => void;
  isSaved?: boolean;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  analysis,
  previewDataUrl,
  rawText,
  sourceType,
  fileName,
  onSaveNotice,
  isSaved = false,
}) => {
  const [showOriginal, setShowOriginal] = useState(false);

  // Category badge color mapper
  const getCategoryTheme = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'scholarship':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'internship':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'placement':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'competition':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'examination':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'workshop':
        return 'bg-violet-500/20 text-violet-300 border-violet-500/40';
      case 'event':
      default:
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
    }
  };

  const isNotMentioned = (val: string | undefined | null) => {
    if (!val) return true;
    const lower = val.toLowerCase();
    return lower.includes('not mentioned') || lower.includes('not stated');
  };

  const isNeedsVerification = (val: string | undefined | null) => {
    if (!val) return false;
    return val.toLowerCase().includes('needs verification');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Card */}
      <div className="bg-[#180f33] border border-purple-600/40 rounded-3xl p-6 sm:p-8 backdrop-blur-sm shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getCategoryTheme(
                  analysis.category
                )}`}
              >
                {analysis.category || 'General Notice'}
              </span>

              {analysis.organization && !isNotMentioned(analysis.organization) && (
                <span className="flex items-center gap-1 text-xs text-purple-300 bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-800/50">
                  <Building className="w-3.5 h-3.5 text-amber-400" />
                  <span>{analysis.organization}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {analysis.title}
            </h1>

            <p className="text-sm sm:text-base text-purple-200/90 leading-relaxed">
              {analysis.mainPurpose}
            </p>
          </div>

          {/* Quick Actions & Original Toggle */}
          <div className="flex flex-wrap lg:flex-col items-center gap-2.5 shrink-0">
            {onSaveNotice && (
              <button
                type="button"
                onClick={onSaveNotice}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border ${
                  isSaved
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>{isSaved ? 'Saved in Library' : 'Save Notice'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowOriginal(!showOriginal)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-700/50 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4 text-teal-400" />
              <span>{showOriginal ? 'Hide Original Source' : 'View Original Source'}</span>
              {showOriginal ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Original Source Viewer */}
        {showOriginal && (
          <div className="mt-6 pt-6 border-t border-purple-800/50 animate-fade-in">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Original Uploaded Source ({sourceType === 'image' ? 'Poster Image' : 'Pasted Text'})
            </h4>
            {sourceType === 'image' && previewDataUrl ? (
              <div className="max-w-md mx-auto rounded-2xl overflow-hidden border border-purple-700/60 shadow-xl bg-black/40 p-2">
                <img
                  src={previewDataUrl}
                  alt="Original College Poster"
                  className="w-full h-auto max-h-96 object-contain rounded-xl"
                />
              </div>
            ) : (
              <div className="bg-[#0e071e] rounded-2xl p-4 border border-purple-800/60 font-mono text-xs text-purple-200 whitespace-pre-wrap max-h-72 overflow-y-auto">
                {rawText || 'Pasted text content.'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Grid of Key Organized Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Key Points */}
        <div className="bg-[#150e2c] border border-purple-700/40 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-2.5 pb-4 border-b border-purple-800/40">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Important Key Points</h3>
              <p className="text-xs text-purple-300">Verified takeaways from the poster</p>
            </div>
          </div>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-purple-100">
            {analysis.keyPoints && analysis.keyPoints.length > 0 ? (
              analysis.keyPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                  <span className="leading-relaxed">{pt}</span>
                </li>
              ))
            ) : (
              <li className="text-purple-400 italic">Not mentioned in the notice.</li>
            )}
          </ul>
        </div>

        {/* Card 2: Deadline & Urgency */}
        <div className="bg-[#150e2c] border border-purple-700/40 rounded-3xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-4 border-b border-purple-800/40">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Application / Event Deadline</h3>
                <p className="text-xs text-purple-300">Explicit cutoff date &amp; time</p>
              </div>
            </div>

            <div className="mt-5 p-4 rounded-2xl bg-[#1e133d] border border-purple-700/50">
              <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider block">
                Official Stated Deadline
              </span>
              <p className="text-lg sm:text-xl font-black text-amber-300 mt-1">
                {analysis.deadline?.rawText || 'Not mentioned in the notice.'}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-purple-300 bg-purple-950/40 p-3 rounded-xl border border-purple-800/40">
            <span>Explicitly Stated in Source:</span>
            <span className="font-semibold text-white">
              {analysis.deadline?.isExplicit ? 'Yes (Verified in poster)' : 'No (Date omitted)'}
            </span>
          </div>
        </div>

        {/* Card 3: Eligibility Criteria */}
        <div className="bg-[#150e2c] border border-purple-700/40 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-2.5 pb-4 border-b border-purple-800/40">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Eligibility Requirements</h3>
              <p className="text-xs text-purple-300">Who is allowed to apply</p>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-xs sm:text-sm text-purple-100">
            {analysis.eligibility && analysis.eligibility.length > 0 ? (
              analysis.eligibility.map((item, i) => (
                <li
                  key={i}
                  className={`flex items-start gap-2.5 p-2 rounded-xl ${
                    isNotMentioned(item)
                      ? 'bg-purple-950/40 text-purple-400 italic'
                      : isNeedsVerification(item)
                      ? 'bg-amber-950/30 text-amber-200 border border-amber-800/40'
                      : 'bg-purple-950/30'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))
            ) : (
              <li className="text-purple-400 italic">Not mentioned in the notice.</li>
            )}
          </ul>
        </div>

        {/* Card 4: Required Documents */}
        <div className="bg-[#150e2c] border border-purple-700/40 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-2.5 pb-4 border-b border-purple-800/40">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Required Documents &amp; Certificates</h3>
              <p className="text-xs text-purple-300">Checklist of papers to prepare</p>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-xs sm:text-sm text-purple-100">
            {analysis.requiredDocuments && analysis.requiredDocuments.length > 0 ? (
              analysis.requiredDocuments.map((doc, i) => (
                <li
                  key={i}
                  className={`flex items-start gap-2.5 p-2 rounded-xl ${
                    isNotMentioned(doc) ? 'bg-purple-950/40 text-purple-400 italic' : 'bg-purple-950/30'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                  <span className="leading-snug">{doc}</span>
                </li>
              ))
            ) : (
              <li className="text-purple-400 italic">Not mentioned in the notice.</li>
            )}
          </ul>
        </div>

        {/* Card 5: Fees & Benefits */}
        <div className="bg-[#150e2c] border border-purple-700/40 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-2.5 pb-4 border-b border-purple-800/40">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Fees &amp; Benefits</h3>
              <p className="text-xs text-purple-300">Registration cost and awards</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40">
              <span className="text-[11px] font-semibold text-purple-400 block">Registration Fee</span>
              <p className="text-sm font-bold text-white mt-0.5">
                {analysis.fees || 'Not mentioned in the notice.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40">
              <span className="text-[11px] font-semibold text-purple-400 block mb-1">
                Benefits / Prizes / Stipends
              </span>
              <ul className="space-y-1 text-xs text-emerald-200">
                {analysis.benefits && analysis.benefits.length > 0 ? (
                  analysis.benefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span>✦</span>
                      <span>{b}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-purple-400 italic">Not mentioned in the notice.</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Card 6: Application Steps */}
        <div className="bg-[#150e2c] border border-purple-700/40 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-2.5 pb-4 border-b border-purple-800/40">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <ListOrdered className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Application Steps</h3>
              <p className="text-xs text-purple-300">How to register and apply</p>
            </div>
          </div>
          <ol className="mt-4 space-y-2 text-xs sm:text-sm text-purple-100">
            {analysis.applicationSteps && analysis.applicationSteps.length > 0 ? (
              analysis.applicationSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 p-2 rounded-xl bg-purple-950/30">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-snug">{step}</span>
                </li>
              ))
            ) : (
              <li className="text-purple-400 italic">Not mentioned in the notice.</li>
            )}
          </ol>
        </div>
      </div>

      {/* Card 7: Contact Details & Official Links */}
      <div className="bg-[#150e2c] border border-purple-700/40 rounded-3xl p-6 shadow-lg">
        <div className="flex items-center gap-2.5 pb-4 border-b border-purple-800/40">
          <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Contact Details &amp; Official Links</h3>
            <p className="text-xs text-purple-300">Where to reach organizers and register</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/40 space-y-2">
            <span className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              Contacts &amp; Coordinators
            </span>
            <ul className="space-y-1.5 text-purple-200">
              {analysis.contactAndLinks?.contacts && analysis.contactAndLinks.contacts.length > 0 ? (
                analysis.contactAndLinks.contacts.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span>{c}</span>
                  </li>
                ))
              ) : (
                <li className="text-purple-400 italic">Not mentioned in the notice.</li>
              )}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/40 space-y-2">
            <span className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-teal-400" />
              Official Registration Links
            </span>
            <ul className="space-y-1.5 text-purple-200">
              {analysis.contactAndLinks?.links && analysis.contactAndLinks.links.length > 0 ? (
                analysis.contactAndLinks.links.map((link, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    {link.startsWith('http') ? (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-300 hover:text-teal-200 underline break-all"
                      >
                        {link}
                      </a>
                    ) : (
                      <span className="break-all">{link}</span>
                    )}
                  </li>
                ))
              ) : (
                <li className="text-purple-400 italic">Not mentioned in the notice.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Card 8: Missing, Unclear, or Conflicting Info */}
      <div className="bg-[#1e0e2e] border border-amber-600/40 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-2.5 pb-4 border-b border-amber-700/40">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Missing, Unclear, or Conflicting Details</h3>
            <p className="text-xs text-amber-300">
              Honest audit of omissions and ambiguous items in the notice
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Missing info */}
          <div className="p-4 rounded-2xl bg-[#130720] border border-purple-800/50 space-y-2">
            <span className="font-bold text-rose-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              Missing Information
            </span>
            <ul className="space-y-1.5 text-purple-200">
              {analysis.missingOrUnclearInfo?.missing &&
              analysis.missingOrUnclearInfo.missing.length > 0 ? (
                analysis.missingOrUnclearInfo.missing.map((m, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-400">•</span>
                    <span>{m}</span>
                  </li>
                ))
              ) : (
                <li className="text-purple-400 italic">All key details are present.</li>
              )}
            </ul>
          </div>

          {/* Needs verification */}
          <div className="p-4 rounded-2xl bg-[#130720] border border-purple-800/50 space-y-2">
            <span className="font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              Needs Verification
            </span>
            <ul className="space-y-1.5 text-purple-200">
              {analysis.missingOrUnclearInfo?.needsVerification &&
              analysis.missingOrUnclearInfo.needsVerification.length > 0 ? (
                analysis.missingOrUnclearInfo.needsVerification.map((v, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-400">•</span>
                    <span>{v}</span>
                  </li>
                ))
              ) : (
                <li className="text-purple-400 italic">No ambiguous statements detected.</li>
              )}
            </ul>
          </div>

          {/* Conflicts */}
          <div className="p-4 rounded-2xl bg-[#130720] border border-purple-800/50 space-y-2">
            <span className="font-bold text-cyan-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5 text-cyan-400" />
              Conflicting Information
            </span>
            <ul className="space-y-1.5 text-purple-200">
              {analysis.missingOrUnclearInfo?.conflicts &&
              analysis.missingOrUnclearInfo.conflicts.length > 0 ? (
                analysis.missingOrUnclearInfo.conflicts.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-amber-200 font-medium">
                    <span className="text-cyan-400">⚡</span>
                    <span>{c}</span>
                  </li>
                ))
              ) : (
                <li className="text-purple-400 italic">No conflicting dates or statements detected.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
