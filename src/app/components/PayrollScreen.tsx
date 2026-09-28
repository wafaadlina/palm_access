import { useState } from 'react';
import { FileText, FileSpreadsheet, AlertTriangle } from 'lucide-react';

export default function PayrollScreen() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleExport = (type: 'pdf' | 'excel') => {
    setToastMessage(`${type.toUpperCase()} file downloaded successfully`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const payrollData = [
    { name: 'Ahmad bin Hassan', days: 22, regularHours: 176, otHours: 12, total: 3240, status: 'normal' },
    { name: 'Siti Aminah', days: 20, regularHours: 160, otHours: 8, total: 2960, status: 'warning' },
    { name: 'Kumar Raj', days: 22, regularHours: 176, otHours: 15, total: 3465, status: 'normal' },
    { name: 'Fatimah Zahra', days: 22, regularHours: 176, otHours: 10, total: 3320, status: 'normal' },
    { name: 'Li Wei', days: 18, regularHours: 144, otHours: 4, total: 2640, status: 'warning' },
    { name: 'Raj Kumar', days: 22, regularHours: 176, otHours: 14, total: 3420, status: 'normal' },
  ];

  const totalWorkers = 60;
  const anomaliesCount = 2;
  const totalPayout = 54280;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Payroll Export</h2>

      <div className="bg-white rounded-xl border border-[#e5e5e5] p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4">
            <select className="px-4 py-2 border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2666BE]">
              <option>Genting Tangkak Estate</option>
              <option>Genting Kulai Estate</option>
              <option>Genting Johor Estate</option>
            </select>

            <select className="px-4 py-2 border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2666BE]">
              <option>June 2026</option>
              <option>May 2026</option>
              <option>April 2026</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-2 px-6 py-3 bg-[#2666BE] text-white rounded-full hover:bg-[#1f5399] transition-colors"
            >
              <FileText className="w-5 h-5" />
              Export PDF
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="flex items-center gap-2 px-6 py-3 bg-[#F3BF3A] text-[#262626] rounded-full hover:bg-[#e0ad2f] transition-colors"
            >
              <FileSpreadsheet className="w-5 h-5" />
              Export Excel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-[#f7f9fa] rounded-lg p-6 border border-[#e5e5e5]">
            <p className="text-sm text-[#8a8a8a] mb-2">Total Field Workers</p>
            <p className="text-3xl font-semibold text-[#3a3a3a]">{totalWorkers}</p>
          </div>

          <div className="bg-[#fff8e6] rounded-lg p-6 border border-[#F3BF3A]">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-[#F3BF3A]" />
              <p className="text-sm text-[#8a8a8a]">Anomalies Flagged</p>
            </div>
            <p className="text-3xl font-semibold text-[#F3BF3A]">{anomaliesCount}</p>
          </div>

          <div className="bg-[#e6f2ff] rounded-lg p-6 border border-[#2666BE]">
            <p className="text-sm text-[#8a8a8a] mb-2">Total Payout</p>
            <p className="text-3xl font-semibold text-[#2666BE]">MYR {totalPayout.toLocaleString()}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f7f9fa] border-b border-[#e5e5e5]">
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#8a8a8a]">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#8a8a8a]">Days</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#8a8a8a]">Regular Hours</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#8a8a8a]">OT Hours</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#8a8a8a]">Total (MYR)</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#8a8a8a]">Status</th>
              </tr>
            </thead>
            <tbody>
              {payrollData.map((row, index) => (
                <tr
                  key={index}
                  className={`border-b border-[#e5e5e5] ${
                    row.status === 'warning' ? 'bg-[#fff8e6]' : 'hover:bg-[#f7f9fa]'
                  }`}
                >
                  <td className="px-4 py-4 font-medium text-[#3a3a3a]">{row.name}</td>
                  <td className="px-4 py-4 text-[#3a3a3a]">{row.days}</td>
                  <td className="px-4 py-4 text-[#3a3a3a]">{row.regularHours}</td>
                  <td className="px-4 py-4 text-[#3a3a3a]">{row.otHours}</td>
                  <td className="px-4 py-4 font-semibold text-[#3a3a3a]">{row.total.toLocaleString()}</td>
                  <td className="px-4 py-4">
                    {row.status === 'warning' ? (
                      <div className="flex items-center gap-2 text-[#F3BF3A]">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-medium">Late/Absent</span>
                      </div>
                    ) : (
                      <span className="text-sm text-[#00e4aa] font-medium">Normal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showToast && (
        <div className="fixed top-24 right-8 bg-[#00e4aa] text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-[#00e4aa] rounded-full"></div>
          </div>
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
