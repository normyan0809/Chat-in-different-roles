import React, { useState } from 'react';
import { Search, UserPlus, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/authService';

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (contactId: string, name: string, avatar: string) => void;
  currentUserId: string;
}

const AddContactModal: React.FC<AddContactModalProps> = ({ isOpen, onClose, onAdd, currentUserId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<{id: string, name: string, avatar: string} | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSearchResult(null);

    if (searchTerm === currentUserId) {
        setError("You cannot add yourself.");
        return;
    }

    const user = authService.findUserByUsername(searchTerm);
    if (user) {
        setSearchResult(user);
    } else {
        setError("User not found.");
    }
  };

  const handleAdd = () => {
    if (searchResult) {
        onAdd(searchResult.id, searchResult.name, searchResult.avatar);
        setSuccess(`Added ${searchResult.name} to contacts!`);
        setSearchResult(null);
        setSearchTerm('');
        // Close after a brief delay
        setTimeout(onClose, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-800/50">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UserPlus size={18} className="text-emerald-400"/> Add New Contact
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSearch} className="mb-6">
            <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Search by Username</label>
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="e.g. jsmith"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                />
                <button 
                    type="submit"
                    className="bg-slate-800 hover:bg-slate-700 text-white px-4 rounded-xl border border-slate-700 transition-colors"
                >
                    <Search size={20} />
                </button>
            </div>
          </form>

          {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/50 rounded-xl flex items-center gap-3 text-rose-400 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle size={20} />
                  <span>{error}</span>
              </div>
          )}

          {success && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-xl flex items-center gap-3 text-emerald-400 animate-in fade-in slide-in-from-top-2">
                  <CheckCircle2 size={20} />
                  <span>{success}</span>
              </div>
          )}

          {searchResult && !success && (
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-4 mb-4">
                      <img src={searchResult.avatar} alt={searchResult.name} className="w-12 h-12 rounded-full border border-slate-600" />
                      <div>
                          <h3 className="font-bold text-white text-lg">{searchResult.name}</h3>
                          <p className="text-slate-400 text-sm">@{searchResult.id}</p>
                      </div>
                  </div>
                  <button 
                    onClick={handleAdd}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 rounded-lg transition-colors"
                  >
                      Add to Contacts
                  </button>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddContactModal;
