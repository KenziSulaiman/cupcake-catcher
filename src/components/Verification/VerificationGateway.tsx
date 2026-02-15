import React, { useState } from 'react';
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  Shield,
  Loader2,
} from 'lucide-react';

interface VerificationGatewayProps {
  onBack: () => void;
  onSuccess: () => void;
}

const STEPS = ['Identity Check', 'Camera Verification', 'Complete'] as const;

const VerificationGateway: React.FC<VerificationGatewayProps> = ({
  onBack,
  onSuccess,
}) => {
  const [step, setStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartVerification = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(1);
    }, 2000);
  };

  const handleCameraCapture = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(2);
    }, 3000);
  };

  const handleComplete = () => {
    onSuccess();
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/5 rounded-md transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Verifly Identity Verification</h1>
          <p className="text-sm text-gray-400">
            Verify your identity to unlock full messaging
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-10 px-4">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                  i <= step
                    ? 'bg-[#E2231A] border-[#E2231A] text-white'
                    : 'border-gray-700 text-gray-500'
                }`}
              >
                {i < step ? <CheckCircle size={18} /> : i + 1}
              </div>
              <span className="text-[10px] font-bold mt-2 text-gray-400 uppercase tracking-wider">
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-24 h-0.5 mx-4 ${
                  i < step ? 'bg-[#E2231A]' : 'bg-gray-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="roblox-card p-8">
        {step === 0 && (
          <div className="text-center space-y-6">
            <Shield className="mx-auto text-[#E2231A]" size={48} />
            <h2 className="text-xl font-bold">Identity Verification</h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
              To protect minors on our platform, we require a quick identity
              check. This uses your camera to verify you are who you say you
              are.
            </p>
            <button
              onClick={handleStartVerification}
              disabled={isProcessing}
              className="bg-[#E2231A] hover:bg-[#c11e16] text-white px-8 py-3 rounded-md font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Initializing...
                </>
              ) : (
                'Begin Verification'
              )}
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="text-center space-y-6">
            <Camera className="mx-auto text-blue-400" size={48} />
            <h2 className="text-xl font-bold">Camera Verification</h2>
            <div className="w-64 h-48 mx-auto bg-black/40 rounded-xl border-2 border-dashed border-gray-600 flex items-center justify-center">
              <p className="text-gray-500 text-xs">Camera Preview</p>
            </div>
            <button
              onClick={handleCameraCapture}
              disabled={isProcessing}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Analyzing...
                </>
              ) : (
                'Capture & Verify'
              )}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center space-y-6">
            <CheckCircle className="mx-auto text-green-500" size={48} />
            <h2 className="text-xl font-bold">Verification Complete!</h2>
            <p className="text-gray-400 text-sm">
              Your identity has been verified. You now have full messaging
              access.
            </p>
            <button
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md font-bold text-sm transition-all mx-auto"
            >
              Continue to Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationGateway;
