import { useState } from 'react';
import { Plus, Search, X, Clock, Shield, Trash2, Edit2, User, Users } from 'lucide-react';

// --- Types ---
type StaffRole = 'Manager' | 'Supervisor' | 'Field Worker' | 'Security' | 'IT' | 'Admin Staff';
type VisitorType = 'Business' | 'Contractor' | 'Personal' | 'Delivery';

type Preset = {
  id: string;
  name: string;
  role: StaffRole;
  allowedDoors: string[];
  shift: string;
  color: string;
};

type StaffMember = {
  id: string;
  name: string;
  employeeId: string;
  role: StaffRole;
  department: string;
  preset: string;
  status: 'active' | 'inactive';
  joinDate: string;
};

type Visitor = {
  id: string;
  name: string;
  email: string;
  company: string;
  type: VisitorType;
  allowedDoors: string[];
  accessFrom: string;
  accessTo: string;
  timeIn: string;
  timeOut: string;
  status: 'upcoming' | 'active' | 'expired';
};

// --- Mock data ---
const ALL_DOORS = [
  'Main Entrance', 'Visitor Lobby', 'Floor 2 East', 'Floor 1 West',
  'Server Room', 'Meeting Room B', 'Lab Access', 'Chemical Storage',
];

const SHIFTS = ['7:00 AM – 3:00 PM', '3:00 PM – 11:00 PM', '11:00 PM – 7:00 AM', '8:00 AM – 5:00 PM', 'Flexible'];

const PRESET_COLORS = ['#F3BF3A', '#2666BE', '#27AE60', '#9B59B6', '#E74C3C', '#F39C12'];

const initialPresets: Preset[] = [
  { id: 'p1', name: 'Manager Access', role: 'Manager', allowedDoors: ['Main Entrance', 'Floor 2 East', 'Floor 1 West', 'Meeting Room B'], shift: '8:00 AM – 5:00 PM', color: '#2666BE' },
  { id: 'p2', name: 'Field Worker', role: 'Field Worker', allowedDoors: ['Main Entrance', 'Floor 1 West'], shift: '7:00 AM – 3:00 PM', color: '#27AE60' },
  { id: 'p3', name: 'IT Full Access', role: 'IT', allowedDoors: ['Main Entrance', 'Server Room', 'Lab Access', 'Floor 2 East'], shift: '8:00 AM – 5:00 PM', color: '#9B59B6' },
  { id: 'p4', name: 'Security Round', role: 'Security', allowedDoors: ALL_DOORS, shift: '11:00 PM – 7:00 AM', color: '#E74C3C' },
];

const initialStaff: StaffMember[] = [
  { id: 's1', name: 'Ahmad Faizal', employeeId: 'E001', role: 'Security', department: 'Security', preset: 'p4', status: 'active', joinDate: '2024-03-01' },
  { id: 's2', name: 'Siti Nurhaliza', employeeId: 'E002', role: 'IT', department: 'IT', preset: 'p3', status: 'active', joinDate: '2024-05-15' },
  { id: 's3', name: 'Rajesh Kumar', employeeId: 'E003', role: 'Manager', department: 'HR', preset: 'p1', status: 'active', joinDate: '2023-11-20' },
  { id: 's4', name: 'Nurul Ain', employeeId: 'E004', role: 'Admin Staff', department: 'Finance', preset: 'p1', status: 'active', joinDate: '2024-01-10' },
  { id: 's5', name: 'Lim Wei Jian', employeeId: 'E006', role: 'IT', department: 'Engineering', preset: 'p3', status: 'active', joinDate: '2024-07-01' },
  { id: 's6', name: 'Muhammad Hafiz', employeeId: 'E005', role: 'Field Worker', department: 'Operations', preset: 'p2', status: 'inactive', joinDate: '2023-09-15' },
];

