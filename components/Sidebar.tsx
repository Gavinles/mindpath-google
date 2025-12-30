
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: View.Synthesis, icon: 'fa-table-columns', label: 'Canvas' },
    { id: View.Mindpath, icon: 'fa-heart-pulse', label: 'Sanctuary' },
    { id: View.Memory, icon: 'fa-anchor', label: 'Vault' },
    { id: View.Chat, icon: 'fa-comments', label: 'MindChat' },
    { id: View.Visuals, icon: 'fa-palette', label: 'Visuals' },
    { id: View.Video, icon: 'fa-film', label: 'Video' },
    { id: View.Audio, icon: 'fa-microphone', label: 'Audio' },
  ];

  return (
    <div className="w-20 md:w-64 bg-slate-950 text-white h-full flex flex-col items-center py-8 transition-all duration-300 overflow-hidden border-r border-white/5">
      <div className="mb-10 flex items-center gap-3 px-4">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <i className="fa-solid fa-brain text-xl"></i>
        </div>
        <span className="text-xl font-black hidden md:block tracking-tighter">MindPath</span>
      </div>

      <nav className="flex-1 w-full space-y-2 px-3 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              currentView === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                : 'text-slate-500 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-6 text-lg`}></i>
            <span className="hidden md:block font-bold text-xs tracking-tight uppercase">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto px-4 w-full pt-8 border-t border-white/5">
        <div className="bg-white/5 p-4 rounded-2xl hidden md:block border border-white/5">
          <p className="text-[10px] text-slate-500 mb-2 uppercase font-black tracking-widest font-mono">Quantum Key</p>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[10px] font-mono text-slate-300 truncate">did:fdcn:AAVDRED...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
