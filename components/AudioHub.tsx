
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { createPcmBlob, decode, decodeAudioData } from '../utils/AudioUtils';
import { textToSpeech } from '../services/geminiService';

const AudioHub: React.FC = () => {
  const [isLive, setIsLive] = useState(false);
  const [ttsInput, setTtsInput] = useState('');
  const [ttsLoading, setTtsLoading] = useState(false);
  const [transcriptions, setTranscriptions] = useState<string[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  const toggleLive = async () => {
    if (isLive) {
      sessionRef.current?.close();
      streamRef.current?.getTracks().forEach(t => t.stop());
      setIsLive(false);
      return;
    }

    try {
      // Guideline: Initialize using a named parameter and the exact environment variable
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: 'You are a friendly companion. Be concise but warm.'
        },
        callbacks: {
          onopen: () => {
            setIsLive(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const blob = createPcmBlob(inputData);
              // Guideline: Initiate sendRealtimeInput only after connection resolves
              sessionPromise.then(s => s.sendRealtimeInput({ media: blob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.outputTranscription) {
               setTranscriptions(prev => [...prev.slice(-10), `AI: ${msg.serverContent!.outputTranscription!.text}`]);
            }
            if (msg.serverContent?.inputTranscription) {
               setTranscriptions(prev => [...prev.slice(-10), `You: ${msg.serverContent!.inputTranscription!.text}`]);
            }

            const base64 = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(base64), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              // Guideline: Schedule gapless playback using a running timestamp cursor
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => console.error("Live API Error", e),
          onclose: () => setIsLive(false)
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      alert("Microphone access denied or session failed.");
    }
  };

  const handleTTS = async () => {
    if (!ttsInput.trim() || ttsLoading) return;
    setTtsLoading(true);
    try {
      const b64 = await textToSpeech(ttsInput);
      if (b64) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const buffer = await decodeAudioData(decode(b64), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start();
      }
    } finally {
      setTtsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-12">
      {/* Live Voice Section */}
      <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100 text-center space-y-8 relative overflow-hidden">
        {isLive && (
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 overflow-hidden">
            <div className="w-1/2 h-full bg-indigo-300 animate-[shimmer_2s_infinite]"></div>
          </div>
        )}
        
        <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mx-auto relative">
          {isLive && (
            <div className="absolute inset-0 rounded-full border-4 border-indigo-400 animate-ping opacity-25"></div>
          )}
          <i className={`fa-solid fa-microphone text-5xl transition-colors ${isLive ? 'text-indigo-600' : 'text-slate-300'}`}></i>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Live Voice Chat</h2>
          <p className="text-slate-500">Real-time low-latency interaction using Gemini 2.5 Native Audio</p>
        </div>

        <button 
          onClick={toggleLive}
          className={`px-12 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${
            isLive ? 'bg-red-500 text-white shadow-red-200' : 'bg-indigo-600 text-white shadow-indigo-200'
          }`}
        >
          {isLive ? 'End Conversation' : 'Start Live Session'}
        </button>

        {transcriptions.length > 0 && (
          <div className="mt-8 bg-slate-50 p-6 rounded-2xl text-left h-48 overflow-y-auto space-y-2 border border-slate-200">
            {transcriptions.map((t, i) => (
              <p key={i} className={`text-sm ${t.startsWith('You') ? 'text-indigo-600 font-medium' : 'text-slate-700'}`}>{t}</p>
            ))}
          </div>
        )}
      </div>

      {/* TTS Section */}
      <div className="bg-slate-900 rounded-3xl p-10 shadow-2xl text-white">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <i className="fa-solid fa-waveform-lines text-indigo-400"></i> Text to Speech Studio
        </h3>
        <div className="flex gap-4">
          <input 
            type="text"
            value={ttsInput}
            onChange={(e) => setTtsInput(e.target.value)}
            placeholder="Type something to hear it in high fidelity..."
            className="flex-1 bg-slate-800 border-none rounded-xl px-6 py-4 text-white focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            onClick={handleTTS}
            disabled={ttsLoading}
            className="px-8 py-4 bg-indigo-500 rounded-xl font-bold hover:bg-indigo-400 transition-colors disabled:opacity-50"
          >
            {ttsLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : 'Speak'}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-4 italic">Powered by gemini-2.5-flash-preview-tts (Voice: Kore)</p>
      </div>
    </div>
  );
};

export default AudioHub;
