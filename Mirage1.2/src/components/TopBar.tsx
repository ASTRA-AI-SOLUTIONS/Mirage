import React from 'react';
import { Battery, Wifi, Signal } from 'lucide-react';
import { usePhone } from '../context/PhoneContext';

export const TopBar = () => {
  const { setIsQuickSettingsOpen, isQuickSettingsOpen } = usePhone();

  return (
    <div 
      className="h-12 w-full bg-transparent absolute top-0 z-50 flex justify-between items-center px-6 text-white cursor-pointer"
      onClick={() => setIsQuickSettingsOpen(!isQuickSettingsOpen)}
    >
      <div className="text-xs font-medium">9:41</div>
      <div className="w-32 h-6 bg-black rounded-b-3xl absolute top-0 left-1/2 -translate-x-1/2"></div>
      <div className="flex items-center gap-1.5">
        <Signal size={14} />
        <Wifi size={14} />
        <Battery size={14} />
      </div>
    </div>
  );
};
