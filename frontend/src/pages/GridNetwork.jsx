import { useState, useEffect } from 'react';
import PublicNav from '../components/PublicNav.jsx';
import { getPublicStats } from '../api/stats.js';
import { Zap, MapPin, TrendingUp, Clock3 } from 'lucide-react';

const regions = [
  { name: 'District Central', load: 82 },
  { name: 'District South', load: 64 },
  { name: 'District East', load: 71 },
  { name: 'District Korangi', load: 58 },
  { name: 'District Malir', load: 45 },
];

const GridNetwork = () => {
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
            <Zap size={13} />
            Grid Network Overview
          </div>
          <h1 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
            Service Coverage & Response
          </h1>
          <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
            An overview of complaint activity across service regions and our current
            support desk performance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--accent-soft)' }}>
              <TrendingUp size={18} style={{ color: 'var(--accent)' }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {loading ? '—' : stats?.total ?? 0}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Total complaints logged</p>
          </div>
          <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--highlight-soft)' }}>
              <Clock3 size={18} style={{ color: 'var(--highlight)' }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>&lt; 2 hrs</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Avg. first response time</p>
          </div>
          <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--accent-soft)' }}>
              <MapPin size={18} style={{ color: 'var(--accent)' }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>5</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Service regions covered</p>
          </div>
        </div>

        <div
          className="rounded-2xl p-6 mb-6"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Regional Grid Load (sample distribution)
          </h3>
          <div className="space-y-4">
            {regions.map((r) => (
              <div key={r.name}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: 'var(--text-secondary)' }}>{r.name}</span>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{r.load}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-surface-hover)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${r.load}%`,
                      background: 'linear-gradient(90deg, var(--accent), var(--highlight))',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
            Sample regional distribution for demonstration purposes. Production deployment would connect to live SCADA/grid telemetry.
          </p>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
        >
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Complaint Breakdown by Category</h3>
          {loading ? (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Loading...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats?.byCategory?.map((c) => (
                <div
                  key={c.category}
                  className="rounded-xl p-3 text-center"
                  style={{ backgroundColor: 'var(--bg-surface-hover)' }}
                >
                  <p className="text-lg font-bold" style={{ color: 'var(--accent)' }}>{c.count}</p>
                  <p className="text-[10px] mt-1 leading-tight" style={{ color: 'var(--text-muted)' }}>{c.category}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GridNetwork;