import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from '../api/tickets.js';
import { useAuth } from '../context/useAuth.js';

const CATEGORIES = ['Billing', 'Technical', 'General', 'Account', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const statusColors = {
  New: 'bg-gray-200 text-gray-800',
  Assigned: 'bg-blue-200 text-blue-800',
  'In Progress': 'bg-yellow-200 text-yellow-800',
  Resolved: 'bg-green-200 text-green-800',
};

const TicketDetail = () => {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  const [reviewCategory, setReviewCategory] = useState('');
  const [reviewPriority, setReviewPriority] = useState('');
  const [savingReview, setSavingReview] = useState(false);

  const [resolutionNote, setResolutionNote] = useState('');
  const [resolving, setResolving] = useState(false);

  const [actionError, setActionError] = useState('');
  const messagesEndRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editSubject, setEditSubject] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const isAgent = user?.role === 'agent' || user?.role === 'admin';

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
      setError(err.response?.data?.message || 'Failed to load ticket');
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      await addMessage(id, newMessage);
      setNewMessage('');
      await loadMessages();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleAssignToMe = async () => {
    setActionError('');
    try {
      await assignTicket(id);
      await loadTicket();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to assign ticket');
    }
  };

  const handleStatusChange = async (status) => {
    setActionError('');
    try {
      await updateTicketStatus(id, status);
      await loadTicket();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleSaveReview = async () => {
    setSavingReview(true);
    setActionError('');
    try {
      await reviewAiSuggestion(id, reviewCategory, reviewPriority);
      await loadTicket();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to save review');
    } finally {
      setSavingReview(false);
    }
  };

  const handleResolve = async (e) => {
    e.preventDefault();
    setResolving(true);
    setActionError('');
    try {
      await resolveTicket(id, resolutionNote);
      await loadTicket();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to resolve ticket');
    } finally {
      setResolving(false);
    }
  };

  const handleReopen = async () => {
    setActionError('');
    try {
      await reopenTicket(id);
      await loadTicket();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to reopen ticket');
    }
  };

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    setActionError('');
    try {
      await updateTicket(id, {
        subject: editSubject,
        description: editDescription,
        category: editCategory,
      });
      setIsEditing(false);
      await loadTicket();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to update ticket');
    } finally {
      setSavingEdit(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate(isAgent ? '/dashboard' : '/my-tickets')}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back
        </button>
        <button onClick={logout} className="text-sm text-red-500 hover:text-red-700">
          Logout
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        {isEditing ? (
          <form onSubmit={handleUpdateTicket} className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">Subject</label>
              <input
                type="text"
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
                className="w-full border p-2 rounded text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={4}
                className="w-full border p-2 rounded text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Category</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full border p-2 rounded text-sm"
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
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {savingEdit ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-xl font-bold">{ticket.subject}</h1>
              <span className={`text-xs px-2 py-1 rounded-full ${statusColors[ticket.status]}`}>
                {ticket.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-3">
              {ticket.ticketNumber} · {ticket.category} · {ticket.priority}
            </p>
            <p className="text-gray-700 mb-3">{ticket.description}</p>
            <p className="text-xs text-gray-400 mb-3">
              Customer: {ticket.customer?.name} · Agent: {ticket.assignedAgent?.name || 'Unassigned'}
            </p>
            {!isAgent && ticket.status !== 'Resolved' && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-blue-600 hover:underline"
              >
                Edit Ticket
              </button>
            )}
          </>
        )}
      </div>

      {actionError && (
        <p className="text-red-500 text-sm mb-4">{actionError}</p>
      )}

      {isAgent && ticket.aiSuggestion?.summary && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-purple-800 mb-2">AI Suggestion</h3>
          <p className="text-sm text-purple-700 mb-3">{ticket.aiSuggestion.summary}</p>
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1">Category</label>
              <select
                value={reviewCategory}
                onChange={(e) => setReviewCategory(e.target.value)}
                className="w-full border p-2 rounded text-sm"
                disabled={ticket.status === 'Resolved'}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1">Priority</label>
              <select
                value={reviewPriority}
                onChange={(e) => setReviewPriority(e.target.value)}
                className="w-full border p-2 rounded text-sm"
                disabled={ticket.status === 'Resolved'}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
          {ticket.status !== 'Resolved' && (
            <button
              onClick={handleSaveReview}
              disabled={savingReview}
              className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 disabled:opacity-50"
            >
              {savingReview ? 'Saving...' : 'Confirm & Save'}
            </button>
          )}
        </div>
      )}

      {isAgent && ticket.aiSuggestion?.failed && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-sm text-yellow-800">
          AI suggestion unavailable — please set category/priority manually above.
        </div>
      )}

      {isAgent && !ticket.assignedAgent && ticket.status !== 'Resolved' && (
        <button
          onClick={handleAssignToMe}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 mb-4"
        >
          Assign to Me
        </button>
      )}

      {isAgent && ticket.assignedAgent && ticket.status === 'Assigned' && (
        <button
          onClick={() => handleStatusChange('In Progress')}
          className="bg-yellow-500 text-white px-4 py-2 rounded text-sm hover:bg-yellow-600 mb-4"
        >
          Mark In Progress
        </button>
      )}

      {isAgent && ticket.status === 'Resolved' && (
        <button
          onClick={handleReopen}
          className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 mb-4"
        >
          Reopen Ticket
        </button>
      )}

      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h3 className="font-semibold mb-3">Conversation</h3>
        <div className="space-y-3 max-h-80 overflow-y-auto mb-3">
          {messages.length === 0 && (
            <p className="text-sm text-gray-400">No messages yet.</p>
          )}
          {messages.map((m) => (
            <div
              key={m._id}
              className={`flex ${m.senderRole === 'agent' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  m.senderRole === 'agent'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p className="text-xs opacity-75 mb-1">{m.sender?.name}</p>
                <p>{m.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {ticket.status !== 'Resolved' ? (
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border p-2 rounded text-sm"
            />
            <button
              type="submit"
              disabled={sending}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {sending ? '...' : 'Send'}
            </button>
          </form>
        ) : (
          <p className="text-sm text-gray-400">Ticket resolved — conversation closed.</p>
        )}
      </div>

      {isAgent && ticket.status === 'In Progress' && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold mb-2">Resolve Ticket</h3>
          <form onSubmit={handleResolve} className="space-y-2">
            <textarea
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              placeholder="Resolution note (required)"
              rows={3}
              className="w-full border p-2 rounded text-sm"
              required
            />
            <button
              type="submit"
              disabled={resolving}
              className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
            >
              {resolving ? 'Resolving...' : 'Mark as Resolved'}
            </button>
          </form>
        </div>
      )}

      {ticket.status === 'Resolved' && ticket.resolutionNote && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-1">Resolution</h3>
          <p className="text-sm text-green-700">{ticket.resolutionNote}</p>
        </div>
      )}
    </div>
  );
};

export default TicketDetail;