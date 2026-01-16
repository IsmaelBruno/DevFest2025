// services/cloudService.js
import axios from 'axios';

export class CloudDashboardService {
  constructor() {
    // Récupération des variables d'environnement React
    this.HF_API_KEY = import.meta.env?.REACT_APP_HUGGINGFACE_TOKEN || 
                      import.meta.env?.VITE_HUGGINGFACE_TOKEN ||
                      process.env?.REACT_APP_HUGGINGFACE_TOKEN ||
                      process.env?.VITE_HUGGINGFACE_TOKEN;
    
    this.NEWS_API_KEY = import.meta.env?.REACT_APP_NEWS_API_KEY ||
                        import.meta.env?.VITE_NEWS_API_KEY ||
                        process.env?.REACT_APP_NEWS_API_KEY ||
                        process.env?.VITE_NEWS_API_KEY;
    
    console.log('CloudService init:', { 
      hasHFKey: !!this.HF_API_KEY,
      hasNewsKey: !!this.NEWS_API_KEY 
    });
  }

  // 1. Données Hugging Face (modèles IA populaires)
  async getHuggingFaceTrends() {
    try {
      console.log('Fetching HF trends...');
      // Utilisation de l'API publique (ne nécessite pas de token)
      const response = await axios.get(
        'https://huggingface.co/api/models?sort=likes&direction=-1&limit=10',
        {
          timeout: 10000,
          headers: this.HF_API_KEY ? {
            'Authorization': `Bearer ${this.HF_API_KEY}`
          } : {}
        }
      );
      
      console.log('HF response received');
      const trendingModels = response.data.slice(0, 5);
      
      return {
        totalModels: response.data.length,
        trendingModels: trendingModels.map(model => ({
          modelId: model.modelId,
          downloads: model.downloads || 0,
          likes: model.likes || 0,
          tags: model.tags || [],
          private: model.private || false
        })),
        totalDownloads: trendingModels.reduce((acc, model) => 
          acc + (model.downloads || 0), 0
        ),
        avgLikes: Math.round(
          trendingModels.reduce((acc, model) => 
            acc + (model.likes || 0), 0
          ) / trendingModels.length
        )
      };
    } catch (error) {
      console.error('Hugging Face error:', error.message);
      return this.getMockHFData();
    }
  }

  // 2. Actualités IA (optionnel - si vous avez News API)
  async getAINews() {
    if (!this.NEWS_API_KEY) {
      console.log('No News API key, using mock data');
      return this.getMockNewsData();
    }
    
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=artificial+intelligence+deepfake&language=fr&sortBy=publishedAt&pageSize=3&apiKey=${this.NEWS_API_KEY}`,
        { timeout: 10000 }
      );
      
      return {
        totalArticles: response.data.totalResults,
        latestArticles: response.data.articles.slice(0, 3).map(article => ({
          title: article.title,
          source: article.source.name,
          date: new Date(article.publishedAt).toLocaleDateString('fr-FR'),
          url: article.url
        })),
        sentiment: this.analyzeSentiment(response.data.articles)
      };
    } catch (error) {
      console.error('News API error:', error.message);
      return this.getMockNewsData();
    }
  }

  // 3. Métriques GitHub (projets IA)
  async getGitHubAIMetrics() {
    try {
      const repos = [
        'openai/whisper',
        'runwayml/stable-diffusion',
        'deepmind/alphafold',
        'microsoft/DeepSpeed'
      ];
      
      const promises = repos.map(repo =>
        axios.get(`https://api.github.com/repos/${repo}`, { timeout: 10000 })
      );
      
      const results = await Promise.all(promises);
      
