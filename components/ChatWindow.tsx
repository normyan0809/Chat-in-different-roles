
import React, { useEffect, useRef, useState } from 'react';
import { Send, Loader2, Smile, Reply, Trash2, Check, CheckCheck, X, Image as ImageIcon, PlayCircle, Signal } from 'lucide-react';
import { Message, Persona, Contact, UserProfile } from '../types';
import { THEME_COLORS, STICKERS } from '../constants';

interface ChatWindowProps {
  contact: Contact;
  persona: Persona;
  userProfile: UserProfile;
  onSendMessage: (text: string, type: 'text' | 'sticker' | 'image' | 'video', replyTo?: Message) => void;
  onRecallMessage: (messageId: string) => void;
  isTyping: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
    contact, 
    persona, 
    userProfile, 
    onSendMessage, 
    onRecallMessage, 
    isTyping 
}) => {
  const [inputText, setInputText] = useState('');
  const [showStickers, setShowStickers] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [persona.messages, isTyping, replyingTo]);

  // Click outside to close stickers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.sticker-picker') && !target.closest('.sticker-btn')) {
            setShowStickers(false);
        }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText, 'text', replyingTo || undefined);
    setInputText('');
    setReplyingTo(null);
    setShowStickers(false);
  };

  const handleSendSticker = (url: string) => {
      onSendMessage(url, 'sticker', replyingTo || undefined);
      setShowStickers(false);
      setReplyingTo(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
          const base64String = reader.result as string;
          const type = file.type.startsWith('video/') ? 'video' : 'image';
          onSendMessage(base64String, type, replyingTo || undefined);
          setReplyingTo(null);
      };
      reader.readAsDataURL(file);
      
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Dynamic theme color based on persona
  const themeClass = THEME_COLORS[persona.color as keyof typeof THEME_COLORS] || 'bg-blue-500';
  const themeText = themeClass.replace('bg-', 'text-');
  const themeBorder = themeClass.replace('bg-', 'border-');

  const formatTime = (timestamp: number) => {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessageContent = (msg: Message) => {
      if (msg.type === 'sticker') {
          return <img src={msg.text} alt="Sticker" className="w-32 h-32 object-contain hover:scale-105 transition-transform" />;
      }
      if (msg.type === 'image') {
          return (
            <div className="rounded-lg overflow-hidden max-w-xs sm:max-w-sm">
                <img src={msg.text} alt="Shared" className="w-full h-auto object-cover" />
            </div>
          );
      }
      if (msg.type === 'video') {
          return (
            <div className="rounded-lg overflow-hidden max-w-xs sm:max-w-sm relative group/video">
                <video src={msg.text} controls className="w-full h-auto rounded-lg bg-black" />
            </div>
          );
      }
      return <span>{msg.text}</span>;
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 relative">
      {/* Offline Warning for Humans */}
      {!contact.isAiAgent && !contact.isOnline && (
        <div className="bg-amber-500/10 text-amber-400 text-xs text-center py-1 border-b border-amber-500/20">
          User is currently offline. Messages will be delivered when they connect.
        </div>
      )}

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {/* Context Header Bubble */}
        <div className="flex justify-center mb-6">
            <div className={`text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 shadow-sm flex items-center gap-2`}>
                <span className="opacity-70">Identity:</span>
                <span className={`${themeText} font-bold`}>{persona.name}</span>
                {!contact.isAiAgent && (
                    <span className={`w-2 h-2 rounded-full ${contact.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></span>
                )}
            </div>
        </div>

        {persona.messages.map((msg) => {
          const isMe = msg.role === 'user';
          
          if (msg.isRecalled) {
              return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-500 italic">
                          {isMe ? "You recalled a message" : "Message recalled"}
                      </div>
                  </div>
              );
          }

          return (
            <div
              key={msg.id}
              className={`group flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <div className="flex flex-col items-center">
                    <img 
                    src={contact.avatar} 
                    alt={contact.name} 
                    className="w-8 h-8 rounded-full mb-1 border border-slate-700"
                    />
                </div>
              )}

              {/* Message Content Group (Bubble + Actions) */}
              <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                
                {/* Persona Name for Peers (if provided) */}
                {!isMe && msg.senderPersonaName && (
                    <span className={`text-[10px] ml-1 mb-0.5 ${themeText} font-semibold opacity-80`}>
                        as {msg.senderPersonaName}
                    </span>
                )}

                {/* Reply Context */}
                {msg.replyTo && (
                    <div className={`mb-1 px-3 py-1 rounded-lg text-xs border-l-2 bg-slate-800/50 text-slate-400 ${isMe ? 'border-slate-500' : themeBorder} opacity-80`}>
                        <span className="font-bold mr-1">{msg.replyTo.senderName}:</span>
                        {msg.replyTo.type === 'image' ? '[Image]' : 
                         msg.replyTo.type === 'video' ? '[Video]' :
                         msg.replyTo.isSticker ? '[Sticker]' : (
                             msg.replyTo.text.length > 30 ? msg.replyTo.text.substring(0, 30) + '...' : msg.replyTo.text
                        )}
                    </div>
                )}

                <div className="relative group/bubble">
                    {/* Bubble */}
                    <div
                        className={`p-3 rounded-2xl shadow-sm text-sm leading-relaxed relative
                        ${isMe
                            ? `${themeClass} text-white rounded-br-none`
                            : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                        }
                        ${(msg.type === 'sticker' || msg.type === 'image' || msg.type === 'video') ? 'bg-transparent border-none p-0 shadow-none' : ''}
                        `}
                    >
                        {renderMessageContent(msg)}
                        
                        {/* Meta Info (Time & Read Status) */}
                        <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] opacity-70 ${isMe ? 'text-white/80' : 'text-slate-400'}`}>
                            <span>{formatTime(msg.timestamp)}</span>
                            {isMe && msg.type !== 'sticker' && (
                                <span>
                                    {msg.isRead ? <CheckCheck size={12} strokeWidth={2.5} /> : <Check size={12} />}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions (Hover) */}
                    <div className={`absolute top-0 bottom-0 ${isMe ? '-left-14 pr-2' : '-right-14 pl-2'} opacity-0 group-hover/bubble:opacity-100 flex items-center gap-1 transition-opacity`}>
                        <button 
                            onClick={() => setReplyingTo(msg)}
                            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700"
                            title="Reply"
                        >
                            <Reply size={12} />
                        </button>
                        {isMe && (
                             <button 
                                onClick={() => onRecallMessage(msg.id)}
                                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 border border-slate-700"
                                title="Recall"
                            >
                                <Trash2 size={12} />
                            </button>
                        )}
                    </div>
                </div>
              </div>

              {isMe && (
                <img 
                  src={userProfile.avatar} 
                  alt={userProfile.name} 
                  className="w-8 h-8 rounded-full mb-1 border border-slate-700 object-cover"
                />
              )}
            </div>
          );
        })}
        
        {isTyping && (
          <div className="flex justify-start items-center animate-pulse">
             <img 
                src={contact.avatar} 
                alt={contact.name} 
                className="w-8 h-8 rounded-full mr-2 mt-1 border border-slate-700 opacity-70"
              />
            <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-none border border-slate-700">
               <div className="flex space-x-1">
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></div>
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></div>
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-300"></div>
               </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 z-20">
        
        {/* Reply Preview Banner */}
        {replyingTo && (
            <div className="flex items-center justify-between bg-slate-800/80 backdrop-blur-sm rounded-t-xl px-4 py-2 border border-slate-700 border-b-0 mb-1 mx-2 animate-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2 overflow-hidden">
                    <Reply size={14} className={themeText} />
                    <div className="flex flex-col">
                        <span className={`text-xs font-bold ${themeText}`}>Replying to {replyingTo.role === 'user' ? 'Me' : contact.name}</span>
                        <span className="text-xs text-slate-400 truncate max-w-[200px]">
                            {replyingTo.type === 'sticker' ? '[Sticker]' : 
                             replyingTo.type === 'image' ? '[Image]' :
                             replyingTo.type === 'video' ? '[Video]' :
                             replyingTo.text}
                        </span>
                    </div>
                </div>
                <button onClick={() => setReplyingTo(null)} className="text-slate-500 hover:text-white p-1">
                    <X size={14} />
                </button>
            </div>
        )}

        {/* Sticker Picker Popover */}
        {showStickers && (
             <div className="sticker-picker absolute bottom-20 left-4 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-3 grid grid-cols-4 gap-2 animate-in slide-in-from-bottom-5 zoom-in-95 z-50">
                 {STICKERS.map((sticker, idx) => (
                     <button 
                        key={idx} 
                        onClick={() => handleSendSticker(sticker)}
                        className="hover:bg-slate-700 rounded p-1 transition-colors"
                     >
                         <img src={sticker} alt="Sticker" className="w-full h-16 object-contain" />
                     </button>
                 ))}
             </div>
        )}

        {/* Hidden File Input */}
        <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*,video/*"
            className="hidden"
        />

        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
          
          {/* Media Button */}
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-emerald-400 transition-all border border-slate-700"
            title="Send Image/Video"
          >
             <ImageIcon size={20} />
          </button>

          <button 
            type="button"
            onClick={() => setShowStickers(!showStickers)}
            className={`sticker-btn p-3 rounded-full ${showStickers ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-400'} hover:bg-slate-700 transition-all border border-slate-700`}
          >
             <Smile size={20} />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${persona.name}...`}
            className="flex-1 bg-slate-800 text-slate-200 placeholder-slate-500 border border-slate-700 rounded-full py-3 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-slate-500 transition-all"
            disabled={isTyping && contact.isAiAgent}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || (isTyping && contact.isAiAgent)}
            className={`p-3 rounded-full ${inputText.trim() ? themeClass : 'bg-slate-800'} ${inputText.trim() ? 'text-white' : 'text-slate-500'} border border-slate-700 transition-all hover:opacity-90 disabled:opacity-50`}
          >
            {isTyping && contact.isAiAgent ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;