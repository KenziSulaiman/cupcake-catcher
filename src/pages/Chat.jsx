import { useState, useRef, useEffect } from 'react';
import { Send, Shield, Ban, Flag, AlertTriangle, X, Lock, ChevronLeft, Info, ShieldAlert, ShieldCheck, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSafety } from '../context/SafetyContext';
import { filterProfanity } from '../utils/profanityFilter';
import { analyzeMessage, CATEGORY_LABELS } from '../utils/groomerDetection';

const MOCK_CONVERSATIONS = [
  {
    id: 'c1',
    friend: { id: 'f1', username: 'PixelQueen22', displayName: 'Sophie', online: true, trusted: true },
    messages: [
      { id: 1, sender: 'f1', text: 'Hey! Want to play Adopt Me later?', time: '3:42 PM', flagged: false },
      { id: 2, sender: 'me', text: 'Sure! I just got a new legendary pet!', time: '3:43 PM', flagged: false },
      { id: 3, sender: 'f1', text: 'Omg thats so cool! Which one?', time: '3:43 PM', flagged: false },
      { id: 4, sender: 'me', text: 'The neon unicorn 🦄', time: '3:44 PM', flagged: false },
    ],
    unread: 0,
    safetyLabel: 'Friends Only',
  },
  {
    id: 'c2',
    friend: { id: 'f2', username: 'BloxMaster99', displayName: 'Ryan', online: true, trusted: true },
    messages: [
      { id: 1, sender: 'f2', text: 'Yo check out this new obby I found', time: '2:15 PM', flagged: false },
      { id: 2, sender: 'me', text: 'Which one??', time: '2:16 PM', flagged: false },
      { id: 3, sender: 'f2', text: 'Tower of Hell but harder lol', time: '2:16 PM', flagged: false },
    ],
    unread: 1,
    safetyLabel: 'Friends Only',
  },
  {
    id: 'c3',
    friend: { id: 'f6', username: 'SpeedRunner01', displayName: 'Liam', online: true, trusted: false },
    messages: [
      { id: 1, sender: 'f6', text: 'hey nice profile', time: '1:30 PM', flagged: false },
      { id: 2, sender: 'me', text: 'Thanks!', time: '1:31 PM', flagged: false },
      { id: 3, sender: 'f6', text: 'how old are you btw?', time: '1:32 PM', flagged: true },
    ],
    unread: 1,
    safetyLabel: 'New Friend',
  },
  {
    id: 'c4',
    friend: { id: 'f4', username: 'NinjaGamer_X', displayName: 'Jake', online: false, trusted: true },
    messages: [
      { id: 1, sender: 'f4', text: 'GGs on that last round!', time: 'Yesterday', flagged: false },
      { id: 2, sender: 'me', text: 'Thanks dude it was close', time: 'Yesterday', flagged: false },
    ],
    unread: 0,
    safetyLabel: 'Friends Only',
  },
];

