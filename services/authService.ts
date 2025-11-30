import { UserProfile, Contact } from '../types';
import { INITIAL_CONTACTS, DEFAULT_USER_PROFILE } from '../constants';

const USERS_KEY = 'polychat_users';
const CURRENT_USER_KEY = 'polychat_current_user';

// Helper to get user data key
const getDataKey = (userId: string) => `polychat_data_${userId}`;

export const authService = {
  // Login: Returns user profile if successful, null if failed
  login: (username: string, password: string): UserProfile | null => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: any) => u.username === username && u.password === password);
    
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user.profile));
      return user.profile;
    }
    return null;
  },

  // Register: Creates a new user and returns profile
  register: (username: string, password: string, name: string): UserProfile | string => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    if (users.find((u: any) => u.username === username)) {
      return "Username already exists";
    }

    const newUserProfile: UserProfile = {
      ...DEFAULT_USER_PROFILE,
      id: username,
      name: name || username,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || username)}&background=random`,
    };

    const newUser = {
      username,
      password,
      profile: newUserProfile
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUserProfile));

    // Initialize default contacts for new user so it's not empty
    const initialData = {
      contacts: INITIAL_CONTACTS,
      userProfile: newUserProfile
    };
    localStorage.setItem(getDataKey(username), JSON.stringify(initialData));

    return newUserProfile;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): UserProfile | null => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  // Data Persistence
  saveUserData: (userId: string, data: { contacts: Contact[], userProfile: UserProfile }) => {
    localStorage.setItem(getDataKey(userId), JSON.stringify(data));
  },

  getUserData: (userId: string) => {
    const stored = localStorage.getItem(getDataKey(userId));
    if (stored) {
      return JSON.parse(stored);
    }
    return { contacts: [], userProfile: null }; // Should handle init in register
  },

  // Find a user to add as contact
  findUserByUsername: (username: string): { id: string, name: string, avatar: string } | null => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: any) => u.username === username);
    if (user) {
      return {
        id: user.profile.id,
        name: user.profile.name,
        avatar: user.profile.avatar
      };
    }
    return null;
  }
};
