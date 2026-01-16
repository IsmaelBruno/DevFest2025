// models/types.ts
export interface AnalysisRequest {
  type: 'image' | 'audio' | 'video'; // Changez 'text' en 'image'
  content?: string;
  file?: Express.Multer.File;
}

export interface Indicator {
  label: string;
  score: number;
  description?: string;
}

// models/types.ts - VERSION CORRIGÉE
export interface AnalysisResult {
  id?: string;
  userId?: string;
  isDeepfake: boolean;
  confidence: number;
  category: string;
  type: 'image' | 'audio' | 'video';
  indicators: Indicator[];
  originalFilename?: string;
  filePath?: string;
  fileSize?: number;
  fileFormat?: string;
  metadata?: {
    modelUsed: string;
    analysisTime: number;
    timestamp: string;
    dimensions?: { width: number; height: number };
    duration?: number; // pour audio/video
    fileSize?: number; // AJOUTEZ CE CHAMP
    fileName?: string; // AJOUTEZ CE CHAMP
    [key: string]: any; // Optionnel: pour les propriétés additionnelles
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Metadata {
  modelUsed: string;
  analysisTime: number;
  timestamp: string;
  dimensions?: { width: number; height: number };
  duration?: number;
}