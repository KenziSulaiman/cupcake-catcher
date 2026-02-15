import { useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, Flag, Ban, Eye, Clock, TrendingUp, Users, ChevronRight, CheckCircle, XCircle, Bell, Lock, Unlock, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSafety } from '../context/SafetyContext';
import { CATEGORY_LABELS } from '../utils/groomerDetection';

const RISK_COLORS = {
  low: { bg: 'bg-success/10', border: 'border-success/20', text: 'text-success', label: 'Low Risk' },
  medium: { bg: 'bg-warning/10', border: 'border-warning/20', text: 'text-warning', label: 'Medium Risk' },
  high: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', label: 'High Risk' },
  critical: { bg: 'bg-danger/10', border: 'border-danger/20', text: 'text-danger', label: 'Critical' },
};

const MOCK_THREAT_LOG = [
  { id: 1, type: 'grooming_detected', user: 'SpeedRunner01', category: 'age_probing', severity: 'medium', time: '2 hours ago', action: 'Flagged for review' },
  { id: 2, type: 'profanity_blocked', user: 'Unknown_X99', category: 'profanity', severity: 'low', time: '5 hours ago', action: 'Message filtered' },
  { id: 3, type: 'grooming_detected', user: 'CoolDude42', category: 'off_platform', severity: 'high', time: '1 day ago', action: 'Shadow restricted' },
  { id: 4, type: 'report_filed', user: 'SusAccount88', category: 'secrecy', severity: 'critical', time: '2 days ago', action: 'Account banned' },
  { id: 5, type: 'link_blocked', user: 'Gamer_Pro_1', category: 'off_platform', severity: 'medium', time: '3 days ago', action: 'Link stripped' },
];

const SEVERITY_ICONS = {
  low: <CheckCircle className="w-4 h-4 text-success" />,
  medium: <AlertTriangle className="w-4 h-4 text-warning" />,
  high: <ShieldAlert className="w-4 h-4 text-orange-400" />,
  critical: <XCircle className="w-4 h-4 text-danger" />,
};

