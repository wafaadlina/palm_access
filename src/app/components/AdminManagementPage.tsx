import { useState } from 'react';
import { Plus, X, Search, MoreHorizontal, CheckCircle, Clock, AlertTriangle, Mail, MapPin } from 'lucide-react';

type AdminStatus = 'active' | 'pending' | 'inactive';

type AdminRecord = {
  id: string;
  name: string;
  email: string;
  site: string;
  siteId: string;
  joinedDate: string;
  status: AdminStatus;
  lastActive: string;
  totalStaff: number;
  totalDevices: number;
};

const SITES_LIST = [
  { id: 's1', name: 'Genting Highland Estate' },
  { id: 's2', name: 'Bentong Processing Plant' },
  { id: 's3', name: 'Ulu Yam Nursery' },
  { id: 's4', name: 'Raub Plantation Hub' },
  { id: 's5', name: 'Slim River Estate' },
];

const initialAdmins: AdminRecord[] = [
  { id: 'a1', name: 'Roslan bin Hamid', email: 'roslan@adnexio.com', site: 'Genting Highland Estate', siteId: 's1', joinedDate: '2025-01-15', status: 'active', lastActive: '2 hours ago', totalStaff: 47, totalDevices: 5 },
  { id: 'a2', name: 'Faridah Othman', email: 'faridah@adnexio.com', site: 'Bentong Processing Plant', siteId: 's2', joinedDate: '2025-03-08', status: 'active', lastActive: '1 day ago', totalStaff: 32, totalDevices: 3 },
  { id: 'a3', name: 'Karim Abdullah', email: 'karim@adnexio.com', site: 'Raub Plantation Hub', siteId: 's4', joinedDate: '2025-06-20', status: 'pending', lastActive: 'Never', totalStaff: 0, totalDevices: 3 },
  { id: 'a4', name: 'Lena Siew', email: 'lena@adnexio.com', site: 'Slim River Estate', siteId: 's5', joinedDate: '2024-11-01', status: 'inactive', lastActive: '3 months ago', totalStaff: 18, totalDevices: 2 },
];

