// frontend/src/pages/CreateTicket.jsx
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

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => navigate('/my-tickets')}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#2A6F6F] transition-colors mb-4"
      >
        <ArrowLeft size={16} />
        My tickets
      </button>

      <h1 className="font-display text-2xl font-semibold text-[#14213D] mb-1">New Support Ticket</h1>
      <p className="text-sm text-gray-500 mb-6">Tell us what's going on — we'll route it to the right agent.</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#14213D] mb-1.5">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief summary of the issue"
            className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2A6F6F]/30 focus:border-[#2A6F6F] transition-shadow"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#14213D] mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What happened? Include any relevant details."
            rows={5}
            className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2A6F6F]/30 focus:border-[#2A6F6F] transition-shadow"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#14213D] mb-1.5">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2A6F6F]/30 focus:border-[#2A6F6F] transition-shadow"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="bg-[#F7F7F5] rounded-xl p-4 flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#E8871E]/15 flex items-center justify-center shrink-0">
            <Sparkles size={14} className="text-[#E8871E]" strokeWidth={2} />
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            AI will suggest a category, priority, and summary for the agent to review before your ticket is assigned.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2A6F6F] text-white font-medium p-3 rounded-lg hover:bg-[#235c5c] transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </form>
    </div>
  );
};

export default CreateTicket;