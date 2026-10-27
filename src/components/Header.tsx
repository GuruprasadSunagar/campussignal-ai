import React from 'react';
import { Bookmark, User, Menu } from 'lucide-react';
import { GemmaStatusBadge } from './GemmaStatusBadge';
import { StudentProfile } from '../types';

interface HeaderProps {
  studentProfile: StudentProfile;
  onOpenProfile: () => void;
  savedCount: number;
  onOpenSaved: () => void;
  onNavigateHome: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  studentProfile,
  onOpenProfile,
  savedCount,
  onOpenSaved,
  onNavigateHome,
  onToggleMobileSidebar,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0d0720]/85 backdrop-blur-md border-b border-purple-800/40 px-4 sm:px-6 py-3 transition-all">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Mobile sidebar menu button & Brand */}
        <div className="flex items-center gap-3">
          {onToggleMobileSidebar && (
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl bg-purple-950 border border-purple-800/60 text-purple-300 hover:text-white cursor-pointer"
              title="Toggle sidebar menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          <div
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-amber-500 p-0.5 shadow-md shadow-purple-950/60 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#110826] rounded-[10px] flex items-center justify-center text-lg">
                👻
              </div>
              <span className="absolute -top-1 -right-1 text-xs">🎃</span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-black tracking-tight text-white group-hover:text-amber-300 transition-colors">
                  CampusSignal <span className="text-amber-400">AI</span>
                </span>
                <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 hidden sm:inline">
                  Haunted Edition
                </span>
              </div>
              <p className="text-[10px] text-purple-300/80 font-medium hidden sm:block">
                "Don't let opportunities vanish into the darkness!"
              </p>
            </div>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Gemma 4 Live Status Badge */}
          <GemmaStatusBadge />

          {/* Student Profile Quick Button */}
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/70 border border-purple-700/50 text-xs font-semibold text-purple-200 hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{studentProfile.course?.split(' ')[0] || 'Profile'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950 text-teal-300 font-mono">
              {studentProfile.academicYear?.split(' ')[0] || 'Yr 2'}
            </span>
          </button>

          {/* Saved Notices Drawer Button */}
          <button
            type="button"
            onClick={onOpenSaved}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/70 border border-purple-700/50 text-xs font-semibold text-purple-200 hover:text-white transition-all cursor-pointer shadow-sm relative"
          >
            <Bookmark className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden md:inline">Saved</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
