import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./configs/db";
import userRoute from "./routes/userRoute";
import analysisRoute from "./routes/analysisRoute";
import feedbackRoutes from "./routes/feedBackRoutes";
import bodyParser from "body-parser";

// Chargement des variables d'environnement
dotenv.config();

// Initialisation de l'application Express
const app = express();
const server = http.createServer(app);

// Configuration CORS AVANT tous les autres middlewares
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001', 
  'http://localhost:2025', // VOTRE PORT FRONTEND APPARENT
  'http://127.0.0.1:3000',
  'http://127.0.0.1:2025'
];

app.use(cors({
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origine (comme les apps mobiles, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `L'origine ${origin} n'est pas autorisée par CORS`;
      console.warn('❌ CORS bloqué pour:', origin);
      return callback(new Error(msg), false);
    }
    console.log('✅ CORS autorisé pour:', origin);
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'Origin', 'Content-Disposition'],
  exposedHeaders: ['Content-Disposition'],
  credentials: true,
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Gérer explicitement les requêtes OPTIONS
app.options('*', cors());

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware pour loguer les requêtes CORS
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.path} - Origin: ${req.headers.origin || 'none'}`);
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Connexion à la base de données
dbConnect();

// Dossier pour les uploads
app.use('/uploads', express.static('uploads'));

// Définition des routes
app.use("/auth", userRoute);
app.use("/api/analysis", analysisRoute);
app.use("/api/feedbacks", feedbackRoutes);

// Route de santé avec headers CORS explicites
app.get("/health", (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).json({ 
    status: "healthy", 
    service: "AI Content Analyzer",
    cors: "enabled",
    timestamp: new Date().toISOString(),
    allowedOrigins: allowedOrigins
  });
});

// Test CORS spécifique
app.get("/cors-test", (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).json({
    message: "CORS fonctionne correctement",
    timestamp: new Date().toISOString(),
    origin: req.headers.origin,
    method: req.method
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route non trouvée"
  });
});

// Error handler avec CORS
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Erreur serveur:', error);
  
  const status = error.status || 500;
  const message = error.message || 'Erreur serveur interne';
  
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur en cours d'exécution sur http://localhost:${PORT}`);
  console.log(`🌍 CORS activé pour les origines:`, allowedOrigins);
  console.log(`🩺 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 CORS test: http://localhost:${PORT}/cors-test`);
});