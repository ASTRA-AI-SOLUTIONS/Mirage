import React from 'react';
import { PhoneProvider } from './context/PhoneContext';
import { Phone } from './components/Phone';

export default function App() {
  return (
    <PhoneProvider>
      <div className="min-h-screen bg-[#e5e5e5] flex items-center justify-center p-8 font-sans">
        <div className="flex gap-12 items-center max-w-5xl w-full">
          {/* Left side: Instructions/Context */}
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">Mirage</h1>
              <p className="text-xl text-gray-500">AI Detection Engine Simulation</p>
            </div>
            
            <div className="prose prose-gray">
              <p>
                This is a web-based simulation of the Mirage Android app. It demonstrates the three requested activation methods:
              </p>
              <ul className="space-y-2">
                <li>
                  <strong>1. Quick Settings:</strong> Click the top status bar of the phone to pull down quick settings, then tap the Mirage icon.
                </li>
                <li>
                  <strong>2. Floating Bubble:</strong> Drag the floating eye icon around. Tap it while viewing a post in the Social app to analyze it.
                </li>
                <li>
                  <strong>3. Main App:</strong> Open the Mirage app from the home screen to toggle settings or manually upload media.
                </li>
              </ul>
              <p className="text-sm text-gray-500 mt-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <strong>Note:</strong> The "backend model" is powered by Gemini 3.1 Pro via the <code>@google/genai</code> SDK, running directly in the client as requested for this prototype.
              </p>
            </div>
          </div>

          {/* Right side: Phone Simulator */}
          <div className="shrink-0">
            <Phone />
          </div>
        </div>
      </div>
    </PhoneProvider>
  );
}

