// frontend/src/pages/TicketDetail.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTicketById,
  getMessages,
  addMessage,
  assignTicket,
  updateTicketStatus,
  resolveTicket,
  reopenTicket,
  reviewAiSuggestion,
  updateTicket,
} from "../api/tickets.js";
import { useAuth } from "../context/useAuth.js";
import {
  ArrowLeft,
  Sparkles,
  UserPlus,
  Clock,
  RotateCcw,
  Send,
  CheckCircle2,
  Pencil,
  AlertTriangle,
} from "lucide-react";

const CATEGORIES = ["Billing", "Technical", "General", "Account", "Other"];
const PRIORITIES = ["Low", "Medium", "High"];

const statusStyles = {
  New: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  Assigned: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  "In Progress": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-[#E8871E]" },
  Resolved: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
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

const TicketDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const [reviewCategory, setReviewCategory] = useState("");
  const [reviewPriority, setReviewPriority] = useState("");
  const [savingReview, setSavingReview] = useState(false);

  const [resolutionNote, setResolutionNote] = useState("");
  const [resolving, setResolving] = useState(false);

  const [actionError, setActionError] = useState("");
  const messagesEndRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editSubject, setEditSubject] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const isAgent = user?.role === "agent" || user?.role === "admin";

  const loadTicket = async () => {
    try {
      const res = await getTicketById(id);
      setTicket(res.data.data);
      setReviewCategory(res.data.data.category);
      setReviewPriority(res.data.data.priority);
      setEditSubject(res.data.data.subject);
      setEditDescription(res.data.data.description);
      setEditCategory(res.data.data.category);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load ticket");
    }
  };

  const loadMessages = async () => {
    try {
      const res = await getMessages(id);
      setMessages(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([loadTicket(), loadMessages()]);
      setLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadMessages();
      loadTicket();
    }, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      await addMessage(id, newMessage);
      setNewMessage("");
      await loadMessages();
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleAssignToMe = async () => {
    setActionError("");
    try {
      await assignTicket(id);
      await loadTicket();
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to assign ticket");
    }
  };

  const handleStatusChange = async (status) => {
    setActionError("");
    try {
      await updateTicketStatus(id, status);
      await loadTicket();
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleSaveReview = async () => {
    setSavingReview(true);
    setActionError("");
    try {
      await reviewAiSuggestion(id, reviewCategory, reviewPriority);
      await loadTicket();
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to save review");
    } finally {
      setSavingReview(false);
    }
  };

  const handleResolve = async (e) => {
    e.preventDefault();
    setResolving(true);
    setActionError("");
    try {
      await resolveTicket(id, resolutionNote);
      await loadTicket();
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to resolve ticket");
    } finally {
      setResolving(false);
    }
  };

  const handleReopen = async () => {
    setActionError("");
    try {
      await reopenTicket(id);
      await loadTicket();
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to reopen ticket");
    }
  };

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    setActionError("");
    try {
      await updateTicket(id, {
        subject: editSubject,
        description: editDescription,
        category: editCategory,
      });
      setIsEditing(false);
      await loadTicket();
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to update ticket");
    } finally {
      setSavingEdit(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-6 h-6 border-2 border-[#2A6F6F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl">
        <p className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => navigate(isAgent ? "/dashboard" : "/my-tickets")}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#2A6F6F] transition-colors mb-4"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
        {isEditing ? (
          <form onSubmit={handleUpdateTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#14213D] mb-1">Subject</label>
              <input
                type="text"
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
                className="w-full border border-gray-200 p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2A6F6F]/30"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#14213D] mb-1">Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={4}
                className="w-full border border-gray-200 p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2A6F6F]/30"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#14213D] mb-1">Category</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full border border-gray-200 p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2A6F6F]/30"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={savingEdit}
                className="bg-[#2A6F6F] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#235c5c] transition-colors disabled:opacity-50"
              >
                {savingEdit ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex justify-between items-start mb-2">
              <h1 className="font-display text-xl font-semibold text-[#14213D]">{ticket.subject}</h1>
              <StatusBadge status={ticket.status} />
            </div>
            <p className="text-xs text-gray-400 font-mono mb-3">
              {ticket.ticketNumber} · {ticket.category} · {ticket.priority} priority
            </p>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">{ticket.description}</p>
            <p className="text-xs text-gray-400 mb-3">
              {ticket.customer?.name} → {ticket.assignedAgent?.name || "Unassigned"}
            </p>
            {!isAgent && ticket.status !== "Resolved" && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 text-sm text-[#2A6F6F] hover:underline font-medium"
              >
                <Pencil size={14} />
                Edit Ticket
              </button>
            )}
          </>
        )}
      </div>

      {actionError && (
        <p className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-sm mb-4">{actionError}</p>
      )}

      {isAgent && ticket.aiSuggestion?.summary && (
        <div className="bg-white border border-[#E8871E]/20 rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-[#E8871E]/15 flex items-center justify-center">
              <Sparkles size={14} className="text-[#E8871E]" strokeWidth={2} />
            </div>
            <h3 className="font-semibold text-[#14213D] text-sm">AI Suggestion</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">{ticket.aiSuggestion.summary}</p>
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
              <select
                value={reviewCategory}
                onChange={(e) => setReviewCategory(e.target.value)}
                className="w-full border border-gray-200 p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2A6F6F]/30"
                disabled={ticket.status === "Resolved"}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Priority</label>
              <select
                value={reviewPriority}
                onChange={(e) => setReviewPriority(e.target.value)}
                className="w-full border border-gray-200 p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2A6F6F]/30"
                disabled={ticket.status === "Resolved"}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
          {ticket.status !== "Resolved" && (
            <button
              onClick={handleSaveReview}
              disabled={savingReview}
              className="bg-[#14213D] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1e2d54] transition-colors disabled:opacity-50"
            >
              {savingReview ? "Saving..." : "Confirm & Save"}
            </button>
          )}
        </div>
      )}

      {isAgent && ticket.aiSuggestion?.failed && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 text-sm text-amber-800 flex items-start gap-2">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          AI suggestion unavailable — set category and priority manually above.
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {isAgent && !ticket.assignedAgent && ticket.status !== "Resolved" && (
          <button
            onClick={handleAssignToMe}
            className="inline-flex items-center gap-2 bg-[#2A6F6F] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#235c5c] transition-colors"
          >
            <UserPlus size={16} />
            Assign to Me
          </button>
        )}

        {isAgent && ticket.assignedAgent && ticket.status === "Assigned" && (
          <button
            onClick={() => handleStatusChange("In Progress")}
            className="inline-flex items-center gap-2 bg-[#E8871E] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#d47818] transition-colors"
          >
            <Clock size={16} />
            Mark In Progress
          </button>
        )}

        {isAgent && ticket.status === "Resolved" && (
          <button
            onClick={handleReopen}
            className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            <RotateCcw size={16} />
            Reopen Ticket
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
        <h3 className="font-semibold text-[#14213D] text-sm mb-3">Conversation</h3>
        <div className="space-y-3 max-h-80 overflow-y-auto mb-4 pr-1">
          {messages.length === 0 && (
            <p className="text-sm text-gray-400">No messages yet.</p>
          )}
          {messages.map((m) => (
            <div
              key={m._id}
              className={`flex ${m.senderRole === "agent" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-3.5 py-2.5 rounded-2xl text-sm ${
                  m.senderRole === "agent"
                    ? "bg-[#2A6F6F] text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-800 rounded-bl-sm"
                }`}
              >
                <p className={`text-xs mb-0.5 ${m.senderRole === "agent" ? "text-white/70" : "text-gray-400"}`}>
                  {m.sender?.name}
                </p>
                <p>{m.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {ticket.status !== "Resolved" ? (
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2A6F6F]/30"
            />
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 bg-[#2A6F6F] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#235c5c] transition-colors disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </form>
        ) : (
          <p className="text-sm text-gray-400">Ticket resolved — conversation closed.</p>
        )}
      </div>

      {isAgent && ticket.status === "In Progress" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-[#14213D] text-sm mb-3">Resolve Ticket</h3>
          <form onSubmit={handleResolve} className="space-y-3">
            <textarea
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              placeholder="Resolution note (required)"
              rows={3}
              className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2A6F6F]/30"
              required
            />
            <button
              type="submit"
              disabled={resolving}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              <CheckCircle2 size={16} />
              {resolving ? "Resolving..." : "Mark as Resolved"}
            </button>
          </form>
        </div>
      )}

      {ticket.status === "Resolved" && ticket.resolutionNote && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
          <h3 className="font-semibold text-emerald-800 text-sm mb-1 flex items-center gap-1.5">
            <CheckCircle2 size={16} />
            Resolution
          </h3>
          <p className="text-sm text-emerald-700">{ticket.resolutionNote}</p>
        </div>
      )}
    </div>
  );
};

export default TicketDetail;