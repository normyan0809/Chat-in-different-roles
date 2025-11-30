import { Contact, Persona, ThemeColor, UserProfile } from './types';

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
    content: 'Chilling',
    emoji: '☕',
    timestamp: Date.now(),
    visibility: 'public',
    allowedContactIds: []
  }
};

export const STICKERS = [
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDdtY2FwZ2J6aGszbmhlZ2Rrb3U4eXJ5YnF6eXJ5YnF6eXJ5YnF6eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/l0HlOaQcLJ2hHpYkg/giphy.gif', // Cat jam
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3R6eW55b3U4eXJ5YnF6eXJ5YnF6eXJ5YnF6eXJ5YnF6eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/3o7TKSjRrfIPjeiVyM/giphy.gif', // High five
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDV6eXJ5YnF6eXJ5YnF6eXJ5YnF6eXJ5YnF6eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/26FLdmIp6wJr91J4k/giphy.gif', // Applause
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjl6eXJ5YnF6eXJ5YnF6eXJ5YnF6eXJ5YnF6eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/3oEjHW5Z7rZl3a9480/giphy.gif', // Laughing
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExODF6eXJ5YnF6eXJ5YnF6eXJ5YnF6eXJ5YnF6eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/l3q2K5jinAlChoCLS/giphy.gif', // What?
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTN6eXJ5YnF6eXJ5YnF6eXJ5YnF6eXJ5YnF6eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/dGbmj00aW8X96/giphy.gif', // Heart
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDV6eXJ5YnF6eXJ5YnF6eXJ5YnF6eXJ5YnF6eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/l0ExhcM2sG2H25kgo/giphy.gif', // Cool
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTd6eXJ5YnF6eXJ5YnF6eXJ5YnF6eXJ5YnF6eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/3o7abKhOpu0NwenH3O/giphy.gif', // Sad
];

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'Sarah Chen',
    avatar: 'https://picsum.photos/200/200?random=1',
    personas: [
      {
        id: 'p1',
        name: 'Bestie Gossip',
        description: 'You are my best friend. We gossip about everything, use slang, emojis, and are very casual and supportive. We hate Mondays.',
        color: 'rose',
        messages: [
          { id: 'm1', role: 'model', type: 'text', text: 'OMG did you see what Jason wore today? 🙈', timestamp: Date.now() - 100000, isRead: true },
        ],
        lastActive: Date.now(),
      },
      {
        id: 'p2',
        name: 'Work Project Lead',
        description: 'You are my strictly professional project manager. We discuss deadlines, Jira tickets, and code reviews. Tone is formal and concise.',
        color: 'blue',
        messages: [
          { id: 'm2', role: 'model', type: 'text', text: 'Please update the status on the Q3 roadmap by EOD.', timestamp: Date.now() - 50000, isRead: true },
        ],
        lastActive: Date.now(),
      }
    ]
  },
  {
    id: 'c2',
    name: 'Marcus Thorne',
    avatar: 'https://picsum.photos/200/200?random=2',
    personas: [
      {
        id: 'p3',
        name: 'Gym Bro',
        description: 'You are my gym spotter. We talk about gains, protein, lifting stats, and motivation. lots of "Bro" and muscle emojis.',
        color: 'amber',
        messages: [
          { id: 'm3', role: 'model', type: 'text', text: 'Leg day today? Don\'t skip it bro! 💪', timestamp: Date.now(), isRead: true },
        ],
        lastActive: Date.now(),
      },
      {
        id: 'p4',
        name: 'RPG: The Wizard',
        description: 'We are in a Dungeons and Dragons campaign. You are Eldric the Wizard. You speak in riddles and old english. I am your knight protector.',
        color: 'purple',
        messages: [
          { id: 'm4', role: 'model', type: 'text', text: 'Hark! The shadows lengthen. Is thy sword ready, brave knight?', timestamp: Date.now(), isRead: true },
        ],
        lastActive: Date.now(),
      }
    ]
  }
];