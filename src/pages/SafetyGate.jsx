import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Heart, CheckCircle, Send, ArrowRight, PartyPopper } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const STEPS = [
  { id: 'welcome', title: 'Welcome to Rblx!', subtitle: 'Let\'s make sure you\'re safe' },
  { id: 'explain', title: 'Why This Matters', subtitle: 'Safety is our #1 priority' },
  { id: 'parent_email', title: 'Parent Approval', subtitle: 'A parent needs to unlock chat' },
  { id: 'sent', title: 'Request Sent!', subtitle: 'You\'re almost there' },
];

export default function SafetyGate() {
  const [step, setStep] = useState(0);
  const [parentEmail, setParentEmail] = useState('');
  const [simulating, setSimulating] = useState(false);
  const { approveParent, isApproved } = useAuth();
  const navigate = useNavigate();

  if (isApproved) {
    navigate('/');
    return null;
  }

  const handleSendRequest = () => {
    if (!parentEmail) return;
    setStep(3);
  };

  const handleSimulateApproval = () => {
    setSimulating(true);
    setTimeout(() => {
      approveParent();
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-surface">
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-violet/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-magenta/8 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-lg animate-slide-up">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full transition-all duration-500 ${
                i <= step ? 'gradient-brand glow-magenta scale-110' : 'bg-surface-light'
              }`} />
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-0.5 transition-all duration-500 ${
                  i < step ? 'bg-magenta' : 'bg-surface-light'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="glass-strong rounded-3xl p-8 glow-violet">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 rounded-3xl gradient-brand glow-magenta flex items-center justify-center mx-auto mb-6 animate-float">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-3">{STEPS[0].title}</h2>
              <p className="text-text-secondary mb-2">Your account is in <strong className="text-warning">Locked Mode</strong></p>
              <p className="text-text-muted text-sm mb-8 leading-relaxed max-w-sm mx-auto">
                To keep you safe, messaging and social features are locked until a parent or guardian approves your account.
              </p>
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-light border border-border-glow">
                  <Lock className="w-4 h-4 text-warning" />
                  <span className="text-sm text-text-secondary">Chat Locked</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-light border border-border-glow">
                  <Lock className="w-4 h-4 text-warning" />
                  <span className="text-sm text-text-secondary">Friends Locked</span>
                </div>
              </div>
              <button
                onClick={() => setStep(1)}
                className="px-8 py-3.5 rounded-xl gradient-brand text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all glow-magenta"
              >
                <span className="flex items-center gap-2">
                  Learn Why <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </div>
          )}

          {/* Step 1: Explanation */}
          {step === 1 && (
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 rounded-3xl bg-success/20 border border-success/30 flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-success" />
              </div>
              <h2 className="text-2xl font-bold mb-3">{STEPS[1].title}</h2>
              <div className="space-y-4 mb-8 text-left max-w-sm mx-auto">
                {[
                  { icon: '🛡️', title: 'No stranger DMs', desc: 'Only approved friends can message you' },
                  { icon: '👁️', title: 'Grooming detection', desc: 'AI monitors for suspicious behavior patterns' },
                  { icon: '🚫', title: 'Zero tolerance', desc: 'Predators are automatically banned' },
                  { icon: '👨‍👩‍👧', title: 'Parent controls', desc: 'Your parent chooses your safety settings' },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl bg-surface-light/50">
                    <span className="text-xl mt-0.5">{item.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                      <p className="text-xs text-text-muted">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                className="px-8 py-3.5 rounded-xl gradient-brand text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all glow-magenta"
              >
                <span className="flex items-center gap-2">
                  Set Up Safety <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </div>
          )}

          {/* Step 2: Parent Email */}
          {step === 2 && (
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 rounded-3xl bg-sky-accent/20 border border-sky-accent/30 flex items-center justify-center mx-auto mb-6">
                <Send className="w-10 h-10 text-sky-accent" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{STEPS[2].title}</h2>
              <p className="text-text-secondary text-sm mb-6">
                A parent needs to unlock chat to keep you safe.
              </p>
              <div className="max-w-sm mx-auto">
                <label htmlFor="parentEmail" className="block text-sm font-medium text-text-secondary mb-1.5 text-left">
                  Parent&apos;s Email Address
                </label>
                <input
                  id="parentEmail"
                  type="email"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  placeholder="parent@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-surface-light border border-border-glow text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-violet transition-all mb-4"
                />
                <p className="text-[11px] text-text-muted mb-6 text-left">
                  We&apos;ll send them a simple approval link. They can set your safety preferences.
                </p>
                <button
                  onClick={handleSendRequest}
                  disabled={!parentEmail}
                  className="w-full py-3.5 rounded-xl gradient-brand text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 glow-magenta"
                >
                  Send Approval Request
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Sent */}
          {step === 3 && (
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 rounded-3xl bg-success/20 border border-success/30 flex items-center justify-center mx-auto mb-6 animate-float">
                <CheckCircle className="w-10 h-10 text-success" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{STEPS[3].title}</h2>
              <p className="text-text-secondary text-sm mb-2">
                We sent an approval request to
              </p>
              <p className="text-magenta font-semibold text-sm mb-6">{parentEmail}</p>
              <p className="text-text-muted text-xs mb-8 max-w-sm mx-auto leading-relaxed">
                While you wait, you can browse and discover experiences. Chat and friends will unlock once your parent approves.
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleSimulateApproval}
                  disabled={simulating}
                  className="w-full py-3.5 rounded-xl gradient-brand text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all glow-magenta disabled:opacity-70"
                >
                  {simulating ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Approving...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <PartyPopper className="w-4 h-4" />
                      Simulate Parent Approval (Demo)
                    </span>
                  )}
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-3 rounded-xl bg-surface-light border border-border-glow text-text-secondary font-medium text-sm hover:bg-surface-hover transition-all"
                >
                  Browse in Locked Mode
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
