import { useState } from 'react';
import Spline from '@splinetool/react-spline';
import { X, Send } from 'lucide-react';

export default function ChatbotRobot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{text: string, isUser: boolean}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = input;
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInput('');
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages
        })
      });

      if (!response.ok) {
        throw new Error('Chat failed');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { 
        text: data.response, 
        isUser: false 
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        text: "I'm having trouble connecting right now. Please try again in a moment!", 
        isUser: false 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Spline Robot Button */}
      {!isOpen && (
        <div 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-24 h-24 cursor-pointer hover:scale-110 transition-transform"
        >
          <Spline scene="https://prod.spline.design/rU2-Ks0SC0T5od9B/scene.splinecode" />
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-background border border-border rounded-lg shadow-2xl flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border bg-secondary">
            <h3 className="font-semibold text-sm">Website Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="hover:bg-background rounded p-1 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm mt-8">
                Hi! Ask me anything about the website features and navigation.
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  msg.isUser 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-foreground'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg text-sm bg-secondary text-foreground">
                  <span className="dot-bounce"><span /><span /><span /></span>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
                placeholder="Ask about features..."
                disabled={loading}
                className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:border-primary disabled:opacity-50"
              />
              <button 
                onClick={handleSend} 
                disabled={loading || !input.trim()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
