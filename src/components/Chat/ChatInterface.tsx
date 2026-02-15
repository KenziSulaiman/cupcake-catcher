import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronUp,
  ChevronDown,
  X,
  MessageSquare,
  Send,
  Lock,
  Moon,
  Camera,
  ShieldCheck,
} from 'lucide-react';
import { VICTIM_FRIENDS, PREDATOR_FRIENDS, PERSONAS } from '../../constants';
import { Friend, Message, SecurityReport, POV } from '../../types';
import { GoogleGenAI, Type } from '@google/genai';

/* ─── Props ─── */
interface ChatInterfaceProps {
  isVerified: boolean;
  onVerifyPrompt: () => void;
  onSecurityAlert?: (report: SecurityReport) => void;
  parentEmail?: string;
  currentPOV: POV;
  chatMessages: Record<string, Message[]>;
  onSendMessage: (targetFriendId: string, text: string) => void;
  otherUserTyping: string | null;
}

/* ─── Helpers ─── */
const isLateNight = (timestamp: string): boolean => {
  if (timestamp.includes('PM')) {
    const hour = parseInt(timestamp.split(':')[0]);
    return hour >= 10 && hour !== 12;
  }
  if (timestamp.includes('AM')) {
    const hour = parseInt(timestamp.split(':')[0]);
    return hour < 6 || hour === 12;
  }
  return false;
};

const resolveMessageKey = (friendId: string | undefined): string => {
  if (!friendId) return '';
  const { victim, predator } = PERSONAS;
  if (
    (friendId === 'me' && predator.id === 'c1') ||
    (friendId === 'c1' && victim.id === 'me')
  ) {
    return 'c1';
  }
  return friendId;
};

