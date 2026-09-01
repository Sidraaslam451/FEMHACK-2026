import { Link } from 'react-router-dom';
import PublicNav from '../components/PublicNav.jsx';
import { Zap, Target, Code2, Users, ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
      <PublicNav />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--highlight))' }}
          >
            <Zap size={24} className="text-white" fill="white" />
          </div>
          <h1 className="text-3xl font-extrabold mb-3" style={{ color: 'var(--text-primary)' }}>
            About PowerConnect
          </h1>
          <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
            An AI-assisted customer support desk built to make reporting and resolving electricity
            complaints faster, clearer, and more transparent.
          </p>
        </div>

        <div
          className="rounded-2xl p-6 mb-6"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--accent-soft)' }}>
              <Target size={18} style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <h2 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Our Mission</h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Utility complaints — outages, billing disputes, meter faults — are often slow to
                triage and easy to lose track of. PowerConnect uses AI to instantly classify and
                prioritize every complaint the moment it's submitted, while keeping a human agent
                in full control of the final decision. No complaint gets buried, and nothing is
                ever resolved without human review.
              </p>
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl p-6 mb-6"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--highlight-soft)' }}>
              <Code2 size={18} style={{ color: 'var(--highlight)' }} />
            </div>
            <div>
              <h2 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>How It's Built</h2>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                PowerConnect is a full-stack MVP built for the AI Factory 2.0 Hackathon, demonstrating
                a complete AI-assisted support workflow from submission to resolution.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['React + Vite', 'Tailwind CSS', 'Node.js + Express', 'MongoDB Atlas', 'Google Gemini AI', 'JWT Auth'].map((t) => (
                  <div
                    key={t}
                    className="px-3 py-2 rounded-lg text-center font-medium"
                    style={{ backgroundColor: 'var(--bg-surface-hover)', color: 'var(--text-secondary)' }}
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl p-6 mb-8"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--accent-soft)' }}>
              <Users size={18} style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <h2 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Who It's For</h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Built with two roles in mind — consumers who need a fast, transparent way to report
                issues and track resolution, and support agents who need AI-assisted triage to focus
                on what matters most first.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 text-white font-medium px-6 py-3 rounded-xl transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            Get Started
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;