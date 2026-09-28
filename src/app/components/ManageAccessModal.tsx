import { useState } from 'react';
import { X } from 'lucide-react';

interface ManageAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: {
    id: string;
    name: string;
    employeeId: string;
    role: 'field' | 'research';
    assignedDoors: string[];
  };
  onSave: (staffId: string, role: 'field' | 'research', assignedDoors: string[]) => void;
}

const ALL_DOORS = [
  'Receptionist Building 1',
  'Receptionist Building 2',
  'Pollen Lab',
  'Bio-allergic Area',
  'Germination Room 2',
  'Cold Room 2',
  'Cold Room 3',
  'Heat Chamber 3',
  'Heat Chamber 4',
  'Heat Chamber 5'
];

export default function ManageAccessModal({ isOpen, onClose, staff, onSave }: ManageAccessModalProps) {
  const [selectedRole, setSelectedRole] = useState<'field' | 'research'>(staff.role);
  const [selectedDoors, setSelectedDoors] = useState<string[]>(
    staff.role === 'research' ? ALL_DOORS : staff.assignedDoors
  );

  const handleRoleChange = (role: 'field' | 'research') => {
    setSelectedRole(role);
    if (role === 'research') {
      setSelectedDoors(ALL_DOORS);
    } else {
      setSelectedDoors(['Receptionist Building 1', 'Receptionist Building 2']);
    }
  };

  const handleToggleDoor = (door: string) => {
    if (selectedDoors.includes(door)) {
      setSelectedDoors(selectedDoors.filter(d => d !== door));
    } else {
      setSelectedDoors([...selectedDoors, door]);
    }
  };

  const handleSave = () => {
    onSave(staff.id, selectedRole, selectedDoors);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-white border-b border-[#e5e5e5] px-8 py-6 flex items-center justify-between rounded-t-xl">
          <div>
            <h2 className="text-xl font-semibold text-[#3a3a3a]">Manage Access</h2>
            <p className="text-sm text-[#8a8a8a] mt-1">{staff.name} ({staff.employeeId})</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f7f9fa] transition-colors"
          >
            <X className="w-5 h-5 text-[#636363]" />
          </button>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#3a3a3a] mb-3">Access Role</label>
            <div className="space-y-3">
              <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedRole === 'field'
                  ? 'border-[#F3BF3A] bg-[#fdf6e2]'
                  : 'border-[#e5e5e5] hover:border-[#F3BF3A]'
              }`}>
                <input
                  type="radio"
                  name="role"
                  checked={selectedRole === 'field'}
                  onChange={() => handleRoleChange('field')}
                  className="mt-1 w-5 h-5 text-[#F3BF3A] border-[#e5e5e5] focus:ring-2 focus:ring-[#F3BF3A]"
                />
                <div>
                  <div className="font-medium text-[#3a3a3a]">Field Worker (Attendance Only)</div>
                  <div className="text-sm text-[#8a8a8a]">Access to Receptionist Buildings only</div>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedRole === 'research'
                  ? 'border-[#F3BF3A] bg-[#fdf6e2]'
                  : 'border-[#e5e5e5] hover:border-[#F3BF3A]'
              }`}>
                <input
                  type="radio"
                  name="role"
                  checked={selectedRole === 'research'}
                  onChange={() => handleRoleChange('research')}
                  className="mt-1 w-5 h-5 text-[#F3BF3A] border-[#e5e5e5] focus:ring-2 focus:ring-[#F3BF3A]"
                />
                <div>
                  <div className="font-medium text-[#3a3a3a]">Research Specialist (Full Lab Access)</div>
                  <div className="text-sm text-[#8a8a8a]">Access to all lab rooms, chambers, and germination areas</div>
                </div>
              </label>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-[#3a3a3a] mb-3">
              Assigned Doors & Areas ({selectedDoors.length} selected)
            </label>
            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto border border-[#e5e5e5] rounded-lg p-4 bg-[#f7f9fa]">
              {ALL_DOORS.map((door) => {
                const isAssigned = selectedDoors.includes(door);
                return (
                  <label
                    key={door}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
                      isAssigned
                        ? 'bg-[#fdf6e2] border border-[#F3BF3A]'
                        : 'bg-white border border-[#e5e5e5] hover:border-[#F3BF3A]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isAssigned}
                      onChange={() => handleToggleDoor(door)}
                      className="w-4 h-4 text-[#F3BF3A] rounded border-[#e5e5e5] focus:ring-2 focus:ring-[#F3BF3A] cursor-pointer"
                    />
                    <span className="text-sm text-[#3a3a3a]">{door}</span>
                  </label>
                );
              })}
            </div>
            <p className="text-xs text-[#8a8a8a] mt-2 flex items-start gap-2">
              <span className="text-[#2666BE] font-semibold">ℹ</span>
              <span>Select which doors and areas this staff member can access. You can customize access permissions for any role.</span>
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-[#e5e5e5] rounded-full font-medium text-[#636363] hover:bg-[#f7f9fa] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-[#F3BF3A] text-[#262626] rounded-full font-medium hover:bg-[#e0ad2f] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
