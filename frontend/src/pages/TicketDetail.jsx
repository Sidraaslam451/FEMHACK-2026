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

const statusColors = {
  New: "#9CA3AF",
  Assigned: "#60A5FA",
  "In Progress": "#FB7185",
  Resolved: "#34D399",
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

  const inputStyle = {
    backgroundColor: 'var(--bg-surface-hover)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
  };

  const cardStyle = {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-color)',
  };

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
        <div
          className="w-6 h-6 border-2 rounded-full animate-spin"
          style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl">
        <p
          className="text-sm rounded-lg p-3"
          style={{ backgroundColor: 'var(--highlight-soft)', color: 'var(--highlight)' }}
        >
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => navigate(isAgent ? "/dashboard" : "/my-tickets")}
        className="inline-flex items-center gap-1.5 text-sm mb-4 transition-colors"
        style={{ color: 'var(--text-secondary)' }}
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="rounded-2xl p-6 mb-4" style={cardStyle}>
        {isEditing ? (
          <form onSubmit={handleUpdateTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Subject</label>
              <input
                type="text"
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
                className="w-full p-2 rounded-lg text-sm focus:outline-none"
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={4}
                className="w-full p-2 rounded-lg text-sm focus:outline-none"
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Category</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full p-2 rounded-lg text-sm focus:outline-none"
                style={inputStyle}
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
                className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                {savingEdit ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: 'var(--bg-surface-hover)', color: 'var(--text-secondary)' }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{ticket.subject}</h1>
              <StatusBadge status={ticket.status} />
            </div>
            <p className="text-xs font-mono mb-3" style={{ color: 'var(--text-muted)' }}>
              {ticket.ticketNumber} · {ticket.category} · {ticket.priority} priority
            </p>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{ticket.description}</p>
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
              {ticket.customer?.name} → {ticket.assignedAgent?.name || "Unassigned"}
            </p>
            {!isAgent && ticket.status !== "Resolved" && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                <Pencil size={14} />
                Edit Ticket
              </button>
            )}
          </>
        )}
      </div>

      {actionError && (
        <p
          className="text-sm rounded-lg p-3 mb-4"
          style={{ backgroundColor: 'var(--highlight-soft)', color: 'var(--highlight)' }}
        >
          {actionError}
        </p>
      )}

      {isAgent && ticket.aiSuggestion?.summary && (
        <div className="rounded-2xl p-5 mb-4" style={{ ...cardStyle, borderColor: 'var(--accent)' }}>
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--accent-soft)' }}
            >
              <Sparkles size={14} style={{ color: 'var(--accent)' }} strokeWidth={2} />
            </div>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>AI Suggestion</h3>
          </div>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{ticket.aiSuggestion.summary}</p>
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Category</label>
              <select
                value={reviewCategory}
                onChange={(e) => setReviewCategory(e.target.value)}
                className="w-full p-2 rounded-lg text-sm focus:outline-none"
                style={inputStyle}
                disabled={ticket.status === "Resolved"}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Priority</label>
              <select
                value={reviewPriority}
                onChange={(e) => setReviewPriority(e.target.value)}
                className="w-full p-2 rounded-lg text-sm focus:outline-none"
                style={inputStyle}
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
              className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {savingReview ? "Saving..." : "Confirm & Save"}
            </button>
          )}
        </div>
      )}

      {isAgent && ticket.aiSuggestion?.failed && (
        <div
          className="rounded-2xl p-4 mb-4 text-sm flex items-start gap-2"
          style={{ backgroundColor: 'var(--highlight-soft)', color: 'var(--highlight)' }}
        >
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          AI suggestion unavailable — set category and priority manually above.
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {isAgent && !ticket.assignedAgent && ticket.status !== "Resolved" && (
          <button
            onClick={handleAssignToMe}
            className="inline-flex items-center gap-2 text-white px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            <UserPlus size={16} />
            Assign to Me
          </button>
        )}

        {isAgent && ticket.assignedAgent && ticket.status === "Assigned" && (
          <button
            onClick={() => handleStatusChange("In Progress")}
            className="inline-flex items-center gap-2 text-white px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--highlight)' }}
          >
            <Clock size={16} />
            Mark In Progress
          </button>
        )}

        {isAgent && ticket.status === "Resolved" && (
          <button
            onClick={handleReopen}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'var(--bg-surface-hover)', color: 'var(--text-secondary)' }}
          >
            <RotateCcw size={16} />
            Reopen Ticket
          </button>
        )}
      </div>

      <div className="rounded-2xl p-5 mb-4" style={cardStyle}>
        <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>Conversation</h3>
        <div className="space-y-3 max-h-80 overflow-y-auto mb-4 pr-1">
          {messages.length === 0 && (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No messages yet.</p>
          )}
          {messages.map((m) => (
            <div key={m._id} className={`flex ${m.senderRole === "agent" ? "justify-end" : "justify-start"}`}>
              <div
                className="max-w-xs px-3.5 py-2.5 rounded-2xl text-sm"
                style={
                  m.senderRole === "agent"
                    ? { backgroundColor: 'var(--accent)', color: 'white', borderBottomRightRadius: '4px' }
                    : { backgroundColor: 'var(--bg-surface-hover)', color: 'var(--text-primary)', borderBottomLeftRadius: '4px' }
                }
              >
                <p
                  className="text-xs mb-0.5"
                  style={{ color: m.senderRole === "agent" ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}
                >
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
              className="flex-1 p-2.5 rounded-lg text-sm focus:outline-none"
              style={inputStyle}
            />
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 text-white px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              <Send size={16} />
            </button>
          </form>
        ) : (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Ticket resolved — conversation closed.</p>
        )}
      </div>

      {isAgent && ticket.status === "In Progress" && (
        <div className="rounded-2xl p-5" style={cardStyle}>
          <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>Resolve Ticket</h3>
          <form onSubmit={handleResolve} className="space-y-3">
            <textarea
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              placeholder="Resolution note (required)"
              rows={3}
              className="w-full p-2.5 rounded-lg text-sm focus:outline-none"
              style={inputStyle}
              required
            />
            <button
              type="submit"
              disabled={resolving}
              className="inline-flex items-center gap-2 text-white px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#34D399' }}
            >
              <CheckCircle2 size={16} />
              {resolving ? "Resolving..." : "Mark as Resolved"}
            </button>
          </form>
        </div>
      )}

      {ticket.status === "Resolved" && ticket.resolutionNote && (
        <div className="rounded-2xl p-5" style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
          <h3 className="font-semibold text-sm mb-1 flex items-center gap-1.5" style={{ color: '#34D399' }}>
            <CheckCircle2 size={16} />
            Resolution
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{ticket.resolutionNote}</p>
        </div>
      )}
    </div>
  );
};

export default TicketDetail;