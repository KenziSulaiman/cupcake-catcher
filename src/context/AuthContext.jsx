import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const ACCOUNT_STATES = {
  LOGGED_OUT: 'logged_out',
  CREATED: 'created',
  LOCKED: 'locked',
  PARENT_APPROVED: 'parent_approved',
  TRUSTED: 'trusted',
  RESTRICTED: 'restricted',
  SUSPENDED: 'suspended',
};

const MOCK_USERS = {
  'demo@rblx.com': {
    id: 'u_001',
    username: 'RblxPlayer2025',
    displayName: 'Alex',
    email: 'demo@rblx.com',
    age: 15,
    avatar: null,
    accountState: ACCOUNT_STATES.PARENT_APPROVED,
    joinDate: '2025-01-15',
    friendsCount: 24,
    safetySettings: {
      friendsOnlyMessaging: true,
      linkSharingDisabled: true,
      quietHours: { enabled: false, start: '22:00', end: '07:00' },
    },
  },
  'locked@rblx.com': {
    id: 'u_002',
    username: 'NewPlayer99',
    displayName: 'Jamie',
    email: 'locked@rblx.com',
    age: 14,
    avatar: null,
    accountState: ACCOUNT_STATES.LOCKED,
    joinDate: '2025-06-01',
    friendsCount: 0,
    safetySettings: {
      friendsOnlyMessaging: true,
      linkSharingDisabled: true,
      quietHours: { enabled: false, start: '22:00', end: '07:00' },
    },
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accountState, setAccountState] = useState(ACCOUNT_STATES.LOGGED_OUT);

  const login = useCallback((email, password) => {
    const mockUser = MOCK_USERS[email];
    if (mockUser) {
      setUser(mockUser);
      setAccountState(mockUser.accountState);
      return { success: true };
    }
    // Auto-create for any email (demo purposes)
    const newUser = {
      id: 'u_' + Date.now(),
      username: email.split('@')[0],
      displayName: email.split('@')[0],
      email,
      age: 15,
      avatar: null,
      accountState: ACCOUNT_STATES.LOCKED,
      joinDate: new Date().toISOString().split('T')[0],
      friendsCount: 0,
      safetySettings: {
        friendsOnlyMessaging: true,
        linkSharingDisabled: true,
        quietHours: { enabled: false, start: '22:00', end: '07:00' },
      },
    };
    setUser(newUser);
    setAccountState(ACCOUNT_STATES.LOCKED);
    return { success: true };
  }, []);

  const signup = useCallback((email, username, age) => {
    const newUser = {
      id: 'u_' + Date.now(),
      username,
      displayName: username,
      email,
      age: parseInt(age),
      avatar: null,
      accountState: ACCOUNT_STATES.LOCKED,
      joinDate: new Date().toISOString().split('T')[0],
      friendsCount: 0,
      safetySettings: {
        friendsOnlyMessaging: true,
        linkSharingDisabled: true,
        quietHours: { enabled: false, start: '22:00', end: '07:00' },
      },
    };
    setUser(newUser);
    setAccountState(ACCOUNT_STATES.LOCKED);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAccountState(ACCOUNT_STATES.LOGGED_OUT);
  }, []);

  const approveParent = useCallback(() => {
    setAccountState(ACCOUNT_STATES.PARENT_APPROVED);
    setUser(prev => prev ? { ...prev, accountState: ACCOUNT_STATES.PARENT_APPROVED } : null);
  }, []);

  const updateSafetySettings = useCallback((settings) => {
    setUser(prev => prev ? {
      ...prev,
      safetySettings: { ...prev.safetySettings, ...settings },
    } : null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      accountState,
      isLoggedIn: !!user,
      isLocked: accountState === ACCOUNT_STATES.LOCKED,
      isApproved: accountState === ACCOUNT_STATES.PARENT_APPROVED || accountState === ACCOUNT_STATES.TRUSTED,
      login,
      signup,
      logout,
      approveParent,
      updateSafetySettings,
      ACCOUNT_STATES,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { ACCOUNT_STATES };
