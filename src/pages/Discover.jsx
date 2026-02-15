import { useState } from 'react';
import { TrendingUp, Star, Clock, Gamepad2, Shield, Users, MessageCircle, ChevronRight, Play, Heart } from 'lucide-react';

const GENRES = [
  { id: 'all', label: 'All', emoji: '🎮' },
  { id: 'adventure', label: 'Adventure', emoji: '⚔️' },
  { id: 'roleplay', label: 'Roleplay', emoji: '🎭' },
  { id: 'obby', label: 'Obby', emoji: '🏃' },
  { id: 'simulator', label: 'Simulator', emoji: '🔧' },
  { id: 'social', label: 'Social', emoji: '💬' },
  { id: 'horror', label: 'Horror', emoji: '👻' },
  { id: 'tycoon', label: 'Tycoon', emoji: '💰' },
  { id: 'fighting', label: 'Fighting', emoji: '🥊' },
];

const EXPERIENCES = [
  {
    id: 1, title: 'Adopt Me!', genre: 'roleplay', subgenre: 'Pet Sim',
    players: '142K', rating: 4.8, thumbnail: null,
    tags: ['Family Friendly', 'Pets', 'Trading'],
    safety: { chat: true, voice: false, maturity: 'Everyone', links: false, images: false },
    gradient: 'from-pink-500 to-purple-600',
    icon: '🐾',
  },
  {
    id: 2, title: 'Tower of Hell', genre: 'obby', subgenre: 'Parkour',
    players: '89K', rating: 4.5, thumbnail: null,
    tags: ['Competitive', 'Parkour', 'Challenge'],
    safety: { chat: true, voice: false, maturity: 'Everyone', links: false, images: false },
    gradient: 'from-orange-500 to-red-600',
    icon: '🏗️',
  },
  {
    id: 3, title: 'Blox Fruits', genre: 'adventure', subgenre: 'RPG',
    players: '234K', rating: 4.7, thumbnail: null,
    tags: ['RPG', 'Combat', 'Exploration'],
    safety: { chat: true, voice: false, maturity: 'Everyone 10+', links: false, images: false },
    gradient: 'from-blue-500 to-cyan-500',
    icon: '🍎',
  },
  {
    id: 4, title: 'Brookhaven', genre: 'roleplay', subgenre: 'Life Sim',
    players: '178K', rating: 4.6, thumbnail: null,
    tags: ['Social', 'Roleplay', 'Vehicles'],
    safety: { chat: true, voice: false, maturity: 'Everyone', links: false, images: false },
    gradient: 'from-green-500 to-emerald-600',
    icon: '🏘️',
  },
  {
    id: 5, title: 'Murder Mystery 2', genre: 'horror', subgenre: 'Mystery',
    players: '67K', rating: 4.4, thumbnail: null,
    tags: ['Mystery', 'Social Deduction', 'Trading'],
    safety: { chat: true, voice: false, maturity: 'Everyone 10+', links: false, images: false },
    gradient: 'from-red-600 to-rose-800',
    icon: '🔪',
  },
  {
    id: 6, title: 'Pet Simulator X', genre: 'simulator', subgenre: 'Collector',
    players: '112K', rating: 4.3, thumbnail: null,
    tags: ['Pets', 'Collecting', 'Grinding'],
    safety: { chat: true, voice: false, maturity: 'Everyone', links: false, images: false },
    gradient: 'from-yellow-400 to-orange-500',
    icon: '🐶',
  },
  {
    id: 7, title: 'Arsenal', genre: 'fighting', subgenre: 'FPS',
    players: '45K', rating: 4.6, thumbnail: null,
    tags: ['FPS', 'Competitive', 'Action'],
    safety: { chat: true, voice: false, maturity: 'Everyone 10+', links: false, images: false },
    gradient: 'from-slate-600 to-zinc-800',
    icon: '🔫',
  },
  {
    id: 8, title: 'Build A Boat', genre: 'tycoon', subgenre: 'Building',
    players: '38K', rating: 4.5, thumbnail: null,
    tags: ['Building', 'Creative', 'Adventure'],
    safety: { chat: true, voice: false, maturity: 'Everyone', links: false, images: false },
    gradient: 'from-sky-400 to-blue-600',
    icon: '🚤',
  },
  {
    id: 9, title: 'Royale High', genre: 'roleplay', subgenre: 'Fashion',
    players: '95K', rating: 4.7, thumbnail: null,
    tags: ['Fashion', 'School', 'Fantasy'],
    safety: { chat: true, voice: false, maturity: 'Everyone', links: false, images: false },
    gradient: 'from-pink-400 to-fuchsia-600',
    icon: '👑',
  },
  {
    id: 10, title: 'Jailbreak', genre: 'adventure', subgenre: 'Open World',
    players: '58K', rating: 4.5, thumbnail: null,
    tags: ['Open World', 'Vehicles', 'Heist'],
    safety: { chat: true, voice: false, maturity: 'Everyone 10+', links: false, images: false },
    gradient: 'from-amber-500 to-yellow-600',
    icon: '🚔',
  },
  {
    id: 11, title: 'Natural Disaster', genre: 'simulator', subgenre: 'Survival',
    players: '29K', rating: 4.2, thumbnail: null,
    tags: ['Survival', 'Disaster', 'Casual'],
    safety: { chat: true, voice: false, maturity: 'Everyone', links: false, images: false },
    gradient: 'from-teal-500 to-green-600',
    icon: '🌪️',
  },
  {
    id: 12, title: 'Piggy', genre: 'horror', subgenre: 'Escape',
    players: '41K', rating: 4.4, thumbnail: null,
    tags: ['Horror', 'Escape Room', 'Story'],
    safety: { chat: true, voice: false, maturity: 'Everyone 10+', links: false, images: false },
    gradient: 'from-rose-500 to-pink-700',
    icon: '🐷',
  },
];

