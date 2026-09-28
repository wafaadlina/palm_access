import { useState } from 'react';
import { Tractor, Microscope } from 'lucide-react';

export default function OnboardingScreen() {
  const [selectedRole, setSelectedRole] = useState<'field' | 'research' | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    employeeId: 'EMP-2026-0847',
    department: '',
    shift: ''
  });
  const [showToast, setShowToast] = useState(false);

  const handleEnroll = () => {
    if (formData.fullName && selectedRole) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <div className="p-8 max-w-5xl">
      <h2 className="text-2xl font-semibold mb-6">New Employee Onboarding</h2>

      <div className="bg-white rounded-xl border border-[#e5e5e5] p-8">
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-[#3a3a3a] mb-2">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-3 border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2666BE]"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3a3a3a] mb-2">Employee ID</label>
            <input
              type="text"
              value={formData.employeeId}
              disabled
              className="w-full px-4 py-3 border border-[#e5e5e5] rounded-lg bg-[#f7f9fa] text-[#8a8a8a]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3a3a3a] mb-2">Department</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-4 py-3 border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2666BE]"
            >
              <option value="">Select department</option>
              <option value="plantation">Plantation Operations</option>
              <option value="research">Research & Development</option>
              <option value="admin">Administration</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3a3a3a] mb-2">Shift</label>
            <select
              value={formData.shift}
              onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
              className="w-full px-4 py-3 border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2666BE]"
            >
              <option value="">Select shift</option>
              <option value="morning">Morning (6:00 AM - 2:00 PM)</option>
              <option value="afternoon">Afternoon (2:00 PM - 10:00 PM)</option>
              <option value="night">Night (10:00 PM - 6:00 AM)</option>
            </select>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Select Role & Access Level</h3>
          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={() => setSelectedRole('field')}
              className={`p-6 rounded-xl border-2 transition-all ${
                selectedRole === 'field'
                  ? 'border-[#F3BF3A] bg-[#fdf6e2]'
                  : 'border-[#e5e5e5] hover:border-[#d0d0d0]'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  selectedRole === 'field' ? 'bg-[#F3BF3A]' : 'bg-[#f7f9fa]'
                }`}>
                  <Tractor className="w-8 h-8 text-[#3a3a3a]" />
                </div>
                <h4 className="font-semibold mb-2">Field Worker</h4>
                <p className="text-sm text-[#8a8a8a]">Attendance Only</p>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole('research')}
              className={`p-6 rounded-xl border-2 transition-all ${
                selectedRole === 'research'
                  ? 'border-[#F3BF3A] bg-[#fdf6e2]'
                  : 'border-[#e5e5e5] hover:border-[#d0d0d0]'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  selectedRole === 'research' ? 'bg-[#F3BF3A]' : 'bg-[#f7f9fa]'
                }`}>
                  <Microscope className="w-8 h-8 text-[#3a3a3a]" />
                </div>
                <h4 className="font-semibold mb-2">Research Specialist</h4>
                <p className="text-sm text-[#8a8a8a]">Full Lab Access</p>
              </div>
            </button>
          </div>
        </div>

        <button
          onClick={handleEnroll}
          disabled={!formData.fullName || !selectedRole}
          className="w-full bg-[#F3BF3A] text-[#262626] font-semibold py-4 rounded-full hover:bg-[#e0ad2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enrol & Assign Palm
        </button>
      </div>

      {showToast && (
        <div className="fixed top-24 right-8 bg-[#00e4aa] text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-[#00e4aa] rounded-full"></div>
          </div>
          <span className="font-medium">{formData.fullName} enrolled. Palm role assigned.</span>
        </div>
      )}
    </div>
  );
}
