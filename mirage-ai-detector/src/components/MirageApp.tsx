import React, { useState, useRef } from 'react';
import { usePhone } from '../context/PhoneContext';
import { Eye, Upload, ShieldCheck, Settings, Info, History, BookOpen, Share2, Database, Cpu, CheckCircle2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { extractFramesFromVideoFile, downscaleImage } from '../utils/mediaUtils';
import { ModelType } from '../types';

type Tab = 'scanner' | 'history' | 'guide' | 'model';

export const MirageApp = () => {
  const { isBubbleEnabled, setIsBubbleEnabled, analyzeMediaContent, analyzingState, history, selectedModel, setSelectedModel } = usePhone();
  const [activeTab, setActiveTab] = useState<Tab>('scanner');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [datasetStatus, setDatasetStatus] = useState<'idle' | 'uploading' | 'success'>('idle');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (file.type.startsWith('video/')) {
        const frames = await extractFramesFromVideoFile(file, 10);
        const displayImage = `data:image/jpeg;base64,${frames[0].base64Data}`;
        analyzeMediaContent(frames, displayImage);
      } else {
        const url = URL.createObjectURL(file);
        const frame = await downscaleImage(url);
        const displayImage = `data:image/jpeg;base64,${frame.base64Data}`;
        analyzeMediaContent([frame], displayImage);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error processing file", error);
    }
  };

  const handleShare = async (score: number, reason: string) => {
    const text = `Mirage AI Detection\nProbability: ${score}%\nReason: ${reason}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Mirage Analysis', text });
      } catch (e) {}
    } else {
      alert("Sharing not supported on this browser.\n\n" + text);
    }
  };

  const handleDatasetUpload = () => {
    setDatasetStatus('uploading');
    setTimeout(() => {
      setDatasetStatus('success');
      setTimeout(() => setDatasetStatus('idle'), 3000);
    }, 2000);
  };

  return (
    <div className="w-full h-full bg-black text-white pt-14 flex flex-col font-sans">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
            <Eye className="text-white/80" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-medium tracking-tight">Mirage</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Detection Engine</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-6 py-2 gap-6 border-b border-white/5 overflow-x-auto no-scrollbar shrink-0">
        <TabButton active={activeTab === 'scanner'} onClick={() => setActiveTab('scanner')} label="Scanner" />
        <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} label="History" />
        <TabButton active={activeTab === 'model'} onClick={() => setActiveTab('model')} label="Model" />
        <TabButton active={activeTab === 'guide'} onClick={() => setActiveTab('guide')} label="Guide" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 relative">
        <AnimatePresence mode="wait">
          {activeTab === 'scanner' && (
            <motion.div 
              key="scanner"
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="space-y-6"
            >
              {/* Status Card */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center">
                    <ShieldCheck className="text-emerald-400" size={24} />
                  </div>
                  <div>
                    <h2 className="font-medium text-white/90">Protection Active</h2>
                    <p className="text-xs text-white/50 font-light">{selectedModel === 'gemini-3.1-pro' ? 'Gemini 3.1 Pro' : 'Mirage 1.0 (Self-Learning)'}</p>
                  </div>
                </div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></div>
              </div>

              {/* Settings */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-medium text-white/40 uppercase tracking-widest pl-2">
                  Settings
                </h3>
                <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-5 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white/90">Floating Bubble</div>
                    <div className="text-xs text-white/50 font-light">Quick access over other apps</div>
                  </div>
                  <button 
                    className={`w-12 h-6 rounded-full transition-colors relative ${isBubbleEnabled ? 'bg-white/20' : 'bg-white/5'}`}
                    onClick={() => setIsBubbleEnabled(!isBubbleEnabled)}
                  >
                    <motion.div 
                      className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
                      animate={{ left: isBubbleEnabled ? '26px' : '2px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>

              {/* Manual Upload */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-medium text-white/40 uppercase tracking-widest pl-2">
                  Manual Analysis
                </h3>
                
                <div 
                  className="border border-dashed border-white/20 bg-white/5 backdrop-blur-md rounded-3xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                    <Upload className="text-white/60" size={20} />
                  </div>
                  <div className="text-sm text-white/60 text-center font-light">
                    Tap to upload media for analysis
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                  />
                </div>

                <AnimatePresence>
                  {analyzingState.image && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 space-y-5 overflow-hidden"
                    >
                      <img src={analyzingState.image} alt="Selected" className="w-full h-48 object-cover rounded-2xl" />
                      
                      {analyzingState.isAnalyzing ? (
                        <div className="flex flex-col items-center py-6 gap-4">
                          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          <div className="text-xs text-white/50 font-light">Analyzing with {selectedModel === 'gemini-3.1-pro' ? 'Gemini' : 'Mirage 1.0'}...</div>
                        </div>
                      ) : analyzingState.result ? (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-4"
                        >
                          <div className="flex justify-between items-end">
                            <span className="text-xs text-white/50">AI Probability</span>
                            <span className={`text-3xl font-light tracking-tight ${analyzingState.result.score > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                              {analyzingState.result.score}%
                            </span>
                          </div>
                          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              className={`h-full ${analyzingState.result.score > 50 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${analyzingState.result.score}%` }}
                              transition={{ duration: 1, ease: 'easeOut' }}
                            />
                          </div>
                          <div className="bg-white/5 p-4 rounded-2xl text-sm flex gap-3 items-start mt-4">
                            <Info className="text-white/40 shrink-0 mt-0.5" size={16} />
                            <p className="text-white/70 font-light leading-relaxed">{analyzingState.result.reason}</p>
                          </div>
                          <button 
                            onClick={() => handleShare(analyzingState.result!.score, analyzingState.result!.reason)}
                            className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 text-white/80 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                          >
                            <Share2 size={16} /> Share Result
                          </button>
                        </motion.div>
                      ) : null}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="space-y-4"
            >
              {history.length === 0 ? (
                <div className="text-center text-white/30 py-20">
                  <History size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-light">No analysis history yet.</p>
                </div>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-4 flex gap-4 items-center">
                    <img src={item.image} alt="History" className="w-16 h-16 rounded-2xl object-cover" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className={`text-lg font-light ${item.result.score > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {item.result.score}% AI
                        </span>
                        <span className="text-[10px] text-white/40">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-white/50 font-light line-clamp-2 mt-1">{item.result.reason}</p>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'model' && (
            <motion.div 
              key="model"
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="space-y-6"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-6">
                
                {/* Model Selection */}
                <div>
                  <h3 className="font-medium text-white/90 mb-4 flex items-center gap-2">
                    <Cpu className="text-white/60" size={18} /> Backend Model
                  </h3>
                  
                  <div className="space-y-3">
                    <div 
                      className={`p-5 rounded-3xl border cursor-pointer transition-all duration-300 ${selectedModel === 'gemini-3.1-pro' ? 'border-white/30 bg-white/10' : 'border-white/5 bg-transparent hover:bg-white/5'}`}
                      onClick={() => setSelectedModel('gemini-3.1-pro')}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-white/90">Gemini 3.1 Pro</span>
                        {selectedModel === 'gemini-3.1-pro' && <CheckCircle2 className="text-white" size={18} />}
                      </div>
                      <p className="text-xs text-white/50 font-light leading-relaxed">Pre-trained on massive datasets. Highly accurate out-of-the-box.</p>
                    </div>

                    <div 
                      className={`p-5 rounded-3xl border cursor-pointer transition-all duration-300 ${selectedModel === 'mirage-1.0' ? 'border-white/30 bg-white/10' : 'border-white/5 bg-transparent hover:bg-white/5'}`}
                      onClick={() => setSelectedModel('mirage-1.0')}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-white/90 flex items-center gap-2">
                          Mirage 1.0 <span className="bg-white/10 text-white/70 text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full">Self-Learning</span>
                        </span>
                        {selectedModel === 'mirage-1.0' && <CheckCircle2 className="text-white" size={18} />}
                      </div>
                      <p className="text-xs text-white/50 font-light leading-relaxed">Custom model that learns from every user scan to improve detection of novel AI artifacts.</p>
                    </div>
                  </div>
                </div>

                <div className="h-px w-full bg-white/5" />

                {/* Fine Tuning */}
                <div>
                  <h4 className="text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
                    <Database size={16} className="text-white/60" /> Fine-Tuning
                  </h4>
                  <p className="text-xs text-white/50 font-light mb-4">
                    Upload scraped datasets to accelerate Mirage 1.0's learning process.
                  </p>

                  <div 
                    className="border border-dashed border-white/20 bg-white/5 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => datasetStatus === 'idle' && handleDatasetUpload()}
                  >
                    {datasetStatus === 'idle' && (
                      <>
                        <Upload className="text-white/40" size={20} />
                        <div className="text-xs text-white/50 text-center font-light">
                          Upload ZIP of scraped videos
                        </div>
                      </>
                    )}
                    {datasetStatus === 'uploading' && (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <div className="text-xs text-white/70">Uploading dataset...</div>
                      </>
                    )}
                    {datasetStatus === 'success' && (
                      <>
                        <CheckCircle2 className="text-emerald-400" size={20} />
                        <div className="text-xs text-emerald-400">Dataset queued for training</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'guide' && (
            <motion.div 
              key="guide"
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="space-y-6"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-5">
                <h3 className="text-lg font-medium text-white/90 flex items-center gap-2">
                  <BookOpen size={20} className="text-white/60" /> User Guide
                </h3>
                
                <div className="space-y-5 text-sm text-white/70 font-light leading-relaxed">
                  <p>
                    <strong className="text-white/90 font-medium">What is Mirage?</strong><br/>
                    Mirage is an AI detection engine that analyzes images and videos to determine if they are AI-generated.
                  </p>
                  
                  <p>
                    <strong className="text-white/90 font-medium">How to use it:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-3 text-white/60">
                    <li><strong>Floating Bubble:</strong> Tap the bubble to instantly analyze the current video. It captures 10 adjacent frames to check for temporal consistency.</li>
                    <li><strong>Quick Settings:</strong> Pull down your notification shade and tap the Mirage icon.</li>
                    <li><strong>Manual Upload:</strong> Use the Scanner tab to upload a video. It will extract 10 frames evenly spaced across the video.</li>
                  </ul>

                  <div className="bg-white/5 border border-white/10 p-5 rounded-3xl mt-6">
                    <strong className="text-white/90 font-medium block mb-2">About the Models</strong>
                    <p className="text-xs text-white/60 mb-3">
                      <strong>Gemini 3.1 Pro:</strong> A highly advanced, pre-trained multimodal model capable of analyzing both images and video frames.
                    </p>
                    <p className="text-xs text-white/60">
                      <strong>Mirage 1.0:</strong> A custom self-learning model. Every time you scan media, the result is fed back into its training pipeline, making it smarter over time.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
  <button 
    onClick={onClick}
    className={`pb-2 text-xs font-medium transition-colors border-b-2 whitespace-nowrap ${active ? 'text-white border-white' : 'text-white/40 border-transparent hover:text-white/70'}`}
  >
    {label}
  </button>
);


