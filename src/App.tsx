import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  FileText,
  Clock,
  CheckCircle2,
  Bookmark,
  Calendar,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Languages,
  BookOpen,
  FolderOpen,
  CheckSquare,
  Flame,
  Search,
} from 'lucide-react';
import { HauntedCampusLanding } from './components/HauntedCampusLanding';
import { Header } from './components/Header';
import { Sidebar, DashboardView } from './components/Sidebar';
import { CasperMascot, CasperMood } from './components/CasperMascot';
import { NoticeScanner } from './components/NoticeScanner';
import { AnalysisResults } from './components/AnalysisResults';
import { PersonalizedAssistant } from './components/PersonalizedAssistant';
import { LanguageTranslator } from './components/LanguageTranslator';
import { DeadlineCurseBreaker } from './components/DeadlineCurseBreaker';
import { SourceEvidenceSection } from './components/SourceEvidenceSection';
import { StudentProfileModal } from './components/StudentProfileModal';
import { StudentProfileView } from './components/StudentProfileView';
import { DeadlineTrackerView } from './components/DeadlineTrackerView';
import { MyOpportunitiesView } from './components/MyOpportunitiesView';
import { SettingsView } from './components/SettingsView';
import { SavedNoticesDrawer } from './components/SavedNoticesDrawer';
import { HalloweenDecorations } from './components/HalloweenDecorations';
import {
  NoticeAnalysis,
  PersonalizationResult,
  SavedNoticeRecord,
  StudentProfile,
  SupportedLanguage,
  TranslationResult,
} from './types';

const DEFAULT_PROFILE: StudentProfile = {
  course: 'BCA (Bachelor of Computer Applications)',
  academicYear: '2nd Year',
  interests: ['internships', 'competitions', 'scholarships', 'workshops'],
  skills: ['Python', 'Web Development', 'SQL'],
  marks: 78.5,
};

