import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {  LogIn, UserPlus, User } from 'lucide-react';
import { useAuth } from '../context/useAuth.js';

const ProfileDropdown = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, var(--accent), var(--highlight))' }}
      >
        <User size={16} className="text-white" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-12 w-64 rounded-xl shadow-xl p-4 z-50"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
        >
          {user ? (
            <>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
              <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
              <Link
                to={user.role === 'customer' ? '/my-tickets' : '/dashboard'}
                className="block w-full text-center text-sm font-medium text-white py-2 rounded-lg transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                Go to {user.role === 'customer' ? 'My Tickets' : 'Dashboard'}
              </Link>
            </>
          ) : (
            <>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                Sign in to submit tickets, track issues, and message support agents.
              </p>
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 w-full text-sm font-medium text-white py-2.5 rounded-lg mb-2 transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                <LogIn size={15} />
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex items-center justify-center gap-2 w-full text-sm font-medium py-2.5 rounded-lg"
                style={{ backgroundColor: 'var(--bg-surface-hover)', color: 'var(--text-primary)' }}
              >
                <UserPlus size={15} />
                Create Account
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;