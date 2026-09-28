import { useState } from 'react';
import { Search, Calendar, X, Clock, LogIn, LogOut, MapPin, Shield, Users, AlertTriangle, TrendingUp } from 'lucide-react';

interface Visitor { id: string; name: string; phone: string; purpose: string; clockIn: string; clockOut: string; lastDoor: string; accessStatus: 'granted' | 'denied'; }
interface VisitorLog { visitorId: string; clockIn: string; clockOut: string; entryPoint: string; exitPoint: string; accessLogs: { time: string; accessPoint: string; response: 'granted' | 'denied' }[]; }

const VISITORS: Visitor[] = [
  { id: '1', name: 'Tan Wei Ming',      phone: '601 2345 6789', purpose: 'Visiting Patient',  clockIn: '8:10 AM',  clockOut: '--:--',   lastDoor: 'Ward A Entrance',  accessStatus: 'granted' },
  { id: '2', name: 'Siti Norfadzilah',  phone: '601 9876 5432', purpose: 'Outpatient Visit',  clockIn: '9:05 AM',  clockOut: '--:--',   lastDoor: 'Outpatient Lobby', accessStatus: 'granted' },
  { id: '3', name: 'Rajan Pillai',      phone: '601 1122 3344', purpose: 'Visiting Patient',  clockIn: '10:20 AM', clockOut: '--:--',   lastDoor: 'ICU Corridor',     accessStatus: 'denied'  },
  { id: '4', name: 'Nurul Ain Hamid',   phone: '601 8899 0011', purpose: 'Staff Family',      clockIn: '11:00 AM', clockOut: '1:30 PM', lastDoor: 'Ward B Entrance',  accessStatus: 'granted' },
  { id: '5', name: 'Chong Kok Fai',     phone: '601 3344 5566', purpose: 'Delivery',          clockIn: '7:45 AM',  clockOut: '8:30 AM', lastDoor: 'Loading Bay',      accessStatus: 'granted' },
  { id: '6', name: 'Faridah Othman',    phone: '601 7766 5544', purpose: 'Visiting Patient',  clockIn: '2:15 PM',  clockOut: '--:--',   lastDoor: 'Ward C Entrance',  accessStatus: 'granted' },
  { id: '7', name: 'Suresh Kumar',      phone: '601 5544 3322', purpose: 'Outpatient Visit',  clockIn: '3:00 PM',  clockOut: '--:--',   lastDoor: 'Pharmacy Counter', accessStatus: 'denied'  },
  { id: '8', name: 'Lim Poh Cheng',     phone: '601 2211 0099', purpose: 'Staff Family',      clockIn: '4:10 PM',  clockOut: '--:--',   lastDoor: 'Ward A Entrance',  accessStatus: 'granted' },
];

