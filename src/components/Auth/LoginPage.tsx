import React, { useState } from 'react';
import { User, Lock, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { POV } from '../../types';

interface LoginPageProps {
  onLogin: (pov: POV) => void;
}

const LOGO_URL =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU3PVRE_vleIyipQnw-7O8KiVVHHFbNTdCQA&s';

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      onLogin('victim');
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[440px] roblox-card p-8 md:p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        {/* Header / Logo */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={LOGO_URL}
            alt="RBLX"
            className="h-16 w-16 mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          />
          <h1 className="text-2xl font-bold tracking-tight">Login to RBLX</h1>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
            <div className="w-1 h-1 bg-red-500 rounded-full" />
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={16} className="text-gray-500" />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username/Email/Phone"
              className="w-full bg-[#111213] border border-gray-700 rounded py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-white transition-all text-white placeholder:text-gray-600"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={16} className="text-gray-500" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#111213] border border-gray-700 rounded py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-white transition-all text-white placeholder:text-gray-600"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black hover:bg-gray-200 py-3 rounded font-bold text-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <span>Log In</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 flex flex-col items-center space-y-4">
          <button className="text-xs text-gray-400 hover:text-white hover:underline transition-colors">
            Forgot Password or Username?
          </button>

          <div className="w-full h-px bg-white/5" />

          <p className="text-xs text-gray-500">Don't have an account?</p>
          <button className="w-full border border-gray-700 text-white hover:bg-white/5 py-3 rounded font-bold text-sm transition-all">
            Sign Up
          </button>
        </div>

        {/* Developer POV Selectors */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col items-center">
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-3">
            Developer Preview Mode
          </p>
          <div className="flex gap-2 w-full">
            <button
              onClick={() => onLogin('victim')}
              className="flex-1 text-[9px] bg-blue-600/10 border border-blue-600/30 text-blue-400 py-2 rounded font-black hover:bg-blue-600/20 transition-all uppercase"
            >
              Victim POV
            </button>
            <button
              onClick={() => onLogin('predator')}
              className="flex-1 text-[9px] bg-red-600/10 border border-red-600/30 text-red-500 py-2 rounded font-black hover:bg-red-600/20 transition-all uppercase"
            >
              Predator POV
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Links */}
      <div className="mt-8 flex items-center space-x-6 text-[11px] text-gray-500 font-medium">
        <a
          href="#"
          className="hover:text-white transition-colors flex items-center gap-1"
        >
          <ShieldCheck size={14} />
          Safety
        </a>
        <a href="#" className="hover:text-white transition-colors">
          Privacy
        </a>
        <a href="#" className="hover:text-white transition-colors">
          Terms
        </a>
        <a
          href="#"
          className="hover:text-white transition-colors flex items-center gap-1"
        >
          <HelpCircle size={14} />
          Support
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
