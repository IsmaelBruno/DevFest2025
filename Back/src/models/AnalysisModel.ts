import mongoose, { Schema, Document } from 'mongoose';
import { DBAnalysis } from '../types/analisys';

export interface IAnalysis extends Document, Omit<DBAnalysis, '_id'> {}

const IndicatorSchema = new Schema({
  label: { type: String, required: true },
  score: { type: Number, required: true, min: 0, max: 100 },
  description: { type: String }
});

const MetadataSchema = new Schema({
  modelUsed: { type: String, required: true },
  analysisTime: { type: Number, required: true },
  timestamp: { type: String, required: true },
  dimensions: {
    width: { type: Number },
    height: { type: Number }
  },
  duration: { type: Number } // en secondes
});

const AnalysisSchema = new Schema({
  userId: { 
    type: String, 
    required: true,
    index: true 
  },
  type: { 
    type: String, 
    required: true,
    enum: ['image', 'audio', 'video'] 
  },
  isDeepfake: { 
    type: Boolean, 
    required: true 
  },
  confidence: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100 
  },
  category: { 
    type: String, 
    required: true 
  },
  indicators: [IndicatorSchema],
  originalFilename: { 
    type: String, 
    required: true 
  },
  filePath: { 
    type: String, 
    required: true 
  },
  fileSize: { 
    type: Number, 
    required: true 
  },
  fileFormat: { 
    type: String, 
    required: true 
  },
  metadata: MetadataSchema,
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Index pour les requêtes fréquentes
AnalysisSchema.index({ userId: 1, createdAt: -1 });
AnalysisSchema.index({ type: 1, isDeepfake: 1 });
AnalysisSchema.index({ createdAt: -1 });

// Middleware pour mettre à jour updatedAt
AnalysisSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Analysis = mongoose.model<IAnalysis>('Analysis', AnalysisSchema);