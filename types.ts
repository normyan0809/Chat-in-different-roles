export interface UserProfile {
  id: string; // Unique identifier (username)
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
  allowedContactIds: string[]; // Only used if visibility is 'specific'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  type: 'text' | 'sticker' | 'image' | 'video';
  text: string; // Content, Sticker URL, or Base64 Data URL
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
  name: string; // e.g., "Drinking Buddy", "Colleague", "Detective"
  description: string; // System instruction for this relationship
  color: string; // Visual theme for this persona
  messages: Message[];
  lastActive: number;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  personas: Persona[];
}

export type ThemeColor = 'blue' | 'purple' | 'green' | 'rose' | 'amber' | 'cyan';
