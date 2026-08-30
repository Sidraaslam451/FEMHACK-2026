import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await register(name, email, password);
      const role = res.user.role;
      navigate(role === 'customer' ? '/my-tickets' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-8 h-8 rounded bg-[#2A6F6F] flex items-center justify-center">
            <span className="text-white text-sm font-bold font-display">S</span>
          </div>
          <span className="font-display font-semibold text-[#14213D] text-lg tracking-tight">
            SupportFlow
          </span>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-8">
          <h1 className="font-display text-xl font-semibold text-[#14213D] mb-1">Create account</h1>
          <p className="text-sm text-gray-500 mb-6">Submit and track your support tickets</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#14213D] mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2A6F6F]/30 focus:border-[#2A6F6F]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#14213D] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2A6F6F]/30 focus:border-[#2A6F6F]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#14213D] mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2A6F6F]/30 focus:border-[#2A6F6F]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2A6F6F] text-white font-medium p-2.5 rounded-lg hover:bg-[#235c5c] transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-[#2A6F6F] font-medium hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;