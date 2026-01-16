export interface AnalysisRequest {
  type: 'image' | 'audio' | 'video';
  content?: string;
  file?: Express.Multer.File;
}

export interface Indicator {
  label: string;
  score: number;
  description?: string;
}

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
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// Nouveau: Modèle pour sauvegarde en base
export interface DBAnalysis {
  _id?: string;
  userId: string;
  type: 'image' | 'audio' | 'video';
  isDeepfake: boolean;
  confidence: number;
  category: string;
  indicators: Indicator[];
  originalFilename: string;
  filePath: string;
  fileSize: number;
  fileFormat: string;
  metadata: {
    modelUsed: string;
    analysisTime: number;
    timestamp: string;
    dimensions?: { width: number; height: number };
    duration?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}