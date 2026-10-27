import React, { useState } from 'react';
import {
  Globe,
  Sparkles,
  RefreshCw,
  BookOpen,
  ListCheck,
  Languages,
  AlertCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import {
  NoticeAnalysis,
  SupportedLanguage,
  TranslationMode,
  TranslationResult,
} from '../types';
import { translateNotice } from '../services/api';

interface LanguageTranslatorProps {
  analysis: NoticeAnalysis;
  cachedTranslations?: Record<string, TranslationResult>;
  onTranslationSuccess?: (key: string, res: TranslationResult) => void;
}

export const LanguageTranslator: React.FC<LanguageTranslatorProps> = ({
  analysis,
  cachedTranslations = {},
  onTranslationSuccess,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('Hindi');
  const [selectedMode, setSelectedMode] = useState<TranslationMode>('simple');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cacheKey = `${selectedLanguage}_${selectedMode}`;
  const [translations, setTranslations] = useState<Record<string, TranslationResult>>(
    cachedTranslations
  );

  const activeResult = translations[cacheKey] || null;

  const handleTranslate = async (lang: SupportedLanguage, mode: TranslationMode) => {
    setSelectedLanguage(lang);
    setSelectedMode(mode);
    const key = `${lang}_${mode}`;

    if (translations[key]) {
      // Already cached
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await translateNotice({
        noticeAnalysis: analysis,
        targetLanguage: lang,
        mode: mode,
      });

      const updated = { ...translations, [key]: res.data };
      setTranslations(updated);
      if (onTranslationSuccess) onTranslationSuccess(key, res.data);
    } catch (err: any) {
      console.error('Translation error:', err);
      setError(err.message || `Failed to generate translation in ${lang} with Gemma 4.`);
    } finally {
      setLoading(false);
    }
  };

  const getLanguageLabel = (lang: SupportedLanguage) => {
    switch (lang) {
      case 'Hindi':
        return 'हिंदी (Hindi)';
      case 'Kannada':
        return 'ಕನ್ನಡ (Kannada)';
      case 'English':
      default:
        return 'English (Simple)';
    }
  };

  return (
    <div className="bg-[#150d2e] border border-purple-600/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-purple-800/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/40">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Magic Language Translator
            </h2>
            <p className="text-xs sm:text-sm text-purple-300">
              Gemma 4 explains complex college notices in your regional mother tongue
            </p>
          </div>
        </div>

        {/* Language selector chips */}
        <div className="flex items-center gap-2 p-1 bg-[#0f0722] rounded-2xl border border-purple-800/60">
          {(['English', 'Hindi', 'Kannada'] as SupportedLanguage[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => handleTranslate(lang, selectedMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedLanguage === lang
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              {getLanguageLabel(lang)}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Action Buttons */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => handleTranslate(selectedLanguage, 'simple')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
            selectedMode === 'simple'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
              : 'bg-purple-950/50 text-purple-200 border-purple-800/50 hover:bg-purple-900/40'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-950" />
          <span>Explain in Simple Words</span>
        </button>

        <button
          type="button"
          onClick={() => handleTranslate(selectedLanguage, 'translate')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
            selectedMode === 'translate'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
              : 'bg-purple-950/50 text-purple-200 border-purple-800/50 hover:bg-purple-900/40'
          }`}
        >
          <Languages className="w-4 h-4 text-teal-400" />
          <span>Translate Notice</span>
        </button>

        <button
          type="button"
          onClick={() => handleTranslate(selectedLanguage, 'key_points')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
            selectedMode === 'key_points'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
              : 'bg-purple-950/50 text-purple-200 border-purple-800/50 hover:bg-purple-900/40'
          }`}
        >
          <ListCheck className="w-4 h-4 text-emerald-400" />
          <span>Explain Key Points</span>
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-12 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full border-3 border-teal-400 border-t-transparent animate-spin" />
          <p className="text-sm font-semibold text-purple-200">
            Translating into {selectedLanguage} with Gemma 4...
          </p>
          <p className="text-xs text-purple-400">
            Preserving exact deadlines, dates, contact numbers, and URLs
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="mt-4 p-4 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <p>{error}</p>
          </div>
          <button
            onClick={() => handleTranslate(selectedLanguage, selectedMode)}
            className="px-3 py-1 bg-rose-800 text-white rounded-lg font-semibold flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Retry
          </button>
        </div>
      )}

      {/* Translation Output */}
      {activeResult && !loading && (
        <div className="mt-6 space-y-6 animate-fade-in">
          {/* Header Banner */}
          <div className="p-5 rounded-2xl bg-[#1e133d] border border-teal-500/40">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
                {selectedLanguage} •{' '}
                {selectedMode === 'simple'
                  ? 'Simple Words Explanation'
                  : selectedMode === 'translate'
                  ? 'Full Notice Translation'
                  : 'Key Takeaways'}
              </span>
              <span className="text-[11px] text-purple-300 font-mono">Powered by Gemma 4</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {activeResult.translatedTitle}
            </h3>
            {activeResult.headline && (
              <p className="text-xs sm:text-sm text-amber-300 font-medium mt-1">
                {activeResult.headline}
              </p>
            )}
          </div>

          {/* Simple Explanation or Translated Body */}
          {activeResult.simpleExplanation && (
            <div className="p-5 rounded-2xl bg-[#170e30] border border-purple-800/50">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
                Detailed Explanation ({selectedLanguage})
              </span>
              <div className="text-sm sm:text-base text-purple-100 leading-relaxed whitespace-pre-line space-y-2 font-normal">
                {activeResult.simpleExplanation}
              </div>
            </div>
          )}

          {/* Key Bullet Points */}
          {activeResult.keyPoints && activeResult.keyPoints.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#170e30] border border-purple-800/50">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block mb-3">
                Key Points ({selectedLanguage})
              </span>
              <ul className="space-y-2 text-sm text-purple-100">
                {activeResult.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 shrink-0" />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Deadline Alert Warning */}
          {activeResult.deadlineAlert && (
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-600/50 flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Deadline Warning ({selectedLanguage})
                </span>
                <p className="text-sm text-amber-100 font-semibold mt-0.5">
                  {activeResult.deadlineAlert}
                </p>
              </div>
            </div>
          )}

          {/* Action Steps in target language */}
          {activeResult.actionSteps && activeResult.actionSteps.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#170e30] border border-purple-800/50">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-3">
                What to Do ({selectedLanguage})
              </span>
              <div className="space-y-2">
                {activeResult.actionSteps.map((step, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-purple-950/50 text-xs sm:text-sm text-purple-100"
                  >
                    <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-snug">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Critical Preserved Data Footer */}
          <div className="p-4 rounded-2xl bg-[#0f0722] border border-purple-900/60 flex flex-wrap items-center justify-between gap-3 text-xs text-purple-300">
            <span className="flex items-center gap-1.5 text-teal-300 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Preserved exact dates, fees &amp; urls
            </span>
            <span>
              Official stated deadline: {analysis.deadline?.rawText || 'None stated'}
            </span>
          </div>
        </div>
      )}

      {/* Initial state prompting translation */}
      {!activeResult && !loading && !error && (
        <div className="mt-6 p-8 rounded-2xl bg-[#100824] border border-purple-800/40 text-center space-y-3">
          <Languages className="w-10 h-10 mx-auto text-teal-400/80" />
          <h4 className="font-bold text-base text-white">
            Ready to Translate into {selectedLanguage}
          </h4>
          <p className="text-xs text-purple-300 max-w-sm mx-auto">
            Click one of the mode buttons above to generate a complete, accurate translation with
            Gemma 4.
          </p>
          <button
            type="button"
            onClick={() => handleTranslate(selectedLanguage, selectedMode)}
            className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-lg shadow-teal-500/20"
          >
            Translate Now into {selectedLanguage}
          </button>
        </div>
      )}
    </div>
  );
};