const VISITOR_LOGS: Record<string, VisitorLog> = {
  '1': { visitorId:'1', clockIn:'8:10 AM', clockOut:'--:--', entryPoint:'Main Entrance', exitPoint:'--', accessLogs:[{time:'8:10 AM',accessPoint:'Main Entrance',response:'granted'},{time:'8:25 AM',accessPoint:'Ward A Entrance',response:'granted'},{time:'10:00 AM',accessPoint:'ICU Corridor',response:'denied'}] },
  '2': { visitorId:'2', clockIn:'9:05 AM', clockOut:'--:--', entryPoint:'Main Entrance', exitPoint:'--', accessLogs:[{time:'9:05 AM',accessPoint:'Main Entrance',response:'granted'},{time:'9:15 AM',accessPoint:'Outpatient Lobby',response:'granted'}] },
  '3': { visitorId:'3', clockIn:'10:20 AM',clockOut:'--:--', entryPoint:'Main Entrance', exitPoint:'--', accessLogs:[{time:'10:20 AM',accessPoint:'Main Entrance',response:'granted'},{time:'10:35 AM',accessPoint:'ICU Corridor',response:'denied'},{time:'10:40 AM',accessPoint:'ICU Corridor',response:'denied'},{time:'11:00 AM',accessPoint:'ICU Corridor',response:'denied'}] },
  '4': { visitorId:'4', clockIn:'11:00 AM',clockOut:'1:30 PM',entryPoint:'Main Entrance', exitPoint:'Main Entrance', accessLogs:[{time:'11:00 AM',accessPoint:'Main Entrance',response:'granted'},{time:'11:10 AM',accessPoint:'Ward B Entrance',response:'granted'},{time:'1:25 PM',accessPoint:'Main Entrance',response:'granted'}] },
  '5': { visitorId:'5', clockIn:'7:45 AM', clockOut:'8:30 AM',entryPoint:'Loading Bay',  exitPoint:'Loading Bay',   accessLogs:[{time:'7:45 AM',accessPoint:'Loading Bay',response:'granted'},{time:'8:28 AM',accessPoint:'Loading Bay',response:'granted'}] },
  '6': { visitorId:'6', clockIn:'2:15 PM', clockOut:'--:--', entryPoint:'Main Entrance', exitPoint:'--', accessLogs:[{time:'2:15 PM',accessPoint:'Main Entrance',response:'granted'},{time:'2:28 PM',accessPoint:'Ward C Entrance',response:'granted'}] },
  '7': { visitorId:'7', clockIn:'3:00 PM', clockOut:'--:--', entryPoint:'Main Entrance', exitPoint:'--', accessLogs:[{time:'3:00 PM',accessPoint:'Main Entrance',response:'granted'},{time:'3:10 PM',accessPoint:'Pharmacy Counter',response:'denied'},{time:'3:15 PM',accessPoint:'Pharmacy Counter',response:'denied'}] },
  '8': { visitorId:'8', clockIn:'4:10 PM', clockOut:'--:--', entryPoint:'Main Entrance', exitPoint:'--', accessLogs:[{time:'4:10 PM',accessPoint:'Main Entrance',response:'granted'},{time:'4:20 PM',accessPoint:'Ward A Entrance',response:'granted'}] },
};

const HOSPITAL_DOORS = ['All Doors','Main Entrance','Ward A Entrance','Ward B Entrance','Ward C Entrance','ICU Corridor','Outpatient Lobby','Pharmacy Counter','Loading Bay','Emergency Bay','Operating Theatre Lobby'];

function SummaryCard({ icon, label, value, sub, color, action }: { icon: React.ReactNode; label: string; value: string|number; sub?: string; color: string; action?: { label: string; onClick: () => void } }) {
  return (
    <div className="bg-white rounded-xl border border-[#e5e5e5] p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: color + '18' }}>
        <div style={{ color }}>{icon}</div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#8a8a8a] mb-0.5">{label}</p>
        <p className="text-2xl font-semibold text-[#3a3a3a]">{value}</p>
        {sub && <p className="text-xs text-[#8a8a8a] mt-0.5">{sub}</p>}
        {action && <button onClick={action.onClick} className="mt-1.5 text-[11px] font-semibold underline underline-offset-2 transition-opacity hover:opacity-70" style={{ color }}>{action.label}</button>}
      </div>
    </div>
  );
}

