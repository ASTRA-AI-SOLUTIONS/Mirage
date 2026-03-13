import React from 'react';
import { usePhone } from '../context/PhoneContext';
import { Eye, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

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
          <span className="text-white text-xs font-medium drop-shadow-md">Instagram</span>
        </div>

        <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => setCurrentApp('facebook')}>
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Facebook className="text-white" size={28} />
          </div>
          <span className="text-white text-xs font-medium drop-shadow-md">Facebook</span>
        </div>

        <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => setCurrentApp('x')}>
          <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center shadow-lg">
            <Twitter className="text-white" size={28} />
          </div>
          <span className="text-white text-xs font-medium drop-shadow-md">X</span>
        </div>

        <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => setCurrentApp('youtube')}>
          <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Youtube className="text-white" size={28} />
          </div>
          <span className="text-white text-xs font-medium drop-shadow-md">YouTube</span>
        </div>
      </div>
    </div>
  );
};
