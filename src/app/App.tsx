import { useState, useRef, useEffect } from 'react';
import svgPaths from '../imports/Frame427319052/svg-c6hw8iwfu3';
import StaffTab from './components/StaffTab';
import AccessControlTab from './components/AccessControlTab';
import PayrollTab from './components/PayrollTab';
import StaffManagementPage from './components/StaffManagementPage';
import AdminManagementPage from './components/AdminManagementPage';
import SiteManagementPage from './components/SiteManagementPage';
import DeviceManagementPage from './components/DeviceManagementPage';
import UserManagementPage from './components/UserManagementPage';

type UserAccount = 'admin' | 'superadmin';

function AdnexioMark() {
  return (
    <div className="relative shrink-0" style={{ width: '15.351px', height: '18.54px' }}>
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.3508 18.54">
        <path d={svgPaths.p2fc09900} fill="#F3BF3A" />
        <path d={svgPaths.p21afd600} fill="#D09A01" />
        <path d={svgPaths.p396e3870} fill="#D09A01" />
      </svg>
    </div>
  );
}

function AdnexioWordmark() {
  return (
    <div className="relative" style={{ width: '83.238px', height: '18.326px' }}>
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 83.2379 18.3256">
        <path d={svgPaths.pe2fc200} fill="#3A3A3A" />
        <path d={svgPaths.p2e248900} fill="#3A3A3A" />
        <path d={svgPaths.p24eafb00} fill="#3A3A3A" />
        <path d={svgPaths.p26cb3130} fill="#3A3A3A" />
        <path d={svgPaths.p22353380} fill="#3A3A3A" />
        <path d={svgPaths.p2043c080} fill="#3A3A3A" />
        <path d={svgPaths.pe9e6680} fill="#3A3A3A" />
      </svg>
    </div>
  );
}

