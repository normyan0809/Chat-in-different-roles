
import { Contact, ThemeColor, UserProfile } from './types';

export const THEME_COLORS: { [key in ThemeColor]: string } = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  green: 'bg-emerald-500',
  rose: 'bg-rose-500',
  amber: 'bg-amber-500',
  cyan: 'bg-cyan-500',
};

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'me',
  name: 'Me',
  avatar: 'https://ui-avatars.com/api/?name=Me&background=random',
  bio: 'Living my best life ✨',
  mood: {
    content: 'Online',
    emoji: '🌐',
    timestamp: Date.now(),
    visibility: 'public',
    allowedContactIds: []
  }
};

export const STICKERS = [
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDdtY2FwZ2J6aGszbmhlZ2Rrb3U4eXJ5YnF6eXJ5YnF6eXJ5YnF6eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/l0HlOaQcLJ2hHpYkg/giphy.gif', 
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3R6eW55b3U4eXJ5YnF6eXJ5YnF6eXJ5YnF6eXJ5YnF6eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/3o7TKSjRrfIPjeiVyM/giphy.gif', 
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDV6eXJ5YnF6eXJ5YnF6eXJ5YnF6eXJ5YnF6eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/26FLdmIp6wJr91J4k/giphy.gif', 
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjl6eXJ5YnF6eXJ5YnF6eXJ5YnF6eXJ5YnF6eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/3oEjHW5Z7rZl3a9480/giphy.gif', 
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExODF6eXJ5YnF6eXJ5YnF6eXJ5YnF6eXJ5YnF6eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/l3q2K5jinAlChoCLS/giphy.gif', 
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTN6eXJ5YnF6eXJ5YnF6eXJ5YnF6eXJ5YnF6eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/dGbmj00aW8X96/giphy.gif', 
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDV6eXJ5YnF6eXJ5YnF6eXJ5YnF6eXJ5YnF6eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/l0ExhcM2sG2H25kgo/giphy.gif', 
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTd6eXJ5YnF6eXJ5YnF6eXJ5YnF6eXJ5YnF6eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/3o7abKhOpu0NwenH3O/giphy.gif', 
];

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'ai-assistant',
    name: 'Gemini Agent',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg',
    isAiAgent: true,
    isOnline: true,
    personas: [
      {
        id: 'p1',
        name: 'Assistant',
        description: 'You are a helpful AI assistant.',
        color: 'blue',
        messages: [
          { id: 'm1', role: 'model', type: 'text', text: 'Hello! I am your AI assistant. To chat with real friends, share your ID with them and use the "Add Contact" button.', timestamp: Date.now(), isRead: true },
        ],
        lastActive: Date.now(),
      }
    ]
  }
];