function KPJAnomaliesModal({ onClose }: { onClose: () => void }) {
  const flagged = VISITORS.filter(v => (VISITOR_LOGS[v.id]?.accessLogs.filter(e => e.response === 'denied').length ?? 0) >= 2);
  const reasonFor = (id: string): string => {
    const log = VISITOR_LOGS[id];
    if (!log) return '';
    const denials = log.accessLogs.filter(e => e.response === 'denied');
    const doors = [...new Set(denials.map(e => e.accessPoint))];
    return `Attempted access to restricted area${doors.length > 1 ? 's' : ''} (${doors.join(', ')}) — denied ${denials.length} time${denials.length !== 1 ? 's' : ''}.`;
  };
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e5e5e5]">
          <div><h2 className="text-base font-semibold text-[#3a3a3a]">Anomalies Flagged</h2><p className="text-xs text-[#8a8a8a] mt-0.5">{flagged.length} visitor{flagged.length !== 1 ? 's' : ''} flagged today</p></div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f7f9fa] transition-colors"><X className="w-4 h-4 text-[#636363]" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {flagged.length === 0 ? <p className="text-sm text-[#8a8a8a] py-6 text-center">No anomalies detected.</p> : flagged.map(v => (
            <div key={v.id} className="border border-[#FF4444]/20 bg-[#fff5f5] rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#FF4444]/10 flex items-center justify-center shrink-0"><AlertTriangle className="w-4 h-4 text-[#FF4444]" /></div>
                <div><p className="text-sm font-semibold text-[#3a3a3a]">{v.name}</p><p className="text-xs text-[#8a8a8a]">{v.purpose} · {v.phone}</p></div>
              </div>
              <div className="flex gap-2 text-xs text-[#636363]"><span className="text-[#FF4444] shrink-0 mt-0.5">•</span><span>{reasonFor(v.id)}</span></div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-[#e5e5e5]"><button onClick={onClose} className="w-full py-2.5 border border-[#e5e5e5] rounded-full text-sm font-medium text-[#636363] hover:bg-[#f7f9fa] transition-colors">Close</button></div>
      </div>
    </div>
  );
}

