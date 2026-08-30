import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const homeLink = user?.role === 'customer' ? '/my-tickets' : '/dashboard';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <Link to={homeLink} className="flex items-center gap-2">
        <div className="w-7 h-7 rounded bg-[#2A6F6F] flex items-center justify-center">
          <span className="text-white text-sm font-bold font-display">S</span>
        </div>
        <span className="font-display font-semibold text-[#14213D] text-lg tracking-tight">
          SupportFlow
        </span>
      </Link>

      {user && (
        <div className="flex items-center gap-4">
          {user.role === 'customer' && (
            <Link
              to="/new-ticket"
              className="text-sm font-medium bg-[#2A6F6F] text-white px-4 py-1.5 rounded-md hover:bg-[#235c5c] transition-colors"
            >
              + New Ticket
            </Link>
          )}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#E8871E]/15 text-[#E8871E] flex items-center justify-center text-xs font-semibold font-display">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-gray-600 hidden sm:inline">{user.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-[#C53030] transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;