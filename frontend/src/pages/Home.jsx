import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#F7F7F5]">
      <nav className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#2A6F6F] flex items-center justify-center">
            <span className="text-white text-sm font-bold font-display">S</span>
          </div>
          <span className="font-display font-semibold text-[#14213D] text-lg tracking-tight">
            SupportFlow
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-[#14213D] hover:text-[#2A6F6F] transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="text-sm font-medium bg-[#2A6F6F] text-white px-4 py-2 rounded-md hover:bg-[#235c5c] transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1 mb-6 text-xs font-medium text-gray-600">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8871E]"></span>
          AI-assisted triage, human-reviewed
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-semibold text-[#14213D] tracking-tight mb-5 leading-tight">
          Support tickets, sorted<br />before your team opens them
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10">
          Customers submit a ticket. AI suggests the category, priority, and a short summary.
          Agents review, reply, and resolve — every step, in real time.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/register"
            className="bg-[#2A6F6F] text-white font-medium px-6 py-3 rounded-md hover:bg-[#235c5c] transition-colors"
          >
            Submit a ticket
          </Link>
          <Link
            to="/login"
            className="bg-white border border-gray-300 text-[#14213D] font-medium px-6 py-3 rounded-md hover:border-gray-400 transition-colors"
          >
            Log in
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-24">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-400 font-mono">TCK-402080-7894</p>
              <p className="font-medium text-[#14213D]">Double charged for order</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-600 font-medium">
              High priority
            </span>
          </div>
          <div className="bg-[#F7F7F5] rounded-lg p-4 flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8871E] mt-1.5 shrink-0"></span>
            <div>
              <p className="text-xs font-medium text-[#E8871E] mb-1">AI Suggestion</p>
              <p className="text-sm text-gray-600">
                Billing · Possible duplicate payment reported by customer — recommend reviewing recent transaction history before refunding.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-24 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <div className="w-9 h-9 rounded-md bg-[#2A6F6F]/10 flex items-center justify-center mb-3">
            <span className="text-[#2A6F6F] font-display font-semibold text-sm">01</span>
          </div>
          <h3 className="font-semibold text-[#14213D] mb-1">Customer submits</h3>
          <p className="text-sm text-gray-500">A short form — subject, description, category. Takes under a minute.</p>
        </div>
        <div>
          <div className="w-9 h-9 rounded-md bg-[#2A6F6F]/10 flex items-center justify-center mb-3">
            <span className="text-[#2A6F6F] font-display font-semibold text-sm">02</span>
          </div>
          <h3 className="font-semibold text-[#14213D] mb-1">AI triages</h3>
          <p className="text-sm text-gray-500">Category, priority, and a summary — ready for the agent to confirm or edit.</p>
        </div>
        <div>
          <div className="w-9 h-9 rounded-md bg-[#2A6F6F]/10 flex items-center justify-center mb-3">
            <span className="text-[#2A6F6F] font-display font-semibold text-sm">03</span>
          </div>
          <h3 className="font-semibold text-[#14213D] mb-1">Agent resolves</h3>
          <p className="text-sm text-gray-500">Assign, reply, and close — with the full conversation on record.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;