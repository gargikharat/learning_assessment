import React, { useState } from 'react';
import { TraineeRecord } from '../../types';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  BookOpen,
  Send,
} from 'lucide-react';

interface TraineeRosterViewProps {
  trainees: TraineeRecord[];
}

export const TraineeRosterView: React.FC<TraineeRosterViewProps> = ({ trainees }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [assignedSuccess, setAssignedSuccess] = useState<string | null>(null);

  const filteredTrainees = trainees.filter((t) => {
    const matchesSearch =
      searchQuery === '' ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.cadre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.topGap.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAssignTraining = (name: string) => {
    setAssignedSuccess(`Automated training pathway assigned to ${name} on iGOT Karmayogi.`);
    setTimeout(() => setAssignedSuccess(null), 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Personnel Training Cadre</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Cadre Trainee Roster</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Monitor civil servants across Subordinate Statistical Service (SSS) and Indian Statistical Service (ISS). Track readiness scores, top gaps, and assign accelerated pathways.
          </p>
        </div>
      </div>

      {/* Success Banner */}
      {assignedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center space-x-3 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="flex-1 font-medium">{assignedSuccess}</div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search officer name, cadre, department, top gap..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs font-medium">
          <span className="text-slate-400 mr-1 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </span>
          {['All', 'On Track', 'Needs Attention', 'Certified'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Trainee Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Officer Name & Cadre</th>
                <th className="px-6 py-4">Department / Division</th>
                <th className="px-6 py-4 text-center">Readiness Score</th>
                <th className="px-6 py-4">Top Identified Skill Gap</th>
                <th className="px-6 py-4">Enrolled Karmayogi Pathway</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTrainees.map((trainee) => (
                <tr key={trainee.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 text-sm">{trainee.name}</div>
                    <div className="text-[11px] text-slate-500">{trainee.cadre}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-700 font-medium">
                    {trainee.department}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-indigo-700 tabular-nums text-sm">
                      {trainee.readinessScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[11px]">
                      {trainee.topGap}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-[11px]">
                    {trainee.enrolledPath}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        trainee.status === 'Certified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : trainee.status === 'On Track'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {trainee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleAssignTraining(trainee.name)}
                      className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Assign Pathway
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
