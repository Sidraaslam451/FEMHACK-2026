// frontend/src/pages/MyTickets.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTickets } from '../api/tickets.js';
import { CheckCircle2, ArrowRight, Plus } from 'lucide-react';

const statusColors = {
  New: '#9CA3AF',
  Assigned: '#60A5FA',
  'In Progress': '#FB7185',
  Resolved: '#34D399',
};

const priorityStyles = {
  Low: '#34D399',
  Medium: '#FBBF24',
  High: '#FB7185',
};

const StatusBadge = ({ status }) => (
  <span
    className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
    style={{ backgroundColor: `${statusColors[status]}20`, color: statusColors[status] }}
  >
    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColors[status] }}></span>
    {status}
  </span>
);

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
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>My Tickets</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Track and manage your support requests
          </p>
        </div>
        <button
          onClick={() => navigate('/new-ticket')}
          className="inline-flex items-center gap-2 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <Plus size={16} strokeWidth={2.5} />
          New Ticket
        </button>
      </div>

      {error && (
        <div
          className="text-sm rounded-lg p-3 mb-4"
          style={{ backgroundColor: 'var(--highlight-soft)', color: 'var(--highlight)' }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-5 h-20 animate-pulse"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
            />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px dashed var(--border-color)' }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'var(--accent-soft)' }}
          >
            <CheckCircle2 size={22} style={{ color: 'var(--accent)' }} strokeWidth={2} />
          </div>
          <p className="font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>No tickets yet</p>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            Everything's running smoothly — or you haven't needed help.
          </p>
          <Link to="/new-ticket" className="text-sm font-medium hover:underline" style={{ color: 'var(--accent)' }}>
            Submit your first ticket →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <Link
              key={t._id}
              to={`/tickets/${t._id}`}
              className="group flex items-center justify-between rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>{t.subject}</span>
                  <StatusBadge status={t.status} />
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span className="font-mono">{t.ticketNumber}</span>
                  <span>{t.category}</span>
                  <span className="inline-flex items-center gap-1" style={{ color: priorityStyles[t.priority] }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: priorityStyles[t.priority] }}></span>
                    {t.priority}
                  </span>
                </div>
              </div>
              <ArrowRight
                size={18}
                className="shrink-0 ml-4 transition-transform group-hover:translate-x-1"
                style={{ color: 'var(--text-muted)' }}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;