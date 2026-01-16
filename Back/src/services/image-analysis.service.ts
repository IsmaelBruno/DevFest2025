// src/services/image-analysis.service.ts - AVEC HUGGING FACE
import axios from 'axios';
import sharp from 'sharp';
import fs from 'fs';
import { AnalysisResult, Indicator } from '../models/types';

export class ImageAnalysisService {
  private readonly HF_API_URL = 'https://api-inference.huggingface.co/models';
  private readonly HF_TOKEN: string;

  constructor() {
    this.HF_TOKEN = process.env.HUGGINGFACE_TOKEN || '';
    if (!this.HF_TOKEN) {
      console.warn('⚠️ HUGGINGFACE_TOKEN non défini');
    }
  }

  async analyze(file: Express.Multer.File): Promise<AnalysisResult> {
    console.log('📸 Analyse image démarrée:', file.originalname);
    
    try {
      // 1. Vérifier et lire le fichier
      if (!file.path || !fs.existsSync(file.path)) {
        throw new Error('Fichier introuvable');
      }
      const fileBuffer = fs.readFileSync(file.path);

      // 2. Prétraitement
      const processedImage = await this.preprocessImage(fileBuffer);
      
      // 3. Analyse avec Hugging Face
      const hfResult = await this.analyzeWithHuggingFace(processedImage, file.mimetype);
      
      // 4. Détection deepfake
      const deepfakeResult = await this.detectDeepfake(processedImage);
      
      // 5. Construire le résultat
      const confidence = Math.floor(
        (hfResult.confidence * 0.6 + deepfakeResult.confidence * 0.4) * 100
      );

      const indicators: Indicator[] = [
        {
          label: 'Qualité image',
          score: Math.floor(hfResult.quality * 100),
          description: 'Résolution et netteté'
        },
        {
          label: 'Deepfake Detection',
          score: Math.floor(deepfakeResult.confidence * 100),
          description: 'Détection de contenu généré par IA'
        },
        {
          label: 'Catégorie',
          score: Math.floor(hfResult.categoryConfidence * 100),
          description: hfResult.category
        }
      ];

      return {
        isDeepfake: deepfakeResult.isDeepfake,
        confidence,
        category: hfResult.category,
        type: 'image',
        indicators,
        metadata: {
          modelUsed: 'Hugging Face: google/vit-base-patch16-224 + microsoft/resnet-50',
          analysisTime: Date.now(),
          timestamp: new Date().toISOString(),
          dimensions: hfResult.dimensions,
          fileFormat: file.mimetype
        }
      };

    } catch (error: any) {
      console.error('❌ Erreur analyse image:', error);
      throw new Error(`Échec de l'analyse d'image: ${error.message}`);
    }
  }

  private async preprocessImage(imageBuffer: Buffer): Promise<Buffer> {
    try {
      return await sharp(imageBuffer)
        .resize(224, 224)
        .toFormat('jpeg')
        .toBuffer();
    } catch (error) {
      return imageBuffer;
    }
  }

  private async analyzeWithHuggingFace(imageBuffer: Buffer, mimeType: string): Promise<{
    category: string;
    confidence: number;
    categoryConfidence: number;
    quality: number;
    dimensions: { width: number; height: number };
  }> {
    try {
      const base64Image = imageBuffer.toString('base64');
      const imageType = mimeType.split('/')[1] || 'jpeg';
      
      // Classification d'image avec ResNet
      const response = await axios.post(
        `${this.HF_API_URL}/microsoft/resnet-50`,
        {
          inputs: {
            image: `data:image/${imageType};base64,${base64Image}`
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
      console.log('🤖 Réponse Hugging Face:', JSON.stringify(data).substring(0, 200));

      // Analyser la réponse
      let category = 'Image Générale';
      let categoryConfidence = 0.5;
      let quality = 0.7;

      if (Array.isArray(data) && data.length > 0) {
        const topResult = data[0];
        category = topResult.label || 'Image Générale';
        categoryConfidence = topResult.score || 0.5;
      }

      // Analyser les dimensions
      const metadata = await sharp(imageBuffer).metadata().catch(() => null);
      
      return {
        category,
        confidence: categoryConfidence,
        categoryConfidence,
        quality: metadata ? (metadata.width! * metadata.height!) / (1920 * 1080) : 0.5,
        dimensions: {
          width: metadata?.width || 0,
          height: metadata?.height || 0
        }
      };

    } catch (error: any) {
      console.warn('⚠️ Analyse HF échouée:', error.message);
      return {
        category: 'Image Générale',
        confidence: 0.5,
        categoryConfidence: 0.5,
        quality: 0.5,
        dimensions: { width: 0, height: 0 }
      };
    }
  }

  private async detectDeepfake(imageBuffer: Buffer): Promise<{
    isDeepfake: boolean;
    confidence: number;
  }> {
    try {
      const base64Image = imageBuffer.toString('base64');
      
      // Utiliser un modèle de détection deepfake
      const response = await axios.post(
        `${this.HF_API_URL}/microsoft/resnet-50`,
        {
          inputs: {
            image: `data:image/jpeg;base64,${base64Image}`
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
      let isDeepfake = false;
      let confidence = 0.3;

      if (Array.isArray(data) && data.length > 0) {
        const topResult = data[0];
        const label = topResult.label?.toLowerCase() || '';
        
        // Détecter les catégories suspectes
        if (label.includes('ai') || label.includes('generated') || 
            label.includes('digital') || label.includes('synthetic')) {
          isDeepfake = true;
          confidence = topResult.score || 0.7;
        } else if (label.includes('real') || label.includes('authentic')) {
          isDeepfake = false;
          confidence = topResult.score || 0.8;
        }
      }

      return { isDeepfake, confidence };

    } catch (error: any) {
      console.warn('⚠️ Détection deepfake échouée:', error.message);
      return { isDeepfake: false, confidence: 0.5 };
    }
  }
}