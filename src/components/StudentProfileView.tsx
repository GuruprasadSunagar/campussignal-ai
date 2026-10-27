import React, { useState } from 'react';
import {
  User,
  BookOpen,
  Award,
  Sparkles,
  Check,
  Info,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { StudentProfile } from '../types';

interface StudentProfileViewProps {
  profile: StudentProfile;
  onSave: (updated: StudentProfile) => void;
}

const AVAILABLE_INTERESTS = [
  'internships',
  'scholarships',
  'examinations',
  'placements',
  'events',
  'competitions',
  'workshops',
];

const COMMON_COURSES = [
  'BCA (Bachelor of Computer Applications)',
  'BSc (Computer Science / IT)',
  'BSc (General / Physics / Math)',
  'BCom (Bachelor of Commerce)',
  'BTech / BE (Computer Science)',
  'BTech / BE (Other Branches)',
  'BBA / Management',
  'Other Degree Course',
];

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({ profile, onSave }) => {
  const [course, setCourse] = useState(profile.course || 'BCA (Bachelor of Computer Applications)');
  const [academicYear, setAcademicYear] = useState(profile.academicYear || '2nd Year');
  const [interests, setInterests] = useState<string[]>(profile.interests || ['internships', 'competitions', 'scholarships']);
  const [skillsInput, setSkillsInput] = useState((profile.skills || ['Python', 'Web Dev']).join(', '));
  const [marks, setMarks] = useState<string>(profile.marks ? String(profile.marks) : '');
  const [cgpa, setCgpa] = useState<string>(profile.cgpa ? String(profile.cgpa) : '');
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleSave = () => {
    const parsedSkills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const parsedMarks = marks.trim() ? parseFloat(marks) : undefined;
    const parsedCgpa = cgpa.trim() ? parseFloat(cgpa) : undefined;

    const updated: StudentProfile = {
      course,
      academicYear,
      interests,
      skills: parsedSkills,
      marks: !isNaN(parsedMarks as number) ? parsedMarks : undefined,
      cgpa: !isNaN(parsedCgpa as number) ? parsedCgpa : undefined,
    };

    onSave(updated);
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header Banner */}
      <div className="bg-[#160d2f] border border-purple-700/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/40">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">Student Academic Profile</h2>
            <p className="text-xs sm:text-sm text-purple-300">
              Gemma 4 utilizes these parameters to match real notice eligibility
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm cursor-pointer shadow-lg shadow-amber-500/25 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile</span>
        </button>
      </div>

      {showSavedNotification && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Profile updated successfully! Next notice evaluations will use your new details.</span>
        </div>
      )}

      {/* Main Profile Form */}
      <div className="bg-[#140c2a] border border-purple-800/50 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Degree / Course */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-400" />
              Degree / Course
            </label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full bg-[#1e133d] border border-purple-700/60 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 text-sm"
            >
              {COMMON_COURSES.map((c) => (
                <option key={c} value={c} className="bg-[#140c2a] text-white">
                  {c}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-purple-400/80 mt-1 block">
              Checked against notice branch requirements (e.g. "Only BCA/BSc eligible")
            </span>
          </div>

          {/* Academic Year */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
              Current Academic Year
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['1st Year', '2nd Year', '3rd Year', 'Final Year'].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setAcademicYear(yr)}
                  className={`py-2.5 px-2 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    academicYear === yr
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-purple-950/60 text-purple-300 border-purple-800/60 hover:border-purple-600'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-purple-400/80 mt-1 block">
              Used to verify year restrictions (e.g. "Final year only")
            </span>
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Areas of Interest
          </label>
          <div className="flex flex-wrap gap-2.5">
            {AVAILABLE_INTERESTS.map((item) => {
              const active = interests.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleInterest(item)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500 font-bold'
                      : 'bg-purple-950/50 text-purple-300 border-purple-800/50 hover:border-purple-600'
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5 text-teal-300" />}
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
            Key Technical &amp; Extracurricular Skills
          </label>
          <input
            type="text"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="e.g. Python, SQL, Web Development, Public Speaking, CyberSec"
            className="w-full bg-[#1e133d] border border-purple-700/60 rounded-xl px-4 py-3 text-white placeholder-purple-400/50 focus:outline-none focus:border-amber-400 text-sm"
          />
        </div>

        {/* Marks and CGPA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Academic Marks (%) (Optional)
              </label>
              <span className="text-[10px] text-purple-400">e.g. 78.5%</span>
            </div>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              placeholder="e.g. 78.5"
              className="w-full bg-[#1e133d] border border-purple-700/60 rounded-xl px-4 py-3 text-white placeholder-purple-400/50 focus:outline-none focus:border-amber-400 text-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Current CGPA (out of 10) (Optional)
              </label>
              <span className="text-[10px] text-purple-400">e.g. 8.7</span>
            </div>
            <input
              type="number"
              min="0"
              max="10"
              step="0.01"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              placeholder="e.g. 8.7"
              className="w-full bg-[#1e133d] border border-purple-700/60 rounded-xl px-4 py-3 text-white placeholder-purple-400/50 focus:outline-none focus:border-amber-400 text-sm"
            />
          </div>
        </div>

        {/* Privacy Card */}
        <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/40 flex items-start gap-2.5 text-xs text-purple-300">
          <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <p>
            Your student profile details are stored locally in your current browser session. They are
            never sold, uploaded to external databases, or shared.
          </p>
        </div>
      </div>
    </div>
  );
};
