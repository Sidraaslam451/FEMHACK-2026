import { useState, useEffect } from 'react';
import { getPublicStats } from '../api/stats.js';
import PublicNav from '../components/PublicNav.jsx';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity, CheckCircle2, Clock, Inbox } from 'lucide-react';

const LiveStatus = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getPublicStats();
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
      <PublicNav />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-4 text-xs font-medium"
            style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
          >
            <Activity size={13} />
            Live Platform Status
          </div>
          <h1 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
            Complaint Resolution, Transparently
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Real numbers from our support desk, updated live
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl p-5 h-24 animate-pulse" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Inbox, label: 'Total Complaints', value: stats?.total ?? 0 },
                { icon: Clock, label: 'New', value: stats?.new ?? 0 },
                { icon: Activity, label: 'In Progress', value: stats?.inProgress ?? 0 },
                { icon: CheckCircle2, label: 'Resolved', value: stats?.resolved ?? 0 },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="rounded-2xl p-5"
                    style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                      style={{ backgroundColor: 'var(--accent-soft)' }}
                    >
                      <Icon size={18} style={{ color: 'var(--accent)' }} />
                    </div>
                    <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                  </div>
                );
              })}
            </div>

            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
            >
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Complaints by Category
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats?.byCategory || []} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="category"
                    tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                    axisLine={false}
                    tickLine={false}
                    width={140}
                  />
                  <Tooltip cursor={{ fill: 'var(--bg-surface-hover)' }} />
                  <Bar dataKey="count" fill="var(--accent)" radius={[0, 6, 6, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LiveStatus;