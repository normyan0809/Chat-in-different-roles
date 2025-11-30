
export interface UserProfile {
  id: string; // This will effectively be the Peer ID (username)
  name: string;
  avatar: string;
  bio: string;
  mood?: Mood;
}

export interface Mood {
  content: string;
  emoji: string;
  timestamp: number;
  visibility: 'public' | 'private' | 'specific';
  allowedContactIds: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'peer'; // Added 'peer' for friends
  senderId?: string; // ID of the person who sent it
  senderPersonaName?: string; // The persona name used by the sender
  type: 'text' | 'sticker' | 'image' | 'video';
  text: string;
  timestamp: number;
  isRead?: boolean;
  isRecalled?: boolean;
  replyTo?: {
    id: string;
    text: string;
    senderName: string;
    isSticker?: boolean;
    type?: 'text' | 'sticker' | 'image' | 'video';
  };
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  color: string;
  messages: Message[];
  lastActive: number;
}

export interface Contact {
  id: string; // The Friend's Peer ID
  name: string;
  avatar: string;
  isAiAgent?: boolean; // Flag to distinguish Real Humans vs AI
  isOnline?: boolean; // P2P status
  personas: Persona[];
}

export type ThemeColor = 'blue' | 'purple' | 'green' | 'rose' | 'amber' | 'cyan';

// P2P Payload Structure
export interface P2PDataPacket {
  type: 'MESSAGE' | 'CONNECTION_REQUEST' | 'STATUS_UPDATE';
  payload: any;
  senderProfile: UserProfile;
}