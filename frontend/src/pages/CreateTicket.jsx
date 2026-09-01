import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../api/tickets.js';
import { ArrowLeft, Sparkles } from 'lucide-react';

const CATEGORIES = ['Billing', 'Technical', 'General', 'Account', 'Other'];

const CreateTicket = () => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await createTicket({ subject, description, category });
      navigate(`/tickets/${res.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: 'var(--bg-surface-hover)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
  };

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => navigate('/my-tickets')}
        className="inline-flex items-center gap-1.5 text-sm mb-4 transition-colors"
        style={{ color: 'var(--text-secondary)' }}
      >
        <ArrowLeft size={16} />
        My tickets
      </button>

      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>New Support Ticket</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
        Tell us what's going on — we'll route it to the right agent.
      </p>

      {error && (
        <div
          className="text-sm rounded-lg p-3 mb-4"
          style={{ backgroundColor: 'var(--highlight-soft)', color: 'var(--highlight)' }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl p-6 space-y-5"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
      >
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief summary of the issue"
            className="w-full p-2.5 rounded-lg text-sm focus:outline-none"
            style={inputStyle}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What happened? Include any relevant details."
            rows={5}
            className="w-full p-2.5 rounded-lg text-sm focus:outline-none"
            style={inputStyle}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2.5 rounded-lg text-sm focus:outline-none"
            style={inputStyle}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="rounded-xl p-4 flex items-start gap-3" style={{ backgroundColor: 'var(--accent-soft)' }}>
          <Sparkles size={16} style={{ color: 'var(--accent)' }} className="mt-0.5 shrink-0" />
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            AI will suggest a category, priority, and summary for the agent to review before your ticket is assigned.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full text-white font-medium p-3 rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          {loading ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </form>
    </div>
  );
};

export default CreateTicket;