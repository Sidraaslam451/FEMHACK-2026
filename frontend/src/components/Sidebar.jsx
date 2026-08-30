import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  LogOut,
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isCustomer = user?.role === 'customer';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = isCustomer
    ? [
        { label: 'My Tickets', to: '/my-tickets', icon: Ticket },
        { label: 'New Ticket', to: '/new-ticket', icon: PlusCircle },
      ]
    : [
        { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-60 min-h-screen bg-[#14213D] flex flex-col fixed left-0 top-0">
      <div className="px-5 py-6 flex items-center gap-2.5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-[#2A6F6F] flex items-center justify-center shrink-0">
          <span className="text-white text-sm font-bold font-display">S</span>
        </div>
        <span className="font-display font-semibold text-white text-base tracking-tight">
          SupportFlow
        </span>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-[#2A6F6F] text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-[#E8871E]/20 text-[#E8871E] flex items-center justify-center text-sm font-semibold font-display shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-white/40 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors w-full"
        >
          <LogOut size={18} strokeWidth={2} />
          Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;