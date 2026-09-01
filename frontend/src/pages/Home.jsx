import { Link } from "react-router-dom";
import { useTheme } from "../context/useTheme.js";
import { useReveal } from "../hooks/useReveal.js";
import ProfileDropdown from "../components/ProfileDropdown.jsx";
import {
  Sun,
  Moon,
  Sparkles,
  Zap,
  Send,
  CheckCircle2,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  Users,
  ArrowRight,
  // Clock,
  Lock,
  Workflow,
  Bell,
  Star,
  ChevronDown,
  Bot,
} from "lucide-react";
import { useState } from "react";

const Reveal = ({ children, className = "" }) => {
  const [ref, isVisible] = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? "reveal-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
};

const faqs = [
  {
    q: "How does AI triage work?",
    a: "When a customer submits a ticket, Gemini AI analyzes the subject and description to suggest a category, priority level, and short summary — all within seconds. An agent always reviews and confirms these before they're finalized.",
  },
  {
    q: "What happens if the AI service fails?",
    a: "SupportFlow has a two-tier fallback system. If the primary model fails or times out, a secondary model takes over automatically. If both fail, the ticket is still created and can be handled fully manually — AI is never a blocking dependency.",
  },
  {
    q: "Can customers edit a ticket after submitting?",
    a: "Yes, customers can edit the subject, description, and category of their own tickets at any point before it's resolved. Editing automatically re-triggers AI triage on the updated content.",
  },
  {
    q: "How do status updates happen in real time?",
    a: "The ticket detail view polls the backend every few seconds, so new agent replies and status changes appear automatically — no manual refresh needed.",
  },
  {
    q: "What happens to a resolved ticket?",
    a: 'Resolved tickets are locked from further changes. An agent can explicitly reopen a ticket if the issue reoccurs, which moves it back to "In Progress".',
  },
];

