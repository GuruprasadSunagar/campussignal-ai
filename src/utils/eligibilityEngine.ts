import {
  NoticeAnalysis,
  NumericCondition,
  RuleEvaluationResult,
  StructuredEligibilityRule,
  StudentProfile,
} from '../types';

/**
 * Parses and extracts structured rules from NoticeAnalysis.
 * Uses Gemma's structured rules if available, or derives them reliably from eligibility bullets.
 */
export function getStructuredRulesForNotice(analysis?: Partial<NoticeAnalysis> | null): StructuredEligibilityRule[] {
  if (!analysis) return [];
  if (
    analysis.structuredEligibilityRules &&
    Array.isArray(analysis.structuredEligibilityRules) &&
    analysis.structuredEligibilityRules.length > 0
  ) {
    return analysis.structuredEligibilityRules.map((rule, idx) => ({
      ...rule,
      id: rule.id || `rule_${idx + 1}`,
      options: rule.options || (rule.inputType === 'yes_no' ? ['Yes', 'No', 'Not Sure'] : undefined),
    }));
  }

  // Derive rules from notice eligibility bullets, text, and title
  const rules: StructuredEligibilityRule[] = [];
  const bullets = analysis.eligibility || [];
  let ruleIdx = 1;

  for (const bullet of bullets) {
    const text = bullet.trim();
    if (!text || text.toLowerCase().includes('not mentioned')) continue;

    const lower = text.toLowerCase();

    // 1. GDG / Club / Chapter Membership
    if (
      lower.includes('gdg') ||
      lower.includes('google developer group') ||
      lower.includes('club member') ||
      lower.includes('membership') ||
      lower.includes('registered member') ||
      lower.includes('chapter member')
    ) {
      const isGdg = lower.includes('gdg') || lower.includes('google developer group');
      rules.push({
        id: `rule_${ruleIdx++}`,
        requirementName: isGdg ? 'GDG Club Membership' : 'Club / Organization Membership',
        condition: text,
        type: 'mandatory',
        category: 'membership',
        inputType: 'yes_no',
        options: ['Yes', 'No', 'Not Sure'],
        question: isGdg
          ? 'Are you a member of the GDG group?'
          : 'Are you an active member of the required campus group?',
        sourceEvidence: text,
        helpText: 'The notice explicitly requires verified club membership to participate.',
      });
      continue;
    }

    // 2. Family Annual Income Limit
    if (
      lower.includes('income') ||
      lower.includes('annual family') ||
      lower.includes('lpa') ||
      lower.includes('p.a') ||
      lower.includes('per annum')
    ) {
      // Extract numeric threshold (e.g., 3,50,000 or 250000 or 2.5)
      let threshold = 350000;
      const match = text.match(/(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d+)?)/i);
      if (match) {
        const cleanNum = parseFloat(match[1].replace(/,/g, ''));
        if (!isNaN(cleanNum)) {
          threshold = cleanNum < 100 ? cleanNum * 100000 : cleanNum;
        }
      }

      rules.push({
        id: `rule_${ruleIdx++}`,
        requirementName: 'Annual Family Income Limit',
        condition: text,
        type: 'mandatory',
        category: 'income',
        inputType: 'number',
        question: 'What is your total annual family income (in ₹)?',
        numericCondition: {
          operator: '<=',
          threshold: threshold,
          unit: 'INR',
        },
        placeholder: `e.g. ${threshold - 50000}`,
        sourceEvidence: text,
        helpText: `Income must not exceed ₹${threshold.toLocaleString('en-IN')} as per stated rules.`,
      });
      continue;
    }

    // 3. Academic Score: CGPA or Percentage
    if (
      lower.includes('cgpa') ||
      lower.includes('percentage') ||
      lower.includes('marks') ||
      lower.includes('aggregate') ||
      lower.includes('%')
    ) {
      const isCgpa = lower.includes('cgpa');
      let threshold = isCgpa ? 8.5 : 70;
      let operator: '<=' | '>=' = '>=';

      const match = text.match(/(\d+(?:\.\d+)?)\s*(%|cgpa)?/i);
      if (match) {
        const parsed = parseFloat(match[1]);
        if (!isNaN(parsed)) {
          threshold = parsed;
        }
      }

      rules.push({
        id: `rule_${ruleIdx++}`,
        requirementName: isCgpa ? 'Minimum CGPA Requirement' : 'Minimum Academic Percentage',
        condition: text,
        type: 'mandatory',
        category: 'academic_score',
        inputType: 'number',
        question: isCgpa
          ? `What is your current CGPA (out of 10)? [Required: >= ${threshold}]`
          : `What is your academic percentage (%)? [Required: >= ${threshold}%]`,
        numericCondition: {
          operator: operator,
          threshold: threshold,
          unit: isCgpa ? 'CGPA' : '%',
        },
        mappedProfileField: isCgpa ? 'cgpa' : 'marks',
        placeholder: isCgpa ? 'e.g. 8.7' : 'e.g. 75.5',
        sourceEvidence: text,
        helpText: isCgpa
          ? `Requires CGPA >= ${threshold}. Notice uses exact CGPA, not percentage conversion.`
          : `Requires >= ${threshold}% aggregate score in previous examination.`,
      });
      continue;
    }

    // 4. Course / Degree / Branch
    if (
      lower.includes('bca') ||
      lower.includes('bsc') ||
      lower.includes('bcom') ||
      lower.includes('btech') ||
      lower.includes('degree') ||
      lower.includes('branch') ||
      lower.includes('course')
    ) {
      rules.push({
        id: `rule_${ruleIdx++}`,
        requirementName: 'Eligible Degree / Course',
        condition: text,
        type: 'mandatory',
        category: 'course_or_year',
        inputType: 'text',
        question: 'Confirm your current course of study:',
        mappedProfileField: 'course',
        sourceEvidence: text,
        helpText: text,
      });
      continue;
    }

    // 5. Academic Year / Semester
    if (
      lower.includes('year') ||
      lower.includes('semester') ||
      lower.includes('final year') ||
      lower.includes('passing out')
    ) {
      rules.push({
        id: `rule_${ruleIdx++}`,
        requirementName: 'Academic Year of Study',
        condition: text,
        type: 'mandatory',
        category: 'course_or_year',
        inputType: 'text',
        question: 'Confirm your current academic year:',
        mappedProfileField: 'academicYear',
        sourceEvidence: text,
        helpText: text,
      });
      continue;
    }

    // 6. Generic or Custom Requirement
    rules.push({
      id: `rule_${ruleIdx++}`,
      requirementName: text.length > 30 ? `${text.slice(0, 30)}...` : text,
      condition: text,
      type: lower.includes('prefer') || lower.includes('optional') ? 'preferred' : 'mandatory',
      category: 'custom',
      inputType: 'yes_no',
      options: ['Yes', 'No', 'Not Sure'],
      question: `Do you satisfy: "${text}"?`,
      sourceEvidence: text,
    });
  }

  // Fallback if no specific rules found
  if (rules.length === 0) {
    rules.push({
      id: 'rule_default_1',
      requirementName: 'General Enrollment Verification',
      condition: 'Must be a currently enrolled undergraduate/postgraduate student',
      type: 'mandatory',
      category: 'course_or_year',
      inputType: 'yes_no',
      options: ['Yes', 'No', 'Not Sure'],
      question: 'Are you currently enrolled as a student for this academic term?',
      sourceEvidence: 'Notice applies to campus students.',
    });
  }

  return rules;
}

