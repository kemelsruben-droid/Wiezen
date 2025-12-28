import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles } from 'lucide-react';
import { askRuleAssistant } from '../services/geminiService';
import { THEME } from '../constants';

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
      { role: 'ai', text: "Hallo! Ik ben je digitale scheidsrechter. Vraag me gerust naar spelregels of scores."}
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    const answer = await askRuleAssistant(userText);
    
    setMessages(prev => [...prev, { role: 'ai', text: answer }]);
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-lg shadow-indigo-500/30 flex items-center justify-center text-white hover:scale-110 transition-transform z-40 group"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
        <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-900"></span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] ${THEME.card} shadow-2xl rounded-2xl flex flex-col overflow-hidden z-40 border-slate-600 border`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-4 flex justify-between items-center text-white">
        <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <h3 className="font-bold">AI Scheidsrechter</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:text-indigo-200"><X className="w-5 h-5" /></button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
        {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                    m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-slate-700 text-slate-200 rounded-bl-none'
                }`}>
                    {m.text}
                </div>
            </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-slate-700 rounded-2xl px-4 py-2 rounded-bl-none flex items-center space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
        <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Vraag een regel..."
            className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
        />
        <button 
            type="submit" 
            disabled={isLoading || !query.trim()}
            className="p-2 bg-indigo-600 rounded-lg text-white disabled:opacity-50 hover:bg-indigo-500"
        >
            <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};