
import React, { useState } from 'react';
import { UserPlus, X, AlertCircle, CheckCircle2, Copy } from 'lucide-react';

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (contactId: string, name: string, avatar: string) => void;
  currentUserId: string;
}

const AddContactModal: React.FC<AddContactModalProps> = ({ isOpen, onClose, onAdd, currentUserId }) => {
  const [peerId, setPeerId] = useState('');
  const [nickname, setNickname] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!peerId.trim()) return;

    if (peerId === currentUserId) {
        alert("You cannot add yourself!");
        return;
    }

    // Since we are P2P, we can't "validate" the user exists without connecting.
    // We just assume they exist and add them. The connection status will update later.
    const name = nickname.trim() || peerId;
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
    
    onAdd(peerId, name, avatar);
    setSuccess(`Added contact! If they are online, status will turn green.`);
    setPeerId('');
    setNickname('');
    
    setTimeout(() => {
        setSuccess('');
        onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-800/50">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UserPlus size={18} className="text-emerald-400"/> Add New Friend
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 mb-6 text-center">
                <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Your ID</p>
                <div className="flex items-center justify-center gap-2">
                    <code className="text-emerald-400 font-bold font-mono text-lg">{currentUserId}</code>
                    <button 
                        onClick={() => navigator.clipboard.writeText(currentUserId)}
                        className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                        title="Copy ID"
                    >
                        <Copy size={16} />
                    </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">Share this ID with your friend so they can add you.</p>
            </div>

          <form onSubmit={handleAdd} className="space-y-4">
            <div>
                <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Friend's ID</label>
                <input 
                    type="text" 
                    value={peerId}
                    onChange={(e) => setPeerId(e.target.value)}
                    placeholder="Enter friend's ID..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 font-mono"
                    required
                />
            </div>
            
            <div>
                <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Nickname (Optional)</label>
                <input 
                    type="text" 
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="What do you call them?"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                />
            </div>

            <button 
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-emerald-900/20"
            >
                Add & Connect
            </button>
          </form>

          {success && (
              <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-xl flex items-center gap-3 text-emerald-400 animate-in fade-in slide-in-from-top-2">
                  <CheckCircle2 size={20} />
                  <span>{success}</span>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddContactModal;