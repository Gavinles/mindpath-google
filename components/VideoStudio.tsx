
import React, { useState, useRef } from 'react';
import { generateVeoVideo, analyzeAsset } from '../services/geminiService';
import { blobToBase64 } from '../utils/AudioUtils';
import { saveAsset } from '../services/supabaseService';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const VideoStudio: React.FC = () => {
  const [tab, setTab] = useState<'create' | 'analyze'>('create');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isSynced, setIsSynced] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAction = async () => {
    if (loading) return;

    // Guideline: Check whether an API key has been selected before using Veo models
    if (tab === 'create') {
      try {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await window.aistudio.openSelectKey();
          // Assume success to proceed to the app after triggering selection
        }
      } catch (e) {
        console.warn("API Key selection failed", e);
      }
    }

    setLoading(true);
    setAnalysis(null);
    setIsSynced(false);

    try {
      if (tab === 'create') {
        const b64 = selectedFile ? await blobToBase64(selectedFile) : undefined;
        const url = await generateVeoVideo(prompt, b64, selectedFile?.type, aspectRatio);
        setVideoUrl(url);
        // Persist Video metadata
        await saveAsset(url, prompt, 'video');
        setIsSynced(true);
      } else {
        if (!selectedFile || !prompt) return;
        const b64 = await blobToBase64(selectedFile);
        const res = await analyzeAsset(prompt, b64, selectedFile.type);
        setAnalysis(res || "No insights found.");
      }
    } catch (err: any) {
      // Guideline: If request fails with entity not found, prompt to select a key again
      if (err.message?.includes("Requested entity was not found")) {
        await window.aistudio.openSelectKey();
      }
      alert("Error processing request. Ensure your API Key has billing enabled for Veo.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 mb-8 overflow-hidden relative">
        <div className="flex gap-4 mb-10 p-1.5 bg-slate-100 rounded-2xl w-fit mx-auto border border-slate-200">
          <button 
            onClick={() => { setTab('create'); setAnalysis(null); setIsSynced(false); }}
            className={`px-8 py-2.5 rounded-xl font-bold transition-all ${tab === 'create' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Animate with Veo
          </button>
          <button 
             onClick={() => { setTab('analyze'); setVideoUrl(null); setIsSynced(false); }}
             className={`px-8 py-2.5 rounded-xl font-bold transition-all ${tab === 'analyze' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Video Understanding
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-extrabold text-slate-700 uppercase tracking-wider">
                  {tab === 'create' ? 'Animation Concept' : 'Extraction Query'}
                </label>
                {isSynced && <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 animate-pulse">Sync Active</span>}
              </div>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={tab === 'create' ? "A cat driving a neon hovercar through a digital nebula..." : "Summarize the key cinematic beats in this sequence..."}
                className="w-full bg-slate-50 border-slate-200 rounded-[2rem] p-6 min-h-[160px] focus:ring-4 focus:ring-indigo-500/10 text-slate-800 font-medium border focus:border-indigo-300 transition-all"
              />
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`w-full border-2 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center justify-center cursor-pointer transition-all ${selectedFile ? 'border-indigo-400 bg-indigo-50/20' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50 group'}`}
            >
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-4 transition-all ${selectedFile ? 'bg-indigo-100' : 'bg-slate-100 group-hover:bg-indigo-100'}`}>
                <i className={`fa-solid ${tab === 'create' ? 'fa-image' : 'fa-video'} text-2xl ${selectedFile ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'}`}></i>
              </div>
              <span className="font-bold text-slate-700">
                {selectedFile ? selectedFile.name : `Upload ${tab === 'create' ? 'Reference Frame' : 'Source Video'}`}
              </span>
              <p className="text-xs text-slate-400 mt-2 font-medium">MP4 / PNG / JPG (Max 50MB)</p>
              <input ref={fileInputRef} type="file" className="hidden" accept={tab === 'create' ? 'image/*' : 'video/*'} onChange={handleFileChange} />
            </div>

            {tab === 'create' && (
              <div className="flex gap-4">
                <button onClick={() => setAspectRatio('16:9')} className={`flex-1 py-4 rounded-2xl border-2 text-sm font-extrabold transition-all ${aspectRatio === '16:9' ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100' : 'border-slate-100 text-slate-400 hover:border-slate-300'}`}>16:9 Cinema</button>
                <button onClick={() => setAspectRatio('9:16')} className={`flex-1 py-4 rounded-2xl border-2 text-sm font-extrabold transition-all ${aspectRatio === '9:16' ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100' : 'border-slate-100 text-slate-400 hover:border-slate-300'}`}>9:16 Mobile</button>
              </div>
            )}

            <button 
              onClick={handleAction}
              disabled={loading || (!prompt && tab === 'create')}
              className="w-full py-5 rounded-[2rem] bg-slate-900 hover:bg-black text-white font-black text-xl shadow-2xl shadow-slate-200 flex items-center justify-center gap-4 transition-all disabled:opacity-50 active:scale-95"
            >
              {loading ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div> : <i className="fa-solid fa-clapperboard"></i>}
              {loading ? 'Compiling Sequence...' : tab === 'create' ? 'Generate Video' : 'Analyze Sequence'}
            </button>
          </div>

          <div className="bg-slate-950 rounded-[3rem] overflow-hidden relative min-h-[500px] flex items-center justify-center border-[12px] border-slate-900 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]">
            {videoUrl ? (
              <video src={videoUrl} controls className="w-full h-full object-contain" autoPlay loop />
            ) : analysis ? (
              <div className="w-full h-full bg-white p-10 overflow-y-auto">
                 <h3 className="font-black text-slate-900 text-2xl mb-6 border-b-4 border-indigo-500 pb-2 w-fit">Cinematic Insights</h3>
                 <p className="text-slate-700 whitespace-pre-wrap font-medium leading-relaxed">{analysis}</p>
              </div>
            ) : (
              <div className="text-center p-12">
                <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-slate-800 shadow-inner">
                  <i className="fa-solid fa-film text-slate-700 text-4xl"></i>
                </div>
                <h4 className="text-white text-2xl font-black mb-3">Visual Laboratory</h4>
                <p className="text-slate-500 text-sm max-w-[280px] font-medium leading-relaxed mx-auto">Upload an asset or enter a prompt to begin high-fidelity neural rendering.</p>
              </div>
            )}
            
            {loading && tab === 'create' && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-8"></div>
                <h3 className="text-white text-3xl font-black mb-4 tracking-tight">Rendering Magic</h3>
                <div className="space-y-4 max-w-sm">
                  <p className="text-indigo-400 text-lg font-bold animate-pulse italic">"Veo is weaving temporal consistency..."</p>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-normal">This process uses advanced neural video architecture. Estimated time: 120s.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoStudio;
