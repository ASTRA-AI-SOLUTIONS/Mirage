import React, { useState, useRef, useEffect } from 'react';
import { motion, useDragControls, AnimatePresence } from 'motion/react';
import { usePhone } from '../context/PhoneContext';
import { Eye, X, Share2 } from 'lucide-react';
import { captureLiveVideoFrames, downscaleImage } from '../utils/mediaUtils';

export const FloatingBubble = () => {
  const { isBubbleEnabled, setIsBubbleEnabled, currentApp, analyzeMediaContent, analyzingState, setAnalyzingState } = usePhone();
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isOverDropZone, setIsOverDropZone] = useState(false);
  
  const dragControls = useDragControls();
  const constraintsRef = useRef(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsOpen(false);
    setAnalyzingState({ isAnalyzing: false, result: null });
  }, [currentApp, setAnalyzingState]);

  if (!isBubbleEnabled) return null;

  const handleAnalyze = async () => {
    if (isDragging) return;
    setIsOpen(true);
    
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
    <div className="absolute inset-0 pointer-events-none z-40" ref={constraintsRef}>
      
      {/* Drop Zone for Closing */}
      <AnimatePresence>
        {isDragging && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-10 left-0 right-0 flex justify-center pointer-events-none z-30"
          >
            <div 
              ref={dropZoneRef}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                isOverDropZone 
                  ? 'bg-rose-500/80 scale-110 shadow-[0_0_30px_rgba(244,63,94,0.5)]' 
                  : 'bg-black/40 backdrop-blur-md border border-white/10'
              }`}
            >
              <X className={isOverDropZone ? 'text-white' : 'text-gray-400'} size={24} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        drag
        dragControls={dragControls}
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={false}
        initial={{ x: 300, y: 200 }}
        onDragStart={() => {
          setIsDragging(true);
          setIsOpen(false);
        }}
        onDrag={(event, info) => {
          if (dropZoneRef.current) {
            const rect = dropZoneRef.current.getBoundingClientRect();
            // Get the center of the bubble approximately
            const bubbleX = info.point.x;
            const bubbleY = info.point.y;
            
            // Check if bubble center is near the drop zone
            if (
              bubbleX > rect.left - 20 && 
              bubbleX < rect.right + 20 && 
              bubbleY > rect.top - 20 && 
              bubbleY < rect.bottom + 20
            ) {
              setIsOverDropZone(true);
            } else {
              setIsOverDropZone(false);
            }
          }
        }}
        onDragEnd={() => {
          setIsDragging(false);
          if (isOverDropZone) {
            setIsBubbleEnabled(false);
            setIsOverDropZone(false);
          }
        }}
        className="absolute pointer-events-auto flex items-start gap-2 z-50"
      >
        <motion.div 
          className="w-12 h-12 bg-white/5 backdrop-blur-xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex items-center justify-center cursor-pointer border border-white/10 hover:bg-white/10 transition-colors"
          onClick={handleAnalyze}
          onPointerDown={(e) => dragControls.start(e)}
          whileTap={{ scale: 0.9 }}
        >
          <Eye className="text-white/80" size={22} />
        </motion.div>

        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, x: -10, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, x: -10, filter: 'blur(10px)' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 w-64 shadow-[0_16px_40px_rgba(0,0,0,0.4)]"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-medium text-white/50 uppercase tracking-widest">Mirage</span>
                <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="text-white/40 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              {analyzingState.isAnalyzing ? (
                <div className="flex flex-col items-center py-6 gap-3">
                  <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <div className="text-xs text-white/60">Analyzing frames...</div>
                </div>
              ) : analyzingState.result ? (
                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <span className="text-xs text-white/60">AI Probability</span>
                    <span className={`text-2xl font-light tracking-tight ${analyzingState.result.score > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {analyzingState.result.score}%
                    </span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${analyzingState.result.score}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full ${analyzingState.result.score > 50 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    />
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed font-light">
                    {analyzingState.result.reason}
                  </p>
                  <button 
                    onClick={handleShare}
                    className="w-full mt-2 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors text-white/80"
                  >
                    <Share2 size={14} /> Share
                  </button>
                </div>
              ) : (
                <div className="text-xs text-white/50 text-center py-4 font-light">
                  No media detected.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};


