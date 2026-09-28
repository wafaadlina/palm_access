import { useState, useRef } from 'react';
import { X, Check, Upload, FileText, AlertCircle, ChevronDown, Users, UserPlus, Download, Trash2, Search } from 'lucide-react';

// Mock employee database for cross-site lookup
const EXISTING_EMPLOYEES = [
  {
    id: 'EMP-2023-0042',
    fullName: 'Ahmad Fadzilah bin Mohd Noor',
    department: 'Research & Development',
    locationId: 'LOC-001',
    locationPayroll: 'PR-RESEARCH',
    division: 'Plant Sciences',
    employmentGroup: 'Executive',
    employmentBank: 'CIMB Bank',
    mandoran: 'MND-001',
  },
  {
    id: 'EMP-2024-0117',
    fullName: 'Nur Aisyah binti Kamaruddin',
    department: 'Administration',
    locationId: 'LOC-002',
    locationPayroll: 'PR-ADM',
    division: 'Corporate Services',
    employmentGroup: 'Non-Executive',
    employmentBank: 'Maybank',
    mandoran: 'MND-002',
  },
  {
    id: 'EMP-2022-0088',
    fullName: 'Kumar Subramaniam',
    department: 'Maintenance',
    locationId: 'LOC-001',
    locationPayroll: 'PR-OPS',
    division: 'Facilities',
    employmentGroup: 'Non-Executive',
    employmentBank: 'Public Bank',
    mandoran: 'MND-001',
  },
];

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (employee: {
    fullName: string;
    employeeId: string;
    department: string;
    role: 'field' | 'research' | 'maintenance' | 'management';
  }) => void;
  onBulkAdd?: (employees: Array<{
    fullName: string;
    employeeId: string;
    department: string;
    role: 'field' | 'research' | 'maintenance' | 'management';
  }>) => void;
}

const STAFF_PRESETS = [
  {
    role: 'field' as const,
    name: 'Field Worker',
    description: 'General field access — common areas, germination rooms, and production zones.',
    doors: ['Main Lobby Entry', 'Reception Building 2', 'Germination Room 1', 'Germination Room 2', 'Heat Chamber 3', 'Heat Chamber 4'],
    color: '#e0a000',
    bg: '#fff8e6',
  },
  {
    role: 'research' as const,
    name: 'Research Specialist',
    description: 'Full research access — all labs, cold rooms, and controlled environments.',
    doors: ['Main Lobby Entry', 'Pollen Lab', 'Bio-allergic Area', 'Cold Room 2', 'Cold Room 3', 'Reception Building 2'],
    color: '#2666BE',
    bg: '#e6f2ff',
  },
  {
    role: 'maintenance' as const,
    name: 'Maintenance',
    description: 'Maintenance access — lobbies, production areas, and utility rooms.',
    doors: ['Main Lobby Entry', 'Reception Building 2', 'Heat Chamber 3', 'Heat Chamber 4', 'Heat Chamber 5'],
    color: '#7B3FC4',
    bg: '#f0e6ff',
  },
  {
    role: 'management' as const,
    name: 'Management',
    description: 'Full site access — all buildings, labs, and restricted areas.',
    doors: ['Main Lobby Entry', 'Pollen Lab', 'Bio-allergic Area', 'Cold Room 2', 'Cold Room 3', 'Reception Building 2', 'Germination Room 1', 'Germination Room 2', 'Heat Chamber 3', 'Heat Chamber 4', 'Heat Chamber 5', 'Visitor Lobby', 'Meeting Room 1'],
    color: '#27AE60',
    bg: '#e8f8ef',
  },
];

const VALID_ROLES = ['field', 'research', 'maintenance', 'management'];
const VALID_DEPARTMENTS = ['Plantation Operations', 'Research & Development', 'Administration', 'Maintenance'];

type UploadMode = 'single' | 'bulk';

interface ParsedRow {
  fullName: string;
  department: string;
  role: string;
  valid: boolean;
  errors: string[];
}

