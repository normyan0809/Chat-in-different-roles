import React, { useState } from 'react';
import { Plus, Users, Settings2, Trash2, Edit3, X } from 'lucide-react';
import { Persona, Contact, ThemeColor } from '../types';
import { THEME_COLORS } from '../constants';

interface PersonaSwitcherProps {
  contact: Contact;
  activePersonaId: string;
  onSelectPersona: (id: string) => void;
  onAddPersona: (name: string, description: string, color: string) => void;
  onDeletePersona: (id: string) => void;
  isGenerating: boolean;
}

const PersonaSwitcher: React.FC<PersonaSwitcherProps> = ({
  contact,
  activePersonaId,
  onSelectPersona,
  onAddPersona,
  onDeletePersona,
  isGenerating
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newPersonaName, setNewPersonaName] = useState('');
  const [newPersonaDesc, setNewPersonaDesc] = useState('');
  const [newPersonaColor, setNewPersonaColor] = useState<string>('blue');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPersonaName.trim()) {
      onAddPersona(newPersonaName, newPersonaDesc, newPersonaColor);
      setIsAdding(false);
      setNewPersonaName('');
      setNewPersonaDesc('');
      setNewPersonaColor('blue');
    }
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 p-2">
      <div className="flex items-center justify-between mb-2 px-2">
        <h2 className="text-sm font-semibold text-slate-400 flex items-center gap-2">
           <Users size={14} /> 
           RELATIONSHIP CONTEXTS
        </h2>
        <button 
            onClick={() => setIsAdding(!isAdding)}
            className="text-xs flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
        >
            <Plus size={14} /> New Context
        </button>
      </div>

      {/* Adding Mode */}
      {isAdding && (
          <div className="bg-slate-800 p-3 rounded-lg mb-3 border border-slate-700 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-center mb-2">
                  <h3 className="text-white text-sm font-medium">Create New Relationship</h3>
                  <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white"><X size={14}/></button>
              </div>
              <form onSubmit={handleAddSubmit} className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="Title (e.g. Secret Agent)" 
                    className="w-full bg-slate-900 text-sm p-2 rounded border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                    value={newPersonaName}
                    onChange={e => setNewPersonaName(e.target.value)}
                    required
                  />
                  <textarea 
                    placeholder="Description (System Instruction). Leave empty for AI auto-generation." 
                    className="w-full bg-slate-900 text-sm p-2 rounded border border-slate-700 text-white focus:outline-none focus:border-emerald-500 h-16 resize-none"
                    value={newPersonaDesc}
                    onChange={e => setNewPersonaDesc(e.target.value)}
                  />
                  
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-slate-400">Theme:</span>
                    {Object.keys(THEME_COLORS).map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => setNewPersonaColor(color)}
                            className={`w-4 h-4 rounded-full transition-transform ${THEME_COLORS[color as ThemeColor]} ${newPersonaColor === color ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-100'}`}
                        />
                    ))}
                  </div>

                  <button 
                    disabled={isGenerating}
                    type="submit" 
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-2 rounded font-medium mt-2 disabled:opacity-50"
                  >
                      {isGenerating ? 'Generating Persona...' : 'Create Relationship'}
                  </button>
              </form>
          </div>
      )}

      {/* Scrollable Badges */}
      <div className="flex overflow-x-auto space-x-2 pb-2 hide-scrollbar">
        {contact.personas.map((p) => {
          const isActive = p.id === activePersonaId;
          const themeBg = THEME_COLORS[p.color as ThemeColor] || 'bg-slate-600';
          
          return (
            <div
              key={p.id}
              onClick={() => onSelectPersona(p.id)}
              className={`
                group relative flex-shrink-0 cursor-pointer select-none
                px-4 py-2 rounded-xl transition-all duration-200 border
                ${isActive 
                    ? `${themeBg} bg-opacity-20 border-${p.color}-500 text-white shadow-lg shadow-${p.color}-900/20` 
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750 hover:border-slate-600'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white animate-pulse' : themeBg}`} />
                <span className="text-sm font-medium whitespace-nowrap">{p.name}</span>
                {isActive && (
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            if(confirm('Delete this relationship history?')) onDeletePersona(p.id);
                        }}
                        className="ml-2 p-1 hover:bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 size={12} />
                    </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PersonaSwitcher;