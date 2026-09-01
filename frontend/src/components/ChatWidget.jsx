import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { sendChatMessage } from '../api/chat.js';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm here to help you use SupportFlow. Ask me anything." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const res = await sendChatMessage(userMessage);
      setMessages((prev) => [...prev, { role: 'assistant', text: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: "Sorry, I couldn't respond right now. Please try again." },
      ]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 w-80 sm:w-96 rounded-2xl shadow-2xl flex flex-col z-50"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            height: '480px',
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-3.5 rounded-t-2xl"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--highlight))' }}
          >
            <div className="flex items-center gap-2">
              <Bot size={16} className="text-white" />
              <span className="text-sm font-semibold text-white">AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm"
                  style={
                    m.role === 'user'
                      ? { backgroundColor: 'var(--accent)', color: 'white', borderBottomRightRadius: '4px' }
                      : {
                          backgroundColor: 'var(--bg-surface-hover)',
                          color: 'var(--text-primary)',
                          borderBottomLeftRadius: '4px',
                        }
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div
                  className="px-3.5 py-2.5 rounded-2xl text-sm flex gap-1"
                  style={{ backgroundColor: 'var(--bg-surface-hover)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: 'var(--text-muted)' }} />
                  <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: 'var(--text-muted)', animationDelay: '0.1s' }} />
                  <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: 'var(--text-muted)', animationDelay: '0.2s' }} />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={handleSend}
            className="flex gap-2 p-3"
            style={{ borderTop: '1px solid var(--border-color)' }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 text-sm px-3 py-2 rounded-lg focus:outline-none"
              style={{
                backgroundColor: 'var(--bg-surface-hover)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
              }}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      {!isOpen && showTooltip && (
        <div
          className="fixed bottom-24 right-6 flex items-center gap-2 rounded-xl shadow-lg pl-3 pr-2 py-2.5 z-50"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--highlight))' }}
          >
            <Bot size={14} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>AI Assistant</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Need help? Chat with me!</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="ml-1"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white z-50 transition-transform hover:scale-105"
        style={{ background: 'linear-gradient(135deg, var(--accent), var(--highlight))' }}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </>
  );
};

export default ChatWidget;