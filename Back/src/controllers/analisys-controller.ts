// src/controllers/analysis-controller.ts - VERSION AMÉLIORÉE
import { Request, Response } from 'express';
import { AnalysisService } from '../services/analisysService';
import { AnalysisRequest } from '../models/types';
import fs from 'fs';

const analysisService = new AnalysisService();

export class AnalysisController {
    async analyzeContent(req: Request, res: Response): Promise<Response> {
        try {
            const { type, content } = req.body;
            const file = req.file;
            
            console.log('📥 Analyse reçue - Type:', type);
            console.log('📥 Fichier:', {
                originalname: file?.originalname,
                mimetype: file?.mimetype,
                size: file?.size,
                path: file?.path,
                buffer: file?.buffer ? `${file.buffer.length} bytes` : 'No buffer'
            });

            // Validation
            if (!type || !['image', 'audio', 'video'].includes(type)) {
                return res.status(400).json({
                    success: false,
                    message: 'Type d\'analyse invalide. Types supportés: image, audio, video'
                });
            }

            if (type === 'image' && !file) {
                return res.status(400).json({
                    success: false,
                    message: 'Fichier image requis'
                });
            }

            // Vérifier que le fichier existe
            if (file && (!file.path || !fs.existsSync(file.path))) {
                return res.status(400).json({
                    success: false,
                    message: 'Fichier introuvable sur le serveur'
                });
            }

            const request: AnalysisRequest = {
                type: type as 'image' | 'audio' | 'video',
                content: content || '',
                file
            };

            console.log('🔧 Début analyse...');
            const result = await analysisService.analyzeContent(request);
            console.log('✅ Analyse terminée avec succès');

            // Nettoyer le fichier temporaire
            if (file && file.path && fs.existsSync(file.path)) {
                try {
                    fs.unlinkSync(file.path);
                    console.log('🧹 Fichier temporaire nettoyé');
                } catch (error) {
                    console.warn('⚠️ Erreur nettoyage fichier:', error);
                }
            }

            return res.status(200).json({
                success: true,
                data: result,
                message: 'Analyse terminée avec succès'
            });

        } catch (error: any) {
            console.error('❌ Erreur d\'analyse détaillée:');
            console.error('❌ Message:', error.message);
            console.error('❌ Stack:', error.stack);
            
            // Nettoyer le fichier en cas d'erreur
            if (req.file?.path && fs.existsSync(req.file.path)) {
                try {
                    fs.unlinkSync(req.file.path);
                    console.log('🧹 Fichier nettoyé après erreur');
                } catch (cleanupError) {
                    console.warn('⚠️ Erreur nettoyage après erreur:', cleanupError);
                }
            }

            return res.status(500).json({
                success: false,
                message: error.message || 'Erreur interne lors de l\'analyse',
                error: process.env.NODE_ENV === 'development' ? {
                    message: error.message,
                    stack: error.stack
                } : undefined
            });
        }
    }

    async getStatus(req: Request, res: Response): Promise<Response> {
        console.log('📊 Status check');
        return res.status(200).json({
            status: 'operational',
            version: '1.1.0',
            supportedTypes: ['image', 'audio', 'video'],
            models: {
                image: 'CLIP + Custom CNN',
                audio: 'Wav2Vec2 + Custom ML',
                video: 'TimeSformer + Optical Flow'
            },
            features: {
                realTimeAnalysis: true,
                fileProcessing: true,
                noDatabase: true
            }
        });
    }
}