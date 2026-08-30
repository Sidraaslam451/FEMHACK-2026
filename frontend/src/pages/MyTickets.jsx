import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTickets } from '../api/tickets.js';
import { useAuth } from '../context/useAuth.js';

const statusColors = {
  New: 'bg-gray-200 text-gray-800',
  Assigned: 'bg-blue-200 text-blue-800',
  'In Progress': 'bg-yellow-200 text-yellow-800',
  Resolved: 'bg-green-200 text-green-800',
};

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await getTickets();
        setTickets(res.data.data);
      } catch (err) {
        setError('Failed to load tickets');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Tickets</h1>
        <button
          onClick={logout}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Logout
        </button>
      </div>

      <button
        onClick={() => navigate('/new-ticket')}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6"
      >
        + New Ticket
      </button>

      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : tickets.length === 0 ? (
        <p className="text-gray-400">No tickets yet.</p>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <Link
              key={t._id}
              to={`/tickets/${t._id}`}
              className="block bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold">{t.subject}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${statusColors[t.status]}`}>
                  {t.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">{t.ticketNumber} · {t.category} · {t.priority}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;