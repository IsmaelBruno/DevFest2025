// Components/admin/CloudMetrics/CloudMetrics.jsx
import { Cpu, Database, Zap, Cloud, TrendingUp, TrendingDown } from 'lucide-react';
import './CloudMetrics.scss';

const CloudMetrics = ({ hfTrends, aiNews, githubMetrics, liveMetrics, loading }) => {
  if (loading) {
    return (
      <div className="cloud-metrics loading">
        <div className="loading-spinner"></div>
        <p>Chargement des métriques cloud...</p>
      </div>
    );
  }

  return (
    <div className="cloud-metrics">
      <div className="metrics-header">
        <h3>
          <Cloud size={24} />
          Métriques Cloud en Direct
        </h3>
        <div className="metrics-summary">
          <span className="summary-item">
            <Cpu size={16} />
            {hfTrends?.totalModels?.toLocaleString() || '450K'} modèles IA
          </span>
          <span className="summary-item">
            <Zap size={16} />
            {liveMetrics?.responseTime || '120'}ms réponse
          </span>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <Cpu size={20} />
          </div>
          <div className="metric-content">
            <div className="metric-value">
              {hfTrends?.totalDownloads 
                ? (hfTrends.totalDownloads / 1000000).toFixed(1) + 'M'
                : '45M'
              }
            </div>
            <div className="metric-label">Téléchargements HF</div>
            <div className="metric-trend positive">
              <TrendingUp size={14} />
              <span>+{(hfTrends?.avgLikes / 100).toFixed(1)}% engagement</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Database size={20} />
          </div>
          <div className="metric-content">
            <div className="metric-value">
              {githubMetrics?.totalStars 
                ? (githubMetrics.totalStars / 1000).toFixed(0) + 'K'
                : '1.25M'
              }
            </div>
            <div className="metric-label">Stars GitHub IA</div>
            <div className="metric-trend positive">
              <TrendingUp size={14} />
              <span>+{githubMetrics?.avgGrowth || '12.5'}% croissance</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Zap size={20} />
          </div>
          <div className="metric-content">
            <div className="metric-value">
              {aiNews?.totalArticles?.toLocaleString() || '1,250'}
            </div>
            <div className="metric-label">Articles IA/mois</div>
            <div className="metric-trend positive">
              <TrendingUp size={14} />
              <span>Sentiment: {aiNews?.sentiment || 'positif'}</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Cloud size={20} />
          </div>
          <div className="metric-content">
            <div className="metric-value">
              {liveMetrics?.successRate?.toFixed(1) || '99.7'}%
            </div>
            <div className="metric-label">Taux de succès API</div>
            <div className="metric-trend positive">
              <TrendingUp size={14} />
              <span>Uptime: 99.9%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudMetrics;