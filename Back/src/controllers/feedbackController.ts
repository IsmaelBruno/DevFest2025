import { Request, Response } from 'express';
import Feedback from '../models/feedBack';

class FeedbackController {
    // Créer un feedback
    async createFeedback(req: Request, res: Response): Promise<Response> {
        try {
            const { name, email, rating, message } = req.body;
            
            // Validation simple
            if (!name || !email || !message || !rating) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Tous les champs sont obligatoires' 
                });
            }

            if (rating < 1 || rating > 5) {
                return res.status(400).json({ 
                    success: false,
                    message: 'La note doit être entre 1 et 5' 
                });
            }

            const feedback = new Feedback({ name, email, rating, message });
            await feedback.save();
            
            return res.status(201).json({ 
                success: true, 
                message: 'Feedback envoyé avec succès',
                data: feedback 
            });
        } catch (error: any) {
            console.error('Erreur création feedback:', error);
            return res.status(500).json({ 
                success: false,
                message: 'Erreur serveur' 
            });
        }
    }

    // Dans getFeedbacks - NE PAS filtrer par défaut ou utiliser 'active'
async getFeedbacks(req: Request, res: Response): Promise<Response> {
    try {
        const limit = parseInt(req.query.limit as string) || 10;
        
        // Récupérer tous les feedbacks actifs, pas seulement 'approved'
        const feedbacks = await Feedback.find({ 
            status: { $in: ['active', 'approved', 'pending'] } 
        })
            .sort({ createdAt: -1 })
            .limit(limit);
        
        return res.json({ 
            success: true, 
            data: feedbacks 
        });
    } catch (error: any) {
        console.error('Erreur récupération feedbacks:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Erreur serveur' 
        });
    }
}

    // Récupérer les statistiques
    async getStats(req: Request, res: Response): Promise<Response> {
        try {
            const total = await Feedback.countDocuments();
            const approvedFeedbacks = await Feedback.find({ status: 'approved' });
            
            let averageRating = 0;
            let satisfactionRate = 0;
            
            if (approvedFeedbacks.length > 0) {
                const totalRating = approvedFeedbacks.reduce((sum: number, fb: any) => sum + fb.rating, 0);
                averageRating = parseFloat((totalRating / approvedFeedbacks.length).toFixed(1));
                
                const satisfiedCount = approvedFeedbacks.filter((fb: any) => fb.rating >= 4).length;
                satisfactionRate = Math.round((satisfiedCount / approvedFeedbacks.length) * 100);
            }
            
            return res.json({
                success: true,
                data: {
                    total,
                    averageRating,
                    satisfactionRate
                }
            });
        } catch (error: any) {
            console.error('Erreur récupération stats:', error);
            return res.status(500).json({ 
                success: false,
                message: 'Erreur serveur' 
            });
        }
    }

    // Mettre à jour le statut (admin)
    async updateStatus(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { status } = req.body;
            
            if (!['pending', 'approved', 'rejected'].includes(status)) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Statut invalide' 
                });
            }
            
            const feedback = await Feedback.findByIdAndUpdate(
                id,
                { status },
                { new: true }
            );
            
            if (!feedback) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Feedback non trouvé' 
                });
            }
            
            return res.json({ 
                success: true, 
                message: 'Statut mis à jour', 
                data: feedback 
            });
        } catch (error: any) {
            console.error('Erreur mise à jour statut:', error);
            return res.status(500).json({ 
                success: false,
                message: 'Erreur serveur' 
            });
        }
    }

    // Supprimer un feedback (admin)
    async deleteFeedback(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            
            const feedback = await Feedback.findByIdAndDelete(id);
            
            if (!feedback) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Feedback non trouvé' 
                });
            }
            
            return res.json({ 
                success: true, 
                message: 'Feedback supprimé' 
            });
        } catch (error: any) {
            console.error('Erreur suppression feedback:', error);
            return res.status(500).json({ 
                success: false,
                message: 'Erreur serveur' 
            });
        }
    }
}

export default new FeedbackController();