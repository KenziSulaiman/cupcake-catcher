import React from 'react';
import { Search, Bell, Settings, Repeat } from 'lucide-react';
import { POV } from '../../types';

interface NavbarProps {
  onHomeClick: () => void;
  currentPOV: POV;
  onTogglePOV: () => void;
  user: {
    avatarUrl: string;
    username: string;
  };
}

const LOGO_URL =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU3PVRE_vleIyipQnw-7O8KiVVHHFbNTdCQA&s';

const Navbar: React.FC<NavbarProps> = ({
  onHomeClick,
  currentPOV,
  onTogglePOV,
  user,
}) => {
  const isPredator = currentPOV === 'predator';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 h-[60px] ${
        isPredator ? 'bg-[#1a1c1e]' : 'bg-[#232527]'
      } text-white flex items-center justify-between px-4 z-50 shadow-sm border-b border-white/5`}
    >
      {/* Left: Logo + Nav Links */}
      <div className="flex items-center space-x-6">
        <div
          className="flex items-center space-x-2 cursor-pointer group"
          onClick={onHomeClick}
        >
          <img
            src={LOGO_URL}
            alt="RBLX"
            className="h-7 w-7 rounded-sm group-hover:scale-105 transition-transform"
          />
          <span className="font-bold text-xl tracking-tight hidden sm:block">
            RBLX
          </span>
        </div>

        <div className="hidden lg:flex space-x-6 font-medium text-sm text-gray-300">
          <button
            onClick={onHomeClick}
            className="hover:text-white transition-all"
          >
            Home
          </button>
          <a href="#" className="hover:text-white transition-all">
            Discover
          </a>
          <a href="#" className="hover:text-white transition-all">
            Avatar Shop
          </a>

          <button
            onClick={onTogglePOV}
            className={`flex items-center space-x-2 px-3 py-1 rounded-md border text-xs font-bold transition-all ${
              isPredator
                ? 'bg-red-600 border-red-500 hover:bg-red-700'
                : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
            }`}
          >
            <Repeat size={14} />
            <span>
              SWITCH TO {isPredator ? 'VICTIM POV' : 'PREDATOR POV'}
            </span>
          </button>
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-sm mx-8 hidden md:block">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-[#111213] border border-gray-700 rounded-md py-1.5 pl-3 pr-10 text-sm focus:outline-none focus:border-gray-500"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-5">
        <div className="flex items-center space-x-1 cursor-pointer hover:bg-white/10 p-1 rounded-md transition-colors">
          <span className="font-bold text-sm">
            {isPredator ? '85,420' : '170'}
          </span>
          <img src={LOGO_URL} alt="robux" className="h-5 w-5 rounded-sm" />
        </div>

        <Bell
          size={20}
          className="text-gray-300 hover:text-white cursor-pointer"
        />
        <Settings
          size={20}
          className="text-gray-300 hover:text-white cursor-pointer"
        />

        <div className="h-8 w-8 bg-gray-600 rounded-full overflow-hidden border border-white/10 cursor-pointer">
          <img src={user.avatarUrl} alt="profile" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
