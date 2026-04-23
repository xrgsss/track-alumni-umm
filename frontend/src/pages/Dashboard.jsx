import { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
  Users, 
  Phone, 
  Briefcase, 
  TrendingUp, 
  Award, 
  CheckCircle2 
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/alumni?limit=1000');
        const alumni = response.data;
        
        const total = alumni.length;
        const contactFilled = alumni.filter(a => a.contact && (a.contact.email || a.contact.no_hp)).length;
        const careerFilled = alumni.filter(a => a.career && a.career.tempat_kerja).length;
        
        setStats({ total, contactFilled, careerFilled });

        // Process chart data for graduation year
        const yearMap = {};
        const facultyMap = {};
        
        alumni.forEach(a => {
          const year = a.tahun_masuk + 4; // Simplified graduation year
          yearMap[year] = (yearMap[year] || 0) + 1;
          
          facultyMap[a.fakultas] = (facultyMap[a.fakultas] || 0) + 1;
        });

        const formattedChartData = Object.keys(yearMap).sort().map(year => ({
          year,
          count: yearMap[year]
        }));
        
        const COLORS = ['#1e3a8a', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
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

    fetchData();
  }, []);

  const statCards = [
    { title: 'Total Alumni', value: stats.total, icon: Users, color: 'blue' },
    { title: 'Kelengkapan Kontak', value: `${((stats.contactFilled / stats.total) * 100 || 0).toFixed(1)}%`, icon: Phone, color: 'green' },
    { title: 'Kelengkapan Karier', value: `${((stats.careerFilled / stats.total) * 100 || 0).toFixed(1)}%`, icon: Briefcase, color: 'purple' },
  ];

  if (loading) return <div className="animate-pulse space-y-6">
    <div className="h-10 w-48 bg-gray-200 rounded-lg mb-8"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="h-32 bg-gray-200 rounded-xl"></div>
      <div className="h-32 bg-gray-200 rounded-xl"></div>
      <div className="h-32 bg-gray-200 rounded-xl"></div>
    </div>
  </div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Ringkasan Alumni</h1>
        <p className="text-gray-500 mt-1">Pantau perkembangan data dan statistik alumni UMM</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const colors = {
            blue: 'bg-blue-50 text-blue-600 border-blue-100',
            green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            purple: 'bg-violet-50 text-violet-600 border-violet-100',
          };
          return (
            <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[card.color]} border`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            Alumni per Tahun Lulus
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" fill="#1e3a8a" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Award size={20} className="text-primary" />
            Distribusi per Fakultas
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={facultyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {facultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
