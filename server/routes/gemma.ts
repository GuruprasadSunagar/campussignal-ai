import { Router, Request, Response } from 'express';
import { ai, GEMMA_MODEL } from '../config.js';
import {
  NOTICE_ANALYSIS_SYSTEM_PROMPT,
  PERSONALIZATION_SYSTEM_PROMPT,
  TRANSLATION_SYSTEM_PROMPT,
} from '../prompts.js';

export const gemmaRouter = Router();

// Helper to extract clean JSON from model output
function extractJson<T = any>(rawText: string | undefined): T {
  if (!rawText) {
    throw new Error('Gemma 4 returned an empty response.');
  }

  // Strip code fences if present
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
  }

  // Try parsing
  try {
    return JSON.parse(cleaned);
  } catch (err: any) {
    // If there is text before or after JSON object
    const startIdx = cleaned.indexOf('{');
    const endIdx = cleaned.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const candidate = cleaned.slice(startIdx, endIdx + 1);
      return JSON.parse(candidate);
    }
    throw new Error(`Failed to parse Gemma 4 response as JSON: ${err.message}. Output was: ${cleaned.slice(0, 300)}`);
  }
}

/**
 * 1. REAL GEMMA 4 CONNECTION TEST
 * Sends an actual request to gemma-4-26b-a4b-it and reports latency and response
 */
gemmaRouter.get('/connection-test', async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const response = await ai.models.generateContent({
      model: GEMMA_MODEL,
      contents: 'Ping test from CampusSignal AI. Please verify you are active and respond with a short 1-sentence Halloween greeting for college students.',
      config: {
        temperature: 0.3,
      },
    });

    const latencyMs = Date.now() - startTime;
    const responseText = response.text || 'Gemma 4 model responded successfully.';

    return res.json({
      success: true,
      model: GEMMA_MODEL,
      latencyMs,
      timestamp: new Date().toISOString(),
      response: responseText,
      verified: true,
    });
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    console.error('Gemma 4 connection test error:', error);
    return res.status(500).json({
      success: false,
      model: GEMMA_MODEL,
      latencyMs,
      timestamp: new Date().toISOString(),
      error: error?.message || 'Failed to connect to Gemma 4 model.',
      verified: false,
    });
  }
});

/**
 * 2. REAL POSTER ANALYSIS (GHOST NOTICE SCANNER)
 * Accepts either:
 * - image: { data: string (base64), mimeType: string }
 * - text: string
 */
gemmaRouter.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { image, text, fileName } = req.body;

    if (!image && (!text || text.trim().length === 0)) {
      return res.status(400).json({
        error: 'Please provide either an image of a college notice or paste notice text.',
      });
    }

    const contents: any[] = [];

    if (image && image.data) {
      // Validate supported image MIME types
      const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const mime = (image.mimeType || 'image/jpeg').toLowerCase();
      if (!allowedMimes.includes(mime)) {
        return res.status(400).json({
          error: `Unsupported image format (${mime}). Please upload JPG, JPEG, or PNG images.`,
        });
      }

      // Clean base64 data if it contains a data URI prefix
      let cleanBase64 = image.data;
      if (cleanBase64.includes('base64,')) {
        cleanBase64 = cleanBase64.split('base64,')[1];
      }

      // Limit payload size check (~12MB base64)
      if (cleanBase64.length > 16 * 1024 * 1024) {
        return res.status(400).json({
          error: 'Image file is too large. Please upload an image under 8MB.',
        });
      }

      contents.push({
        inlineData: {
          mimeType: mime === 'image/jpg' ? 'image/jpeg' : mime,
          data: cleanBase64,
        },
      });

      contents.push({
        text: `${NOTICE_ANALYSIS_SYSTEM_PROMPT}\n\nExamine the attached college poster/notice image carefully. Read all text, headings, footnotes, fine print, dates, eligibility criteria, and contact details. Strictly adhere to the instructions and produce the required JSON.`,
      });
    } else {
      // Pasted text
      contents.push({
        text: `${NOTICE_ANALYSIS_SYSTEM_PROMPT}\n\nAnalyze the following college notice text carefully:\n"""\n${text}\n"""\nStrictly adhere to the instructions and produce the required JSON.`,
      });
    }

    console.log(`[Gemma 4] Analyzing notice with model ${GEMMA_MODEL}...`);
    const startTime = Date.now();

    const response = await ai.models.generateContent({
      model: GEMMA_MODEL,
      contents: { parts: contents },
      config: {
        temperature: 0.2, // Low temperature for high factual accuracy
        responseMimeType: 'application/json',
      },
    });

    const elapsedMs = Date.now() - startTime;
    console.log(`[Gemma 4] Analysis completed in ${elapsedMs}ms`);

    const parsedData = extractJson(response.text);

    return res.json({
      success: true,
      modelUsed: GEMMA_MODEL,
      analysisTimeMs: elapsedMs,
      data: parsedData,
      sourceType: image ? 'image' : 'text',
      fileName: fileName || (image ? 'college_notice_poster.jpg' : 'pasted_notice.txt'),
    });
  } catch (error: any) {
    console.error('Error analyzing notice with Gemma 4:', error);
    return res.status(500).json({
      success: false,
      modelUsed: GEMMA_MODEL,
      error: error?.message || 'Failed to analyze notice with Gemma 4.',
      details: 'Please verify the image is clear or check the server Gemma 4 connection.',
    });
  }
});

