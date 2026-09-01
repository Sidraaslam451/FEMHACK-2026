import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import { useTheme } from '../context/useTheme.js';
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
    : [{ label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard }];

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className="w-60 min-h-screen flex flex-col fixed left-0 top-0"
      style={{ backgroundColor: 'var(--bg-surface)', borderRight: '1px solid var(--border-color)' }}
    >
      <div
        className="px-5 py-6 flex items-center gap-2.5"
        style={{ borderBottom: '1px solid var(--border-color)' }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--accent), var(--highlight))' }}
        >
          <span className="text-white text-sm font-bold">S</span>
        </div>
        <span className="font-bold text-base tracking-tight" style={{ color: 'var(--text-primary)' }}>
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
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={
                active
                  ? { backgroundColor: 'var(--accent)', color: 'white' }
                  : { color: 'var(--text-secondary)' }
              }
            >
              <Icon size={18} strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4" style={{ borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full mb-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>

        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold -shrink-0"
            style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
            <p className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full"
          style={{ color: 'var(--text-secondary)' }}
        >
          <LogOut size={18} strokeWidth={2} />
          Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;