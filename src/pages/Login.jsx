import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, Sparkles, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        if (!email || !username || !age || !password) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }
        const ageNum = parseInt(age);
        if (ageNum < 13 || ageNum > 17) {
          setError('Rblx is designed for teens aged 13-17');
          setLoading(false);
          return;
        }
        const result = signup(email, username, ageNum);
        if (result.success) navigate('/safety-gate');
      } else {
        if (!email || !password) {
          setError('Please enter your email and password');
          setLoading(false);
          return;
        }
        const result = login(email, password);
        if (result.success) navigate('/');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-surface">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-magenta/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-deep-purple/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-brand glow-magenta mb-4">
            <span className="text-white font-black text-2xl">R</span>
          </div>
          <h1 className="text-3xl font-extrabold gradient-brand-text mb-2">Rblx</h1>
          <p className="text-text-secondary text-sm">Safe social gaming for teens</p>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-3xl p-8 glow-violet">
          {/* Safety Badge */}
          <div className="flex items-center justify-center gap-2 mb-6 px-4 py-2 rounded-full bg-success/10 border border-success/20 mx-auto w-fit">
            <Shield className="w-4 h-4 text-success" />
            <span className="text-xs font-semibold text-success">Safety-First Platform</span>
          </div>

          <h2 className="text-xl font-bold text-center mb-6">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h2>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm text-center animate-fade-in" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-1.5">Username</label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="w-full px-4 py-3 rounded-xl bg-surface-light border border-border-glow text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-violet transition-all"
                    autoComplete="username"
                  />
                </div>
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-text-secondary mb-1.5">Age</label>
                  <input
                    id="age"
                    type="number"
                    min="13"
                    max="17"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="13-17"
                    className="w-full px-4 py-3 rounded-xl bg-surface-light border border-border-glow text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-violet transition-all"
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-surface-light border border-border-glow text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-violet transition-all"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-surface-light border border-border-glow text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-violet transition-all"
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-secondary transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl gradient-brand text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed glow-magenta"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isSignup ? 'Creating...' : 'Signing in...'}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {isSignup ? <Sparkles className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  {isSignup ? 'Create Account' : 'Sign In'}
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsSignup(!isSignup); setError(''); }}
              className="text-sm text-text-secondary hover:text-magenta transition-colors"
            >
              {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>

          {/* Demo hint */}
          <div className="mt-4 px-4 py-3 rounded-xl bg-surface-light/50 border border-border-glow">
            <p className="text-[11px] text-text-muted text-center leading-relaxed">
              <strong className="text-text-secondary">Demo:</strong> Use <strong className="text-magenta">demo@rblx.com</strong> (approved) or <strong className="text-magenta">locked@rblx.com</strong> (locked) with any password
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-text-muted mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
          <br />
          Rblx is designed for teens aged 13-17.
        </p>
      </div>
    </div>
  );
}
