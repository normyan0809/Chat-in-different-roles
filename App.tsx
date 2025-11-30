import React, { useState, useEffect } from 'react';
import { MessageCircle, Menu, X, Plus, UserCircle2, Sparkles, LogOut } from 'lucide-react';
import { Contact, Persona, Message, UserProfile, Mood } from './types';
import { INITIAL_CONTACTS, DEFAULT_USER_PROFILE } from './constants';
import { generateResponse, generatePersonaDescription } from './services/geminiService';
import { authService } from './services/authService';
import ChatWindow from './components/ChatWindow';
import PersonaSwitcher from './components/PersonaSwitcher';
import UserProfileModal from './components/UserProfileModal';
import MoodModal from './components/MoodModal';
import LoginScreen from './components/LoginScreen';
import AddContactModal from './components/AddContactModal';

const App: React.FC = () => {
  // Auth State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // App State
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string>('');
  const [activePersonaIds, setActivePersonaIds] = useState<{[contactId: string]: string}>({});
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isGeneratingPersona, setIsGeneratingPersona] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);

  // Initialize Auth
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      handleLoginSuccess(user);
    }
  }, []);

  // Save data on change
  useEffect(() => {
    if (currentUser && contacts.length > 0) {
      authService.saveUserData(currentUser.id, {
        contacts,
        userProfile: currentUser
      });
    }
  }, [contacts, currentUser]);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    const data = authService.getUserData(user.id);
    setContacts(data.contacts.length > 0 ? data.contacts : INITIAL_CONTACTS);
    
    // Select first contact if available
    const initialContacts = data.contacts.length > 0 ? data.contacts : INITIAL_CONTACTS;
    if (initialContacts.length > 0) {
        setSelectedContactId(initialContacts[0].id);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setContacts([]);
    setSelectedContactId('');
  };

  // Derived state
  const selectedContact = contacts.find(c => c.id === selectedContactId) || contacts[0];
  const activePersonaId = selectedContact ? (activePersonaIds[selectedContact.id] || selectedContact.personas[0]?.id) : '';
  const activePersona = selectedContact ? (selectedContact.personas.find(p => p.id === activePersonaId) || selectedContact.personas[0]) : null;

  useEffect(() => {
    const initialMap: {[key: string]: string} = {};
    contacts.forEach(c => {
        if (!activePersonaIds[c.id] && c.personas.length > 0) {
            initialMap[c.id] = c.personas[0].id;
        }
    });
    if (Object.keys(initialMap).length > 0) {
        setActivePersonaIds(prev => ({ ...prev, ...initialMap }));
    }
  }, [contacts]);

  const handleContactSelect = (id: string) => {
    setSelectedContactId(id);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handlePersonaSelect = (personaId: string) => {
    setActivePersonaIds(prev => ({
        ...prev,
        [selectedContactId]: personaId
    }));
  };

  const handleAddContact = (contactId: string, name: string, avatar: string) => {
      // Check if contact already exists
      if (contacts.find(c => c.id === contactId)) return;

      const newContact: Contact = {
          id: contactId,
          name: name,
          avatar: avatar,
          personas: [
              {
                  id: Math.random().toString(36).substr(2, 9),
                  name: 'Default',
                  description: 'A normal conversation.',
                  color: 'blue',
                  messages: [],
                  lastActive: Date.now()
              }
          ]
      };
      
      const updatedContacts = [...contacts, newContact];
      setContacts(updatedContacts);
      setSelectedContactId(newContact.id);
  };

  const handleAddPersona = async (name: string, description: string, color: string) => {
    setIsGeneratingPersona(true);
    let finalDescription = description;
    
    if (!finalDescription && process.env.API_KEY) {
        finalDescription = await generatePersonaDescription(process.env.API_KEY, name);
    } else if (!finalDescription) {
        finalDescription = `You are playing the role of ${name}.`;
    }

    const newPersona: Persona = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        description: finalDescription,
        color,
        messages: [],
        lastActive: Date.now()
    };

    setContacts(prev => prev.map(c => {
        if (c.id === selectedContactId) {
            return { ...c, personas: [...c.personas, newPersona] };
        }
        return c;
    }));

    handlePersonaSelect(newPersona.id);
    setIsGeneratingPersona(false);
  };

  const handleDeletePersona = (personaId: string) => {
      setContacts(prev => prev.map(c => {
          if (c.id === selectedContactId && c.personas.length > 1) {
              return { ...c, personas: c.personas.filter(p => p.id !== personaId) };
          }
          return c;
      }));
      const contact = contacts.find(c => c.id === selectedContactId);
      if(contact) {
          const remaining = contact.personas.filter(p => p.id !== personaId);
          if (remaining.length > 0) {
              handlePersonaSelect(remaining[0].id);
          }
      }
  };

  const handleRecallMessage = (messageId: string) => {
      setContacts(prev => prev.map(c => {
          if (c.id === selectedContactId) {
              return {
                  ...c,
                  personas: c.personas.map(p => {
                      if (p.id === activePersonaId) {
                          return {
                              ...p,
                              messages: p.messages.map(m => m.id === messageId ? { ...m, isRecalled: true } : m)
                          };
                      }
                      return p;
                  })
              };
          }
          return c;
      }));
  };

  const handleSaveMood = (newMood: Mood) => {
      if (currentUser) {
        const updatedUser = {...currentUser, mood: newMood};
        setCurrentUser(updatedUser);
      }
  };

  const handleSendMessage = async (text: string, type: 'text' | 'sticker' | 'image' | 'video' = 'text', replyTo?: Message) => {
    if (!process.env.API_KEY) {
        alert("API Key is missing.");
        return;
    }
    if (!currentUser || !activePersona) return;

    const newMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        type,
        text, // URL if sticker/media, text content otherwise
        timestamp: Date.now(),
        isRead: false,
        replyTo: replyTo ? {
            id: replyTo.id,
            text: replyTo.text,
            senderName: replyTo.role === 'user' ? currentUser.name : selectedContact.name,
            isSticker: replyTo.type === 'sticker',
            type: replyTo.type
        } : undefined
    };

    // Optimistic Update
    const updatedPersona = { 
        ...activePersona, 
        messages: [...activePersona.messages, newMessage] 
    };

    setContacts(prev => prev.map(c => {
        if (c.id === selectedContactId) {
            return {
                ...c,
                personas: c.personas.map(p => p.id === activePersonaId ? updatedPersona : p)
            };
        }
        return c;
    }));

    setIsTyping(true);

    // Simulate "Read" status
    setTimeout(() => {
         setContacts(prev => prev.map(c => {
            if (c.id === selectedContactId) {
                return {
                    ...c,
                    personas: c.personas.map(p => {
                        if (p.id === activePersonaId) {
                            return {
                                ...p,
                                messages: p.messages.map(m => m.id === newMessage.id ? { ...m, isRead: true } : m)
                            };
                        }
                        return p;
                    })
                };
            }
            return c;
        }));
    }, 1500);

    // Prepare context: Check if this contact is allowed to see user mood
    let moodContext: Mood | undefined = undefined;
    if (currentUser.mood) {
        if (currentUser.mood.visibility === 'public') {
            moodContext = currentUser.mood;
        } else if (currentUser.mood.visibility === 'specific' && currentUser.mood.allowedContactIds?.includes(selectedContactId)) {
            moodContext = currentUser.mood;
        }
    }

    const aiResponseText = await generateResponse(
        process.env.API_KEY,
        updatedPersona.description,
        updatedPersona.messages,
        { text, type },
        { replyTo, userMood: moodContext }
    );

    const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        type: 'text',
        text: aiResponseText,
        timestamp: Date.now(),
        isRead: true
    };

    setIsTyping(false);

    setContacts(prev => prev.map(c => {
        if (c.id === selectedContactId) {
            return {
                ...c,
                personas: c.personas.map(p => p.id === activePersonaId ? {
                    ...p,
                    messages: [...updatedPersona.messages, aiMessage], 
                    lastActive: Date.now()
                } : p)
            };
        }
        return c;
    }));
  };

  // --- Render ---

  if (!currentUser) {
      return <LoginScreen onLogin={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-200">
      
      {/* Modals */}
      <UserProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={currentUser}
        onSave={setCurrentUser}
      />

      <MoodModal 
        isOpen={isMoodModalOpen}
        onClose={() => setIsMoodModalOpen(false)}
        onSave={handleSaveMood}
        contacts={contacts}
        currentMood={currentUser.mood}
      />

      <AddContactModal 
        isOpen={isAddContactModalOpen}
        onClose={() => setIsAddContactModalOpen(false)}
        onAdd={handleAddContact}
        currentUserId={currentUser.id}
      />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Contact List) */}
      <div className={`
        fixed md:relative z-30 w-72 h-full bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
            <MessageCircle className="text-emerald-400" />
            PolyChat
          </h1>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 p-3 overflow-y-auto">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Contacts</h3>
          <div className="space-y-1">
            {contacts.map(contact => (
              <button
                key={contact.id}
                onClick={() => handleContactSelect(contact.id)}
                className={`w-full flex items-center p-3 rounded-xl transition-all ${
                  selectedContactId === contact.id 
                    ? 'bg-slate-800 shadow-md border border-slate-700' 
                    : 'hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="relative">
                    <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full object-cover" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                </div>
                <div className="ml-3 text-left">
                  <p className="font-medium text-slate-200">{contact.name}</p>
                  <p className="text-xs text-slate-500 truncate w-40">
                    {contact.personas.length} Active Personas
                  </p>
                </div>
              </button>
            ))}
            
            <button 
                onClick={() => setIsAddContactModalOpen(true)}
                className="w-full flex items-center justify-center p-3 rounded-xl border border-dashed border-slate-700 text-slate-500 hover:text-emerald-400 hover:border-emerald-400/50 hover:bg-slate-800/50 transition-all mt-4 group"
            >
                <Plus size={18} className="mr-2 group-hover:scale-110 transition-transform"/>
                <span className="text-sm">Add Contact</span>
            </button>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900">
            {currentUser.mood && (
                <div className="mb-2 mx-1 px-3 py-1.5 bg-slate-800/50 rounded-lg flex items-center justify-between border border-slate-700/50">
                     <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-lg">{currentUser.mood.emoji}</span>
                        <span className="text-xs text-slate-300 truncate">{currentUser.mood.content}</span>
                     </div>
                     <button 
                        onClick={() => setIsMoodModalOpen(true)}
                        className="text-slate-500 hover:text-white"
                     >
                         <Sparkles size={12} />
                     </button>
                </div>
            )}

            <div className="flex items-center gap-1">
                <button 
                    onClick={() => setIsProfileModalOpen(true)}
                    className="flex-1 flex items-center p-2 rounded-xl hover:bg-slate-800 transition-colors group"
                >
                    <img src={currentUser.avatar} alt="Me" className="w-9 h-9 rounded-full object-cover border border-slate-700 group-hover:border-emerald-500 transition-colors" />
                    <div className="ml-3 text-left flex-1 min-w-0">
                        <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors truncate">{currentUser.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">@{currentUser.id}</p>
                    </div>
                </button>
                <button 
                    onClick={() => setIsMoodModalOpen(true)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="Update Status"
                >
                    <Sparkles size={18} />
                </button>
                <button 
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Sign Out"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedContact ? (
            <>
                {/* Mobile Header */}
                <div className="md:hidden h-14 bg-slate-900 border-b border-slate-800 flex items-center px-4 justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="text-slate-400">
                            <Menu size={24} />
                        </button>
                        <span className="font-semibold">{selectedContact.name}</span>
                    </div>
                    <img src={selectedContact.avatar} className="w-8 h-8 rounded-full" />
                </div>

                {/* Desktop Header & Persona Switcher */}
                <div className="bg-slate-900/50 backdrop-blur-sm z-10">
                    <div className="hidden md:flex items-center justify-between px-6 py-3 border-b border-slate-800">
                        <div className="flex items-center gap-4">
                            <h2 className="text-lg font-bold text-white">{selectedContact.name}</h2>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                                {selectedContact.personas.length} Relationships
                            </span>
                        </div>
                    </div>
                    
                    {activePersona && (
                        <PersonaSwitcher 
                            contact={selectedContact}
                            activePersonaId={activePersonaId}
                            onSelectPersona={handlePersonaSelect}
                            onAddPersona={handleAddPersona}
                            onDeletePersona={handleDeletePersona}
                            isGenerating={isGeneratingPersona}
                        />
                    )}
                </div>

                {/* Chat Area */}
                <div className="flex-1 relative overflow-hidden">
                    {activePersona ? (
                        <ChatWindow 
                            contact={selectedContact}
                            persona={activePersona}
                            userProfile={currentUser}
                            onSendMessage={handleSendMessage}
                            onRecallMessage={handleRecallMessage}
                            isTyping={isTyping}
                        />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500">
                            <Sparkles size={48} className="mb-4 text-slate-700" />
                            <p>No active relationships found for this contact.</p>
                            <p className="text-sm">Create a new context above.</p>
                        </div>
                    )}
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-slate-950">
                <MessageCircle size={64} className="mb-6 text-slate-800" />
                <h2 className="text-xl font-medium text-slate-400">Welcome to PolyChat</h2>
                <p className="mt-2 max-w-sm text-center text-sm">Select a contact to start chatting, or add a new one from the sidebar.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default App;
