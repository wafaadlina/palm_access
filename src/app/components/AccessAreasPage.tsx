import { useState } from 'react';
import { Plus, ChevronDown, ChevronRight, Wifi, WifiOff, Battery, BatteryWarning, Trash2, Edit2, X } from 'lucide-react';

type Door = {
  id: string;
  name: string;
  deviceName: string | null;
  battery: number | null;
  connected: boolean;
  direction: 'entry' | 'exit' | 'both';
};

type Building = {
  id: string;
  name: string;
  description: string;
  doors: Door[];
};

const initialBuildings: Building[] = [
  {
    id: 'b1', name: 'Block A', description: 'Administrative offices and HR',
    doors: [
      { id: 'd1', name: 'Main Entrance', deviceName: 'PalmScan-A01', battery: 87, connected: true, direction: 'both' },
      { id: 'd2', name: 'Floor 2 East', deviceName: 'PalmScan-A02', battery: 92, connected: true, direction: 'both' },
      { id: 'd3', name: 'Floor 1 West', deviceName: 'PalmScan-A03', battery: 45, connected: true, direction: 'entry' },
      { id: 'd4', name: 'Visitor Lobby', deviceName: 'PalmScan-A04', battery: 78, connected: false, direction: 'both' },
    ],
  },
  {
    id: 'b2', name: 'Block B', description: 'IT and server infrastructure',
    doors: [
      { id: 'd5', name: 'Server Room', deviceName: 'PalmScan-B01', battery: 14, connected: true, direction: 'both' },
      { id: 'd6', name: 'Meeting Room B', deviceName: 'PalmScan-B02', battery: 60, connected: true, direction: 'entry' },
    ],
  },
  {
    id: 'b3', name: 'Block C', description: 'Research and development laboratory',
    doors: [
      { id: 'd7', name: 'Lab Access', deviceName: 'PalmScan-C01', battery: 65, connected: true, direction: 'both' },
      { id: 'd8', name: 'Chemical Storage', deviceName: null, battery: null, connected: false, direction: 'entry' },
    ],
  },
];

type AddBuildingModal = { open: boolean };
type AddDoorModal = { open: boolean; buildingId: string | null };

