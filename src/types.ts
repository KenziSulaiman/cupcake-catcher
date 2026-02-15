export type UserStatus = 'online' | 'offline' | 'ingame' | 'away';

export type POV = 'victim' | 'predator';

export interface Friend {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  status: UserStatus;
  age: number;
  lastSeen?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface SecurityReport {
  id: string;
  timestamp: string;
  targetUser: string;
  messageContent: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status:
    | 'Forwarded to Parents'
    | 'Sent to Cyber Security'
    | 'AI Monitoring'
    | 'Account Suspended';
  reason: string;
}

export interface ChatSession {
  friendId: string;
  messages: Message[];
  isTyping: boolean;
}
