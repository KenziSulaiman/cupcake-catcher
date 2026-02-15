import { Shield, Users, Calendar, Star, Gamepad2, Clock, Award, Settings, Edit3, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MOCK_BADGES = [
  { id: 1, name: 'Newcomer', icon: '🌟', desc: 'Joined Rblx' },
  { id: 2, name: 'Safety Star', icon: '🛡️', desc: 'Completed safety setup' },
  { id: 3, name: 'Social Butterfly', icon: '🦋', desc: '10+ friends' },
  { id: 4, name: 'Explorer', icon: '🧭', desc: 'Played 25+ experiences' },
];

const RECENT_EXPERIENCES = [
  { id: 1, name: 'Adopt Me!', icon: '🐾', time: '2h ago', gradient: 'from-pink-500 to-purple-600' },
  { id: 2, name: 'Blox Fruits', icon: '🍎', time: '5h ago', gradient: 'from-blue-500 to-cyan-500' },
  { id: 3, name: 'Brookhaven', icon: '🏘️', time: 'Yesterday', gradient: 'from-green-500 to-emerald-600' },
  { id: 4, name: 'Tower of Hell', icon: '🏗️', time: '2 days ago', gradient: 'from-orange-500 to-red-600' },
];

const FAVORITES = [
  { id: 1, name: 'Royale High', icon: '👑', players: '95K', gradient: 'from-pink-400 to-fuchsia-600' },
  { id: 2, name: 'Adopt Me!', icon: '🐾', players: '142K', gradient: 'from-pink-500 to-purple-600' },
  { id: 3, name: 'Arsenal', icon: '🔫', players: '45K', gradient: 'from-slate-600 to-zinc-800' },
];

export default function Profile() {
  const { user, isApproved } = useAuth();

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="glass-strong rounded-3xl overflow-hidden mb-6">
        {/* Banner */}
        <div className="h-32 lg:h-40 gradient-brand relative">
          <div className="absolute inset-0 bg-black/10" />
          <button className="absolute top-3 right-3 p-2 rounded-xl bg-black/30 text-white/80 hover:text-white transition-colors" aria-label="Edit banner">
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar + Info */}
        <div className="px-6 pb-6 -mt-12 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl gradient-brand glow-magenta flex items-center justify-center border-4 border-surface-card">
                <span className="text-white text-3xl font-black">
                  {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-success border-3 border-surface-card flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-extrabold text-text-primary">{user?.displayName || 'Player'}</h1>
                {isApproved && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 border border-success/20">
                    <Shield className="w-3 h-3 text-success" />
                    <span className="text-[10px] font-bold text-success">Verified</span>
                  </span>
                )}
              </div>
              <p className="text-sm text-text-secondary mb-2">@{user?.username || 'username'}</p>
              <div className="flex items-center gap-4 text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {user?.friendsCount || 0} Friends
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {user?.joinDate || 'Recently'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-xl gradient-brand text-white text-sm font-semibold hover:opacity-90 transition-all">
                <span className="flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                </span>
              </button>
              <button className="p-2 rounded-xl bg-surface-light border border-border-glow text-text-secondary hover:bg-surface-hover transition-colors" aria-label="Settings">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Safety Status */}
          <div className="glass-strong rounded-2xl p-5">
            <h2 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-success" /> Account Safety
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-surface-light p-3">
                <p className="text-[11px] text-text-muted mb-1">Account Status</p>
                <p className={`text-sm font-bold ${isApproved ? 'text-success' : 'text-warning'}`}>
                  {isApproved ? 'Parent Approved' : 'Locked'}
                </p>
              </div>
              <div className="rounded-xl bg-surface-light p-3">
                <p className="text-[11px] text-text-muted mb-1">Messaging</p>
                <p className="text-sm font-bold text-sky-accent">Friends Only</p>
              </div>
              <div className="rounded-xl bg-surface-light p-3">
                <p className="text-[11px] text-text-muted mb-1">Link Sharing</p>
                <p className="text-sm font-bold text-danger">Disabled</p>
              </div>
              <div className="rounded-xl bg-surface-light p-3">
                <p className="text-[11px] text-text-muted mb-1">Trust Level</p>
                <p className="text-sm font-bold text-violet">Standard</p>
              </div>
            </div>
          </div>

          {/* Recently Played */}
          <div className="glass-strong rounded-2xl p-5">
            <h2 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-magenta" /> Recently Played
            </h2>
            <div className="space-y-2">
              {RECENT_EXPERIENCES.map(exp => (
                <div key={exp.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-hover transition-colors cursor-pointer group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${exp.gradient} flex items-center justify-center shrink-0`}>
                    <span className="text-xl">{exp.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">{exp.name}</p>
                    <p className="text-xs text-text-muted">{exp.time}</p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-lg gradient-brand text-white text-xs font-semibold transition-opacity">
                    Play
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Badges */}
          <div className="glass-strong rounded-2xl p-5">
            <h2 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-warning" /> Badges
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {MOCK_BADGES.map(badge => (
                <div key={badge.id} className="rounded-xl bg-surface-light p-3 text-center hover:bg-surface-hover transition-colors cursor-pointer group">
                  <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">{badge.icon}</span>
                  <p className="text-xs font-semibold text-text-primary">{badge.name}</p>
                  <p className="text-[10px] text-text-muted">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Favorites */}
          <div className="glass-strong rounded-2xl p-5">
            <h2 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4 text-magenta" /> Favorites
            </h2>
            <div className="space-y-2">
              {FAVORITES.map(fav => (
                <div key={fav.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-hover transition-colors cursor-pointer">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${fav.gradient} flex items-center justify-center shrink-0`}>
                    <span className="text-lg">{fav.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">{fav.name}</p>
                    <p className="text-[11px] text-text-muted">{fav.players} playing</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="glass-strong rounded-2xl p-5">
            <h2 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-violet" /> Stats
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Experiences Played', value: '47' },
                { label: 'Hours Played', value: '128h' },
                { label: 'Friends Made', value: '24' },
                { label: 'Reports Filed', value: '0' },
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">{stat.label}</span>
                  <span className="text-sm font-bold text-text-primary">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