function DirectionBadge({ dir }: { dir: 'entry' | 'exit' | 'both' }) {
  const styles = {
    entry: 'bg-[#e8f8ef] text-[#27AE60]',
    exit: 'bg-[#fff3e0] text-[#F39C12]',
    both: 'bg-[#e6f2ff] text-[#2666BE]',
  };
  return <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${styles[dir]}`} style={{ fontFamily: "'Poppins', sans-serif" }}>{dir === 'both' ? 'Entry & Exit' : dir.charAt(0).toUpperCase() + dir.slice(1)}</span>;
}

export default function AccessAreasPage() {
  const [buildings, setBuildings] = useState<Building[]>(initialBuildings);
  const [expandedBuildings, setExpandedBuildings] = useState<Set<string>>(new Set(['b1']));
  const [addBuilding, setAddBuilding] = useState<AddBuildingModal>({ open: false });
  const [addDoor, setAddDoor] = useState<AddDoorModal>({ open: false, buildingId: null });

  // Form state
  const [bName, setBName] = useState('');
  const [bDesc, setBDesc] = useState('');
  const [dName, setDName] = useState('');
  const [dDir, setDDir] = useState<'entry' | 'exit' | 'both'>('both');
  const [dDevice, setDDevice] = useState('');

  function toggleBuilding(id: string) {
    setExpandedBuildings(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function addBuildingSubmit() {
    if (!bName.trim()) return;
    setBuildings(prev => [...prev, { id: `b${Date.now()}`, name: bName, description: bDesc, doors: [] }]);
    setBName(''); setBDesc('');
    setAddBuilding({ open: false });
  }

  function addDoorSubmit() {
    if (!dName.trim() || !addDoor.buildingId) return;
    setBuildings(prev => prev.map(b => b.id === addDoor.buildingId
      ? { ...b, doors: [...b.doors, { id: `d${Date.now()}`, name: dName, deviceName: dDevice || null, battery: dDevice ? 100 : null, connected: !!dDevice, direction: dDir }] }
      : b
    ));
    setDName(''); setDDir('both'); setDDevice('');
    setAddDoor({ open: false, buildingId: null });
  }

  function deleteBuilding(id: string) {
    setBuildings(prev => prev.filter(b => b.id !== id));
  }

  function deleteDoor(buildingId: string, doorId: string) {
    setBuildings(prev => prev.map(b => b.id === buildingId ? { ...b, doors: b.doors.filter(d => d.id !== doorId) } : b));
  }

  const totalDoors = buildings.reduce((s, b) => s + b.doors.length, 0);
  const onlineDoors = buildings.flatMap(b => b.doors).filter(d => d.connected).length;
  const warningDoors = buildings.flatMap(b => b.doors).filter(d => d.battery !== null && d.battery < 20).length;
  const noDoorDevice = buildings.flatMap(b => b.doors).filter(d => !d.deviceName).length;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header + stats */}
      <div className="px-8 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[16px] font-semibold text-[#3a3a3a]" style={{ fontFamily: "'Poppins', sans-serif" }}>Access Areas</h2>
            <p className="text-[12px] text-[#8a8a8a]" style={{ fontFamily: "'Poppins', sans-serif" }}>{buildings.length} buildings · {totalDoors} doors</p>
          </div>
          <button
            onClick={() => setAddBuilding({ open: true })}
            className="flex items-center gap-2 bg-[#F3BF3A] hover:bg-[#e0ae2a] text-[#3a3a3a] font-semibold text-[13px] px-5 py-2.5 rounded-full transition-colors"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <Plus className="w-4 h-4" /> Add Building
          </button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Buildings', value: buildings.length, color: '#3a3a3a', bg: '#f7f9fa' },
            { label: 'Total Doors', value: totalDoors, color: '#3a3a3a', bg: '#f7f9fa' },
            { label: 'Doors Online', value: onlineDoors, color: '#27AE60', bg: '#e8f8ef' },
            { label: 'Low Battery', value: warningDoors, color: warningDoors > 0 ? '#E74C3C' : '#3a3a3a', bg: warningDoors > 0 ? '#fdecea' : '#f7f9fa' },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl border border-[#e5e5e5] p-3 flex flex-col gap-0.5" style={{ backgroundColor: stat.bg }}>
              <span className="text-[20px] font-semibold" style={{ color: stat.color, fontFamily: "'Poppins', sans-serif" }}>{stat.value}</span>
              <span className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: "'Poppins', sans-serif" }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Buildings list */}
      <div className="flex-1 overflow-y-auto px-8 pb-8 flex flex-col gap-4">
        {buildings.map(building => {
          const isExpanded = expandedBuildings.has(building.id);
          const onlineCount = building.doors.filter(d => d.connected).length;
          const warnCount = building.doors.filter(d => d.battery !== null && d.battery < 20).length;

          return (
            <div key={building.id} className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden">
              {/* Building header */}
              <div className="flex items-center gap-4 px-6 py-4">
                <button
                  onClick={() => toggleBuilding(building.id)}
                  className="flex items-center gap-3 flex-1 min-w-0 text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#fdf6e2] flex items-center justify-center shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="#F3BF3A" strokeWidth="2"/>
                      <path d="M9 22V12h6v10M3 9h18" stroke="#F3BF3A" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-[#3a3a3a]" style={{ fontFamily: "'Poppins', sans-serif" }}>{building.name}</p>
                    <p className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: "'Poppins', sans-serif" }}>{building.description} · {building.doors.length} door{building.doors.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex items-center gap-3 mr-4">
                    <span className="text-[11px] text-[#27AE60] font-medium">{onlineCount}/{building.doors.length} online</span>
                    {warnCount > 0 && <span className="text-[11px] text-[#E74C3C] font-medium">{warnCount} low bat.</span>}
                  </div>
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-[#8a8a8a] shrink-0" /> : <ChevronRight className="w-4 h-4 text-[#8a8a8a] shrink-0" />}
                </button>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => { setAddDoor({ open: true, buildingId: building.id }); }}
                    className="flex items-center gap-1.5 text-[12px] font-medium text-[#2666BE] bg-[#e6f2ff] hover:bg-[#d0e8ff] px-3 py-1.5 rounded-full transition-colors"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Door
                  </button>
                  <button onClick={() => deleteBuilding(building.id)} className="w-7 h-7 rounded-full hover:bg-[#fdecea] flex items-center justify-center transition-colors group">
                    <Trash2 className="w-3.5 h-3.5 text-[#c0c0c0] group-hover:text-[#E74C3C]" />
                  </button>
                </div>
              </div>

              {/* Doors */}
              {isExpanded && (
                <div className="border-t border-[#f0f0f0]">
                  {/* Table header */}
                  <div className="grid grid-cols-[1fr_160px_100px_140px_80px] bg-[#fafafa] px-6 py-2.5 border-b border-[#f0f0f0]">
                    {['Door / Access Point', 'Device', 'Status', 'Battery', ''].map((h, i) => (
                      <span key={i} className="text-[10px] font-semibold text-[#8a8a8a] uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>{h}</span>
                    ))}
                  </div>

                  {building.doors.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-[13px] text-[#8a8a8a]" style={{ fontFamily: "'Poppins', sans-serif" }}>No doors added yet.</p>
                      <button
                        onClick={() => setAddDoor({ open: true, buildingId: building.id })}
                        className="mt-2 text-[12px] text-[#2666BE] hover:underline"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Add the first door
                      </button>
                    </div>
                  ) : (
                    building.doors.map(door => (
                      <div key={door.id} className="grid grid-cols-[1fr_160px_100px_140px_80px] px-6 py-3.5 border-b border-[#f0f0f0] last:border-0 hover:bg-[#f9f9f9] transition-colors">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[13px] font-medium text-[#3a3a3a]" style={{ fontFamily: "'Poppins', sans-serif" }}>{door.name}</span>
                          <DirectionBadge dir={door.direction} />
                        </div>

                        <div className="flex items-center">
                          {door.deviceName ? (
                            <span className="text-[12px] text-[#636363]" style={{ fontFamily: "'Poppins', sans-serif" }}>{door.deviceName}</span>
                          ) : (
                            <span className="text-[11px] text-[#8a8a8a] bg-[#f0f0f0] px-2 py-0.5 rounded-full">No device</span>
                          )}
                        </div>

                        <div className="flex items-center">
                          {door.connected
                            ? <span className="flex items-center gap-1 text-[11px] text-[#27AE60] font-medium"><Wifi className="w-3 h-3" />Online</span>
                            : door.deviceName
                              ? <span className="flex items-center gap-1 text-[11px] text-[#E74C3C] font-medium"><WifiOff className="w-3 h-3" />Offline</span>
                              : <span className="text-[11px] text-[#8a8a8a]">—</span>
                          }
                        </div>

                        <div className="flex items-center">
                          {door.battery !== null ? (
                            <div className="flex items-center gap-1.5">
                              {door.battery < 20
                                ? <BatteryWarning className="w-3.5 h-3.5 text-[#E74C3C]" />
                                : <Battery className="w-3.5 h-3.5 text-[#8a8a8a]" />}
                              <div className="w-14 h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${door.battery}%`,
                                    backgroundColor: door.battery < 20 ? '#E74C3C' : door.battery < 40 ? '#F39C12' : '#27AE60',
                                  }}
                                />
                              </div>
                              <span
                                className="text-[11px] font-medium"
                                style={{ color: door.battery < 20 ? '#E74C3C' : door.battery < 40 ? '#F39C12' : '#27AE60', fontFamily: "'Poppins', sans-serif" }}
                              >
                                {door.battery}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-[#8a8a8a]">—</span>
                          )}
                        </div>

                        <div className="flex items-center justify-end gap-1">
                          <button className="w-7 h-7 rounded-full hover:bg-[#f0f0f0] flex items-center justify-center transition-colors">
                            <Edit2 className="w-3.5 h-3.5 text-[#8a8a8a]" />
                          </button>
                          <button onClick={() => deleteDoor(building.id, door.id)} className="w-7 h-7 rounded-full hover:bg-[#fdecea] flex items-center justify-center transition-colors group">
                            <Trash2 className="w-3.5 h-3.5 text-[#c0c0c0] group-hover:text-[#E74C3C]" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Building Modal */}
      {addBuilding.open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={() => setAddBuilding({ open: false })}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[16px] font-semibold text-[#3a3a3a]" style={{ fontFamily: "'Poppins', sans-serif" }}>Add Building</h2>
              <button onClick={() => setAddBuilding({ open: false })} className="w-8 h-8 rounded-full hover:bg-[#f0f0f0] flex items-center justify-center">
                <X className="w-4 h-4 text-[#636363]" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[12px] font-medium text-[#636363] mb-1.5 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Building Name *</label>
                <input value={bName} onChange={e => setBName(e.target.value)} placeholder="e.g. Block D" className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-xl text-[13px] outline-none focus:border-[#F3BF3A] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }} />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[#636363] mb-1.5 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Description</label>
                <input value={bDesc} onChange={e => setBDesc(e.target.value)} placeholder="e.g. Operations wing" className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-xl text-[13px] outline-none focus:border-[#F3BF3A] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setAddBuilding({ open: false })} className="flex-1 py-2.5 rounded-full border border-[#e5e5e5] text-[13px] text-[#636363] hover:bg-[#f7f9fa] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>Cancel</button>
              <button onClick={addBuildingSubmit} className="flex-1 py-2.5 rounded-full bg-[#F3BF3A] hover:bg-[#e0ae2a] text-[#3a3a3a] font-semibold text-[13px] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>Add Building</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Door Modal */}
      {addDoor.open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={() => setAddDoor({ open: false, buildingId: null })}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-[16px] font-semibold text-[#3a3a3a]" style={{ fontFamily: "'Poppins', sans-serif" }}>Add Door</h2>
                <p className="text-[12px] text-[#8a8a8a] mt-0.5">{buildings.find(b => b.id === addDoor.buildingId)?.name}</p>
              </div>
              <button onClick={() => setAddDoor({ open: false, buildingId: null })} className="w-8 h-8 rounded-full hover:bg-[#f0f0f0] flex items-center justify-center">
                <X className="w-4 h-4 text-[#636363]" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[12px] font-medium text-[#636363] mb-1.5 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Door / Access Point Name *</label>
                <input value={dName} onChange={e => setDName(e.target.value)} placeholder="e.g. Stairwell Gate" className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-xl text-[13px] outline-none focus:border-[#F3BF3A] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }} />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[#636363] mb-1.5 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Access Direction</label>
                <div className="flex gap-2">
                  {(['both', 'entry', 'exit'] as const).map(dir => (
                    <button
                      key={dir}
                      onClick={() => setDDir(dir)}
                      className={`flex-1 py-2 rounded-xl text-[12px] font-medium border transition-colors capitalize ${dDir === dir ? 'bg-[#fdf6e2] border-[#F3BF3A] text-[#3a3a3a]' : 'border-[#e5e5e5] text-[#636363] hover:bg-[#f7f9fa]'}`}
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {dir === 'both' ? 'Entry & Exit' : dir}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[12px] font-medium text-[#636363] mb-1.5 block" style={{ fontFamily: "'Poppins', sans-serif" }}>Assign Device (optional)</label>
                <input value={dDevice} onChange={e => setDDevice(e.target.value)} placeholder="e.g. PalmScan-D01" className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-xl text-[13px] outline-none focus:border-[#F3BF3A] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setAddDoor({ open: false, buildingId: null })} className="flex-1 py-2.5 rounded-full border border-[#e5e5e5] text-[13px] text-[#636363] hover:bg-[#f7f9fa] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>Cancel</button>
              <button onClick={addDoorSubmit} className="flex-1 py-2.5 rounded-full bg-[#F3BF3A] hover:bg-[#e0ae2a] text-[#3a3a3a] font-semibold text-[13px] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>Add Door</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
