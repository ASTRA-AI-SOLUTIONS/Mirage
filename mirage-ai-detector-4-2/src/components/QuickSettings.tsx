import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePhone } from '../context/PhoneContext';
import { Wifi, Bluetooth, Flashlight, Eye, Settings, Bell, Share2 } from 'lucide-react';
import { captureLiveVideoFrames, downscaleImage } from '../utils/mediaUtils';

export const QuickSettings = () => {
  const { isQuickSettingsOpen, setIsQuickSettingsOpen, analyzeMediaContent, analyzingState } = usePhone();

  const handleAnalyze = async () => {
    const visiblePost = document.querySelector('.social-post[data-visible="true"]');
    if (!visiblePost) return;

    const video = visiblePost.querySelector('video.post-media') as HTMLVideoElement;
    const img = visiblePost.querySelector('img.post-media') as HTMLImageElement;

    try {
      if (video) {
        const frames = await captureLiveVideoFrames(video, 10, 100);
        const displayImage = `data:image/jpeg;base64,${frames[0].base64Data}`;
        analyzeMediaContent(frames, displayImage);
      } else if (img) {
        const frame = await downscaleImage(img.src);
        const displayImage = `data:image/jpeg;base64,${frame.base64Data}`;
        analyzeMediaContent([frame], displayImage);
      }
    } catch (error) {
      console.error("Failed to extract media for analysis", error);
    }
  };

  const handleShare = async () => {
    if (!analyzingState.result) return;
    const text = `Mirage AI Detection\nProbability: ${analyzingState.result.score}%\nReason: ${analyzingState.result.reason}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Mirage Analysis', text });
      } catch (e) {}
    } else {
      alert("Sharing not supported on this browser.\n\n" + text);
    }
  };

  return (
    <AnimatePresence>
      {isQuickSettingsOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsQuickSettingsOpen(false)}
          />
          <motion.div 
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 left-0 right-0 bg-[#1a1a1a] rounded-b-3xl z-50 p-6 pt-12 shadow-2xl border-b border-white/10"
          >
            <div className="flex justify-between items-center mb-6">
              <span className="text-white font-medium">12:30</span>
              <div className="flex gap-4 text-white">
                <Settings size={20} />
                <Bell size={20} />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <QuickSettingIcon icon={<Wifi size={24} />} label="Wi-Fi" active />
              <QuickSettingIcon icon={<Bluetooth size={24} />} label="Bluetooth" active />
              <QuickSettingIcon icon={<Flashlight size={24} />} label="Flashlight" />
              <QuickSettingIcon 
                icon={<Eye size={24} />} 
                label="Mirage" 
                active 
                onClick={handleAnalyze}
                color="bg-black border border-white/20"
              />
            </div>

            <AnimatePresence>
              {(analyzingState.isAnalyzing || analyzingState.result) && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white/5 rounded-2xl p-4 overflow-hidden"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="text-white/80" size={16} />
                    <span className="text-sm font-medium text-white">Mirage Analysis</span>
                  </div>
                  
                  {analyzingState.isAnalyzing ? (
                    <div className="flex items-center gap-3 text-white">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-sm text-gray-400">Scanning screen content...</span>
                    </div>
                  ) : analyzingState.result ? (
                    <div className="space-y-3">
                      <div className="flex items-end justify-between">
                        <span className="text-sm text-gray-400">AI Probability</span>
                        <span className={`text-xl font-bold ${analyzingState.result.score > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {analyzingState.result.score}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${analyzingState.result.score > 50 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                          style={{ width: `${analyzingState.result.score}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-300">
                        {analyzingState.result.reason}
                      </p>
                      <button 
                        onClick={handleShare}
                        className="w-full mt-2 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 transition-colors"
                      >
                        <Share2 size={16} /> Share Result
                      </button>
                    </div>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-6" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const QuickSettingIcon = ({ icon, label, active = false, onClick, color = 'bg-blue-500' }: any) => (
  <div className="flex flex-col items-center gap-2" onClick={onClick}>
    <div className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-colors ${active ? color : 'bg-white/10'} ${active ? 'text-white' : 'text-gray-400'}`}>
      {icon}
    </div>
    <span className="text-xs text-white/80">{label}</span>
  </div>
);


