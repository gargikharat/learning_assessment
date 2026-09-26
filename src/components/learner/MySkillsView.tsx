import React from 'react';
import { SkillItem, UserProfile } from '../../types';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  FileCheck,
  Building2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface MySkillsViewProps {
  user: UserProfile;
  skills: SkillItem[];
  onNavigate: (view: string) => void;
  onViewCertificate: (certInfo: {
    title: string;
    score: number;
    date: string;
    skill: string;
  }) => void;
}

export const MySkillsView: React.FC<MySkillsViewProps> = ({
  user,
  skills,
  onNavigate,
  onViewCertificate,
}) => {
  const verifiedCerts = [
    {
      id: 'cert-1',
      title: 'Official Statistics System & Survey Ethics',
      skill: 'Official Statistical Systems',
      score: 92,
      issuedDate: '14 Sep 2026',
      issuer: 'National Statistical Systems Training Academy (NSSTA)',
      verificationNumber: 'NSSTA-2026-VAL-8821',
    },
    {
      id: 'cert-2',
      title: 'Digital Data Protection & Citizen Microdata Privacy',
      skill: 'Cybersecurity & Data Privacy Laws',
      score: 88,
      issuedDate: '29 Aug 2026',
      issuer: 'iGOT Mission Karmayogi · DoPT',
      verificationNumber: 'IGOT-DPDP-7410-IN',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>National Cadre Competency Matrix</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Competency Taxonomy & Skill Ledger</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Verified official skills ledger maintained in accordance with the National Training Policy and Subordinate Statistical Service rules.
          </p>
        </div>

        <button
          onClick={() => onNavigate('skill-gaps')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-2 shrink-0 self-start md:self-auto cursor-pointer shadow-xs"
        >
          <TrendingUp className="w-4 h-4" />
          <span>Run AI Gap Assessment</span>
        </button>
      </div>

      {/* Profile Competency Snapshot Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-bold text-xl flex items-center justify-center shadow-md">
            AS
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {user.cadre} · {user.employeeId}
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">{user.name}</h2>
            <div className="text-xs text-slate-600">{user.designation} · {user.department}</div>
          </div>
        </div>

        <div className="flex items-center space-x-6 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-8 text-center md:text-left">
          <div>
            <div className="text-xs text-slate-400 font-medium">Verified Skills</div>
            <div className="text-2xl font-extrabold text-slate-900 tabular-nums">{skills.length}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Average Proficiency</div>
            <div className="text-2xl font-extrabold text-blue-600 tabular-nums">{user.overallProgress}%</div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Digital Credentials</div>
            <div className="text-2xl font-extrabold text-emerald-600 tabular-nums">2 Verified</div>
          </div>
        </div>
      </div>

      {/* Detailed Competency Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm sm:text-base text-slate-900">
            Current Assessed Competency Ledger
          </h3>
          <span className="text-xs text-slate-500">Synced with MoSPI HRMS</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Competency Name</th>
                <th className="px-6 py-4">Domain Category</th>
                <th className="px-6 py-4 text-center">Validated Level</th>
                <th className="px-6 py-4">Proficiency Meter</th>
                <th className="px-6 py-4 text-center">Last Assessed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {skills.map((skill) => (
                <tr key={skill.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                    {skill.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {skill.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        skill.level === 'Advanced'
                          ? 'bg-blue-50 text-blue-700'
                          : skill.level === 'Intermediate'
                          ? 'bg-sky-50 text-sky-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {skill.level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 w-28 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${skill.proficiencyScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700 tabular-nums">
                        {skill.proficiencyScore}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-slate-500 text-[11px]">
                    {skill.lastAssessed}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verified Government Credentials Section */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Official Digital Credentials & Certificates
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {verifiedCerts.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Government of India Verified</span>
                  </div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                    Score: {cert.score}%
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  {cert.title}
                </h4>

                <div className="text-xs text-slate-500 space-y-1">
                  <div>
                    <span className="text-slate-400">Issuing Body: </span>
                    <span className="font-medium text-slate-700">{cert.issuer}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Date Issued: </span>
                    <span>{cert.issuedDate}</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-400">
                    Credential ID: {cert.verificationNumber}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Permanent Competency Record</span>
                </span>
                <button
                  onClick={() =>
                    onViewCertificate({
                      title: cert.title,
                      score: cert.score,
                      date: cert.issuedDate,
                      skill: cert.skill,
                    })
                  }
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  View Certificate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
