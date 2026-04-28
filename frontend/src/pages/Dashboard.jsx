import { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
  Users, 
  Phone, 
  Briefcase, 
  TrendingUp, 
  RefreshCcw,
  UserCheck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    contactFilled: 0,
    careerFilled: 0
  });
  const [chartData, setChartData] = useState([]);
  const [facultyData, setFacultyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/alumni?limit=1000');
      const alumni = response.data;
      
      const total = alumni.length;
      const contactFilled = alumni.filter(a => a.contact && (a.contact.email || a.contact.no_hp)).length;
      const careerFilled = alumni.filter(a => a.career && a.career.tempat_kerja).length;
      
      setStats({ total, contactFilled, careerFilled });

      const yearMap = {};
      const facultyMap = {};
      
      alumni.forEach(a => {
        const year = a.tahun_masuk + 4;
        yearMap[year] = (yearMap[year] || 0) + 1;
        
        if (a.fakultas) {
          facultyMap[a.fakultas] = (facultyMap[a.fakultas] || 0) + 1;
        }
      });

      const formattedChartData = Object.keys(yearMap).sort().map(year => ({
        year,
        count: yearMap[year]
      }));
      
      const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#84cc16'];
      const formattedFacultyData = Object.keys(facultyMap).map((name, index) => ({
        name,
        value: facultyMap[name],
        color: COLORS[index % COLORS.length]
      }));

      setChartData(formattedChartData);
      setFacultyData(formattedFacultyData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const contactPercent = Math.round((stats.contactFilled / stats.total) * 100) || 0;
  const careerPercent = Math.round((stats.careerFilled / stats.total) * 100) || 0;
  const overallPercent = Math.round((contactPercent + careerPercent) / 2);

  const statCards = [
    { 
      title: 'TOTAL ALUMNI', 
      value: stats.total.toLocaleString('id-ID'), 
      sub: 'Seluruh angkatan',
      icon: Users, 
      bgColor: 'bg-[#2d3a54]' 
    },
    { 
      title: 'DATA KONTAK', 
      value: `${contactPercent}%`, 
      sub: `${stats.contactFilled} alumni`,
      icon: Phone, 
      bgColor: 'bg-[#1a2e2e]' 
    },
    { 
      title: 'DATA KARIER', 
      value: `${careerPercent}%`, 
      sub: `${stats.careerFilled} alumni`,
      icon: Briefcase, 
      bgColor: 'bg-[#2d284a]' 
    },
    { 
      title: 'KELENGKAPAN DATA', 
      value: `${overallPercent}%`, 
      sub: 'Rata-rata kontak + karier',
      icon: TrendingUp, 
      bgColor: 'bg-[#3b2f1a]' 
    },
  ];

  if (loading && stats.total === 0) return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <RefreshCcw className="w-12 h-12 text-primary animate-spin mb-4" />
      <p className="text-gray-500 font-medium">Memuat data statistik...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-gray-500 font-medium">Ringkasan data alumni UMM</h2>
        </div>
        <button 
          onClick={fetchData}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#1e293b] text-white rounded-xl font-bold hover:bg-[#334155] transition-all shadow-lg"
        >
          <RefreshCcw size={18} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className={`${card.bgColor} p-6 rounded-[24px] text-white shadow-xl flex justify-between items-start border border-white/5`}>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-white/60 tracking-widest uppercase">{card.title}</p>
                <p className="text-4xl font-extrabold tracking-tight">{card.value}</p>
                <p className="text-xs text-white/50">{card.sub}</p>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl">
                <Icon size={24} className="text-white/80" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Completeness Section */}
      <div className="bg-[#1e293b] p-8 rounded-[24px] text-white shadow-2xl border border-white/5">
        <h3 className="text-xs font-bold tracking-widest text-white/60 mb-8 uppercase">TINGKAT KELENGKAPAN</h3>
        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-white/70">Data Kontak (email, HP, sosmed)</span>
              <span className="text-sm font-bold">{contactPercent}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${contactPercent}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-white/70">Data Karier (pekerjaan, posisi)</span>
              <span className="text-sm font-bold">{careerPercent}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${careerPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-7 bg-[#1e293b] p-8 rounded-[24px] text-white shadow-2xl border border-white/5">
          <h3 className="text-xs font-bold tracking-widest text-white/60 mb-8 uppercase">ALUMNI PER TAHUN LULUS</h3>
          <div className="h-[300px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="year" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600}} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600}} 
                  />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff'}}
                  />
                  <Bar dataKey="count" fill="#0061f2" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-white/30 text-sm font-medium">Tidak ada data</div>
            )}
          </div>
        </div>

        {/* Donut Chart */}
        <div className="lg:col-span-5 bg-[#1e293b] p-8 rounded-[24px] text-white shadow-2xl border border-white/5">
          <h3 className="text-xs font-bold tracking-widest text-white/60 mb-8 uppercase">DISTRIBUSI PER FAKULTAS</h3>
          <div className="h-[300px] w-full flex flex-col">
            <ResponsiveContainer width="100%" height="220">
              <PieChart>
                <Pie
                  data={facultyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {facultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff'}}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2 max-h-[80px] overflow-y-auto no-scrollbar">
              {facultyData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-[10px] font-bold text-white/60 truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