const FaqItem = ({ item }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span
          className="text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          {item.q}
        </span>
        <ChevronDown
          size={18}
          style={{
            color: "var(--text-muted)",
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        />
      </button>
      {open && (
        <div
          className="px-5 pb-4 text-sm leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {item.a}
        </div>
      )}
    </div>
  );
};

const Home = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      style={{
        backgroundColor: "var(--bg-base)",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <nav
        className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto sticky top-0 z-40 backdrop-blur-sm"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--bg-base) 85%, transparent)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, var(--accent), var(--highlight))",
            }}
          >
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <span
            className="font-bold text-lg tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            SupportFlow
          </span>
        </div>

        <div
          className="hidden md:flex items-center gap-6 text-sm font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          <a href="#modules">Modules</a>
          <a href="#how-it-works">How it works</a>
          <a href="#faq">FAQ</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            style={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
            }}
          >
            {theme === "dark" ? (
              <Sun size={16} style={{ color: "var(--text-secondary)" }} />
            ) : (
              <Moon size={16} style={{ color: "var(--text-secondary)" }} />
            )}
          </button>
          <ProfileDropdown />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-14 pb-10 text-center relative">
        <div
          className="absolute top-10 left-1/4 w-16 h-16 rounded-2xl float-slow hidden md:block"
          style={{ backgroundColor: "var(--accent-soft)" }}
        />
        <div
          className="absolute top-24 right-1/4 w-10 h-10 rounded-full float-slow hidden md:block"
          style={{
            backgroundColor: "var(--highlight-soft)",
            animationDelay: "1s",
          }}
        />

        <div
          className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-6 text-xs font-medium"
          style={{
            backgroundColor: "var(--accent-soft)",
            color: "var(--accent)",
          }}
        >
          <Sparkles size={13} />
          AI-assisted triage, human-reviewed
        </div>

        <h1
          className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1]"
          style={{ color: "var(--text-primary)" }}
        >
          Support tickets,
          <br />
          <span
            style={{
              background:
                "linear-gradient(135deg, var(--accent), var(--highlight))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            sorted before you open them
          </span>
        </h1>
        <p
          className="text-lg max-w-xl mx-auto mb-10"
          style={{ color: "var(--text-secondary)" }}
        >
          Customers submit a ticket. AI suggests the category, priority, and a
          short summary. Agents review, reply, and resolve — every step, in real
          time.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 text-white font-medium px-6 py-3.5 rounded-xl transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <Send size={16} />
            Submit a ticket
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 font-medium px-6 py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
            style={{
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-color)",
            }}
          >
            Log in
          </Link>
        </div>

        <div
          className="flex items-center justify-center gap-1.5 mb-12 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={13}
              fill="var(--highlight)"
              style={{ color: "var(--highlight)" }}
            />
          ))}
          <span className="ml-1">Built for AI Factory 2.0 Hackathon</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
          {[
            { label: "Avg. response time", value: "< 2 hrs" },
            { label: "AI triage accuracy", value: "~94%" },
            { label: "Tickets resolved", value: "1,200+" },
            { label: "Uptime", value: "99.9%" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-4 text-center"
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
              }}
            >
              <p
                className="text-xl font-bold"
                style={{ color: "var(--accent)" }}
              >
                {s.value}
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Reveal className="max-w-4xl mx-auto px-6 pb-16">
        <div
          className="rounded-2xl p-6"
          style={{
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div
            className="flex items-center justify-between mb-4 pb-4"
            style={{ borderBottom: "1px solid var(--border-color)" }}
          >
            <div>
              <p
                className="text-xs font-mono"
                style={{ color: "var(--text-muted)" }}
              >
                TCK-402080-7894
              </p>
              <p
                className="font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Double charged for order
              </p>
            </div>
            <span
              className="text-xs px-3 py-1.5 rounded-full font-medium"
              style={{
                backgroundColor: "var(--highlight-soft)",
                color: "var(--highlight)",
              }}
            >
              High priority
            </span>
          </div>
          <div
            className="rounded-xl p-4 flex items-start gap-3"
            style={{ backgroundColor: "var(--accent-soft)" }}
          >
            <Bot
              size={16}
              style={{ color: "var(--accent)" }}
              className="mt-0.5 shrink-0"
            />
            <div>
              <p
                className="text-xs font-semibold mb-1"
                style={{ color: "var(--accent)" }}
              >
                AI Suggestion
              </p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Billing · Possible duplicate payment reported by customer —
                recommend reviewing recent transaction history before refunding.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      <div id="modules" className="max-w-5xl mx-auto px-6 pb-20">
        <Reveal className="text-center mb-10">
          <div
            className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3"
            style={{
              backgroundColor: "var(--highlight-soft)",
              color: "var(--highlight)",
            }}
          >
            PLATFORM MODULES
          </div>
          <h2
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Everything the desk needs
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Purpose-built modules for customers, agents, and the full ticket
            lifecycle
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: MessageSquare,
              title: "Ticket Vault & Live Chat",
              desc: "Every customer ticket in one place with real-time two-way messaging between customer and assigned agent.",
            },
            {
              icon: Zap,
              title: "AI Triage Engine",
              desc: "Automatic category, priority, and summary suggestions generated the moment a ticket is submitted.",
            },
            {
              icon: BarChart3,
              title: "Agent Analytics",
              desc: "Live breakdown of ticket status and category distribution across the whole desk.",
            },
            {
              icon: ShieldCheck,
              title: "Role-Based Access",
              desc: "Customers see only their own tickets. Agents only manage what's assigned to them.",
            },
            {
              icon: Workflow,
              title: "Guided Workflow",
              desc: "New → Assigned → In Progress → Resolved. A resolved ticket stays locked until reopened.",
            },
            {
              icon: Bell,
              title: "Live Status Updates",
              desc: "Status changes and new replies appear automatically, no manual refresh required.",
            },
          ].map((m, idx) => {
            const Icon = m.icon;
            return (
              <Reveal key={m.title} className={`delay-${idx}`}>
                <div
                  className="rounded-2xl p-6 h-full transition-all hover:-translate-y-1"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: "var(--accent-soft)" }}
                  >
                    <Icon size={20} style={{ color: "var(--accent)" }} />
                  </div>
                  <h3
                    className="font-semibold mb-1.5"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {m.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {m.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      <div id="how-it-works" className="max-w-5xl mx-auto px-6 pb-20">
        <Reveal className="text-center mb-10">
          <h2
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            How SupportFlow resolves tickets end-to-end
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            A transparent pipeline from submission to resolution
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              icon: Send,
              step: "01",
              title: "Customer submits",
              desc: "A short form — subject, description, category. Takes under a minute.",
            },
            {
              icon: Bot,
              step: "02",
              title: "AI triages instantly",
              desc: "Category, priority, and a summary generated in seconds — ready for the agent to confirm or edit.",
            },
            {
              icon: CheckCircle2,
              step: "03",
              title: "Agent resolves",
              desc: "Assign, reply, and close — with the full conversation on record and updates in real time.",
            },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title}>
                <div
                  className="rounded-2xl p-6 relative overflow-hidden transition-transform hover:-translate-y-1 h-full"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <span
                    className="absolute top-4 right-5 text-4xl font-extrabold opacity-10"
                    style={{ color: "var(--accent)" }}
                  >
                    {f.step}
                  </span>
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: "var(--accent-soft)" }}
                  >
                    <Icon size={20} style={{ color: "var(--accent)" }} />
                  </div>
                  <h3
                    className="font-semibold mb-1.5"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {f.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-20">
        <Reveal className="text-center mb-10">
          <h2
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Built for two kinds of users
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Every screen adapts to the role that's logged in
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Reveal>
            <div
              className="rounded-2xl p-7 h-full"
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: "var(--accent-soft)" }}
              >
                <Users size={22} style={{ color: "var(--accent)" }} />
              </div>
              <h3
                className="text-lg font-bold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                For Customers
              </h3>
              <ul
                className="space-y-2.5 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {[
                  "Submit tickets in under a minute",
                  "Track status of every ticket you've raised",
                  "Message your assigned agent directly",
                  "Edit ticket details before it's resolved",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <CheckCircle2
                      size={16}
                      style={{ color: "var(--accent)" }}
                      className="shrink-0 mt-0.5"
                    />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal>
            <div
              className="rounded-2xl p-7 h-full"
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: "var(--highlight-soft)" }}
              >
                <Lock size={22} style={{ color: "var(--highlight)" }} />
              </div>
              <h3
                className="text-lg font-bold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                For Agents
              </h3>
              <ul
                className="space-y-2.5 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {[
                  "Review and edit AI-suggested category & priority",
                  "Assign, reply, and resolve tickets from one dashboard",
                  "Real-time analytics on ticket volume and status",
                  "Reopen resolved tickets when needed",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <CheckCircle2
                      size={16}
                      style={{ color: "var(--highlight)" }}
                      className="shrink-0 mt-0.5"
                    />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>

      <div id="faq" className="max-w-3xl mx-auto px-6 pb-20">
        <Reveal className="text-center mb-10">
          <h2
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Frequently asked questions
          </h2>
        </Reveal>
        <div className="space-y-3">
          {faqs.map((item) => (
            <Reveal key={item.q}>
              <FaqItem item={item} />
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal className="max-w-4xl mx-auto px-6 pb-20">
        <div
          className="rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, var(--accent), var(--highlight))",
          }}
        >
          <Users size={28} className="text-white/80 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Ready to streamline your support desk?
          </h2>
          <p className="text-white/85 text-sm mb-6 max-w-md mx-auto">
            Join as a customer or agent and see AI-assisted triage in action.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white font-medium px-6 py-3 rounded-xl transition-transform hover:-translate-y-0.5"
            style={{ color: "var(--accent)" }}
          >
            Get Started
            <ArrowRight size={16} />
          </Link>
        </div>
      </Reveal>

      <footer style={{ borderTop: "1px solid var(--border-color)" }}>
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent), var(--highlight))",
                  }}
                >
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  SupportFlow
                </span>
              </div>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                AI-assisted customer support desk for managing tickets from
                submission to resolution.
              </p>
            </div>

            <div>
              <p
                className="text-xs font-semibold mb-3 uppercase tracking-wide"
                style={{ color: "var(--text-primary)" }}
              >
                Product
              </p>
              <ul
                className="space-y-2 text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                <li>AI Ticket Triage</li>
                <li>Live Agent Chat</li>
                <li>Real-time Status Updates</li>
                <li>Analytics Dashboard</li>
              </ul>
            </div>

            <div>
              <p
                className="text-xs font-semibold mb-3 uppercase tracking-wide"
                style={{ color: "var(--text-primary)" }}
              >
                Stack
              </p>
              <ul
                className="space-y-2 text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                <li>React + Vite + Tailwind</li>
                <li>Node.js + Express + MongoDB</li>
                <li>Google Gemini AI</li>
                <li>JWT Authentication</li>
              </ul>
            </div>

            <div>
              <p
                className="text-xs font-semibold mb-3 uppercase tracking-wide"
                style={{ color: "var(--text-primary)" }}
              >
                Project
              </p>
              <ul
                className="space-y-2 text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                <li>AI Factory 2.0 Hackathon</li>
                <li>Team SupportFlow</li>
                <li>Built in 24 hours</li>
              </ul>
            </div>
          </div>

          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6"
            style={{ borderTop: "1px solid var(--border-color)" }}
          >
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              © 2026 SupportFlow · All systems operational
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Crafted with care by{" "}
              <span className="font-medium" style={{ color: "var(--accent)" }}>
                Sidra Aslam
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
