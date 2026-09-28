import { useState } from 'react';
import { Search, X, ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock, LogIn, LogOut } from 'lucide-react';

type LogEntry = {
  id: string;
  name: string;
  idNo: string;
  role: string;
  time: string;
  door: string;
  building: string;
  action: 'entry' | 'exit';
  status: 'success' | 'denied';
  date: string;
};

const employeeLogs: LogEntry[] = [
  { id: 'e1', name: 'Ahmad Faizal', idNo: 'E001', role: 'Security', time: '08:03', door: 'Main Entrance', building: 'Block A', action: 'entry', status: 'success', date: '2026-09-07' },
  { id: 'e2', name: 'Siti Nurhaliza', idNo: 'E002', role: 'Operations', time: '08:15', door: 'Server Room', building: 'Block B', action: 'entry', status: 'success', date: '2026-09-07' },
  { id: 'e3', name: 'Rajesh Kumar', idNo: 'E003', role: 'HR', time: '08:22', door: 'Floor 2 East', building: 'Block A', action: 'entry', status: 'success', date: '2026-09-07' },
  { id: 'e4', name: 'Nurul Ain', idNo: 'E004', role: 'Finance', time: '09:01', door: 'Server Room', building: 'Block B', action: 'entry', status: 'denied', date: '2026-09-07' },
  { id: 'e5', name: 'Muhammad Hafiz', idNo: 'E005', role: 'IT', time: '09:15', door: 'Main Entrance', building: 'Block A', action: 'exit', status: 'success', date: '2026-09-07' },
  { id: 'e6', name: 'Lim Wei Jian', idNo: 'E006', role: 'Engineering', time: '09:45', door: 'Lab Access', building: 'Block C', action: 'entry', status: 'success', date: '2026-09-07' },
  { id: 'e7', name: 'Priya Sundaram', idNo: 'E007', role: 'Finance', time: '10:02', door: 'Floor 1 West', building: 'Block A', action: 'entry', status: 'success', date: '2026-09-07' },
  { id: 'e8', name: 'Ahmad Faizal', idNo: 'E001', role: 'Security', time: '12:30', door: 'Main Entrance', building: 'Block A', action: 'exit', status: 'success', date: '2026-09-07' },
  { id: 'e9', name: 'Siti Nurhaliza', idNo: 'E002', role: 'Operations', time: '13:05', door: 'Server Room', building: 'Block B', action: 'exit', status: 'success', date: '2026-09-07' },
  { id: 'e10', name: 'Ahmad Faizal', idNo: 'E001', role: 'Security', time: '13:15', door: 'Main Entrance', building: 'Block A', action: 'entry', status: 'success', date: '2026-09-07' },
  { id: 'e11', name: 'Rajesh Kumar', idNo: 'E003', role: 'HR', time: '14:00', door: 'Floor 2 East', building: 'Block A', action: 'exit', status: 'success', date: '2026-09-07' },
  { id: 'e12', name: 'Nurul Ain', idNo: 'E004', role: 'Finance', time: '17:30', door: 'Main Entrance', building: 'Block A', action: 'exit', status: 'success', date: '2026-09-07' },
  { id: 'e13', name: 'Ahmad Faizal', idNo: 'E001', role: 'Security', time: '08:01', door: 'Main Entrance', building: 'Block A', action: 'entry', status: 'success', date: '2026-09-06' },
  { id: 'e14', name: 'Ahmad Faizal', idNo: 'E001', role: 'Security', time: '17:45', door: 'Main Entrance', building: 'Block A', action: 'exit', status: 'success', date: '2026-09-06' },
  { id: 'e15', name: 'Siti Nurhaliza', idNo: 'E002', role: 'Operations', time: '08:20', door: 'Server Room', building: 'Block B', action: 'entry', status: 'success', date: '2026-09-06' },
  { id: 'e16', name: 'Siti Nurhaliza', idNo: 'E002', role: 'Operations', time: '17:00', door: 'Server Room', building: 'Block B', action: 'exit', status: 'success', date: '2026-09-06' },
  { id: 'e17', name: 'Rajesh Kumar', idNo: 'E003', role: 'HR', time: '09:10', door: 'Floor 2 East', building: 'Block A', action: 'entry', status: 'success', date: '2026-09-05' },
  { id: 'e18', name: 'Lim Wei Jian', idNo: 'E006', role: 'Engineering', time: '08:55', door: 'Lab Access', building: 'Block C', action: 'entry', status: 'success', date: '2026-09-05' },
  { id: 'e19', name: 'Priya Sundaram', idNo: 'E007', role: 'Finance', time: '08:30', door: 'Floor 1 West', building: 'Block A', action: 'entry', status: 'success', date: '2026-09-04' },
  { id: 'e20', name: 'Muhammad Hafiz', idNo: 'E005', role: 'IT', time: '09:00', door: 'Main Entrance', building: 'Block A', action: 'entry', status: 'success', date: '2026-09-04' },
];