function Chevron({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center shrink-0 ${className}`} style={{ width: '12px', height: '6px' }}>
      <div className="-rotate-90">
        <svg width="6" height="12" viewBox="0 0 5.99835 12" fill="none">
          <path d={svgPaths.p104aa600} fill="#636363" />
        </svg>
      </div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  hasChevron = false,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  hasChevron?: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full h-[45px] rounded-[100px] flex items-center gap-[12px] px-[7px] transition-colors ${
        active ? 'bg-[#fdf6e2]' : 'bg-white hover:bg-[#f7f9fa]'
      }`}
    >
      <div className="shrink-0 w-[35px] h-[35px] flex items-center justify-center rounded-full bg-white">
        {icon}
      </div>
      <span
        className="flex-1 text-left text-[14px] text-[#636363]"
        style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}
      >
        {label}
      </span>
      {hasChevron && <Chevron />}
    </button>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount>('admin');
  const [activeTab, setActiveTab] = useState<'staff' | 'access' | 'payroll'>('staff');
  const [palmExpanded] = useState(true);
  const [adminPalmTab, setAdminPalmTab] = useState<'employeeLogs' | 'visitorLogs' | 'siteManagement'>('employeeLogs');
  const [currentView, setCurrentView] = useState<'dashboard' | 'staffManagement' | 'companyManagement' | 'payroll'>('dashboard');
  const [manageMenuOpen, setManageMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const manageMenuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [superSection, setSuperSection] = useState<'deviceManagement' | 'userManagement'>('deviceManagement');

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (manageMenuRef.current && !manageMenuRef.current.contains(e.target as Node)) {
        setManageMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchUser = (user: UserAccount) => {
    setCurrentUser(user);
    setProfileDropdownOpen(false);
    setActiveTab('staff');
    setCurrentView('dashboard');
    setSuperSection('deviceManagement');
    setAdminPalmTab('employeeLogs');
  };

  const isSuperAdmin = currentUser === 'superadmin';

  return (
    <div className="size-full bg-[#f7f9fa] overflow-hidden">
      <div className="relative size-full">
        <div className="absolute left-[300px] top-[80px] right-0 bottom-0 overflow-y-auto">
          {isSuperAdmin ? (
            <>
              {superSection === 'deviceManagement' && <DeviceManagementPage />}
              {superSection === 'userManagement'   && <UserManagementPage />}
            </>
          ) : (
            <>
              {currentView === 'staffManagement' && <StaffManagementPage />}
              {currentView === 'payroll' && <PayrollTab />}
              {currentView === 'dashboard' && activeTab === 'staff'   && adminPalmTab === 'employeeLogs'   && <StaffTab view="employees" />}
              {currentView === 'dashboard' && activeTab === 'staff'   && adminPalmTab === 'visitorLogs'    && <StaffTab view="visitors" />}
              {currentView === 'dashboard' && activeTab === 'staff'   && adminPalmTab === 'siteManagement' && <SiteManagementPage />}
              {currentView === 'dashboard' && activeTab === 'access'  && <AccessControlTab />}
              {currentView === 'dashboard' && activeTab === 'payroll' && <PayrollTab />}
            </>
          )}
        </div>

        <div className="absolute bg-white left-0 top-0 w-[300px] h-full flex flex-col border-r border-[#e5e5e5] overflow-y-auto">
          <div className="flex flex-col gap-[8px] items-center px-[25px] py-[10px] flex-1">
            <div className="bg-white relative rounded-[10px] shrink-0 w-full">
              <div className="flex flex-col justify-center size-full">
                <div className="flex flex-col gap-[4px] items-start justify-center pl-[12px] pr-[20px] py-[16px]">
                  <div className="flex gap-[8px] items-center justify-center" />
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full">
              <div
                className="h-[45px] flex items-center text-[12px] text-[#8a8a8a]"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}
              >
                PALM ATTENDANCE
              </div>
              <div className="flex flex-col gap-[8px] w-full">
                <div className="w-full">
                  <div className="w-full h-[45px] rounded-[100px] flex items-center gap-[12px] px-[7px] bg-white">
                    <div className="shrink-0 w-[35px] h-[35px] flex items-center justify-center rounded-full bg-[#F3BF3A]">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d={svgPaths.p12d3400} fill="#3A3A3A" />
                      </svg>
                    </div>
                    <span
                      className="flex-1 text-left text-[14px] text-[#636363]"
                      style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}
                    >
                      PALM Attendance
                    </span>
                    <svg className="rotate-180 shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9l6 6 6-6" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  <div className="mt-[4px] ml-[19px] pl-[16px] border-l-2 border-[#e5e5e5] flex flex-col gap-[4px] pb-[4px]">
                    {([
                      { key: 'employeeLogs'   as const, label: 'Employee Logs'   },
                      { key: 'visitorLogs'    as const, label: 'Visitor Logs'    },
                      { key: 'siteManagement' as const, label: 'Site Management' },
                    ]).map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => { setActiveTab('staff'); setCurrentView('dashboard'); setAdminPalmTab(key); }}
                        className={`w-full text-left px-[12px] py-[8px] rounded-full text-[13px] transition-colors ${
                          currentView === 'dashboard' && activeTab === 'staff' && adminPalmTab === key
                            ? 'bg-[#fdf6e2] text-[#3a3a3a] font-medium'
                            : 'text-[#636363] hover:bg-[#f7f9fa]'
                        }`}
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto w-full pt-[10px]" ref={manageMenuRef}>
              {manageMenuOpen && (
                <div className="mb-2 bg-white border border-[#e5e5e5] rounded-xl shadow-lg overflow-hidden">
                  <button
                    onClick={() => { setCurrentView('staffManagement'); setManageMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-[#3a3a3a] hover:bg-[#f7f9fa] transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#636363" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="7" r="4" stroke="#636363" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ fontFamily: "'Poppins', sans-serif" }}>Staff Management</span>
                  </button>
                </div>
              )}

              <div className="bg-white border border-[#e5e5e5] rounded-[4.5px] flex gap-[16px] items-center min-h-[59px] px-[13px] py-[9.5px]">
                <div className="bg-[#F3BF3A] rounded-full shrink-0 w-[40px] h-[40px] flex items-center justify-center text-white text-sm font-semibold">SI</div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-[14px] text-[#3a3a3a] leading-[21px] truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>Site Admin</p>
                  <p className="text-[12px] text-[#8a8a8a] leading-[18px] truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>siteadmin@palm.com</p>
                </div>
                <button
                  onClick={() => setManageMenuOpen(!manageMenuOpen)}
                  className="shrink-0 px-2.5 py-1 rounded-md text-xs font-medium text-[#2666BE] bg-[#e6f2ff] hover:bg-[#d0e8ff] transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Manage
                </button>
              </div>
            </div>
          </div>
        </div>

        {isSuperAdmin && (
          <div className="absolute bg-white left-0 top-0 w-[300px] h-full flex flex-col border-r border-[#e5e5e5] overflow-y-auto">
            <div className="flex flex-col gap-[8px] items-center px-[25px] py-[10px] flex-1">
              <div className="bg-white relative rounded-[10px] shrink-0 w-full">
                <div className="flex flex-col gap-[4px] items-start justify-center pl-[12px] pr-[20px] py-[16px]" />
              </div>

              <div className="flex flex-col w-full">
                <div className="mb-3 flex items-center gap-2 px-2">
                  <div className="w-2 h-2 rounded-full bg-[#9B59B6]" />
                  <span className="text-[11px] font-semibold text-[#9B59B6] uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>Super Admin</span>
                </div>

                <div className="h-[35px] flex items-center text-[12px] text-[#8a8a8a]" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}>ADMIN</div>
                <div className="flex flex-col gap-[8px] w-full">
                  <div className="w-full">
                    <div className="w-full h-[45px] rounded-[100px] flex items-center gap-[12px] px-[7px] bg-white">
                      <div className="shrink-0 w-[35px] h-[35px] flex items-center justify-center rounded-full bg-[#F3BF3A]">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d={svgPaths.p12d3400} fill="#3A3A3A" /></svg>
                      </div>
                      <span className="flex-1 text-left text-[14px] text-[#636363]" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>PALM Attendance</span>
                      <svg className="rotate-180 shrink-0" width="6" height="12" viewBox="0 0 5.99835 12" fill="none"><path d={svgPaths.p104aa600} fill="#636363" /></svg>
                    </div>
                    <div className="mt-[4px] ml-[19px] pl-[16px] border-l-2 border-[#e5e5e5] flex flex-col gap-[4px] pb-[4px]">
                      {([
                        { key: 'deviceManagement' as const, label: 'Device Management' },
                        { key: 'userManagement' as const, label: 'User Management' },
                      ]).map(({ key, label }) => (
                        <button
                          key={key}
                          onClick={() => setSuperSection(key)}
                          className={`w-full text-left px-[12px] py-[8px] rounded-full text-[13px] transition-colors ${superSection === key ? 'bg-[#fdf6e2] text-[#3a3a3a] font-medium' : 'text-[#636363] hover:bg-[#f7f9fa]'}`}
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto w-full pt-[10px]">
                <div className="bg-white border border-[#e5e5e5] rounded-[4.5px] flex gap-[16px] items-center min-h-[59px] px-[13px] py-[9.5px]">
                  <div className="bg-[#9B59B6] rounded-full shrink-0 w-[40px] h-[40px] flex items-center justify-center text-white text-sm font-semibold">SA</div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="text-[14px] text-[#3a3a3a] leading-[21px] truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>Super Admin</p>
                    <p className="text-[12px] text-[#8a8a8a] leading-[18px] truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>super@adnexio.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="absolute bg-white h-[80px] left-[300px] right-0 top-0 border-b border-[#e5e5e5] flex items-center px-8 justify-between">
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 flex items-center justify-center">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="#636363" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <h1 className="text-xl text-[#3a3a3a]" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
              {isSuperAdmin
                ? (superSection === 'deviceManagement' ? 'Device Management' : 'User Management')
                : (currentView === 'staffManagement' ? 'Staff Management' : currentView === 'payroll' ? 'Payroll' : adminPalmTab === 'visitorLogs' ? 'Visitor Logs' : adminPalmTab === 'siteManagement' ? 'Site Management' : 'Employee Logs')}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 bg-white border border-[#e5e5e5] rounded-full px-4 py-2 hover:bg-[#f7f9fa] transition-colors"
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold ${isSuperAdmin ? 'bg-[#9B59B6]' : 'bg-[#F3BF3A]'}`}>
                  {isSuperAdmin ? 'SA' : 'SI'}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[#262626]">{isSuperAdmin ? 'Super Admin' : 'Site Admin'}</p>
                  <p className="text-xs text-[#8a8a8a]">{isSuperAdmin ? 'super@adnexio.com' : 'siteadmin@palm.com'}</p>
                </div>
                <svg className="w-4 h-4 text-[#636363]" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {profileDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-[#e5e5e5] rounded-xl shadow-lg z-50 overflow-hidden min-w-[220px]">
                  <div className="px-4 py-2.5 border-b border-[#f0f0f0]">
                    <p className="text-xs font-semibold text-[#8a8a8a] uppercase tracking-wider">Switch Account</p>
                  </div>
                  {([
                    { key: 'superadmin' as UserAccount, label: 'Super Admin', email: 'super@adnexio.com',  initials: 'SA', color: '#9B59B6' },
                    { key: 'admin' as UserAccount,      label: 'Site Admin',  email: 'siteadmin@palm.com', initials: 'SI', color: '#F3BF3A' },
                  ] as const).map(acct => (
                    <button key={acct.key} onClick={() => switchUser(acct.key)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-[#f7f9fa] transition-colors ${currentUser === acct.key ? 'bg-[#fdf6e2]' : ''}`}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0" style={{ backgroundColor: acct.color }}>
                        {acct.initials}
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium text-[#3a3a3a]">{acct.label}</p>
                        <p className="text-xs text-[#8a8a8a]">{acct.email}</p>
                      </div>
                      {currentUser === acct.key && <div className="w-2 h-2 rounded-full bg-[#27AE60]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
