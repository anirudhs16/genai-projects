import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';

const LoginPage: React.FC = () => {
  const { login, loading, authStatus, authError, setAuthError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setSuccess(null);
    if (!email || !password) {
      setAuthError('Email and password are required.');
      return;
    }
    const loginResult = await login(email, password);
    if (!loginResult?.error) {
      setSuccess('Login successful! Redirecting...');
      setAuthError(null);
      // The App will redirect automatically on authStatus change
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm animate-fade-in">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-900">Login to Agentic AI</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
          />
          {authError && (
            <div className="text-red-700 text-sm text-center bg-red-100 rounded-lg p-3 border border-red-300 animate-fade-in font-semibold shadow-sm">
              {authError}
            </div>
          )}
          {success && (
            <div className="text-green-700 text-sm text-center bg-green-100 rounded-lg p-3 border border-green-300 animate-fade-in font-semibold shadow-sm">
              {success}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? <span className="animate-spin">⏳</span> : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 