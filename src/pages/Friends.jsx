import { useState } from 'react';
import { Search, UserPlus, Shield, MessageCircle, Ban, Flag, MoreHorizontal, Clock, CheckCircle, X, UserX } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSafety } from '../context/SafetyContext';

const MOCK_FRIENDS = [
  { id: 'f1', username: 'PixelQueen22', displayName: 'Sophie', age: 15, online: true, playing: 'Adopt Me!', trusted: true, friendsSince: '3 months' },
  { id: 'f2', username: 'BloxMaster99', displayName: 'Ryan', age: 16, online: true, playing: 'Blox Fruits', trusted: true, friendsSince: '6 months' },
  { id: 'f3', username: 'StarBuilder', displayName: 'Mia', age: 14, online: false, playing: null, trusted: true, friendsSince: '1 month' },
  { id: 'f4', username: 'NinjaGamer_X', displayName: 'Jake', age: 15, online: true, playing: 'Arsenal', trusted: true, friendsSince: '2 months' },
  { id: 'f5', username: 'CozyPlayer', displayName: 'Emma', age: 13, online: false, playing: null, trusted: true, friendsSince: '5 months' },
  { id: 'f6', username: 'SpeedRunner01', displayName: 'Liam', age: 16, online: true, playing: 'Tower of Hell', trusted: false, friendsSince: '2 weeks' },
  { id: 'f7', username: 'ArtisticSoul', displayName: 'Lily', age: 14, online: false, playing: null, trusted: true, friendsSince: '4 months' },
  { id: 'f8', username: 'RocketRider', displayName: 'Noah', age: 15, online: true, playing: 'Jailbreak', trusted: true, friendsSince: '1 month' },
];

const PENDING_REQUESTS = [
  { id: 'r1', username: 'CoolKid2024', displayName: 'Ethan', age: 15, mutual: 3 },
  { id: 'r2', username: 'GamerGirl_X', displayName: 'Ava', age: 14, mutual: 1 },
];

function FriendCard({ friend, onBlock, onReport }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-hover transition-all group">
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center">
          <span className="text-white font-bold text-sm">
            {friend.displayName.charAt(0)}
          </span>
        </div>
        <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-surface-card ${
          friend.online ? 'bg-success' : 'bg-text-muted'
        }`} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-text-primary truncate">{friend.displayName}</p>
          {friend.trusted && (
            <Shield className="w-3.5 h-3.5 text-success shrink-0" title="Trusted friend" />
          )}
        </div>
        <p className="text-xs text-text-muted truncate">
          @{friend.username} · {friend.online ? (
            <span className="text-success">{friend.playing ? `Playing ${friend.playing}` : 'Online'}</span>
          ) : (
            'Offline'
          )}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 rounded-xl hover:bg-surface-light transition-colors" title="Message" aria-label={`Message ${friend.displayName}`}>
          <MessageCircle className="w-4 h-4 text-text-secondary" />
        </button>
        <div className="relative">
          <button
            className="p-2 rounded-xl hover:bg-surface-light transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="More options"
          >
            <MoreHorizontal className="w-4 h-4 text-text-secondary" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 glass-strong rounded-xl p-1.5 animate-slide-up z-10 shadow-xl" role="menu">
              <button
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-text-secondary hover:bg-surface-hover transition-colors"
                onClick={() => { onBlock(friend.id); setMenuOpen(false); }}
                role="menuitem"
              >
                <Ban className="w-3.5 h-3.5" /> Block User
              </button>
              <button
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-danger hover:bg-danger/10 transition-colors"
                onClick={() => { onReport(friend.id); setMenuOpen(false); }}
                role="menuitem"
              >
                <Flag className="w-3.5 h-3.5" /> Report User
              </button>
              <button
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-text-muted hover:bg-surface-hover transition-colors"
                onClick={() => setMenuOpen(false)}
                role="menuitem"
              >
                <UserX className="w-3.5 h-3.5" /> Unfriend
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Friends() {
  const { isApproved } = useAuth();
  const { blockUser, reportUser } = useSafety();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = MOCK_FRIENDS.filter(f => {
    const matchesSearch = f.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'online' && f.online) || (filter === 'offline' && !f.online);
    return matchesSearch && matchesFilter;
  });

  if (!isApproved) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-3xl bg-warning/10 border border-warning/20 flex items-center justify-center mb-6 animate-float">
          <Shield className="w-10 h-10 text-warning" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Friends are Locked</h1>
        <p className="text-text-secondary text-sm max-w-md mb-6">
          A parent or guardian needs to approve your account before you can add friends.
          This keeps you safe from strangers.
        </p>
        <a href="/safety-gate" className="px-6 py-3 rounded-xl gradient-brand text-white font-semibold text-sm hover:opacity-90 transition-all glow-magenta no-underline">
          Set Up Safety
        </a>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold gradient-brand-text">Friends</h1>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-brand text-white text-sm font-semibold hover:opacity-90 transition-all glow-magenta">
          <UserPlus className="w-4 h-4" /> Add Friend
        </button>
      </div>

      {/* Pending Requests */}
      {PENDING_REQUESTS.length > 0 && (
        <div className="glass-strong rounded-2xl p-5 mb-6">
          <h2 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-warning" />
            Friend Requests
            <span className="px-2 py-0.5 rounded-full bg-magenta/20 text-magenta text-[11px] font-bold">{PENDING_REQUESTS.length}</span>
          </h2>
          <div className="space-y-2">
            {PENDING_REQUESTS.map(req => (
              <div key={req.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-light">
                <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-xs">{req.displayName.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary">{req.displayName}</p>
                  <p className="text-xs text-text-muted">@{req.username} · {req.mutual} mutual friends</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-xl bg-success/20 text-success hover:bg-success/30 transition-colors" aria-label="Accept">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-xl bg-surface-hover text-text-muted hover:bg-danger/20 hover:text-danger transition-colors" aria-label="Decline">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="search"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-card border border-border-glow text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-violet transition-all"
          />
        </div>
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'All', count: MOCK_FRIENDS.length },
            { id: 'online', label: 'Online', count: MOCK_FRIENDS.filter(f => f.online).length },
            { id: 'offline', label: 'Offline', count: MOCK_FRIENDS.filter(f => !f.online).length },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f.id
                  ? 'gradient-brand text-white'
                  : 'bg-surface-card border border-border-glow text-text-secondary hover:bg-surface-hover'
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      {/* Friends List */}
      <div className="glass-strong rounded-2xl divide-y divide-border-glow">
        {filtered.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-text-muted text-sm">No friends found</p>
          </div>
        ) : (
          filtered.map(friend => (
            <FriendCard
              key={friend.id}
              friend={friend}
              onBlock={(id) => blockUser('me', id)}
              onReport={(id) => reportUser('me', id, 'suspicious', null)}
            />
          ))
        )}
      </div>

      {/* Safety Reminder */}
      <div className="mt-6 rounded-2xl bg-surface-card border border-border-glow p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-success shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-text-primary mb-1">Friends-only messaging is ON</p>
          <p className="text-xs text-text-muted">Only your friends can send you messages. Strangers cannot contact you directly.</p>
        </div>
      </div>
    </div>
  );
}
