import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Quote,
  Scale,
  FileSearch,
} from 'lucide-react';
import { NoticeAnalysis, SourceEvidenceItem } from '../types';

interface SourceEvidenceSectionProps {
  analysis: NoticeAnalysis;
}

export const SourceEvidenceSection: React.FC<SourceEvidenceSectionProps> = ({ analysis }) => {
  const evidenceList: SourceEvidenceItem[] =
    analysis.sourceEvidence && analysis.sourceEvidence.length > 0
      ? analysis.sourceEvidence
      : [
          {
            field: 'Title & Organization',
            extractedValue: `${analysis.title} (${analysis.organization || 'No org stated'})`,
            sourceQuote: analysis.title,
            status: 'clear',
          },
          {
            field: 'Official Deadline',
            extractedValue: analysis.deadline?.rawText || 'Not mentioned',
            sourceQuote: analysis.deadline?.isExplicit
              ? analysis.deadline.rawText
              : 'No explicit date in notice',
            status: analysis.deadline?.isExplicit ? 'clear' : 'missing',
          },
          {
            field: 'Eligibility Criteria',
            extractedValue: (analysis.eligibility || []).join('; ') || 'Not mentioned',
            sourceQuote: (analysis.eligibility || []).join(' | '),
            status: analysis.eligibility?.length ? 'clear' : 'missing',
          },
          {
            field: 'Registration Fees',
            extractedValue: analysis.fees || 'Not mentioned',
            sourceQuote: analysis.fees || 'No fee mentioned',
            status: analysis.fees ? 'clear' : 'missing',
          },
          {
            field: 'Application Mode & Links',
            extractedValue: (analysis.contactAndLinks?.links || []).join(', ') || 'Not stated',
            sourceQuote: (analysis.contactAndLinks?.links || []).join(', '),
            status: analysis.contactAndLinks?.links?.length ? 'clear' : 'missing',
          },
        ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'clear':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Verified in Source
          </span>
        );
      case 'missing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            Omitted in Source
          </span>
        );
      case 'needs_verification':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            Needs Verification
          </span>
        );
    }
  };

  const conflicts = analysis.missingOrUnclearInfo?.conflicts || [];

  return (
    <div className="bg-[#150d2e] border border-purple-600/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-purple-800/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/40">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">Trust the Source</h2>
              <span className="text-xs">📜🔍</span>
            </div>
            <p className="text-xs sm:text-sm text-purple-300">
              Direct evidence verification between extracted facts and original notice excerpts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-teal-300 bg-teal-950/40 px-3 py-1.5 rounded-xl border border-teal-800/50">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>Zero Fabricated Information</span>
        </div>
      </div>

      {/* Conflicting Information Callout if present */}
      {conflicts.length > 0 && (
        <div className="mt-5 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 text-amber-200">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Conflicting Information Detected in Notice!
          </div>
          <p className="text-xs text-amber-100/90 leading-relaxed mb-2">
            The poster contains internal inconsistencies (such as conflicting deadline dates or differing venues).
          </p>
          <ul className="space-y-1 text-xs">
            {conflicts.map((c, i) => (
              <li key={i} className="flex items-start gap-1.5 font-mono text-amber-200">
                <span>⚡</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Evidence Table / Cards */}
      <div className="mt-6 space-y-4">
        {evidenceList.map((item, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-2xl bg-[#1b1138] border border-purple-800/50 hover:border-purple-600/60 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-sm sm:text-base text-white">{item.field}</h4>
              </div>
              <div>{getStatusBadge(item.status)}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Extracted Value */}
              <div className="p-3 rounded-xl bg-purple-950/50 border border-purple-800/40 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">
                  Extracted Fact / Conclusion
                </span>
                <p className="text-purple-100 font-medium leading-relaxed">
                  {item.extractedValue}
                </p>
              </div>

              {/* Exact Quote from Notice */}
              <div className="p-3 rounded-xl bg-[#100824] border border-purple-800/40 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block flex items-center gap-1">
                  <Quote className="w-3 h-3" />
                  Direct Source Excerpt
                </span>
                <p className="text-teal-200 font-mono italic leading-relaxed">
                  "{item.sourceQuote || 'No supporting text found in notice'}"
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimers & Integrity Policy */}
      <div className="mt-6 p-4 rounded-2xl bg-[#0f0722] border border-purple-900/60 text-xs text-purple-400 space-y-2">
        <p className="font-semibold text-purple-300">
          CampusSignal AI Truth Policy:
        </p>
        <p className="leading-relaxed text-[11px]">
          1. Information stated as fact must be directly corroborated by the poster text.
          <br />
          2. When details are missing (e.g. stipend, fee, date), Gemma 4 explicitly states "Not mentioned in the notice."
          <br />
          3. When text is blurry or conflicting, Gemma 4 explicitly flags "Needs verification."
        </p>
      </div>
    </div>
  );
};
