import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Pin, Copy, RotateCcw } from 'lucide-react';
import { ChatMessage, mockAIResponses, suggestedQuestions } from './mockData';

interface Props {
  selectedText: string;
}

const AssistantTab: React.FC<Props> = ({ selectedText }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getResponse = (question: string) => {
    const lower = question.toLowerCase();
    if (lower.includes('payment') || lower.includes('fee') || lower.includes('invoice')) return mockAIResponses['payment terms'];
    if (lower.includes('breach') || lower.includes('violat')) return mockAIResponses['breach'];
    if (lower.includes('terminat') || lower.includes('cancel') || lower.includes('end')) return mockAIResponses['termination'];
    return mockAIResponses['default'];
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date(), selectedText: selectedText || undefined };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const resp = getResponse(text);
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: resp.answer, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const lastAiMsg = [...messages].reverse().find(m => m.role === 'assistant');
  const followUps = lastAiMsg ? getResponse(messages.find(m => m.role === 'user' && messages.indexOf(m) < messages.indexOf(lastAiMsg))?.content || '').followUps : [];

  return (
    <div className="flex flex-col h-full">
      {/* Selected text context */}
      {selectedText && (
        <div className="px-3 py-2 border-b border-border bg-accent/30">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary">From document</span>
          </div>
          <p className="text-[11px] text-muted-foreground line-clamp-2 italic">"{selectedText}"</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Sparkles className="mx-auto mb-3 text-primary" size={28} />
            <p className="text-sm font-medium mb-1">Avivo Contract Assistant</p>
            <p className="text-[11px] text-muted-foreground mb-4">Ask anything about your contract</p>
            <div className="space-y-1.5">
              {suggestedQuestions.slice(0, 4).map((q, i) => (
                <button key={i} onClick={() => sendMessage(q)} className="w-full text-left text-[11px] px-3 py-2 rounded-md border border-border hover:bg-accent transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] rounded-lg px-3 py-2 text-[11px] leading-relaxed ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              {msg.selectedText && (
                <div className="text-[10px] opacity-70 italic mb-1 border-b border-current/20 pb-1">Re: "{msg.selectedText.slice(0, 60)}..."</div>
              )}
              <div className="whitespace-pre-wrap">{msg.content.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}</div>
              {msg.role === 'assistant' && (
                <div className="flex gap-1 mt-2 pt-1 border-t border-border/50">
                  <button className="p-1 rounded hover:bg-background/50 transition-colors" title="Copy"><Copy size={12} /></button>
                  <button className="p-1 rounded hover:bg-background/50 transition-colors" title="Pin"><Pin size={12} /></button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-3 py-2 text-[11px]">
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-muted-foreground">Analyzing...</span>
              </div>
            </div>
          </div>
        )}

        {/* Follow-up suggestions */}
        {followUps.length > 0 && !isTyping && messages.length > 0 && (
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground font-medium">Suggested follow-ups:</p>
            {followUps.map((q, i) => (
              <button key={i} onClick={() => sendMessage(q)} className="w-full text-left text-[11px] px-2.5 py-1.5 rounded border border-border hover:bg-accent transition-colors">
                {q}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-2">
        <div className="flex items-end gap-1.5">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about this contract..."
            rows={1}
            className="flex-1 resize-none text-[11px] px-2.5 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            style={{ maxHeight: '80px' }}
          />
          <button onClick={() => sendMessage(input)} disabled={!input.trim() || isTyping} className="p-2 rounded-md bg-primary text-primary-foreground disabled:opacity-50 hover:bg-primary/90 transition-colors">
            <Send size={14} />
          </button>
        </div>
        {messages.length > 0 && (
          <button onClick={() => setMessages([])} className="flex items-center gap-1 mt-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
            <RotateCcw size={10} /> Clear conversation
          </button>
        )}
      </div>
    </div>
  );
};

export default AssistantTab;