export default function Safety() {
  const { user, isApproved, updateSafetySettings } = useAuth();
  const { flaggedMessages, reports, blockedUsers, alerts, dismissAlert } = useSafety();
  const [activeTab, setActiveTab] = useState('overview');

  const settings = user?.safetySettings || {};

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'threats', label: 'Threat Log', icon: ShieldAlert },
    { id: 'settings', label: 'Settings', icon: Lock },
  ];

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold gradient-brand-text mb-1">Safety Center</h1>
          <p className="text-sm text-text-muted">Your safety dashboard — monitor threats and manage settings</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isApproved ? 'bg-success/10 border border-success/20' : 'bg-warning/10 border border-warning/20'}`}>
          {isApproved ? <ShieldCheck className="w-4 h-4 text-success" /> : <AlertTriangle className="w-4 h-4 text-warning" />}
          <span className={`text-xs font-bold ${isApproved ? 'text-success' : 'text-warning'}`}>
            {isApproved ? 'Protected' : 'Locked Mode'}
          </span>
        </div>
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {alerts.map(alert => (
            <div key={alert.id} className="rounded-2xl bg-danger/10 border border-danger/20 p-4 flex items-start gap-3 animate-slide-up">
              <ShieldAlert className="w-5 h-5 text-danger shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-bold text-danger mb-0.5">{alert.message}</p>
                <p className="text-xs text-text-muted">{new Date(alert.timestamp).toLocaleString()}</p>
              </div>
              <button onClick={() => dismissAlert(alert.id)} className="p-1 text-text-muted hover:text-danger transition-colors" aria-label="Dismiss">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-2xl bg-surface-card border border-border-glow w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'gradient-brand text-white glow-magenta'
                : 'text-text-secondary hover:bg-surface-hover'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Threats Blocked', value: '12', icon: ShieldAlert, color: 'text-danger', bg: 'bg-danger/10', trend: '+3 this week' },
              { label: 'Messages Scanned', value: '847', icon: Eye, color: 'text-violet', bg: 'bg-violet/10', trend: '100% coverage' },
              { label: 'Reports Filed', value: reports.length.toString(), icon: Flag, color: 'text-warning', bg: 'bg-warning/10', trend: 'All reviewed' },
              { label: 'Users Blocked', value: blockedUsers.length.toString(), icon: Ban, color: 'text-text-muted', bg: 'bg-surface-light', trend: 'Lifetime' },
            ].map(stat => (
              <div key={stat.label} className="glass-strong rounded-2xl p-5">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-extrabold text-text-primary mb-0.5">{stat.value}</p>
                <p className="text-xs text-text-muted mb-1">{stat.label}</p>
                <p className="text-[10px] text-text-muted">{stat.trend}</p>
              </div>
            ))}
          </div>

          {/* Safety Score */}
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-success" /> Your Safety Score
            </h3>
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-light" />
                  <circle
                    cx="50" cy="50" r="42" fill="none" stroke="url(#gradient)" strokeWidth="8"
                    strokeDasharray={`${92 * 2.64} ${100 * 2.64}`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#D24C8F" />
                      <stop offset="100%" stopColor="#4ade80" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-extrabold text-success">92</span>
                  <span className="text-[10px] text-text-muted">/ 100</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-success mb-2">Excellent Protection</p>
                <div className="space-y-2">
                  {[
                    { label: 'Parent Approved', status: isApproved, desc: 'Account verified by parent' },
                    { label: 'Friends-Only Chat', status: settings.friendsOnlyMessaging, desc: 'Only friends can message you' },
                    { label: 'Links Disabled', status: settings.linkSharingDisabled, desc: 'No external links allowed' },
                    { label: 'Profanity Filter', status: true, desc: 'All messages are filtered' },
                    { label: 'Grooming Detection', status: true, desc: 'AI-powered pattern detection' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-2">
                      {item.status ? (
                        <CheckCircle className="w-4 h-4 text-success shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-danger shrink-0" />
                      )}
                      <span className="text-xs text-text-secondary">{item.label}</span>
                      <span className="text-[10px] text-text-muted">— {item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Detection Categories */}
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-magenta" /> Grooming Detection Categories
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <div key={key} className="rounded-xl bg-surface-light p-3 hover:bg-surface-hover transition-colors">
                  <p className="text-xs font-semibold text-text-primary mb-1">{label}</p>
                  <p className="text-[10px] text-text-muted">
                    {key === 'age_probing' && 'Detects questions about age, grade, gender'}
                    {key === 'location_probing' && 'Detects attempts to learn location/school'}
                    {key === 'image_solicitation' && 'Detects requests for photos or selfies'}
                    {key === 'secrecy' && 'Detects attempts to isolate and keep secrets'}
                    {key === 'off_platform' && 'Detects attempts to move to other platforms'}
                    {key === 'meetup' && 'Detects attempts to arrange real-world meetings'}
                    {key === 'flattery_coercion' && 'Detects manipulative flattery patterns'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Threat Log Tab */}
      {activeTab === 'threats' && (
        <div className="animate-fade-in">
          <div className="glass-strong rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border-glow flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Clock className="w-4 h-4 text-text-muted" /> Recent Activity
              </h3>
              <span className="text-xs text-text-muted">{MOCK_THREAT_LOG.length} events</span>
            </div>
            <div className="divide-y divide-border-glow/50">
              {MOCK_THREAT_LOG.map(event => {
                const risk = RISK_COLORS[event.severity];
                return (
                  <div key={event.id} className="flex items-center gap-4 p-4 hover:bg-surface-hover transition-colors">
                    <div className={`w-10 h-10 rounded-xl ${risk.bg} border ${risk.border} flex items-center justify-center shrink-0`}>
                      {SEVERITY_ICONS[event.severity]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-text-primary">{event.user}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${risk.bg} border ${risk.border} ${risk.text}`}>
                          {risk.label}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted">
                        {CATEGORY_LABELS[event.category] || event.category} · {event.action}
                      </p>
                    </div>
                    <span className="text-[11px] text-text-muted shrink-0">{event.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Flagged Messages */}
          {flaggedMessages.length > 0 && (
            <div className="mt-6 glass-strong rounded-2xl p-5">
              <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                <Flag className="w-4 h-4 text-danger" /> Live Flagged Messages ({flaggedMessages.length})
              </h3>
              <div className="space-y-2">
                {flaggedMessages.slice(-5).map(msg => (
                  <div key={msg.id} className="rounded-xl bg-danger/5 border border-danger/15 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${RISK_COLORS[msg.riskLevel].bg} ${RISK_COLORS[msg.riskLevel].text}`}>
                        {RISK_COLORS[msg.riskLevel].label}
                      </span>
                      <span className="text-[10px] text-text-muted">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-xs text-text-secondary truncate">&quot;{msg.message}&quot;</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {msg.flags.map((flag, i) => (
                        <span key={i} className="text-[9px] px-1.5 py-0.5 rounded-full bg-surface-light text-text-muted">
                          {flag.label}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-4 animate-fade-in max-w-2xl">
          <div className="glass-strong rounded-2xl p-5">
            <h3 className="text-sm font-bold text-text-primary mb-4">Privacy & Messaging</h3>
            <div className="space-y-4">
              {[
                {
                  key: 'friendsOnlyMessaging',
                  label: 'Friends-Only Messaging',
                  desc: 'Only friends can send you messages',
                  icon: MessageCircle,
                  recommended: true,
                },
                {
                  key: 'linkSharingDisabled',
                  label: 'Block External Links',
                  desc: 'Strip all links from messages',
                  icon: Lock,
                  recommended: true,
                },
              ].map(setting => (
                <div key={setting.key} className="flex items-center justify-between p-4 rounded-xl bg-surface-light">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-violet/10 flex items-center justify-center">
                      <setting.icon className="w-4 h-4 text-violet" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-text-primary">{setting.label}</p>
                        {setting.recommended && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-success/10 text-success">Recommended</span>
                        )}
                      </div>
                      <p className="text-xs text-text-muted">{setting.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSafetySettings({ [setting.key]: !settings[setting.key] })}
                    className={`relative w-12 h-7 rounded-full transition-all ${
                      settings[setting.key] ? 'bg-success' : 'bg-surface-hover'
                    }`}
                    role="switch"
                    aria-checked={settings[setting.key]}
                    aria-label={setting.label}
                  >
                    <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all ${
                      settings[setting.key] ? 'left-6' : 'left-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quiet Hours */}
          <div className="glass-strong rounded-2xl p-5">
            <h3 className="text-sm font-bold text-text-primary mb-4">Quiet Hours</h3>
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-light mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-deep-purple/20 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-deep-purple" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Enable Quiet Hours</p>
                  <p className="text-xs text-text-muted">Silence notifications during set hours</p>
                </div>
              </div>
              <button
                onClick={() => updateSafetySettings({
                  quietHours: { ...settings.quietHours, enabled: !settings.quietHours?.enabled }
                })}
                className={`relative w-12 h-7 rounded-full transition-all ${
                  settings.quietHours?.enabled ? 'bg-success' : 'bg-surface-hover'
                }`}
                role="switch"
                aria-checked={settings.quietHours?.enabled || false}
              >
                <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all ${
                  settings.quietHours?.enabled ? 'left-6' : 'left-1'
                }`} />
              </button>
            </div>
            {settings.quietHours?.enabled && (
              <div className="flex gap-4 animate-fade-in">
                <div className="flex-1">
                  <label className="text-xs text-text-muted mb-1 block">Start</label>
                  <input
                    type="time"
                    defaultValue={settings.quietHours?.start || '22:00'}
                    className="w-full px-3 py-2 rounded-lg bg-surface text-text-primary border border-border-glow text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-text-muted mb-1 block">End</label>
                  <input
                    type="time"
                    defaultValue={settings.quietHours?.end || '07:00'}
                    className="w-full px-3 py-2 rounded-lg bg-surface text-text-primary border border-border-glow text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Always-on protections */}
          <div className="glass-strong rounded-2xl p-5">
            <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-success" /> Always-On Protections
            </h3>
            <p className="text-xs text-text-muted mb-3">These protections cannot be disabled.</p>
            <div className="space-y-2">
              {[
                'Profanity filtering (all messages)',
                'Grooming pattern detection (AI-powered)',
                'Age-band matching enforcement',
                'External link blocking',
                'Friend request rate limiting',
                'Real-time risk scoring',
                'Auto device banning for severe violations',
              ].map(item => (
                <div key={item} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-light">
                  <ShieldCheck className="w-3.5 h-3.5 text-success shrink-0" />
                  <span className="text-xs text-text-secondary">{item}</span>
                  <Lock className="w-3 h-3 text-text-muted ml-auto shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
