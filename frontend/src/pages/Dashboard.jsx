// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTickets } from '../api/tickets.js';
import {
  Inbox,
  Clock,
  CheckCircle2,
  Layers,
  ArrowRight,
  User,
} from 'lucide-react';

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

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
    <div className="flex items-center justify-between mb-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent.bg}`}>
        <Icon size={18} className={accent.text} strokeWidth={2} />
      </div>
    </div>
    <p className="font-display text-2xl font-semibold text-[#14213D]">{value}</p>
    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
  </div>
);

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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#14213D]">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of all support tickets</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Layers}
          label="Total tickets"
          value={stats.total}
          accent={{ bg: 'bg-[#14213D]/5', text: 'text-[#14213D]' }}
        />
        <StatCard
          icon={Inbox}
          label="New"
          value={stats.new}
          accent={{ bg: 'bg-gray-100', text: 'text-gray-500' }}
        />
        <StatCard
          icon={Clock}
          label="In progress"
          value={stats.inProgress}
          accent={{ bg: 'bg-[#E8871E]/10', text: 'text-[#E8871E]' }}
        />
        <StatCard
          icon={CheckCircle2}
          label="Resolved"
          value={stats.resolved}
          accent={{ bg: 'bg-emerald-50', text: 'text-emerald-600' }}
        />
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
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 h-24 animate-pulse" />
          ))}
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center">
          <p className="text-gray-400">No tickets match this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((t) => (
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
                  <span className="inline-flex items-center gap-1">
                    <User size={12} />
                    {t.customer?.name}
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

export default Dashboard;