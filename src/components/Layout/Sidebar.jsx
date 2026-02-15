import { Link, useLocation } from 'react-router-dom';
import { Compass, Users, MessageCircle, User, Shield, Gamepad2, TrendingUp, Clock, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/', label: 'Discover', icon: Compass },
  { to: '/friends', label: 'Friends', icon: Users },
  { to: '/chat', label: 'Chat', icon: MessageCircle },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/safety', label: 'Safety', icon: Shield },
];

const QUICK_FILTERS = [
  { icon: TrendingUp, label: 'Trending' },
  { icon: Star, label: 'Top Rated' },
  { icon: Clock, label: 'Recently Played' },
  { icon: Gamepad2, label: 'My Experiences' },
];

export default function Sidebar() {
  const location = useLocation();
  const { isApproved } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-60 fixed left-0 top-16 bottom-0 glass-strong border-r border-border-glow z-40 overflow-y-auto scrollbar-thin" aria-label="Sidebar navigation">
      <nav className="p-3 flex flex-col gap-1" role="navigation">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          const isLocked = !isApproved && (to === '/chat' || to === '/friends');

          return (
            <Link
              key={to}
              to={isLocked ? '#' : to}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold no-underline transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-magenta/20 to-violet/20 text-magenta glow-magenta'
                  : isLocked
                    ? 'text-text-muted cursor-not-allowed opacity-50'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
              }`}
              aria-current={isActive ? 'page' : undefined}
              aria-disabled={isLocked}
              tabIndex={isLocked ? -1 : 0}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
              <span>{label}</span>
              {isLocked && (
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-surface-light text-text-muted font-medium">
                  Locked
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 mt-4">
        <div className="h-px bg-gradient-to-r from-transparent via-border-glow to-transparent" />
      </div>

      <div className="p-3">
        <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider px-4 mb-2">Quick Access</p>
        {QUICK_FILTERS.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-all"
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Safety Banner */}
      <div className="mt-auto p-3">
        <div className="rounded-2xl bg-gradient-to-br from-violet/20 to-deep-purple/20 border border-violet/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-success" />
            <span className="text-xs font-bold text-success">Protected</span>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Rblx actively monitors for your safety. Report anything suspicious.
          </p>
        </div>
      </div>
    </aside>
  );
}
