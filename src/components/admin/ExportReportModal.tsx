import React from 'react';
import { DepartmentMetric, TraineeRecord } from '../../types';
import { Download, Printer, FileText, CheckCircle2 } from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentMetrics: DepartmentMetric[];
  trainees: TraineeRecord[];
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  departmentMetrics,
  trainees,
}) => {
  if (!isOpen) return null;

  const handleDownloadCSV = () => {
    const headers = 'Department,Headcount,AvgProficiency,HighGapCount,CompletionRate\n';
    const rows = departmentMetrics
      .map(
        (m) =>
          `"${m.department}",${m.headcount},${m.avgProficiency}%,${m.highGapCount},${m.completionRate}%`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MoSPI_Cadre_Capacity_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-bold text-base">MoSPI Cadre Capacity Intelligence Report</h3>
              <p className="text-xs text-slate-400">Official Executive Summary for Ministry Leadership</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold cursor-pointer">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs text-slate-700">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 text-sm">Key Executive Findings</div>
            <p className="leading-relaxed">
              Based on the continuous neural competency audit across 1,248 civil servants, the overall Ministry proficiency index stands at <strong>64.8%</strong>. Highest identified critical training gaps remain concentrated in <strong>Python Survey Automation (65%)</strong> and <strong>AI/ML Integration (78%)</strong>.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-900 text-sm">Departmental Capacity Matrix</div>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-3">Division</th>
                    <th className="p-3 text-center">Headcount</th>
                    <th className="p-3 text-center">Avg Proficiency</th>
                    <th className="p-3 text-center">Completion Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {departmentMetrics.map((m, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-semibold text-slate-900">{m.department}</td>
                      <td className="p-3 text-center">{m.headcount}</td>
                      <td className="p-3 text-center font-bold text-indigo-700">{m.avgProficiency}%</td>
                      <td className="p-3 text-center">{m.completionRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="font-bold text-slate-900 text-sm">Recommended Intervention Strategy</div>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Mandate 12 hours of Python for Survey Microdata via iGOT Karmayogi for all FOD inspectors.</li>
              <li>Schedule NSSTA regional residential bootcamps for SDG Indicator Framework verification.</li>
              <li>Accelerate 84 Subordinate Statistical Service officers for Assistant Director promotion benchmark.</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">Authenticated by NSSTA Capacity Building Division</span>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownloadCSV}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 border border-slate-200 hover:bg-white text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
