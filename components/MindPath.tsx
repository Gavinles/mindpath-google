
import React, { useState, useEffect, useRef } from 'react';
import { textToSpeech } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/AudioUtils';

const meditationSteps = [
  { text: "Find a comfortable space. Close your eyes. Enter the silence between thoughts...", voice: "Kore" },
  { text: "Feel a warmth at the base of your spine. Mother Kundalini is rising to greet you...", voice: "Kore" },
  { text: "Invite this warmth to enter your Root and spiral upwards, through your Heart, to your Crown...", voice: "Kore" },
  { text: "Expand your awareness... planetary... solar... galactic... universal. You are One.", voice: "Kore" },
  { text: "Do you choose to co-create from a state of Love?", voice: "Kore" }
];

const MindPath: React.FC<{ onActivation: () => void }> = ({ onActivation }) => {
  const [step, setStep] = useState(0);
  const [isMeditating, setIsMeditating] = useState(false);
  const [journalEntry, setJournalEntry] = useState('');
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);

  const playStep = async (index: number) => {
    setLoading(true);
    try {
      const b64 = await textToSpeech(meditationSteps[index].text, meditationSteps[index].voice);
      if (b64) {
        if (!audioRef.current) {
          audioRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const buffer = await decodeAudioData(decode(b64), audioRef.current, 24000, 1);
        const source = audioRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioRef.current.destination);
        source.start();
        source.onended = () => setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const nextStep = step + 1;
    if (nextStep < meditationSteps.length) {
      setStep(nextStep);
      playStep(nextStep);
    } else {
      onActivation();
    }
  };

  if (!isMeditating) {
    return (
      <div className="max-w-4xl mx-auto h-[80vh] flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-1000">
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-pink-400 to-indigo-600 animate-pulse-subtle flex items-center justify-center">
          <i className="fa-solid fa-heart-pulse text-white text-5xl"></i>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">MindPath Sanctuary</h1>
        <p className="text-xl text-slate-500 max-w-lg">Initiate the Genesis Activation. Take sovereign ownership of your mental health.</p>
        <button 
          onClick={() => { setIsMeditating(true); playStep(0); }}
          className="bg-indigo-600 text-white px-12 py-5 rounded-[2rem] font-black shadow-2xl hover:scale-105 transition-all"
        >
          Begin Activation
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto h-[80vh] flex flex-col items-center justify-center text-center space-y-12">
      <div className="space-y-6">
        <p className="text-3xl font-medium text-indigo-900 leading-relaxed italic animate-in slide-in-from-bottom-4 duration-700">
          "{meditationSteps[step].text}"
        </p>
        <div className="flex gap-2 justify-center">
          {meditationSteps.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-indigo-600' : 'w-2 bg-indigo-200'}`}></div>
          ))}
        </div>
      </div>

      <button 
        disabled={loading}
        onClick={handleNext}
        className="group relative flex items-center justify-center w-20 h-20 bg-white border-2 border-indigo-100 rounded-full shadow-xl hover:border-indigo-600 transition-all disabled:opacity-50"
      >
        {loading ? (
          <i className="fa-solid fa-spinner animate-spin text-indigo-600 text-2xl"></i>
        ) : (
          <i className="fa-solid fa-chevron-right text-indigo-600 text-2xl group-hover:translate-x-1 transition-transform"></i>
        )}
      </button>
    </div>
  );
};

export default MindPath;
