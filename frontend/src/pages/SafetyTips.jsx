import PublicNav from '../components/PublicNav.jsx';
import { AlertTriangle, Zap, Home, Droplets, PhoneCall } from 'lucide-react';

const tips = [
  {
    icon: Zap,
    title: 'Never touch fallen power lines',
    desc: 'If you see a downed power line, stay at least 10 meters away and report it immediately. Assume every fallen line is live.',
  },
  {
    icon: Droplets,
    title: 'Keep electrical outlets away from water',
    desc: 'Never operate switches or appliances with wet hands, and avoid using electrical equipment near standing water, especially during monsoon season.',
  },
  {
    icon: Home,
    title: 'Don\'t overload your circuits',
    desc: 'Avoid plugging too many high-wattage appliances into a single outlet or extension board — this is a leading cause of household electrical fires.',
  },
  {
    icon: AlertTriangle,
    title: 'Report sparking meters or panels immediately',
    desc: 'A sparking or burning smell from your meter or distribution panel is an emergency — turn off your main switch and report it right away.',
  },
  {
    icon: PhoneCall,
    title: 'Report outages with your account number',
    desc: 'When reporting a power outage, include your account or meter number so our team can locate your connection faster.',
  },
];

const SafetyTips = () => {
  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
      <PublicNav />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-4 text-xs font-medium"
            style={{ backgroundColor: 'var(--highlight-soft)', color: 'var(--highlight)' }}
          >
            <AlertTriangle size={13} />
            Stay Safe
          </div>
          <h1 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
            Electrical Safety Guidelines
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            A few essential precautions for you and your household
          </p>
        </div>

        <div className="space-y-4">
          {tips.map((tip) => {
            const Icon = tip.icon;
            return (
              <div
                key={tip.title}
                className="rounded-2xl p-5 flex items-start gap-4"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'var(--accent-soft)' }}
                >
                  <Icon size={18} style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{tip.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{tip.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SafetyTips;