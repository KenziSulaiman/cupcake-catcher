import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MoreHorizontal,
  Send,
  UserCheck,
  Lock,
  ShieldAlert,
  Award,
} from 'lucide-react';
import { VICTIM_FRIENDS, PREDATOR_FRIENDS, PERSONAS } from '../../constants';
import { Friend, Message, POV } from '../../types';

/* ─── Props ─── */
interface MessagesViewProps {
  currentPOV: POV;
  onVerifyPrompt: () => void;
  isVerified: boolean;
  isVeriflyVerified?: boolean;
  chatMessages: Record<string, Message[]>;
  onSendMessage: (targetFriendId: string, text: string) => void;
  otherUserTyping: string | null;
}

/* ─── Helpers ─── */
const resolveMessageKey = (friendId: string): string => {
  const { victim, predator } = PERSONAS;
  if (
    (friendId === 'me' && predator.id === 'c1') ||
    (friendId === 'c1' && victim.id === 'me')
  ) {
    return 'c1';
  }
  return friendId;
};

/* ─── Age Badge ─── */
const AgeBadge: React.FC<{
  age: number;
  friendId: string;
  currentPOV: POV;
  isVeriflyVerified?: boolean;
}> = ({ age, friendId, currentPOV, isVeriflyVerified }) => {
  const isAdult = age >= 17;
  const isSelf =
    friendId === PERSONAS.predator.id || friendId === PERSONAS.victim.id;
  const showVerifly =
    currentPOV === 'predator' && isVeriflyVerified && isSelf;

  return (
    <div className="flex items-center space-x-1">
      <span
        className={`text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase ${
          isAdult
            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
            : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
        }`}
      >
        {isAdult ? 'Verified 17+' : 'Verified Under 18'}
      </span>

      {showVerifly && (
        <span className="text-[9px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
          <Award size={8} />
          VERIFLY
        </span>
      )}
    </div>
  );
};