/* ─── Component ─── */
const ChatInterface: React.FC<ChatInterfaceProps> = ({
  isVerified,
  onVerifyPrompt,
  onSecurityAlert,
  parentEmail,
  currentPOV,
  chatMessages,
  onSendMessage,
  otherUserTyping,
}) => {
  const [isListExpanded, setIsListExpanded] = useState(false);
  const [activeFriend, setActiveFriend] = useState<Friend | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isFlashActive, setIsFlashActive] = useState(false);
  const [lastAlertText, setLastAlertText] = useState('');
  const [notificationStatus, setNotificationStatus] = useState<string | null>(
    null,
  );

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const friends =
    currentPOV === 'victim' ? VICTIM_FRIENDS : PREDATOR_FRIENDS;
  const isPredator = currentPOV === 'predator';
  const currentPersonaId = isPredator ? PERSONAS.predator.id : PERSONAS.victim.id;

  /* Auto-scroll on new messages */
  useEffect(() => {
    chatScrollRef.current?.scrollTo({
      top: chatScrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [chatMessages, activeFriend, otherUserTyping]);

  /* Victim-side: analyze incoming predator messages */
  useEffect(() => {
    const messages = chatMessages['c1'] || [];
    if (messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];
    if (currentPOV === 'victim' && lastMsg.senderId === PERSONAS.predator.id) {
      analyzeSafety(lastMsg.text, lastMsg.timestamp, VICTIM_FRIENDS[0]);
    }
  }, [chatMessages, currentPOV]);

  /* ─── Actions ─── */
  const toggleList = () => setIsListExpanded((prev) => !prev);

  const openChat = (friend: Friend) => {
    setActiveFriend(friend);
    if (!isListExpanded) setIsListExpanded(true);
  };

  const closeChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveFriend(null);
  };

  const handleSend = () => {
    if (!inputValue.trim() || !activeFriend || !isVerified) return;
    onSendMessage(activeFriend.id, inputValue);
    setInputValue('');
  };

  /* ─── Email Dispatch ─── */
  const dispatchEmailAlert = async (
    text: string,
    friend: string,
    severity: string,
    reason: string,
  ) => {
    if (!parentEmail || currentPOV !== 'victim') return;

    setNotificationStatus('Dispatching Safety Alert...');
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer re_NPhs9b28_G4DbqA9Scos6vqQ1mMGkSeDp`,
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: parentEmail,
          subject: `CRITICAL SAFETY ALERT: @${PERSONAS.victim.username}`,
          html: `
            <div style="font-family:sans-serif;padding:20px;border:4px solid #E2231A;border-radius:10px">
              <h2 style="color:#E2231A;margin-bottom:5px">⚠️ FORENSIC SAFETY ALERT</h2>
              <p style="font-size:14px;color:#555"><strong>Target:</strong> @${PERSONAS.victim.username} (Minor)</p>
              <p style="font-size:14px;color:#555"><strong>Interacting with:</strong> ${friend}</p>
              <p style="font-size:14px;color:#555"><strong>Risk Level:</strong>
                <span style="background:#FFEBEB;color:#E2231A;padding:2px 6px;border-radius:4px;font-weight:bold">${severity.toUpperCase()}</span>
              </p>
              <div style="background:#f9f9f9;padding:15px;border-radius:5px;border-left:5px solid #ccc;margin-top:20px">
                <p style="margin:0;font-style:italic">"${text}"</p>
              </div>
              <p style="margin-top:20px;font-size:13px"><strong>AI Analysis:</strong> ${reason}</p>
            </div>`,
        }),
      });

      setNotificationStatus(response.ok ? 'Alert Sent to Parents' : 'Email Dispatch Error');
    } catch {
      setNotificationStatus('Network Failure');
    } finally {
      setTimeout(() => setNotificationStatus(null), 4000);
    }
  };

  /* ─── AI Safety Analysis ─── */
  const analyzeSafety = async (
    text: string,
    timestamp: string,
    friend: Friend,
  ) => {
    if (currentPOV !== 'victim') return;

    const ageGap = Math.abs(friend.age - PERSONAS.victim.age);
    if (ageGap < 5) return;

    const lateNight = isLateNight(timestamp);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this RBLX message for grooming/safety risks.
          Message: "${text}"
          Timestamp: ${timestamp}
          Is Late Night: ${lateNight ? 'YES' : 'NO'}
          Context: ${friend.age}-year-old user to ${PERSONAS.victim.age}-year-old user.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              severity: { type: Type.STRING },
              reason: { type: Type.STRING },
              status: { type: Type.STRING },
            },
            required: ['severity', 'reason', 'status'],
          },
        },
      });

      const result = JSON.parse(response.text || '{}');

      if (result.severity === 'High' || result.severity === 'Critical') {
        triggerSecurityAction(text, friend, result);
        if (parentEmail) {
          dispatchEmailAlert(text, friend.username, result.severity, result.reason);
        }
      }
    } catch (e) {
      console.error('AI Analysis failed', e);
    }
  };

  const triggerSecurityAction = (
    text: string,
    friend: Friend,
    aiResult: { severity: string; reason: string },
  ) => {
    setIsFlashActive(true);
    setLastAlertText(`Forensic Capture: ${aiResult.severity} Risk Detected`);
    setTimeout(() => setIsFlashActive(false), 800);
    setTimeout(() => setLastAlertText(''), 4000);

    onSecurityAlert?.({
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      targetUser: friend.username,
      messageContent: text,
      severity: aiResult.severity as SecurityReport['severity'],
      status: 'Forwarded to Parents',
      reason: aiResult.reason,
    });
  };

  /* ─── Derived State ─── */
  const messageKey = resolveMessageKey(activeFriend?.id);
  const activeMessages = chatMessages[messageKey] || [];
  const isTargetTyping = activeFriend && otherUserTyping === activeFriend.id;

  /* ─── Render ─── */
  return (
    <div className="fixed bottom-0 right-8 z-[100] flex flex-col items-end pointer-events-none">
      {/* Notification Toast */}
      {notificationStatus && (
        <div className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-2xl font-bold flex items-center space-x-2 animate-in slide-in-from-right-4 pointer-events-auto border border-white/20">
          <ShieldCheck size={16} />
          <span className="text-[10px] uppercase tracking-widest">
            {notificationStatus}
          </span>
        </div>
      )}

      {/* Alert Toast */}
      {lastAlertText && (
        <div className="mb-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-xl font-bold flex items-center space-x-2 animate-bounce pointer-events-auto border-2 border-white/20">
          <Camera size={18} />
          <span className="text-xs uppercase tracking-wider">
            {lastAlertText}
          </span>
        </div>
      )}

      <div className="flex space-x-4 items-end pointer-events-auto">
        {/* Active Chat Window */}
        {activeFriend && (
          <div
            className={`w-[340px] h-[480px] ${
              isPredator ? 'bg-[#111]' : 'bg-[#191919]'
            } rounded-t-xl shadow-2xl border border-white/10 flex flex-col animate-in slide-in-from-bottom-4 duration-300 relative overflow-hidden chat-container-transition`}
          >
            {isFlashActive && (
              <div className="absolute inset-0 z-50 bg-white animate-pulse opacity-60" />
            )}

            {/* Verification Lock Overlay */}
            {!isVerified && currentPOV === 'victim' && (
              <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center space-y-4">
                <Lock className="text-[#E2231A]" size={32} />
                <h3 className="text-lg font-bold">Messaging Locked</h3>
                <button
                  onClick={onVerifyPrompt}
                  className="bg-[#E2231A] text-white py-2 px-6 rounded-md font-bold text-sm w-full"
                >
                  Verify Identity
                </button>
              </div>
            )}

            {/* Chat Header */}
            <div
              className={`p-3 border-b border-white/5 text-white flex items-center justify-between transition-colors ${
                isPredator ? 'bg-[#1a1c1e]' : 'bg-[#191919]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full border border-white/10 overflow-hidden">
                  <img
                    src={activeFriend.avatarUrl}
                    alt={activeFriend.username}
                  />
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight">
                    {activeFriend.username}
                  </p>
                  <p className="text-[10px] text-green-500 font-bold uppercase">
                    {activeFriend.status}
                  </p>
                </div>
              </div>
              <X
                size={18}
                className="cursor-pointer text-gray-400 hover:text-white transition-colors"
                onClick={closeChat}
              />
            </div>

            {/* Messages */}
            <div
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#111111]"
            >
              {activeMessages.map((msg) => {
                const isMe = msg.senderId === currentPersonaId;
                const late = isLateNight(msg.timestamp);

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col animate-in fade-in duration-300 ${
                      isMe
                        ? 'items-end slide-in-from-right-2'
                        : 'items-start slide-in-from-left-2'
                    }`}
                  >
                    <div
                      className={`max-w-[90%] px-3 py-2 rounded-xl text-sm shadow-md ${
                        isMe
                          ? 'bg-[#232527] text-white'
                          : 'bg-white/5 text-gray-100 border border-white/5'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                      <div className="flex items-center justify-end mt-1 text-[8px] opacity-40">
                        {late && (
                          <Moon size={8} className="mr-1 text-yellow-500" />
                        )}
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isTargetTyping && (
                <div className="flex flex-col items-start animate-in fade-in slide-in-from-left-2 duration-300">
                  <div className="bg-white/5 text-gray-400 px-3 py-2 rounded-xl text-xs border border-white/5 flex items-center space-x-1">
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
            <div className="p-3 border-t border-white/5 flex items-center space-x-2 bg-[#191919]">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Say something..."
                className="flex-1 text-sm bg-[#232527] rounded-md px-3 py-2 text-white outline-none border border-transparent focus:border-white/10 transition-all"
              />
              <button
                onClick={handleSend}
                className="bg-[#E2231A] hover:bg-[#c11e16] p-2 rounded-md transition-all active:scale-95"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Friend List Panel */}
        <div
          className={`w-[320px] flex flex-col ${
            isPredator ? 'bg-[#111]' : 'bg-[#191919]'
          } rounded-t-xl shadow-2xl border border-white/10 chat-container-transition pointer-events-auto ${
            isListExpanded ? 'h-[500px]' : 'h-[52px]'
          }`}
        >
          <div
            onClick={toggleList}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <MessageSquare size={18} className="text-[#E2231A]" />
                {otherUserTyping && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping" />
                )}
              </div>
              <span className="font-bold text-[13px] uppercase tracking-wider">
                Chat
              </span>
            </div>
            {isListExpanded ? (
              <ChevronDown size={20} className="text-gray-400" />
            ) : (
              <ChevronUp size={20} className="text-gray-400" />
            )}
          </div>

          {isListExpanded && (
            <div className="flex-1 overflow-y-auto custom-scrollbar animate-in fade-in duration-500">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  onClick={() => openChat(friend)}
                  className="flex items-center space-x-3 p-4 hover:bg-white/5 cursor-pointer border-b border-white/5 transition-colors group"
                >
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-[#2a2a2a] group-hover:scale-105 transition-transform">
                      <img
                        src={friend.avatarUrl}
                        alt={friend.username}
                      />
                    </div>
                    <div
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#191919] ${
                        friend.status === 'online'
                          ? 'bg-[#00A2FF]'
                          : 'bg-gray-600'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-bold">{friend.username}</p>
                      {otherUserTyping === friend.id && (
                        <div className="text-[8px] text-green-500 font-bold animate-pulse uppercase">
                          Typing...
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">
                      {friend.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
