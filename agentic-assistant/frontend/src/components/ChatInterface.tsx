import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { Agent } from '../services/api';

export interface ChatInterfaceProps {
  agents: Agent[];
  onSendMessage: (message: string, agentId: string) => Promise<void>;
  messages: Array<{
    id: string;
    content: string;
    sender: 'user' | 'agent';
    timestamp: Date;
    agentId?: string;
  }>;
  isLoading: boolean;
  selectedAgent?: Agent | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  agents,
  onSendMessage,
  messages,
  isLoading,
  selectedAgent,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isLoading) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedAgent) return;

    const message = inputMessage.trim();
    setInputMessage('');
    setIsTyping(true);

    try {
      await onSendMessage(message, selectedAgent.id);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!selectedAgent) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Welcome to Agentic AI</h3>
          <p className="text-gray-300 mb-4">Select an agent from the sidebar to start chatting</p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Start a conversation with {selectedAgent.name}</h3>
            <p className="text-gray-300">Ask me anything about {selectedAgent.description.toLowerCase()}</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-white/10 backdrop-blur-lg border border-white/20 text-white'
                } rounded-2xl px-4 py-3 shadow-lg`}
              >
                <div className="flex items-start space-x-3">
                  {message.sender === 'agent' && (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium opacity-70">
                        {message.sender === 'user' ? 'You' : selectedAgent.name}
                      </span>
                      <span className="text-xs opacity-50">{formatTime(message.timestamp)}</span>
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-4 py-3 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-white/20">
        <form onSubmit={handleSubmit} className="flex items-end space-x-4">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${selectedAgent.name}...`}
              className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
              disabled={isLoading}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {inputMessage.length}/1000
            </div>
          </div>
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </button>
        </form>
        
        {/* Agent Info */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Connected to {selectedAgent.name}</span>
          </div>
          <span>Press Enter to send, Shift+Enter for new line</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 