import { StructuredEligibilityRule } from '../types';

export interface SampleNotice {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  posterSvgBase64?: string;
  text: string;
  structuredEligibilityRules?: StructuredEligibilityRule[];
}

// Generate nice Halloween-styled SVG poster data URIs for sample notices
function createPosterSvg(title: string, org: string, date: string, prizeOrGrant: string, badge: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="850" viewBox="0 0 600 850">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#140b2e"/>
        <stop offset="50%" stop-color="#22134a"/>
        <stop offset="100%" stop-color="#0a0518"/>
      </linearGradient>
      <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#f97316"/>
        <stop offset="100%" stop-color="#fbbf24"/>
      </linearGradient>
      <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#06b6d4"/>
        <stop offset="100%" stop-color="#a855f7"/>
      </linearGradient>
    </defs>
    <!-- Background -->
    <rect width="600" height="850" fill="url(#bg)"/>
    <rect x="20" y="20" width="560" height="810" rx="20" fill="none" stroke="#6b21a8" stroke-width="3" stroke-dasharray="10 6"/>
    <circle cx="530" cy="80" r="45" fill="#fef08a" opacity="0.85"/>
    <circle cx="545" cy="70" r="40" fill="#140b2e"/>
    
    <!-- Bats & Stars -->
    <path d="M 120 70 Q 130 55 140 70 Q 150 55 160 70 Q 140 85 120 70 Z" fill="#9333ea" opacity="0.7"/>
    <path d="M 450 140 Q 458 128 466 140 Q 474 128 482 140 Q 466 152 450 140 Z" fill="#9333ea" opacity="0.6"/>

    <!-- Institution / Badge -->
    <rect x="60" y="55" width="220" height="36" rx="18" fill="url(#glow)" opacity="0.9"/>
    <text x="170" y="78" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="bold" font-size="13" fill="#ffffff" text-anchor="middle" letter-spacing="1">${badge}</text>

    <!-- Org Name -->
    <text x="300" y="145" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="600" font-size="16" fill="#a78bfa" text-anchor="middle" letter-spacing="1">${org.toUpperCase()}</text>
    
    <!-- Main Title -->
    <text x="300" y="210" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="34" fill="#ffffff" text-anchor="middle">${title.slice(0, 24)}</text>
    <text x="300" y="255" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="28" fill="url(#accent)" text-anchor="middle">${title.slice(24) || 'CAMPUS EDITION'}</text>
    
    <!-- Divider -->
    <line x1="100" y1="285" x2="500" y2="285" stroke="#f97316" stroke-width="2"/>
    
    <!-- Big Prize/Grant Highlight -->
    <rect x="80" y="315" width="440" height="90" rx="16" fill="#3b0764" stroke="#d97706" stroke-width="2"/>
    <text x="300" y="350" font-family="'Helvetica Neue', Arial, sans-serif" font-size="14" fill="#fde047" text-anchor="middle" font-weight="bold">BENEFIT / GRANT / PRIZE POOL</text>
    <text x="300" y="388" font-family="'Helvetica Neue', Arial, sans-serif" font-size="28" fill="#ffffff" text-anchor="middle" font-weight="bold">${prizeOrGrant}</text>

    <!-- Key Details Box -->
    <rect x="80" y="430" width="440" height="230" rx="16" fill="#1e103f" stroke="#7e22ce" stroke-width="1.5"/>
    <text x="110" y="470" font-family="'Helvetica Neue', Arial, sans-serif" font-size="16" fill="#f97316" font-weight="bold">⏰ DEADLINE: ${date}</text>
    <text x="110" y="505" font-family="'Helvetica Neue', Arial, sans-serif" font-size="14" fill="#e9d5ff">🎓 Eligibility: All BCA, BSc, BTech (1st - Final Year)</text>
    <text x="110" y="535" font-family="'Helvetica Neue', Arial, sans-serif" font-size="14" fill="#e9d5ff">📄 Documents: College ID Card &amp; Latest Marksheet</text>
    <text x="110" y="565" font-family="'Helvetica Neue', Arial, sans-serif" font-size="14" fill="#e9d5ff">💵 Registration Fee: FREE (Zero cost for registered students)</text>
    <text x="110" y="595" font-family="'Helvetica Neue', Arial, sans-serif" font-size="14" fill="#e9d5ff">🌐 Online Portal: https://portal.campus.edu/apply-2026</text>
    <text x="110" y="625" font-family="'Helvetica Neue', Arial, sans-serif" font-size="13" fill="#a78bfa">⚠️ Late entries after 11:59 PM deadline will not be entertained.</text>

    <!-- Footer contacts -->
    <rect x="80" y="685" width="440" height="90" rx="14" fill="#13092b"/>
    <text x="300" y="718" font-family="'Helvetica Neue', Arial, sans-serif" font-size="13" fill="#cbd5e1" text-anchor="middle">Organized by Dean of Student Affairs &amp; Placement Cell</text>
    <text x="300" y="742" font-family="'Helvetica Neue', Arial, sans-serif" font-size="13" fill="#facc15" text-anchor="middle">Helpdesk: support@campus.edu | Room 302, Science Block</text>
  </svg>`;
  // Browser and Node compatible base64 encode for SVG data URI
  try {
    if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
      return 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svg)));
    }
    if (typeof Buffer !== 'undefined') {
      return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    }
  } catch (e) {
    // fallback
  }
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

export const SAMPLE_NOTICES: SampleNotice[] = [
  {
    id: 'sample-gdg',
    title: 'GDG Campus DevFest & Hackathon 2026',
    category: 'competition',
    shortDesc: 'Official Google Developer Groups hackathon requiring verified GDG campus club membership.',
    posterSvgBase64: createPosterSvg('GDG Campus DevFest 2026', 'Google Developer Groups (GDG) Campus Chapter', 'November 8, 2026 at 11:59 PM', '₹75,000 CASH PRIZE + GOOGLE GOODIES', '🎃 GDG HACKATHON'),
    structuredEligibilityRules: [
      {
        id: 'rule_gdg_1',
        requirementName: 'GDG Club Membership',
        condition: 'Must be an active, registered member of the GDG (Google Developer Groups) campus chapter.',
        type: 'mandatory',
        category: 'membership',
        inputType: 'yes_no',
        options: ['Yes', 'No', 'Not Sure'],
        question: 'Are you a member of the GDG group?',
        sourceEvidence: 'Registration is strictly open only to verified members of the GDG campus student club.',
        helpText: 'Select Yes if registered on GDG community platform, No if not a member.',
      },
      {
        id: 'rule_gdg_2',
        requirementName: 'Eligible Degree / Course',
        condition: 'Must be enrolled in BCA, BSc Computer Science / IT, or BTech courses.',
        type: 'mandatory',
        category: 'course_or_year',
        inputType: 'text',
        question: 'Confirm your current course of study:',
        mappedProfileField: 'course',
        sourceEvidence: 'Eligible Courses: BCA, BSc (CS/IT), and BTech.',
      },
      {
        id: 'rule_gdg_3',
        requirementName: 'Team Prerequisite Knowledge (Preferred)',
        condition: 'Basic proficiency in Web Development, Python, or Mobile Development is preferred.',
        type: 'preferred',
        category: 'skills',
        inputType: 'yes_no',
        options: ['Yes', 'No', 'Not Sure'],
        question: 'Do you have basic proficiency in Python, Web, or Mobile Development?',
        sourceEvidence: 'Preferred skills: Web, Python or Mobile development.',
      },
    ],
    text: `GOOGLE DEVELOPER GROUPS (GDG) CAMPUS CHAPTER
NOTICE REF: GDG/CAMPUS/HACK/2026/09
DATE: OCTOBER 25, 2026

SUBJECT: REGISTRATION FOR GDG CAMPUS DEVFEST & HAUNTED HACKATHON 2026

The GDG Campus Chapter invites students to participate in the flagship DevFest Hackathon 2026.

STRICT PARTICIPATION RULES:
1. GDG Membership: All participants must be active, registered members of the campus GDG (Google Developer Groups) group. Non-members cannot be shortlisted.
2. Eligible Degrees: Open to undergraduate students pursuing BCA, BSc (Computer Science / IT), and BTech.
3. Year of Study: 1st, 2nd, 3rd, and 4th year students are welcome.
4. Preferred Skills: Experience with Python, Web development, or Flutter is preferred (not mandatory).

EVENT HIGHLIGHTS:
- Cash Prize Pool: ₹75,000 + Google Cloud credits & developer swag.
- Last Date to Register: November 8, 2026 at 11:59 PM IST.
- Venue: Turing Auditorium & Online GDG Discord Portal.

Apply at: https://gdg.community.dev/campus-hackathon-2026`,
  },
  {
    id: 'sample-scholarship',
    title: 'National Merit STEM Post-Matric Scholarship 2026-27',
    category: 'scholarship',
    shortDesc: 'Merit scholarship requiring Annual Family Income <= ₹2,50,000 and Minimum 8.5 CGPA / 70% marks.',
    posterSvgBase64: createPosterSvg('National STEM Merit Scholarship 2026', 'Ministry of Education & State Higher Ed Council', 'November 18, 2026', '₹30,000 ANNUAL GRANT + FEE WAIVER', '🎓 SCHOLARSHIP'),
    structuredEligibilityRules: [
      {
        id: 'rule_sch_1',
        requirementName: 'Annual Family Income Ceiling',
        condition: 'Total annual family income must not exceed ₹2,50,000 per annum from all sources.',
        type: 'mandatory',
        category: 'income',
        inputType: 'number',
        question: 'What is your total annual family income (in ₹)? [Max limit: ₹2,50,000]',
        numericCondition: {
          operator: '<=',
          threshold: 250000,
          unit: 'INR',
        },
        placeholder: 'e.g. 200000',
        sourceEvidence: 'Family Annual Income: Must not exceed ₹2,50,000 per annum from all sources.',
        helpText: 'Enter your family gross annual income. Must be <= ₹2,50,000.',
      },
      {
        id: 'rule_sch_2',
        requirementName: 'Minimum Academic CGPA / Score',
        condition: 'Must have secured a minimum of 8.5 CGPA (or 70% aggregate marks) in the previous exam.',
        type: 'mandatory',
        category: 'academic_score',
        inputType: 'number',
        question: 'What is your current CGPA (out of 10) or Percentage? [Required: >= 8.5 CGPA or >= 70%]',
        numericCondition: {
          operator: '>=',
          threshold: 8.5,
          unit: 'CGPA',
        },
        mappedProfileField: 'cgpa',
        placeholder: 'e.g. 9.0',
        sourceEvidence: 'Academic Standing: Minimum 8.5 CGPA (or 70% marks) in previous academic year.',
        helpText: 'Requires CGPA >= 8.5 out of 10 (or marks >= 70%). Evaluated directly without assumed formula.',
      },
      {
        id: 'rule_sch_3',
        requirementName: 'Full-Time STEM Course Enrollment',
        condition: 'Must be enrolled in a full-time undergraduate STEM course (BCA, BSc, or BTech).',
        type: 'mandatory',
        category: 'course_or_year',
        inputType: 'text',
        question: 'Confirm your current course of study:',
        mappedProfileField: 'course',
        sourceEvidence: 'Target Courses: BCA, BSc (Mathematics, Physics, CS), or BTech.',
      },
    ],
    text: `STATE HIGHER EDUCATION COUNCIL & SCHOLARSHIP WING
OFFICIAL NOTIFICATION: SCH/2026-27/STEM-088
DATE: OCTOBER 15, 2026

SUBJECT: INVITATION FOR NATIONAL MERIT POST-MATRIC STEM SCHOLARSHIP 2026-2027

Applications are invited from meritorious undergraduate students pursuing STEM courses (BCA, BSc, BTech) for the academic year 2026-27.

BENEFITS:
- Financial Grant: ₹30,000 per academic year directly disbursed to beneficiary Aadhaar-linked bank account.
- 50% tuition fee reimbursement for government quota students.

STRICT ELIGIBILITY REQUIREMENTS:
1. Family Annual Income: Must not exceed ₹3,50,000 per annum from all sources. (Income certificate required).
2. Academic Standing: Minimum 70% aggregate marks (or 8.5 CGPA) in the previous academic year exams.
3. Course: BCA, BSc (Mathematics, Physics, Chemistry, CS, Electronics), or BTech.
4. Current Status: Must be enrolled full-time (Distance learning / correspondence courses not eligible).

MANDATORY DOCUMENTS REQUIRED:
- Attested copy of previous year marks sheet.
- Government-issued Income Certificate.
- Copy of Aadhaar Card & Bonafide Certificate.

IMPORTANT DATES:
- Last Date for Submission of Online Application: November 18, 2026
Apply online at: https://scholarships.state.gov.in/post-matric-stem`,
  },
  {
    id: 'sample-hackathon',
    title: 'GhoulHacks 2026: 36-Hr Haunted AI Hackathon',
    category: 'competition',
    shortDesc: 'Inter-Collegiate Hackathon with ₹1,00,000 Prize Pool, open to BCA & BSc students. Registration closes Nov 5, 2026.',
    posterSvgBase64: createPosterSvg('GhoulHacks 2026: Haunted AI Hackathon', 'Dept. of Computer Science & Student Council', 'November 5, 2026 at 11:59 PM', '₹1,00,000 CASH PRIZE + INTERNSHIPS', '🎃 HACKATHON 2026'),
    structuredEligibilityRules: [
      {
        id: 'rule_ghoul_1',
        requirementName: 'Eligible Undergraduate Degree',
        condition: 'Open to all currently enrolled undergraduate students in BCA, BSc Computer Science / IT, and BTech.',
        type: 'mandatory',
        category: 'course_or_year',
        inputType: 'text',
        question: 'Confirm your current course of study:',
        mappedProfileField: 'course',
        sourceEvidence: 'Open to all currently enrolled undergraduate students in BCA, BSc Computer Science / IT, and BTech.',
      },
      {
        id: 'rule_ghoul_2',
        requirementName: 'Valid Student ID Card',
        condition: 'Must possess a valid, active college student ID card.',
        type: 'mandatory',
        category: 'custom',
        inputType: 'yes_no',
        options: ['Yes', 'No', 'Not Sure'],
        question: 'Do you have a valid college student ID card?',
        sourceEvidence: '1. Valid College Student ID Card (scanned copy).',
      },
    ],
    text: `DEPARTMENT OF COMPUTER SCIENCE & STUDENT COUNCIL
NOTICE REF: CS/HACK/2026/102
DATE: OCTOBER 24, 2026

SUB: ANNOUNCEMENT OF GHOULHACKS 2026 — 36-HOUR HAUNTED AI HACKATHON

We are thrilled to announce "GhoulHacks 2026", an annual inter-collegiate AI Hackathon hosted at the Main Auditorium, Science Block.

KEY DETAILS:
- Event Dates: November 14 - 15, 2026
- Application Deadline: November 5, 2026 at 11:59 PM IST
- Registration Fee: FREE (No cost for registered students)
- Prize Pool: ₹1,00,000 total cash awards, plus direct fast-track internship interviews with partner tech companies.

ELIGIBILITY CRITERIA:
- Open to all currently enrolled undergraduate students in BCA, BSc Computer Science / IT, and BTech.
- Students from 1st Year, 2nd Year, 3rd Year, and 4th Year are eligible.
- Minimum academic marks requirement: None stated. Teams of 2 to 4 members.

REQUIRED DOCUMENTS:
1. Valid College Student ID Card (scanned copy).
2. GitHub profile or portfolio link (optional but recommended).

HOW TO REGISTER:
1. Form a team of 2-4 students.
2. Fill the online registration form at https://ghoulhacks2026.campus.edu/register
3. Submit a 2-page project abstract by November 5, 2026.`,
  },
  {
    id: 'sample-internship',
    title: 'Phantom CyberSec — Paid Campus Internship & Pre-Placement Drive',
    category: 'internship',
    shortDesc: '6-month paid internship with ₹25,000/month stipend and PPO opportunity. Final year only, min 65% aggregate.',
    posterSvgBase64: createPosterSvg('Phantom CyberSec Placement Drive', 'Phantom Cyber Defense Labs & Campus Placement Cell', 'November 10, 2026 at 5:00 PM', '₹25,000/MONTH STIPEND + PPO (8 LPA)', '💼 INTERNSHIP / PLACEMENT'),
    structuredEligibilityRules: [
      {
        id: 'rule_phantom_1',
        requirementName: 'Final Year Passing Out Batch',
        condition: 'Must be in final year of study (Passing out batch 2027).',
        type: 'mandatory',
        category: 'course_or_year',
        inputType: 'text',
        question: 'Confirm your current academic year:',
        mappedProfileField: 'academicYear',
        sourceEvidence: 'Target Students: Final year BCA, BSc CS/IT, and BTech students (Passing out year: 2027).',
      },
      {
        id: 'rule_phantom_2',
        requirementName: 'Minimum Aggregate Marks (65%)',
        condition: 'Minimum 65% aggregate score or 6.5 CGPA with zero active backlogs.',
        type: 'mandatory',
        category: 'academic_score',
        inputType: 'number',
        question: 'What is your current aggregate marks percentage (%)? [Required: >= 65%]',
        numericCondition: {
          operator: '>=',
          threshold: 65,
          unit: '%',
        },
        mappedProfileField: 'marks',
        sourceEvidence: 'Minimum Aggregate: 65% or 6.5 CGPA with no active backlogs.',
      },
      {
        id: 'rule_phantom_3',
        requirementName: 'Technical Skills (Python or Java & Linux)',
        condition: 'Proficiency in Python or Java with Linux command line basics.',
        type: 'mandatory',
        category: 'skills',
        inputType: 'yes_no',
        options: ['Yes', 'No', 'Not Sure'],
        question: 'Do you have proficiency in Python/Java and basic Linux networking?',
        sourceEvidence: 'Required Technical Skills: Python or Java, basic networking knowledge, Linux command line fundamentals.',
      },
    ],
    text: `CAMPUS PLACEMENT CELL & INDUSTRY RELATIONS
CIRCULAR NO: CPC/INT/2026/41
DATE: OCTOBER 22, 2026

COMPANY: PHANTOM CYBER DEFENSE LABS PVT LTD
ROLE: CYBERSECURITY ANALYST / SOFTWARE TEST ENGINEER INTERN

OPPORTUNITY HIGHLIGHTS:
- 6 Months Full-Time Internship starting January 2027.
- Monthly Stipend: ₹25,000 per month.
- Pre-Placement Offer (PPO): Up to ₹8.5 LPA based on internship performance.

ELIGIBILITY CRITERIA:
- Target Students: Final year BCA, BSc CS/IT, and BTech students (Passing out year: 2027).
- Minimum Aggregate: 65% or 6.5 CGPA with no active backlogs.
- Required Technical Skills: Python or Java, basic networking knowledge, Linux command line fundamentals.

APPLICATION DEADLINE:
- Last date to apply on internal placement portal: November 10, 2026 by 5:00 PM IST.
- Registration link: https://placements.campus.edu/drive/phantom-2026`,
  },
];
