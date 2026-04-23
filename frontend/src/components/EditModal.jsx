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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e293b] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-700 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                <User size={18} />
              </div>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Edit Alumni</span>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          <h2 className="text-xl font-bold text-white">{alumni.nama}</h2>
          <p className="text-gray-500 text-xs mt-1">NIM: {alumni.nim}</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700/50 bg-[#1e293b]">
          <button 
            onClick={() => setActiveTab('kontak')}
            className={`flex-1 py-4 text-xs font-bold flex items-center justify-center gap-2 transition-all relative ${
              activeTab === 'kontak' ? 'text-blue-400 bg-blue-400/5' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Phone size={14} />
            Kontak
            {activeTab === 'kontak' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-400"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('karier')}
            className={`flex-1 py-4 text-xs font-bold flex items-center justify-center gap-2 transition-all relative ${
              activeTab === 'karier' ? 'text-blue-400 bg-blue-400/5' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Briefcase size={14} />
            Karier
            {activeTab === 'karier' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-400"></div>}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 bg-[#111827]/30">
          <div className="space-y-5">
            {activeTab === 'kontak' ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Linkedin URL</label>
                  <input 
                    type="text" className="w-full bg-[#1e293b] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:ring-1 focus:ring-blue-400 outline-none transition-all" 
                    placeholder="https://linkedin.com/in/..." 
                    value={contact.linkedin || ''} onChange={(e) => setContact({...contact, linkedin: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Instagram URL</label>
                  <input 
                    type="text" className="w-full bg-[#1e293b] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:ring-1 focus:ring-blue-400 outline-none transition-all" 
                    placeholder="https://instagram.com/..." 
                    value={contact.instagram || ''} onChange={(e) => setContact({...contact, instagram: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Facebook URL</label>
                  <input 
                    type="text" className="w-full bg-[#1e293b] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:ring-1 focus:ring-blue-400 outline-none transition-all" 
                    placeholder="https://facebook.com/..." 
                    value={contact.facebook || ''} onChange={(e) => setContact({...contact, facebook: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tiktok URL</label>
                  <input 
                    type="text" className="w-full bg-[#1e293b] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:ring-1 focus:ring-blue-400 outline-none transition-all" 
                    placeholder="https://tiktok.com/@..." 
                    value={contact.tiktok || ''} onChange={(e) => setContact({...contact, tiktok: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Email</label>
                  <input 
                    type="email" className="w-full bg-[#1e293b] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:ring-1 focus:ring-blue-400 outline-none transition-all" 
                    placeholder="contoh@email.com" 
                    value={contact.email || ''} onChange={(e) => setContact({...contact, email: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">No. HP / Whatsapp</label>
                  <input 
                    type="text" className="w-full bg-[#1e293b] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:ring-1 focus:ring-blue-400 outline-none transition-all" 
                    placeholder="08xxxxxxxxxx" 
                    value={contact.no_hp || ''} onChange={(e) => setContact({...contact, no_hp: e.target.value})}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tempat Bekerja</label>
                  <input 
                    type="text" className="w-full bg-[#1e293b] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:ring-1 focus:ring-blue-400 outline-none transition-all" 
                    placeholder="Nama perusahaan/instansi" 
                    value={career.tempat_kerja || ''} onChange={(e) => setCareer({...career, tempat_kerja: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Alamat Bekerja</label>
                  <textarea 
                    className="w-full bg-[#1e293b] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:ring-1 focus:ring-blue-400 outline-none transition-all min-h-[100px]" 
                    placeholder="Jl. ..." 
                    value={career.alamat_kerja || ''} onChange={(e) => setCareer({...career, alamat_kerja: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Posisi / Jabatan</label>
                  <input 
                    type="text" className="w-full bg-[#1e293b] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:ring-1 focus:ring-blue-400 outline-none transition-all" 
                    placeholder="Contoh: Software Engineer" 
                    value={career.posisi || ''} onChange={(e) => setCareer({...career, posisi: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status Pekerjaan</label>
                  <div className="flex gap-4">
                    {['PNS', 'Swasta', 'Wirausaha'].map((status) => (
                      <label key={status} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="status_kerja" 
                          className="w-4 h-4 border-gray-600 bg-[#1e293b] text-blue-400 focus:ring-blue-400"
                          checked={career.status_kerja === status}
                          onChange={() => setCareer({...career, status_kerja: status})}
                        />
                        <span className="text-xs text-gray-400 font-medium">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Sosial Media Instansi</label>
                  <input 
                    type="text" className="w-full bg-[#1e293b] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:ring-1 focus:ring-blue-400 outline-none transition-all" 
                    placeholder="Link sosmed perusahaan" 
                    value={career.sosmed_instansi || ''} onChange={(e) => setCareer({...career, sosmed_instansi: e.target.value})}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-[#1e293b] border border-gray-700 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all active:scale-95"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-[1.5] px-4 py-3 bg-[#2563eb] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  <Save size={16} />
                  Simpan {activeTab === 'kontak' ? 'Kontak' : 'Karier'}
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