const MATURITY_COLORS = {
  'Everyone': 'text-success bg-success/10 border-success/20',
  'Everyone 10+': 'text-warning bg-warning/10 border-warning/20',
};

function ExperienceCard({ experience }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative rounded-2xl overflow-hidden bg-surface-card border border-border-glow hover:border-violet/40 transition-all duration-300 hover:scale-[1.02] hover:glow-violet cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Play ${experience.title}`}
    >
      {/* Thumbnail */}
      <div className={`relative aspect-video bg-gradient-to-br ${experience.gradient} flex items-center justify-center overflow-hidden`}>
        <span className="text-5xl opacity-80 group-hover:scale-110 transition-transform duration-300">{experience.icon}</span>

        {/* Hover overlay */}
        <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-14 h-14 rounded-full gradient-brand flex items-center justify-center glow-magenta">
            <Play className="w-6 h-6 text-white ml-0.5" />
          </div>
        </div>

        {/* Safety badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${MATURITY_COLORS[experience.safety.maturity]}`}>
            {experience.safety.maturity}
          </span>
        </div>

        {/* Player count */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm">
          <Users className="w-3 h-3 text-success" />
          <span className="text-[11px] font-semibold text-white">{experience.players}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-bold text-text-primary truncate mb-1">{experience.title}</h3>
        <p className="text-[11px] text-text-muted mb-2">{experience.genre} · {experience.subgenre}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-warning fill-warning" />
            <span className="text-xs font-semibold text-text-secondary">{experience.rating}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {experience.safety.chat && <MessageCircle className="w-3 h-3 text-text-muted" title="Chat enabled" />}
            <Shield className="w-3 h-3 text-success" title="Safety monitored" />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {experience.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-light text-text-muted">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, icon: Icon, count }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-magenta" />}
        <h2 className="text-lg font-bold text-text-primary">{title}</h2>
        {count && <span className="text-xs font-medium text-text-muted bg-surface-light px-2 py-0.5 rounded-full">{count}</span>}
      </div>
      <button className="flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-magenta transition-colors">
        See All <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function Discover() {
  const [activeGenre, setActiveGenre] = useState('all');
  const [liked, setLiked] = useState(new Set());

  const filtered = activeGenre === 'all'
    ? EXPERIENCES
    : EXPERIENCES.filter(e => e.genre === activeGenre);

  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden mb-8 gradient-brand p-8 lg:p-12 glow-magenta">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-4 right-4 opacity-30 text-8xl">🎮</div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-white" />
            <span className="text-white/80 text-sm font-medium">Safety Protected</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-2">Discover Experiences</h1>
          <p className="text-white/70 text-sm lg:text-base max-w-lg">
            Explore thousands of safe, verified experiences. Every game is monitored for your protection.
          </p>
        </div>
      </div>

      {/* Genre Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-thin -mx-1 px-1" role="tablist" aria-label="Filter by genre">
        {GENRES.map(genre => (
          <button
            key={genre.id}
            onClick={() => setActiveGenre(genre.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
              activeGenre === genre.id
                ? 'gradient-brand text-white glow-magenta'
                : 'bg-surface-card border border-border-glow text-text-secondary hover:bg-surface-hover hover:text-text-primary'
            }`}
            role="tab"
            aria-selected={activeGenre === genre.id}
          >
            <span>{genre.emoji}</span>
            {genre.label}
          </button>
        ))}
      </div>

      {/* Trending Section */}
      <SectionHeader title="Trending Now" icon={TrendingUp} count={`${filtered.length} experiences`} />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-10">
        {filtered.slice(0, 5).map(exp => (
          <ExperienceCard key={exp.id} experience={exp} />
        ))}
      </div>

      {/* Popular Section */}
      <SectionHeader title="Most Popular" icon={Star} />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-10">
        {filtered.slice(2, 8).map(exp => (
          <ExperienceCard key={exp.id} experience={exp} />
        ))}
      </div>

      {/* Recently Updated */}
      <SectionHeader title="Recently Updated" icon={Clock} />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-10">
        {filtered.slice(5, 12).map(exp => (
          <ExperienceCard key={exp.id} experience={exp} />
        ))}
      </div>
    </div>
  );
}
