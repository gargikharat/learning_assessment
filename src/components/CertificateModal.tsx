import React from 'react';
import { UserProfile } from '../types';
import { Award, ShieldCheck, Printer, CheckCircle2, Building2 } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  certInfo: {
    title: string;
    score: number;
    date: string;
    skill: string;
  } | null;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  user,
  certInfo,
}) => {
  if (!isOpen || !certInfo) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Certificate Container (Aesthetic Government Credential) */}
        <div className="p-8 sm:p-12 relative bg-[#fffdfa] border-8 border-slate-900 m-2 sm:m-4 text-center">
          {/* Subtle Corner Accents */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-600" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-600" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-600" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-600" />

          {/* National Emblem & Department Lockup */}
          <div className="space-y-1.5 mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-900 text-amber-400 mx-auto shadow-md mb-2">
              <Building2 className="w-8 h-8" />
            </div>
            <div className="text-xs font-bold text-slate-800 tracking-widest uppercase">
              Government of India · भारत सरकार
            </div>
            <div className="text-xs font-semibold text-slate-600">
              Ministry of Statistics & Programme Implementation (MoSPI)
            </div>
            <div className="text-xs font-medium text-slate-500">
              National Statistical Systems Training Academy (NSSTA)
            </div>
          </div>

          <div className="h-0.5 w-32 bg-amber-600 mx-auto my-4" />

          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-wide uppercase">
            Certificate of Competency
          </h1>
          <p className="text-xs text-slate-500 italic mt-1">
            Official Civil Service Skill Credential · Mission Karmayogi
          </p>

          <p className="text-xs sm:text-sm text-slate-600 mt-6 leading-relaxed max-w-lg mx-auto">
            This is to certify that
          </p>

          <div className="text-xl sm:text-2xl font-bold text-slate-900 underline decoration-amber-500 underline-offset-8 my-2">
            {user.name}
          </div>
          <div className="text-xs font-semibold text-slate-600">
            {user.designation} · {user.cadre} (ID: {user.employeeId})
          </div>

          <p className="text-xs sm:text-sm text-slate-600 mt-6 max-w-xl mx-auto leading-relaxed">
            has successfully passed the comprehensive assessment for
          </p>

          <div className="text-base sm:text-lg font-bold text-blue-900 my-2">
            {certInfo.title}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Assessed Skill Domain: <span className="font-bold text-slate-800">{certInfo.skill}</span>
          </div>

          <div className="my-6 inline-block bg-amber-50 border border-amber-200 px-4 py-1.5 rounded-full text-xs font-bold text-amber-900">
            Achieved Score: {certInfo.score}% · Standard Passed
          </div>

          {/* Signatures & Seal */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
            <div>
              <div className="text-[11px] text-slate-400">Date of Validation:</div>
              <div className="text-xs font-bold text-slate-800">{certInfo.date}</div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                Ref: MOSPI-NSSTA-{Date.now().toString().slice(-6)}
              </div>
            </div>

            {/* Official Seal Mock */}
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-600 flex flex-col items-center justify-center text-[8px] font-bold text-amber-800 uppercase text-center p-1">
              <span>NSSTA</span>
              <span>VERIFIED</span>
              <span>SEAL</span>
            </div>

            <div className="text-right">
              <div className="font-serif italic font-bold text-slate-900 text-sm">
                Dr. Rajesh Verma
              </div>
              <div className="text-[11px] font-semibold text-slate-700">Director & Head of Capacity Building</div>
              <div className="text-[10px] text-slate-500">NSSTA, Government of India</div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Digital credential stored permanently in MoSPI HRMS
          </span>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Credential</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
