import { Analysis, IAnalysis } from '../models/AnalysisModel';
import { AnalysisResult } from '../models/types';


export class AnalysisStorageService {
  // Sauvegarder une analyse
  async saveAnalysis(
    userId: string,
    result: AnalysisResult,
    fileInfo: {
      originalFilename: string;
      filePath: string;
      fileSize: number;
      fileFormat: string;
    }
  ): Promise<IAnalysis> {
    const analysisData = {
      userId,
      type: result.type,
      isDeepfake: result.isDeepfake,
      confidence: result.confidence,
      category: result.category,
      indicators: result.indicators,
      originalFilename: fileInfo.originalFilename,
      filePath: fileInfo.filePath,
      fileSize: fileInfo.fileSize,
      fileFormat: fileInfo.fileFormat,
      metadata: result.metadata || {
        modelUsed: 'unknown',
        analysisTime: 0,
        timestamp: new Date().toISOString()
      }
    };

    const analysis = new Analysis(analysisData);
    return await analysis.save();
  }

  // Récupérer toutes les analyses d'un utilisateur
  async getUserAnalyses(
    userId: string,
    page: number = 1,
    limit: number = 20,
    type?: 'image' | 'audio' | 'video'
  ): Promise<{
    analyses: IAnalysis[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const query: any = { userId };
    
    if (type) {
      query.type = type;
    }

    const skip = (page - 1) * limit;

    const [analyses, total] = await Promise.all([
      Analysis.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Analysis.countDocuments(query)
    ]);

    return {
      analyses,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  // Récupérer une analyse par ID
  async getAnalysisById(analysisId: string, userId?: string): Promise<IAnalysis | null> {
    const query: any = { _id: analysisId };
    
    if (userId) {
      query.userId = userId; // Vérifier l'appartenance
    }

    return await Analysis.findOne(query);
  }

  // Supprimer une analyse
  async deleteAnalysis(analysisId: string, userId: string): Promise<boolean> {
    const result = await Analysis.findOneAndDelete({
      _id: analysisId,
      userId
    });

    return result !== null;
  }

  // Mettre à jour une analyse
  async updateAnalysis(
    analysisId: string,
    userId: string,
    updateData: Partial<Omit<IAnalysis, '_id' | 'userId'>>
  ): Promise<IAnalysis | null> {
    return await Analysis.findOneAndUpdate(
      { _id: analysisId, userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  // Statistiques des analyses
  async getAnalysisStats(userId: string) {
    const [
      total,
      deepfakes,
      byType,
      recentAnalyses
    ] = await Promise.all([
      Analysis.countDocuments({ userId }),
      Analysis.countDocuments({ userId, isDeepfake: true }),
      Analysis.aggregate([
        { $match: { userId } },
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]),
      Analysis.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('type isDeepfake confidence createdAt')
    ]);

    return {
      total,
      deepfakes,
      byType: byType.reduce((acc: any, curr: any) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      recentAnalyses
    };
  }
}