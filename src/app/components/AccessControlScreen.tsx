import { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Unlock } from 'lucide-react';

type AccessResult = 'idle' | 'granted' | 'denied';

export default function AccessControlScreen() {
  const [selectedDoor, setSelectedDoor] = useState('Pollen Lab');
  const [selectedIdentity, setSelectedIdentity] = useState('');
  const [accessResult, setAccessResult] = useState<AccessResult>('idle');
  const [auditLogs, setAuditLogs] = useState([
    { name: 'Dr. Sarah Chen', door: 'Bio-allergic Area', status: 'granted', time: '14:22:15' },
    { name: 'Ahmad bin Hassan', door: 'Pollen Lab', status: 'denied', time: '14:18:03' },
  ]);

  const doors = ['Pollen Lab', 'Bio-allergic Area', 'Cold Room 3', 'Heat Chamber 3'];
  const identities = {
    'Field Workers': ['Ahmad bin Hassan', 'Siti Aminah', 'Kumar Raj'],
    'Research Specialists': ['Dr. Sarah Chen', 'Dr. Michael Wong', 'Dr. Priya Sharma']
  };

  const handleScan = () => {
    if (!selectedIdentity) return;
    const isResearcher = identities['Research Specialists'].includes(selectedIdentity);
    const result = isResearcher ? 'granted' : 'denied';
    setAccessResult(result);
    const newLog = { name: selectedIdentity, door: selectedDoor, status: result, time: new Date().toLocaleTimeString('en-GB') };
    setAuditLogs([newLog, ...auditLogs]);
    setTimeout(() => setAccessResult('idle'), 4000);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Lab Door Access Control - Zone B</h2>
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <label className="block text-sm font-medium text-[#3a3a3a] mb-2">Select Door</label>
          <select value={selectedDoor} onChange={(e) => setSelectedDoor(e.target.value)} className="w-full px-4 py-3 border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2666BE]">
            {doors.map(door => <option key={door} value={door}>{door}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#3a3a3a] mb-2">Select Identity</label>
          <select value={selectedIdentity} onChange={(e) => setSelectedIdentity(e.target.value)} className="w-full px-4 py-3 border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2666BE]">
            <option value="">Choose employee...</option>
            {Object.entries(identities).map(([group, names]) => (
              <optgroup key={group} label={group}>
                {names.map(name => <option key={name} value={name}>{name}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-[#e5e5e5] p-8">
          <h3 className="text-lg font-semibold mb-6">Palm Scanner - {selectedDoor}</h3>
          <div className="flex flex-col items-center">
            <motion.div
              className={`w-64 h-64 rounded-full flex items-center justify-center ${
                accessResult === 'granted' ? 'bg-[#00e4aa]' : accessResult === 'denied' ? 'bg-[#ff4444]' : 'bg-[#f7f9fa]'
              }`}
              animate={accessResult !== 'idle' ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <div className={`w-56 h-56 rounded-full border-4 flex items-center justify-center ${
                accessResult === 'granted' ? 'border-white bg-[#00e4aa]' : accessResult === 'denied' ? 'border-white bg-[#ff4444]' : 'border-[#e5e5e5] bg-white'
              }`}>
                <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none">
                  <path d="M50 20 C60 20, 70 30, 70 40 L70 60 C70 70, 60 80, 50 80 C40 80, 30 70, 30 60 L30 40 C30 30, 40 20, 50 20" stroke={accessResult !== 'idle' ? 'white' : '#d0d0d0'} strokeWidth="2" fill="none" />
                  <circle cx="50" cy="35" r="3" fill={accessResult !== 'idle' ? 'white' : '#d0d0d0'} />
                  <circle cx="45" cy="45" r="2" fill={accessResult !== 'idle' ? 'white' : '#d0d0d0'} />
                  <circle cx="55" cy="45" r="2" fill={accessResult !== 'idle' ? 'white' : '#d0d0d0'} />
                  <circle cx="50" cy="55" r="2" fill={accessResult !== 'idle' ? 'white' : '#d0d0d0'} />
                  <circle cx="50" cy="65" r="2" fill={accessResult !== 'idle' ? 'white' : '#d0d0d0'} />
                </svg>
              </div>
            </motion.div>
            <button onClick={handleScan} disabled={!selectedIdentity} className="mt-6 bg-[#2666BE] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#1f5399] transition-colors disabled:opacity-50">Simulate Scan</button>
          </div>
          {accessResult !== 'idle' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-lg ${ accessResult === 'granted' ? 'bg-[#e6fff8] border border-[#00e4aa]' : 'bg-[#ffe6e6] border border-[#ff4444]' }`}>
              <div className="flex items-center gap-3 mb-2">
                {accessResult === 'granted' ? <Unlock className="w-6 h-6 text-[#00e4aa]" /> : <Lock className="w-6 h-6 text-[#ff4444]" />}
                <h4 className={`font-semibold ${ accessResult === 'granted' ? 'text-[#00e4aa]' : 'text-[#ff4444]' }`}>{accessResult === 'granted' ? 'Access Granted' : 'Access Denied'}</h4>
              </div>
              <p className="text-sm text-[#3a3a3a]">{accessResult === 'granted' ? 'EM lock released. Door open for 5 seconds.' : 'Field Worker has no lab clearance. Door remains locked.'}</p>
            </motion.div>
          )}
        </div>
        <div className="bg-white rounded-xl border border-[#e5e5e5] p-8">
          <h3 className="text-lg font-semibold mb-6">Audit Log</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {auditLogs.map((log, index) => (
              <motion.div key={index} initial={index === 0 ? { opacity: 0, y: -20 } : {}} animate={index === 0 ? { opacity: 1, y: 0 } : {}} className="flex items-center justify-between p-4 rounded-lg bg-[#f7f9fa] border border-[#e5e5e5]">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${ log.status === 'granted' ? 'bg-[#00e4aa]' : 'bg-[#ff4444]' }`}></div>
                  <div>
                    <p className="font-medium text-[#3a3a3a]">{log.name}</p>
                    <p className="text-sm text-[#8a8a8a]">{log.door}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[#2666BE]">{log.time}</p>
                  <p className={`text-xs ${ log.status === 'granted' ? 'text-[#00e4aa]' : 'text-[#ff4444]' }`}>{log.status === 'granted' ? 'Granted' : 'Denied'}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
