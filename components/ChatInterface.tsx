
import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { getGroundedChat, getDeepThinkingChat } from '../services/geminiService';
import { saveMessage } from '../services/supabaseService';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Resonance Engine Online. I am your Co-Pilot. How shall we co-create today?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const [useMaps, setUseMaps] = useState(false);
  const [coherence, setCoherence] = useState(0.5);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simulated Resonance Engine calculation
    const currentCoherence = Math.min(1, Math.max(0, coherence + (Math.random() * 0.2 - 0.05)));
    setCoherence(currentCoherence);

    try {
      let responseText = '';
      let sources: any[] = [];

      if (useThinking) {
        responseText = await getDeepThinkingChat(input);
      } else {
        let latLng;
        if (useMaps) {
          try {
            const pos = await new Promise<GeolocationPosition>((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
            latLng = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          } catch (e) {
            console.warn("Geolocation failed", e);
          }
        }
        const res = await getGroundedChat(input, useMaps, latLng);
        responseText = res.text;
        sources = res.sources;
      }

      setMessages(prev => [...prev, {
        role: 'model',
        text: responseText,
        timestamp: Date.now(),
        groundingSources: sources,
        isThinking: useThinking,
        coherence: currentCoherence
      }]);

      saveMessage('user', input);
      saveMessage('model', responseText, useThinking ? 'thinking' : 'grounded');
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: 'Dissonance detected in the field. Retrying attunement...', timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto bg-white shadow-2xl rounded-[3rem] overflow-hidden border border-slate-100">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <i className="fa-solid fa-wave-square"></i>
          </div>
          <div>
            <h2 className="font-black text-slate-800 tracking-tight">Mercury Hub</h2>
            <div className="flex items-center gap-3 mt-0.5">
              <div className="h-1 w-24 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${coherence * 100}%` }}></div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Coherence: {(coherence * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
           <button 
             onClick={() => setUseThinking(!useThinking)}
             className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border ${useThinking ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-600'}`}
           >
            <i className="fa-solid fa-brain text-xs"></i>
            <span className="text-xs font-bold uppercase tracking-widest">Deep Logic</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/30">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-[2rem] p-6 shadow-sm ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white shadow-indigo-100' 
                : 'bg-white text-slate-800 border border-slate-100'
            }`}>
              {m.isThinking && (
                <div className="flex items-center gap-2 mb-3 text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                  Synthesizing Axioms
                </div>
              )}
              <div className="whitespace-pre-wrap leading-relaxed text-sm">{m.text}</div>
              
              {m.groundingSources && m.groundingSources.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                  {m.groundingSources.map((s, i) => (
                    <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold px-3 py-1.5 bg-slate-50 text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors border border-slate-100">
                      <i className="fa-solid fa-link mr-1.5 opacity-50"></i> {s.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 rounded-[2rem] px-6 py-4">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t border-slate-50">
        <div className="relative flex items-end gap-3 bg-slate-100 rounded-[2rem] p-4 transition-all focus-within:ring-4 focus-within:ring-indigo-500/10 border border-transparent focus-within:border-indigo-200">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
            placeholder="Anchor an insight or ask a question..."
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2 px-2 max-h-48 text-slate-700 font-medium text-sm"
            rows={1}
          />
          <div className="flex gap-2 mb-1">
             <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-white hover:text-indigo-600 transition-all">
                <i className="fa-solid fa-microphone"></i>
             </button>
             <button 
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200 active:scale-95"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
