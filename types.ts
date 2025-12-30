
export enum View {
  Synthesis = 'SYNTHESIS', // The Consciousness Canvas (Unified Dashboard)
  Chat = 'CHAT',           // Logos Hub (Mental)
  Visuals = 'VISUALS',     // Soma Hub (Physical)
  Mindpath = 'MINDPATH',   // Atma Hub (Spiritual)
  Memory = 'MEMORY',       // The Chronos Vault (Temporal Anchors)
  Governance = 'GOVERN',   // DAO Constitution (Sovereignty)
  Video = 'VIDEO',
  Audio = 'AUDIO'
}

export interface TemporalAnchor {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'voice';
  timestamp: number;
  resonance: number;
  source: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  groundingSources?: Array<{ uri: string; title: string }>;
  isThinking?: boolean;
  sentiment?: number;
  coherence?: number;
}

export interface AccountState {
  id: string;
  fex: number;
  su: number;
  staked: number;
  intent: string;
  skillTree: {
    awareness: number;
    compassion: number;
    sovereignty: number;
    creativity: number;
  };
  anchors: TemporalAnchor[];
}

export interface ImageResult {
  url: string;
  prompt: string;
  timestamp: number;
}

export interface VideoResult {
  url: string;
  prompt: string;
  timestamp: number;
}