function GroomingAlert({ flags, onDismiss }) {
  if (!flags || flags.length === 0) return null;

  const hasCritical = flags.some(f => f.severity === 'critical');
  const hasHigh = flags.some(f => f.severity === 'high');

  return (
    <div className={`mx-4 mb-2 rounded-xl p-3 animate-slide-up ${
      hasCritical ? 'bg-danger/15 border border-danger/30' :
      hasHigh ? 'bg-warning/15 border border-warning/30' :
      'bg-violet/15 border border-violet/30'
    }`}>
      <div className="flex items-start gap-2">
        <ShieldAlert className={`w-5 h-5 shrink-0 mt-0.5 ${
          hasCritical ? 'text-danger' : hasHigh ? 'text-warning' : 'text-violet'
        }`} />
        <div className="flex-1">
          <p className={`text-xs font-bold mb-1 ${
            hasCritical ? 'text-danger' : hasHigh ? 'text-warning' : 'text-violet'
          }`}>
            {hasCritical ? '⚠️ Critical Safety Alert' : hasHigh ? '⚠️ Safety Warning' : 'Safety Notice'}
          </p>
          <p className="text-[11px] text-text-secondary leading-relaxed mb-2">
            {hasCritical
              ? 'This message contains patterns associated with predatory behavior. This has been flagged for review.'
              : 'This message triggered a safety check. Stay alert and report if you feel uncomfortable.'
            }
          </p>
          <div className="flex flex-wrap gap-1 mb-2">
            {flags.map((flag, i) => (
              <span key={i} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                flag.severity === 'critical' ? 'bg-danger/20 text-danger' :
                flag.severity === 'high' ? 'bg-warning/20 text-warning' :
                'bg-violet/20 text-violet'
              }`}>
                {flag.label}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="text-[11px] font-semibold text-danger flex items-center gap-1 hover:underline">
              <Flag className="w-3 h-3" /> Report This
            </button>
            <button className="text-[11px] font-semibold text-text-muted flex items-center gap-1 hover:underline" onClick={onDismiss}>
              <Eye className="w-3 h-3" /> I'm Okay
            </button>
          </div>
        </div>
        <button onClick={onDismiss} className="text-text-muted hover:text-text-secondary transition-colors" aria-label="Dismiss">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ReportModal({ friend, onClose, onSubmit }) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');

  const REASONS = [
    'Asking personal questions',
    'Requesting photos',
    'Trying to move off-platform',
    'Making me uncomfortable',
    'Using inappropriate language',
    'Threatening behavior',
    'Other',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true">
      <div className="glass-strong rounded-3xl p-6 max-w-md w-full animate-slide-up glow-danger">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-danger/20 flex items-center justify-center">
            <Flag className="w-5 h-5 text-danger" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary">Report {friend.displayName}</h3>
            <p className="text-xs text-text-muted">Your safety matters. Reports are reviewed within 1 hour.</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {REASONS.map(r => (
            <button
              key={r}
              onClick={() => setReason(r)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
                reason === r
                  ? 'bg-danger/15 border border-danger/30 text-danger font-semibold'
                  : 'bg-surface-light border border-border-glow text-text-secondary hover:bg-surface-hover'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <textarea
          placeholder="Add any details (optional)..."
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-surface-light border border-border-glow text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-danger resize-none h-20 mb-4"
        />

        <div className="flex gap-2">
          <button
            onClick={() => onSubmit(reason, details)}
            disabled={!reason}
            className="flex-1 py-3 rounded-xl bg-danger text-white font-semibold text-sm hover:bg-danger/90 disabled:opacity-50 transition-all"
          >
            Submit Report
          </button>
          <button onClick={onClose} className="px-4 py-3 rounded-xl bg-surface-light text-text-secondary text-sm hover:bg-surface-hover transition-all">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function BlockConfirmModal({ friend, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true">
      <div className="glass-strong rounded-3xl p-6 max-w-sm w-full animate-slide-up">
        <div className="text-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-danger/20 flex items-center justify-center mx-auto mb-3">
            <Ban className="w-7 h-7 text-danger" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-1">Block {friend.displayName}?</h3>
          <p className="text-sm text-text-muted">
            They won&apos;t be able to message you or see your profile. You can unblock them later.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-danger text-white font-semibold text-sm hover:bg-danger/90 transition-all">
            Block
          </button>
          <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-surface-light text-text-secondary text-sm hover:bg-surface-hover transition-all">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Chat() {
  const { isApproved, user } = useAuth();
  const { checkMessage, reportUser, blockUser } = useSafety();
  const [activeConvo, setActiveConvo] = useState(null);
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [inputText, setInputText] = useState('');
  const [activeAlerts, setActiveAlerts] = useState({});
  const [showReport, setShowReport] = useState(false);
  const [showBlock, setShowBlock] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConvo, conversations]);

  if (!isApproved) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-3xl bg-warning/10 border border-warning/20 flex items-center justify-center mb-6 animate-float">
          <Lock className="w-10 h-10 text-warning" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Chat is Locked</h1>
        <p className="text-text-secondary text-sm max-w-md mb-6">
          A parent or guardian needs to approve your account before you can chat.
          This keeps you safe from strangers.
        </p>
        <a href="/safety-gate" className="px-6 py-3 rounded-xl gradient-brand text-white font-semibold text-sm hover:opacity-90 transition-all glow-magenta no-underline">
          Set Up Safety
        </a>
      </div>
    );
  }

  const currentConvo = conversations.find(c => c.id === activeConvo);

  const handleSend = () => {
    if (!inputText.trim() || !activeConvo) return;

    const filtered = filterProfanity(inputText);
    const analysis = checkMessage(currentConvo.friend.id, inputText);

    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: filtered,
      time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      flagged: false,
    };

    setConversations(prev => prev.map(c =>
      c.id === activeConvo
        ? { ...c, messages: [...c.messages, newMsg] }
        : c
    ));

    if (analysis.riskScore > 0) {
      setActiveAlerts(prev => ({ ...prev, [activeConvo]: analysis.flags }));
    }

    setInputText('');

    // Simulate response with potential grooming patterns for demo
    if (inputText.toLowerCase().includes('test groomer')) {
      setTimeout(() => {
        const groomerMsg = {
          id: Date.now() + 1,
          sender: currentConvo.friend.id,
          text: 'how old are you? you seem really mature for your age. we should talk on snapchat instead',
          time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
          flagged: true,
        };
        const groomAnalysis = checkMessage(currentConvo.friend.id, groomerMsg.text);

        setConversations(prev => prev.map(c =>
          c.id === activeConvo
            ? { ...c, messages: [...c.messages, groomerMsg] }
            : c
        ));

        setActiveAlerts(prev => ({ ...prev, [activeConvo]: groomAnalysis.flags }));
      }, 1500);
    }
  };

  const handleReport = (reason, details) => {
    if (currentConvo) {
      reportUser('me', currentConvo.friend.id, reason, details);
    }
    setShowReport(false);
  };

  const handleBlock = () => {
    if (currentConvo) {
      blockUser('me', currentConvo.friend.id);
      setActiveConvo(null);
    }
    setShowBlock(false);
  };

  return (
    <div className="animate-fade-in -m-4 lg:-m-6 flex h-[calc(100vh-4rem)]">
      {/* Conversation List */}
      <div className={`${activeConvo ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 lg:w-96 border-r border-border-glow glass-strong`}>
        <div className="p-4 border-b border-border-glow">
          <h2 className="text-lg font-bold gradient-brand-text mb-3">Messages</h2>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-light border border-border-glow">
            <span className="text-text-muted text-sm">🔍</span>
            <input
              type="search"
              placeholder="Search conversations..."
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {conversations.map(convo => {
            const lastMsg = convo.messages[convo.messages.length - 1];
            const hasFlagged = convo.messages.some(m => m.flagged);

            return (
              <button
                key={convo.id}
                onClick={() => setActiveConvo(convo.id)}
                className={`w-full flex items-center gap-3 p-4 text-left hover:bg-surface-hover transition-all border-b border-border-glow/50 ${
                  activeConvo === convo.id ? 'bg-surface-hover' : ''
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-xl gradient-brand flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{convo.friend.displayName.charAt(0)}</span>
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface-card ${
                    convo.friend.online ? 'bg-success' : 'bg-text-muted'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-text-primary truncate">{convo.friend.displayName}</span>
                      {convo.friend.trusted ? (
                        <ShieldCheck className="w-3.5 h-3.5 text-success shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-text-muted shrink-0">{lastMsg?.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {hasFlagged && <ShieldAlert className="w-3 h-3 text-danger shrink-0" />}
                    <p className="text-xs text-text-muted truncate">{lastMsg?.text}</p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-surface-light text-text-muted font-medium">
                      {convo.safetyLabel}
                    </span>
                    {convo.unread > 0 && (
                      <span className="w-4.5 h-4.5 rounded-full bg-magenta text-white text-[10px] font-bold flex items-center justify-center px-1.5 py-0.5">
                        {convo.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${activeConvo ? 'flex' : 'hidden md:flex'} flex-col flex-1 bg-surface`}>
        {currentConvo ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b border-border-glow glass-strong">
              <button
                className="md:hidden p-2 rounded-xl hover:bg-surface-hover transition-colors"
                onClick={() => setActiveConvo(null)}
                aria-label="Back to conversations"
              >
                <ChevronLeft className="w-5 h-5 text-text-secondary" />
              </button>
              <div className="relative">
                <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{currentConvo.friend.displayName.charAt(0)}</span>
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface-card ${
                  currentConvo.friend.online ? 'bg-success' : 'bg-text-muted'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-bold text-text-primary">{currentConvo.friend.displayName}</p>
                  {currentConvo.friend.trusted ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-success" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                  )}
                </div>
                <p className="text-[11px] text-text-muted">
                  @{currentConvo.friend.username} · {currentConvo.friend.online ? 'Online' : 'Offline'}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowReport(true)}
                  className="p-2 rounded-xl hover:bg-danger/10 text-text-muted hover:text-danger transition-colors"
                  aria-label="Report user"
                  title="Report"
                >
                  <Flag className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowBlock(true)}
                  className="p-2 rounded-xl hover:bg-danger/10 text-text-muted hover:text-danger transition-colors"
                  aria-label="Block user"
                  title="Block"
                >
                  <Ban className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-xl hover:bg-surface-hover text-text-muted transition-colors" aria-label="Chat info">
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Safety Alert */}
            {activeAlerts[activeConvo] && (
              <GroomingAlert
                flags={activeAlerts[activeConvo]}
                onDismiss={() => setActiveAlerts(prev => {
                  const next = { ...prev };
                  delete next[activeConvo];
                  return next;
                })}
              />
            )}

            {/* Safety hint for new friends */}
            {!currentConvo.friend.trusted && (
              <div className="mx-4 mt-2 rounded-xl bg-warning/10 border border-warning/20 p-3 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                <p className="text-[11px] text-warning/80 leading-relaxed">
                  <strong>New friend.</strong> This person was recently added. Be careful sharing personal information.
                </p>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
              {/* Safety header message */}
              <div className="text-center py-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-card border border-border-glow">
                  <Shield className="w-3 h-3 text-success" />
                  <span className="text-[10px] text-text-muted font-medium">Messages are monitored for safety</span>
                </div>
              </div>

              {currentConvo.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] ${msg.sender === 'me' ? 'order-1' : 'order-0'}`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'me'
                        ? 'gradient-brand text-white rounded-br-md'
                        : msg.flagged
                          ? 'bg-danger/15 border border-danger/30 text-text-primary rounded-bl-md'
                          : 'bg-surface-card border border-border-glow text-text-primary rounded-bl-md'
                    }`}>
                      {msg.flagged && (
                        <div className="flex items-center gap-1 mb-1">
                          <ShieldAlert className="w-3 h-3 text-danger" />
                          <span className="text-[10px] font-bold text-danger">Flagged</span>
                        </div>
                      )}
                      {filterProfanity(msg.text)}
                    </div>
                    <p className={`text-[10px] text-text-muted mt-1 ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border-glow glass-strong">
              <div className="flex items-center gap-2 px-1 py-1 rounded-xl bg-surface-light border border-border-glow mb-2">
                <span className="text-[10px] text-text-muted px-2">💡 Never share your address, phone, or school name</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 rounded-xl bg-surface-light border border-border-glow text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-violet transition-all"
                  aria-label="Message input"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className="p-3 rounded-xl gradient-brand text-white hover:opacity-90 disabled:opacity-40 transition-all shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-text-muted mt-2 text-center">
                Type <strong className="text-magenta">test groomer</strong> to see safety detection in action
              </p>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 rounded-3xl gradient-brand/20 border border-violet/20 flex items-center justify-center mb-6">
              <Shield className="w-10 h-10 text-violet" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">Safe Messaging</h2>
            <p className="text-sm text-text-muted max-w-sm">
              Select a conversation to start chatting. All messages are monitored for your safety.
              Only friends can message you.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showReport && currentConvo && (
        <ReportModal
          friend={currentConvo.friend}
          onClose={() => setShowReport(false)}
          onSubmit={handleReport}
        />
      )}
      {showBlock && currentConvo && (
        <BlockConfirmModal
          friend={currentConvo.friend}
          onClose={() => setShowBlock(false)}
          onConfirm={handleBlock}
        />
      )}
    </div>
  );
}
