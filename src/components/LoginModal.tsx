import React from 'react';
import { UserRole } from '../types';
import {
  GraduationCap,
  ShieldCheck,
  Building2,
  ArrowRight,
  BookOpen,
  Award,
  Sparkles,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onSelectRole: (role: UserRole) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onSelectRole }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg mb-3">
              <Building2 className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">SkillSet AI</h1>
            <p className="text-blue-200 text-xs sm:text-sm mt-1 max-w-md">
              AI-Powered Skill Gap Diagnosis & Personalized Training Pathways for Indian Civil Servants
            </p>
            <div className="mt-3 flex items-center space-x-2 text-[11px] text-blue-300 font-semibold bg-white/10 px-3 py-1 rounded-full border border-white/10">
              <span>MoSPI · NSSTA · iGOT Karmayogi</span>
              <span>·</span>
              <span className="text-amber-300">SIH 2026 High-Fidelity Prototype</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Select Demonstration Profile
          </div>

          {/* Option 1: Learner Portal */}
          <button
            onClick={() => onSelectRole('learner')}
            className="w-full text-left p-5 border-2 border-slate-200 rounded-xl hover:border-blue-600 hover:bg-blue-50/50 transition-all group flex items-start space-x-4 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0 shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900 group-hover:text-blue-700 text-sm sm:text-base">
                  Learner Portal (Civil Servant)
                </div>
                <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                  <span>Enter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-xs font-medium text-slate-700 mt-0.5">
                Ananya Sharma · Statistical Officer Grade II
              </div>
              <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Subordinate Statistical Service (SSS) · Field Operations Division (FOD). Experience AI skill-gap diagnosis, iGOT pathways, live assessments, and automated competency credentialing.
              </div>
            </div>
          </button>

          {/* Option 2: Admin Portal */}
          <button
            onClick={() => onSelectRole('admin')}
            className="w-full text-left p-5 border-2 border-slate-200 rounded-xl hover:border-indigo-600 hover:bg-indigo-50/50 transition-all group flex items-start space-x-4 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900 group-hover:text-indigo-700 text-sm sm:text-base">
                  Admin Portal (Training Administrator)
                </div>
                <span className="text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                  <span>Enter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-xs font-medium text-slate-700 mt-0.5">
                Dr. Rajesh Verma · Director & Head of Capacity Building
              </div>
              <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                National Statistical Systems Training Academy (NSSTA). Department-wide skill heatmaps, cadre analytics, and Gemini AI-powered quiz generator from MoSPI technical training manuals.
              </div>
            </div>
          </button>

          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-500">
              Prototype designed for the Smart India Hackathon (SIH 2026). Seamless role-switching is available anytime from the top bar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