export default function App() {
  // FIRST PAGE: Haunted Campus Cinematic Entrance
  const [isOnLanding, setIsOnLanding] = useState<boolean>(true);

  // Dashboard Sidebar Navigation View
  const [dashboardView, setDashboardView] = useState<DashboardView>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Analysis Feature Tabs (when analyzing a notice)
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<
    'analysis' | 'personalize' | 'translate' | 'deadline' | 'source'
  >('analysis');

  // Active Notice Analysis State
  const [currentNotice, setCurrentNotice] = useState<{
    id: string;
    analysis: NoticeAnalysis;
    sourceType: 'image' | 'text';
    fileName: string;
    previewDataUrl?: string;
    rawText?: string;
  } | null>(null);

  // Cached state for active notice
  const [currentPersonalization, setCurrentPersonalization] = useState<
    PersonalizationResult | undefined
  >(undefined);
  const [currentOpportunityAnswers, setCurrentOpportunityAnswers] = useState<Record<string, any>>({});
  const [currentTranslations, setCurrentTranslations] = useState<
    Record<string, TranslationResult>
  >({});
  const [currentChecklistState, setCurrentChecklistState] = useState<Record<string, boolean>>({});

  // Student Profile
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('campussignal_student_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return DEFAULT_PROFILE;
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Saved Notices Storage
  const [savedNotices, setSavedNotices] = useState<SavedNoticeRecord[]>(() => {
    try {
      const saved = localStorage.getItem('campussignal_saved_notices');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return [];
  });
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);

  // Mascot Mood & Speech
  const [casperMood, setCasperMood] = useState<CasperMood>('greeting');
  const [casperMessage, setCasperMessage] = useState<string | undefined>(undefined);

  // Sync profile to localStorage
  const handleSaveProfile = (newProfile: StudentProfile) => {
    setStudentProfile(newProfile);
    try {
      localStorage.setItem('campussignal_student_profile', JSON.stringify(newProfile));
    } catch (e) {
      // ignore
    }
  };

  // Sync saved notices to localStorage
  const persistSavedNotices = (records: SavedNoticeRecord[]) => {
    setSavedNotices(records);
    try {
      localStorage.setItem('campussignal_saved_notices', JSON.stringify(records));
    } catch (e) {
      // ignore
    }
  };

  // Handle successful analysis from Ghost Notice Scanner
  const handleAnalysisSuccess = (result: {
    analysis: NoticeAnalysis;
    sourceType: 'image' | 'text';
    fileName: string;
    previewDataUrl?: string;
    rawText?: string;
  }) => {
    const noticeId = `notice_${Date.now()}`;
    setCurrentNotice({
      id: noticeId,
      ...result,
    });
    setCurrentPersonalization(undefined);
    // Load any existing answers for this notice ID if previously saved
    try {
      const storedAnswers = localStorage.getItem(`campussignal_answers_${noticeId}`);
      setCurrentOpportunityAnswers(storedAnswers ? JSON.parse(storedAnswers) : {});
    } catch (e) {
      setCurrentOpportunityAnswers({});
    }
    setCurrentTranslations({});
    setCurrentChecklistState({});
    setDashboardView('analyze');
    setActiveAnalysisTab('analysis');

    // Check if deadline warning is warranted
    if (result.analysis.deadline?.urgencyHint === 'urgent') {
      setCasperMood('deadline-alert');
      setCasperMessage("Deadline warning: Don't let this opportunity disappear into the darkness!");
    } else {
      setCasperMood('success');
      setCasperMessage('Opportunity discovered! Notice inspected with Gemma 4.');
    }
  };

  // Update and auto-persist answers per notice
  const handleOpportunityAnswersChanged = (answers: Record<string, any>) => {
    setCurrentOpportunityAnswers(answers);
    if (currentNotice) {
      try {
        localStorage.setItem(`campussignal_answers_${currentNotice.id}`, JSON.stringify(answers));
      } catch (e) {
        // ignore
      }
      setSavedNotices((prev) => {
        const idx = prev.findIndex((n) => n.id === currentNotice.id);
        if (idx !== -1) {
          const next = [...prev];
          next[idx] = {
            ...next[idx],
            opportunityAnswers: answers,
          };
          try {
            localStorage.setItem('campussignal_saved_notices', JSON.stringify(next));
          } catch (e) {
            // ignore
          }
          return next;
        }
        return prev;
      });
    }
  };

  // Save current notice to library
  const handleSaveCurrentNotice = () => {
    if (!currentNotice) return;
    const existingIdx = savedNotices.findIndex((n) => n.id === currentNotice.id);

    const record: SavedNoticeRecord = {
      id: currentNotice.id,
      savedAt: new Date().toISOString(),
      sourceType: currentNotice.sourceType,
      fileName: currentNotice.fileName,
      previewDataUrl: currentNotice.previewDataUrl,
      rawText: currentNotice.rawText,
      analysis: currentNotice.analysis,
      personalization: currentPersonalization,
      opportunityAnswers: currentOpportunityAnswers,
      translations: currentTranslations,
      checklistState: currentChecklistState,
      customChecklistItems: [],
    };

    let updated: SavedNoticeRecord[];
    if (existingIdx !== -1) {
      updated = [...savedNotices];
      updated[existingIdx] = record;
    } else {
      updated = [record, ...savedNotices];
    }

    persistSavedNotices(updated);
    setCasperMood('success');
    setCasperMessage('Notice safely saved in your local library.');
  };

  // Select notice from saved library
  const handleSelectSavedNotice = (record: SavedNoticeRecord) => {
    setCurrentNotice({
      id: record.id,
      analysis: record.analysis,
      sourceType: record.sourceType,
      fileName: record.fileName,
      previewDataUrl: record.previewDataUrl,
      rawText: record.rawText,
    });
    setCurrentPersonalization(record.personalization);
    setCurrentOpportunityAnswers(record.opportunityAnswers || {});
    setCurrentTranslations(record.translations || {});
    setCurrentChecklistState(record.checklistState || {});
    setDashboardView('analyze');
    setActiveAnalysisTab('analysis');
    setCasperMood('greeting');
    setCasperMessage(`Reopened "${record.analysis.title}". All checklist progress restored.`);
  };

  const handleDeleteSavedNotice = (id: string) => {
    const updated = savedNotices.filter((n) => n.id !== id);
    persistSavedNotices(updated);
  };

  const handleClearAllSaved = () => {
    persistSavedNotices([]);
  };

  const isCurrentSaved = Boolean(
    currentNotice && savedNotices.some((n) => n.id === currentNotice.id)
  );

  // Compute upcoming deadlines from saved notices
  const upcomingDeadlines = savedNotices
    .filter((n) => n.analysis.deadline?.isExplicit)
    .slice(0, 4);

  // ================= VIEW 1: CINEMATIC HAUNTED CAMPUS ENTRANCE =================
  if (isOnLanding) {
    return (
      <HauntedCampusLanding
        onEnterCampus={() => {
          setIsOnLanding(false);
          setCasperMood('greeting');
          setCasperMessage("Boo! Welcome to the Haunted Campus dashboard. What shall we inspect first?");
        }}
        isGemmaActive={true}
      />
    );
  }

  // ================= VIEW 2: HAUNTED CAMPUS DASHBOARD WITH PERMANENT SIDEBAR =================
  return (
    <div className="min-h-screen bg-[#0b0618] text-purple-100 flex relative selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Halloween Ambient Visual Decorations */}
      <HalloweenDecorations />

      {/* Permanent Left Sidebar */}
      <Sidebar
        currentView={dashboardView}
        onSelectView={(v) => {
          setDashboardView(v);
          if (v === 'dashboard') {
            setCasperMood('greeting');
            setCasperMessage("Here's your Haunted Campus overview and deadlines.");
          } else if (v === 'analyze') {
            setCasperMood('scanning');
            setCasperMessage("Ready to examine college circulars and posters with Gemma 4.");
          }
        }}
        onExitToEntrance={() => setIsOnLanding(true)}
        savedNoticesCount={savedNotices.length}
        upcomingDeadlinesCount={upcomingDeadlines.length}
        studentProfile={studentProfile}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area (shifted right by sidebar width on desktop) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen w-full">
        {/* Top Header */}
        <Header
          studentProfile={studentProfile}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          savedCount={savedNotices.length}
          onOpenSaved={() => setIsSavedDrawerOpen(true)}
          onNavigateHome={() => {
            setDashboardView('dashboard');
            setCasperMood('greeting');
          }}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Casper The Ghost Guide Banner */}
        <div className="relative z-10 w-full px-4 sm:px-8 pt-4 pb-2">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <CasperMascot
              mood={casperMood}
              customMessage={casperMessage}
              size="sm"
              showSpeechBubble={true}
            />

            {/* Quick action to jump to scanner */}
            {dashboardView !== 'analyze' && (
              <button
                type="button"
                onClick={() => {
                  setDashboardView('analyze');
                  setCasperMood('scanning');
                }}
                className="text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 px-3.5 py-2 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <span>🎃</span>
                <span>Scan a Notice</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic View Container */}
        <main className="relative z-10 flex-1 w-full px-4 sm:px-8 py-5">
          <div className="max-w-6xl mx-auto">
            {/* 1. DASHBOARD OVERVIEW */}
            {dashboardView === 'dashboard' && (
              <div className="space-y-8 animate-fade-in">
                {/* Hero Greeting Card */}
                <div className="bg-gradient-to-r from-[#1b0f38] via-[#140b2e] to-[#120726] border border-purple-700/50 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2 flex-1">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                        <span>🦇</span>
                        <span>Haunted Campus Headquarters</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-white">
                        Welcome, {studentProfile.course?.split(' ')[0] || 'Student'} Scholar!
                      </h2>
                      <p className="text-xs sm:text-sm text-purple-300/90 max-w-xl leading-relaxed">
                        Don't let college scholarships, hackathons, or exams vanish into the shadows.
                        Upload your college posters or circulars for instant Gemma 4 analysis.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setDashboardView('analyze');
                        setCasperMood('scanning');
                      }}
                      className="px-6 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm cursor-pointer shadow-xl shadow-amber-500/25 flex items-center gap-2 shrink-0"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Analyze College Poster</span>
                    </button>
                  </div>
                </div>

                {/* Quick Notice Scanner embedded directly on Dashboard */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <span>🎃</span>
                      <span>Quick Notice Scanner</span>
                    </h3>
                    <span className="text-xs text-purple-400">Powered by Gemma 4</span>
                  </div>
                  <NoticeScanner
                    onAnalysisSuccess={handleAnalysisSuccess}
                    onCasperMoodChange={(mood, msg) => {
                      setCasperMood(mood);
                      setCasperMessage(msg);
                    }}
                  />
                </div>

                {/* Dashboard Widgets: Deadlines & Saved Action Plans */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Widget 1: Upcoming Deadlines */}
                  <div className="bg-[#140c2a] border border-purple-700/40 rounded-3xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-purple-800/40">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-base text-white">Upcoming Deadlines</h4>
                          <p className="text-xs text-purple-300">Saved college opportunity cutoffs</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDashboardView('deadlines')}
                        className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                      >
                        View All
                      </button>
                    </div>

                    {upcomingDeadlines.length === 0 ? (
                      <div className="py-8 text-center text-xs text-purple-400 space-y-2">
                        <Calendar className="w-8 h-8 mx-auto text-purple-600/60" />
                        <p>No saved deadlines yet.</p>
                        <p className="text-[11px] text-purple-500 max-w-xs mx-auto">
                          Scan or select a notice to track official closing dates.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {upcomingDeadlines.map((record) => (
                          <div
                            key={record.id}
                            onClick={() => handleSelectSavedNotice(record)}
                            className="p-3.5 rounded-xl bg-[#1b1038] border border-purple-800/50 hover:border-amber-400/60 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-white group-hover:text-amber-300 truncate">
                                {record.analysis.title}
                              </p>
                              <p className="text-[11px] text-amber-400/90 font-medium mt-0.5 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {record.analysis.deadline?.rawText}
                              </p>
                            </div>
                            <span className="text-xs text-purple-400 group-hover:text-amber-400">
                              →
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Widget 2: Saved Action Plans */}
                  <div className="bg-[#140c2a] border border-purple-700/40 rounded-3xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-purple-800/40">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                          <CheckSquare className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-base text-white">Saved Action Plans</h4>
                          <p className="text-xs text-purple-300">Checklist progress across notices</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDashboardView('opportunities')}
                        className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                      >
                        View All
                      </button>
                    </div>

                    {savedNotices.length === 0 ? (
                      <div className="py-8 text-center text-xs text-purple-400 space-y-2">
                        <Flame className="w-8 h-8 mx-auto text-purple-600/60" />
                        <p>No saved action plans yet.</p>
                        <p className="text-[11px] text-purple-500 max-w-xs mx-auto">
                          Analyzed notices create step-by-step checklists to break deadline curses.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {savedNotices.slice(0, 3).map((record) => {
                          const completed = Object.values(record.checklistState || {}).filter(
                            Boolean
                          ).length;
                          return (
                            <div
                              key={record.id}
                              onClick={() => handleSelectSavedNotice(record)}
                              className="p-3.5 rounded-xl bg-[#1b1038] border border-purple-800/50 hover:border-amber-400/60 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-white group-hover:text-amber-300 truncate">
                                  {record.analysis.title}
                                </p>
                                <span className="text-[10px] text-purple-300/80 font-mono">
                                  {completed} steps completed
                                </span>
                              </div>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-teal-300 border border-purple-800">
                                Checklist
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. ANALYZE POSTER VIEW */}
            {dashboardView === 'analyze' && (
              <div className="space-y-6 animate-fade-in">
                {/* If no notice active, show scanner */}
                {!currentNotice ? (
                  <NoticeScanner
                    onAnalysisSuccess={handleAnalysisSuccess}
                    onCasperMoodChange={(mood, msg) => {
                      setCasperMood(mood);
                      setCasperMessage(msg);
                    }}
                  />
                ) : (
                  /* When a notice is active, show the 5 tabbed features */
                  <div className="space-y-6">
                    {/* Feature Tabs Navigation */}
                    <div className="bg-[#150d2e]/90 border border-purple-700/50 rounded-2xl p-1.5 flex flex-wrap items-center justify-between gap-2 shadow-xl backdrop-blur-md">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveAnalysisTab('analysis');
                            setCasperMood('greeting');
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            activeAnalysisTab === 'analysis'
                              ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                              : 'text-purple-300 hover:text-white hover:bg-purple-900/50'
                          }`}
                        >
                          <span>📋</span>
                          <span>Notice Analysis</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveAnalysisTab('personalize');
                            setCasperMood('greeting');
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            activeAnalysisTab === 'personalize'
                              ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                              : 'text-purple-300 hover:text-white hover:bg-purple-900/50'
                          }`}
                        >
                          <span>🎯</span>
                          <span>Eligibility Check</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveAnalysisTab('translate');
                            setCasperMood('greeting');
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            activeAnalysisTab === 'translate'
                              ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                              : 'text-purple-300 hover:text-white hover:bg-purple-900/50'
                          }`}
                        >
                          <span>🌐</span>
                          <span>Magic Translator</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveAnalysisTab('deadline');
                            setCasperMood('deadline-alert');
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            activeAnalysisTab === 'deadline'
                              ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                              : 'text-purple-300 hover:text-white hover:bg-purple-900/50'
                          }`}
                        >
                          <span>⏰</span>
                          <span>Deadline Curse Breaker</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveAnalysisTab('source');
                            setCasperMood('unclear');
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            activeAnalysisTab === 'source'
                              ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                              : 'text-purple-300 hover:text-white hover:bg-purple-900/50'
                          }`}
                        >
                          <span>📜</span>
                          <span>Trust the Source</span>
                        </button>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 px-2">
                        <button
                          type="button"
                          onClick={() => setCurrentNotice(null)}
                          className="px-3 py-1.5 rounded-xl bg-purple-900/50 hover:bg-purple-800 text-purple-200 text-xs font-semibold cursor-pointer border border-purple-700/50"
                        >
                          Scan Another Notice
                        </button>
                      </div>
                    </div>

                    {/* Tab 1: Notice Analysis */}
                    {activeAnalysisTab === 'analysis' && (
                      <AnalysisResults
                        analysis={currentNotice.analysis}
                        previewDataUrl={currentNotice.previewDataUrl}
                        rawText={currentNotice.rawText}
                        sourceType={currentNotice.sourceType}
                        fileName={currentNotice.fileName}
                        onSaveNotice={handleSaveCurrentNotice}
                        isSaved={isCurrentSaved}
                      />
                    )}

                    {/* Tab 2: Personalized Student Assistant & Eligibility Check */}
                    {activeAnalysisTab === 'personalize' && (
                      <PersonalizedAssistant
                        noticeId={currentNotice.id}
                        analysis={currentNotice.analysis}
                        studentProfile={studentProfile}
                        onEditProfile={() => setIsProfileModalOpen(true)}
                        cachedResult={currentPersonalization}
                        onMatchUpdated={(res) => setCurrentPersonalization(res)}
                        opportunityAnswers={currentOpportunityAnswers}
                        onAnswersChanged={handleOpportunityAnswersChanged}
                      />
                    )}

                    {/* Tab 3: Magic Language Translator */}
                    {activeAnalysisTab === 'translate' && (
                      <LanguageTranslator
                        analysis={currentNotice.analysis}
                        cachedTranslations={currentTranslations}
                        onTranslationSuccess={(key, res) => {
                          setCurrentTranslations((prev) => ({ ...prev, [key]: res }));
                        }}
                      />
                    )}

                    {/* Tab 4: Deadline Curse Breaker */}
                    {activeAnalysisTab === 'deadline' && (
                      <DeadlineCurseBreaker
                        noticeId={currentNotice.id}
                        analysis={currentNotice.analysis}
                        initialChecklistState={currentChecklistState}
                        onStateChange={(checked) => {
                          setCurrentChecklistState(checked);
                        }}
                      />
                    )}

                    {/* Tab 5: Trust the Source */}
                    {activeAnalysisTab === 'source' && (
                      <SourceEvidenceSection analysis={currentNotice.analysis} />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 3. STUDENT PROFILE VIEW */}
            {dashboardView === 'profile' && (
              <StudentProfileView profile={studentProfile} onSave={handleSaveProfile} />
            )}

            {/* 4. MY OPPORTUNITIES VIEW */}
            {dashboardView === 'opportunities' && (
              <MyOpportunitiesView
                savedNotices={savedNotices}
                onSelectNotice={handleSelectSavedNotice}
                onDeleteNotice={handleDeleteSavedNotice}
                onClearAll={handleClearAllSaved}
                onNavigateToAnalyze={() => {
                  setDashboardView('analyze');
                  setCurrentNotice(null);
                }}
              />
            )}

            {/* 5. DEADLINE TRACKER VIEW */}
            {dashboardView === 'deadlines' && (
              <DeadlineTrackerView
                savedNotices={savedNotices}
                onSelectNotice={handleSelectSavedNotice}
                onNavigateToAnalyze={() => {
                  setDashboardView('analyze');
                  setCurrentNotice(null);
                }}
              />
            )}

            {/* 6. SETTINGS VIEW */}
            {dashboardView === 'settings' && (
              <SettingsView
                onClearAllData={handleClearAllSaved}
                savedNoticesCount={savedNotices.length}
              />
            )}
          </div>
        </main>

        {/* Dashboard Footer */}
        <footer className="relative z-10 border-t border-purple-900/40 bg-[#0a0518] py-6 text-center text-xs text-purple-400 mt-auto">
          <div className="max-w-6xl mx-auto px-4 space-y-1.5">
            <div className="flex items-center justify-center gap-2 font-bold text-purple-300">
              <span>🎃 CampusSignal AI — Haunted Campus Edition</span>
              <span>•</span>
              <span className="text-amber-400">Powered by Google Gemma 4 (gemma-4-26b-a4b-it)</span>
            </div>
            <p className="text-[11px] text-purple-500 max-w-xl mx-auto">
              Extract verified college circular details, match requirements against your degree, and
              conquer deadlines before they expire.
            </p>
          </div>
        </footer>
      </div>

      {/* Student Profile Modal */}
      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={studentProfile}
        onSave={handleSaveProfile}
      />

      {/* Saved Notices Drawer */}
      <SavedNoticesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedNotices={savedNotices}
        onSelectNotice={handleSelectSavedNotice}
        onDeleteNotice={handleDeleteSavedNotice}
        onClearAll={handleClearAllSaved}
      />
    </div>
  );
}
