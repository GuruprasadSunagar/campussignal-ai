import React, { useState } from 'react';
import { User, Award, BookOpen, Sparkles, Check, Info } from 'lucide-react';
import { StudentProfile } from '../types';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [course, setCourse] = useState(profile.course || 'BCA (Bachelor of Computer Applications)');
  const [academicYear, setAcademicYear] = useState(profile.academicYear || '2nd Year');
  const [interests, setInterests] = useState<string[]>(profile.interests || ['internships', 'competitions', 'scholarships']);
  const [skillsInput, setSkillsInput] = useState((profile.skills || ['Python', 'Web Dev']).join(', '));
  const [marks, setMarks] = useState<string>(profile.marks ? String(profile.marks) : '');
  const [cgpa, setCgpa] = useState<string>(profile.cgpa ? String(profile.cgpa) : '');

  if (!isOpen) return null;

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
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#150e2a] border border-purple-600/50 rounded-2xl p-6 text-purple-100 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-purple-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Student Profile</h3>
              <p className="text-xs text-purple-300">Used by Gemma 4 to match college notices with you</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-purple-400 hover:text-white text-lg p-1"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 space-y-4 text-sm">
          {/* Course Selector */}
          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-400" />
              Degree / Course
            </label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full bg-[#1e133d] border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400 text-sm"
            >
              {COMMON_COURSES.map((c) => (
                <option key={c} value={c} className="bg-[#150e2a] text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Academic Year */}
          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-1.5">
              Current Academic Year
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['1st Year', '2nd Year', '3rd Year', 'Final Year'].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setAcademicYear(yr)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    academicYear === yr
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-sm'
                      : 'bg-purple-950/60 text-purple-300 border-purple-800/60 hover:border-purple-600'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Areas of Interest (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_INTERESTS.map((item) => {
                const active = interests.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleInterest(item)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize border transition-all cursor-pointer flex items-center gap-1.5 ${
                      active
                        ? 'bg-teal-500/20 text-teal-300 border-teal-500 font-semibold'
                        : 'bg-purple-950/50 text-purple-300 border-purple-800/50 hover:border-purple-600'
                    }`}
                  >
                    {active && <Check className="w-3 h-3 text-teal-300" />}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-1.5">
              Key Skills (comma separated)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="e.g. Python, SQL, Web Development, Public Speaking"
              className="w-full bg-[#1e133d] border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-white placeholder-purple-400/50 focus:outline-none focus:border-amber-400 text-sm"
            />
          </div>

          {/* Marks & CGPA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-purple-200">
                  Academic Marks (%)
                </label>
              </div>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                placeholder="e.g. 78.5"
                className="w-full bg-[#1e133d] border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-white placeholder-purple-400/50 focus:outline-none focus:border-amber-400 text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-purple-200">
                  CGPA (out of 10)
                </label>
              </div>
              <input
                type="number"
                min="0"
                max="10"
                step="0.01"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                placeholder="e.g. 8.7"
                className="w-full bg-[#1e133d] border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-white placeholder-purple-400/50 focus:outline-none focus:border-amber-400 text-sm"
              />
            </div>
          </div>

          {/* Privacy Note */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs text-purple-300">
            <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <p>
              Your student profile is saved securely in your browser's local storage.
              It is never transmitted to external services or shared.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-purple-800/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-purple-300 hover:text-white text-xs font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-lg shadow-amber-500/20"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};
