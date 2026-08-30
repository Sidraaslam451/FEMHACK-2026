// frontend/src/pages/MyTickets.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTickets } from '../api/tickets.js';
import { CheckCircle2, ArrowRight, Plus } from 'lucide-react';

const statusStyles = {
  New: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  Assigned: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  'In Progress': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-[#E8871E]' },
  Resolved: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
};

const priorityStyles = {
  Low: { text: 'text-emerald-600', dot: 'bg-emerald-500' },
  Medium: { text: 'text-amber-600', dot: 'bg-amber-500' },
  High: { text: 'text-red-600', dot: 'bg-red-500' },
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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#14213D]">My Tickets</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage your support requests</p>
        </div>
        <button
          onClick={() => navigate('/new-ticket')}
          className="inline-flex items-center gap-2 bg-[#2A6F6F] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#235c5c] transition-colors"
        >
          <Plus size={16} strokeWidth={2.5} />
          New Ticket
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
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 h-20 animate-pulse" />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-[#2A6F6F]/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={22} className="text-[#2A6F6F]" strokeWidth={2} />
          </div>
          <p className="text-gray-500 font-medium mb-1">No tickets yet</p>
          <p className="text-gray-400 text-sm mb-4">Everything's running smoothly — or you haven't needed help.</p>
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
              className="group flex items-center justify-between bg-white border border-gray-100 rounded-2xl p-5 hover:border-[#2A6F6F]/30 hover:shadow-md transition-all duration-200"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="font-medium text-[#14213D] truncate">{t.subject}</span>
                  <StatusBadge status={t.status} />
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="font-mono">{t.ticketNumber}</span>
                  <span>{t.category}</span>
                  <span className={`inline-flex items-center gap-1 ${priorityStyles[t.priority]?.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${priorityStyles[t.priority]?.dot}`}></span>
                    {t.priority}
                  </span>
                </div>
              </div>
              <ArrowRight
                size={18}
                className="text-gray-300 group-hover:text-[#2A6F6F] group-hover:translate-x-1 transition-all duration-200 shrink-0 ml-4"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;