function generateEmpId() {
  return `EMP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
}

function parseCSV(text: string): ParsedRow[] {
  const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  const header = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim().toLowerCase());
  const nameIdx = header.findIndex(h => h.includes('name'));
  const deptIdx = header.findIndex(h => h.includes('department') || h.includes('dept'));
  const roleIdx = header.findIndex(h => h.includes('role'));

  return lines.slice(1).map(line => {
    const cells = line.split(',').map(c => c.replace(/^"|"$/g, '').trim());
    const fullName = nameIdx >= 0 ? cells[nameIdx] ?? '' : '';
    const department = deptIdx >= 0 ? cells[deptIdx] ?? '' : '';
    const role = roleIdx >= 0 ? (cells[roleIdx] ?? '').toLowerCase() : '';

    const errors: string[] = [];
    if (!fullName) errors.push('Name is required');
    if (!VALID_DEPARTMENTS.includes(department)) errors.push(`Unknown department "${department}"`);
    if (!VALID_ROLES.includes(role)) errors.push(`Role must be one of: ${VALID_ROLES.join(', ')}`);

    return { fullName, department, role, valid: errors.length === 0, errors };
  });
}

function downloadTemplate() {
  const csv = [
    'Full Name,Department,Role',
    'Ahmad bin Hassan,Plantation Operations,field',
    'Dr. Sarah Chen,Research & Development,research',
    'Kumar Raj,Maintenance,maintenance',
    'Nurul Izzah,Administration,management',
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'employee-template.csv'; a.click();
  URL.revokeObjectURL(url);
}

export default function AddEmployeeModal({ isOpen, onClose, onAdd, onBulkAdd }: AddEmployeeModalProps) {
  const [mode, setMode] = useState<UploadMode>('single');

  // Single form state
  const [formData, setFormData] = useState({
    fullName: '',
    department: '',
    locationId: '',
    locationPayroll: '',
    division: '',
    employmentGroup: '',
    employmentBank: '',
    mandoran: '',
    role: '' as 'field' | 'research' | 'maintenance' | 'management' | '',
  });
  const [idSearch, setIdSearch] = useState('');
  const [foundEmployee, setFoundEmployee] = useState<typeof EXISTING_EMPLOYEES[0] | null>(null);
  const [idNotFound, setIdNotFound] = useState(false);

  function handleIdSearch(val: string) {
    setIdSearch(val);
    setIdNotFound(false);
    if (!val) {
      setFoundEmployee(null);
      setFormData(prev => ({ ...prev, fullName: '', department: '', locationId: '', locationPayroll: '', division: '', employmentGroup: '', employmentBank: '', mandoran: '' }));
      return;
    }
    const match = EXISTING_EMPLOYEES.find(e => e.id.toLowerCase() === val.trim().toLowerCase());
    if (match) {
      setFoundEmployee(match);
      setFormData(prev => ({
        ...prev,
        fullName: match.fullName,
        department: match.department,
        locationId: match.locationId,
        locationPayroll: match.locationPayroll,
        division: match.division,
        employmentGroup: match.employmentGroup,
        employmentBank: match.employmentBank,
        mandoran: match.mandoran,
      }));
    } else {
      setFoundEmployee(null);
      if (val.length >= 12) setIdNotFound(true);
    }
  }

  // Bulk state
  const [isDragging, setIsDragging] = useState(false);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [bulkSubmitted, setBulkSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validRows = parsedRows.filter(r => r.valid);
  const invalidRows = parsedRows.filter(r => !r.valid);

  function handleFile(file: File) {
    if (!file.name.endsWith('.csv')) return;
    setFileName(file.name);
    setBulkSubmitted(false);
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      setParsedRows(parseCSV(text));
    };
    reader.readAsText(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleSingleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formData.fullName && formData.department && formData.role) {
      onAdd({
        fullName: formData.fullName,
        employeeId: foundEmployee ? foundEmployee.id : generateEmpId(),
        department: formData.department,
        role: formData.role as 'field' | 'research' | 'maintenance' | 'management',
      });
      setFormData({ fullName: '', department: '', locationId: '', locationPayroll: '', division: '', employmentGroup: '', employmentBank: '', mandoran: '', role: '' });
      setIdSearch('');
      setFoundEmployee(null);
      setIdNotFound(false);
      onClose();
    }
  }

  function handleBulkSubmit() {
    if (validRows.length === 0) return;
    const employees = validRows.map(r => ({
      fullName: r.fullName,
      employeeId: generateEmpId(),
      department: r.department,
      role: r.role as 'field' | 'research' | 'maintenance' | 'management',
    }));
    if (onBulkAdd) {
      onBulkAdd(employees);
    } else {
      employees.forEach(emp => onAdd(emp));
    }
    setBulkSubmitted(true);
    setTimeout(() => {
      setParsedRows([]); setFileName(''); setBulkSubmitted(false); onClose();
    }, 1800);
  }

  function handleReset() {
    setParsedRows([]); setFileName(''); setBulkSubmitted(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#e5e5e5] px-8 py-5 flex items-center justify-between rounded-t-xl z-10">
          <div>
            <h2 className="text-xl font-semibold text-[#3a3a3a]">Add New Employee</h2>
            <p className="text-xs text-[#8a8a8a] mt-0.5">Add a single employee or upload multiple via CSV</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f7f9fa] transition-colors">
            <X className="w-5 h-5 text-[#636363]" />
          </button>
        </div>

        {/* Mode toggle */}
        <div className="px-8 pt-6 pb-2">
          <div className="inline-flex rounded-lg border border-[#e5e5e5] overflow-hidden">
            <button
              onClick={() => setMode('single')}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${mode === 'single' ? 'bg-[#F3BF3A] text-[#262626]' : 'bg-white text-[#636363] hover:bg-[#f7f9fa]'}`}
            >
              <UserPlus className="w-4 h-4" /> Single Employee
            </button>
            <button
              onClick={() => setMode('bulk')}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-l border-[#e5e5e5] transition-colors ${mode === 'bulk' ? 'bg-[#F3BF3A] text-[#262626]' : 'bg-white text-[#636363] hover:bg-[#f7f9fa]'}`}
            >
              <Users className="w-4 h-4" /> Bulk Upload
            </button>
          </div>
        </div>

        {── Single mode ──}
        {mode === 'single' && (
          <form onSubmit={handleSingleSubmit} className="px-8 pb-8 pt-4">
            {/* Employee ID search */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-[#3a3a3a] mb-2">Employee ID</label>
              <p className="text-xs text-[#8a8a8a] mb-2">Enter an existing employee ID to auto-fill their details, or leave blank to create a new employee.</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8a8a]" />
                <input
                  type="text"
                  value={idSearch}
                  onChange={e => handleIdSearch(e.target.value)}
                  placeholder="e.g. EMP-2023-0042"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                    foundEmployee ? 'border-[#27AE60] focus:ring-[#27AE60]' : idNotFound ? 'border-[#FF4444] focus:ring-[#FF4444]' : 'border-[#e5e5e5] focus:ring-[#2666BE]'
                  }`}
                />
              </div>
              {foundEmployee && (
                <div className="mt-2 p-3 bg-[#e8f8ef] border border-[#27AE60]/30 rounded-lg flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#27AE60] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[#27AE60]">Employee found — details auto-filled</p>
                    <p className="text-xs text-[#3a3a3a] mt-0.5">{foundEmployee.fullName} · {foundEmployee.department}</p>
                  </div>
                </div>
              )}
              {idNotFound && (
                <div className="mt-2 p-3 bg-[#fff3f3] border border-[#FF4444]/30 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-[#FF4444] mt-0.5 shrink-0" />
                  <p className="text-xs text-[#FF4444]">No employee found with this ID. A new employee record will be created.</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-medium text-[#3a3a3a] mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2666BE] text-sm"
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3a3a3a] mb-2">Department *</label>
                <select
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2666BE] text-sm"
                  required
                >
                  <option value="">Select department</option>
                  {VALID_DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3a3a3a] mb-2">Location ID</label>
                <input type="text" value={formData.locationId} onChange={e => setFormData({ ...formData, locationId: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2666BE] text-sm" placeholder="e.g. LOC-001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3a3a3a] mb-2">Location Payroll</label>
                <input type="text" value={formData.locationPayroll} onChange={e => setFormData({ ...formData, locationPayroll: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2666BE] text-sm" placeholder="e.g. PR-MAIN" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3a3a3a] mb-2">Division</label>
                <input type="text" value={formData.division} onChange={e => setFormData({ ...formData, division: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2666BE] text-sm" placeholder="e.g. Plant Sciences" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3a3a3a] mb-2">Employment Group</label>
                <input type="text" value={formData.employmentGroup} onChange={e => setFormData({ ...formData, employmentGroup: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2666BE] text-sm" placeholder="e.g. Executive" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3a3a3a] mb-2">Employment Bank</label>
                <input type="text" value={formData.employmentBank} onChange={e => setFormData({ ...formData, employmentBank: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2666BE] text-sm" placeholder="e.g. CIMB Bank" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3a3a3a] mb-2">Mandoran</label>
                <input type="text" value={formData.mandoran} onChange={e => setFormData({ ...formData, mandoran: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2666BE] text-sm" placeholder="e.g. MND-001" />
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-[#3a3a3a]">Access Role *</label>
                <span className="text-xs text-[#8a8a8a]">Doors are automatically assigned from the preset</span>
              </div>
              <div className="space-y-3">
                {STAFF_PRESETS.map(preset => {
                  const active = formData.role === preset.role;
                  return (
                    <button
                      key={preset.role}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: preset.role })}
                      className="w-full text-left p-4 rounded-xl border-2 transition-all"
                      style={active ? { borderColor: preset.color, backgroundColor: preset.bg + '60' } : { borderColor: '#e5e5e5', backgroundColor: '#fff' }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                          style={active ? { borderColor: preset.color, backgroundColor: preset.color } : { borderColor: '#d0d0d0' }}
                        >
                          {active && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-semibold text-[#3a3a3a] text-sm">{preset.name}</span>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: preset.bg, color: preset.color }}>
                              {preset.doors.length} doors
                            </span>
                          </div>
                          <p className="text-xs text-[#8a8a8a] mb-2">{preset.description}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {preset.doors.map(door => (
                              <span key={door} className="text-[11px] px-2.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: preset.bg, color: preset.color }}>
                                {door}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button type="button" onClick={onClose} className="px-6 py-3 border border-[#e5e5e5] rounded-full font-medium text-[#636363] hover:bg-[#f7f9fa] transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.fullName || !formData.department || !formData.role}
                className="px-6 py-3 bg-[#F3BF3A] text-[#262626] rounded-full font-medium hover:bg-[#e0ad2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Employee
              </button>
            </div>
          </form>
        )}

        {── Bulk mode ──}
        {mode === 'bulk' && (
          <div className="px-8 pb-8 pt-4">
            {/* Template download + format hint */}
            <div className="bg-[#f7f9fa] border border-[#e5e5e5] rounded-xl p-4 mb-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[#3a3a3a] mb-1">CSV Format</p>
                  <p className="text-xs text-[#8a8a8a] leading-relaxed">
                    Columns: <span className="font-mono text-[#2666BE]">Full Name</span>, <span className="font-mono text-[#2666BE]">Department</span>, <span className="font-mono text-[#2666BE]">Role</span>
                    <br />
                    Role values: <span className="font-mono text-[#636363]">field · research · maintenance · management</span>
                  </p>
                </div>
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#2666BE] text-[#2666BE] text-xs font-medium hover:bg-[#e6f2ff] transition-colors whitespace-nowrap shrink-0"
                >
                  <Download className="w-3.5 h-3.5" /> Download Template
                </button>
              </div>
            </div>

            {/* Drop zone */}
            {parsedRows.length === 0 ? (
              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl py-12 flex flex-col items-center justify-center cursor-pointer transition-all mb-5 ${
                  isDragging ? 'border-[#F3BF3A] bg-[#fdf6e2]' : 'border-[#d0d0d0] hover:border-[#F3BF3A] hover:bg-[#fdf6e2]/40'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-[#f0f0f0] flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6 text-[#8a8a8a]" />
                </div>
                <p className="text-sm font-medium text-[#3a3a3a] mb-1">Drop your CSV file here</p>
                <p className="text-xs text-[#8a8a8a]">or click to browse — .csv files only</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                />
              </div>
            ) : (
              /* Preview table */
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#8a8a8a]" />
                    <span className="text-sm font-medium text-[#3a3a3a]">{fileName}</span>
                    <span className="text-xs text-[#8a8a8a]">· {parsedRows.length} row{parsedRows.length !== 1 ? 's' : ''}</span>
                  </div>
                  <button onClick={handleReset} className="flex items-center gap-1.5 text-xs text-[#636363] hover:text-[#FF4444] transition-colors">
                    <Trash2 className="w-3.5 h-3.5" /> Remove file
                  </button>
                </div>

                {/* Summary badges */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#e8f8ef] text-[#27AE60]">
                    {validRows.length} valid
                  </span>
                  {invalidRows.length > 0 && (
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#ffe8e8] text-[#FF4444]">
                      {invalidRows.length} with errors
                    </span>
                  )}
                </div>

                <div className="border border-[#e5e5e5] rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#f7f9fa] border-b border-[#e5e5e5]">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#8a8a8a] uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#8a8a8a] uppercase tracking-wider">Department</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#8a8a8a] uppercase tracking-wider">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#8a8a8a] uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f0f0]">
                      {parsedRows.map((row, i) => (
                        <tr key={i} className={row.valid ? '' : 'bg-[#fff8f8]'}>
                          <td className="px-4 py-3 font-medium text-[#3a3a3a]">{row.fullName || <span className="text-[#c0c0c0] italic">—</span>}</td>
                          <td className="px-4 py-3 text-[#636363]">{row.department || <span className="text-[#c0c0c0] italic">—</span>}</td>
                          <td className="px-4 py-3">
                            {row.valid ? (
                              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: STAFF_PRESETS.find(p => p.role === row.role)?.bg ?? '#f0f0f0',
                                  color: STAFF_PRESETS.find(p => p.role === row.role)?.color ?? '#636363',
                                }}
                              >
                                {STAFF_PRESETS.find(p => p.role === row.role)?.name ?? row.role}
                              </span>
                            ) : (
                              <span className="text-[#c0c0c0] italic text-xs">{row.role || '—'}</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {row.valid ? (
                              <span className="flex items-center gap-1 text-[11px] font-medium text-[#27AE60]">
                                <Check className="w-3.5 h-3.5" /> Ready
                              </span>
                            ) : (
                              <div>
                                <span className="flex items-center gap-1 text-[11px] font-medium text-[#FF4444] mb-0.5">
                                  <AlertCircle className="w-3.5 h-3.5" /> Error
                                </span>
                                {row.errors.map((err, j) => (
                                  <p key={j} className="text-[10px] text-[#FF4444]">{err}</p>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button type="button" onClick={onClose} className="px-6 py-3 border border-[#e5e5e5] rounded-full font-medium text-[#636363] hover:bg-[#f7f9fa] transition-colors">
                Cancel
              </button>
              {parsedRows.length > 0 && (
                <button
                  onClick={handleBulkSubmit}
                  disabled={validRows.length === 0 || bulkSubmitted}
                  className="px-6 py-3 bg-[#F3BF3A] text-[#262626] rounded-full font-medium hover:bg-[#e0ad2f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {bulkSubmitted
                    ? <><Check className="w-4 h-4" /> {validRows.length} Employee{validRows.length !== 1 ? 's' : ''} Added</>
                    : <><Users className="w-4 h-4" /> Add {validRows.length} Employee{validRows.length !== 1 ? 's' : ''}</>
                  }
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
