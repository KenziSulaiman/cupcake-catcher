import React from 'react';
import {
  Home,
  User,
  ShoppingBag,
  Package,
  Users,
  Layout,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react';
import { POV } from '../../types';

/* ─── Types ─── */
interface SidebarProps {
  isOpen: boolean;
  onProfileClick?: () => void;
  onSafetyClick?: () => void;
  onMessagesClick?: () => void;
  activeView?: string;
  user: { avatarUrl: string; username: string };
  currentPOV: POV;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

/* ─── Sub-component ─── */
const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`flex items-center space-x-3 px-3 py-2.5 cursor-pointer transition-colors ${
      active
        ? 'bg-white/10 font-bold text-white'
        : 'text-gray-400 hover:bg-white/5'
    }`}
  >
    <span className={active ? 'text-white' : 'text-gray-500'}>{icon}</span>
    <span className="text-sm font-medium whitespace-nowrap">{label}</span>
  </div>
);

/* ─── Main Component ─── */
const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onProfileClick,
  onSafetyClick,
  onMessagesClick,
  activeView,
  user,
  currentPOV,
}) => {
  const isPredator = currentPOV === 'predator';

  return (
    <aside
      className={`fixed left-0 top-[60px] bottom-0 ${
        isPredator ? 'bg-[#111]/80' : 'bg-black/60'
      } backdrop-blur-md w-48 border-r border-white/5 overflow-y-auto hidden md:block transition-transform duration-300 z-40`}
    >
      <div className="py-4">
        {/* User avatar + name */}
        <div
          onClick={onProfileClick}
          className="px-3 mb-4 flex items-center space-x-2 cursor-pointer group"
        >
          <div className="h-7 w-7 rounded-full bg-gray-800 overflow-hidden border border-white/10">
            <img src={user.avatarUrl} alt="me" />
          </div>
          <span className="font-bold text-sm group-hover:underline">
            {user.username}
          </span>
        </div>

        {/* Navigation */}
        <nav className="space-y-0.5">
          <SidebarItem
            icon={<Home size={18} />}
            label="Home"
            onClick={onProfileClick}
            active={activeView === 'home'}
          />
          <SidebarItem
            icon={<User size={18} />}
            label="Profile"
            active={activeView === 'profile'}
            onClick={onProfileClick}
          />

          {currentPOV === 'victim' && (
            <SidebarItem
              icon={
                <AlertTriangle
                  size={18}
                  className={
                    activeView === 'analyzer' ? 'text-[#E2231A]' : ''
                  }
                />
              }
              label="Safety Analysis"
              active={activeView === 'analyzer'}
              onClick={onSafetyClick}
            />
          )}

          <SidebarItem
            icon={<MessageSquare size={18} />}
            label="Messages"
            active={activeView === 'messages'}
            onClick={onMessagesClick}
          />
          <SidebarItem icon={<Users size={18} />} label="Friends" />
          <SidebarItem icon={<Layout size={18} />} label="Avatar" />
          <SidebarItem icon={<Package size={18} />} label="Inventory" />
          <SidebarItem icon={<ShoppingBag size={18} />} label="Trade" />
          <SidebarItem icon={<Users size={18} />} label="Groups" />
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
