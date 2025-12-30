
import React, { useState, useEffect } from 'react';
import { View, AccountState, TemporalAnchor } from './types';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import VisualStudio from './components/VisualStudio';
import VideoStudio from './components/VideoStudio';
import AudioHub from './components/AudioHub';
import MindPath from './components/MindPath';
import Dashboard from './components/Dashboard';
import SynthesisCanvas from './components/SynthesisCanvas';
import MemoryVault from './components/MemoryVault';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Synthesis);
  const [account, setAccount] = useState<AccountState>({
    id: '0xUserJulia',
    fex: 1250.75,
    su: 154,
    staked: 450.0,
    intent: 'Deep Evolution',
    skillTree: { awareness: 6, compassion: 9, sovereignty: 4, creativity: 7 },
    anchors: []
  });
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    const activated = localStorage.getItem('fdcn_activated');
    if (activated) setIsActivated(true);

    const savedAnchors = localStorage.getItem('fdcn_anchors');
    if (savedAnchors) {
      setAccount(prev => ({ ...prev, anchors: JSON.parse(savedAnchors) }));
    }
  }, []);

  const handleActivation = () => {
    setIsActivated(true);
    localStorage.setItem('fdcn_activated', 'true');
    setCurrentView(View.Synthesis);
  };

  const renderView = () => {
    switch (currentView) {
      case View.Synthesis: return <SynthesisCanvas account={account} onNavigate={setCurrentView} />;
      case View.Chat: return <ChatInterface />;
      case View.Visuals: return <VisualStudio />;
      case View.Video: return <VideoStudio />;
      case View.Audio: return <AudioHub />;
      case View.Memory: return <MemoryVault anchors={account.anchors} />;
      case View.Mindpath: return <MindPath onActivation={() => setCurrentView(View.Synthesis)} />;
      default: return <SynthesisCanvas account={account} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-['Inter'] overflow-hidden">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 relative overflow-y-auto">
        {/* Floating Anchor Tool (Global) */}
        <button 
          onClick={() => {
            const newAnchor: TemporalAnchor = {
              id: Math.random().toString(36).substr(2, 9),
              title: "Manual Consciousness Anchor",
              content: "Snapshot of current intent and state captured during " + account.intent,
              type: 'text',
              timestamp: Date.now(),
              resonance: 0.85,
              source: "VAOS Interface"
            };
            const updated = [newAnchor, ...account.anchors];
            setAccount(prev => ({ ...prev, anchors: updated }));
            localStorage.setItem('fdcn_anchors', JSON.stringify(updated));
            alert("Temporal Anchor placed in the Chronos Vault.");
          }}
          className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
          title="Place Temporal Anchor"
        >
          <i className="fa-solid fa-anchor text-xl group-hover:rotate-12 transition-transform"></i>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
        </button>

        <div className="h-full">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
