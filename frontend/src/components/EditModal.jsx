import { useState, useEffect } from 'react';
import api from '../api/axios';
import { X, Briefcase, Phone, Save, Loader2 } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 bg-primary text-white flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{alumni.nama}</h2>
            <p className="text-blue-100 text-sm">NIM: {alumni.nim} • {alumni.prodi}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('kontak')}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'kontak' ? 'text-primary border-b-2 border-primary bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Phone size={18} />
            Data Kontak
          </button>
          <button 
            onClick={() => setActiveTab('karier')}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'karier' ? 'text-primary border-b-2 border-primary bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Briefcase size={18} />
            Data Karier
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {activeTab === 'kontak' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-left-4 duration-300">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">LinkedIn URL</label>
                <input 
                  type="text" className="input" placeholder="https://linkedin.com/in/username" 
                  value={contact.linkedin || ''} onChange={(e) => setContact({...contact, linkedin: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Instagram</label>
                <input 
                  type="text" className="input" placeholder="@username" 
                  value={contact.instagram || ''} onChange={(e) => setContact({...contact, instagram: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Facebook</label>
                <input 
                  type="text" className="input" placeholder="Facebook profile link" 
                  value={contact.facebook || ''} onChange={(e) => setContact({...contact, facebook: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">TikTok</label>
                <input 
                  type="text" className="input" placeholder="@username" 
                  value={contact.tiktok || ''} onChange={(e) => setContact({...contact, tiktok: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <input 
                  type="email" className="input" placeholder="alumni@example.com" 
                  value={contact.email || ''} onChange={(e) => setContact({...contact, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">No. HP / WhatsApp</label>
                <input 
                  type="text" className="input" placeholder="08123456789" 
                  value={contact.no_hp || ''} onChange={(e) => setContact({...contact, no_hp: e.target.value})}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Tempat Kerja</label>
                  <input 
                    type="text" className="input" placeholder="PT. Nama Perusahaan" 
                    value={career.tempat_kerja || ''} onChange={(e) => setCareer({...career, tempat_kerja: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Posisi / Jabatan</label>
                  <input 
                    type="text" className="input" placeholder="Software Engineer" 
                    value={career.posisi || ''} onChange={(e) => setCareer({...career, posisi: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Status Kerja</label>
                <div className="flex gap-6 mt-2">
                  {['PNS', 'Swasta', 'Wirausaha'].map((status) => (
                    <label key={status} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="status_kerja" 
                        className="w-4 h-4 text-primary focus:ring-primary"
                        checked={career.status_kerja === status}
                        onChange={() => setCareer({...career, status_kerja: status})}
                      />
                      <span className="text-sm font-medium text-gray-600 group-hover:text-primary transition-colors">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Alamat Kerja</label>
                <textarea 
                  className="input min-h-[80px]" placeholder="Alamat lengkap instansi..." 
                  value={career.alamat_kerja || ''} onChange={(e) => setCareer({...career, alamat_kerja: e.target.value})}
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Sosial Media Instansi</label>
                <input 
                  type="text" className="input" placeholder="LinkedIn/Instagram instansi" 
                  value={career.sosmed_instansi || ''} onChange={(e) => setCareer({...career, sosmed_instansi: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="mt-10 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-blue-100 flex items-center justify-center gap-2 hover:bg-blue-900 transition-all active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
