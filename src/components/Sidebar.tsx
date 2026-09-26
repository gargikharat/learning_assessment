import React from 'react';
import { UserRole } from '../types';
import {
  LayoutDashboard,
  Award,
  TrendingUp,
  Route,
  ClipboardCheck,
  BarChart3,
  Wand2,
  Users,
  LogOut,
  Building2,
  BookOpen,
  ArrowRightLeft,
} from 'lucide-react';

interface SidebarProps {
  role: UserRole;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onSwitchRole: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  currentView,
  onNavigate,
  onLogout,
  onSwitchRole,
}) => {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col shrink-0 sticky top-0 h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-white tracking-tight flex items-center space-x-1.5">
              <span>SkillSet</span>
              <span className="text-blue-400 font-bold">AI</span>
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              Official Statistics Training
            </div>
          </div>
        </div>

        {/* Indian Governmental Emblem / Ministry Lockup */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="text-slate-300 font-medium">MoSPI · NSSTA</span>
          <span className="bg-slate-800 text-blue-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-700">
            iGOT Karmayogi
          </span>
        </div>
      </div>

      {/* Role Indicator Banner */}
      <div className="px-4 py-2.5 mx-4 mt-4 rounded-lg bg-slate-800/70 border border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              role === 'learner' ? 'bg-blue-400 animate-pulse' : 'bg-indigo-400'
            }`}
          />
          <span className="text-xs font-semibold text-slate-200 capitalize">
            {role === 'learner' ? 'Learner (Civil Servant)' : 'Admin (Director NSSTA)'}
          </span>
        </div>
        <button
          onClick={onSwitchRole}
          className="text-[11px] text-blue-400 hover:text-blue-300 hover:underline flex items-center space-x-1"
          title="Switch role"
        >
          <ArrowRightLeft className="w-3 h-3" />
          <span>Switch</span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {role === 'learner' ? (
          <>
            <div className="px-3 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Learner Portal
            </div>
            <button
              onClick={() => onNavigate('dashboard')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'dashboard'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('my-skills')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'my-skills'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4 shrink-0" />
              <span>My Skills & Matrix</span>
            </button>

            <button
              onClick={() => onNavigate('skill-gaps')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'skill-gaps'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">AI Skill Gaps</span>
              <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/30 px-1.5 py-0.2 rounded font-semibold">
                2 High
              </span>
            </button>

            <button
              onClick={() => onNavigate('learning-path')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'learning-path'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Route className="w-4 h-4 shrink-0" />
              <span>Learning Pathways</span>
            </button>

            <button
              onClick={() => onNavigate('quizzes')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'quizzes'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <ClipboardCheck className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">Assessments & Certs</span>
              <span className="w-2 h-2 rounded-full bg-blue-400" />
            </button>
          </>
        ) : (
          <>
            <div className="px-3 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Administrator Portal
            </div>
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'admin-dashboard'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span>Org Overview</span>
            </button>

            <button
              onClick={() => onNavigate('quiz-generator')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'quiz-generator'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Wand2 className="w-4 h-4 shrink-0 text-amber-300" />
              <span className="flex-1 text-left">AI Quiz Generator</span>
              <span className="text-[10px] bg-amber-400/20 text-amber-200 border border-amber-400/30 px-1.5 py-0.2 rounded font-semibold">
                Gemini
              </span>
            </button>

            <button
              onClick={() => onNavigate('trainees')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'trainees'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Cadre Trainee Roster</span>
            </button>
          </>
        )}
      </nav>

      {/* Bottom Footer Actions */}
      <div className="p-4 border-t border-slate-800/80 space-y-2">
        <div className="p-2.5 rounded-lg bg-slate-800/50 text-[11px] text-slate-400 leading-relaxed border border-slate-800">
          <span className="text-slate-300 font-semibold">ASTELLA_vp</span>
          <p className="mt-0.5 text-slate-400">MoSPI Closed-Loop Training Architecture</p>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Exit / Role Select</span>
        </button>
      </div>
    </aside>
  );
};
