import { Router } from 'express';
import feedbackController from '../controllers/feedbackController';

const router = Router();

// Routes publiques
router.post('/', feedbackController.createFeedback);
router.get('/', feedbackController.getFeedbacks);
router.get('/stats', feedbackController.getStats);

// Routes admin
router.patch('/:id/status', feedbackController.updateStatus);
router.delete('/:id', feedbackController.deleteFeedback);

export default router;