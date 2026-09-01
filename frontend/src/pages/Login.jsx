import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import { useTheme } from '../context/useTheme.js';
import { Sun, Moon } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      const role = res.user.role;
      navigate(role === 'customer' ? '/my-tickets' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 relative"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 w-9 h-9 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
      >
        {theme === 'dark' ? (
          <Sun size={16} style={{ color: 'var(--text-secondary)' }} />
        ) : (
          <Moon size={16} style={{ color: 'var(--text-secondary)' }} />
        )}
      </button>

      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--highlight))' }}
          >
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>
            SupportFlow
          </span>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
        >
          <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Welcome back</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Log in to your account</p>

          {error && (
            <div
              className="text-sm rounded-lg p-3 mb-4"
              style={{ backgroundColor: 'var(--highlight-soft)', color: 'var(--highlight)' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-lg text-sm focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-surface-hover)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                }}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 rounded-lg text-sm focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-surface-hover)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                }}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-medium p-2.5 rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="mt-6 text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
            No account?{' '}
            <Link to="/register" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;