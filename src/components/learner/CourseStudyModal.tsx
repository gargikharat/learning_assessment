import React, { useState } from 'react';
import { Course } from '../../types';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Award,
  Play,
  FileText,
  Code,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface CourseStudyModalProps {
  course: Course | null;
  onClose: () => void;
  onLaunchAssessment: (skillName: string) => void;
}

export const CourseStudyModal: React.FC<CourseStudyModalProps> = ({
  course,
  onClose,
  onLaunchAssessment,
}) => {
  if (!course) return null;

  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  const [completedModules, setCompletedModules] = useState<number[]>([0, 1]);

  const activeModule = course.syllabus[activeModuleIdx] || course.syllabus[0];
  const isCompleted = completedModules.includes(activeModuleIdx);

  const toggleComplete = (idx: number) => {
    if (completedModules.includes(idx)) {
      setCompletedModules(completedModules.filter((i) => i !== idx));
    } else {
      setCompletedModules([...completedModules, idx]);
    }
  };

  const progressPercent = Math.round((completedModules.length / course.syllabus.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full border border-slate-200 overflow-hidden flex flex-col h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                course.source === 'iGOT' ? 'bg-orange-600' : 'bg-blue-600'
              }`}
            >
              {course.source} Karmayogi
            </span>
            <div className="h-4 w-px bg-slate-700 hidden sm:block" />
            <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-md sm:max-w-xl">
              {course.title}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-300">
              <span>Progress:</span>
              <span className="font-bold text-blue-400 tabular-nums">{progressPercent}%</span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Main Area: Sidebar + Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left: Syllabus Navigation */}
          <div className="w-full md:w-80 bg-slate-50 border-r border-slate-200 p-4 overflow-y-auto shrink-0 space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Course Modules ({course.syllabus.length})
            </div>

            {course.syllabus.map((mod, idx) => {
              const isModCompleted = completedModules.includes(idx);
              const isActive = activeModuleIdx === idx;

              return (
                <button
                  key={idx}
                  onClick={() => setActiveModuleIdx(idx)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-start space-x-3 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs font-semibold'
                      : 'hover:bg-slate-200/70 text-slate-700'
                  }`}
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(idx);
                    }}
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border cursor-pointer ${
                      isModCompleted
                        ? isActive
                          ? 'bg-white text-blue-600 border-white'
                          : 'bg-emerald-600 text-white border-emerald-600'
                        : isActive
                        ? 'border-white/50 text-transparent'
                        : 'border-slate-300 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs leading-snug truncate">{mod.title}</div>
                    <div
                      className={`text-[10px] mt-0.5 ${
                        isActive ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {mod.duration}
                    </div>
                  </div>
                </button>
              );
            })}

            <div className="pt-4 border-t border-slate-200 mt-4">
              <button
                onClick={() => {
                  onClose();
                  onLaunchAssessment(course.skillsAddressed[0] || 'Python for Data Analysis');
                }}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Take End-of-Course Assessment</span>
              </button>
            </div>
          </div>

          {/* Right: Module Reader */}
          <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  Module {activeModuleIdx + 1} of {course.syllabus.length}
                </span>
                <h1 className="text-xl font-bold text-slate-900 mt-0.5">{activeModule.title}</h1>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleComplete(activeModuleIdx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer ${
                    isCompleted
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isCompleted ? 'Completed ✓' : 'Mark Complete'}</span>
                </button>
              </div>
            </div>

            {/* Structured Module Content */}
            <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 space-y-4 leading-relaxed">
              <p className="font-medium text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200">
                {activeModule.summary}
              </p>

              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pt-2">
                Operational Framework & Government Standards
              </h2>
              <p>
                In accordance with the National Statistical Commission (NSC) technical directives, all microdata ingest pipelines must guarantee auditability and repeatability. Unlike spreadsheet software which can introduce silent truncations when handling over 1 million records, Python Pandas provides explicit typed schemas.
              </p>

              {/* Code Snippet Example for Technical / Statistical modules */}
              <div className="bg-slate-900 rounded-xl p-4 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
                <div className="flex items-center justify-between text-slate-400 text-[10px] pb-2 border-b border-slate-800 mb-3">
                  <span># MoSPI Official Verification Script - Python Pandas</span>
                  <span>v3.12</span>
                </div>
                <pre className="text-blue-300">
{`import pandas as pd
import numpy as np

# Load National Sample Survey microdata (Household Schedule)
df = pd.read_csv('NSSO_79th_Round_State_Sample.csv')

# Step 1: Compute weighted total expenditure using official multiplier
df['weighted_exp'] = df['monthly_exp'] * (df['multiplier'] / 100.0)

# Step 2: Outlier detection using Interquartile Range (IQR) fence rule
q25, q75 = np.percentile(df['monthly_exp'], [25, 75])
iqr = q75 - q25
lower_bound = q25 - (1.5 * iqr)
upper_bound = q75 + (1.5 * iqr)

flagged_anomalies = df[(df['monthly_exp'] < lower_bound) | (df['monthly_exp'] > upper_bound)]
print(f"Validated records: {len(df)} | Anomaly investigations flagged: {len(flagged_anomalies)}")`}
                </pre>
              </div>

              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pt-2">
                Cadre Competency Checkpoint
              </h2>
              <p>
                Statistical officers completing this section are expected to verify survey cross-tabulations and validate that state aggregates align with Central Statistics Office (CSO) control totals before final submission to the National Data Warehouse.
              </p>
            </div>

            {/* Bottom Module Navigation */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
              <button
                disabled={activeModuleIdx === 0}
                onClick={() => setActiveModuleIdx(activeModuleIdx - 1)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-xs font-semibold rounded-lg text-slate-700 flex items-center space-x-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Module</span>
              </button>

              {activeModuleIdx < course.syllabus.length - 1 ? (
                <button
                  onClick={() => {
                    if (!isCompleted) toggleComplete(activeModuleIdx);
                    setActiveModuleIdx(activeModuleIdx + 1);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <span>Next: Module {activeModuleIdx + 2}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    onLaunchAssessment(course.skillsAddressed[0] || 'Python for Data Analysis');
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center space-x-2 cursor-pointer shadow-xs"
                >
                  <Award className="w-4 h-4" />
                  <span>Launch Official Assessment</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
