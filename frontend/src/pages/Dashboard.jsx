import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTickets } from "../api/tickets.js";
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
} from "recharts";
import {
  Layers,
  Inbox,
  Clock,
  CheckCircle2,
  ArrowRight,
  User,
} from "lucide-react";

const statusStyles = {
  New: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    dot: "bg-gray-400",
    hex: "#9CA3AF",
  },
  Assigned: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
    hex: "#3B82F6",
  },
  "In Progress": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-[#E8871E]",
    hex: "#E8871E",
  },
  Resolved: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    hex: "#10B981",
  },
};

const priorityStyles = {
  Low: { text: "text-emerald-600", dot: "bg-emerald-500" },
  Medium: { text: "text-amber-600", dot: "bg-amber-500" },
  High: { text: "text-red-600", dot: "bg-red-500" },
};

const StatusBadge = ({ status }) => {
  const s = statusStyles[status] || statusStyles.New;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
      {status}
    </span>
  );
};

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
    <div
      className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${accent.bg}`}
    >
      <Icon size={18} className={accent.text} strokeWidth={2} />
    </div>
    <p className="text-2xl font-bold text-[#14213D]">{value}</p>
    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
  </div>
);

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await getTickets();
        setTickets(res.data.data);
      } catch (err) {
        setError("Failed to load tickets");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const filteredTickets =
    statusFilter === "All"
      ? tickets
      : tickets.filter((t) => t.status === statusFilter);

  const stats = {
    total: tickets.length,
    new: tickets.filter((t) => t.status === "New").length,
    inProgress: tickets.filter((t) => t.status === "In Progress").length,
    resolved: tickets.filter((t) => t.status === "Resolved").length,
  };

  const statusChartData = ["New", "Assigned", "In Progress", "Resolved"]
    .map((s) => ({
      name: s,
      value: tickets.filter((t) => t.status === s).length,
      color: statusStyles[s].hex,
    }))
    .filter((d) => d.value > 0);

  const categoryChartData = [
    "Billing",
    "Technical",
    "General",
    "Account",
    "Other",
  ].map((c) => ({
    name: c,
    count: tickets.filter((t) => t.category === c).length,
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#14213D]">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of all support tickets
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Layers}
          label="Total tickets"
          value={stats.total}
          accent={{ bg: "bg-[#14213D]/5", text: "text-[#14213D]" }}
        />
        <StatCard
          icon={Inbox}
          label="New"
          value={stats.new}
          accent={{ bg: "bg-gray-100", text: "text-gray-500" }}
        />
        <StatCard
          icon={Clock}
          label="In progress"
          value={stats.inProgress}
          accent={{ bg: "bg-[#E8871E]/10", text: "text-[#E8871E]" }}
        />
        <StatCard
          icon={CheckCircle2}
          label="Resolved"
          value={stats.resolved}
          accent={{ bg: "bg-emerald-50", text: "text-emerald-600" }}
        />
      </div>

      {!loading && tickets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-[#14213D] mb-4">
              Ticket Status
            </h3>
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      dataKey="value"
                      innerRadius={35}
                      outerRadius={55}
                      paddingAngle={2}
                    >
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
                  <div
                    key={d.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="flex items-center gap-2 text-gray-600">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: d.color }}
                      ></span>
                      {d.name}
                    </span>
                    <span className="font-semibold text-[#14213D]">
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-[#14213D] mb-4">
              Tickets by Category
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={categoryChartData}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={{ stroke: "#F3F4F6" }}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip cursor={{ fill: "#F7F7F5" }} />
                <Bar dataKey="count" fill="#2A6F6F" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {["All", "New", "Assigned", "In Progress", "Resolved"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-sm px-3.5 py-1.5 rounded-full border whitespace-nowrap transition-colors ${
              statusFilter === s
                ? "bg-[#14213D] text-white border-[#14213D]"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
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
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl p-5 h-24 animate-pulse"
            />
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
                  <span className="font-medium text-[#14213D] truncate">
                    {t.subject}
                  </span>
                  <StatusBadge status={t.status} />
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="font-mono">{t.ticketNumber}</span>
                  <span>{t.category}</span>
                  <span
                    className={`inline-flex items-center gap-1 ${priorityStyles[t.priority]?.text}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${priorityStyles[t.priority]?.dot}`}
                    ></span>
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
