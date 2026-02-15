import React, { useState } from 'react';
import {
  MoreHorizontal,
  Youtube,
  Twitch,
  ChevronRight,
  UserCheck,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  Send,
  RefreshCw,
  Mail,
  Award,
} from 'lucide-react';
import { VICTIM_FRIENDS, PREDATOR_FRIENDS } from '../../constants';
import { POV } from '../../types';

/* ─── Props ─── */
interface DashboardProps {
  onVerifyClick?: () => void;
  isVerified: boolean;
  isVeriflyVerified?: boolean;
  parentEmail: string;
  onUpdateEmail: (email: string) => void;
  currentPOV: POV;
  user: {
    avatarUrl: string;
    username: string;
    handle: string;
    age: number;
    about: string;
  };
}

/* ─── Component ─── */
const Dashboard: React.FC<DashboardProps> = ({
  onVerifyClick,
  isVerified,
  isVeriflyVerified,
  parentEmail,
  onUpdateEmail,
  currentPOV,
  user,
}) => {
  const [tempEmail, setTempEmail] = useState(parentEmail);
  const [isSaved, setIsSaved] = useState(!!parentEmail);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<string | null>(null);
  const [logMessages, setLogMessages] = useState<string[]>([]);

  const isPredator = currentPOV === 'predator';
  const connections = isPredator ? PREDATOR_FRIENDS : VICTIM_FRIENDS;

  const addLog = (msg: string) =>
    setLogMessages((prev) => [...prev.slice(-4), msg]);

  /* ─── Email Actions ─── */
  const handleSaveEmail = () => {
    if (!tempEmail.trim()) return;
    onUpdateEmail(tempEmail);
    setIsSaved(true);
  };

  const handleSendTestEmail = async () => {
    if (!parentEmail || isDispatching) return;

    setIsDispatching(true);
    setDispatchResult(null);
    setLogMessages(['> INITIALIZING RESEND GATEWAY...']);

    try {
      addLog('> AUTHENTICATING SECURE HANDSHAKE...');
      await new Promise((resolve) => setTimeout(resolve, 800));

      addLog(`> DISPATCHING FORENSIC TEST TO ${parentEmail}...`);

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer re_NPhs9b28_G4DbqA9Scos6vqQ1mMGkSeDp`,
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: parentEmail,
          subject: `Security Alert Test - @${user.username}`,
          html: `
            <div style="font-family:sans-serif;padding:20px;color:#333">
              <h1 style="color:#E2231A">RBLX Safety Gateway</h1>
              <p>This is a <strong>test email</strong> to confirm your email is successfully linked to @${user.username}'s account.</p>
              <p>In the event of suspicious activity, a full forensic transcript will be sent to this address.</p>
              <hr />
              <p style="font-size:12px;color:#777">System Status: ACTIVE | Monitoring: ENABLED</p>
            </div>`,
        }),
      });

      if (response.ok) {
        addLog('> SUCCESS: DISPATCH CONFIRMED BY RESEND.');
        setDispatchResult('Sent!');
      } else {
        addLog('> ERROR: GATEWAY_REJECTED');
        setDispatchResult('Dispatch Failed');
      }

      setTimeout(() => {
        setDispatchResult(null);
        setIsDispatching(false);
      }, 5000);
    } catch {
      addLog('> CRITICAL: NETWORK FAILURE');
      setDispatchResult('Network Error');
      setIsDispatching(false);
    }
  };

  /* ─── Verification Badge ─── */
  const renderVerificationBadge = () => {
    if (!isVerified && !isPredator) {
      return (
        <div
          onClick={onVerifyClick}
          className="flex items-center space-x-1 bg-[#E2231A]/10 border border-[#E2231A]/30 text-[#E2231A] text-[10px] px-2 py-0.5 rounded-full font-bold cursor-pointer hover:bg-[#E2231A]/20 transition-colors"
        >
          <ShieldAlert size={12} />
          <span>Unverified Account</span>
        </div>
      );
    }

    const ageLabel = user.age >= 17 ? 'Verified 17+' : 'Verified Under 18';

    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
          <ShieldCheck size={12} />
          <span>{ageLabel}</span>
        </div>
        {isVeriflyVerified && (
          <div className="flex items-center space-x-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-[10px] px-2 py-0.5 rounded-full font-bold animate-in zoom-in-50">
            <Award size={12} />
            <span>Verified by Verifly</span>
          </div>
        )}
      </div>
    );
  };

  /* ─── Render ─── */
  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
      {/* ── Profile Header ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 space-y-6 md:space-y-0">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="h-28 w-28 md:h-32 md:w-32 rounded-full overflow-hidden bg-[#191919] border-4 border-[#191919] ring-1 ring-white/10 shadow-2xl">
              <img
                src={user.avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-2 right-2 h-5 w-5 bg-green-500 rounded-full border-4 border-[#000000]" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {user.username}
              </h1>
              {renderVerificationBadge()}
            </div>
            <p className="text-sm text-gray-400 font-medium">{user.handle}</p>
            <div className="flex space-x-4 mt-3 text-[13px] font-semibold text-gray-300">
              <div className="hover:text-white cursor-pointer">
                <span className="text-white">{connections.length}</span>{' '}
                Connections
              </div>
              <div className="hover:text-white cursor-pointer">
                <span className="text-white">
                  {isPredator ? '54.2k' : '1.2k'}
                </span>{' '}
                Followers
              </div>
              <div className="hover:text-white cursor-pointer">
                <span className="text-white">
                  {isPredator ? '128' : '56'}
                </span>{' '}
                Following
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {currentPOV === 'victim' ? (
            <button className="bg-[#232527] hover:bg-[#333] text-sm font-bold px-6 py-2 rounded-md transition-colors shadow-sm">
              Chat
            </button>
          ) : (
            <button className="bg-[#00A2FF] hover:bg-[#0081cc] text-sm font-bold px-6 py-2 rounded-md transition-colors shadow-sm text-white">
              Edit Profile
            </button>
          )}
          <button className="bg-[#232527] p-2 rounded-md hover:bg-[#333] transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* ── Parental Email Gateway (Victim only) ── */}
      {currentPOV === 'victim' && (
        <div className="mb-8">
          <div className="roblox-card p-6 border-l-4 border-l-[#E2231A] shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Mail className="text-[#E2231A]" size={24} />
                <h2 className="text-xl font-bold">
                  Parental Email Security Gateway
                </h2>
              </div>
              {isSaved && (
                <div className="flex items-center space-x-1 text-green-500 text-[10px] font-bold uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded animate-in fade-in zoom-in-95">
                  <CheckCircle size={12} />
                  <span>Email Monitoring Active</span>
                </div>
              )}
            </div>

            <p className="text-gray-400 text-sm mb-6 max-w-2xl leading-relaxed">
              Connect your email to receive{' '}
              <strong>detailed forensic alerts via Resend</strong> if our safety
              engine detects predatory patterns.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-500" />
                </div>
                <input
                  type="email"
                  placeholder="parent@example.com"
                  value={tempEmail}
                  onChange={(e) => {
                    setTempEmail(e.target.value);
                    setIsSaved(false);
                  }}
                  className="w-full bg-[#111213] border border-gray-700 rounded-md py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#E2231A] transition-colors text-white"
                />
              </div>

              <div className="flex w-full sm:w-auto gap-2">
                <button
                  onClick={handleSaveEmail}
                  className={`flex-1 sm:flex-none px-6 py-3 rounded-md font-bold text-sm transition-all shadow-lg ${
                    isSaved
                      ? 'bg-green-600 text-white cursor-default'
                      : 'bg-[#E2231A] hover:bg-[#c11e16] text-white active:scale-95'
                  }`}
                >
                  {isSaved ? 'Email Linked' : 'Enable Email Alerts'}
                </button>

                {isSaved && (
                  <button
                    onClick={handleSendTestEmail}
                    disabled={isDispatching}
                    className="flex-1 sm:flex-none px-6 py-3 bg-[#232527] hover:bg-[#333] text-white rounded-md font-bold text-sm transition-all flex items-center justify-center gap-2 border border-white/5 disabled:opacity-50 animate-in slide-in-from-left-2"
                  >
                    {isDispatching ? (
                      <RefreshCw className="animate-spin" size={16} />
                    ) : (
                      <Send
                        size={16}
                        className={
                          dispatchResult === 'Sent!' ? 'text-green-500' : ''
                        }
                      />
                    )}
                    <span>{dispatchResult || 'Send Test Email'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Dispatch Log */}
            {isDispatching && (
              <div className="mt-4 bg-black/40 p-3 rounded border border-white/5 font-mono text-[10px] text-gray-500">
                {logMessages.map((log, i) => (
                  <div
                    key={i}
                    className={
                      log.includes('ERROR')
                        ? 'text-red-500'
                        : log.includes('SUCCESS')
                          ? 'text-green-500'
                          : ''
                    }
                  >
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="border-b border-white/10 mb-6 flex items-center justify-center md:justify-start space-x-12 px-2">
        <button className="pb-3 border-b-2 border-white font-bold text-sm">
          About
        </button>
        <button className="pb-3 text-gray-500 hover:text-white transition-colors font-bold text-sm">
          Creations
        </button>
      </div>

      {/* ── Content ── */}
      <div className="space-y-8">
        {/* About */}
        <div className="roblox-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">About</h2>
            <div className="flex space-x-2">
              <Youtube className="text-[#FF0000] cursor-pointer" size={20} />
              <Twitch className="text-[#9146FF] cursor-pointer" size={20} />
            </div>
          </div>
          <div className="text-left py-2 text-gray-300 font-medium leading-relaxed italic">
            {user.about}
          </div>
        </div>

        {/* Connections */}
        <div className="roblox-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              Connections ({connections.length})
            </h2>
            <button className="text-sm font-bold hover:underline flex items-center">
              See All <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-y-8 gap-x-4">
            {connections.map((conn) => (
              <div
                key={conn.id}
                className="flex flex-col items-center space-y-2 group cursor-pointer"
              >
                <div className="relative">
                  <div className="h-14 w-14 rounded-full overflow-hidden bg-[#2a2a2a] border border-white/10 group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={conn.avatarUrl}
                      alt={conn.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {conn.status === 'online' && (
                    <div className="absolute bottom-0 right-0 h-4 w-4 bg-[#00A2FF] rounded-full border-2 border-[#191919] flex items-center justify-center">
                      <UserCheck size={8} className="text-white" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-bold text-gray-400 text-center truncate w-full group-hover:text-white transition-colors">
                  {conn.username}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
