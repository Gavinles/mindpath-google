
import React from 'react';
import { TemporalAnchor } from '../types';

interface MemoryVaultProps {
  anchors: TemporalAnchor[];
}

const MemoryVault: React.FC<MemoryVaultProps> = ({ anchors }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Chronos Vault</h1>
          <p className="text-slate-500">Your sovereign memory anchored across space and time.</p>
        </div>
        <div className="text-right text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
          Total Anchors: {anchors.length}
        </div>
      </div>

      {anchors.length === 0 ? (
        <div className="p-20 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-slate-300 italic">
          <i className="fa-solid fa-anchor text-5xl mb-4 opacity-20"></i>
          <p>No latent insights captured yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {anchors.map(anchor => (
            <div key={anchor.id} className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100 space-y-4 hover:scale-[1.02] transition-transform">
              <div className="flex justify-between items-start">
                <div className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  {anchor.type}
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {new Date(anchor.timestamp).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-800">{anchor.title}</h3>
              <p className="text-slate-600 line-clamp-3 text-sm leading-relaxed">{anchor.content}</p>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-50 text-[10px] font-bold text-indigo-500">
                <i className="fa-solid fa-link"></i>
                <span className="truncate">{anchor.source}</span>
                <span className="ml-auto flex items-center gap-1">
                  <i className="fa-solid fa-bolt"></i>
                  {(anchor.resonance * 100).toFixed(0)}% Resonance
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoryVault;