const visitorLogs: LogEntry[] = [
  { id: 'v1', name: 'David Tan', idNo: 'V-2024-001', role: 'Visitor', time: '09:30', door: 'Visitor Lobby', building: 'Block A', action: 'entry', status: 'success', date: '2026-09-07' },
  { id: 'v2', name: 'Sarah Wong', idNo: 'V-2024-002', role: 'Visitor', time: '10:00', door: 'Visitor Lobby', building: 'Block A', action: 'entry', status: 'success', date: '2026-09-07' },
  { id: 'v3', name: 'Raj Patel', idNo: 'V-2024-003', role: 'Visitor', time: '10:45', door: 'Meeting Room B', building: 'Block B', action: 'entry', status: 'denied', date: '2026-09-07' },
  { id: 'v4', name: 'Emily Chen', idNo: 'V-2024-004', role: 'Visitor', time: '11:15', door: 'Visitor Lobby', building: 'Block A', action: 'entry', status: 'success', date: '2026-09-07' },
  { id: 'v5', name: 'David Tan', idNo: 'V-2024-001', role: 'Visitor', time: '12:00', door: 'Visitor Lobby', building: 'Block A', action: 'exit', status: 'success', date: '2026-09-07' },
  { id: 'v6', name: 'Sarah Wong', idNo: 'V-2024-002', role: 'Visitor', time: '14:30', door: 'Visitor Lobby', building: 'Block A', action: 'exit', status: 'success', date: '2026-09-07' },
  { id: 'v7', name: 'Amir Hassan', idNo: 'V-2024-005', role: 'Visitor', time: '09:00', door: 'Visitor Lobby', building: 'Block A', action: 'entry', status: 'success', date: '2026-09-06' },
  { id: 'v8', name: 'Amir Hassan', idNo: 'V-2024-005', role: 'Visitor', time: '11:30', door: 'Visitor Lobby', building: 'Block A', action: 'exit', status: 'success', date: '2026-09-06' },
  { id: 'v9', name: 'David Tan', idNo: 'V-2024-001', role: 'Visitor', time: '10:00', door: 'Visitor Lobby', building: 'Block A', action: 'entry', status: 'success', date: '2026-09-05' },
  { id: 'v10', name: 'Emily Chen', idNo: 'V-2024-004', role: 'Visitor', time: '09:45', door: 'Meeting Room B', building: 'Block B', action: 'entry', status: 'success', date: '2026-09-04' },
];

