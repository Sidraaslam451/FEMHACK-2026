import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTickets } from '../api/tickets.js';

const statusStyles = {
  New: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  Assigned: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  'In Progress': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-[#E8871E]' },
  Resolved: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
};

const StatusBadge = ({ status }) => {
  const s = statusStyles[status] || statusStyles.New;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
      {status}
    </span>
  );
};

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#14213D]">My Tickets</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage your support requests</p>
        </div>
        <button
          onClick={() => navigate('/new-ticket')}
          className="bg-[#2A6F6F] text-white text-sm font-medium px-4 py-2.5 rounded-md hover:bg-[#235c5c] transition-colors"
        >
          + New Ticket
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 h-20 animate-pulse" />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
          <p className="text-gray-400 mb-3">You haven't submitted any tickets yet.</p>
          <Link to="/new-ticket" className="text-[#2A6F6F] text-sm font-medium hover:underline">
            Submit your first ticket →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <Link
              key={t._id}
              to={`/tickets/${t._id}`}
              className="block bg-white border border-gray-100 rounded-xl p-4 hover:border-[#2A6F6F]/30 hover:shadow-sm transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-[#14213D]">{t.subject}</span>
                <StatusBadge status={t.status} />
              </div>
              <p className="text-xs text-gray-400 font-mono">
                {t.ticketNumber} · {t.category} · {t.priority} priority
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;