import { useState, useEffect } from 'react';
import api from '../api/axios';
import { X, Briefcase, Phone, Save, Loader2, User } from 'lucide-react';

const EditModal = ({ alumni, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('kontak');
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [contact, setContact] = useState({
    linkedin: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    email: '',
    no_hp: ''
  });

  const [career, setCareer] = useState({
    tempat_kerja: '',
    alamat_kerja: '',
    posisi: '',
    status_kerja: '',
    sosmed_instansi: ''
  });

  useEffect(() => {
    if (alumni) {
      if (alumni.contact) setContact(alumni.contact);
      if (alumni.career) setCareer(alumni.career);
    }
  }, [alumni]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeTab === 'kontak') {
        await api.put(`/alumni/${alumni.nim}/contact`, contact);
      } else {
        await api.put(`/alumni/${alumni.nim}/career`, career);
      }
      onSuccess();
    } catch (err) {
      alert('Gagal memperbarui data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-8 pb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <User size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">Edit Profil Alumni</span>
                <h2 className="text-xl font-bold text-slate-900 leading-tight">{alumni.nama}</h2>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all"
            >
              <X size={20} />
            </button>
          </div>
          <div className="inline-flex px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 tracking-wider">
            NIM: {alumni.nim}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-8">
          <button 
            onClick={() => setActiveTab('kontak')}
            className={`flex-1 py-4 text-xs font-bold flex items-center justify-center gap-2 transition-all relative ${
              activeTab === 'kontak' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Phone size={14} />
            Kontak
            {activeTab === 'kontak' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-t-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('karier')}
            className={`flex-1 py-4 text-xs font-bold flex items-center justify-center gap-2 transition-all relative ${
              activeTab === 'karier' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Briefcase size={14} />
            Karier
            {activeTab === 'karier' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-t-full"></div>}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 bg-slate-50/50">
          <div className="space-y-6">
            {activeTab === 'kontak' ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {[
                  { label: 'Linkedin URL', key: 'linkedin', placeholder: 'https://linkedin.com/in/...' },
                  { label: 'Instagram URL', key: 'instagram', placeholder: 'https://instagram.com/...' },
                  { label: 'Facebook URL', key: 'facebook', placeholder: 'https://facebook.com/...' },
                  { label: 'Tiktok URL', key: 'tiktok', placeholder: 'https://tiktok.com/@...' },
                  { label: 'Email', key: 'email', placeholder: 'contoh@email.com', type: 'email' },
                  { label: 'No. HP / Whatsapp', key: 'no_hp', placeholder: '08xxxxxxxxxx' },
                ].map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">{field.label}</label>
                    <input 
                      type={field.type || 'text'} 
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm" 
                      placeholder={field.placeholder} 
                      value={contact[field.key] || ''} 
                      onChange={(e) => setContact({...contact, [field.key]: e.target.value})}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Tempat Bekerja</label>
                  <input 
                    type="text" 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm" 
                    placeholder="Nama perusahaan/instansi" 
                    value={career.tempat_kerja || ''} 
                    onChange={(e) => setCareer({...career, tempat_kerja: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Alamat Bekerja</label>
                  <textarea 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm min-h-[100px] resize-none" 
                    placeholder="Alamat lengkap instansi..." 
                    value={career.alamat_kerja || ''} 
                    onChange={(e) => setCareer({...career, alamat_kerja: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Posisi / Jabatan</label>
                  <input 
                    type="text" 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm" 
                    placeholder="Contoh: Senior Manager" 
                    value={career.posisi || ''} 
                    onChange={(e) => setCareer({...career, posisi: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Status Pekerjaan</label>
                  <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                    {['PNS', 'Swasta', 'Wirausaha'].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setCareer({...career, status_kerja: status})}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                          career.status_kerja === status 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Sosial Media Instansi</label>
                  <input 
                    type="text" 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm" 
                    placeholder="Link website atau sosmed instansi" 
                    value={career.sosmed_instansi || ''} 
                    onChange={(e) => setCareer({...career, sosmed_instansi: e.target.value})}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 flex gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98]"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-[1.5] px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <Save size={18} />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;

