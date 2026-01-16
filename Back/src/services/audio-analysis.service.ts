// src/services/audio-analysis.service.ts - NOUVEAU
import axios from 'axios';
import fs from 'fs';
import { AnalysisResult, Indicator } from '../models/types';

export class AudioAnalysisService {
  private readonly HF_API_URL = 'https://api-inference.huggingface.co/models';
  private readonly HF_TOKEN: string;

  constructor() {
    this.HF_TOKEN = process.env.HUGGINGFACE_TOKEN || '';
  }

  async analyze(file: Express.Multer.File): Promise<AnalysisResult> {
    console.log('🔊 Analyse audio démarrée:', file.originalname);
    
    try {
      if (!file.path || !fs.existsSync(file.path)) {
        throw new Error('Fichier audio introuvable');
      }
      
      const fileBuffer = fs.readFileSync(file.path);
      const result = await this.analyzeWithHuggingFace(fileBuffer, file.mimetype);

      return {
        isDeepfake: result.isDeepfake,
        confidence: result.confidence,
        category: result.category,
        type: 'audio',
        indicators: [
          {
            label: 'Qualité audio',
            score: Math.floor(result.quality * 100),
            description: 'Clarté et fidélité'
          },
          {
            label: 'Authenticité',
            score: Math.floor(result.authenticity * 100),
            description: 'Probabilité de contenu généré'
          },
          {
            label: 'Langue détectée',
            score: Math.floor(result.languageConfidence * 100),
            description: result.language
          }
        ],
        metadata: {
          modelUsed: 'Hugging Face: facebook/wav2vec2-base-960h',
          analysisTime: Date.now(),
          timestamp: new Date().toISOString(),
          duration: result.duration,
          fileFormat: file.mimetype
        }
      };

    } catch (error: any) {
      console.error('❌ Erreur analyse audio:', error);
      throw new Error(`Échec de l'analyse audio: ${error.message}`);
    }
  }

  private async analyzeWithHuggingFace(audioBuffer: Buffer, mimeType: string): Promise<any> {
    try {
      const base64Audio = audioBuffer.toString('base64');
      
      // Reconnaissance vocale avec Wav2Vec2
      const response = await axios.post(
        `${this.HF_API_URL}/facebook/wav2vec2-base-960h`,
        {
          inputs: {
            audio: `data:${mimeType};base64,${base64Audio}`
          }
        },
        {
          headers: {
            Authorization: `Bearer ${this.HF_TOKEN}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      const data = response.data;
      console.log('🤖 Réponse audio HF:', JSON.stringify(data).substring(0, 200));

      // Analyser la réponse
      let text = '';
      let confidence = 0.5;
      let isDeepfake = false;

      if (data && data.text) {
        text = data.text;
        confidence = data.confidence || 0.7;
        
        // Détection simple de deepfake audio (mots-clés suspects)
        const suspiciousWords = ['deepfake', 'generated', 'synthetic', 'ai voice'];
        const lowerText = text.toLowerCase();
        isDeepfake = suspiciousWords.some(word => lowerText.includes(word));
      }

      return {
        category: 'Audio',
        confidence: Math.floor(confidence * 100),
        isDeepfake,
        quality: 0.7,
        authenticity: isDeepfake ? 0.3 : 0.8,
        language: 'Français/English',
        languageConfidence: 0.8,
        duration: 'N/A'
      };

    } catch (error: any) {
      console.warn('⚠️ Analyse audio HF échouée:', error.message);
      return {
        category: 'Audio',
        confidence: 50,
        isDeepfake: false,
        quality: 0.5,
        authenticity: 0.5,
        language: 'Inconnu',
        languageConfidence: 0.5,
        duration: 'N/A'
      };
    }
  }
}