/**
 * Deterministically evaluates a single rule against student profile and opportunity-specific answers.
 */
export function evaluateRule(
  rule: StructuredEligibilityRule,
  profile: StudentProfile,
  opportunityAnswers: Record<string, any>
): RuleEvaluationResult {
  // Check if student has entered an answer for this specific opportunity
  const answer = opportunityAnswers[rule.id];

  // If answer exists, evaluate it directly
  if (answer !== undefined && answer !== null && answer !== '') {
    // 1. Yes / No / Not Sure questions
    if (rule.inputType === 'yes_no') {
      const val = String(answer).trim().toLowerCase();
      if (val === 'yes') {
        return {
          ruleId: rule.id,
          status: 'met',
          currentValue: 'Yes',
          explanation: `Met: Confirmed "${rule.requirementName}" requirement.`,
        };
      }
      if (val === 'no') {
        return {
          ruleId: rule.id,
          status: 'not_met',
          currentValue: 'No',
          explanation: `Not Met: You selected 'No' for "${rule.requirementName}". Stated notice requires this condition.`,
        };
      }
      return {
        ruleId: rule.id,
        status: 'unknown',
        currentValue: 'Not Sure',
        explanation: `Unknown: Confirmation needed for "${rule.requirementName}".`,
      };
    }

    // 2. Numeric comparison (Income, CGPA, Percentage, Age)
    if (rule.inputType === 'number' && rule.numericCondition) {
      const numVal = parseFloat(String(answer));
      if (isNaN(numVal)) {
        return {
          ruleId: rule.id,
          status: 'unknown',
          currentValue: answer,
          explanation: `Unknown: Please enter a valid number for ${rule.requirementName}.`,
        };
      }

      const { operator, threshold, unit } = rule.numericCondition;
      let effectiveThreshold = threshold;
      let effectiveUnit = unit || '';

      // Direct comparison check for academic score if both CGPA and % exist in condition
      if (rule.category === 'academic_score') {
        const condLower = rule.condition.toLowerCase();
        if (numVal <= 10) {
          // Entered CGPA
          const cgpaMatch =
            condLower.match(/(\d+(?:\.\d+)?)\s*cgpa/i) ||
            condLower.match(/cgpa\s*(?:of\s*)?(\d+(?:\.\d+)?)/i);
          if (cgpaMatch) {
            effectiveThreshold = parseFloat(cgpaMatch[1]);
            effectiveUnit = 'CGPA';
          }
        } else {
          // Entered Percentage
          const pctMatch =
            condLower.match(/(\d+(?:\.\d+)?)\s*%/i) ||
            condLower.match(/(\d+(?:\.\d+)?)\s*percent/i);
          if (pctMatch) {
            effectiveThreshold = parseFloat(pctMatch[1]);
            effectiveUnit = '%';
          }
        }
      }

      let isMet = false;
      let reason = '';

      if (operator === '<=') {
        isMet = numVal <= effectiveThreshold;
        reason = isMet
          ? `Met: Your value (${numVal} ${effectiveUnit}) is within the allowed limit (<= ${effectiveThreshold} ${effectiveUnit}).`
          : `Not Met: Your value (${numVal} ${effectiveUnit}) exceeds the maximum allowed ceiling (<= ${effectiveThreshold} ${effectiveUnit}).`;
      } else if (operator === '>=') {
        isMet = numVal >= effectiveThreshold;
        reason = isMet
          ? `Met: Your value (${numVal} ${effectiveUnit}) meets or exceeds the minimum required (>= ${effectiveThreshold} ${effectiveUnit}).`
          : `Not Met: Your value (${numVal} ${effectiveUnit}) is below the required minimum (>= ${effectiveThreshold} ${effectiveUnit}).`;
      } else if (operator === '<') {
        isMet = numVal < effectiveThreshold;
        reason = isMet
          ? `Met: Your value (${numVal}) is strictly below ${effectiveThreshold}.`
          : `Not Met: Your value (${numVal}) is not below ${effectiveThreshold}.`;
      } else if (operator === '>') {
        isMet = numVal > effectiveThreshold;
        reason = isMet
          ? `Met: Your value (${numVal}) is strictly above ${effectiveThreshold}.`
          : `Not Met: Your value (${numVal}) is not above ${effectiveThreshold}.`;
      } else {
        isMet = numVal === effectiveThreshold;
        reason = isMet
          ? `Met: Exactly matches ${effectiveThreshold}.`
          : `Not Met: Does not match ${effectiveThreshold}.`;
      }

      return {
        ruleId: rule.id,
        status: isMet ? 'met' : 'not_met',
        currentValue: numVal,
        explanation: reason,
      };
    }

    // 3. Text / Selection comparison
    if (rule.inputType === 'text' || rule.inputType === 'select') {
      const strVal = String(answer).trim();
      return {
        ruleId: rule.id,
        status: strVal.length > 0 ? 'met' : 'unknown',
        currentValue: strVal,
        explanation: `Answer recorded: "${strVal}".`,
      };
    }
  }

  // If no opportunity-specific answer, check if reusable profile field matches!
  if (rule.mappedProfileField) {
    if (rule.mappedProfileField === 'marks' && profile.marks !== undefined) {
      if (rule.numericCondition) {
        const { operator, threshold, unit } = rule.numericCondition;
        const val = profile.marks;
        const isMet = operator === '>=' ? val >= threshold : val <= threshold;
        return {
          ruleId: rule.id,
          status: isMet ? 'met' : 'not_met',
          currentValue: `${val}% (From Profile)`,
          explanation: isMet
            ? `Met: Your saved profile score (${val}%) satisfies the requirement (${operator} ${threshold}%).`
            : `Not Met: Your saved profile score (${val}%) does not meet the requirement (${operator} ${threshold}%).`,
        };
      }
    }

    if (rule.mappedProfileField === 'cgpa' && profile.cgpa !== undefined) {
      if (rule.numericCondition) {
        const { operator, threshold } = rule.numericCondition;
        const val = profile.cgpa;
        const isMet = operator === '>=' ? val >= threshold : val <= threshold;
        return {
          ruleId: rule.id,
          status: isMet ? 'met' : 'not_met',
          currentValue: `${val} CGPA (From Profile)`,
          explanation: isMet
            ? `Met: Your saved profile CGPA (${val}) satisfies the requirement (${operator} ${threshold}).`
            : `Not Met: Your saved profile CGPA (${val}) is below the required CGPA (${operator} ${threshold}).`,
        };
      }
    }

    if (rule.mappedProfileField === 'course' && profile.course) {
      const condLower = rule.condition.toLowerCase();
      const courseLower = profile.course.toLowerCase();
      // Check if student's course keyword appears in condition or if condition is open to all
      const courseKey = courseLower.split(' ')[0]; // e.g. "bca", "bsc", "btech", "bcom"
      const isEligible =
        condLower.includes(courseKey) ||
        condLower.includes('all degree') ||
        condLower.includes('all undergraduate') ||
        condLower.includes('all students') ||
        !condLower.includes('only');

      return {
        ruleId: rule.id,
        status: isEligible ? 'met' : 'not_met',
        currentValue: `${profile.course} (From Profile)`,
        explanation: isEligible
          ? `Met: Your course (${profile.course}) is eligible as per notice criteria.`
          : `Not Met: Your course (${profile.course}) does not match the stated eligible courses (${rule.condition}).`,
      };
    }

    if (rule.mappedProfileField === 'academicYear' && profile.academicYear) {
      const condLower = rule.condition.toLowerCase();
      const yrLower = profile.academicYear.toLowerCase();
      const isEligible =
        condLower.includes(yrLower) ||
        condLower.includes('all year') ||
        condLower.includes('1st - final') ||
        condLower.includes('1st to 4th');

      return {
        ruleId: rule.id,
        status: isEligible ? 'met' : 'not_met',
        currentValue: `${profile.academicYear} (From Profile)`,
        explanation: isEligible
          ? `Met: Your academic year (${profile.academicYear}) matches the notice requirements.`
          : `Not Met: Your academic year (${profile.academicYear}) does not match the stated target batch (${rule.condition}).`,
      };
    }
  }

  // Notice is ambiguous / needs clarification
  if (rule.status === 'needs_verification') {
    return {
      ruleId: rule.id,
      status: 'needs_clarification',
      currentValue: 'Unclear in Notice',
      explanation: 'Needs clarification: Notice does not provide exact threshold or criteria.',
    };
  }

  // Not answered yet
  return {
    ruleId: rule.id,
    status: 'unknown',
    currentValue: undefined,
    explanation: 'Unknown: Please answer this question to confirm eligibility.',
  };
}

