import { useState } from 'react';
import {
  Shield, ShieldAlert, ShieldCheck, Bell, Clock, Users, Ban,
  Flag, Eye, EyeOff, MessageCircle, Link2, Volume2, VolumeX,
  AlertTriangle, CheckCircle, Settings, ChevronRight, ToggleLeft, ToggleRight,
  Lock, Unlock, RefreshCw, XCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSafety } from '../context/SafetyContext';

const MODERATION_PIPELINE = [
  { step: 1, label: 'Message Sent', desc: 'User submits text/media', icon: MessageCircle, color: 'text-text-secondary' },
  { step: 2, label: 'Profanity Filter', desc: 'Server-side ##### replacement', icon: ShieldCheck, color: 'text-violet' },
  { step: 3, label: 'Grooming Detection', desc: 'Pattern + risk scoring', icon: ShieldAlert, color: 'text-warning' },
  { step: 4, label: 'Link/Phone Check', desc: 'Block external contact attempts', icon: Link2, color: 'text-sky-accent' },
  { step: 5, label: 'Risk Escalation', desc: 'Auto-restrict or mod review', icon: AlertTriangle, color: 'text-danger' },
  { step: 6, label: 'Delivered or Blocked', desc: 'Safe messages pass through', icon: CheckCircle, color: 'text-success' },
];

const ACCOUNT_STATE_TABLE = [
  { state: 'Created', next: 'Locked', trigger: 'Signup complete', color: 'bg-text-muted' },
  { state: 'Locked', next: 'ParentApproved', trigger: 'Parent clicks approval link', color: 'bg-warning' },
  { state: 'ParentApproved', next: 'Trusted', trigger: 'Clean history + time threshold', color: 'bg-success' },
  { state: 'Any', next: 'Restricted', trigger: 'Moderate policy violation', color: 'bg-danger' },
  { state: 'Any', next: 'Suspended', trigger: 'Severe / repeat violation', color: 'bg-danger' },
];

