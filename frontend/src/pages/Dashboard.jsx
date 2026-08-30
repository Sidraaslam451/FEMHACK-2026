import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTickets } from '../api/tickets.js';

const statusStyles = {
  New: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  Assigned: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  'In Progress': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-[#E8871E]' },
  Resolved: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
};

const priorityStyles = {
  Low: 'text-emerald-600',
  Medium: 'text-amber-600',
  High: 'text-red-600',
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

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

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

  const filteredTickets =
    statusFilter === 'All'
      ? tickets
      : tickets.filter((t) => t.status === statusFilter);

  const stats = {
    total: tickets.length,
    new: tickets.filter((t) => t.status === 'New').length,
    inProgress: tickets.filter((t) => t.status === 'In Progress').length,
    resolved: tickets.filter((t) => t.status === 'Resolved').length,
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-[#14213D] mb-1">Agent Dashboard</h1>
      <p className="text-sm text-gray-500 mb-6">Overview of all support tickets</p>

      <div className="grid grid-cols-4 gap-3 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="font-display text-2xl font-semibold text-[#14213D]">{stats.total}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="font-display text-2xl font-semibold text-gray-500">{stats.new}</p>
          <p className="text-xs text-gray-500 mt-0.5">New</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="font-display text-2xl font-semibold text-[#E8871E]">{stats.inProgress}</p>
          <p className="text-xs text-gray-500 mt-0.5">In Progress</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="font-display text-2xl font-semibold text-emerald-600">{stats.resolved}</p>
          <p className="text-xs text-gray-500 mt-0.5">Resolved</p>
        </div>
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {['All', 'New', 'Assigned', 'In Progress', 'Resolved'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-sm px-3.5 py-1.5 rounded-full border whitespace-nowrap transition-colors ${
              statusFilter === s
                ? 'bg-[#14213D] text-white border-[#14213D]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {s}
          </button>
        ))}
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
      ) : filteredTickets.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
          <p className="text-gray-400">No tickets match this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((t) => (
            <Link
              key={t._id}
              to={`/tickets/${t._id}`}
              className="block bg-white border border-gray-100 rounded-xl p-4 hover:border-[#2A6F6F]/30 hover:shadow-sm transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-[#14213D]">{t.subject}</span>
                <StatusBadge status={t.status} />
              </div>
              <p className="text-xs text-gray-400 font-mono mb-1.5">
                {t.ticketNumber} · {t.category} ·{' '}
                <span className={priorityStyles[t.priority]}>{t.priority}</span>
              </p>
              <p className="text-xs text-gray-400">
                {t.customer?.name} → {t.assignedAgent?.name || 'Unassigned'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;