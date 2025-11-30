import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, Save, Upload } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, profile, onSave }) => {
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [bio, setBio] = useState(profile.bio);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...profile, name, avatar, bio });
    onClose();
  };

  const getRandomAvatar = () => {
    setAvatar(`https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Me')}&background=random&length=1&bold=true&rounded=true&size=128&timestamp=${Date.now()}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-800/50">
          <h2 className="text-lg font-bold text-white">Edit My Profile</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer" onClick={getRandomAvatar}>
                <img 
                    src={avatar} 
                    alt="Preview" 
                    className="w-24 h-24 rounded-full border-4 border-slate-700 object-cover group-hover:border-emerald-500 transition-colors" 
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-white font-medium">Randomize</span>
                </div>
            </div>
            <div className="w-full">
                <label className="block text-xs font-medium text-slate-400 mb-1">Avatar URL</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Nickname</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Signature / Bio</label>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-sm resize-none"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save size={18} />
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfileModal;