import React from 'react';
import { usePhone } from '../context/PhoneContext';
import { Eye, Instagram } from 'lucide-react';

export const HomeApp = () => {
  const { setCurrentApp } = usePhone();

  return (
    <div className="w-full h-full bg-[url('https://picsum.photos/seed/wallpaper/400/800')] bg-cover bg-center pt-20 px-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => setCurrentApp('mirage')}>
          <div className="w-14 h-14 bg-black border border-white/20 rounded-2xl flex items-center justify-center shadow-2xl">
            <Eye className="text-white" size={28} />
          </div>
          <span className="text-white text-xs font-medium drop-shadow-md">Mirage</span>
        </div>
        
        <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => setCurrentApp('social')}>
          <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg">
            <Instagram className="text-white" size={28} />
          </div>
          <span className="text-white text-xs font-medium drop-shadow-md">Social</span>
        </div>
      </div>
    </div>
  );
};
