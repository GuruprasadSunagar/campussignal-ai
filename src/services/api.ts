import {
  ConnectionTestResult,
  NoticeAnalysis,
  PersonalizationResult,
  StudentProfile,
  SupportedLanguage,
  TranslationMode,
  TranslationResult,
} from '../types';

export async function testGemmaConnection(): Promise<ConnectionTestResult> {
  const response = await fetch('/api/gemma/connection-test', {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });

  const data = await response.json();
  if (!response.ok && !data.error) {
    throw new Error(`Connection test failed with HTTP status ${response.status}`);
  }
  return data;
}

export async function analyzeNotice(payload: {
  image?: { data: string; mimeType: string };
  text?: string;
  fileName?: string;
}): Promise<{
  data: NoticeAnalysis;
  modelUsed: string;
  analysisTimeMs: number;
  sourceType: 'image' | 'text';
  fileName: string;
}> {
  const response = await fetch('/api/notices/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.error || result.details || 'Notice analysis failed.');
  }

  return result;
}

export async function personalizeNotice(payload: {
  noticeAnalysis: NoticeAnalysis;
  studentProfile: StudentProfile;
}): Promise<{ data: PersonalizationResult; modelUsed: string }> {
  const response = await fetch('/api/notices/personalize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Personalization matching failed.');
  }

  return result;
}

export async function translateNotice(payload: {
  noticeAnalysis: NoticeAnalysis;
  targetLanguage: SupportedLanguage;
  mode: TranslationMode;
}): Promise<{ data: TranslationResult; modelUsed: string }> {
  const response = await fetch('/api/notices/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Translation request failed.');
  }

  return result;
}