const WEEK_DATES = ['2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04', '2026-09-05', '2026-09-06', '2026-09-07'];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function formatDate(d: string) {
  const [y, m, day] = d.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${parseInt(day)} ${months[parseInt(m) - 1]} ${y}`;
}

type DrawerPerson = { name: string; idNo: string; role: string; isEmployee: boolean };

export default function AccessLogsPage({ defaultTab = 'employee' }: { defaultTab?: 'employee' | 'visitor' }) {
  const [logTab, setLogTab] = useState<'employee' | 'visitor'>(defaultTab);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('2026-09-07');
  const [drawerPerson, setDrawerPerson] = useState<DrawerPerson | null>(null);
  const [calSelectedDay, setCalSelectedDay] = useState<string>('2026-09-07');

  const logs = logTab === 'employee' ? employeeLogs : visitorLogs;

  const filteredLogs = logs.filter(l => {
    const matchName = search === '' || l.name.toLowerCase().includes(search.toLowerCase());
    const matchDate = l.date === dateFilter;
    return matchName && matchDate;
  });

  const weekDates = WEEK_DATES.map((d, i) => ({
    date: d,
    label: DAY_LABELS[i],
    count: logs.filter(l => l.date === d).length,
    denied: logs.filter(l => l.date === d && l.status === 'denied').length,
  }));

  const calDayLogs = logs.filter(l => l.date === calSelectedDay &&
    (search === '' || l.name.toLowerCase().includes(search.toLowerCase()))
  );

  function openDrawer(name: string) {
    const log = logs.find(l => l.name === name);
    if (log) setDrawerPerson({ name: log.name, idNo: log.idNo, role: log.role, isEmployee: logTab === 'employee' });
  }

  const personHistory = drawerPerson
    ? (logTab === 'employee' ? employeeLogs : visitorLogs)
        .filter(l => l.name === drawerPerson.name)
        .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
    : [];

  const historyByDate = personHistory.reduce<Record<string, LogEntry[]>>((acc, l) => {
    if (!acc[l.date]) acc[l.date] = [];
    acc[l.date].push(l);
    return acc;
  }, {});

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex items-center justify-between px-8 pt-6 pb-4 gap-4 flex-wrap">
        <div className="flex items-center gap-1 bg-[#f0f0f0] rounded-full p-1">
          {(['employee', 'visitor'] as const).map(t => (
            <button key={t} onClick={() => { setLogTab(t); setSearch(''); }}
              className={`px-5 py-1.5 rounded-full text-[13px] font-medium transition-colors capitalize ${logTab === t ? 'bg-white text-[#3a3a3a] shadow-sm' : 'text-[#636363] hover:text-[#3a3a3a]'}`}
              style={{ fontFamily: "'Poppins', sans-serif" }}>
              {t === 'employee' ? 'Employee Logs' : 'Visitor Logs'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8a8a]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name..."
              className="pl-9 pr-4 py-2 bg-white border border-[#e5e5e5] rounded-full text-[13px] text-[#3a3a3a] w-[200px] outline-none focus:border-[#F3BF3A] transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }} />
          </div>
          {viewMode === 'list' && (
            <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-[#e5e5e5] rounded-full text-[13px] text-[#3a3a3a] outline-none focus:border-[#F3BF3A] transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }} />
          )}
          <div className="flex items-center border border-[#e5e5e5] rounded-full overflow-hidden bg-white">
            <button onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-2 text-[12px] transition-colors ${viewMode === 'list' ? 'bg-[#fdf6e2] text-[#3a3a3a] font-medium' : 'text-[#636363] hover:bg-[#f7f9fa]'}`}
              style={{ fontFamily: "'Poppins', sans-serif" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              List
            </button>
            <button onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-2 text-[12px] transition-colors ${viewMode === 'calendar' ? 'bg-[#fdf6e2] text-[#3a3a3a] font-medium' : 'text-[#636363] hover:bg-[#f7f9fa]'}`}
              style={{ fontFamily: "'Poppins', sans-serif" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              Calendar
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-8">
        {viewMode === 'list' ? (
          <div className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden">
            <div className="px-6 py-3 border-b border-[#f0f0f0] flex items-center justify-between">
              <span className="text-[13px] font-medium text-[#3a3a3a]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {formatDate(dateFilter)} — {filteredLogs.length} record{filteredLogs.length !== 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-4 text-[12px] text-[#8a8a8a]">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#27AE60] inline-block" />Successful</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#E74C3C] inline-block" />Denied</span>
              </div>
            </div>
            <div className="grid grid-cols-[1fr_100px_120px_100px_120px_80px_80px] gap-0 border-b border-[#f0f0f0] bg-[#fafafa] px-6 py-3">
              {['Name', 'ID', 'Department', 'Time', 'Door', 'Building', 'Status'].map(h => (
                <span key={h} className="text-[11px] font-semibold text-[#8a8a8a] uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>{h}</span>
              ))}
            </div>
            {filteredLogs.length === 0 ? (
              <div className="py-16 text-center text-[#8a8a8a] text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>No logs found for this date.</div>
            ) : (
              filteredLogs.map((log, i) => (
                <div key={log.id} className={`grid grid-cols-[1fr_100px_120px_100px_120px_80px_80px] gap-0 px-6 py-3.5 border-b border-[#f0f0f0] hover:bg-[#f9f9f9] transition-colors ${i % 2 === 0 ? '' : 'bg-[#fafafa]'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F3BF3A]/20 flex items-center justify-center text-[#3a3a3a] text-[11px] font-bold shrink-0">{getInitials(log.name)}</div>
                    <div>
                      <button onClick={() => openDrawer(log.name)} className="text-[13px] font-medium text-[#2666BE] hover:underline text-left" style={{ fontFamily: "'Poppins', sans-serif" }}>{log.name}</button>
                      <div className="flex items-center gap-1 text-[11px] text-[#8a8a8a]">
                        {log.action === 'entry' ? <LogIn className="w-3 h-3 text-[#27AE60]" /> : <LogOut className="w-3 h-3 text-[#F39C12]" />}
                        <span className="capitalize">{log.action}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[13px] text-[#636363] flex items-center" style={{ fontFamily: "'Poppins', sans-serif" }}>{log.idNo}</span>
                  <span className="text-[13px] text-[#636363] flex items-center" style={{ fontFamily: "'Poppins', sans-serif" }}>{log.role}</span>
                  <div className="flex items-center gap-1.5 text-[13px] text-[#636363]">
                    <Clock className="w-3.5 h-3.5 text-[#8a8a8a]" />
                    <span style={{ fontFamily: "'Poppins', sans-serif" }}>{log.time}</span>
                  </div>
                  <span className="text-[13px] text-[#636363] flex items-center" style={{ fontFamily: "'Poppins', sans-serif" }}>{log.door}</span>
                  <span className="text-[13px] text-[#636363] flex items-center" style={{ fontFamily: "'Poppins', sans-serif" }}>{log.building}</span>
                  <div className="flex items-center">
                    {log.status === 'success'
                      ? <span className="flex items-center gap-1 text-[11px] font-medium text-[#27AE60] bg-[#e8f8ef] px-2 py-0.5 rounded-full"><CheckCircle className="w-3 h-3" /> OK</span>
                      : <span className="flex items-center gap-1 text-[11px] font-medium text-[#E74C3C] bg-[#fdecea] px-2 py-0.5 rounded-full"><XCircle className="w-3 h-3" /> Denied</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <button className="w-7 h-7 rounded-full hover:bg-[#f0f0f0] flex items-center justify-center transition-colors"><ChevronLeft className="w-4 h-4 text-[#636363]" /></button>
                  <span className="text-[14px] font-medium text-[#3a3a3a]" style={{ fontFamily: "'Poppins', sans-serif" }}>1 – 7 September 2026</span>
                  <button className="w-7 h-7 rounded-full hover:bg-[#f0f0f0] flex items-center justify-center transition-colors"><ChevronRight className="w-4 h-4 text-[#636363]" /></button>
                </div>
                <span className="text-[12px] text-[#8a8a8a]" style={{ fontFamily: "'Poppins', sans-serif" }}>Weekly overview</span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {weekDates.map(({ date, label, count, denied }) => {
                  const isSelected = date === calSelectedDay;
                  const isToday = date === '2026-09-07';
                  return (
                    <button key={date} onClick={() => setCalSelectedDay(date)}
                      className={`rounded-xl p-3 flex flex-col items-center gap-1 border-2 transition-all ${ isSelected ? 'border-[#F3BF3A] bg-[#fdf6e2]' : 'border-transparent hover:border-[#e5e5e5] hover:bg-[#f7f9fa]' }`}>
                      <span className="text-[11px] text-[#8a8a8a] font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>{label}</span>
                      <span className={`text-[20px] font-semibold ${isToday ? 'text-[#F3BF3A]' : 'text-[#3a3a3a]'}`} style={{ fontFamily: "'Poppins', sans-serif" }}>{date.split('-')[2]}</span>
                      {count > 0 ? (
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-[11px] text-[#27AE60] font-medium">{count - denied} ok</span>
                          {denied > 0 && <span className="text-[11px] text-[#E74C3C]">{denied} denied</span>}
                        </div>
                      ) : <span className="text-[11px] text-[#c0c0c0]">No logs</span>}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#f0f0f0]">
                <span className="text-[14px] font-medium text-[#3a3a3a]" style={{ fontFamily: "'Poppins', sans-serif" }}>{formatDate(calSelectedDay)} — {calDayLogs.length} log{calDayLogs.length !== 1 ? 's' : ''}</span>
              </div>
              {calDayLogs.length === 0 ? (
                <div className="py-12 text-center text-[#8a8a8a] text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>No access logs for this day.</div>
              ) : calDayLogs.map((log, i) => (
                <div key={log.id} className="flex items-center gap-4 px-6 py-4 border-b border-[#f0f0f0] hover:bg-[#f9f9f9] transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#F3BF3A]/20 flex items-center justify-center text-[#3a3a3a] text-[12px] font-bold shrink-0">{getInitials(log.name)}</div>
                  <div className="flex-1 min-w-0">
                    <button onClick={() => openDrawer(log.name)} className="text-[14px] font-medium text-[#2666BE] hover:underline" style={{ fontFamily: "'Poppins', sans-serif" }}>{log.name}</button>
                    <div className="text-[12px] text-[#8a8a8a]" style={{ fontFamily: "'Poppins', sans-serif" }}>{log.role} · {log.idNo}</div>
                  </div>
                  <div className="text-right text-[12px] text-[#8a8a8a]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <div className="flex items-center gap-1">
                      {log.action === 'entry' ? <LogIn className="w-3 h-3 text-[#27AE60]" /> : <LogOut className="w-3 h-3 text-[#F39C12]" />}
                      <span className="font-medium text-[#3a3a3a] capitalize">{log.action}</span>
                    </div>
                    <div>{log.door} · {log.building}</div>
                  </div>
                  <div className="text-[13px] font-medium text-[#3a3a3a] w-12 text-right" style={{ fontFamily: "'Poppins', sans-serif" }}>{log.time}</div>
                  {log.status === 'success' ? <CheckCircle className="w-5 h-5 text-[#27AE60] shrink-0" /> : <XCircle className="w-5 h-5 text-[#E74C3C] shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {drawerPerson && (
        <>
          <div className="absolute inset-0 bg-black/20 z-40" onClick={() => setDrawerPerson(null)} />
          <div className="absolute top-0 right-0 h-full w-[420px] bg-white shadow-2xl z-50 flex flex-col">
            <div className="flex items-center gap-4 px-6 py-5 border-b border-[#e5e5e5]">
              <div className="w-12 h-12 rounded-full bg-[#F3BF3A] flex items-center justify-center text-white text-[15px] font-bold shrink-0">{getInitials(drawerPerson.name)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[16px] font-semibold text-[#3a3a3a] truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>{drawerPerson.name}</p>
                <p className="text-[12px] text-[#8a8a8a]" style={{ fontFamily: "'Poppins', sans-serif" }}>{drawerPerson.idNo} · {drawerPerson.role}</p>
              </div>
              <button onClick={() => setDrawerPerson(null)} className="w-8 h-8 rounded-full hover:bg-[#f0f0f0] flex items-center justify-center transition-colors"><X className="w-4 h-4 text-[#636363]" /></button>
            </div>
            <div className="grid grid-cols-3 gap-3 px-6 py-4 border-b border-[#f0f0f0]">
              <div className="bg-[#f7f9fa] rounded-xl p-3 text-center"><p className="text-[18px] font-semibold text-[#3a3a3a]" style={{ fontFamily: "'Poppins', sans-serif" }}>{personHistory.length}</p><p className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: "'Poppins', sans-serif" }}>Total logs</p></div>
              <div className="bg-[#e8f8ef] rounded-xl p-3 text-center"><p className="text-[18px] font-semibold text-[#27AE60]" style={{ fontFamily: "'Poppins', sans-serif" }}>{personHistory.filter(l => l.status === 'success').length}</p><p className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: "'Poppins', sans-serif" }}>Successful</p></div>
              <div className="bg-[#fdecea] rounded-xl p-3 text-center"><p className="text-[18px] font-semibold text-[#E74C3C]" style={{ fontFamily: "'Poppins', sans-serif" }}>{personHistory.filter(l => l.status === 'denied').length}</p><p className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: "'Poppins', sans-serif" }}>Denied</p></div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
              <p className="text-[12px] font-semibold text-[#8a8a8a] uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>Full Access History</p>
              {Object.entries(historyByDate).map(([date, entries]) => (
                <div key={date}>
                  <p className="text-[12px] font-semibold text-[#3a3a3a] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>{formatDate(date)} {date === '2026-09-07' && <span className="text-[#F3BF3A] ml-1">Today</span>}</p>
                  <div className="flex flex-col gap-2">
                    {entries.map(log => (
                      <div key={log.id} className="flex items-center gap-3 bg-[#f7f9fa] rounded-xl px-4 py-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${log.action === 'entry' ? 'bg-[#e8f8ef]' : 'bg-[#fff3e0]'}`}>
                          {log.action === 'entry' ? <LogIn className="w-3.5 h-3.5 text-[#27AE60]" /> : <LogOut className="w-3.5 h-3.5 text-[#F39C12]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-[#3a3a3a] capitalize" style={{ fontFamily: "'Poppins', sans-serif" }}>{log.action}</p>
                          <p className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: "'Poppins', sans-serif" }}>{log.door} · {log.building}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[13px] font-medium text-[#3a3a3a]" style={{ fontFamily: "'Poppins', sans-serif" }}>{log.time}</span>
                          {log.status === 'denied' && <span className="text-[10px] text-[#E74C3C] font-medium bg-[#fdecea] px-1.5 py-0.5 rounded-full">DENIED</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
