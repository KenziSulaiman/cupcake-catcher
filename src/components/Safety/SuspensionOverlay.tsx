import React, { useState, useEffect } from 'react';
import { ShieldAlert, Lock, CheckCircle } from 'lucide-react';

interface SuspensionOverlayProps {
  endTime: number;
  onPass: () => void;
}

const SuspensionOverlay: React.FC<SuspensionOverlayProps> = ({
  endTime,
  onPass,
}) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizPassed, setQuizPassed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = endTime - Date.now();
      if (diff <= 0) {
        setTimeLeft('00:00:00');
        clearInterval(interval);
        return;
      }
      const hours = Math.floor(diff / 3_600_000);
      const minutes = Math.floor((diff % 3_600_000) / 60_000);
      const seconds = Math.floor((diff % 60_000) / 1_000);
      setTimeLeft(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const handleQuizSubmit = () => {
    if (quizAnswer === 2) {
      setQuizPassed(true);
      setTimeout(() => onPass(), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
        {/* Icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-red-600/20 rounded-full animate-ping" />
          <div className="relative w-24 h-24 bg-red-600/10 border-2 border-red-600 rounded-full flex items-center justify-center">
            <ShieldAlert className="text-red-500" size={40} />
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-red-500 mb-2">
            Account Suspended
          </h1>
          <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
            Your account has been suspended due to a severe safety violation.
            Predatory behavior toward minors is not tolerated.
          </p>
        </div>

        {/* Timer */}
        <div className="bg-red-600/5 border border-red-600/20 rounded-xl p-6">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">
            Suspension Expires In
          </p>
          <p className="text-4xl font-mono font-bold text-red-500 tracking-wider">
            {timeLeft}
          </p>
        </div>

        {/* Safety Quiz */}
        {!showQuiz ? (
          <button
            onClick={() => setShowQuiz(true)}
            className="bg-[#232527] hover:bg-[#333] text-white px-8 py-3 rounded-md font-bold text-sm transition-all flex items-center justify-center gap-2 mx-auto border border-white/5"
          >
            <Lock size={16} />
            Take Safety Quiz to Reduce Suspension
          </button>
        ) : quizPassed ? (
          <div className="bg-green-600/10 border border-green-600/20 rounded-xl p-6 animate-in zoom-in-95">
            <CheckCircle className="mx-auto text-green-500 mb-3" size={32} />
            <p className="text-green-500 font-bold">
              Quiz Passed — Suspension Lifted
            </p>
          </div>
        ) : (
          <div className="bg-[#191919] border border-white/5 rounded-xl p-6 text-left space-y-4 animate-in slide-in-from-bottom-4">
            <h3 className="font-bold text-sm">
              Which of the following is appropriate behavior on RBLX?
            </h3>
            {[
              'Asking a minor for personal photos',
              'Requesting to move conversations off-platform',
              'Playing games together and keeping conversations public',
              'Offering gifts in exchange for personal information',
            ].map((option, i) => (
              <label
                key={i}
                className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-all border ${
                  quizAnswer === i
                    ? 'border-[#E2231A] bg-[#E2231A]/5'
                    : 'border-white/5 hover:bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="quiz"
                  checked={quizAnswer === i}
                  onChange={() => setQuizAnswer(i)}
                  className="accent-[#E2231A]"
                />
                <span className="text-sm text-gray-300">{option}</span>
              </label>
            ))}
            <button
              onClick={handleQuizSubmit}
              disabled={quizAnswer === null}
              className="w-full bg-[#E2231A] hover:bg-[#c11e16] text-white py-3 rounded-md font-bold text-sm transition-all disabled:opacity-50"
            >
              Submit Answer
            </button>
            {quizAnswer !== null && quizAnswer !== 2 && (
              <p className="text-red-500 text-xs font-bold text-center animate-in fade-in">
                Incorrect. Try again.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuspensionOverlay;
