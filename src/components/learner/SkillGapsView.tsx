import React, { useState } from 'react';
import { SkillGapItem } from '../../types';
import {
  TrendingUp,
  RefreshCw,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Target,
  Award,
  Filter,
} from 'lucide-react';

interface SkillGapsViewProps {
  skillGaps: SkillGapItem[];
  onNavigate: (view: string) => void;
  onFilterCoursesBySkill?: (skillName: string) => void;
  onRecalculateGaps: () => Promise<void>;
  isRecalculating: boolean;
}

export const SkillGapsView: React.FC<SkillGapsViewProps> = ({
  skillGaps,
  onNavigate,
  onFilterCoursesBySkill,
  onRecalculateGaps,
  isRecalculating,
}) => {
  const [selectedRole, setSelectedRole] = useState('Assistant Director (ISS SAG Benchmark)');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [assessmentSuccessMsg, setAssessmentSuccessMsg] = useState<string | null>(null);

  const handleRunAssessment = async () => {
    await onRecalculateGaps();
    setAssessmentSuccessMsg('AI Profile Assessment Complete. Skill Gaps and promotion eligibility updated.');
    setTimeout(() => setAssessmentSuccessMsg(null), 5000);
  };

  const filteredGaps = categoryFilter === 'All'
    ? skillGaps
    : skillGaps.filter((g) => g.category === categoryFilter);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Competency Diagnostic Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">AI Skill-Gap Analysis</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            The neural diagnostic engine continuously benchmarks your Master's degree background and current microdata assessments against MoSPI Cadre Competency Standards.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleRunAssessment}
            disabled={isRecalculating}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-2 shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRecalculating ? 'animate-spin' : ''}`} />
            <span>{isRecalculating ? 'Diagnosing Profile...' : 'Run AI Assessment'}</span>
          </button>
        </div>
      </div>

      {/* Target Role Selector & Category Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Target className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <div className="text-xs font-semibold text-slate-500">Benchmark Competency Target</div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="mt-0.5 text-xs sm:text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="Statistical Officer Grade II (Current Role)">
                Statistical Officer Grade II (Current Role Baseline)
              </option>
              <option value="Assistant Director (ISS SAG Benchmark)">
                Assistant Director (Indian Statistical Service Promotion Benchmark)
              </option>
              <option value="Lead Data Scientist (MoSPI Modernization Track)">
                Lead Data Scientist (National Data Lake Specialized Track)
              </option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs font-medium">
          <span className="text-slate-400 mr-2 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>
          {['All', 'Technical', 'Statistical', 'Governance'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Success Notification Alert */}
      {assessmentSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center space-x-3 animate-in fade-in duration-200">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="flex-1 font-medium">{assessmentSuccessMsg}</div>
        </div>
      )}

      {/* Main Skill Gaps Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Skill Category & Competency</th>
                <th className="px-6 py-4 text-center">Current Level</th>
                <th className="px-6 py-4 text-center">Required Standard</th>
                <th className="px-6 py-4">Priority / Skill Gap</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredGaps.map((gap) => {
                const gapColor =
                  gap.gapLevel === 'High'
                    ? 'bg-red-500'
                    : gap.gapLevel === 'Medium'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500';

                const badgeColor =
                  gap.gapLevel === 'High'
                    ? 'text-red-700 bg-red-50 border border-red-200'
                    : gap.gapLevel === 'Medium'
                    ? 'text-amber-700 bg-amber-50 border border-amber-200'
                    : 'text-emerald-700 bg-emerald-50 border border-emerald-200';

                return (
                  <tr key={gap.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm">{gap.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{gap.description}</div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1.5">
                        <span className="font-semibold text-slate-600">{gap.category}</span>
                        <span>·</span>
                        <span>{gap.targetRole}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="inline-block px-2.5 py-1 bg-slate-100 rounded-md font-semibold text-slate-700">
                        {gap.current}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 tabular-nums">
                        Score: {gap.currentScore}/100
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md font-bold border border-blue-100">
                        {gap.required}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 tabular-nums">
                        Standard: {gap.requiredScore}/100
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 w-28 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${gapColor}`}
                            style={{ width: `${gap.gapPercent}%` }}
                          />
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
                          {gap.gapLevel} ({gap.gapPercent}%)
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Deficit: {gap.requiredScore - gap.currentScore} proficiency points
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          if (onFilterCoursesBySkill) {
                            onFilterCoursesBySkill(gap.name);
                          }
                          onNavigate('learning-path');
                        }}
                        className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Find Courses</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3 Strategic Synthesis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/80 p-6 rounded-2xl">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold mb-3 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-blue-900 text-sm sm:text-base">Focus Area: Technical Automation</h2>
          <p className="text-xs text-blue-700 mt-2 leading-relaxed">
            Your biggest priority gaps are in <span className="font-bold">Python for Survey Data</span> and <span className="font-bold">AI / Anomaly Detection</span>. Closing these will boost your survey processing turnaround by 40% and automate validation.
          </p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200/80 p-6 rounded-2xl">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold mb-3 shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-indigo-900 text-sm sm:text-base">Promotion Readiness: 82%</h2>
          <p className="text-xs text-indigo-700 mt-2 leading-relaxed">
            You are currently <span className="font-bold">82% ready</span> for the Assistant Director (ISS) examination and Departmental Promotion Committee (DPC) benchmark.
          </p>
        </div>

        <div
          onClick={() => onNavigate('learning-path')}
          className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white p-6 rounded-2xl flex flex-col justify-between cursor-pointer hover:shadow-lg transition-all group"
        >
          <div>
            <div className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">
              Personalized Plan
            </div>
            <h2 className="text-lg font-extrabold mt-1">Generate Targeted Pathway</h2>
            <p className="text-xs text-emerald-100 mt-2 leading-relaxed">
              Curate an accelerated 30-day training sprint from iGOT Karmayogi and NSSTA to eliminate high-priority gaps.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-400/30 flex items-center justify-between text-xs font-bold">
            <span>Open Learning Path</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
