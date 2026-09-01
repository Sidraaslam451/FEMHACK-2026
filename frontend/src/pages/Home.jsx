import { Link } from 'react-router-dom';
import { useTheme } from '../context/useTheme.js';
import {
  Sun,
  Moon,
  Sparkles,
  Zap,
  CheckCircle2,
  Send,
} from 'lucide-react';

const Home = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
      <nav className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--highlight))' }}
          >
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>
            SupportFlow
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
          >
            {theme === 'dark' ? (
              <Sun size={16} style={{ color: 'var(--text-secondary)' }} />
            ) : (
              <Moon size={16} style={{ color: 'var(--text-secondary)' }} />
            )}
          </button>
          <Link
            to="/login"
            className="text-sm font-medium px-4 py-2 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="text-sm font-medium text-white px-4 py-2 rounded-lg transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-16 pb-10 text-center">
        <div
          className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-6 text-xs font-medium"
          style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
        >
          <Sparkles size={13} />
          AI-assisted triage, human-reviewed
        </div>

        <h1
          className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1]"
          style={{ color: 'var(--text-primary)' }}
        >
          Support tickets,<br />
          <span style={{ background: 'linear-gradient(135deg, var(--accent), var(--highlight))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            sorted before you open them
          </span>
        </h1>
        <p className="text-lg max-w-xl mx-auto mb-10" style={{ color: 'var(--text-secondary)' }}>
          Customers submit a ticket. AI suggests the category, priority, and a short summary.
          Agents review, reply, and resolve — every step, in real time.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 text-white font-medium px-6 py-3.5 rounded-xl transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            <Send size={16} />
            Submit a ticket
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 font-medium px-6 py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
            style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
          >
            Log in
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
          {[
            { label: 'Avg. response time', value: '< 2 hrs' },
            { label: 'AI triage accuracy', value: '~94%' },
            { label: 'Tickets resolved', value: '1,200+' },
            { label: 'Uptime', value: '99.9%' },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-4 text-center"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
            >
              <p className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{s.value}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
        >
          <div className="flex items-center justify-between mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>TCK-402080-7894</p>
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Double charged for order</p>
            </div>
            <span
              className="text-xs px-3 py-1.5 rounded-full font-medium"
              style={{ backgroundColor: 'var(--highlight-soft)', color: 'var(--highlight)' }}
            >
              High priority
            </span>
          </div>
          <div className="rounded-xl p-4 flex items-start gap-3" style={{ backgroundColor: 'var(--accent-soft)' }}>
            <Sparkles size={16} style={{ color: 'var(--accent)' }} className="mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold mb-1" style={{ color: 'var(--accent)' }}>AI Suggestion</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Billing · Possible duplicate payment reported by customer — recommend reviewing recent transaction history before refunding.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>
          Everything the desk needs
        </h2>
        <p className="text-sm text-center mb-10" style={{ color: 'var(--text-secondary)' }}>
          Three simple steps, fully automated in between
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: Send, title: 'Customer submits', desc: 'A short form — subject, description, category. Takes under a minute.' },
            { icon: Zap, title: 'AI triages', desc: 'Category, priority, and a summary — ready for the agent to confirm or edit.' },
            { icon: CheckCircle2, title: 'Agent resolves', desc: 'Assign, reply, and close — with the full conversation on record.' },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-2xl p-6 transition-transform hover:-translate-y-1"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: 'var(--accent-soft)' }}
                >
                  <Icon size={20} style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <footer className="px-6 py-8" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--highlight))' }}
            >
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>SupportFlow</span>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Built for AI Factory 2.0 Hackathon
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;