function ToggleSwitch({ enabled, onToggle, label, description, locked }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-surface-light hover:bg-surface-hover transition-colors">
      <div className="flex-1 mr-4">
        <p className="text-sm font-semibold text-text-primary flex items-center gap-2">
          {label}
          {locked && <Lock className="w-3 h-3 text-text-muted" />}
        </p>
        <p className="text-xs text-text-muted mt-0.5">{description}</p>
      </div>
      <button
        onClick={locked ? undefined : onToggle}
        className={`shrink-0 transition-colors ${locked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
        aria-label={`${label}: ${enabled ? 'enabled' : 'disabled'}`}
        aria-pressed={enabled}
        disabled={locked}
      >
        {enabled ? (
          <ToggleRight className="w-8 h-8 text-success" />
        ) : (
          <ToggleLeft className="w-8 h-8 text-text-muted" />
        )}
      </button>
    </div>
  );
}

export default function SafetyDashboard() {
  const { user, isApproved, updateSafetySettings } = useAuth();
  const { alerts, flaggedMessages, reports, blockedUsers, dismissAlert } = useSafety();

  const [settings, setSettings] = useState({
    friendsOnlyMessaging: user?.safetySettings?.friendsOnlyMessaging ?? true,
    messagingDisabled: false,
    linkSharingDisabled: user?.safetySettings?.linkSharingDisabled ?? true,
    quietHoursEnabled: user?.safetySettings?.quietHours?.enabled ?? false,
    quietHoursStart: user?.safetySettings?.quietHours?.start ?? '22:00',
    quietHoursEnd: user?.safetySettings?.quietHours?.end ?? '07:00',
    reportNotifications: true,
    voiceDisabled: true,
    imageUploadDisabled: true,
  });

  const toggleSetting = (key) => {
    setSettings(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      updateSafetySettings(updated);
      return updated;
    });
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold gradient-brand-text">Safety Dashboard</h1>
          <p className="text-sm text-text-muted mt-1">Monitor, configure, and protect your account</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
            isApproved
              ? 'bg-success/10 border border-success/20 text-success'
              : 'bg-warning/10 border border-warning/20 text-warning'
          }`}>
            {isApproved ? <ShieldCheck className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            {isApproved ? 'Parent Approved' : 'Locked'}
          </span>
        </div>
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {alerts.map(alert => (
            <div key={alert.id} className={`rounded-2xl p-4 flex items-start gap-3 animate-slide-up ${
              alert.type === 'critical'
                ? 'bg-danger/10 border border-danger/20 glow-danger'
                : 'bg-warning/10 border border-warning/20'
            }`}>
              <ShieldAlert className={`w-5 h-5 shrink-0 mt-0.5 ${
                alert.type === 'critical' ? 'text-danger' : 'text-warning'
              }`} />
              <div className="flex-1">
                <p className={`text-sm font-bold ${alert.type === 'critical' ? 'text-danger' : 'text-warning'}`}>
                  {alert.type === 'critical' ? 'Critical Alert' : 'Warning'}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">{alert.message}</p>
                <p className="text-[10px] text-text-muted mt-1">{new Date(alert.timestamp).toLocaleString()}</p>
              </div>
              <button
                onClick={() => dismissAlert(alert.id)}
                className="text-text-muted hover:text-text-secondary transition-colors"
                aria-label="Dismiss alert"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Flagged Messages', value: flaggedMessages.length, icon: ShieldAlert, color: 'text-warning', bg: 'bg-warning/10' },
          { label: 'Reports Filed', value: reports.length, icon: Flag, color: 'text-danger', bg: 'bg-danger/10' },
          { label: 'Blocked Users', value: blockedUsers.length, icon: Ban, color: 'text-text-muted', bg: 'bg-surface-light' },
          { label: 'Active Alerts', value: alerts.length, icon: Bell, color: 'text-magenta', bg: 'bg-magenta/10' },
        ].map(stat => (
          <div key={stat.label} className="glass-strong rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-text-primary">{stat.value}</p>
            <p className="text-xs text-text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Safety Settings (Parent-Controlled) */}
        <div className="glass-strong rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-violet" />
            <h2 className="text-sm font-bold text-text-primary">Safety Settings</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet/10 text-violet font-bold ml-auto">Parent Controlled</span>
          </div>
          <p className="text-xs text-text-muted mb-4">Defaults are strict. Parents can adjust via their dashboard.</p>

          <div className="space-y-2">
            <ToggleSwitch
              enabled={settings.friendsOnlyMessaging}
              onToggle={() => toggleSetting('friendsOnlyMessaging')}
              label="Friends-only messaging"
              description="Only approved friends can send you messages (default ON)"
              locked={true}
            />
            <ToggleSwitch
              enabled={settings.messagingDisabled}
              onToggle={() => toggleSetting('messagingDisabled')}
              label="Disable messaging entirely"
              description="No one can message this account"
            />
            <ToggleSwitch
              enabled={settings.linkSharingDisabled}
              onToggle={() => toggleSetting('linkSharingDisabled')}
              label="Block external links"
              description="All links in messages are stripped and blocked"
              locked={true}
            />
            <ToggleSwitch
              enabled={settings.voiceDisabled}
              onToggle={() => toggleSetting('voiceDisabled')}
              label="Voice chat disabled"
              description="No voice communication in experiences"
            />
            <ToggleSwitch
              enabled={settings.imageUploadDisabled}
              onToggle={() => toggleSetting('imageUploadDisabled')}
              label="Image uploads disabled"
              description="Prevent sharing photos in chat"
            />
            <ToggleSwitch
              enabled={settings.reportNotifications}
              onToggle={() => toggleSetting('reportNotifications')}
              label="Report notifications to parent"
              description="Parent receives email when a report is filed"
            />
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="space-y-6">
          <div className="glass-strong rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-sky-accent" />
              <h2 className="text-sm font-bold text-text-primary">Quiet Hours</h2>
            </div>
            <ToggleSwitch
              enabled={settings.quietHoursEnabled}
              onToggle={() => toggleSetting('quietHoursEnabled')}
              label="Enable quiet hours"
              description="Automatically disable notifications and messaging during set times"
            />
            {settings.quietHoursEnabled && (
              <div className="mt-3 grid grid-cols-2 gap-3 animate-fade-in">
                <div>
                  <label className="block text-xs text-text-muted mb-1">Start</label>
                  <input
                    type="time"
                    value={settings.quietHoursStart}
                    onChange={(e) => setSettings(prev => ({ ...prev, quietHoursStart: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-surface-light border border-border-glow text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-violet"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1">End</label>
                  <input
                    type="time"
                    value={settings.quietHoursEnd}
                    onChange={(e) => setSettings(prev => ({ ...prev, quietHoursEnd: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-surface-light border border-border-glow text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-violet"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Account State Machine */}
          <div className="glass-strong rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <RefreshCw className="w-5 h-5 text-magenta" />
              <h2 className="text-sm font-bold text-text-primary">Account State Machine</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs" role="table">
                <thead>
                  <tr className="text-left text-text-muted border-b border-border-glow">
                    <th className="pb-2 pr-3 font-semibold">From</th>
                    <th className="pb-2 pr-3 font-semibold">To</th>
                    <th className="pb-2 font-semibold">Trigger</th>
                  </tr>
                </thead>
                <tbody>
                  {ACCOUNT_STATE_TABLE.map((row, i) => (
                    <tr key={i} className="border-b border-border-glow/30">
                      <td className="py-2.5 pr-3">
                        <span className="text-text-secondary font-medium">{row.state}</span>
                      </td>
                      <td className="py-2.5 pr-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${row.color}/15 text-[10px] font-bold`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${row.color}`} />
                          {row.next}
                        </span>
                      </td>
                      <td className="py-2.5 text-text-muted">{row.trigger}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Moderation Pipeline */}
      <div className="glass-strong rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-success" />
          <h2 className="text-sm font-bold text-text-primary">Moderation Pipeline</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success font-bold ml-auto">Real-time</span>
        </div>
        <p className="text-xs text-text-muted mb-5">Every message passes through this 6-step pipeline before delivery.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {MODERATION_PIPELINE.map((step, i) => (
            <div key={step.step} className="relative">
              <div className="rounded-xl bg-surface-light p-3 text-center hover:bg-surface-hover transition-colors h-full">
                <div className={`w-10 h-10 rounded-xl bg-surface-card flex items-center justify-center mx-auto mb-2`}>
                  <step.icon className={`w-5 h-5 ${step.color}`} />
                </div>
                <p className="text-[10px] font-bold text-text-primary mb-0.5">Step {step.step}</p>
                <p className="text-[10px] font-semibold text-text-secondary leading-tight">{step.label}</p>
                <p className="text-[9px] text-text-muted mt-1 leading-tight">{step.desc}</p>
              </div>
              {i < MODERATION_PIPELINE.length - 1 && (
                <ChevronRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted z-10" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Flagged Messages */}
      {flaggedMessages.length > 0 && (
        <div className="glass-strong rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-warning" />
            <h2 className="text-sm font-bold text-text-primary">Flagged Messages</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-warning/10 text-warning font-bold ml-auto">{flaggedMessages.length}</span>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin">
            {flaggedMessages.slice(-10).reverse().map(entry => (
              <div key={entry.id} className="rounded-xl bg-surface-light p-3 flex items-start gap-3">
                <ShieldAlert className={`w-4 h-4 shrink-0 mt-0.5 ${
                  entry.hasCritical ? 'text-danger' : entry.riskLevel === 'high' ? 'text-warning' : 'text-violet'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-primary truncate">&quot;{entry.message}&quot;</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {entry.flags.map((flag, i) => (
                      <span key={i} className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                        flag.severity === 'critical' ? 'bg-danger/15 text-danger' :
                        flag.severity === 'high' ? 'bg-warning/15 text-warning' :
                        'bg-violet/15 text-violet'
                      }`}>
                        {flag.label}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-text-muted mt-1">Risk: {entry.riskLevel} · Score: {entry.riskScore}</p>
                </div>
                <span className="text-[9px] text-text-muted shrink-0">{new Date(entry.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Anti-Predator System Summary */}
      <div className="glass-strong rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-success" />
          <h2 className="text-sm font-bold text-text-primary">Anti-Predator System</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success font-bold ml-auto">Zero Tolerance</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: Ban, label: 'No stranger DMs', desc: 'Only approved friends can initiate conversations. Strangers are structurally blocked.', status: 'Active' },
            { icon: Users, label: 'Age-band matching', desc: 'Large age-gap messaging attempts are automatically blocked.', status: 'Active' },
            { icon: Link2, label: 'External links blocked', desc: 'All links, phone numbers, and social handles are stripped from messages.', status: 'Active' },
            { icon: Eye, label: 'Grooming detection', desc: 'AI scans for age probing, secrecy, off-platform contact, meetup attempts, coercion.', status: 'Active' },
            { icon: AlertTriangle, label: 'Real-time risk scoring', desc: 'Each account has a cumulative risk score. High scores trigger auto-restrict.', status: 'Active' },
            { icon: Ban, label: 'Device ban (severe)', desc: 'Repeat or severe offenders receive device-level bans, not just account bans.', status: 'Ready' },
          ].map(item => (
            <div key={item.label} className="rounded-xl bg-surface-light p-3 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                <item.icon className="w-4 h-4 text-success" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xs font-bold text-text-primary">{item.label}</p>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-success/10 text-success font-bold">{item.status}</span>
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Footer */}
      <div className="rounded-2xl bg-gradient-to-br from-violet/10 to-deep-purple/10 border border-violet/15 p-5 text-center">
        <Shield className="w-8 h-8 text-success mx-auto mb-2" />
        <p className="text-sm font-bold text-text-primary mb-1">Safety is a system, not a feature.</p>
        <p className="text-xs text-text-muted max-w-lg mx-auto leading-relaxed">
          Rblx uses structural design, real-time detection, and parent-first controls to prevent predatory contact at every layer.
          If something feels wrong, use the 1-tap Report button — it&apos;s always available.
        </p>
      </div>
    </div>
  );
}