function StatusBadge({ status }: { status: AdminStatus }) {
  const config = {
    active: { label: 'Active', icon: CheckCircle, className: 'text-[#27AE60] bg-[#e8f8ef]' },
    pending: { label: 'Pending', icon: Clock, className: 'text-[#F39C12] bg-[#fff3e0]' },
    inactive: { label: 'Inactive', icon: AlertTriangle, className: 'text-[#8a8a8a] bg-[#f0f0f0]' },
  }[status];
  const Icon = config.icon;
  return (
    <span className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full ${config.className}`} style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Icon className="w-3 h-3" />{config.label}
    </span>
  );
}

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<AdminRecord[]>(initialAdmins);
  const [search, setSearch] = useState('');
  const [filterSite, setFilterSite] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | AdminStatus>('all');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteSite, setInviteSite] = useState('');
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = admins.filter(a => {
    const matchSearch = search === '' || a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase());
    const matchSite = filterSite === 'all' || a.siteId === filterSite;
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchSite && matchStatus;
  });

  function submitInvite() {
    if (!inviteEmail.trim() || !inviteName.trim() || !inviteSite) return;
    const site = SITES_LIST.find(s => s.id === inviteSite);
    setAdmins(prev => [...prev, {
      id: `a${Date.now()}`,
      name: inviteName,
      email: inviteEmail,
      site: site?.name ?? '',
      siteId: inviteSite,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      lastActive: 'Never',
      totalStaff: 0,
      totalDevices: 0,
    }]);
    setInviteEmail(''); setInviteName(''); setInviteSite('');
    setInviteOpen(false);
  }

  function removeAdmin(id: string) {
    setAdmins(prev => prev.filter(a => a.id !== id));
    setOpenMenu(null);
  }

  const activeCount = admins.filter(a => a.status === 'active').length;
  const pendingCount = admins.filter(a => a.status === 'pending').length;
  const noAdminSites = SITES_LIST.filter(s => !admins.find(a => a.siteId === s.id && a.status === 'active'));

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Stats row */}
      <div className="px-8 pt-6 pb-4">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-white rounded-2xl border border-[#e5e5e5] p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e8f8ef] flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5 text-[#27AE60]" />
            </div>
            <div>
              <p className="text-[22px] font-semibold text-[#3a3a3a]" style={{ fontFamily: "'Poppins', sans-serif" }}>{activeCount}</p>
              <p className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: "'Poppins', sans-serif" }}>Active Admins</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#e5e5e5] p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fff3e0] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-[#F39C12]" />
            </div>
            <div>
              <p className="text-[22px] font-semibold text-[#3a3a3a]" style={{ fontFamily: "'Poppins', sans-serif" }}>{pendingCount}</p>
              <p className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: "'Poppins', sans-serif" }}>Pending Invites</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#e5e5e5] p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fdf6e2] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-[#F3BF3A]" />
            </div>
            <div>
              <p className="text-[22px] font-semibold text-[#3a3a3a]" style={{ fontFamily: "'Poppins', sans-serif" }}>{SITES_LIST.length}</p>
              <p className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: "'Poppins', sans-serif" }}>Total Sites</p>
            </div>
          </div>
          <div className={`rounded-2xl border p-4 flex items-center gap-3 ${noAdminSites.length > 0 ? 'bg-[#fdecea] border-[#E74C3C]/20' : 'bg-white border-[#e5e5e5]'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${noAdminSites.length > 0 ? 'bg-[#E74C3C]/10' : 'bg-[#f0f0f0]'}`}>
              <AlertTriangle className={`w-5 h-5 ${noAdminSites.length > 0 ? 'text-[#E74C3C]' : 'text-[#8a8a8a]'}`} />
            </div>
            <div>
              <p className={`text-[22px] font-semibold ${noAdminSites.length > 0 ? 'text-[#E74C3C]' : 'text-[#3a3a3a]'}`} style={{ fontFamily: "'Poppins', sans-serif" }}>{noAdminSites.length}</p>
              <p className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: "'Poppins', sans-serif" }}>Sites without admin</p>
            </div>
          </div>
        </div>

        {/* Filters row */}
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8a8a]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search admin..."
                className="pl-9 pr-4 py-2 bg-white border border-[#e5e5e5] rounded-full text-[13px] w-[220px] outline-none focus:border-[#F3BF3A]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </div>
            <select
              value={filterSite}
              onChange={e => setFilterSite(e.target.value)}
              className="px-4 py-2 bg-white border border-[#e5e5e5] rounded-full text-[13px] outline-none focus:border-[#F3BF3A] cursor-pointer"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <option value="all">All Sites</option>
              {SITES_LIST.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <div className="flex items-center gap-1 bg-[#f0f0f0] rounded-full p-1">
              {(['all', 'active', 'pending', 'inactive'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-4 py-1 rounded-full text-[12px] font-medium capitalize transition-colors ${filterStatus === s ? 'bg-white text-[#3a3a3a] shadow-sm' : 'text-[#636363] hover:text-[#3a3a3a]'}`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {s === 'all' ? 'All' : s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setInviteOpen(true)}
            className="flex items-center gap-2 bg-[#F3BF3A] hover:bg-[#e0ae2a] text-[#3a3a3a] font-semibold text-[13px] px-5 py-2 rounded-full transition-colors"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <Plus className="w-4 h-4" /> Invite Admin
          </button>
        </div>
      </div>

      {/* Sites without admin alert */}
      {noAdminSites.length > 0 && (
        <div className="mx-8 mb-4 bg-[#fff8e1] border border-[#F3BF3A]/40 rounded-xl px-5 py-3 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-[#F39C12] shrink-0" />
          <p className="text-[12px] text-[#7a5c00] flex-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <span className="font-semibold">{noAdminSites.length} site{noAdminSites.length !== 1 ? 's' : ''} without an active admin:</span>{' '}
            {noAdminSites.map(s => s.name).join(', ')}
          </p>
          <button
            onClick={() => setInviteOpen(true)}
            className="text-[12px] font-semibold text-[#F39C12] hover:underline whitespace-nowrap"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Assign admin →
          </button>
        </div>
      )}

      {/* Admin table */}
      <div className="flex-1 overflow-y-auto px-8 pb-8">
        <div className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden">
          <div className="grid grid-cols-[1fr_180px_120px_100px_80px_80px_50px] bg-[#fafafa] px-6 py-3 border-b border-[#f0f0f0]">
            {['Admin', 'Site', 'Staff', 'Devices', 'Status', 'Last Active', ''].map(h => (
              <span key={h} className="text-[10px] font-semibold text-[#8a8a8a] uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>{h}</span>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center text-[#8a8a8a] text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>No admins found.</div>
          ) : (
            filtered.map(admin => (
              <div key={admin.id} className="grid grid-cols-[1fr_180px_120px_100px_80px_80px_50px] px-6 py-4 border-b border-[#f0f0f0] last:border-0 hover:bg-[#f9f9f9] transition-colors relative">
                {/* Name + email */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#F3BF3A] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                    {admin.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-[#3a3a3a]" style={{ fontFamily: "'Poppins', sans-serif" }}>{admin.name}</p>
                    <p className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: "'Poppins', sans-serif" }}>{admin.email}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="flex items-center gap-1.5 text-[12px] text-[#636363]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <MapPin className="w-3 h-3 text-[#8a8a8a]" />{admin.site}
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="text-[13px] text-[#3a3a3a]" style={{ fontFamily: "'Poppins', sans-serif" }}>{admin.totalStaff} staff</span>
                </div>

                <div className="flex items-center">
                  <span className="text-[13px] text-[#3a3a3a]" style={{ fontFamily: "'Poppins', sans-serif" }}>{admin.totalDevices} dev.</span>
                </div>

                <div className="flex items-center">
                  <StatusBadge status={admin.status} />
                </div>

                <div className="flex items-center">
                  <span className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: "'Poppins', sans-serif" }}>{admin.lastActive}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === admin.id ? null : admin.id)}
                    className="w-7 h-7 rounded-full hover:bg-[#f0f0f0] flex items-center justify-center transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4 text-[#8a8a8a]" />
                  </button>
                  {openMenu === admin.id && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-[#e5e5e5] rounded-xl shadow-xl z-20 w-[160px] overflow-hidden">
                      <button
                        className="w-full flex items-center gap-2 px-4 py-3 text-[12px] text-[#3a3a3a] hover:bg-[#f7f9fa] transition-colors"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                        onClick={() => setOpenMenu(null)}
                      >
                        <Mail className="w-3.5 h-3.5 text-[#8a8a8a]" /> Resend Invite
                      </button>
                      <button
                        className="w-full flex items-center gap-2 px-4 py-3 text-[12px] text-[#E74C3C] hover:bg-[#fdecea] transition-colors"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                        onClick={() => removeAdmin(admin.id)}
                      >
                        <X className="w-3.5 h-3.5" /> Remove Admin
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Invite Admin Modal */}
      {inviteOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={() => setInviteOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[16px] font-semibold text-[#3a3a3a]" style={{ fontFamily: "'Poppins', sans-serif" }}>Invite Admin</h2>
              <button onClick={() => setInviteOpen(false)} className="w-8 h-8 rounded-full hover:bg-[#f0f0f0] flex items-center justify-center">
                <X className="w-4 h-4 text-[#636363]" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[12px] font-medium text-[#636363] mb-1.5 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Full Name *</label>
                <input value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder="e.g. Ahmad Roslan" className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-xl text-[13px] outline-none focus:border-[#F3BF3A] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }} />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[#636363] mb-1.5 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Email Address *</label>
                <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="admin@example.com" type="email" className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-xl text-[13px] outline-none focus:border-[#F3BF3A] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }} />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[#636363] mb-1.5 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Assign Site *</label>
                <select
                  value={inviteSite}
                  onChange={e => setInviteSite(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-xl text-[13px] outline-none focus:border-[#F3BF3A] transition-colors bg-white cursor-pointer"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <option value="">Select a site...</option>
                  {SITES_LIST.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-3 bg-[#f7f9fa] rounded-xl px-4 py-3">
              <p className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                The admin will receive an email invitation to set up their account and access the site dashboard.
              </p>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setInviteOpen(false)} className="flex-1 py-2.5 rounded-full border border-[#e5e5e5] text-[13px] text-[#636363] hover:bg-[#f7f9fa] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>Cancel</button>
              <button onClick={submitInvite} className="flex-1 py-2.5 rounded-full bg-[#F3BF3A] hover:bg-[#e0ae2a] text-[#3a3a3a] font-semibold text-[13px] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>Send Invite</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