/**
 * 3. PERSONALIZED STUDENT MATCH (FEATURE TWO)
 * Compares notice analysis against student profile
 */
gemmaRouter.post('/personalize', async (req: Request, res: Response) => {
  try {
    const { noticeAnalysis, studentProfile } = req.body;

    if (!noticeAnalysis || !studentProfile) {
      return res.status(400).json({
        error: 'Missing notice analysis or student profile data.',
      });
    }

    const promptText = `${PERSONALIZATION_SYSTEM_PROMPT}

NOTICE DETAILS:
Title: ${noticeAnalysis.title || 'Untitled'}
Category: ${noticeAnalysis.category || 'General'}
Main Purpose: ${noticeAnalysis.mainPurpose || 'None'}
Eligibility Requirements: ${JSON.stringify(noticeAnalysis.eligibility || [])}
Required Documents: ${JSON.stringify(noticeAnalysis.requiredDocuments || [])}
Deadline: ${JSON.stringify(noticeAnalysis.deadline || {})}
Benefits: ${JSON.stringify(noticeAnalysis.benefits || [])}

STUDENT PROFILE:
Course: ${studentProfile.course || 'Not specified'}
Current Academic Year: ${studentProfile.academicYear || 'Not specified'}
Interests: ${(studentProfile.interests || []).join(', ') || 'Not specified'}
Skills: ${(studentProfile.skills || []).join(', ') || 'Not specified'}
Marks / Percentage: ${studentProfile.marks ? `${studentProfile.marks}%` : 'Not provided by student'}

Evaluate this opportunity strictly and return the JSON schema specified in the system instructions.`;

    const response = await ai.models.generateContent({
      model: GEMMA_MODEL,
      contents: promptText,
      config: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    });

    const matchResult = extractJson(response.text);

    return res.json({
      success: true,
      modelUsed: GEMMA_MODEL,
      data: matchResult,
    });
  } catch (error: any) {
    console.error('Error personalizing notice with Gemma 4:', error);
    return res.status(500).json({
      success: false,
      modelUsed: GEMMA_MODEL,
      error: error?.message || 'Failed to personalize opportunity with Gemma 4.',
    });
  }
});

/**
 * 4. MAGIC LANGUAGE TRANSLATOR (FEATURE THREE)
 * English, Hindi (हिंदी), Kannada (ಕನ್ನಡ)
 */
gemmaRouter.post('/translate', async (req: Request, res: Response) => {
  try {
    const { noticeAnalysis, targetLanguage, mode } = req.body;

    if (!noticeAnalysis || !targetLanguage) {
      return res.status(400).json({
        error: 'Missing notice analysis or target language parameter.',
      });
    }

    const validLanguages = ['English', 'Hindi', 'Kannada'];
    if (!validLanguages.includes(targetLanguage)) {
      return res.status(400).json({
        error: `Unsupported target language: ${targetLanguage}. Choose English, Hindi, or Kannada.`,
      });
    }

    const selectedMode = mode || 'simple'; // 'simple' | 'translate' | 'key_points'

    const promptText = `${TRANSLATION_SYSTEM_PROMPT}

TARGET LANGUAGE: ${targetLanguage}
TRANSLATION MODE: ${selectedMode} (simple = simple words explanation, translate = full translated notice, key_points = explain key points)

ORIGINAL NOTICE INFORMATION:
Title: ${noticeAnalysis.title}
Category: ${noticeAnalysis.category}
Organization: ${noticeAnalysis.organization}
Main Purpose: ${noticeAnalysis.mainPurpose}
Key Points: ${JSON.stringify(noticeAnalysis.keyPoints || [])}
Deadline: ${JSON.stringify(noticeAnalysis.deadline || {})}
Eligibility: ${JSON.stringify(noticeAnalysis.eligibility || [])}
Fees: ${noticeAnalysis.fees}
Application Steps: ${JSON.stringify(noticeAnalysis.applicationSteps || [])}
Contact & Links: ${JSON.stringify(noticeAnalysis.contactAndLinks || {})}
Missing or Unclear Info: ${JSON.stringify(noticeAnalysis.missingOrUnclearInfo || {})}

Return valid JSON in the requested format in ${targetLanguage}. Keep dates, links, amounts, and names exact.`;

    const response = await ai.models.generateContent({
      model: GEMMA_MODEL,
      contents: promptText,
      config: {
        temperature: 0.25,
        responseMimeType: 'application/json',
      },
    });

    const translationData = extractJson(response.text);

    return res.json({
      success: true,
      modelUsed: GEMMA_MODEL,
      data: translationData,
    });
  } catch (error: any) {
    console.error('Error translating with Gemma 4:', error);
    return res.status(500).json({
      success: false,
      modelUsed: GEMMA_MODEL,
      error: error?.message || 'Failed to translate notice with Gemma 4.',
    });
  }
});
