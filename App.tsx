
import React, { useState, useEffect } from 'react';
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
import { GoogleGenAI, Type } from "@google/genai";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<'profile' | 'verification' | 'analyzer' | 'messages'>('profile');
  const [currentPOV, setCurrentPOV] = useState<POV>('victim');
  const [isVerified, setIsVerified] = useState(false);
  const [isVeriflyVerified, setIsVeriflyVerified] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const [suspensionEndTime, setSuspensionEndTime] = useState<number | null>(null);
  const [securityReports, setSecurityReports] = useState<SecurityReport[]>([]);
  const [parentEmail, setParentEmail] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState<string | null>(null);

  const activePersona = currentPOV === 'victim' ? PERSONAS.victim : PERSONAS.predator;

  const navigateToVerification = () => setCurrentView('verification');
  const navigateToProfile = () => setCurrentView('profile');
  const navigateToAnalyzer = () => setCurrentView('analyzer');
  const navigateToMessages = () => setCurrentView('messages');

  const handleLogin = (selectedPOV: POV) => {
    setCurrentPOV(selectedPOV);
    setIsLoggedIn(true);
    navigateToProfile();
  };

  const handleVerificationSuccess = (email: string) => {
    setIsVerified(true);
    setParentEmail(email);
  };

  const handleNewSecurityReport = (report: SecurityReport) => {
    setSecurityReports(prev => [report, ...prev]);
  };

  const handleUpdateEmail = (email: string) => {
    setParentEmail(email);
  };

  const triggerSuspension = (reason: string, text: string) => {
    setIsSuspended(true);
    setSuspensionEndTime(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    handleNewSecurityReport({
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      targetUser: PERSONAS.victim.username,
      messageContent: text,
      severity: 'Critical',
      status: 'Account Suspended',
      reason: reason
    });
  };

  const togglePOV = () => {
    const nextPOV = currentPOV === 'victim' ? 'predator' : 'victim';
    setCurrentPOV(nextPOV);
    navigateToProfile();
  };

  const checkSafetyKeywords = (text: string) => {
    const harmfulTerms = ['free robux', 'where do you live', 'parents', 'whatsapp', 'snapchat', 'discord', 'send pics', 'cam', 'alone', 'don\'t tell'];
    const lowerText = text.toLowerCase();
    return harmfulTerms.some(term => lowerText.includes(term));
  };

  const handleSendMessage = async (targetFriendId: string, text: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const senderId = activePersona.id;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: senderId,
      text: text,
      timestamp,
      isMe: true 
    };
    
    setChatMessages(prev => {
      let key = targetFriendId;
      if ((targetFriendId === 'me' && senderId === 'c1') || (targetFriendId === 'c1' && senderId === 'me')) {
        key = 'c1';
      }
      return { ...prev, [key]: [...(prev[key] || []), newMessage] };
    });

    if (Math.random() > 0.5) {
      setOtherUserTyping(targetFriendId);
      setTimeout(() => setOtherUserTyping(null), 3000);
    }

    if (currentPOV === 'predator') {
      setIsAnalyzing(true);
      if (checkSafetyKeywords(text)) {
        triggerSuspension("Immediate heuristic violation: Harmful keywords detected.", text);
        setIsAnalyzing(false);
        return;
      }

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Analyze this message sent by an adult to a 12-year-old child in a gaming environment. Is it grooming, predatory, or a severe safety violation?
          Message: "${text}"`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                isPredatory: { type: Type.BOOLEAN },
                reason: { type: Type.STRING }
              },
              required: ["isPredatory", "reason"]
            }
          }
        });

        const result = JSON.parse(response.text || '{}');
        if (result.isPredatory) {
          triggerSuspension(result.reason, text);
        }
      } catch (e) {
        console.error("AI Analysis failed", e);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleRetakePass = () => {
    setIsSuspended(false);
    setSuspensionEndTime(null);
    setIsVeriflyVerified(true);
    setCurrentView('profile');
  };

  // If not logged in, only show the login page
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className={`min-h-screen ${currentPOV === 'predator' ? 'bg-black/40' : 'bg-transparent'} text-white flex flex-col font-['Poppins']`}>
      {isSuspended && currentPOV === 'predator' && (
        <SuspensionOverlay 
          endTime={suspensionEndTime!} 
          onPass={handleRetakePass} 
        />
      )}
      
      <Navbar 
        onHomeClick={navigateToProfile} 
        currentPOV={currentPOV} 
        onTogglePOV={togglePOV}
        user={activePersona}
      />
      
      <div className="flex flex-1 pt-[60px]">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onProfileClick={navigateToProfile}
          onSafetyClick={navigateToAnalyzer}
          onMessagesClick={navigateToMessages}
          activeView={currentView}
          user={activePersona}
          currentPOV={currentPOV}
        />
        
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-0 md:ml-48' : 'ml-0'}`}>
          <div className={`${currentView === 'messages' ? 'w-full h-[calc(100vh-60px)]' : 'max-w-4xl mx-auto p-4 md:py-8 md:px-6'}`}>
            {currentView === 'profile' && (
              <Dashboard 
                onVerifyClick={navigateToVerification} 
                isVerified={currentPOV === 'predator' ? true : isVerified}
                isVeriflyVerified={currentPOV === 'predator' ? isVeriflyVerified : false}
                parentEmail={parentEmail}
                onUpdateEmail={handleUpdateEmail}
                currentPOV={currentPOV}
                user={activePersona}
              />
            )}
            {currentView === 'verification' && (
              <VerificationGateway 
                onBack={navigateToProfile} 
                onSuccess={() => {
                  handleVerificationSuccess(parentEmail);
                  setIsVeriflyVerified(true);
                }}
              />
            )}
            {currentView === 'analyzer' && (
              <AgeGapAnalyzer 
                onBack={navigateToProfile} 
                reports={securityReports}
                chatMessages={chatMessages}
              />
            )}
            {currentView === 'messages' && (
              <MessagesView 
                currentPOV={currentPOV} 
                onVerifyPrompt={navigateToVerification}
                isVerified={currentPOV === 'predator' ? true : isVerified}
                isVeriflyVerified={currentPOV === 'predator' ? isVeriflyVerified : false}
                chatMessages={chatMessages}
                onSendMessage={handleSendMessage}
                otherUserTyping={otherUserTyping}
              />
            )}
          </div>
        </main>
      </div>

      {currentView !== 'messages' && (
        <ChatInterface 
          isVerified={currentPOV === 'predator' ? true : isVerified} 
          onVerifyPrompt={navigateToVerification}
          onSecurityAlert={handleNewSecurityReport}
          parentEmail={parentEmail}
          currentPOV={currentPOV}
          chatMessages={chatMessages}
          onSendMessage={handleSendMessage}
          otherUserTyping={otherUserTyping}
        />
      )}

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
