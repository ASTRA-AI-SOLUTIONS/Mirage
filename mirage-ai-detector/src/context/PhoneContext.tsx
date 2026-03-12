import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppState, AnalysisResult, PhoneContextType, HistoryItem, MediaFrame, ModelType } from '../types';
import { analyzeMedia } from '../services/geminiService';

const PhoneContext = createContext<PhoneContextType | undefined>(undefined);

export const PhoneProvider = ({ children }: { children: ReactNode }) => {
  const [currentApp, setCurrentApp] = useState<AppState>('home');
  const [isBubbleEnabled, setIsBubbleEnabled] = useState(true);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelType>('gemini-3.1-pro');
  const [learningCount, setLearningCount] = useState(1240); // Base count for simulation
  const [analyzingState, setAnalyzingState] = useState<{ isAnalyzing: boolean; result: AnalysisResult | null; image?: string | null }>({
    isAnalyzing: false,
    result: null,
    image: null,
  });
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const addToHistory = (item: HistoryItem) => {
    setHistory(prev => [item, ...prev]);
  };

  const analyzeMediaContent = async (frames: MediaFrame[], displayImage: string) => {
    setAnalyzingState({ isAnalyzing: true, result: null, image: displayImage });
    
    // Simulate self-learning for Mirage 1.0
    if (selectedModel === 'mirage-1.0') {
      setLearningCount(prev => prev + 1);
    }

    const result = await analyzeMedia(frames, selectedModel, learningCount);
    setAnalyzingState({ isAnalyzing: false, result, image: displayImage });
    
    if (result) {
      addToHistory({
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
        image: displayImage,
        result
      });
    }
  };

  return (
    <PhoneContext.Provider
      value={{
        currentApp,
        setCurrentApp,
        isBubbleEnabled,
        setIsBubbleEnabled,
        isQuickSettingsOpen,
        setIsQuickSettingsOpen,
        analyzingState,
        setAnalyzingState,
        history,
        addToHistory,
        analyzeMediaContent,
        selectedModel,
        setSelectedModel,
        learningCount,
      }}
    >
      {children}
    </PhoneContext.Provider>
  );
};

export const usePhone = () => {
  const context = useContext(PhoneContext);
  if (!context) {
    throw new Error('usePhone must be used within a PhoneProvider');
  }
  return context;
};


