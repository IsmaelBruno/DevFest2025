// src/routes/analysisRoute.ts - VERSION SIMPLIFIÉE
import express from 'express';
import { AnalysisController } from '../controllers/analisys-controller';
import { upload } from '../middlewares/upload.middleware';

const router = express.Router();
const analysisController = new AnalysisController();

// Route d'analyse publique (sans auth)
router.post('/analyze', 
  upload.single('file'),
  (req, res) => analysisController.analyzeContent(req, res)
);

// Statut du service (public)
router.get('/status',
  (req, res) => analysisController.getStatus(req, res)
);


export default router;