      return {
        totalStars: results.reduce((acc, r) => acc + r.data.stargazers_count, 0),
        totalForks: results.reduce((acc, r) => acc + r.data.forks_count, 0),
        avgGrowth: this.calculateGrowthRate(results.map(r => r.data)),
        mostPopular: results.sort((a, b) => 
          b.data.stargazers_count - a.data.stargazers_count
        )[0].data.name
      };
    } catch (error) {
      console.error('GitHub API error:', error.message);
      return this.getMockGitHubData();
    }
  }

  // 4. Métriques en temps réel (simulées)
  getLiveCloudMetrics() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    // Simuler des variations basées sur l'heure et la minute
    const timeFactor = hour + (minute / 60);
    const sinFactor = Math.sin(timeFactor * Math.PI / 12);
    
    return {
      activeUsers: Math.floor(500 + sinFactor * 200),
      apiCalls: Math.floor(24012 + sinFactor * 5000),
      responseTime: Math.floor(50 + Math.abs(sinFactor) * 100),
      successRate: 95 + Math.abs(sinFactor) * 3,
      concurrentAnalyses: Math.floor(10 + Math.abs(sinFactor) * 40),
      storageUsed: (10 + Math.abs(sinFactor) * 40).toFixed(2),
      costPerHour: (0.5 + Math.abs(sinFactor) * 1.5).toFixed(2),
      timestamp: now.toISOString()
    };
  }

  // 5. Test simple de l'API Hugging Face
  async testHFConnection() {
    try {
      const response = await axios.get(
        'https://huggingface.co/api/models?limit=1',
        {
          timeout: 5000,
          headers: this.HF_API_KEY ? {
            'Authorization': `Bearer ${this.HF_API_KEY}`
          } : {}
        }
      );
      
      return {
        success: true,
        status: response.status,
        hasToken: !!this.HF_API_KEY,
        modelsCount: response.headers['x-total-count'] || 'Unknown'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        hasToken: !!this.HF_API_KEY
      };
    }
  }

  // Méthodes de simulation (fallback)
  getMockHFData() {
    console.log('Using mock HF data');
    return {
      totalModels: 456789,
      trendingModels: [
        { modelId: 'gpt2', downloads: 15000000, likes: 8500, tags: ['text-generation'] },
        { modelId: 'bert-base-uncased', downloads: 12000000, likes: 7200, tags: ['fill-mask'] },
        { modelId: 'stabilityai/stable-diffusion-2', downloads: 9000000, likes: 6500, tags: ['text-to-image'] },
        { modelId: 'distilbert-base-uncased', downloads: 8000000, likes: 5800, tags: ['text-classification'] },
        { modelId: 'google/vit-base-patch16-224', downloads: 5000000, likes: 4500, tags: ['image-classification'] }
      ],
      totalDownloads: 45000000,
      avgLikes: 7400
    };
  }

  getMockNewsData() {
    return {
      totalArticles: 1250,
      latestArticles: [
        {
          title: 'Nouvelle avancée dans la détection de deepfakes par IA',
          source: 'TechNews',
          date: new Date().toLocaleDateString('fr-FR'),
          url: '#'
        },
        {
          title: 'Hugging Face lance un nouveau modèle de détection de contenu généré',
          source: 'AIToday',
          date: new Date(Date.now() - 86400000).toLocaleDateString('fr-FR'),
          url: '#'
        },
        {
          title: 'Les gouvernements adoptent des outils de vérification de contenu IA',
          source: 'SecurityBrief',
          date: new Date(Date.now() - 172800000).toLocaleDateString('fr-FR'),
          url: '#'
        }
      ],
      sentiment: 'positive'
    };
  }

  getMockGitHubData() {
    return {
      totalStars: 1250000,
      totalForks: 250000,
      avgGrowth: 12.5,
      mostPopular: 'stable-diffusion'
    };
  }

  analyzeSentiment(articles) {
    const positiveWords = ['avancée', 'innovation', 'réussite', 'progrès', 'solution', 'positif'];
    const negativeWords = ['risque', 'danger', 'problème', 'menace', 'fraude', 'négatif'];
    
    let score = 0;
    articles.forEach(article => {
      const text = (article.title + ' ' + (article.description || '')).toLowerCase();
      positiveWords.forEach(word => {
        if (text.includes(word)) score++;
      });
      negativeWords.forEach(word => {
        if (text.includes(word)) score--;
      });
    });
    
    return score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';
  }

  calculateGrowthRate(repos) {
    const avgGrowth = repos.reduce((acc, repo) => {
      const createdAt = new Date(repo.created_at);
      const daysOld = Math.max(1, (new Date() - createdAt) / (1000 * 60 * 60 * 24));
      return acc + (repo.stargazers_count / daysOld);
    }, 0) / repos.length;
    
    return avgGrowth.toFixed(1);
  }
}

// Version alternative plus simple pour débuter
export class SimpleCloudService {
  async getDashboardData() {
    // Données simulées immédiates (pas d'API nécessaire)
    const now = new Date();
    
    return {
      hfTrends: {
        totalModels: 456789,
        trendingModels: [
          { modelId: 'gpt2', downloads: 15000000, likes: 8500 },
          { modelId: 'stable-diffusion', downloads: 9000000, likes: 6500 },
          { modelId: 'whisper', downloads: 5000000, likes: 4500 }
        ],
        totalDownloads: 45000000,
        avgLikes: 7400
      },
      aiNews: {
        totalArticles: 1250,
        latestArticles: [
          {
            title: 'MadScan intégre la détection IA en temps réel',
            source: 'MadScan News',
            date: now.toLocaleDateString('fr-FR'),
            url: '#'
          }
        ],
        sentiment: 'positive'
      },
      githubMetrics: {
        totalStars: 1250000,
        totalForks: 250000,
        avgGrowth: 12.5,
        mostPopular: 'stable-diffusion'
      },
      liveMetrics: {
        activeUsers: Math.floor(500 + Math.random() * 200),
        apiCalls: Math.floor(24012 + Math.random() * 5000),
        responseTime: Math.floor(50 + Math.random() * 100),
        successRate: 95 + Math.random() * 4,
        concurrentAnalyses: Math.floor(10 + Math.random() * 40),
        storageUsed: (10 + Math.random() * 40).toFixed(2),
        costPerHour: (0.5 + Math.random() * 1.5).toFixed(2),
        timestamp: now.toISOString()
      }
    };
  }
}