import React, { useState } from 'react';
import { DepartmentMetric, TraineeRecord } from '../../types';
import {
  BarChart3,
  Users,
  Award,
  Sparkles,
  Download,
  Filter,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Building2,
  Wand2,
  ArrowRight,
} from 'lucide-react';

interface AdminDashboardProps {
  departmentMetrics: DepartmentMetric[];
  trainees: TraineeRecord[];
  onNavigate: (view: string) => void;
  onExportReport: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  departmentMetrics,
  trainees,
  onNavigate,
  onExportReport,
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // High gap chart data across key governmental statistical competencies
  const chartData = [
    { label: 'Python Automation', gapPercent: 65, staffAffected: 812, cadre: 'Technical' },
    { label: 'AI & Machine Learning', gapPercent: 78, staffAffected: 973, cadre: 'Technical' },
    { label: 'GIS & Satellite Data', gapPercent: 45, staffAffected: 561, cadre: 'Operations' },
    { label: 'Cloud Data Lakes', gapPercent: 55, staffAffected: 686, cadre: 'Technical' },
    { label: 'SDG Indicators NIF', gapPercent: 32, staffAffected: 399, cadre: 'Statistical' },
    { label: 'Sampling & Survey Design', gapPercent: 14, staffAffected: 174, cadre: 'Statistical' },
  ];

  const orgGrowthStats = [
    { name: 'Survey Microdata Automation', growth: '+22%', percent: 78, positive: true },
    { name: 'Cloud Infrastructure & API Usage', growth: '+14%', percent: 42, positive: true },
    { name: 'Official Statistical Ethics & Law', growth: '+5%', percent: 91, positive: true },
    { name: 'AI Literacy & Geospatial Tagging', growth: '+38%', percent: 35, positive: true },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>National Statistical Systems Training Academy (NSSTA)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Organization Capacity & Skill-Gap Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Real-time cadre readiness analytics across 1,248 civil servants in the Ministry of Statistics & Programme Implementation (MoSPI).
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0 self-start md:self-auto">
          <button
            onClick={() => onNavigate('quiz-generator')}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center space-x-2 shadow-xs cursor-pointer"
          >
            <Wand2 className="w-4 h-4 text-amber-300" />
            <span>Generate AI Assessment</span>
          </button>
          <button
            onClick={onExportReport}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center space-x-2 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export MoSPI Report</span>
          </button>
        </div>
      </div>

      {/* 4 Top Level Organization Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
            Active Civil Servants
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
            1,248
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-2 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12% enrolled vs last month</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">SSS & ISS Cadres tracked</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
            Cadre Proficiency Avg.
          </div>
          <div className="text-3xl font-extrabold text-indigo-600 tabular-nums">
            64.8%
          </div>
          <div className="text-xs text-amber-600 font-semibold mt-2 flex items-center space-x-1">
            <span>Target: 75.0% by Q4 2026</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Benchmarked via NSSTA rubrics</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
            Active Accredited Modules
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
            82
          </div>
          <div className="text-xs text-slate-500 mt-2">
            iGOT Karmayogi & NSSTA combined
          </div>
          <div className="text-[11px] text-slate-400 mt-1">42 Self-Paced · 40 Cohort</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
            AI Assessments Evaluated
          </div>
          <div className="text-3xl font-extrabold text-blue-600 tabular-nums">
            4,120
          </div>
          <div className="text-xs text-blue-600 font-semibold mt-2 flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Automated psychometric scoring</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Zero manual grading backlog</div>
        </div>
      </div>

      {/* Main Charts Row: SVG Bar Chart + Growth Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Interactive Bar Chart: Top Skill Gaps Organization-Wide */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Top Skill Gaps (Organization Wide)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Percentage of Ministry personnel requiring upskilling intervention
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="w-3 h-3 rounded bg-indigo-600 inline-block" />
              <span className="text-slate-600 font-medium">Cadre High Gap %</span>
            </div>
          </div>

          {/* Custom SVG Interactive Bar Chart */}
          <div className="space-y-4 py-2">
            {chartData.map((item, idx) => {
              const isHovered = hoveredBarIndex === idx;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredBarIndex(idx)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                  className="space-y-1.5 cursor-pointer group"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {item.label}
                    </span>
                    <div className="flex items-center space-x-3">
                      <span className="text-slate-400 text-[11px]">
                        {item.staffAffected} officers affected
                      </span>
                      <span className="font-bold text-indigo-700 tabular-nums w-10 text-right">
                        {item.gapPercent}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 h-6 rounded-lg overflow-hidden relative">
                    <div
                      className={`h-full rounded-lg transition-all duration-700 ${
                        item.gapPercent > 60
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-700'
                          : item.gapPercent > 40
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                      } ${isHovered ? 'brightness-110' : ''}`}
                      style={{ width: `${item.gapPercent}%` }}
                    />
                    {isHovered && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white font-bold tracking-wider">
                        High Priority Intervention
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Critical Focus: Python & AI/ML require offline intensive bootcamp</span>
            <button
              onClick={() => onNavigate('quiz-generator')}
              className="text-indigo-600 font-bold hover:underline"
            >
              Generate Targeted Assessments →
            </button>
          </div>
        </div>

        {/* Right: Competency Growth & Adoption Trends */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Competency Velocity</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Quarterly skill growth following iGOT roll-out
            </p>

            <div className="space-y-5 mt-6">
              {orgGrowthStats.map((stat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-800">{stat.name}</span>
                    <span className="text-emerald-600 font-bold tabular-nums">
                      {stat.growth}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-700"
                      style={{ width: `${stat.percent}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 text-right">
                    Current Cadre Proficiency: {stat.percent}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 space-y-1">
            <div className="font-bold flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>DPC Promotion Projection</span>
            </div>
            <p className="text-[11px] text-indigo-700 leading-relaxed">
              84 Subordinate Statistical Service officers are projected to achieve readiness for Assistant Director promotion within 60 days.
            </p>
          </div>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Departmental Competency & Gap Breakdown
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Field Operations Division (FOD), Data Processing Division (DPD), and Central Statistics Office (CSO)
            </p>
          </div>
          <span className="text-xs text-slate-400">MoSPI Administrative Units</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Department / Wing</th>
                <th className="px-6 py-4 text-center">Headcount</th>
                <th className="px-6 py-4 text-center">Avg. Proficiency</th>
                <th className="px-6 py-4 text-center">High Gap Personnel</th>
                <th className="px-6 py-4 text-center">Course Completion</th>
                <th className="px-6 py-4 text-center">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {departmentMetrics.map((dept, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                    {dept.department}
                  </td>
                  <td className="px-6 py-4 text-center tabular-nums text-slate-700 font-semibold">
                    {dept.headcount}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-indigo-700 tabular-nums">
                      {dept.avgProficiency}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-2.5 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded font-semibold text-[11px]">
                      {dept.highGapCount} Officers
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full"
                          style={{ width: `${dept.completionRate}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 tabular-nums">
                        {dept.completionRate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onNavigate('quiz-generator')}
                      className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Assign Assessment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