export default function KPJAccessLogsTab() {
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDoor, setSelectedDoor] = useState('All Doors');
  const [drawerVisitorId, setDrawerVisitorId] = useState<string | null>(null);
  const [showAnomalies, setShowAnomalies] = useState(false);

  const anomalies = Object.values(VISITOR_LOGS).reduce((a, l) => a + l.accessLogs.filter(e => e.response === 'denied').length, 0);
  const filtered = VISITORS.filter(v => {
    const q = search.toLowerCase();
    const matchQ = !q || v.name.toLowerCase().includes(q) || v.phone.includes(q) || v.purpose.toLowerCase().includes(q);
    const matchD = selectedDoor === 'All Doors' || v.lastDoor === selectedDoor;
    return matchQ && matchD;
  });

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold text-[#3a3a3a] mb-6">Visitor Access Logs</h2>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <SummaryCard icon={<Users className="w-5 h-5"/>} label="Total Visitors Today" value={VISITORS.length} sub="Registered via palm scan" color="#2666BE" />
        <SummaryCard icon={<AlertTriangle className="w-5 h-5"/>} label="Anomalies Flagged" value={anomalies} sub="Denied access attempts" color="#FF4444" action={{ label: 'View anomalies', onClick: () => setShowAnomalies(true) }} />
        <SummaryCard icon={<Clock className="w-5 h-5"/>} label="Currently Inside" value={VISITORS.filter(v=>v.clockOut==='--:--').length} sub="Active visitor sessions" color="#27AE60" />
        <SummaryCard icon={<TrendingUp className="w-5 h-5"/>} label="Checked Out" value={VISITORS.filter(v=>v.clockOut!=='--:--').length} sub="Completed visits today" color="#F3BF3A" />
      </div>
      <div className="bg-white rounded-xl border border-[#e5e5e5] p-5 mb-5">
        <div className="grid grid-cols-3 gap-4">
          <div><label className="block text-xs font-medium text-[#8a8a8a] mb-2">Search Visitor</label><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8a8a]"/><input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Name, IC or purpose..." className="w-full pl-10 pr-4 py-2.5 border border-[#e5e5e5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2666BE]"/></div></div>
          <div><label className="block text-xs font-medium text-[#8a8a8a] mb-2">Filter by Date</label><div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8a8a] pointer-events-none"/><input type="date" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-[#e5e5e5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2666BE]"/></div></div>
          <div><label className="block text-xs font-medium text-[#8a8a8a] mb-2">Filter by Door</label><select value={selectedDoor} onChange={e=>setSelectedDoor(e.target.value)} className="w-full px-3 py-2.5 border border-[#e5e5e5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2666BE] bg-white">{HOSPITAL_DOORS.map(d=><option key={d}>{d}</option>)}</select></div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-[#e5e5e5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-[#f7f9fa] border-b border-[#e5e5e5]">{['Visitor','Phone Number','Purpose','Clock In','Clock Out','Last Access Point','Status',''].map(h=><th key={h} className="px-5 py-4 text-left text-xs font-semibold text-[#8a8a8a] uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-[#e5e5e5]">
              {filtered.map(v => {
                const denied = VISITOR_LOGS[v.id]?.accessLogs.filter(e=>e.response==='denied').length ?? 0;
                const flagged = denied >= 2;
                return (
                  <tr key={v.id} className="transition-colors hover:bg-[#f7f9fa]" style={{ background: flagged ? '#fffde7' : undefined }}>
                    <td className="px-5 py-4"><div className="flex items-center gap-1.5 flex-wrap"><span className="font-medium text-sm text-[#3a3a3a]">{v.name}</span>{flagged && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FF4444]/10 text-[#FF4444] border border-[#FF4444]/20"><AlertTriangle className="w-2.5 h-2.5"/>Flagged</span>}</div></td>
                    <td className="px-5 py-4 text-sm text-[#636363]">{v.phone}</td>
                    <td className="px-5 py-4"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#e6f2ff] text-[#2666BE]">{v.purpose}</span></td>
                    <td className="px-5 py-4 text-sm font-medium text-[#3a3a3a]">{v.clockIn}</td>
                    <td className="px-5 py-4 text-sm font-medium text-[#3a3a3a]">{v.clockOut}</td>
                    <td className="px-5 py-4 text-sm text-[#2666BE] font-medium">{v.lastDoor}</td>
                    <td className="px-5 py-4"><div className="flex items-center gap-1.5"><div className={`w-2 h-2 rounded-full ${v.accessStatus==='granted'?'bg-[#27AE60]':'bg-[#FF4444]'}`}/><span className={`text-sm font-medium ${v.accessStatus==='granted'?'text-[#27AE60]':'text-[#FF4444]'}`}>{v.accessStatus==='granted'?'Granted':'Denied'}</span></div></td>
                    <td className="px-5 py-4"><button onClick={()=>setDrawerVisitorId(v.id)} className="text-sm font-medium text-[#2666BE] hover:underline whitespace-nowrap">View Full Log</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-[#e5e5e5] text-xs text-[#8a8a8a]">Showing {filtered.length} of {VISITORS.length} visitors</div>
      </div>
      {drawerVisitorId && (() => {
        const v = VISITORS.find(x=>x.id===drawerVisitorId);
        const log = VISITOR_LOGS[drawerVisitorId];
        if (!v || !log) return null;
        return (
          <>
            <div className="fixed inset-0 bg-black/30 z-40" onClick={()=>setDrawerVisitorId(null)}/>
            <div className="fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl z-50 flex flex-col">
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#e5e5e5]">
                <div><h3 className="text-base font-semibold text-[#3a3a3a]">{v.name}</h3><p className="text-xs text-[#8a8a8a] mt-0.5">{v.phone} · {v.purpose}</p></div>
                <button onClick={()=>setDrawerVisitorId(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f7f9fa]"><X className="w-4 h-4 text-[#636363]"/></button>
              </div>
              <div className="grid grid-cols-2 border-b border-[#e5e5e5]">
                <div className="flex flex-col items-center py-4 border-r border-[#e5e5e5]"><LogIn className="w-4 h-4 text-[#27AE60] mb-1"/><span className="text-xs text-[#8a8a8a]">Entry Time</span><span className="text-sm font-semibold text-[#3a3a3a] mt-0.5">{log.clockIn}</span></div>
                <div className="flex flex-col items-center py-4"><LogOut className="w-4 h-4 text-[#FF4444] mb-1"/><span className="text-xs text-[#8a8a8a]">Exit Time</span><span className="text-sm font-semibold text-[#3a3a3a] mt-0.5">{log.clockOut}</span></div>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <p className="text-xs font-semibold text-[#8a8a8a] uppercase tracking-wider mb-4">Access Timeline</p>
                <div className="relative">
                  <div className="absolute left-[15px] top-0 bottom-0 w-px bg-[#e5e5e5]"/>
                  <div className="space-y-0">
                    <div className="relative flex gap-4 pb-5"><div className="relative z-10 w-[31px] flex justify-center shrink-0"><div className="w-7 h-7 rounded-full bg-[#e6f7ed] border-2 border-[#27AE60] flex items-center justify-center"><LogIn className="w-3 h-3 text-[#27AE60]"/></div></div><div className="flex-1 bg-[#f7fdf9] border border-[#d4f0e0] rounded-lg px-4 py-3"><div className="flex items-center justify-between mb-1"><span className="text-xs font-semibold text-[#27AE60] uppercase tracking-wide">Entry</span><span className="text-xs text-[#8a8a8a]">{log.clockIn}</span></div><div className="flex items-center gap-1.5 text-sm text-[#3a3a3a]"><MapPin className="w-3 h-3 text-[#8a8a8a] shrink-0"/><span>{log.entryPoint}</span></div></div></div>
                    {log.accessLogs.map((entry,i)=>(
                      <div key={i} className="relative flex gap-4 pb-5"><div className="relative z-10 w-[31px] flex justify-center shrink-0"><div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${entry.response==='granted'?'bg-[#e6f2ff] border-[#2666BE]':'bg-[#ffe6e6] border-[#FF4444]'}`}><Shield className={`w-3 h-3 ${entry.response==='granted'?'text-[#2666BE]':'text-[#FF4444]'}`}/></div></div><div className={`flex-1 rounded-lg px-4 py-3 border ${entry.response==='granted'?'bg-[#f5f9ff] border-[#cfe0f7]':'bg-[#fff5f5] border-[#fdd]'}`}><div className="flex items-center justify-between mb-1"><span className={`text-xs font-semibold uppercase tracking-wide ${entry.response==='granted'?'text-[#2666BE]':'text-[#FF4444]'}`}>Access {entry.response==='granted'?'Granted':'Denied'}</span><span className="text-xs text-[#8a8a8a]">{entry.time}</span></div><div className="flex items-center gap-1.5 text-sm text-[#3a3a3a]"><MapPin className="w-3 h-3 text-[#8a8a8a] shrink-0"/><span>{entry.accessPoint}</span></div></div></div>
                    ))}
                    <div className="relative flex gap-4 pb-1"><div className="relative z-10 w-[31px] flex justify-center shrink-0"><div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${log.clockOut!=='--:--'?'bg-[#fff0f0] border-[#FF4444]':'bg-[#f7f9fa] border-[#e5e5e5]'}`}><LogOut className={`w-3 h-3 ${log.clockOut!=='--:--'?'text-[#FF4444]':'text-[#c0c0c0]'}`}/></div></div><div className={`flex-1 rounded-lg px-4 py-3 border ${log.clockOut!=='--:--'?'bg-[#fff5f5] border-[#fdd]':'bg-[#f7f9fa] border-[#e5e5e5]'}`}><div className="flex items-center justify-between mb-1"><span className={`text-xs font-semibold uppercase tracking-wide ${log.clockOut!=='--:--'?'text-[#FF4444]':'text-[#8a8a8a]'}`}>{log.clockOut!=='--:--'?'Exit':'Still Inside'}</span><span className="text-xs text-[#8a8a8a]">{log.clockOut}</span></div>{log.clockOut==='--:--' && <p className="text-xs text-[#8a8a8a]">Visitor has not exited yet</p>}</div></div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      })()}
      {showAnomalies && <KPJAnomaliesModal onClose={() => setShowAnomalies(false)} />}
    </div>
  );
}
