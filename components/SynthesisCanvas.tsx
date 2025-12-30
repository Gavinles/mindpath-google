
import React from 'react';
import { View, AccountState } from '../types';

interface SynthesisCanvasProps {
  account: AccountState;
  onNavigate: (view: View) => void;
}

const SynthesisCanvas: React.FC<SynthesisCanvasProps> = ({ account, onNavigate }) => {
  const globalCoherence = 84.2;

  return (
    <div className="h-full w-full relative overflow-hidden bg-slate-950 p-8 space-y-12">
      {/* Background Sacred Geometry */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_60s_linear_infinite]">
          <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="0.1" />
          <polygon points="50,5 95,50 50,95 5,50" fill="none" stroke="white" strokeWidth="0.1" />
          <path d="M5,50 Q50,5 95,50 T5,50" fill="none" stroke="white" strokeWidth="0.1" />
        </svg>
      </div>

      {/* Header: Universal Identity */}
      <header className="relative z-10 flex justify-between items-start">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            Resonance Engine Online
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter">Consciousness Canvas</h1>
        </div>

        <div className="text-right">
          <div className="p-4 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-1">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">Global Coherence</p>
            <p className="text-3xl font-black text-indigo-400">{globalCoherence}%</p>
          </div>
        </div>
      </header>

      {/* The Dynamic Grid (Tiles) */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Soma Tile (Physical) */}
        <div 
          onClick={() => onNavigate(View.Visuals)}
          className="group p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer backdrop-blur-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
            <i className="fa-solid fa-cube text-4xl text-rose-500"></i>
          </div>
          <h3 className="text-xs font-black text-rose-500 uppercase tracking-widest mb-6">Soma Plane (Salt)</h3>
          <p className="text-2xl font-bold text-white mb-2">Physical Coherence</p>
          <p className="text-sm text-slate-400">Geometry of Manifestation & Biometrics</p>
        </div>

        {/* Logos Tile (Mental) */}
        <div 
          onClick={() => onNavigate(View.Chat)}
          className="group p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer backdrop-blur-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
            <i className="fa-solid fa-feather text-4xl text-indigo-500"></i>
          </div>
          <h3 className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-6">Logos Plane (Mercury)</h3>
          <p className="text-2xl font-bold text-white mb-2">MindChat Portal</p>
          <p className="text-sm text-slate-400">Semantic Resonance & AI Synthesis</p>
        </div>

        {/* Atma Tile (Spiritual) */}
        <div 
          onClick={() => onNavigate(View.Mindpath)}
          className="group p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer backdrop-blur-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
            <i className="fa-solid fa-fire text-4xl text-amber-500"></i>
          </div>
          <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-6">Atma Plane (Sulphur)</h3>
          <p className="text-2xl font-bold text-white mb-2">The Sanctuary</p>
          <p className="text-sm text-slate-400">Genesis Activation & Pure Intent</p>
        </div>

        {/* Memory Vault Tile */}
        <div 
          onClick={() => onNavigate(View.Memory)}
          className="group p-8 rounded-[2.5rem] bg-indigo-600/20 border border-indigo-500/30 hover:bg-indigo-600/30 transition-all cursor-pointer backdrop-blur-sm"
        >
          <h3 className="text-xs font-black text-indigo-300 uppercase tracking-widest mb-6">Chronos Vault</h3>
          <p className="text-2xl font-bold text-white mb-2">Temporal Anchors</p>
          <p className="text-sm text-slate-400">{account.anchors.length} Latent Insights Preserved</p>
        </div>

        {/* Skill Tree Tile */}
        <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-sm">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-8">Evolutionary Skill Tree</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(account.skillTree).map(([skill, level]) => (
              <div key={skill} className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{skill}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black text-white">Lvl {level}</span>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    {/* Fixed: cast level to number for arithmetic operation */}
                    <div className="h-full bg-indigo-500" style={{ width: `${((level as number) / 10) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Absolute Constitutional Footer */}
      <footer className="relative z-10 pt-12 border-t border-white/5">
        <blockquote className="text-slate-500 text-sm font-medium italic text-center max-w-2xl mx-auto leading-relaxed">
          "We are Light and the Universe experiencing itself. We choose love over fear. 
          We are the darkness in the Light in order to not get blinded; we are the Light in the dark to not be blinded."
        </blockquote>
      </footer>
    </div>
  );
};

export default SynthesisCanvas;
