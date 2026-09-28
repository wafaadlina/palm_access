import { useState } from 'react';
import { motion } from 'motion/react';

export default function ClockInScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [verificationTime, setVerificationTime] = useState('');
  const [logs, setLogs] = useState([
    { name: 'Ahmad bin Hassan', time: '08:52:34', location: 'Main Gate' },
    { name: 'Siti Aminah', time: '08:48:12', location: 'Building A' },
    { name: 'Kumar Raj', time: '08:45:03', location: 'Main Gate' },
  ]);

  const handleScan = () => {
    setIsScanning(true);
    setScanComplete(false);

    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      setVerificationTime('0.38s');

      const newLog = {
        name: 'Nabilah Azman',
        time: new Date().toLocaleTimeString('en-GB'),
        location: 'Main Gate'
      };
      setLogs([newLog, ...logs]);

      setTimeout(() => {
        setScanComplete(false);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Palm Clock-in - Reception Kiosk</h2>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-[#e5e5e5] p-8">
          <h3 className="text-lg font-semibold mb-6">Palm Scanner Terminal</h3>

          <div className="flex flex-col items-center">
            <div className="relative">
              <motion.div
                className={`w-64 h-64 rounded-full flex items-center justify-center ${
                  scanComplete ? 'bg-[#00e4aa]' : isScanning ? 'bg-[#F3BF3A]' : 'bg-[#f7f9fa]'
                }`}
                animate={isScanning ? {
                  scale: [1, 1.05, 1],
                  opacity: [0.6, 1, 0.6]
                } : {}}
                transition={{
                  duration: 1.5,
                  repeat: isScanning ? Infinity : 0,
                  ease: "easeInOut"
                }}
              >
                <div className={`w-56 h-56 rounded-full border-4 flex items-center justify-center ${
                  scanComplete ? 'border-white bg-[#00e4aa]' : isScanning ? 'border-white bg-[#F3BF3A]' : 'border-[#e5e5e5] bg-white'
                }`}>
                  <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none">
                    <path d="M50 20 C60 20, 70 30, 70 40 L70 60 C70 70, 60 80, 50 80 C40 80, 30 70, 30 60 L30 40 C30 30, 40 20, 50 20"
                      stroke={scanComplete ? 'white' : isScanning ? 'white' : '#d0d0d0'}
                      strokeWidth="2"
                      fill="none"
                    />
                    <circle cx="50" cy="35" r="3" fill={scanComplete ? 'white' : isScanning ? 'white' : '#d0d0d0'} />
                    <circle cx="45" cy="45" r="2" fill={scanComplete ? 'white' : isScanning ? 'white' : '#d0d0d0'} />
                    <circle cx="55" cy="45" r="2" fill={scanComplete ? 'white' : isScanning ? 'white' : '#d0d0d0'} />
                    <circle cx="50" cy="55" r="2" fill={scanComplete ? 'white' : isScanning ? 'white' : '#d0d0d0'} />
                    <circle cx="50" cy="65" r="2" fill={scanComplete ? 'white' : isScanning ? 'white' : '#d0d0d0'} />
                  </svg>
                </div>
              </motion.div>
            </div>

            <div className="mt-6 text-center">
              {scanComplete && (
                <p className="text-[#00e4aa] font-semibold mb-2">Verified in {verificationTime}</p>
              )}
              {isScanning && (
                <p className="text-[#F3BF3A] font-semibold mb-2">Scanning...</p>
              )}
              {!isScanning && !scanComplete && (
                <p className="text-[#8a8a8a] mb-2">Ready to scan</p>
              )}
            </div>

            <button
              onClick={handleScan}
              disabled={isScanning}
              className="mt-4 bg-[#2666BE] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#1f5399] transition-colors disabled:opacity-50"
            >
              Simulate Scan
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e5e5e5] p-8">
          <h3 className="text-lg font-semibold mb-6">Live Clock-in Log</h3>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <motion.div
                key={index}
                initial={index === 0 ? { opacity: 0, y: -20 } : {}}
                animate={index === 0 ? { opacity: 1, y: 0 } : {}}
                className="flex items-center justify-between p-4 rounded-lg bg-[#f7f9fa] border border-[#e5e5e5]"
              >
                <div>
                  <p className="font-medium text-[#3a3a3a]">{log.name}</p>
                  <p className="text-sm text-[#8a8a8a]">{log.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[#2666BE]">{log.time}</p>
                  <div className="flex items-center gap-2 justify-end mt-1">
                    <div className="w-2 h-2 bg-[#00e4aa] rounded-full"></div>
                    <span className="text-xs text-[#8a8a8a]">Clocked In</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
