import React from 'react';

export default function RobloxAvatar({ size = 'md', animate = true, username = 'Player', online = true }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const emojiSize = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <div className={`${sizeClasses[size]} ${animate ? 'animate-float' : ''} relative`}>
      <div className="w-full h-full rounded-full gradient-brand p-0.5">
        <div className="w-full h-full rounded-full bg-surface-card flex items-center justify-center">
          <span className={`${emojiSize[size]}`}>👦</span>
        </div>
      </div>
      {online && (
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-surface-card"></div>
      )}
    </div>
  );
}
