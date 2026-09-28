import { useState } from 'react';
import { Users, Settings, Trash2, CheckCircle, X, UserPlus } from 'lucide-react';
import KPJInviteModal from './KPJInviteModal';

const ALL_DOORS = [
  'Main Entrance','Ward A Entrance','Ward B Entrance','Ward C Entrance',
  'ICU Corridor','Outpatient Lobby','Pharmacy Counter','Loading Bay',
  'Emergency Bay','Operating Theatre Lobby',
];

interface VisitorAccess {
  id: string;
  name: string;
  phone: string;
  purpose: string;
  palmRegistered: boolean;
  assignedDoors: string[];
  /** 'full' | 'custom' | role-name (e.g. "Scientist") */
  accessRole: string;
  /** ISO date strings, e.g. "2026-06-15" */
  accessStart: string;
  accessEnd: string;
  accessStartTime: string;
  accessEndTime: string;
}

const INITIAL_VISITORS: VisitorAccess[] = [
  { id:'1', name:'Tan Wei Ming',     phone:'601 2345 6789', purpose:'Visiting Patient', palmRegistered:true,  assignedDoors:['Main Entrance','Ward A Entrance'],                          accessRole:'custom', accessStart:'2026-06-15', accessStartTime:'08:00', accessEnd:'2026-06-15', accessEndTime:'20:00' },
  { id:'2', name:'Siti Norfadzilah', phone:'601 9876 5432', purpose:'Outpatient Visit', palmRegistered:true,  assignedDoors:['Main Entrance','Outpatient Lobby','Pharmacy Counter'],        accessRole:'custom', accessStart:'2026-06-15', accessStartTime:'09:00', accessEnd:'2026-06-16', accessEndTime:'17:00' },
  { id:'3', name:'Rajan Pillai',     phone:'601 1122 3344', purpose:'Visiting Patient', palmRegistered:true,  assignedDoors:['Main Entrance','Ward A Entrance'],                          accessRole:'custom', accessStart:'2026-06-16', accessStartTime:'10:00', accessEnd:'2026-06-16', accessEndTime:'18:00' },
  { id:'4', name:'Nurul Ain Hamid',  phone:'601 8899 0011', purpose:'Staff Family',     palmRegistered:true,  assignedDoors:['Main Entrance','Ward B Entrance','Ward A Entrance'],         accessRole:'custom', accessStart:'2026-06-15', accessStartTime:'11:00', accessEnd:'2026-06-15', accessEndTime:'14:00' },
  { id:'5', name:'Chong Kok Fai',    phone:'601 3344 5566', purpose:'Delivery',         palmRegistered:true,  assignedDoors:['Loading Bay'],                                              accessRole:'custom', accessStart:'2026-06-15', accessStartTime:'07:00', accessEnd:'2026-06-15', accessEndTime:'09:00' },
  { id:'6', name:'Faridah Othman',   phone:'601 7766 5544', purpose:'Visiting Patient', palmRegistered:false, assignedDoors:['Main Entrance'],                                            accessRole:'full',   accessStart:'2026-06-17', accessStartTime:'13:00', accessEnd:'2026-06-17', accessEndTime:'19:00' },
  { id:'7', name:'Suresh Kumar',     phone:'601 5544 3322', purpose:'Outpatient Visit', palmRegistered:true,  assignedDoors:['Main Entrance','Outpatient Lobby'],                         accessRole:'custom', accessStart:'2026-06-15', accessStartTime:'15:00', accessEnd:'2026-06-15', accessEndTime:'17:00' },
  { id:'8', name:'Lim Poh Cheng',    phone:'601 2211 0099', purpose:'Staff Family',     palmRegistered:false, assignedDoors:['Main Entrance','Ward A Entrance'],                          accessRole:'custom', accessStart:'2026-06-18', accessStartTime:'09:00', accessEnd:'2026-06-18', accessEndTime:'21:00' },
];