/**
 * Computes overall eligibility status across all rules.
 */
export function calculateOverallEligibility(
  rules: StructuredEligibilityRule[],
  evaluations: Record<string, RuleEvaluationResult>
): {
  status: 'eligible_met' | 'not_met' | 'not_confirmed';
  headline: string;
  summary: string;
  mandatoryCount: number;
  metCount: number;
  notMetCount: number;
  unknownCount: number;
  failedRules: StructuredEligibilityRule[];
  unansweredRules: StructuredEligibilityRule[];
} {
  const mandatoryRules = rules.filter((r) => r.type === 'mandatory');
  const failedRules: StructuredEligibilityRule[] = [];
  const unansweredRules: StructuredEligibilityRule[] = [];

  let metCount = 0;
  let notMetCount = 0;
  let unknownCount = 0;

  for (const rule of mandatoryRules) {
    const res = evaluations[rule.id];
    if (!res || res.status === 'unknown') {
      unknownCount++;
      unansweredRules.push(rule);
    } else if (res.status === 'not_met') {
      notMetCount++;
      failedRules.push(rule);
    } else if (res.status === 'needs_clarification') {
      unknownCount++;
      unansweredRules.push(rule);
    } else if (res.status === 'met') {
      metCount++;
    }
  }

  // 1. If ANY mandatory condition is not satisfied -> Not Met!
  if (notMetCount > 0) {
    const failedNames = failedRules.map((r) => r.requirementName).join(', ');
    return {
      status: 'not_met',
      headline: '⚠️ ONE OR MORE REQUIREMENTS NOT MET',
      summary: `You do not satisfy ${notMetCount} mandatory requirement(s): ${failedNames}. Check the exact notice conditions below.`,
      mandatoryCount: mandatoryRules.length,
      metCount,
      notMetCount,
      unknownCount,
      failedRules,
      unansweredRules,
    };
  }

  // 2. If questions remain unanswered or unverified -> Not Confirmed Yet!
  if (unknownCount > 0) {
    return {
      status: 'not_confirmed',
      headline: '👻 ELIGIBILITY NOT CONFIRMED YET',
      summary: `Please answer the ${unknownCount} remaining question(s) below to determine whether you meet all stated conditions.`,
      mandatoryCount: mandatoryRules.length,
      metCount,
      notMetCount,
      unknownCount,
      failedRules,
      unansweredRules,
    };
  }

  // 3. All mandatory conditions satisfied -> Eligible!
  return {
    status: 'eligible_met',
    headline: '🎉 ELIGIBILITY REQUIREMENTS MET',
    summary:
      'All mandatory conditions extracted from the notice are verified and satisfied by your profile and answers. Note: Meeting eligibility qualifies you to apply, but final selection/grants remain subject to the institution\'s review.',
    mandatoryCount: mandatoryRules.length,
    metCount,
    notMetCount,
    unknownCount,
    failedRules,
    unansweredRules,
  };
}
