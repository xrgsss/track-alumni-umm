import { useState, useEffect } from 'react';
import { FileText, Search, Filter, Calendar } from 'lucide-react';
import api from '../api/axios';

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now since we don't have an endpoint for this yet
    const mockLogs = [
      { id: 1, action: 'Import Data', user: 'admin', target: 'Excel Alumni 2023', timestamp: '2024-04-28 10:00', status: 'Success' },
      { id: 2, action: 'Update Alumni', user: 'admin', target: 'Budi Santoso', timestamp: '2024-04-28 09:45', status: 'Success' },
      { id: 3, action: 'Export Data', user: 'admin', target: 'PDF Report', timestamp: '2024-04-28 09:30', status: 'Success' },
      { id: 4, action: 'Delete Alumni', user: 'admin', target: 'Ani Wijaya', timestamp: '2024-04-28 08:20', status: 'Failed' },
      { id: 5, action: 'Login', user: 'admin', target: '-', timestamp: '2024-04-28 08:00', status: 'Success' },
    ];
    setLogs(mockLogs);
    setLoading(false);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-gray-500 font-medium">Log aktivitas sistem pelacakan alumni</h2>
        </div>
      </div>

      <div className="bg-[#1e293b] rounded-[24px] overflow-hidden shadow-2xl border border-white/5">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input 
              type="text" 
              placeholder="Cari aktivitas..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 text-white/70 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
              <Filter size={18} />
              Filter
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 text-white/70 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
              <Calendar size={18} />
              Rentang Waktu
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5">
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Aksi</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Target</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Waktu</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-white font-bold">{log.action}</span>
                  </td>
                  <td className="px-6 py-4 text-white/60">{log.user}</td>
                  <td className="px-6 py-4 text-white/60">{log.target}</td>
                  <td className="px-6 py-4 text-white/60">{log.timestamp}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      log.status === 'Success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 border-t border-white/5 flex justify-center">
          <button className="text-primary font-bold text-sm hover:underline">Lihat semua log aktivitas</button>
        </div>
      </div>
    </div>
  );
};

export default AuditLog;
