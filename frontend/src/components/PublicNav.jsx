import { Link } from 'react-router-dom';
import { useTheme } from '../context/useTheme.js';
import ProfileDropdown from './ProfileDropdown.jsx';
import { Sun, Moon, Zap } from 'lucide-react';

const PublicNav = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto sticky top-0 z-40 backdrop-blur-sm"
      style={{ backgroundColor: 'color-mix(in srgb, var(--bg-base) 85%, transparent)' }}
    >
      <Link to="/" className="flex items-center gap-2">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, var(--accent), var(--highlight))' }}
        >
          <Zap size={18} className="text-white" fill="white" />
        </div>
        <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>
          PowerConnect
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
        <Link to="/live-status">Live Status</Link>
        <Link to="/about">About</Link>
        <Link to="/safety-tips">Safety Tips</Link>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
        >
          {theme === 'dark' ? (
            <Sun size={16} style={{ color: 'var(--text-secondary)' }} />
          ) : (
            <Moon size={16} style={{ color: 'var(--text-secondary)' }} />
          )}
        </button>
        <ProfileDropdown />
      </div>
    </nav>
  );
};

export default PublicNav;