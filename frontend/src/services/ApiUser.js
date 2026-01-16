// services/ApiUser.js - VERSION SIMPLIFIÉE ET CORRIGÉE
import axios from "axios";

const API_BASE = "http://localhost:5000";

// Configuration axios de base SANS Content-Type par défaut
const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000, // Augmenté à 30 secondes
  // NE PAS définir Content-Type ici, il sera ajouté automatiquement selon le type de données
});

// Intercepteur pour gérer l'expiration du token
api.interceptors.response.use(
  response => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  error => {
    console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status || 'No response'}`);
    
    // Ne pas rediriger vers /auth pour les routes publiques
    const isPublicRoute = error.config?.url?.includes('/api/analysis/analyze') || 
                         error.config?.url?.includes('/api/analysis/status');
    
    if (error.response?.status === 401 && !isPublicRoute) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Intercepteur pour les requêtes - CRITIQUE POUR FORM DATA
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("authToken");
    
    // NE PAS ajouter le token pour les routes publiques d'analyse
    const isPublicAnalysisRoute = config.url?.includes('/api/analysis/analyze') || 
                                 config.url?.includes('/api/analysis/status');
    
    if (token && !isPublicAnalysisRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // IMPORTANT: Si c'est FormData, NE PAS définir Content-Type
    // Axios le fera automatiquement avec le bon boundary
    if (config.data instanceof FormData) {
      // Supprimer Content-Type si défini
      delete config.headers['Content-Type'];
      console.log('📤 Requête FormData détectée - Content-Type auto');
    } else if (!config.headers['Content-Type']) {
      // Sinon, mettre application/json par défaut
      config.headers['Content-Type'] = 'application/json';
    }
    
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url} - Public: ${isPublicAnalysisRoute}`);
    return config;
  },
  error => Promise.reject(error)
);

// === EXPORTATIONS INDIVIDUELLES (pour compatibilité) ===

// Authentification
export const handleSignup = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return { success: true, ...response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || "Erreur d'inscription" 
    };
  }
};

export const handleLogin = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const { user, token } = response.data;
    
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("authToken", token);
    
    return { success: true, user, token };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || "Erreur de connexion" 
    };
  }
};

// Alias pour HandleLogin (avec H majuscule) pour la compatibilité
export const HandleLogin = handleLogin;

export const handleOTP = async (otpData) => {
  try {
    const response = await api.post('/auth/verify-email', otpData);
    return { success: true, ...response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || "Erreur OTP" 
    };
  }
};

// Feedbacks (supprimez ces fonctions si vous n'avez pas de backend pour les feedbacks)
export const submitFeedback = async (feedbackData) => {
  try {
    const response = await api.post('/api/feedbacks', feedbackData);
    return { success: true, ...response.data };
  } catch (error) {
    return { 
      success: false, 
      message: "Fonctionnalité feedback désactivée (backend simplifié)",
      simulated: true
    };
  }
};

export const getFeedbackStats = async () => {
  return { 
    success: true, 
    data: {
      total: 2500,
      averageRating: 4.9,
      satisfactionRate: 98
    },
    message: "Données simulées (backend simplifié)",
    simulated: true
  };
};

export const getFeedbacks = async (params = {}) => {
  return { 
    success: true, 
    data: [],
    message: "Fonctionnalité feedback désactivée (backend simplifié)",
    simulated: true
  };
};

// Gestion des utilisateurs
export const handleUpdateUser = async (userData) => {
  try {
    const response = await api.put('/user/me', userData);
    return { success: true, ...response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || "Erreur de mise à jour" 
    };
  }
};

// === ANALYSE IA - FONCTIONS SIMPLIFIÉES ===

/**
 * Teste la connexion CORS avec le backend
 */
export const testCorsConnection = async () => {
  try {
    console.log('🧪 Test de connexion CORS...');
    
    // Test avec la route publique /status
    const response = await api.get('/api/analysis/status');
    
    console.log('✅ Connexion backend OK:', response.data);
    return { 
      success: true, 
      data: response.data,
      message: 'Connexion backend fonctionnelle'
    };
  } catch (error) {
    console.error('❌ Test CORS échoué:', error.message);
    return {
      success: false,
      message: `Impossible de se connecter au backend: ${error.message}`,
      error: error.response?.data || error.message
    };
  }
};

// Fonction d'analyse simplifiée - ROUTE PUBLIQUE
export const analyzeContent = async (type, file = null, content = '') => {
  try {
    const formData = new FormData();
    formData.append('type', type);
    
    if (file) {
      formData.append('file', file);
    }
    
    if (content) {
      formData.append('content', content);
    }

    console.log('📤 Envoi analyse (route publique)...');
    const response = await api.post('/api/analysis/analyze', formData);
    
    console.log('✅ Analyse réussie!');
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Analyse terminée'
    };
  } catch (error) {
    console.error('❌ Erreur analyse:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Erreur d\'analyse',
      data: null
    };
  }
};

// === FONCTIONS DÉSACTIVÉES (car backend sans base de données) ===

export const getAnalysisHistory = async (params = {}) => {
  return {
    success: true,
    data: [],
    message: "Historique désactivé (backend simplifié sans base de données)",
    simulated: true
  };
};

export const getAnalysisDetails = async (analysisId) => {
  return {
    success: false,
    message: "Détails désactivés (backend simplifié sans base de données)",
    data: null,
    simulated: true
  };
};

export const deleteAnalysis = async (analysisId) => {
  return {
    success: true,
    message: "Suppression désactivée (backend simplifié)",
    simulated: true
  };
};

export const getAnalysisStatistics = async () => {
  return {
    success: true,
    data: {
      totalAnalyses: 0,
      analysesByType: {
        image: 0,
        audio: 0,
        video: 0
      },
      recentActivity: []
    },
    message: "Statistiques simulées (backend simplifié)",
    simulated: true
  };
};

export const getAnalysisStatus = async () => {
  try {
    const response = await api.get('/api/analysis/status');
    return {
      success: true,
      data: response.data,
      message: response.data.message
    };
  } catch (error) {
    console.error("❌ Erreur statut service:", error.response?.data || error.message);
    
    // Version fallback
    return {
      success: true,
      data: {
        status: 'operational',
        version: '1.0.0',
        supportedTypes: ['image', 'audio', 'video'],
        features: {
          realTimeAnalysis: true,
          fileProcessing: true,
          noDatabase: true
        }
      },
      message: "Statut service (mode fallback)",
      simulated: true
    };
  }
};

// ====================================================
// API USER OBJECT - VERSION SIMPLIFIÉE
// ====================================================

const ApiUser = {
  // Authentification
  handleSignup,
  handleLogin,
  HandleLogin, // Alias avec H majuscule
  handleOTP,
  
  // Feedbacks (désactivés)
  submitFeedback,
  getFeedbackStats,
  getFeedbacks,
  
  // Utilisateurs
  handleUpdateUser,
  
  // Analyse IA (route publique)
  analyzeContent,
  
  // Historique et stats (désactivés)
  getAnalysisHistory,
  getAnalysisDetails,
  deleteAnalysis,
  getAnalysisStatistics,
  getAnalysisStatus,
  
  // Tests et débogage
  testCorsConnection,
  
  // Méthodes utilitaires
  isAuthenticated: () => {
    const token = localStorage.getItem("authToken");
    return !!token;
  },
  
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = '/auth';
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
  
  // Nouvelle méthode pour vérifier si une route est publique
  isPublicRoute: (url) => {
    return url.includes('/api/analysis/analyze') || 
           url.includes('/api/analysis/status') ||
           url.includes('/health');
  }
};

export default ApiUser;