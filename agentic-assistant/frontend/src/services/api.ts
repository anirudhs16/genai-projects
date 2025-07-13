import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Agent {
  id: string;
  name: string;
  description: string;
  system_prompt: string;
  tools: string[];
  workflow: string;
}

export interface ChatMessage {
  message: string;
  agent_id: string;
  user_id?: string;
  context?: Record<string, any>;
}

export interface ChatResponse {
  response: string;
  agent_id: string;
  session_id?: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  agent_id: string;
  query: string;
  response: string;
  created_at: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    created_at: string;
  };
  access_token: string;
  refresh_token: string;
}

// Agent APIs
export const getAgents = async (): Promise<Agent[]> => {
  const response = await api.get('/agents/');
  return response.data;
};

export const getAgentById = async (agentId: string): Promise<Agent> => {
  const response = await api.get(`/agents/${agentId}`);
  return response.data;
};

// Chat APIs
export const sendChatMessage = async (message: ChatMessage): Promise<ChatResponse> => {
  const response = await api.post('/chat/', message);
  return response.data;
};

export const sendMultiAgentMessage = async (
  message: string,
  agentIds: string[],
  userId?: string,
  context?: Record<string, any>
): Promise<{ responses: Record<string, string>; session_ids: Record<string, string> }> => {
  const response = await api.post('/chat/multi-agent', {
    message,
    agent_ids: agentIds,
    user_id: userId,
    context,
  });
  return response.data;
};

// Session APIs
export const getUserSessions = async (userId: string, limit?: number): Promise<UserSession[]> => {
  const params = limit ? { limit } : {};
  const response = await api.get(`/sessions/user/${userId}`, { params });
  return response.data.sessions;
};

export const getUserAgentSessions = async (
  userId: string,
  agentId: string,
  limit?: number
): Promise<UserSession[]> => {
  const params = limit ? { limit } : {};
  const response = await api.get(`/sessions/user/${userId}/agent/${agentId}`, { params });
  return response.data.sessions;
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  await api.delete(`/sessions/${sessionId}`);
};

// Auth APIs
export const registerUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', { email, password });
  return response.data;
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const getCurrentUser = async (): Promise<any> => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Add auth token to requests
export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
};

export default api; 