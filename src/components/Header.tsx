import React, { useState } from 'react';
import { UserProfile, NotificationItem } from '../types';
import {
  Bell,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ArrowRightLeft,
  GraduationCap,
  Shield,
  Award,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  user: UserProfile;
  notifications: NotificationItem[];
  onSwitchRole: () => void;
  onOpenNotifications: () => void;
  activeView: string;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  notifications,
  onSwitchRole,
  onOpenNotifications,
  activeView,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const viewTitles: Record<string, string> = {
    dashboard: 'Learner Dashboard',
    'my-skills': 'Competency Taxonomy & Skills',
    'skill-gaps': 'AI Skill-Gap Diagnostics',
    'learning-path': 'Personalized Learning Pathways',
    quizzes: 'Assessments & Certification',
    'admin-dashboard': 'Organization Capacity Overview',
    'quiz-generator': 'AI Assessment Generator',
    trainees: 'Cadre Trainee Roster',
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Active View title with breadcrumb */}
      <div className="flex items-center space-x-3">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <span>MoSPI Capacity Building</span>
            <span>/</span>
            <span className="capitalize">{user.role} Portal</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            {viewTitles[activeView] || activeView.replace('-', ' ')}
          </h1>
        </div>
      </div>

      {/* Right: Actions, Notifications, Role Switch, Profile */}
      <div className="flex items-center space-x-4">
        {/* Switch Role Quick Button */}
        <button
          onClick={onSwitchRole}
          className="hidden sm:inline-flex items-center space-x-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
          title="Switch between Learner and Admin demonstration views"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
          <span>Switch to {user.role === 'learner' ? 'Admin' : 'Learner'}</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={onOpenNotifications}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* User Profile Lockup */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center space-x-3 text-left pl-3 border-l border-slate-200 hover:opacity-90 transition-opacity"
          >
            <div className="hidden md:block text-right">
              <div className="text-xs font-bold text-slate-900 leading-tight">{user.name}</div>
              <div className="text-[11px] text-slate-500 truncate max-w-[140px]">{user.designation}</div>
            </div>
            <div className="relative">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-xs ${
                  user.role === 'learner'
                    ? 'bg-blue-600 ring-2 ring-blue-100'
                    : 'bg-indigo-700 ring-2 ring-indigo-100'
                }`}
              >
                {user.role === 'learner' ? 'AS' : 'RV'}
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                  user.role === 'learner' ? 'bg-emerald-500' : 'bg-indigo-600'
                }`}
              />
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown */}
          {profileDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150"
              onMouseLeave={() => setProfileDropdownOpen(false)}
            >
              <div className="px-4 pb-3 border-b border-slate-100">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {user.cadre}
                </div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">{user.name}</div>
                <div className="text-xs text-slate-600">{user.email}</div>
                <div className="text-xs text-slate-400 mt-1">ID: {user.employeeId}</div>
              </div>

              <div className="py-2 px-2 text-xs space-y-1">
                <div className="flex items-center justify-between px-3 py-1.5 rounded-lg text-slate-600 bg-slate-50">
                  <span>Current Department</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[130px]">{user.department}</span>
                </div>
                <div className="flex items-center justify-between px-3 py-1.5 rounded-lg text-slate-600">
                  <span>Overall Competency</span>
                  <span className="font-bold text-blue-600">{user.overallProgress}%</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 px-2">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onSwitchRole();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Switch to {user.role === 'learner' ? 'Admin Portal' : 'Learner Portal'}</span>
                  </span>
                  <span className="text-[10px] bg-blue-100 px-1.5 py-0.5 rounded font-semibold">SIH Demo</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
