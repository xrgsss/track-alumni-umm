import { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit3, 
  CheckCircle2, 
  XCircle,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';
import EditModal from '../components/EditModal';

const AlumniList = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    fakultas: '',
    prodi: '',
    tahun: ''
  });
  const [page, setPage] = useState(1);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        skip: (page - 1) * 50,
        limit: 50,
        ...(search && { search }),
        ...(filters.fakultas && { fakultas: filters.fakultas }),
        ...(filters.prodi && { prodi: filters.prodi }),
        ...(filters.tahun && { tahun: filters.tahun }),
      });
      const response = await api.get(`/alumni?${params.toString()}`);
      setAlumni(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const openEditModal = (item) => {
    setSelectedAlumni(item);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Database Alumni</h1>
          <p className="text-gray-500">Kelola dan perbarui data profil alumni</p>
        </div>
      </header>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari Nama atau NIM..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        
        <div className="flex flex-wrap gap-2">
          <select 
            className="px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
            value={filters.fakultas}
            onChange={(e) => setFilters({...filters, fakultas: e.target.value})}
          >
            <option value="">Semua Fakultas</option>
            <option value="Teknik">Teknik</option>
            <option value="Ekonomi & Bisnis">Ekonomi & Bisnis</option>
            <option value="Kedokteran">Kedokteran</option>
            <option value="Hukum">Hukum</option>
          </select>
          
          <select 
            className="px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
            value={filters.tahun}
            onChange={(e) => setFilters({...filters, tahun: e.target.value})}
          >
            <option value="">Tahun Lulus</option>
            {[...Array(26)].map((_, i) => (
              <option key={i} value={2000 + i}>{2000 + i}</option>
            ))}
          </select>

          <button 
            onClick={() => {setSearch(''); setFilters({fakultas: '', prodi: '', tahun: ''}); setPage(1);}}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Alumni</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Prodi / Fakultas</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Lulus</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-6 py-4 h-16 bg-gray-50/50"></td>
                  </tr>
                ))
              ) : alumni.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">Data tidak ditemukan</td>
                </tr>
              ) : (
                alumni.map((item) => (
                  <tr key={item.nim} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{item.nama}</div>
                      <div className="text-xs text-gray-500">{item.nim}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{item.prodi}</div>
                      <div className="text-xs text-gray-400">{item.fakultas}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {item.tahun_masuk + 4}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-4">
                        <div className="flex flex-col items-center gap-1">
                          {item.contact ? <CheckCircle2 className="text-emerald-500" size={18} /> : <XCircle className="text-gray-300" size={18} />}
                          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Kontak</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          {item.career ? <CheckCircle2 className="text-emerald-500" size={18} /> : <XCircle className="text-gray-300" size={18} />}
                          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Karier</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => openEditModal(item)}
                        className="p-2 text-primary hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit3 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Menampilkan <span className="font-medium text-gray-900">{alumni.length}</span> data
          </p>
          <div className="flex gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => setPage(page + 1)}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <EditModal 
          alumni={selectedAlumni} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => { setIsModalOpen(false); fetchData(); }}
        />
      )}
    </div>
  );
};

export default AlumniList;
