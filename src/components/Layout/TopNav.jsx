import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, Shield, Menu, X, LogOut, User, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSafety } from '../../context/SafetyContext';

export default function TopNav() {
  const { user, logout } = useAuth();
  const { alerts } = useSafety();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const activeAlerts = alerts.length;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong h-16" role="navigation" aria-label="Main navigation">
      <div className="flex items-center justify-between h-full px-4 lg:px-6 max-w-[1800px] mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 no-underline" aria-label="Rblx Home">
          <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center glow-magenta">
            <span className="text-white font-black text-sm tracking-tight">R</span>
          </div>
          <span className="text-xl font-extrabold gradient-brand-text hidden sm:block">Rblx</span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="search"
              placeholder="Search experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-light border border-border-glow text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-violet transition-all"
              aria-label="Search experiences"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Safety Shield */}
          <Link
            to="/safety"
            className="relative p-2.5 rounded-xl hover:bg-surface-hover transition-colors no-underline"
            aria-label={`Safety dashboard${activeAlerts > 0 ? `, ${activeAlerts} alerts` : ''}`}
          >
            <Shield className="w-5 h-5 text-text-secondary" />
            {activeAlerts > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center animate-pulse-glow">
                {activeAlerts}
              </span>
            )}
          </Link>

          {/* Chat */}
          <Link to="/chat" className="p-2.5 rounded-xl hover:bg-surface-hover transition-colors no-underline" aria-label="Messages">
            <MessageCircle className="w-5 h-5 text-text-secondary" />
          </Link>

          {/* Notifications */}
          <button className="p-2.5 rounded-xl hover:bg-surface-hover transition-colors" aria-label="Notifications">
            <Bell className="w-5 h-5 text-text-secondary" />
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-hover transition-colors"
              aria-expanded={profileOpen}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <span className="text-sm font-medium text-text-primary hidden lg:block">
                {user?.displayName || 'User'}
              </span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 glass-strong rounded-2xl p-2 animate-slide-up shadow-xl" role="menu">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-hover transition-colors text-text-primary no-underline text-sm"
                  role="menuitem"
                  onClick={() => setProfileOpen(false)}
                >
                  <User className="w-4 h-4 text-text-secondary" />
                  My Profile
                </Link>
                <Link
                  to="/safety"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-hover transition-colors text-text-primary no-underline text-sm"
                  role="menuitem"
                  onClick={() => setProfileOpen(false)}
                >
                  <Shield className="w-4 h-4 text-success" />
                  Safety Settings
                </Link>
                <hr className="border-border-glow my-1" />
                <button
                  onClick={() => { logout(); setProfileOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-hover transition-colors text-danger text-sm"
                  role="menuitem"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="p-2.5 rounded-xl hover:bg-surface-hover transition-colors md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-text-secondary" /> : <Menu className="w-5 h-5 text-text-secondary" />}
          </button>
        </div>
      </div>

      {/* Mobile Search + Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-strong border-t border-border-glow p-4 animate-slide-up">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="search"
              placeholder="Search experiences..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-light border border-border-glow text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-violet"
              aria-label="Search experiences"
            />
          </div>
          <div className="flex flex-col gap-1">
            {[
              { to: '/', label: 'Discover', icon: '🎮' },
              { to: '/friends', label: 'Friends', icon: '👥' },
              { to: '/chat', label: 'Chat', icon: '💬' },
              { to: '/profile', label: 'Profile', icon: '👤' },
              { to: '/safety', label: 'Safety', icon: '🛡️' },
            ].map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium no-underline transition-colors ${
                  location.pathname === item.to ? 'bg-violet/20 text-magenta' : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
