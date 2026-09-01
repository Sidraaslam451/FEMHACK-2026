import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTickets } from '../api/tickets.js';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Layers, Inbox, Clock, CheckCircle2, ArrowRight, User } from 'lucide-react';

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

const StatCard = ({ icon: Icon, label, value }) => (
  <div
    className="rounded-2xl p-5 transition-transform hover:-translate-y-0.5"
    style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
  >
    <div
      className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
      style={{ backgroundColor: 'var(--accent-soft)' }}
    >
      <Icon size={18} style={{ color: 'var(--accent)' }} strokeWidth={2} />
    </div>
    <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
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
    statusFilter === 'All' ? tickets : tickets.filter((t) => t.status === statusFilter);

  const stats = {
    total: tickets.length,
    new: tickets.filter((t) => t.status === 'New').length,
    inProgress: tickets.filter((t) => t.status === 'In Progress').length,
    resolved: tickets.filter((t) => t.status === 'Resolved').length,
  };

  const statusChartData = ['New', 'Assigned', 'In Progress', 'Resolved']
    .map((s) => ({ name: s, value: tickets.filter((t) => t.status === s).length, color: statusColors[s] }))
    .filter((d) => d.value > 0);

  const categoryChartData = ['Billing', 'Technical', 'General', 'Account', 'Other'].map((c) => ({
    name: c,
    count: tickets.filter((t) => t.category === c).length,
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Overview of all support tickets</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Layers} label="Total tickets" value={stats.total} />
        <StatCard icon={Inbox} label="New" value={stats.new} />
        <StatCard icon={Clock} label="In progress" value={stats.inProgress} />
        <StatCard icon={CheckCircle2} label="Resolved" value={stats.resolved} />
      </div>

      {!loading && tickets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
          >
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Ticket Status</h3>
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusChartData} dataKey="value" innerRadius={35} outerRadius={55} paddingAngle={2}>
                      {statusChartData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 flex-1">
                {statusChartData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                      {d.name}
                    </span>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
          >
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Tickets by Category</h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={categoryChartData}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                  axisLine={{ stroke: 'var(--border-color)' }}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'var(--bg-surface-hover)' }} />
                <Bar dataKey="count" fill="var(--accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {['All', 'New', 'Assigned', 'In Progress', 'Resolved'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className="text-sm px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors"
            style={
              statusFilter === s
                ? { backgroundColor: 'var(--accent)', color: 'white', border: '1px solid var(--accent)' }
                : { backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }
            }
          >
            {s}
          </button>
        ))}
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
              className="rounded-2xl p-5 h-24 animate-pulse"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
            />
          ))}
        </div>
      ) : filteredTickets.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px dashed var(--border-color)' }}
        >
          <p style={{ color: 'var(--text-muted)' }}>No tickets match this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((t) => (
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
                  <span className="inline-flex items-center gap-1">
                    <User size={12} />
                    {t.customer?.name}
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

export default Dashboard;