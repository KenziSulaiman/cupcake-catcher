import { createContext, useContext, useState, useCallback } from 'react';
import { analyzeMessage, calculateAccountRisk } from '../utils/groomerDetection';

const SafetyContext = createContext(null);

export function SafetyProvider({ children }) {
  const [flaggedMessages, setFlaggedMessages] = useState([]);
  const [accountRiskScores, setAccountRiskScores] = useState({});
  const [reports, setReports] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const checkMessage = useCallback((userId, message) => {
    const analysis = analyzeMessage(message);

    if (analysis.riskScore > 0) {
      const flagEntry = {
        id: Date.now(),
        userId,
        message,
        ...analysis,
        timestamp: new Date().toISOString(),
      };
      setFlaggedMessages(prev => [...prev, flagEntry]);

      if (analysis.hasCritical) {
        setAlerts(prev => [...prev, {
          id: Date.now(),
          type: 'critical',
          message: `Critical grooming pattern detected from user ${userId}`,
          timestamp: new Date().toISOString(),
          dismissed: false,
        }]);
      }
    }

    return analysis;
  }, []);

  const reportUser = useCallback((reporterId, targetId, reason, evidence) => {
    const report = {
      id: Date.now(),
      reporterId,
      targetId,
      reason,
      evidence,
      status: 'pending',
      timestamp: new Date().toISOString(),
    };
    setReports(prev => [...prev, report]);
    return report;
  }, []);

  const blockUser = useCallback((userId, blockedId) => {
    setBlockedUsers(prev => [...prev, { userId, blockedId, timestamp: new Date().toISOString() }]);
  }, []);

  const isBlocked = useCallback((userId, targetId) => {
    return blockedUsers.some(b =>
      (b.userId === userId && b.blockedId === targetId) ||
      (b.userId === targetId && b.blockedId === userId)
    );
  }, [blockedUsers]);

  const dismissAlert = useCallback((alertId) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, dismissed: true } : a));
  }, []);

  return (
    <SafetyContext.Provider value={{
      flaggedMessages,
      accountRiskScores,
      reports,
      blockedUsers,
      alerts: alerts.filter(a => !a.dismissed),
      checkMessage,
      reportUser,
      blockUser,
      isBlocked,
      dismissAlert,
    }}>
      {children}
    </SafetyContext.Provider>
  );
}

export function useSafety() {
  const ctx = useContext(SafetyContext);
  if (!ctx) throw new Error('useSafety must be used within SafetyProvider');
  return ctx;
}
