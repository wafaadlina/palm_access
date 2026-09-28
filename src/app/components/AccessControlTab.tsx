import { useState } from 'react';
import { Users, UserCheck, Settings, Trash2, CheckCircle } from 'lucide-react';
import ManageAccessModal from './ManageAccessModal';

interface StaffAccess {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  role: 'field' | 'research';
  assignedDoors: string[];
}

export default function AccessControlTab() {
  const [showManageTable, setShowManageTable] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffAccess | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [staffList, setStaffList] = useState<StaffAccess[]>([
    {
      id: '1',
      name: 'Ahmad bin Hassan',
      employeeId: 'EMP-2026-0123',
      department: 'Plantation Operations',
      role: 'field',
      assignedDoors: ['Receptionist Building 1', 'Receptionist Building 2']
    },
    {
      id: '2',
      name: 'Dr. Sarah Chen',
      employeeId: 'EMP-2026-0087',
      department: 'Research & Development',
      role: 'research',
      assignedDoors: ['Receptionist Building 1', 'Receptionist Building 2', 'Pollen Lab', 'Bio-allergic Area', 'Germination Room 2', 'Cold Room 2', 'Cold Room 3', 'Heat Chamber 3', 'Heat Chamber 4', 'Heat Chamber 5']
    },
    {
      id: '3',
      name: 'Siti Aminah',
      employeeId: 'EMP-2026-0234',
      department: 'Plantation Operations',
      role: 'field',
      assignedDoors: ['Receptionist Building 1', 'Receptionist Building 2']
    },
    {
      id: '4',
      name: 'Kumar Raj',
      employeeId: 'EMP-2026-0156',
      department: 'Maintenance',
      role: 'field',
      assignedDoors: ['Receptionist Building 1', 'Receptionist Building 2']
    },
    {
      id: '5',
      name: 'Dr. Michael Wong',
      employeeId: 'EMP-2026-0091',
      department: 'Research & Development',
      role: 'research',
      assignedDoors: ['Receptionist Building 1', 'Receptionist Building 2', 'Pollen Lab', 'Bio-allergic Area', 'Germination Room 2', 'Cold Room 2', 'Cold Room 3', 'Heat Chamber 3', 'Heat Chamber 4', 'Heat Chamber 5']
    },
    {
      id: '6',
      name: 'Fatimah Zahra',
      employeeId: 'EMP-2026-0198',
      department: 'Plantation Operations',
      role: 'field',
      assignedDoors: ['Receptionist Building 1', 'Receptionist Building 2']
    },
    {
      id: '7',
      name: 'Dr. Priya Sharma',
      employeeId: 'EMP-2026-0102',
      department: 'Research & Development',
      role: 'research',
      assignedDoors: ['Receptionist Building 1', 'Receptionist Building 2', 'Pollen Lab', 'Bio-allergic Area', 'Germination Room 2', 'Cold Room 2', 'Cold Room 3', 'Heat Chamber 3', 'Heat Chamber 4', 'Heat Chamber 5']
    },
    {
      id: '8',
      name: 'Li Wei',
      employeeId: 'EMP-2026-0167',
      department: 'Plantation Operations',
      role: 'field',
      assignedDoors: ['Receptionist Building 1', 'Receptionist Building 2']
    },
  ]);

  const totalStaff = staffList.length;
  const fieldWorkers = staffList.filter(s => s.role === 'field').length;
  const researchSpecialists = staffList.filter(s => s.role === 'research').length;

  const handleManageAccess = (staff: StaffAccess) => {
    setSelectedStaff(staff);
    setIsManageModalOpen(true);
  };

  const handleSaveAccess = (staffId: string, role: 'field' | 'research', assignedDoors: string[]) => {
    const staff = staffList.find(s => s.id === staffId);
    setStaffList(staffList.map(staff =>
      staff.id === staffId
        ? { ...staff, role, assignedDoors }
        : staff
    ));

    // Show success toast
    setToastMessage(`Access role updated successfully for ${staff?.name}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleRemoveStaff = (staffId: string) => {
    if (confirm('Are you sure you want to remove this staff member from the access control system?')) {
      setStaffList(staffList.filter(staff => staff.id !== staffId));
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-[#3a3a3a] mb-6">Access Control Management</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-[#e5e5e5] p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#f7f9fa] rounded-full flex items-center justify-center">
              <Users className="w-7 h-7 text-[#2666BE]" />
            </div>
            <div>
              <p className="text-sm text-[#8a8a8a] mb-1">Total Staff</p>
              <p className="text-3xl font-semibold text-[#3a3a3a]">{totalStaff}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e5e5e5] p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#fff8e6] rounded-full flex items-center justify-center">
              <UserCheck className="w-7 h-7 text-[#F3BF3A]" />
            </div>
            <div>
              <p className="text-sm text-[#8a8a8a] mb-1">Field Workers</p>
              <p className="text-3xl font-semibold text-[#F3BF3A]">{fieldWorkers}</p>
              <p className="text-xs text-[#8a8a8a] mt-1">Receptionist Buildings access</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e5e5e5] p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#e6f2ff] rounded-full flex items-center justify-center">
              <Settings className="w-7 h-7 text-[#2666BE]" />
            </div>
            <div>
              <p className="text-sm text-[#8a8a8a] mb-1">Research Specialists</p>
              <p className="text-3xl font-semibold text-[#2666BE]">{researchSpecialists}</p>
              <p className="text-xs text-[#8a8a8a] mt-1">Full lab & chamber access</p>
            </div>
          </div>
        </div>
      </div>

      {/* Manage Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowManageTable(!showManageTable)}
          className="flex items-center gap-2 px-6 py-3 bg-[#2666BE] text-white rounded-full font-medium hover:bg-[#1f5399] transition-colors"
        >
          <Settings className="w-5 h-5" />
          {showManageTable ? 'Hide Management Table' : 'Manage Access'}
        </button>
      </div>

      {/* Management Table */}
      {showManageTable && (
        <div className="bg-white rounded-xl border border-[#e5e5e5] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e5e5e5]">
            <h3 className="text-lg font-semibold text-[#3a3a3a]">Staff Access Management</h3>
            <p className="text-sm text-[#8a8a8a] mt-1">Manage access roles and door assignments for all staff members</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f7f9fa] border-b border-[#e5e5e5]">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#8a8a8a] uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#8a8a8a] uppercase tracking-wider">Access Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#8a8a8a] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5e5]">
                {staffList.map((staff) => (
                  <tr key={staff.id} className="hover:bg-[#f7f9fa] transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-[#3a3a3a]">{staff.name}</div>
                        <div className="text-sm text-[#8a8a8a]">{staff.department}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        staff.role === 'research'
                          ? 'bg-[#e6f2ff] text-[#2666BE]'
                          : 'bg-[#fff8e6] text-[#F3BF3A]'
                      }`}>
                        {staff.role === 'research' ? 'Research Specialist' : 'Field Worker'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleManageAccess(staff)}
                          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-[#2666BE] hover:bg-[#e6f2ff] rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Manage
                        </button>
                        <button
                          onClick={() => handleRemoveStaff(staff.id)}
                          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-[#ff4444] hover:bg-[#ffe6e6] rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white border-t border-[#e5e5e5] px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-[#8a8a8a]">
              Showing {staffList.length} staff members
            </div>
          </div>
        </div>
      )}

      {selectedStaff && (
        <ManageAccessModal
          isOpen={isManageModalOpen}
          onClose={() => {
            setIsManageModalOpen(false);
            setSelectedStaff(null);
          }}
          staff={selectedStaff}
          onSave={handleSaveAccess}
        />
      )}

      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-24 right-8 bg-[#27AE60] text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in z-50">
          <CheckCircle className="w-6 h-6" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
