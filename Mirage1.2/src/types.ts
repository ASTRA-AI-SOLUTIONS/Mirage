export type AppState = 'home' | 'mirage' | 'social' | 'facebook' | 'x' | 'youtube';

export interface AnalysisResult {
  score: number;
  reason: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  image: string;
  result: AnalysisResult;
}

export interface MediaFrame {
  base64Data: string;
  mimeType: string;
}

export type ModelType = 'gemini-3.1-pro' | 'mirage-1.0';

export interface PhoneContextType {
  currentApp: AppState;
  setCurrentApp: (app: AppState) => void;
  isBubbleEnabled: boolean;
  setIsBubbleEnabled: (enabled: boolean) => void;
  isWidgetEnabled: boolean;
  setIsWidgetEnabled: (enabled: boolean) => void;
  isQuickSettingsOpen: boolean;
  setIsQuickSettingsOpen: (open: boolean) => void;
  analyzingState: {
    isAnalyzing: boolean;
    result: AnalysisResult | null;
    image?: string | null;
  };
  setAnalyzingState: (state: { isAnalyzing: boolean; result: AnalysisResult | null; image?: string | null }) => void;
  history: HistoryItem[];
  addToHistory: (item: HistoryItem) => void;
  analyzeMediaContent: (frames: MediaFrame[], displayImage: string) => Promise<void>;
  selectedModel: ModelType;
  setSelectedModel: (model: ModelType) => void;
  learningCount: number;
}


