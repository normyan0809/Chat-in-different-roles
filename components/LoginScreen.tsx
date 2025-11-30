import React, { useState } from 'react';
import { MessageCircle, UserPlus, LogIn, Sparkles } from 'lucide-react';
import { authService } from '../services/authService';
import { UserProfile } from '../types';

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      if (!username || !password || !displayName) {
        setError('All fields are required');
        return;
      }
      const result = authService.register(username, password, displayName);
      if (typeof result === 'string') {
        setError(result);
      } else {
        onLogin(result);
      }
    } else {
      if (!username || !password) {
        setError('Please enter username and password');
        return;
      }
      const user = authService.login(username, password);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid username or password');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-md shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-slate-800 p-4 rounded-2xl mb-4 shadow-lg shadow-emerald-900/20 border border-slate-700">
             <MessageCircle size={48} className="text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            PolyChat
          </h1>
          <p className="text-slate-400 mt-2 text-center text-sm">
            Multiple personas. One conversation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/50 rounded-xl text-rose-400 text-xs text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 ml-1 uppercase tracking-wider">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Enter your username"
            />
          </div>

          {isRegistering && (
             <div className="animate-in fade-in slide-in-from-top-2">
                <label className="block text-xs font-medium text-slate-400 mb-1 ml-1 uppercase tracking-wider">Display Name</label>
                <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="What should we call you?"
                />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 ml-1 uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-900/20 hover:scale-[1.02] active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
          >
            {isRegistering ? (
                <>
                    <Sparkles size={18} /> Create Account
                </>
            ) : (
                <>
                    <LogIn size={18} /> Sign In
                </>
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2">
            <span className="text-slate-500 text-sm">
                {isRegistering ? "Already have an account?" : "Don't have an account?"}
            </span>
            <button 
                onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError('');
                }}
                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
            >
                {isRegistering ? "Sign In" : "Register"}
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