/* ─── Main Component ─── */
const MessagesView: React.FC<MessagesViewProps> = ({
  currentPOV,
  onVerifyPrompt,
  isVerified,
  isVeriflyVerified,
  chatMessages,
  onSendMessage,
  otherUserTyping,
}) => {
  const friends =
    currentPOV === 'victim' ? VICTIM_FRIENDS : PREDATOR_FRIENDS;

  const [activeFriend, setActiveFriend] = useState<Friend>(friends[0]);
  const [inputValue, setInputValue] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const isPredator = currentPOV === 'predator';
  const currentPersonaId = isPredator
    ? PERSONAS.predator.id
    : PERSONAS.victim.id;

  const activeMessages =
    chatMessages[resolveMessageKey(activeFriend.id)] || [];
  const isTargetTyping = otherUserTyping === activeFriend.id;

  /* Auto-scroll */
  useEffect(() => {
    chatScrollRef.current?.scrollTo({
      top: chatScrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [chatMessages, activeFriend, otherUserTyping]);

  const handleSend = () => {
    if (!inputValue.trim() || !activeFriend || !isVerified) return;
    onSendMessage(activeFriend.id, inputValue);
    setInputValue('');
  };

  return (
    <div className="flex h-full w-full bg-[#111] overflow-hidden animate-in fade-in duration-500">
      {/* ── Conversations List ── */}
      <div className="w-80 border-r border-white/5 flex flex-col bg-[#191919]">
        <div className="p-4 border-b border-white/5">
          <h2 className="text-lg font-bold mb-4">Messages</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search people"
              className="w-full bg-[#111213] border border-white/10 rounded-md py-2 pl-3 pr-10 text-xs focus:outline-none focus:border-white/20 transition-all"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-500" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {friends.map((friend) => {
            const lastMsg = chatMessages[resolveMessageKey(friend.id)]?.slice(-1)[0];

            return (
              <div
                key={friend.id}
                onClick={() => setActiveFriend(friend)}
                className={`flex items-center space-x-3 p-4 cursor-pointer transition-all border-b border-white/5 ${
                  activeFriend.id === friend.id
                    ? 'bg-white/5 border-l-4 border-l-[#E2231A]'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="relative shrink-0">
                  <div className="h-12 w-12 rounded-full overflow-hidden border border-white/10 bg-[#2a2a2a] transition-transform active:scale-95">
                    <img src={friend.avatarUrl} alt={friend.username} />
                  </div>
                  <div
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#191919] ${
                      friend.status === 'online'
                        ? 'bg-[#00A2FF]'
                        : 'bg-gray-600'
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center space-x-2 truncate">
                      <p className="text-sm font-bold truncate">
                        {friend.username}
                      </p>
                      <AgeBadge
                        age={friend.age}
                        friendId={friend.id}
                        currentPOV={currentPOV}
                        isVeriflyVerified={isVeriflyVerified}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500">
                      {lastMsg?.timestamp || ''}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-gray-400 truncate">
                      {lastMsg?.text || 'No messages yet'}
                    </p>
                    {otherUserTyping === friend.id && (
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Active Chat Area ── */}
      <div className="flex-1 flex flex-col bg-[#000]">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 bg-[#191919] border-b border-white/5">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full overflow-hidden border border-white/10">
              <img src={activeFriend.avatarUrl} alt={activeFriend.username} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <p className="font-bold">{activeFriend.username}</p>
                <AgeBadge
                  age={activeFriend.age}
                  friendId={activeFriend.id}
                  currentPOV={currentPOV}
                  isVeriflyVerified={isVeriflyVerified}
                />
              </div>
              <p className="text-[10px] text-green-500 font-bold uppercase leading-none">
                {activeFriend.status}
              </p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-white transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={chatScrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar"
        >
          {/* Verification Lock */}
          {!isVerified && currentPOV === 'victim' && (
            <div className="mb-8 p-6 bg-[#E2231A]/10 border border-[#E2231A]/20 rounded-xl flex flex-col items-center text-center space-y-4 animate-in zoom-in-95">
              <Lock className="text-[#E2231A]" size={32} />
              <h3 className="font-bold text-lg">Messaging Safety Lock</h3>
              <p className="text-sm text-gray-400 max-w-sm">
                You must verify your identity to message players who are not in
                your close friend circle.
              </p>
              <button
                onClick={onVerifyPrompt}
                className="bg-[#E2231A] text-white px-8 py-2 rounded-md font-bold text-sm hover:scale-105 transition-transform"
              >
                Verify Now
              </button>
            </div>
          )}

          {activeMessages.map((msg) => {
            const isMe = msg.senderId === currentPersonaId;

            return (
              <div
                key={msg.id}
                className={`flex animate-in fade-in duration-300 ${
                  isMe
                    ? 'justify-end slide-in-from-right-4'
                    : 'justify-start slide-in-from-left-4'
                }`}
              >
                <div className="max-w-[70%] group">
                  {!isMe && (
                    <div className="flex items-center space-x-2 mb-1 px-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">
                        {activeFriend.username}
                      </span>
                      <span className="text-[9px] text-gray-700">
                        {msg.timestamp}
                      </span>
                    </div>
                  )}

                  <div
                    className={`px-4 py-3 rounded-2xl text-[15px] shadow-lg transition-all ${
                      isMe
                        ? 'bg-[#232527] text-white rounded-tr-none'
                        : 'bg-white/5 text-gray-100 border border-white/5 rounded-tl-none'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>

                  {isMe && (
                    <div className="text-[9px] text-gray-600 mt-1 text-right">
                      {msg.timestamp} • Sent
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTargetTyping && (
            <div className="flex justify-start animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="bg-white/5 text-gray-400 px-4 py-3 rounded-2xl text-sm border border-white/5 flex items-center space-x-2">
                <span>{activeFriend.username} is typing</span>
                <span className="flex">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 bg-[#191919] border-t border-white/5">
          <div className="relative flex items-center space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Message ${activeFriend.username}`}
                disabled={!isVerified && currentPOV === 'victim'}
                className="w-full bg-[#111213] border border-white/10 rounded-lg py-4 pl-4 pr-12 text-sm focus:outline-none focus:border-white/20 transition-all disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#E2231A] hover:bg-[#c11e16] p-2 rounded-md transition-all active:scale-95 disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-gray-500 mt-3 flex items-center gap-2">
            <UserCheck size={12} className="text-blue-500" />
            End-to-end encryption is managed by Roblox Safety Systems.
          </p>
        </div>
      </div>

      {/* ── Target Intel Panel (Predator POV only) ── */}
      {isPredator && (
        <div className="w-80 border-l border-white/5 bg-[#191919] hidden xl:flex flex-col animate-in slide-in-from-right-4 duration-500">
          <div className="p-8 flex flex-col items-center text-center space-y-4">
            <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white/5 shadow-2xl hover:scale-105 transition-transform">
              <img
                src={activeFriend.avatarUrl}
                alt="Target"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold">{activeFriend.username}</h2>
              <p className="text-sm text-gray-500">
                {activeFriend.username === 'asteroidlord'
                  ? '@defnotasteroid'
                  : '@mega_user'}
              </p>
            </div>
            <div className="flex space-x-2">
              <span className="bg-[#E2231A]/10 text-[#E2231A] text-[10px] font-bold px-2 py-1 rounded border border-[#E2231A]/20">
                PRIORITY TARGET
              </span>
              <span className="bg-yellow-500/10 text-yellow-500 text-[10px] font-bold px-2 py-1 rounded border border-yellow-500/20">
                MINOR ({activeFriend.age})
              </span>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-white/5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Target Intel
            </h3>

            <div className="bg-black/20 p-4 rounded-lg space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Engagement Score</span>
                <span className="text-green-500 font-bold">88%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Main Interest</span>
                <span className="text-white">Adopt Me!</span>
              </div>
            </div>

            <div className="bg-[#E2231A]/5 border border-[#E2231A]/20 p-4 rounded-lg space-y-2 group">
              <div className="flex items-center space-x-2 text-[#E2231A] group-hover:scale-105 transition-transform">
                <ShieldAlert size={14} />
                <span className="text-[10px] font-bold uppercase tracking-tight">
                  Active Safety Risk
                </span>
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Parental monitoring email detected on account. Avoid requesting
                platform migration for 48h to prevent detection.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesView;
