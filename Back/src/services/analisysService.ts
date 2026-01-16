// src/services/analysisService.ts - AVEC HUGGING FACE
import { AnalysisRequest, AnalysisResult } from '../models/types';
import { ImageAnalysisService } from './image-analysis.service';
import { AudioAnalysisService } from './audio-analysis.service';
import { VideoAnalysisService } from './video-analysis.service';

export class AnalysisService {
  private imageAnalyzer: ImageAnalysisService;
  private audioAnalyzer: AudioAnalysisService;
  private videoAnalyzer: VideoAnalysisService;

  constructor() {
    this.imageAnalyzer = new ImageAnalysisService();
    this.audioAnalyzer = new AudioAnalysisService();
    this.videoAnalyzer = new VideoAnalysisService();
  }

  async analyzeContent(request: AnalysisRequest): Promise<AnalysisResult> {
    const startTime = Date.now();

    console.log('🔍 Début analyse - Type:', request.type);

    let result: AnalysisResult;

    switch (request.type) {
      case 'image':
        if (!request.file) {
          throw new Error('Fichier image requis');
        }
        console.log('📷 Analyse d\'image:', request.file.originalname);
        result = await this.imageAnalyzer.analyze(request.file);
        break;

      case 'audio':
        if (!request.file) {
          throw new Error('Fichier audio requis');
        }
        console.log('🔊 Analyse audio:', request.file.originalname);
        result = await this.audioAnalyzer.analyze(request.file);
        break;

      case 'video':
        if (!request.file) {
          throw new Error('Fichier vidéo requis');
        }
        console.log('🎥 Analyse vidéo:', request.file.originalname);
        result = await this.videoAnalyzer.analyze(request.file);
        break;

      default:
        throw new Error(`Type d'analyse non supporté: ${request.type}`);
    }

    // Ajouter les métadonnées
    result.metadata = {
      ...result.metadata,
      modelUsed: this.getModelName(request.type),
      analysisTime: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      fileSize: request.file?.size,
      fileName: request.file?.originalname,
      fileFormat: request.file?.mimetype
    };

    console.log('✅ Analyse terminée en', result.metadata.analysisTime, 'ms');
    return result;
  }

  private getModelName(type: string): string {
    const models: Record<string, string> = {
      image: 'google/vit-base-patch16-224 (Hugging Face)',
      audio: 'facebook/wav2vec2-base-960h (Hugging Face)',
      video: 'timesformer (Hugging Face)'
    };
    return models[type] || 'unknown';
  }
}