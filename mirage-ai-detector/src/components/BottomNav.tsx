import React from 'react';
import { usePhone } from '../context/PhoneContext';

export const BottomNav = () => {
  const { setCurrentApp } = usePhone();

  return (
    <div className="h-8 w-full bg-black absolute bottom-0 z-50 flex justify-center items-center pb-2">
      <div 
        className="w-32 h-1.5 bg-white/50 rounded-full cursor-pointer hover:bg-white/80 transition-colors"
        onClick={() => setCurrentApp('home')}
      ></div>
    </div>
  );
};
