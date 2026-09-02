import { useState, useEffect } from 'react';
import { getPublicStats } from '../api/stats.js';
import PublicNav from '../components/PublicNav.jsx';
import { MapPin, Zap, AlertTriangle, TrendingUp } from 'lucide-react';

const zones = [
  { name: 'Zone A — Central', color: '#F5B301' },
  { name: 'Zone B — North', color: '#3B82F6' },
  { name: 'Zone C — South', color: '#34D399' },
  { name: 'Zone D — East', color: '#FB7185' },
  { name: 'Zone E — West', color: '#A78BFA' },
];

const GridStatus = () => {
  const [stats, setStats] = useState(null);
  const [selectedZone, setSelectedZone] = useState(zones[0]);
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

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-4 text-xs font-medium"
            style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
          >
            <MapPin size={13} />
            Grid Status Overview
          </div>
          <h1 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
            Network Zone Monitor
          </h1>
          <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
            A conceptual view of how complaint volume and grid health could be tracked across
            service zones. Zone data below is illustrative.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Service Zones</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {zones.map((zone) => (
                <button
                  key={zone.name}
                  onClick={() => setSelectedZone(zone)}
                  className="rounded-xl p-4 text-left transition-all"
                  style={{
                    backgroundColor: selectedZone.name === zone.name ? 'var(--bg-surface-hover)' : 'transparent',
                    border: `1px solid ${selectedZone.name === zone.name ? zone.color : 'var(--border-color)'}`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: zone.color }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{zone.name}</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Click to inspect zone</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-surface)', border: `1px solid ${selectedZone.color}` }}>
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} style={{ color: selectedZone.color }} />
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{selectedZone.name}</h3>
            </div>

            {loading ? (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading...</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Active Complaints</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {stats?.new + stats?.inProgress || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Resolved This Month</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {stats?.resolved || 0}
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <TrendingUp size={14} style={{ color: '#34D399' }} />
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Grid health: Stable</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className="mt-6 rounded-2xl p-5 flex items-start gap-3"
          style={{ backgroundColor: 'var(--highlight-soft)' }}
        >
          <AlertTriangle size={16} style={{ color: 'var(--highlight)' }} className="mt-0.5 flex-shrink-0" />
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            This is a conceptual demo view. Real zone-level data would require integration with
            live grid telemetry and account location data, which is outside the scope of this MVP.
            Complaint counts shown above reflect actual platform data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GridStatus;