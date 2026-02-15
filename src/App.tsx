import React, { useState } from 'react';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import ChatInterface from './components/Chat/ChatInterface';
import MessagesView from './components/Chat/MessagesView';
import VerificationGateway from './components/Verification/VerificationGateway';
import AgeGapAnalyzer from './components/Safety/AgeGapAnalyzer';
import SuspensionOverlay from './components/Safety/SuspensionOverlay';
import LoginPage from './components/Auth/LoginPage';
import { SecurityReport, POV, Message } from './types';
import { PERSONAS, INITIAL_MESSAGES } from './constants';
import { GoogleGenAI, Type } from '@google/genai';

/* ─── View Type ─── */
type View = 'profile' | 'verification' | 'analyzer' | 'messages';

/* ─── Harmful-keyword heuristic ─── */
const HARMFUL_TERMS = [
  'free robux',
  'where do you live',
  'parents',
  'whatsapp',
  'snapchat',
  'discord',
  'send pics',
  'cam',
  'alone',
  "don't tell",
];

const containsHarmfulKeyword = (text: string): boolean => {
  const lower = text.toLowerCase();
  return HARMFUL_TERMS.some((term) => lower.includes(term));
};

/* ─── App ─── */
const App: React.FC = () => {
  /* Auth */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPOV, setCurrentPOV] = useState<POV>('victim');

  /* Layout */
  const [isSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<View>('profile');

  /* Verification */
  const [isVerified, setIsVerified] = useState(false);
  const [isVeriflyVerified, setIsVeriflyVerified] = useState(false);

  /* Suspension */
  const [isSuspended, setIsSuspended] = useState(false);
  const [suspensionEndTime, setSuspensionEndTime] = useState<number | null>(
    null,
  );

  /* Safety */
  const [securityReports, setSecurityReports] = useState<SecurityReport[]>([]);
  const [parentEmail, setParentEmail] = useState('');

  /* Chat */
  const [chatMessages, setChatMessages] =
    useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState<string | null>(null);

  /* Derived */
  const isPredator = currentPOV === 'predator';
  const activePersona = isPredator ? PERSONAS.predator : PERSONAS.victim;

  /* ─── Navigation ─── */
  const navigateTo = (view: View) => setCurrentView(view);

  /* ─── Auth ─── */
  const handleLogin = (selectedPOV: POV) => {
    setCurrentPOV(selectedPOV);
    setIsLoggedIn(true);
    navigateTo('profile');
  };

  /* ─── Verification ─── */
  const handleVerificationSuccess = () => {
    setIsVerified(true);
    setIsVeriflyVerified(true);
  };

  /* ─── Reports ─── */
  const addSecurityReport = (report: SecurityReport) => {
    setSecurityReports((prev) => [report, ...prev]);
  };

  /* ─── Suspension ─── */
  const triggerSuspension = (reason: string, text: string) => {
    setIsSuspended(true);
    setSuspensionEndTime(Date.now() + 24 * 60 * 60 * 1000);
    addSecurityReport({
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      targetUser: PERSONAS.victim.username,
      messageContent: text,
      severity: 'Critical',
      status: 'Account Suspended',
      reason,
    });
  };

  const handleRetakePass = () => {
    setIsSuspended(false);
    setSuspensionEndTime(null);
    setIsVeriflyVerified(true);
    navigateTo('profile');
  };

  /* ─── POV Toggle ─── */
  const togglePOV = () => {
    setCurrentPOV((prev) => (prev === 'victim' ? 'predator' : 'victim'));
    navigateTo('profile');
  };

  /* ─── Send Message ─── */
  const handleSendMessage = async (targetFriendId: string, text: string) => {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: activePersona.id,
      text,
      timestamp,
      isMe: true,
    };

    setChatMessages((prev) => {
      let key = targetFriendId;
      if (
        (targetFriendId === 'me' && activePersona.id === 'c1') ||
        (targetFriendId === 'c1' && activePersona.id === 'me')
      ) {
        key = 'c1';
      }
      return { ...prev, [key]: [...(prev[key] || []), newMessage] };
    });

    // Simulate other user typing
    if (Math.random() > 0.5) {
      setOtherUserTyping(targetFriendId);
      setTimeout(() => setOtherUserTyping(null), 3000);
    }

    // Predator-side AI analysis
    if (isPredator) {
      setIsAnalyzing(true);

      if (containsHarmfulKeyword(text)) {
        triggerSuspension(
          'Immediate heuristic violation: Harmful keywords detected.',
          text,
        );
        setIsAnalyzing(false);
        return;
      }

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Analyze this message sent by an adult to a 12-year-old child in a gaming environment. Is it grooming, predatory, or a severe safety violation?\nMessage: "${text}"`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                isPredatory: { type: Type.BOOLEAN },
                reason: { type: Type.STRING },
              },
              required: ['isPredatory', 'reason'],
            },
          },
        });

        const result = JSON.parse(response.text || '{}');
        if (result.isPredatory) {
          triggerSuspension(result.reason, text);
        }
      } catch (e) {
        console.error('AI Analysis failed', e);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  /* ─── Pre-auth: Login Page ─── */
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  /* ─── Main App ─── */
  return (
    <div
      className={`min-h-screen ${
        isPredator ? 'bg-black/40' : 'bg-transparent'
      } text-white flex flex-col font-['Poppins']`}
    >
      {/* Suspension Overlay */}
      {isSuspended && isPredator && (
        <SuspensionOverlay
          endTime={suspensionEndTime!}
          onPass={handleRetakePass}
        />
      )}

      {/* Navbar */}
      <Navbar
        onHomeClick={() => navigateTo('profile')}
        currentPOV={currentPOV}
        onTogglePOV={togglePOV}
        user={activePersona}
      />

      {/* Body */}
      <div className="flex flex-1 pt-[60px]">
        <Sidebar
          isOpen={isSidebarOpen}
          onProfileClick={() => navigateTo('profile')}
          onSafetyClick={() => navigateTo('analyzer')}
          onMessagesClick={() => navigateTo('messages')}
          activeView={currentView}
          user={activePersona}
          currentPOV={currentPOV}
        />

        <main
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? 'ml-0 md:ml-48' : 'ml-0'
          }`}
        >
          <div
            className={
              currentView === 'messages'
                ? 'w-full h-[calc(100vh-60px)]'
                : 'max-w-4xl mx-auto p-4 md:py-8 md:px-6'
            }
          >
            {/* Profile / Dashboard */}
            {currentView === 'profile' && (
              <Dashboard
                onVerifyClick={() => navigateTo('verification')}
                isVerified={isPredator ? true : isVerified}
                isVeriflyVerified={isPredator ? isVeriflyVerified : false}
                parentEmail={parentEmail}
                onUpdateEmail={setParentEmail}
                currentPOV={currentPOV}
                user={activePersona}
              />
            )}

            {/* Verification */}
            {currentView === 'verification' && (
              <VerificationGateway
                onBack={() => navigateTo('profile')}
                onSuccess={handleVerificationSuccess}
              />
            )}

            {/* Safety Analyzer */}
            {currentView === 'analyzer' && (
              <AgeGapAnalyzer
                onBack={() => navigateTo('profile')}
                reports={securityReports}
                chatMessages={chatMessages}
              />
            )}

            {/* Full Messages View */}
            {currentView === 'messages' && (
              <MessagesView
                currentPOV={currentPOV}
                onVerifyPrompt={() => navigateTo('verification')}
                isVerified={isPredator ? true : isVerified}
                isVeriflyVerified={isPredator ? isVeriflyVerified : false}
                chatMessages={chatMessages}
                onSendMessage={handleSendMessage}
                otherUserTyping={otherUserTyping}
              />
            )}
          </div>
        </main>
      </div>

      {/* Floating Chat (hidden on messages view) */}
      {currentView !== 'messages' && (
        <ChatInterface
          isVerified={isPredator ? true : isVerified}
          onVerifyPrompt={() => navigateTo('verification')}
          onSecurityAlert={addSecurityReport}
          parentEmail={parentEmail}
          currentPOV={currentPOV}
          chatMessages={chatMessages}
          onSendMessage={handleSendMessage}
          otherUserTyping={otherUserTyping}
        />
      )}

      {/* AI Scan Indicator */}
      {isAnalyzing && (
        <div className="fixed top-20 right-8 bg-red-600 px-4 py-2 rounded-lg font-bold text-[10px] animate-pulse z-[200] border border-white/20 shadow-2xl flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          <span>RBLX SAFETY SCAN IN PROGRESS...</span>
        </div>
      )}
    </div>
  );
};

export default App;
