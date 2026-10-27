import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Image as ImageIcon,
  Check,
  X,
  Layers,
} from 'lucide-react';
import { SAMPLE_NOTICES, SampleNotice } from '../data/sampleNotices';
import { analyzeNotice } from '../services/api';
import { NoticeAnalysis } from '../types';
import { CasperMood } from './CasperMascot';

interface NoticeScannerProps {
  onAnalysisSuccess: (result: {
    analysis: NoticeAnalysis;
    sourceType: 'image' | 'text';
    fileName: string;
    previewDataUrl?: string;
    rawText?: string;
  }) => void;
  onCasperMoodChange: (mood: CasperMood, msg?: string) => void;
}

export const NoticeScanner: React.FC<NoticeScannerProps> = ({
  onAnalysisSuccess,
  onCasperMoodChange,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File selection & validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    validateAndLoadFile(file);
  };

  const validateAndLoadFile = (file: File) => {
    // Validate file type: JPG, JPEG, PNG
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Unsupported file format. Please upload a JPG, JPEG, or PNG poster.');
      return;
    }

    // Limit size to 8MB
    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('File size exceeds 8MB limit. Please upload a smaller image.');
      return;
    }

    setImageFile(file);
    setSelectedSampleId(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndLoadFile(e.dataTransfer.files[0]);
    }
  };

  // Load sample notice
  const handleSelectSample = (sample: SampleNotice) => {
    setErrorMessage(null);
    setSelectedSampleId(sample.id);

    if (sample.posterSvgBase64) {
      setActiveTab('upload');
      setImagePreview(sample.posterSvgBase64);
      // Create a virtual file for the SVG poster
      setImageFile(new File(['sample-poster'], `${sample.id}.png`, { type: 'image/png' }));
      setPastedText('');
    } else {
      setActiveTab('paste');
      setPastedText(sample.text);
      setImagePreview(null);
      setImageFile(null);
    }
  };

  const handleClear = () => {
    setImageFile(null);
    setImagePreview(null);
    setPastedText('');
    setErrorMessage(null);
    setSelectedSampleId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onCasperMoodChange('greeting');
  };

  // Perform Real Gemma 4 Analysis
  const handleAnalyze = async () => {
    setErrorMessage(null);

    if (activeTab === 'upload' && !imagePreview) {
      setErrorMessage('Please select or upload a college notice poster image first.');
      return;
    }

    if (activeTab === 'paste' && !pastedText.trim()) {
      setErrorMessage('Please paste the notice or circular text into the box.');
      return;
    }

    setLoading(true);
    onCasperMoodChange('scanning', 'Your notice is being examined by Gemma 4... Looking through the mist!');

    try {
      let result;
      if (activeTab === 'upload' && imagePreview) {
        // Strip data prefix for base64 payload
        const base64Data = imagePreview.includes('base64,')
          ? imagePreview.split('base64,')[1]
          : imagePreview;
        const mimeType = imageFile?.type || 'image/png';

        result = await analyzeNotice({
          image: {
            data: base64Data,
            mimeType: mimeType,
          },
          fileName: imageFile?.name || 'college_poster.png',
        });

        onCasperMoodChange('success', 'Opportunity discovered! Important details extracted from the poster.');
        onAnalysisSuccess({
          analysis: result.data,
          sourceType: 'image',
          fileName: imageFile?.name || 'college_poster.png',
          previewDataUrl: imagePreview,
        });
      } else {
        result = await analyzeNotice({
          text: pastedText,
          fileName: 'pasted_notice_circular.txt',
        });

        onCasperMoodChange('success', 'Opportunity discovered! Circular contents analyzed with Gemma 4.');
        onAnalysisSuccess({
          analysis: result.data,
          sourceType: 'text',
          fileName: 'pasted_notice_circular.txt',
          rawText: pastedText,
        });
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      const msg = err.message || 'Failed to analyze notice with Gemma 4. Please try again.';
      setErrorMessage(msg);
      onCasperMoodChange('unclear', 'Gemma 4 encountered an error reading the notice. Let\'s review or retry!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#150d2e]/90 border border-purple-700/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Tabs */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-purple-800/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🎃</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">Ghost Notice Scanner</h2>
          </div>
          <p className="text-xs sm:text-sm text-purple-300 mt-1">
            Feed any college poster, flyer, or circular into Google Gemma 4.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center p-1 bg-[#0f0924] rounded-2xl border border-purple-800/50">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-md'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            <Upload className="w-4 h-4 text-amber-400" />
            <span>Scan a Notice</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'paste'
                ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-md'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-teal-400" />
            <span>Paste Notice Text</span>
          </button>
        </div>
      </div>

      {/* 1-Click Sample Notices Bar */}
      <div className="mt-5 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quick Test Posters (1-Click Sample Notices)
          </span>
          <span className="text-[11px] text-purple-400">Click any card to pre-load</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SAMPLE_NOTICES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                selectedSampleId === sample.id
                  ? 'bg-purple-900/60 border-amber-400 ring-1 ring-amber-400'
                  : 'bg-purple-950/40 border-purple-800/40 hover:border-purple-600 hover:bg-purple-900/30'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  {sample.category}
                </span>
                {selectedSampleId === sample.id && (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
              <p className="text-xs font-semibold text-white line-clamp-1">{sample.title}</p>
              <p className="text-[11px] text-purple-300/80 line-clamp-2 mt-0.5">{sample.shortDesc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Area */}
      <div className="mt-6 relative z-10">
        {activeTab === 'upload' ? (
          <div>
            {imagePreview ? (
              /* Image Preview Box */
              <div className="relative rounded-2xl overflow-hidden border-2 border-purple-600/50 bg-[#0e071e] p-4 flex flex-col md:flex-row items-center gap-6">
                <div className="relative max-h-72 max-w-xs overflow-hidden rounded-xl border border-purple-800/60 shadow-lg">
                  <img
                    src={imagePreview}
                    alt="Uploaded notice poster preview"
                    className="w-full h-auto object-contain max-h-72"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 rounded bg-black/70 backdrop-blur-md text-[10px] text-amber-300 font-mono">
                      Poster Loaded
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-3 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-white font-semibold">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>{imageFile?.name || 'Selected Notice Poster'}</span>
                  </div>
                  <p className="text-xs text-purple-300">
                    Ready to be examined directly by Gemma 4. The model will parse all text, dates,
                    eligibility rules, links, and missing details.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-purple-900/60 hover:bg-purple-800 text-purple-200 rounded-lg text-xs font-medium cursor-pointer border border-purple-700/50"
                    >
                      Replace Poster
                    </button>
                    <button
                      type="button"
                      onClick={handleClear}
                      className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-lg text-xs font-medium cursor-pointer border border-rose-800/40"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Dropzone */
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="group border-2 border-dashed border-purple-700/60 hover:border-amber-400/80 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all bg-[#120a27]/60 hover:bg-[#1a0f38]/60"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-900/50 group-hover:bg-amber-500/20 text-purple-300 group-hover:text-amber-400 flex items-center justify-center transition-all shadow-inner">
                  <Upload className="w-8 h-8 transition-transform group-hover:-translate-y-1" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mt-4">
                  Drag and drop a college poster image
                </h3>
                <p className="text-xs sm:text-sm text-purple-300 mt-1 max-w-sm mx-auto">
                  Supports JPG, JPEG, and PNG files up to 8MB.
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-800/40 border border-purple-700/50 text-xs font-semibold text-purple-200 group-hover:text-amber-300">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Browse from device</span>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          /* Paste text area */
          <div className="space-y-3">
            <div className="relative">
              <textarea
                value={pastedText}
                onChange={(e) => {
                  setPastedText(e.target.value);
                  setErrorMessage(null);
                }}
                rows={8}
                placeholder="Paste notice circular, email announcement, or poster text here... (e.g. 'Scholarship announcement for BCA students...')"
                className="w-full bg-[#120a27] border border-purple-700/60 rounded-2xl p-4 text-sm text-white placeholder-purple-400/40 focus:outline-none focus:border-amber-400 resize-y font-mono"
              />
              {pastedText && (
                <button
                  type="button"
                  onClick={() => setPastedText('')}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-300 hover:text-white"
                  title="Clear text"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between text-xs text-purple-400 px-1">
              <span>Characters: {pastedText.length}</span>
              <span>Gemma 4 will parse unstructured text into 13 verified fields</span>
            </div>
          </div>
        )}

        {/* Error message display */}
        {errorMessage && (
          <div className="mt-4 p-4 rounded-2xl bg-rose-950/60 border border-rose-700/60 text-rose-200 text-xs sm:text-sm flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-white">Analysis Could Not Complete</p>
              <p className="mt-0.5 text-rose-200/90">{errorMessage}</p>
            </div>
            <button
              onClick={handleAnalyze}
              className="px-3 py-1 bg-rose-800 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shrink-0 cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-purple-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
            <span>Real server-side Gemma 4 request with zero mocked data</span>
          </div>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading || (activeTab === 'upload' && !imagePreview) || (activeTab === 'paste' && !pastedText.trim())}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold rounded-2xl text-sm transition-all cursor-pointer shadow-xl shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Gemma 4 is Examining Notice...</span>
              </>
            ) : (
              <>
                <span>👻</span>
                <span>Analyze Notice with Gemma 4</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
