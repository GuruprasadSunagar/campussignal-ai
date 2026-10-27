import React from 'react';
import {
  LayoutDashboard,
  FileSearch,
  User,
  Bookmark,
  Clock,
  Settings,
  LogOut,
  Sparkles,
  Cpu,
} from 'lucide-react';
import { StudentProfile } from '../types';

export type DashboardView =
  | 'dashboard'
  | 'analyze'
  | 'profile'
  | 'opportunities'
  | 'deadlines'
  | 'settings';

interface SidebarProps {
  currentView: DashboardView;
  onSelectView: (view: DashboardView) => void;
  onExitToEntrance: () => void;
  savedNoticesCount: number;
  upcomingDeadlinesCount: number;
  studentProfile: StudentProfile;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  onExitToEntrance,
  savedNoticesCount,
  upcomingDeadlinesCount,
  studentProfile,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const menuItems: Array<{
    id: DashboardView;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeColor?: string;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'analyze',
      label: 'Analyze Poster',
      icon: <FileSearch className="w-4 h-4 text-teal-400" />,
    },
    {
      id: 'profile',
      label: 'Student Profile',
      icon: <User className="w-4 h-4 text-indigo-400" />,
      badge: studentProfile.course ? studentProfile.course.split(' ')[0] : 'BCA',
      badgeColor: 'bg-purple-950 text-indigo-300 border-indigo-900/60',
    },
    {
      id: 'opportunities',
      label: 'My Opportunities',
      icon: <Bookmark className="w-4 h-4 text-amber-400" />,
      badge: savedNoticesCount > 0 ? savedNoticesCount : undefined,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold',
    },
    {
      id: 'deadlines',
      label: 'Deadline Tracker',
      icon: <Clock className="w-4 h-4 text-rose-400" />,
      badge: upcomingDeadlinesCount > 0 ? upcomingDeadlinesCount : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-800/60',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4 text-purple-400" />,
    },
  ];

  const handleItemClick = (id: DashboardView) => {
    onSelectView(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden animate-fade-in"
        />
      )}

      {/* Permanent Left Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0e061e] border-r border-purple-800/40 p-4 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Brand Header */}
        <div>
          <div className="flex items-center gap-3 px-2 py-3 border-b border-purple-800/40">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-amber-500 p-0.5 shadow-md">
              <div className="w-full h-full bg-[#110727] rounded-[10px] flex items-center justify-center text-lg">
                👻
              </div>
              <span className="absolute -top-1 -right-1 text-xs">🎃</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm tracking-tight text-white">CampusSignal</span>
                <span className="text-xs font-black text-amber-400">AI</span>
              </div>
              <span className="text-[10px] text-purple-300/80 font-mono block">
                Haunted Campus
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="mt-6 space-y-1.5">
            <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-purple-400 block mb-2">
              Campus Portal
            </span>
            {menuItems.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-amber-500/20 to-purple-800/40 text-amber-300 border border-amber-500/40 font-bold shadow-md'
                      : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        item.badgeColor || 'bg-purple-950 text-purple-300 border-purple-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Gemma 4 Badge & Exit to Haunted Gates */}
        <div className="space-y-3 pt-4 border-t border-purple-800/40">
          {/* Gemma 4 Model Indicator */}
          <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800/50 text-[11px] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-purple-300 font-semibold flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                Gemma 4
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            </div>
            <p className="text-[10px] text-purple-400 font-mono truncate">
              gemma-4-26b-a4b-it
            </p>
          </div>

          {/* Exit to Haunted Campus Gates button */}
          <button
            type="button"
            onClick={onExitToEntrance}
            className="w-full py-2.5 px-3 bg-purple-900/30 hover:bg-rose-950/40 text-purple-300 hover:text-rose-300 rounded-xl text-xs font-bold transition-all cursor-pointer border border-purple-800/40 hover:border-rose-700/50 flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit to Haunted Gates</span>
          </button>
        </div>
      </aside>
    </>
  );
};
