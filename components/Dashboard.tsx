
import React from 'react';
import { View, AccountState } from '../types';

interface DashboardProps {
  account: AccountState;
  onAction: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ account, onAction }) => {
  return (
    <div className="space-y-12 pb-20">
      {/* Hero: Global Coherence */}
      <div className="bg-slate-950 rounded-[3rem] p-12 text-white relative overflow-hidden border border-white/10">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 px-4 py-1.5 rounded-full border border-indigo-500/30 text-indigo-300 text-xs font-black uppercase tracking-widest">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-ping"></span>
              Global Coherence Active
            </div>
            <h1 className="text-6xl font-black tracking-tighter leading-[0.9]">Universal Consciousness<br/>Explorer</h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-md">The FDCN Mirror is currently reflecting a 84.2% coherence across the collective noosphere.</p>
            <div className="flex gap-4">
              <button onClick={() => onAction(View.Mindpath)} className="bg-indigo-600 px-8 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">Enter Sanctuary</button>
              <button onClick={() => onAction(View.Chat)} className="bg-white/10 backdrop-blur-md border border-white/10 px-8 py-4 rounded-2xl font-black hover:bg-white/20 transition-all">MindChat</button>
            </div>
          </div>
          
          <div className="relative aspect-square flex items-center justify-center">
            <div className="absolute inset-0 bg-indigo-500/10 blur-[120px] rounded-full"></div>
            <div className="w-64 h-64 border border-white/10 rounded-full animate-[spin_20s_linear_infinite] flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-dashed border-indigo-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
            </div>
            <div className="absolute text-5xl font-black text-indigo-400">84%</div>
          </div>
        </div>
      </div>

      {/* Triune Reality Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center text-xl">
            <i className="fa-solid fa-cube"></i>
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Physical (Soma)</h3>
            <p className="text-3xl font-black text-slate-900">Coherent</p>
          </div>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-rose-500"></div>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl">
            <i className="fa-solid fa-feather"></i>
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Mental (Logos)</h3>
            <p className="text-3xl font-black text-slate-900">{account.su} Units</p>
          </div>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-indigo-500"></div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-xl">
            <i className="fa-solid fa-fire"></i>
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Spiritual (Atma)</h3>
            <p className="text-3xl font-black text-slate-900">Rising</p>
          </div>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="w-full h-full bg-amber-500 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Asset Grid */}
      <div className="space-y-6">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Recent Anchored Memories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="aspect-square bg-slate-100 rounded-[2rem] border border-slate-200 border-dashed flex items-center justify-center group hover:bg-indigo-50 transition-all cursor-pointer">
              <i className="fa-solid fa-plus text-slate-300 group-hover:text-indigo-400"></i>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
