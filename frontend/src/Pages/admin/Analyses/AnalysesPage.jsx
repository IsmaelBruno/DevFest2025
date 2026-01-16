import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Music, 
  Video, 
  AlertTriangle, 
  CheckCircle2,
  Image as ImageIcon,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  BarChart3,
  Loader,
  Calendar,
  User
} from 'lucide-react';
import ApiUser from '../../../services/ApiUser';
import './AnalysesPage.scss';

const AnalysesPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Charger les analyses au démarrage
  useEffect(() => {
    fetchAnalyses();
    fetchStats();
  }, []);

  const fetchAnalyses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiUser.getAnalysisHistory({
        page: 1,
        limit: 20
      });
      
      if (response.success) {
        setAnalyses(response.data || []);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
      console.error('Erreur fetchAnalyses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await ApiUser.getAnalysisStatistics();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Erreur fetchStats:', error);
    }
  };

  const handleDeleteAnalysis = async (analysisId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette analyse ?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await ApiUser.deleteAnalysis(analysisId);
      if (response.success) {
        // Rafraîchir la liste
        await fetchAnalyses();
        await fetchStats();
        setSelectedAnalysis(null);
        setShowDetails(false);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Erreur lors de la suppression');
      console.error('Erreur deleteAnalysis:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateAnalysis = async (analysisId, updates) => {
    try {
      // Note: L'API updateAnalysis n'est pas encore définie dans ApiUser
      // Vous devriez l'ajouter si vous voulez cette fonctionnalité
      console.log('Mise à jour de l\'analyse:', analysisId, updates);
      // const response = await ApiUser.updateAnalysis(analysisId, updates);
      alert('Fonctionnalité de mise à jour à implémenter');
    } catch (error) {
      setError('Erreur lors de la mise à jour');
      console.error('Erreur updateAnalysis:', error);
    }
  };

  const handleViewDetails = async (analysisId) => {
    try {
      const response = await ApiUser.getAnalysisDetails(analysisId);
      if (response.success) {
        setSelectedAnalysis(response.data);
        setShowDetails(true);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Erreur lors du chargement des détails');
      console.error('Erreur getAnalysisDetails:', error);
    }
  };

  const filteredAnalyses = analyses.filter(analysis => {
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'deepfakes' && analysis.isDeepfake) ||
                         (activeFilter === 'authentiques' && !analysis.isDeepfake) ||
                         analysis.type?.toLowerCase() === activeFilter;
    
    const matchesSearch = !searchQuery || 
                         analysis.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         analysis.originalFilename?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getTypeIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'image': return <ImageIcon size={18} />;
      case 'audio': return <Music size={18} />;
      case 'video': return <Video size={18} />;
      default: return <FileText size={18} />;
    }
  };

  const getTypeName = (type) => {
    switch(type?.toLowerCase()) {
      case 'image': return 'Image';
      case 'audio': return 'Audio';
      case 'video': return 'Vidéo';
      default: return 'Texte';
    }
  };

  const getResultIcon = (isDeepfake) => {
    return isDeepfake 
      ? <AlertTriangle size={18} color="#ef4444" /> 
      : <CheckCircle2 size={18} color="#10b981" />;
  };

  const getResultColor = (isDeepfake) => {
    return isDeepfake ? '#ef4444' : '#10b981';
  };

  const getResultText = (isDeepfake) => {
    return isDeepfake ? 'Deepfake' : 'Authentique';
  };

  const exportToCSV = () => {
    if (analyses.length === 0) {
      alert('Aucune donnée à exporter');
      return;
    }

    const csvContent = [
      ['ID', 'Type', 'Catégorie', 'Résultat', 'Confiance', 'Fichier', 'Date', 'Deepfake'],
      ...analyses.map(a => [
        a._id || a.id,
        getTypeName(a.type),
        a.category || 'N/A',
        getResultText(a.isDeepfake),
        `${a.confidence}%`,
        a.originalFilename || 'N/A',
        new Date(a.createdAt || a.date).toLocaleDateString('fr-FR'),
        a.isDeepfake ? 'Oui' : 'Non'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analyses-madascan-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading && analyses.length === 0) {
    return (
      <div className="analyses-page loading">
        <div className="loading-spinner">
          <Loader size={48} className="spinner" />
          <p>Chargement des analyses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analyses-page">
      <div className="page-header">
        <h1>Historique des analyses</h1>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={exportToCSV}>
            <Download size={18} />
            Exporter CSV
          </button>
          <button className="btn btn-primary" onClick={fetchAnalyses}>
            <RefreshCw size={18} />
            Actualiser
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <AlertTriangle size={20} />
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="page-filters">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par catégorie ou nom de fichier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-tabs">
          {['all', 'image', 'audio', 'video', 'deepfakes', 'authentiques'].map(filter => {
            const labels = {
              'all': 'Tous',
              'image': 'Images',
              'audio': 'Audio',
              'video': 'Vidéos',
              'deepfakes': 'Deepfakes',
              'authentiques': 'Authentiques'
            };
            
            return (
              <button
                key={filter}
                className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {labels[filter]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="analyses-stats">
        <div className="stat-card">
          <div className="stat-value">{stats?.total || 0}</div>
          <div className="stat-label">Analyses totales</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.deepfakes || 0}</div>
          <div className="stat-label">Deepfakes détectés</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {stats?.byType ? (
              <>
                <BarChart3 size={20} />
                <div className="type-breakdown">
                  {Object.entries(stats.byType).map(([type, count]) => (
                    <span key={type} className="type-count">
                      {type}: {count}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              'N/A'
            )}
          </div>
          <div className="stat-label">Par type</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {analyses.length > 0 
              ? Math.round(analyses.reduce((acc, a) => acc + a.confidence, 0) / analyses.length) + '%'
              : '0%'
            }
          </div>
          <div className="stat-label">Confiance moyenne</div>
        </div>
      </div>

      <div className="analyses-table-container">
        {filteredAnalyses.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} />
            <h3>Aucune analyse trouvée</h3>
            <p>{searchQuery || activeFilter !== 'all' ? 'Aucun résultat pour vos critères' : 'Commencez par analyser des contenus'}</p>
          </div>
        ) : (
          <table className="analyses-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Fichier / Catégorie</th>
                <th>Résultat</th>
                <th>Confiance</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAnalyses.map(analysis => (
                <tr key={analysis._id || analysis.id}>
                  <td>
                    <div className="analysis-type">
                      {getTypeIcon(analysis.type)}
                      <span>{getTypeName(analysis.type)}</span>
                    </div>
                  </td>
                  <td className="analysis-content">
                    <div className="analysis-info">
                      <div className="analysis-filename">
                        {analysis.originalFilename || 'Sans nom'}
                      </div>
                      <div className="analysis-category">
                        {analysis.category || 'Non catégorisé'}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div 
                      className="analysis-result" 
                      style={{ color: getResultColor(analysis.isDeepfake) }}
                    >
                      {getResultIcon(analysis.isDeepfake)}
                      <span>{getResultText(analysis.isDeepfake)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="confidence-indicator">
                      <div className="confidence-bar">
                        <div 
                          className="confidence-fill"
                          style={{ 
                            width: `${analysis.confidence}%`,
                            backgroundColor: getResultColor(analysis.isDeepfake)
                          }}
                        />
                      </div>
                      <span className="confidence-value">{analysis.confidence}%</span>
                    </div>
                  </td>
                  <td className="analysis-date">
                    <Calendar size={14} />
                    {new Date(analysis.createdAt || analysis.date).toLocaleDateString('fr-FR')}
                    <br />
                    <small>
                      {new Date(analysis.createdAt || analysis.date).toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </small>
                  </td>
                  <td>
                    <div className="analysis-actions">
                      <button 
                        className="action-btn view"
                        onClick={() => handleViewDetails(analysis._id || analysis.id)}
                        title="Voir les détails"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDeleteAnalysis(analysis._id || analysis.id)}
                        disabled={isDeleting}
                        title="Supprimer"
                      >
                        {isDeleting ? <Loader size={16} /> : <Trash2 size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de détails */}
      {showDetails && selectedAnalysis && (
        <div className="details-modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Détails de l'analyse</h2>
              <button className="close-btn" onClick={() => setShowDetails(false)}>×</button>
            </div>
            
            <div className="modal-content">
              <div className="analysis-details">
                <div className="detail-row">
                  <span className="detail-label">ID:</span>
                  <span className="detail-value">{selectedAnalysis._id || selectedAnalysis.id}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">
                    {getTypeIcon(selectedAnalysis.type)}
                    {getTypeName(selectedAnalysis.type)}
                  </span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Fichier:</span>
                  <span className="detail-value">{selectedAnalysis.originalFilename || 'N/A'}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Catégorie:</span>
                  <span className="detail-value">{selectedAnalysis.category || 'Non catégorisé'}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Résultat:</span>
                  <span 
                    className="detail-value result"
                    style={{ color: getResultColor(selectedAnalysis.isDeepfake) }}
                  >
                    {getResultIcon(selectedAnalysis.isDeepfake)}
                    {getResultText(selectedAnalysis.isDeepfake)}
                  </span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Confiance:</span>
                  <span className="detail-value">{selectedAnalysis.confidence}%</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Date d'analyse:</span>
                  <span className="detail-value">
                    {new Date(selectedAnalysis.createdAt || selectedAnalysis.date).toLocaleString('fr-FR')}
                  </span>
                </div>
                
                {selectedAnalysis.metadata && (
                  <>
                    <div className="detail-row">
                      <span className="detail-label">Modèle utilisé:</span>
                      <span className="detail-value">{selectedAnalysis.metadata.modelUsed}</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="detail-label">Temps d'analyse:</span>
                      <span className="detail-value">{selectedAnalysis.metadata.analysisTime}ms</span>
                    </div>
                  </>
                )}
                
                {selectedAnalysis.indicators && selectedAnalysis.indicators.length > 0 && (
                  <div className="indicators-section">
                    <h4>Indicateurs</h4>
                    <div className="indicators-list">
                      {selectedAnalysis.indicators.map((indicator, index) => (
                        <div key={index} className="indicator-item">
                          <div className="indicator-label">{indicator.label}</div>
                          <div className="indicator-score">{indicator.score}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="modal-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowDetails(false)}
                >
                  Fermer
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => {
                    handleDeleteAnalysis(selectedAnalysis._id || selectedAnalysis.id);
                    setShowDetails(false);
                  }}
                  disabled={isDeleting}
                >
                  <Trash2 size={18} />
                  Supprimer cette analyse
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysesPage;