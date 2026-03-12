import React from 'react';
import { usePhone } from '../context/PhoneContext';
import { HomeApp } from './HomeApp';
import { MirageApp } from './MirageApp';
import { SocialApp } from './SocialApp';
import { FloatingBubble } from './FloatingBubble';
import { QuickSettings } from './QuickSettings';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { AnimatePresence, motion } from 'motion/react';

export const Phone = () => {
  const { currentApp } = usePhone();

  return (
    <div className="relative w-[375px] h-[812px] bg-black rounded-[50px] shadow-2xl overflow-hidden border-[8px] border-gray-800 flex flex-col">
      <TopBar />
      
      <div className="flex-1 relative overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          {currentApp === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(4px)' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute inset-0"
            >
              <HomeApp />
            </motion.div>
          )}
          {currentApp === 'mirage' && (
            <motion.div
              key="mirage"
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(4px)' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute inset-0"
            >
              <MirageApp />
            </motion.div>
          )}
          {currentApp === 'social' && (
            <motion.div
              key="social"
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(4px)' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute inset-0"
            >
              <SocialApp />
            </motion.div>
          )}
        </AnimatePresence>
        
        <FloatingBubble />
        <QuickSettings />
      </div>

      <BottomNav />
    </div>
  );
};
