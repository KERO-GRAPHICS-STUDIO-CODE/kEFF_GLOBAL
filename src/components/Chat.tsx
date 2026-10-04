import React, { useState } from 'react';
import { Send, Camera, Info, ShieldCheck, Badge } from 'lucide-react';

interface ChatProps {
  isAdminView?: boolean;
  userRole?: 'buyer' | 'seller';
}

const Chat: React.FC<ChatProps> = ({ isAdminView = false, userRole = 'buyer' }) => {
  const [messages, setMessages] = useState<{ id: number; text: string; isMine: boolean; isSystem?: boolean }[]>([
    { id: 1, text: "Chat started securely.", isMine: false, isSystem: true },
    { id: 2, text: "Is this still available?", isMine: true },
    { id: 3, text: "Yes, it is! Let me know if you need a live video capture.", isMine: false },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages([...messages, { id: Date.now(), text: inputValue, isMine: true }]);
    setInputValue("");
  };

  const handleSystemAction = (action: string) => {
    setMessages([...messages, { id: Date.now(), text: `Action requested: ${action}`, isMine: true, isSystem: true }]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] w-full max-w-lg mx-auto bg-slate-50 dark:bg-slate-900 overflow-hidden">

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 font-bold">
            U
          </div>
          <div>
            <div className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              User123
              {isAdminView && (
                <span className={`text-[10px] uppercase font-black px-1.5 py-0.5 rounded ${userRole === 'seller' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                  {userRole}
                </span>
              )}
            </div>
            <div className="text-xs text-green-500 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Secure P2P
            </div>
          </div>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isSystem ? 'justify-center' : (msg.isMine ? 'justify-end' : 'justify-start')}`}>
            {msg.isSystem ? (
              <div className="bg-slate-200/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs px-4 py-2 rounded-full font-medium flex items-center gap-2">
                <Info className="w-3 h-3" /> {msg.text}
              </div>
            ) : (
              <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm ${
                msg.isMine
                  ? 'bg-indigo-600 text-white rounded-tr-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-sm shadow-sm'
              }`}>
                {msg.text}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-slate-800 p-3 border-t border-slate-200 dark:border-slate-700">
        {/* System Actions Row */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1 hide-scrollbar">
          <button onClick={() => handleSystemAction("Request Video")} className="whitespace-nowrap bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1">
            <Camera className="w-3 h-3" /> Request Video
          </button>
          <button onClick={() => handleSystemAction("Send Quotation")} className="whitespace-nowrap bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors">
            Send Quotation
          </button>
        </div>

        <div className="flex items-center gap-2 relative">
          {/* File Upload is strictly disabled per requirements */}
          <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center px-4 border border-slate-200 dark:border-slate-700 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a secure message..."
              className="flex-1 bg-transparent py-3 text-sm outline-none text-slate-800 dark:text-white"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
