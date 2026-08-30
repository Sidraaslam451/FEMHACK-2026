import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../api/tickets.js';

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
    <div className="max-w-lg mx-auto px-6 py-8">
      <button
        onClick={() => navigate('/my-tickets')}
        className="text-sm text-gray-500 hover:text-[#2A6F6F] transition-colors mb-4 inline-flex items-center gap-1"
      >
        ← My tickets
      </button>

      <h1 className="font-display text-2xl font-semibold text-[#14213D] mb-1">New Support Ticket</h1>
      <p className="text-sm text-gray-500 mb-6">Tell us what's going on — we'll route it to the right agent.</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#14213D] mb-1.5">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief summary of the issue"
            className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2A6F6F]/30 focus:border-[#2A6F6F]"
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
            className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2A6F6F]/30 focus:border-[#2A6F6F]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#14213D] mb-1.5">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2A6F6F]/30 focus:border-[#2A6F6F]"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="bg-[#F7F7F5] rounded-lg p-3 flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8871E] mt-1.5 shrink-0"></span>
          <p className="text-xs text-gray-500">
            AI will suggest a category, priority, and summary for the agent to review before your ticket is assigned.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2A6F6F] text-white font-medium p-2.5 rounded-lg hover:bg-[#235c5c] transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </form>
    </div>
  );
};

export default CreateTicket;