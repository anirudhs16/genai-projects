import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import { getAgents, sendChatMessage, Agent } from './services/api';
import { Bot, MessageSquare, Settings, Users, Sparkles, Zap, LogOut } from 'lucide-react';
import './styles/App.css';
import LoginPage from './pages/LoginPage';
import { useAuth } from './components/AuthContext';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  agentId?: string;
}

function App() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout, loading: authLoading, authStatus, authError } = useAuth();

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const agentsData = await getAgents();
      setAgents(agentsData);
      if (agentsData.length > 0) {
        setSelectedAgent(agentsData[0]);
      }
    } catch (err) {
      setError('Failed to load agents');
      console.error('Error loading agents:', err);
    }
  };

  const handleSendMessage = async (message: string, agentId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Add user message to chat
      const userMessage: Message = {
        id: Date.now().toString(),
        content: message,
        sender: 'user',
        timestamp: new Date(),
        agentId,
      };
      setMessages(prev => [...prev, userMessage]);

      // Send message to API, include user_id
      const response = await sendChatMessage({
        message,
        agent_id: agentId,
        user_id: user?.id,
      });

      // Add agent response to chat
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        sender: 'agent',
        timestamp: new Date(),
        agentId: response.agent_id,
      };
      setMessages(prev => [...prev, agentMessage]);

    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  if ((authStatus === 'loading' || authStatus === 'idle') && !user && !authError) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-lg animate-pulse">Loading...</div>
      </div>
    );
  }
  if (authStatus === 'unauthenticated' || !user) {
    return <LoginPage />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Connection Error</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-80 min-w-[260px]' : 'w-20'} h-full bg-white/10 backdrop-blur-lg border-r border-white/20 transition-all duration-300 flex flex-col shadow-lg z-10`}>
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-white">Agentic AI</h1>
                <p className="text-sm text-gray-300">Intelligent Assistants</p>
              </div>
            )}
          </div>
        </div>

        {/* Agents List */}
        <div className="flex-1 overflow-y-auto p-4">
          {sidebarOpen && (
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wider">Available Agents</h3>
            </div>
          )}
          <div className="space-y-3">
            {agents.map((agent) => {
              const isActive = selectedAgent?.id === agent.id;
              return (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`w-full p-3 rounded-xl transition-all duration-200 group text-left flex flex-col items-start shadow-sm border ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-700 to-purple-800 border-blue-400/80 ring-2 ring-blue-400/60'
                      : 'bg-white/10 hover:bg-white/20 border-transparent'
                  }`}
                  style={{ minHeight: '64px' }}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg'
                        : 'bg-white/20 group-hover:bg-white/30'
                    }`}>
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    {sidebarOpen && (
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isActive ? 'text-white font-bold' : 'text-white'}`}>{agent.name}</p>
                      </div>
                    )}
                  </div>
                  {sidebarOpen && (
                    <p className={`text-xs mt-1 whitespace-normal break-words leading-snug w-full ${isActive ? 'text-white font-semibold' : 'text-gray-200'}`} style={{ wordBreak: 'break-word' }}>
                      {agent.description}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/20 flex flex-col gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
          >
            <div className="flex items-center justify-center">
              <Settings className="w-5 h-5 text-gray-300" />
              {sidebarOpen && <span className="ml-2 text-sm text-gray-300">Settings</span>}
            </div>
          </button>
          <button
            onClick={logout}
            className="w-full p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center gap-2 mt-2 hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="ml-2 text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 min-w-0">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
              >
                <Users className="w-5 h-5 text-white" />
              </button>
              {selectedAgent && (
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-white truncate">{selectedAgent.name}</h2>
                  <p className="text-sm text-gray-300 truncate">{selectedAgent.description}</p>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearChat}
                className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200"
              >
                Clear Chat
              </button>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">Connected</span>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden min-h-0">
          <ChatInterface
            agents={agents}
            onSendMessage={handleSendMessage}
            messages={messages}
            isLoading={isLoading}
            selectedAgent={selectedAgent}
          />
        </div>
      </main>
    </div>
  );
}

export default App; 