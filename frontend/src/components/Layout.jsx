import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutGrid, 
  Search, 
  Download, 
  FileText,
  LogIn,
  LogOut, 
  Menu, 
  X,
  Heart
} from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Statistik', href: '/dashboard', icon: LayoutGrid },
    { name: 'Pelacakan Alumni', href: '/alumni', icon: Search },
    { name: 'Export Data', href: '/export', icon: Download },
    { name: 'Audit Log', href: '/audit-log', icon: FileText },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f0f2f5]">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-primary text-white sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/20">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-lg">
              <Heart size={28} fill="currentColor" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">admin</span>
              <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">ADMIN</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${
                  isActive 
                    ? 'bg-white text-primary shadow-xl shadow-blue-900/20 translate-x-2' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={22} strokeWidth={2.5} />
                <span className="text-base">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto">
          <div className="grid grid-cols-2 gap-3">
            <Link 
              to="/login"
              className="flex items-center justify-center gap-2 px-4 py-4 text-white/90 font-bold bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10"
            >
              <LogIn size={20} strokeWidth={2.5} />
              <span className="text-sm">Login</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-4 py-4 text-white/90 font-bold bg-white/10 hover:bg-red-500/20 rounded-2xl transition-all border border-white/10"
            >
              <LogOut size={20} strokeWidth={2.5} />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-primary text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary">
            <Heart size={24} fill="currentColor" />
          </div>
          <h1 className="font-bold text-lg">Admin Alumni</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 hover:bg-white/10 rounded-lg">
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-primary z-40 flex flex-col pt-24 px-6">
           {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-6 py-5 rounded-2xl font-bold mb-3 transition-all ${
                  isActive ? 'bg-white text-primary' : 'text-white'
                }`}
              >
                <Icon size={24} strokeWidth={2.5} />
                <span className="text-lg">{item.name}</span>
              </Link>
            );
          })}
          <div className="mt-auto mb-10 grid grid-cols-2 gap-3">
            <Link 
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-4 px-6 py-5 text-white font-bold bg-white/10 rounded-2xl border border-white/20"
            >
              <LogIn size={24} strokeWidth={2.5} />
              <span className="text-lg">Login</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-4 px-6 py-5 text-white font-bold bg-white/20 rounded-2xl border border-white/20"
            >
              <LogOut size={24} strokeWidth={2.5} />
              <span className="text-lg">Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-x-hidden p-4 md:p-10">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
