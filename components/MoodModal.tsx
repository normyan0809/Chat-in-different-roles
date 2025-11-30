import React, { useState } from 'react';
import { Contact, Mood } from '../types';
import { X, Lock, Globe, Users, Smile } from 'lucide-react';

interface MoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mood: Mood) => void;
  contacts: Contact[];
  currentMood?: Mood;
}

const EMOJIS = ['😊', '😂', '🥰', '😎', '🤔', '😴', '😭', '🤯', '🥳', '👻', '☕', '🍷', '💪', '🎮'];

const MoodModal: React.FC<MoodModalProps> = ({ isOpen, onClose, onSave, contacts, currentMood }) => {
  const [content, setContent] = useState(currentMood?.content || '');
  const [selectedEmoji, setSelectedEmoji] = useState(currentMood?.emoji || '😊');
  const [visibility, setVisibility] = useState<'public' | 'private' | 'specific'>(currentMood?.visibility || 'public');
  const [allowedContacts, setAllowedContacts] = useState<string[]>(currentMood?.allowedContactIds || []);

  if (!isOpen) return null;

  const handleSave = () => {
      onSave({
          content,
          emoji: selectedEmoji,
          timestamp: Date.now(),
          visibility,
          allowedContactIds: allowedContacts
      });
      onClose();
  };

  const toggleContact = (id: string) => {
      if (allowedContacts.includes(id)) {
          setAllowedContacts(allowedContacts.filter(c => c !== id));
      } else {
          setAllowedContacts([...allowedContacts, id]);
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-800/50">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Smile size={18} className="text-emerald-400"/> Update Status
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Input Section */}
          <div className="flex gap-3">
              <div className="flex flex-col gap-2">
                 <div className="text-4xl bg-slate-800 p-2 rounded-xl border border-slate-700 text-center cursor-default">
                     {selectedEmoji}
                 </div>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 resize-none h-24"
              />
          </div>

          {/* Emoji Picker */}
          <div>
              <label className="text-xs text-slate-400 font-bold uppercase mb-2 block">Select Icon</label>
              <div className="flex flex-wrap gap-2">
                  {EMOJIS.map(e => (
                      <button 
                        key={e} 
                        onClick={() => setSelectedEmoji(e)}
                        className={`text-xl p-2 rounded-lg hover:bg-slate-700 transition-colors ${selectedEmoji === e ? 'bg-slate-700 ring-1 ring-emerald-500' : ''}`}
                      >
                          {e}
                      </button>
                  ))}
              </div>
          </div>

          {/* Privacy Section */}
          <div>
              <label className="text-xs text-slate-400 font-bold uppercase mb-3 block">Who can see this?</label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                  <button 
                    onClick={() => setVisibility('public')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${visibility === 'public' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'}`}
                  >
                      <Globe size={20} />
                      <span className="text-xs font-medium">All Contacts</span>
                  </button>
                  <button 
                    onClick={() => setVisibility('specific')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${visibility === 'specific' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'}`}
                  >
                      <Users size={20} />
                      <span className="text-xs font-medium">Select...</span>
                  </button>
                  <button 
                    onClick={() => setVisibility('private')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${visibility === 'private' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'}`}
                  >
                      <Lock size={20} />
                      <span className="text-xs font-medium">Only Me</span>
                  </button>
              </div>

              {/* Contact List (if specific) */}
              {visibility === 'specific' && (
                  <div className="bg-slate-800 rounded-xl p-2 max-h-32 overflow-y-auto border border-slate-700 animate-in slide-in-from-top-2">
                      {contacts.map(c => (
                          <button 
                            key={c.id}
                            onClick={() => toggleContact(c.id)}
                            className="w-full flex items-center gap-3 p-2 hover:bg-slate-700 rounded-lg transition-colors"
                          >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center ${allowedContacts.includes(c.id) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500'}`}>
                                  {allowedContacts.includes(c.id) && <X size={12} className="text-white rotate-45 transform" strokeWidth={3} />}
                              </div>
                              <img src={c.avatar} className="w-6 h-6 rounded-full" />
                              <span className="text-sm text-slate-200">{c.name}</span>
                          </button>
                      ))}
                  </div>
              )}
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/20"
          >
            Post Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodModal;