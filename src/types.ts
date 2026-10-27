/**
 * Types for CampusSignal AI — Haunted Campus Edition
 */

export type NoticeCategory =
  | 'scholarship'
  | 'internship'
  | 'examination'
  | 'placement'
  | 'event'
  | 'competition'
  | 'workshop'
  | 'other';

export interface NoticeDeadline {
  rawText: string;
  isoDate?: string;
  isExplicit: boolean;
  urgencyHint?: 'urgent' | 'upcoming' | 'none';
}

export interface ContactAndLinks {
  contacts: string[];
  links: string[];
}

export interface MissingOrUnclearInfo {
  missing: string[];
  needsVerification: string[];
  conflicts: string[];
}

export interface SourceEvidenceItem {
  field: string;
  extractedValue: string;
  sourceQuote: string;
  status: 'clear' | 'missing' | 'needs_verification';
}

export interface ActionChecklistItem {
  id: string;
  text: string;
  category: string;
  deadline?: string;
  completed?: boolean;
}

export interface NumericCondition {
  operator: '<=' | '>=' | '<' | '>' | '==';
  threshold: number;
  unit?: string; // e.g. "INR", "%", "CGPA", "years"
}

export interface StructuredEligibilityRule {
  id: string;
  requirementName: string;
  condition: string;
  type: 'mandatory' | 'preferred';
  category:
    | 'membership'
    | 'academic_score'
    | 'income'
    | 'course_or_year'
    | 'skills'
    | 'reservation_or_caste'
    | 'custom';
  inputType: 'yes_no' | 'number' | 'select' | 'text';
  options?: string[]; // e.g. ["Yes", "No", "Not Sure"]
  question: string;
  numericCondition?: NumericCondition;
  mappedProfileField?:
    | 'course'
    | 'academicYear'
    | 'marks'
    | 'cgpa'
    | 'familyIncome'
    | 'skills'
    | null;
  sourceEvidence?: string;
  placeholder?: string;
  helpText?: string;
  status?: 'clear' | 'needs_verification';
}

export type RuleStatus = 'met' | 'not_met' | 'unknown' | 'needs_clarification';

export interface RuleEvaluationResult {
  ruleId: string;
  status: RuleStatus;
  currentValue?: string | number | null;
  explanation: string;
}

export interface OverallEligibilitySummary {
  status: 'eligible_met' | 'not_met' | 'not_confirmed';
  headline: string;
  summary: string;
  mandatoryCount: number;
  metCount: number;
  notMetCount: number;
  unknownCount: number;
  failedRules: StructuredEligibilityRule[];
  unansweredRules: StructuredEligibilityRule[];
}

export interface NoticeAnalysis {
  title: string;
  category: NoticeCategory;
  organization: string;
  mainPurpose: string;
  keyPoints: string[];
  deadline: NoticeDeadline;
  eligibility: string[];
  structuredEligibilityRules?: StructuredEligibilityRule[];
  requiredDocuments: string[];
  fees: string;
  benefits: string[];
  applicationSteps: string[];
  contactAndLinks: ContactAndLinks;
  missingOrUnclearInfo: MissingOrUnclearInfo;
  sourceEvidence: SourceEvidenceItem[];
  initialActionChecklist: ActionChecklistItem[];
}

export interface StudentProfile {
  course: string;
  academicYear: string;
  interests: string[];
  skills: string[];
  marks?: number;
  cgpa?: number;
  familyIncome?: number;
  category?: string;
}

export type MatchStatus =
  | 'Potential match'
  | 'More information needed'
  | 'Verify the requirements'
  | 'Does not appear to match';

export interface PersonalizationResult {
  status: MatchStatus;
  relevanceExplanation: string;
  matchedRequirements: string[];
  unmetRequirements: string[];
  missingInformation: string[];
  nextSteps: string[];
  reasons: string;
}

export type SupportedLanguage = 'English' | 'Hindi' | 'Kannada';
export type TranslationMode = 'simple' | 'translate' | 'key_points';

export interface TranslationResult {
  targetLanguage: SupportedLanguage;
  mode: TranslationMode;
  translatedTitle: string;
  headline: string;
  simpleExplanation: string;
  keyPoints: string[];
  deadlineAlert: string;
  actionSteps: string[];
  preservedCriticalData: {
    deadline: string;
    fees: string;
    links: string[];
    contacts: string[];
  };
}

export interface SavedNoticeRecord {
  id: string;
  savedAt: string;
  sourceType: 'image' | 'text';
  fileName: string;
  previewDataUrl?: string;
  rawText?: string;
  analysis: NoticeAnalysis;
  personalization?: PersonalizationResult;
  opportunityAnswers?: Record<string, any>;
  translations?: Record<string, TranslationResult>;
  checklistState: Record<string, boolean>;
  customChecklistItems: ActionChecklistItem[];
}

export interface ConnectionTestResult {
  success: boolean;
  model: string;
  latencyMs: number;
  timestamp: string;
  response?: string;
  error?: string;
  verified: boolean;
}
