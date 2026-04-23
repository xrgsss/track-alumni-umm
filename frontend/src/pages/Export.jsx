import { useState } from 'react';
import api from '../api/axios';
import { 
  Download, 
  FileSpreadsheet, 
  AlertCircle, 
  ShieldCheck,
  ArrowRight,
  Loader2
} from 'lucide-react';

const Export = () => {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fakultas: '',
    prodi: '',
    tahun: ''
  });

  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await api.get('/export/excel', {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data_alumni_lengkap.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert('Gagal mengunduh file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
            <ShieldCheck size={24} />
          </div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Admin Authorization Required</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Ekspor Data Alumni</h1>
        <p className="text-gray-500 mt-1">Unduh seluruh basis data alumni ke dalam format Microsoft Excel (.xlsx)</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Filters */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FileSpreadsheet size={20} className="text-primary" />
              Opsi Ekspor
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Filter Fakultas</label>
                <select 
                  className="input"
                  value={filters.fakultas}
                  onChange={(e) => setFilters({...filters, fakultas: e.target.value})}
                >
                  <option value="">Semua Fakultas</option>
                  <option value="Teknik">Teknik</option>
                  <option value="Ekonomi & Bisnis">Ekonomi & Bisnis</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Tahun Lulus (Hingga)</label>
                <select 
                  className="input"
                  value={filters.tahun}
                  onChange={(e) => setFilters({...filters, tahun: e.target.value})}
                >
                  <option value="">Semua Tahun</option>
                  {[...Array(26)].map((_, i) => (
                    <option key={i} value={2000 + i}>{2000 + i}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl flex items-start gap-4">
              <AlertCircle className="text-primary shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-blue-800">
                <p className="font-bold">Informasi Ekspor</p>
                <p className="mt-1 opacity-80">File yang dihasilkan akan mencakup semua kolom termasuk Data Kontak (Email, HP, Sosmed) dan Data Karier (Tempat Kerja, Posisi).</p>
              </div>
            </div>

            <button 
              onClick={handleExport}
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Memproses Data...
                </>
              ) : (
                <>
                  <Download size={24} />
                  Download Excel Lengkap
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Tips */}
        <div className="space-y-6">
          <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-bold text-lg mb-2">Tips</h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Gunakan data ini untuk keperluan akreditasi prodi atau pelaporan IKU (Indikator Kinerja Utama) universitas.
              </p>
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                Lihat Panduan Laporan <ArrowRight size={16} />
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Export;
