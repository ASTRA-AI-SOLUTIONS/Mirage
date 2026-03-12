import React from 'react';
import { PhoneProvider } from './context/PhoneContext';
import { Phone } from './components/Phone';
import { MirageApp } from './components/MirageApp';
import { Capacitor } from '@capacitor/core';

export default function App() {
  const isNative = Capacitor.isNativePlatform();

  return (
    <PhoneProvider>
      {isNative ? (
        // Native Android/iOS View: Just the app itself
        <div className="w-screen h-screen overflow-hidden bg-black relative">
          <MirageApp />
        </div>
      ) : (
        // Web View: The Phone Simulator
        <div className="w-screen h-screen overflow-hidden bg-zinc-950 flex items-center justify-center relative">
          {/* Background ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-medium text-white tracking-tight">Mirage AI Simulator</h1>
              <p className="text-sm text-zinc-400 max-w-md">
                Test the floating bubble over the fake social feed. When you build the native app, this simulator will be replaced by the real Android system.
              </p>
            </div>
            
            {/* Scale down slightly on smaller screens */}
            <div className="transform scale-[0.85] sm:scale-100 origin-top">
              <Phone />
            </div>
          </div>
        </div>
      )}
    </PhoneProvider>
  );
}