const initialVisitors: Visitor[] = [
  { id: 'v1', name: 'David Tan', email: 'david@example.com', company: 'Tech Corp', type: 'Business', allowedDoors: ['Visitor Lobby', 'Meeting Room B'], accessFrom: '2026-09-07', accessTo: '2026-09-07', timeIn: '09:00', timeOut: '17:00', status: 'active' },
  { id: 'v2', name: 'Sarah Wong', email: 'sarah@example.com', company: 'Audit Firm', type: 'Business', allowedDoors: ['Visitor Lobby', 'Floor 1 West'], accessFrom: '2026-09-07', accessTo: '2026-09-10', timeIn: '08:00', timeOut: '18:00', status: 'active' },
  { id: 'v3', name: 'Raj Patel', email: 'raj@contractor.com', company: 'MainTech', type: 'Contractor', allowedDoors: ['Main Entrance', 'Server Room'], accessFrom: '2026-09-08', accessTo: '2026-09-15', timeIn: '07:00', timeOut: '19:00', status: 'upcoming' },
  { id: 'v4', name: 'Emily Chen', email: 'emily@example.com', company: '', type: 'Personal', allowedDoors: ['Visitor Lobby'], accessFrom: '2026-09-01', accessTo: '2026-09-06', timeIn: '10:00', timeOut: '16:00', status: 'expired' },
];

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    active: { label: 'Active', className: 'text-[#27AE60] bg-[#e8f8ef]' },
    inactive: { label: 'Inactive', className: 'text-[#8a8a8a] bg-[#f0f0f0]' },
    upcoming: { label: 'Upcoming', className: 'text-[#2666BE] bg-[#e6f2ff]' },
    expired: { label: 'Expired', className: 'text-[#E74C3C] bg-[#fdecea]' },
  };
  const c = config[status] ?? { label: status, className: 'text-[#636363] bg-[#f0f0f0]' };
  return <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${c.className}`} style={{ fontFamily: "'Poppins', sans-serif" }}>{c.label}</span>;
}

// --- Staff Invite Modal ---
function InviteStaffModal({ presets, onClose }: { presets: Preset[]; onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [empId, setEmpId] = useState('');
  const [dept, setDept] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('');
  const [shift, setShift] = useState('');
  const [role, setRole] = useState<StaffRole>('Field Worker');

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[16px] font-semibold text-[#3a3a3a]" style={{ fontFamily: "'Poppins', sans-serif" }}>Invite Staff</h2>
            <p className="text-[12px] text-[#8a8a8a] mt-0.5">Add a new employee to this site</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-[#f0f0f0] flex items-center justify-center">
            <X className="w-4 h-4 text-[#636363]" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium text-[#636363] mb-1.5 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Full Name *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Ahmad Roslan" className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-xl text-[13px] outline-none focus:border-[#F3BF3A]" style={{ fontFamily: "'Poppins', sans-serif" }} />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#636363] mb-1.5 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Employee ID</label>
              <input value={empId} onChange={e => setEmpId(e.target.value)} placeholder="E009" className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-xl text-[13px] outline-none focus:border-[#F3BF3A]" style={{ fontFamily: "'Poppins', sans-serif" }} />
            </div>
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#636363] mb-1.5 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Email Address *</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="employee@site.com" type="email" className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-xl text-[13px] outline-none focus:border-[#F3BF3A]" style={{ fontFamily: "'Poppins', sans-serif" }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium text-[#636363] mb-1.5 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Role / Position *</label>
              <select value={role} onChange={e => setRole(e.target.value as StaffRole)} className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-xl text-[13px] outline-none focus:border-[#F3BF3A] bg-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {(['Manager', 'Supervisor', 'Field Worker', 'Security', 'IT', 'Admin Staff'] as StaffRole[]).map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#636363] mb-1.5 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Department</label>
              <input value={dept} onChange={e => setDept(e.target.value)} placeholder="e.g. Operations" className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-xl text-[13px] outline-none focus:border-[#F3BF3A]" style={{ fontFamily: "'Poppins', sans-serif" }} />
            </div>
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#636363] mb-2 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Access Preset *</label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPreset(p.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${selectedPreset === p.id ? 'border-[#F3BF3A] bg-[#fdf6e2]' : 'border-[#e5e5e5] hover:border-[#d0d0d0]'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                    <p className="text-[12px] font-semibold text-[#3a3a3a]" style={{ fontFamily: "'Poppins', sans-serif" }}>{p.name}</p>
                  </div>
                  <p className="text-[10px] text-[#8a8a8a]" style={{ fontFamily: "'Poppins', sans-serif" }}>{p.role} · {p.allowedDoors.length} doors</p>
                  <p className="text-[10px] text-[#8a8a8a]" style={{ fontFamily: "'Poppins', sans-serif" }}>{p.shift}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#636363] mb-2 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Override Shift (optional)</label>
            <div className="flex flex-wrap gap-2">
              {SHIFTS.map(s => (
                <button
                  key={s}
                  onClick={() => setShift(shift === s ? '' : s)}
                  className={`px-3 py-1.5 rounded-full text-[11px] border transition-colors ${shift === s ? 'bg-[#fdf6e2] border-[#F3BF3A] text-[#3a3a3a] font-medium' : 'border-[#e5e5e5] text-[#636363] hover:bg-[#f7f9fa]'}`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-full border border-[#e5e5e5] text-[13px] text-[#636363] hover:bg-[#f7f9fa] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>Cancel</button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-full bg-[#F3BF3A] hover:bg-[#e0ae2a] text-[#3a3a3a] font-semibold text-[13px] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>Send Invite</button>
        </div>
      </div>
    </div>
  );
}

// --- Visitor Invite Modal ---
function InviteVisitorModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [type, setType] = useState<VisitorType>('Business');
  const [selectedDoors, setSelectedDoors] = useState<string[]>(['Visitor Lobby']);
  const [fromDate, setFromDate] = useState('2026-09-08');
  const [toDate, setToDate] = useState('2026-09-08');
  const [timeIn, setTimeIn] = useState('09:00');
  const [timeOut, setTimeOut] = useState('17:00');

  function toggleDoor(door: string) {
    setSelectedDoors(prev => prev.includes(door) ? prev.filter(d => d !== door) : [...prev, door]);
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[16px] font-semibold text-[#3a3a3a]" style={{ fontFamily: "'Poppins', sans-serif" }}>Invite Visitor</h2>
            <p className="text-[12px] text-[#8a8a8a] mt-0.5">Grant temporary access to a visitor</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-[#f0f0f0] flex items-center justify-center">
            <X className="w-4 h-4 text-[#636363]" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium text-[#636363] mb-1.5 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Full Name *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="John Smith" className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-xl text-[13px] outline-none focus:border-[#F3BF3A]" style={{ fontFamily: "'Poppins', sans-serif" }} />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#636363] mb-1.5 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Visit Type</label>
              <select value={type} onChange={e => setType(e.target.value as VisitorType)} className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-xl text-[13px] outline-none focus:border-[#F3BF3A] bg-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {(['Business', 'Contractor', 'Personal', 'Delivery'] as VisitorType[]).map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#636363] mb-1.5 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Email Address *</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="visitor@example.com" type="email" className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-xl text-[13px] outline-none focus:border-[#F3BF3A]" style={{ fontFamily: "'Poppins', sans-serif" }} />
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#636363] mb-1.5 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Company / Organization</label>
            <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Optional" className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-xl text-[13px] outline-none focus:border-[#F3BF3A]" style={{ fontFamily: "'Poppins', sans-serif" }} />
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#636363] mb-2 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Permitted Doors *</label>
            <div className="flex flex-wrap gap-2">
              {ALL_DOORS.map(door => (
                <button
                  key={door}
                  onClick={() => toggleDoor(door)}
                  className={`px-3 py-1.5 rounded-full text-[11px] border transition-all ${selectedDoors.includes(door) ? 'bg-[#fdf6e2] border-[#F3BF3A] text-[#3a3a3a] font-medium' : 'border-[#e5e5e5] text-[#636363] hover:bg-[#f7f9fa]'}`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {selectedDoors.includes(door) && <span className="mr-1">✓</span>}{door}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#636363] mb-2 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Access Dates *</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-[#8a8a8a] mb-1 block" style={{ fontFamily: "'Poppins', sans-serif" }}>From</label>
                <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-xl text-[13px] outline-none focus:border-[#F3BF3A]" style={{ fontFamily: "'Poppins', sans-serif" }} />
              </div>
              <div>
                <label className="text-[11px] text-[#8a8a8a] mb-1 block" style={{ fontFamily: "'Poppins', sans-serif" }}>To</label>
                <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-xl text-[13px] outline-none focus:border-[#F3BF3A]" style={{ fontFamily: "'Poppins', sans-serif" }} />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#636363] mb-2 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Permitted Time Window *</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-[#8a8a8a] mb-1 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Entry from</label>
                <input type="time" value={timeIn} onChange={e => setTimeIn(e.target.value)} className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-xl text-[13px] outline-none focus:border-[#F3BF3A]" style={{ fontFamily: "'Poppins', sans-serif" }} />
              </div>
              <div>
                <label className="text-[11px] text-[#8a8a8a] mb-1 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Exit by</label>
                <input type="time" value={timeOut} onChange={e => setTimeOut(e.target.value)} className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-xl text-[13px] outline-none focus:border-[#F3BF3A]" style={{ fontFamily: "'Poppins', sans-serif" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-full border border-[#e5e5e5] text-[13px] text-[#636363] hover:bg-[#f7f9fa] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>Cancel</button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-full bg-[#F3BF3A] hover:bg-[#e0ae2a] text-[#3a3a3a] font-semibold text-[13px] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>Send Invite</button>
        </div>
      </div>
    </div>
  );
}

// --- Preset Modal ---
function CreatePresetModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState<StaffRole>('Field Worker');
  const [selectedDoors, setSelectedDoors] = useState<string[]>([]);
  const [shift, setShift] = useState('');
  const [colorIdx, setColorIdx] = useState(0);

  function toggleDoor(door: string) {
    setSelectedDoors(prev => prev.includes(door) ? prev.filter(d => d !== door) : [...prev, door]);
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[16px] font-semibold text-[#3a3a3a]" style={{ fontFamily: "'Poppins', sans-serif" }}>Create Access Preset</h2>
            <p className="text-[12px] text-[#8a8a8a] mt-0.5">Define a reusable access configuration</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-[#f0f0f0] flex items-center justify-center">
            <X className="w-4 h-4 text-[#636363]" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium text-[#636363] mb-1.5 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Preset Name *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Supervisor Access" className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-xl text-[13px] outline-none focus:border-[#F3BF3A]" style={{ fontFamily: "'Poppins', sans-serif" }} />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#636363] mb-1.5 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Staff Role</label>
              <select value={role} onChange={e => setRole(e.target.value as StaffRole)} className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-xl text-[13px] outline-none focus:border-[#F3BF3A] bg-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {(['Manager', 'Supervisor', 'Field Worker', 'Security', 'IT', 'Admin Staff'] as StaffRole[]).map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#636363] mb-2 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Preset Color</label>
            <div className="flex gap-2">
              {PRESET_COLORS.map((c, i) => (
                <button key={c} onClick={() => setColorIdx(i)} className={`w-8 h-8 rounded-full border-3 transition-all ${colorIdx === i ? 'scale-110 border-[#3a3a3a]' : 'border-transparent'}`} style={{ backgroundColor: c, borderWidth: '2px', borderColor: colorIdx === i ? '#3a3a3a' : 'transparent' }} />
              ))}
            </div>
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#636363] mb-2 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Allowed Doors</label>
            <div className="flex flex-wrap gap-2">
              {ALL_DOORS.map(door => (
                <button
                  key={door}
                  onClick={() => toggleDoor(door)}
                  className={`px-3 py-1.5 rounded-full text-[11px] border transition-all ${selectedDoors.includes(door) ? 'bg-[#fdf6e2] border-[#F3BF3A] text-[#3a3a3a] font-medium' : 'border-[#e5e5e5] text-[#636363] hover:bg-[#f7f9fa]'}`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {selectedDoors.includes(door) && <span className="mr-1">✓</span>}{door}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#636363] mb-2 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Default Shift</label>
            <div className="flex flex-wrap gap-2">
              {SHIFTS.map(s => (
                <button
                  key={s}
                  onClick={() => setShift(shift === s ? '' : s)}
                  className={`px-3 py-1.5 rounded-full text-[11px] border transition-colors ${shift === s ? 'bg-[#fdf6e2] border-[#F3BF3A] text-[#3a3a3a] font-medium' : 'border-[#e5e5e5] text-[#636363] hover:bg-[#f7f9fa]'}`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-full border border-[#e5e5e5] text-[13px] text-[#636363] hover:bg-[#f7f9fa] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>Cancel</button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-full bg-[#F3BF3A] hover:bg-[#e0ae2a] text-[#3a3a3a] font-semibold text-[13px] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>Create Preset</button>
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---
export default function SiteStaffPage() {
  const [tab, setTab] = useState<'staff' | 'visitors' | 'presets'>('staff');
  const [search, setSearch] = useState('');
  const [presets, setPresets] = useState<Preset[]>(initialPresets);
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [visitors, setVisitors] = useState<Visitor[]>(initialVisitors);
  const [inviteStaffOpen, setInviteStaffOpen] = useState(false);
  const [inviteVisitorOpen, setInviteVisitorOpen] = useState(false);
  const [createPresetOpen, setCreatePresetOpen] = useState(false);

  const filteredStaff = staff.filter(s => search === '' || s.name.toLowerCase().includes(search.toLowerCase()));
  const filteredVisitors = visitors.filter(v => search === '' || v.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-8 pt-6 pb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-[#f0f0f0] rounded-full p-1">
          {([
            { key: 'staff', label: 'Staff', icon: User },
            { key: 'visitors', label: 'Visitors', icon: Users },
            { key: 'presets', label: 'Access Presets', icon: Shield },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setSearch(''); }}
              className={`flex items-center gap-2 px-5 py-1.5 rounded-full text-[13px] font-medium transition-colors ${tab === key ? 'bg-white text-[#3a3a3a] shadow-sm' : 'text-[#636363] hover:text-[#3a3a3a]'}`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <Icon className="w-3.5 h-3.5" />{label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {tab !== 'presets' && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8a8a]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search name..."
                className="pl-9 pr-4 py-2 bg-white border border-[#e5e5e5] rounded-full text-[13px] w-[200px] outline-none focus:border-[#F3BF3A]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </div>
          )}
          {tab === 'staff' && (
            <button onClick={() => setInviteStaffOpen(true)} className="flex items-center gap-2 bg-[#F3BF3A] hover:bg-[#e0ae2a] text-[#3a3a3a] font-semibold text-[13px] px-5 py-2 rounded-full transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <Plus className="w-4 h-4" /> Invite Staff
            </button>
          )}
          {tab === 'visitors' && (
            <button onClick={() => setInviteVisitorOpen(true)} className="flex items-center gap-2 bg-[#F3BF3A] hover:bg-[#e0ae2a] text-[#3a3a3a] font-semibold text-[13px] px-5 py-2 rounded-full transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <Plus className="w-4 h-4" /> Invite Visitor
            </button>
          )}
          {tab === 'presets' && (
            <button onClick={() => setCreatePresetOpen(true)} className="flex items-center gap-2 bg-[#F3BF3A] hover:bg-[#e0ae2a] text-[#3a3a3a] font-semibold text-[13px] px-5 py-2 rounded-full transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <Plus className="w-4 h-4" /> Create Preset
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-8">
        {tab === 'staff' && (
          <div className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden">
            <div className="grid grid-cols-[1fr_100px_120px_160px_80px_60px] bg-[#fafafa] px-6 py-3 border-b border-[#f0f0f0]">
              {['Name', 'ID', 'Role', 'Access Preset', 'Status', ''].map(h => (
                <span key={h} className="text-[10px] font-semibold text-[#8a8a8a] uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>{h}</span>
              ))}
            </div>
            {filteredStaff.map(member => {
              const preset = presets.find(p => p.id === member.preset);
              return (
                <div key={member.id} className="grid grid-cols-[1fr_100px_120px_160px_80px_60px] px-6 py-4 border-b border-[#f0f0f0] last:border-0 hover:bg-[#f9f9f9]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F3BF3A]/20 flex items-center justify-center text-[11px] font-bold shrink-0">
                      {member.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[#3a3a3a]" style={{ fontFamily: "'Poppins', sans-serif" }}>{member.name}</p>
                      <p className="text-[11px] text-[#8a8a8a]">{member.department}</p>
                    </div>
                  </div>
                  <span className="text-[12px] text-[#636363] flex items-center" style={{ fontFamily: "'Poppins', sans-serif" }}>{member.employeeId}</span>
                  <span className="text-[12px] text-[#636363] flex items-center" style={{ fontFamily: "'Poppins', sans-serif" }}>{member.role}</span>
                  <div className="flex items-center">
                    {preset ? (
                      <span className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: preset.color + '20', color: preset.color, fontFamily: "'Poppins', sans-serif" }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: preset.color }} />
                        {preset.name}
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#8a8a8a]">No preset</span>
                    )}
                  </div>
                  <div className="flex items-center"><StatusBadge status={member.status} /></div>
                  <div className="flex items-center gap-1">
                    <button className="w-7 h-7 rounded-full hover:bg-[#f0f0f0] flex items-center justify-center"><Edit2 className="w-3.5 h-3.5 text-[#8a8a8a]" /></button>
                    <button onClick={() => setStaff(prev => prev.filter(s => s.id !== member.id))} className="w-7 h-7 rounded-full hover:bg-[#fdecea] flex items-center justify-center group">
                      <Trash2 className="w-3.5 h-3.5 text-[#c0c0c0] group-hover:text-[#E74C3C]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'visitors' && (
          <div className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden">
            <div className="grid grid-cols-[1fr_120px_180px_140px_80px_60px] bg-[#fafafa] px-6 py-3 border-b border-[#f0f0f0]">
              {['Visitor', 'Type', 'Doors', 'Access Window', 'Status', ''].map(h => (
                <span key={h} className="text-[10px] font-semibold text-[#8a8a8a] uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>{h}</span>
              ))}
            </div>
            {filteredVisitors.map(v => (
              <div key={v.id} className="grid grid-cols-[1fr_120px_180px_140px_80px_60px] px-6 py-4 border-b border-[#f0f0f0] last:border-0 hover:bg-[#f9f9f9]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#2666BE]/10 flex items-center justify-center text-[11px] font-bold text-[#2666BE] shrink-0">
                    {v.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-[#3a3a3a]" style={{ fontFamily: "'Poppins', sans-serif" }}>{v.name}</p>
                    <p className="text-[11px] text-[#8a8a8a]">{v.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-[11px] font-medium text-[#636363] bg-[#f0f0f0] px-2 py-0.5 rounded-full" style={{ fontFamily: "'Poppins', sans-serif" }}>{v.type}</span>
                </div>
                <div className="flex items-center flex-wrap gap-1">
                  {v.allowedDoors.slice(0, 2).map(d => (
                    <span key={d} className="text-[10px] text-[#2666BE] bg-[#e6f2ff] px-2 py-0.5 rounded-full" style={{ fontFamily: "'Poppins', sans-serif" }}>{d}</span>
                  ))}
                  {v.allowedDoors.length > 2 && (
                    <span className="text-[10px] text-[#8a8a8a] bg-[#f0f0f0] px-2 py-0.5 rounded-full">+{v.allowedDoors.length - 2}</span>
                  )}
                </div>
                <div className="flex flex-col justify-center text-[11px] text-[#636363]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <span>{v.accessFrom === v.accessTo ? v.accessFrom : `${v.accessFrom} – ${v.accessTo}`}</span>
                  <span className="text-[#8a8a8a]">{v.timeIn} – {v.timeOut}</span>
                </div>
                <div className="flex items-center"><StatusBadge status={v.status} /></div>
                <div className="flex items-center gap-1">
                  <button className="w-7 h-7 rounded-full hover:bg-[#f0f0f0] flex items-center justify-center"><Edit2 className="w-3.5 h-3.5 text-[#8a8a8a]" /></button>
                  <button onClick={() => setVisitors(prev => prev.filter(x => x.id !== v.id))} className="w-7 h-7 rounded-full hover:bg-[#fdecea] flex items-center justify-center group">
                    <Trash2 className="w-3.5 h-3.5 text-[#c0c0c0] group-hover:text-[#E74C3C]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'presets' && (
          <div className="grid grid-cols-2 gap-4">
            {presets.map(preset => (
              <div key={preset.id} className="bg-white rounded-2xl border border-[#e5e5e5] p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: preset.color + '20' }}>
                      <Shield className="w-5 h-5" style={{ color: preset.color }} />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#3a3a3a]" style={{ fontFamily: "'Poppins', sans-serif" }}>{preset.name}</p>
                      <p className="text-[11px] text-[#8a8a8a]">{preset.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="w-7 h-7 rounded-full hover:bg-[#f0f0f0] flex items-center justify-center"><Edit2 className="w-3.5 h-3.5 text-[#8a8a8a]" /></button>
                    <button onClick={() => setPresets(prev => prev.filter(p => p.id !== preset.id))} className="w-7 h-7 rounded-full hover:bg-[#fdecea] flex items-center justify-center group">
                      <Trash2 className="w-3.5 h-3.5 text-[#c0c0c0] group-hover:text-[#E74C3C]" />
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-[11px] font-medium text-[#8a8a8a] mb-1.5" style={{ fontFamily: "'Poppins', sans-serif" }}>Allowed Doors</p>
                  <div className="flex flex-wrap gap-1.5">
                    {preset.allowedDoors.map(d => (
                      <span key={d} className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: preset.color + '15', color: preset.color, fontFamily: "'Poppins', sans-serif" }}>{d}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-[#636363]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <Clock className="w-3.5 h-3.5 text-[#8a8a8a]" />
                  <span>{preset.shift}</span>
                </div>

                <div className="mt-3 pt-3 border-t border-[#f0f0f0] flex items-center justify-between">
                  <span className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {staff.filter(s => s.preset === preset.id).length} staff using this preset
                  </span>
                  <div className="flex -space-x-1">
                    {staff.filter(s => s.preset === preset.id).slice(0, 3).map(s => (
                      <div key={s.id} className="w-5 h-5 rounded-full border border-white bg-[#F3BF3A] flex items-center justify-center text-[8px] font-bold text-white">
                        {s.name[0]}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {inviteStaffOpen && <InviteStaffModal presets={presets} onClose={() => setInviteStaffOpen(false)} />}
      {inviteVisitorOpen && <InviteVisitorModal onClose={() => setInviteVisitorOpen(false)} />}
      {createPresetOpen && <CreatePresetModal onClose={() => setCreatePresetOpen(false)} />}
    </div>
  );
}
