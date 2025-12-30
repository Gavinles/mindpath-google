
import React, { useState, useRef } from 'react';
import { generateImage, editImage, analyzeAsset } from '../services/geminiService';
import { blobToBase64 } from '../utils/AudioUtils';
import { saveAsset } from '../services/supabaseService';

const VisualStudio: React.FC = () => {
  const [tab, setTab] = useState<'generate' | 'edit' | 'analyze'>('generate');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isSynced, setIsSynced] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatios = ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'];

  const handleAction = async () => {
    if (loading) return;
    setLoading(true);
    setAnalysis(null);
    setIsSynced(false);

    try {
      let resUrl: string | null = null;
      if (tab === 'generate') {
        if (!prompt) return;
        resUrl = await generateImage(prompt, aspectRatio);
      } else if (tab === 'edit') {
        if (!selectedFile || !prompt) return;
        const b64 = await blobToBase64(selectedFile);
        resUrl = await editImage(prompt, b64, selectedFile.type);
      } else if (tab === 'analyze') {
        if (!selectedFile || !prompt) return;
        const b64 = await blobToBase64(selectedFile);
        const analysisText = await analyzeAsset(prompt, b64, selectedFile.type);
        setAnalysis(analysisText || "No analysis generated.");
      }

      if (resUrl) {
        setResult(resUrl);
        // Persist generated image metadata
        await saveAsset(resUrl, prompt, 'image');
        setIsSynced(true);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setResult(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-200 w-fit mx-auto sticky top-0 z-10">
        {(['generate', 'edit', 'analyze'] as const).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setResult(null); setSelectedFile(null); setAnalysis(null); setIsSynced(false); }}
            className={`px-8 py-2.5 rounded-xl font-semibold capitalize transition-all ${
              tab === t ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Controls */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-bold text-slate-700">Prompt</label>
              {isSynced && <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-tighter animate-pulse-subtle">Archived to Cloud</span>}
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={tab === 'generate' ? "A futuristic neon city in cyberpunk style..." : "What do you want to do with this image?"}
              className="w-full bg-slate-50 border-slate-200 rounded-2xl p-5 text-slate-800 focus:ring-4 focus:ring-indigo-500/10 min-h-[140px] transition-all font-medium border focus:border-indigo-300"
            />

            {(tab === 'edit' || tab === 'analyze') && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">Source Image</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group"
                >
                  <i className="fa-solid fa-cloud-arrow-up text-3xl text-slate-300 mb-3 group-hover:text-indigo-400 transition-colors"></i>
                  <span className="text-slate-500 text-sm font-medium">{selectedFile ? selectedFile.name : "Click to upload an image"}</span>
                  <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>
              </div>
            )}

            {tab === 'generate' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">Aspect Ratio</label>
                <div className="grid grid-cols-4 gap-2">
                  {aspectRatios.map(ratio => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        aspectRatio === ratio 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/30'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleAction}
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Synthesizing...
                </>
              ) : (
                <>
                  <i className={`fa-solid ${tab === 'analyze' ? 'fa-magnifying-glass' : 'fa-wand-magic-sparkles'}`}></i>
                  {tab === 'generate' ? 'Generate Artwork' : tab === 'edit' ? 'Apply Edits' : 'Analyze Image'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Display */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] aspect-square overflow-hidden relative group shadow-2xl border-8 border-white/5">
            {result ? (
              <img src={result} className="w-full h-full object-contain" alt="Generated result" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-12 text-center">
                <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mb-6">
                   <i className="fa-solid fa-image text-3xl opacity-20"></i>
                </div>
                <p className="text-sm font-bold text-slate-400">Your visual output will appear here</p>
                <p className="text-xs text-slate-600 mt-2">Ready to render in 1K high definition</p>
              </div>
            )}
            {loading && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-white font-bold text-lg tracking-tight">Crafting Pixels...</span>
                </div>
              </div>
            )}
          </div>
          
          {analysis && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 animate-in slide-in-from-bottom-4 duration-500">
              <h3 className="font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-robot text-indigo-500"></i> Analysis Results
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">{analysis}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualStudio;