function ManageModal({ visitor, onClose, onSave }: {
  visitor: VisitorAccess;
  onClose: () => void;
  onSave: (id: string, doors: string[], accessRole: string, start: string, startTime: string, end: string, endTime: string) => void;
}) {
  const [selected, setSelected] = useState<string[]>(visitor.assignedDoors);
  const [startDate, setStartDate]   = useState(visitor.accessStart);
  const [startTime, setStartTime]   = useState(visitor.accessStartTime);
  const [endDate, setEndDate]       = useState(visitor.accessEnd);
  const [endTime, setEndTime]       = useState(visitor.accessEndTime);

  const originalDoors = visitor.assignedDoors;
  const originalRole  = visitor.accessRole;

  const isModified = (
    selected.length !== originalDoors.length ||
    selected.some(d => !originalDoors.includes(d))
  );

  const effectiveRole = isModified
    ? (originalRole !== 'full' && originalRole !== 'custom'
        ? `Custom (modified from ${originalRole})`
        : 'custom')
    : originalRole;

  const roleDisplay =
    originalRole === 'full'   ? 'Full Access' :
    originalRole === 'custom' ? 'Custom'       :
    originalRole;

  const headerSubtitle = `${visitor.name} · ${visitor.phone} · ${roleDisplay}`;

  const toggle = (door: string) =>
    setSelected(prev => prev.includes(door) ? prev.filter(d => d !== door) : [...prev, door]);

  const isNamedRole  = originalRole !== 'full' && originalRole !== 'custom';
  const badgeLabel   = isModified && isNamedRole ? `Custom (modified from ${originalRole})` : originalRole === 'full' ? 'Full Access' : originalRole === 'custom' ? 'Custom' : originalRole;
  const badgeBg      = isModified ? '#fff3e0' : isNamedRole ? '#fdf6e2' : '#f0f0f0';
  const badgeText    = isModified ? '#c06000' : isNamedRole ? '#8a5a00' : '#636363';
  const badgeBorder  = isModified ? '#e09020' : isNamedRole ? '#F3BF3A' : '#d0d0d0';

  // Date/time validation
  const startDT = startDate && startTime ? `${startDate}T${startTime}` : startDate;
  const endDT   = endDate   && endTime   ? `${endDate}T${endTime}`     : endDate;
  const dateError = startDT && endDT && endDT <= startDT
    ? 'End date/time must be after start date/time.'
    : null;

  const canSave = !dateError;

  const dtInput = 'w-full px-3 py-2.5 border border-[#e5e5e5] rounded-lg text-sm focus:outline-none focus:border-[#F3BF3A] focus:ring-1 focus:ring-[#F3BF3A] transition-all bg-white';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#e5e5e5] px-8 py-5 flex items-center justify-between rounded-t-xl">
          <div>
            <h2 className="text-lg font-semibold text-[#3a3a3a]">Manage Door Access</h2>
            <p className="text-sm text-[#8a8a8a] mt-0.5">{headerSubtitle}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f7f9fa]">
            <X className="w-5 h-5 text-[#636363]"/>
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Doors section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-[#3a3a3a]">Assigned Doors & Areas</label>
              <span className="text-xs text-[#8a8a8a]">{selected.length} of {ALL_DOORS.length} selected</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
                style={{ background: badgeBg, color: badgeText, borderColor: badgeBorder }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: badgeText }} />
                Role: {badgeLabel}
              </span>
              {isModified && <span className="text-[11px] text-[#8a8a8a]">Doors diverge from original role</span>}
            </div>
            <div className="grid grid-cols-2 gap-3 border border-[#e5e5e5] rounded-lg p-4 bg-[#f7f9fa]">
              {ALL_DOORS.map(door => {
                const checked = selected.includes(door);
                return (
                  <label key={door} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${checked ? 'bg-[#fdf6e2] border-[#F3BF3A]' : 'bg-white border-[#e5e5e5] hover:border-[#F3BF3A]'}`}>
                    <input type="checkbox" checked={checked} onChange={() => toggle(door)} className="w-4 h-4 accent-[#F3BF3A]"/>
                    <span className="text-sm text-[#3a3a3a]">{door}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Access Date & Time */}
          <div>
            <label className="block text-sm font-medium text-[#3a3a3a] mb-3">Access Date & Time</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#8a8a8a] mb-1">Start date</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={dtInput} />
              </div>
              <div>
                <label className="block text-xs text-[#8a8a8a] mb-1">Start time</label>
                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className={dtInput} />
              </div>
              <div>
                <label className="block text-xs text-[#8a8a8a] mb-1">End date</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={dtInput} />
              </div>
              <div>
                <label className="block text-xs text-[#8a8a8a] mb-1">End time</label>
                <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className={dtInput} />
              </div>
            </div>
            {dateError && (
              <p className="mt-2 text-xs text-[#FF4444] flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
                  <circle cx="6" cy="6" r="5.5" stroke="#FF4444"/>
                  <path d="M6 3.5v3M6 8h.01" stroke="#FF4444" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                {dateError}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-end pt-1">
            <button onClick={onClose} className="px-6 py-2.5 border border-[#e5e5e5] rounded-full text-sm font-medium text-[#636363] hover:bg-[#f7f9fa] transition-colors">
              Cancel
            </button>
            <button
              disabled={!canSave}
              onClick={() => { onSave(visitor.id, selected, effectiveRole, startDate, startTime, endDate, endTime); onClose(); }}
              className="px-6 py-2.5 bg-[#F3BF3A] text-[#262626] rounded-full text-sm font-medium hover:bg-[#e0ad2f] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SavedRole { name: string; doors: string[] }

export default function KPJAccessControlTab() {
  const [visitors, setVisitors] = useState<VisitorAccess[]>(INITIAL_VISITORS);
  const [managing, setManaging] = useState<VisitorAccess | null>(null);
  const [showTable, setShowTable] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [savedRoles, setSavedRoles] = useState<SavedRole[]>([]);
  const [toast, setToast] = useState('');

  const handleInviteSave = (data: { emails: string[]; namePurpose: string; groupName: string; doors: string[]; start: string; end: string; accessRole?: string }) => {
    // start/end arrive as "YYYY-MM-DD HH:MM" or just "YYYY-MM-DD"
    const [sd = '', st = ''] = data.start.split(' ');
    const [ed = '', et = ''] = data.end.split(' ');
    const newVisitors: VisitorAccess[] = data.emails.map((email, i) => ({
      id: String(Date.now() + i),
      name: data.namePurpose || email.split('@')[0],
      phone: '—',
      purpose: data.groupName,
      palmRegistered: false,
      assignedDoors: data.doors,
      accessRole: data.accessRole ?? 'custom',
      accessStart: sd,
      accessStartTime: st,
      accessEnd: ed,
      accessEndTime: et,
    }));
    setVisitors(prev => [...prev, ...newVisitors]);
    setToast(`Invitation sent to ${data.emails.length} visitor${data.emails.length !== 1 ? 's' : ''}`);
    setTimeout(() => setToast(''), 3500);
  };

  const handleSave = (id: string, doors: string[], accessRole: string, start: string, startTime: string, end: string, endTime: string) => {
    const v = visitors.find(x => x.id === id);
    setVisitors(visitors.map(x => x.id === id
      ? { ...x, assignedDoors: doors, accessRole, accessStart: start, accessStartTime: startTime, accessEnd: end, accessEndTime: endTime }
      : x
    ));
    setToast(`Access updated for ${v?.name}`);
    setTimeout(() => setToast(''), 3000);
  };

  const handleRemove = (id: string) => {
    const v = visitors.find(x=>x.id===id);
    if (confirm(`Remove ${v?.name} from access control?`)) {
      setVisitors(visitors.filter(x=>x.id!==id));
    }
  };

  const registered = visitors.filter(v=>v.palmRegistered).length;
  const pending = visitors.filter(v=>!v.palmRegistered).length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[#3a3a3a]">Visitor Access Control</h2>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors hover:opacity-90"
          style={{ background: '#F3BF3A', color: '#262626' }}
        >
          <UserPlus className="w-4 h-4" />
          Invite New Visitors
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-[#e5e5e5] p-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-[#e6f2ff] rounded-full flex items-center justify-center">
            <Users className="w-7 h-7 text-[#2666BE]"/>
          </div>
          <div>
            <p className="text-sm text-[#8a8a8a] mb-1">Total Registered Visitors</p>
            <p className="text-3xl font-semibold text-[#3a3a3a]">{visitors.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#e5e5e5] p-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-[#e6f7ed] rounded-full flex items-center justify-center">
            <CheckCircle className="w-7 h-7 text-[#27AE60]"/>
          </div>
          <div>
            <p className="text-sm text-[#8a8a8a] mb-1">Palm Registered</p>
            <p className="text-3xl font-semibold text-[#27AE60]">{registered}</p>
            <p className="text-xs text-[#8a8a8a] mt-1">Active palm scan access</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#e5e5e5] p-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-[#fff8e6] rounded-full flex items-center justify-center">
            <Settings className="w-7 h-7 text-[#F3BF3A]"/>
          </div>
          <div>
            <p className="text-sm text-[#8a8a8a] mb-1">Pending Registration</p>
            <p className="text-3xl font-semibold text-[#F3BF3A]">{pending}</p>
            <p className="text-xs text-[#8a8a8a] mt-1">App sign-up not completed</p>
          </div>
        </div>
      </div>

      {/* Manage button */}
      <div className="mb-6">
        <button
          onClick={()=>setShowTable(!showTable)}
          className="flex items-center gap-2 px-6 py-3 bg-[#2666BE] text-white rounded-full font-medium hover:bg-[#1f5399] transition-colors text-sm"
        >
          <Settings className="w-5 h-5"/>
          {showTable ? 'Hide Management Table' : 'Manage Visitor Access'}
        </button>
      </div>

      {showTable && (
        <div className="bg-white rounded-xl border border-[#e5e5e5] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e5e5e5]">
            <h3 className="text-base font-semibold text-[#3a3a3a]">Visitor Access Management</h3>
            <p className="text-sm text-[#8a8a8a] mt-1">Manage door assignments for visitors registered via the palm scanning app</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f7f9fa] border-b border-[#e5e5e5]">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#8a8a8a] uppercase tracking-wider">Visitor</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#8a8a8a] uppercase tracking-wider">Purpose</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#8a8a8a] uppercase tracking-wider">Palm Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#8a8a8a] uppercase tracking-wider">Assigned Doors</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#8a8a8a] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5e5]">
                {visitors.map(v => (
                  <tr key={v.id} className="hover:bg-[#f7f9fa] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-sm text-[#3a3a3a]">{v.name}</div>
                      <div className="text-xs text-[#8a8a8a]">{v.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#e6f2ff] text-[#2666BE]">{v.purpose}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${v.palmRegistered?'bg-[#e6f7ed] text-[#27AE60]':'bg-[#fff8e6] text-[#e0a000]'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${v.palmRegistered?'bg-[#27AE60]':'bg-[#e0a000]'}`}/>
                        {v.palmRegistered ? 'Registered' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#636363]">{v.assignedDoors.length} door{v.assignedDoors.length!==1?'s':''}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={()=>setManaging(v)} className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#2666BE] hover:bg-[#e6f2ff] rounded-lg transition-colors">
                          <Settings className="w-4 h-4"/>Manage
                        </button>
                        <button onClick={()=>handleRemove(v.id)} className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#FF4444] hover:bg-[#ffe6e6] rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4"/>Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-[#e5e5e5] text-xs text-[#8a8a8a]">
            {visitors.length} visitors · {registered} palm registered
          </div>
        </div>
      )}

      {managing && <ManageModal visitor={managing} onClose={()=>setManaging(null)} onSave={handleSave}/>}

      {showInvite && (
        <KPJInviteModal
          onClose={() => setShowInvite(false)}
          onSave={handleInviteSave}
          savedRoles={savedRoles}
          onCreateRole={role => setSavedRoles(prev => [...prev, role])}
          onDeleteRole={name => setSavedRoles(prev => prev.filter(r => r.name !== name))}
        />
      )}

      {toast && (
        <div className="fixed top-24 right-8 bg-[#27AE60] text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50">
          <CheckCircle className="w-5 h-5"/>
          <span className="font-medium">{toast}</span>
        </div>
      )}
    </div>
  );
}
