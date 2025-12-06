import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trash2, 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Eye,
  EyeOff,
  Download,
  Share2,
  ChevronDown,
  TrendingUp,
  Calendar
} from 'lucide-react';
import './Historique.scss';

export default function Historique() {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);

  const historyData = [
    {
      id: 1,
      type: 'deepfake',
      status: 'detected',
      title: 'Vidéo deepfake détectée',
      description: 'Analyse vidéo - Probabilité: 94%',
      confidence: 94,
      date: '2025-12-04',
      time: '14:32',
      source: 'Facebook',
      thumbnail: '🎬',
      details: 'Détection d\'une vidéo manipulée avec technologie deepfake. Plusieurs indices détectés: mouvements oculaires, synchronisation audio-visuelle anormale.'
    },
    {
      id: 2,
      type: 'image',
      status: 'suspicious',
      title: 'Image générée par IA identifiée',
      description: 'Analyse image - Probabilité: 87%',
      confidence: 87,
      date: '2025-12-04',
      time: '13:15',
      source: 'Twitter',
      thumbnail: '🖼️',
      details: 'Image générée synthétiquement détectée. Artefacts visuels typiques de la génération par IA observés dans les détails fins.'
    },
    {
      id: 3,
      type: 'audio',
      status: 'verified',
      title: 'Contenu audio légitime',
      description: 'Analyse audio - Confiance: 99%',
      confidence: 99,
      date: '2025-12-04',
      time: '11:45',
      source: 'WhatsApp',
      thumbnail: '🎙️',
      details: 'Contenu audio vérifié comme authentique. Aucun signe de synthèse vocale ou de manipulation détecté.'
    },
    {
      id: 4,
      type: 'image',
      status: 'detected',
      title: 'Fausse image détectée',
      description: 'Analyse image - Probabilité: 91%',
      confidence: 91,
      date: '2025-12-03',
      time: '16:20',
      source: 'TikTok',
      thumbnail: '🖼️',
      details: 'Image composite détectée. Fusion d\'éléments provenant de sources différentes identifiée avec certitude.'
    },
    {
      id: 5,
      type: 'text',
      status: 'suspicious',
      title: 'Contenu texte douteux',
      description: 'Analyse texte - Probabilité: 72%',
      confidence: 72,
      date: '2025-12-03',
      time: '09:10',
      source: 'Facebook',
      thumbnail: '📄',
      details: 'Texte présentant des caractéristiques de désinformation. Vérification factuelle recommandée.'
    },
    {
      id: 6,
      type: 'video',
      status: 'verified',
      title: 'Vidéo authentifiée',
      description: 'Analyse vidéo - Confiance: 96%',
      confidence: 96,
      date: '2025-12-02',
      time: '15:40',
      source: 'YouTube',
      thumbnail: '🎥',
      details: 'Vidéo vérifiée comme authentique. Source et contexte confirmés. Aucune manipulation détectée.'
    }
  ];

  const filteredData = historyData.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'detected':
        return <AlertCircle className="status-icon alert" />;
      case 'suspicious':
        return <Clock className="status-icon warning" />;
      case 'verified':
        return <CheckCircle className="status-icon verified" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'detected':
        return 'Détecté';
      case 'suspicious':
        return 'Suspect';
      case 'verified':
        return 'Vérifié';
      default:
        return '';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="historique-page">
      {/* Header */}
      <motion.div 
        className="historique-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <div className="header-text">
            <h1>Historique de Vérification</h1>
            <p>Consultez tous vos contenus analysés avec Mada Scan</p>
          </div>
          <div className="header-stats">
            <div className="stat-card detected">
              <TrendingUp size={24} />
              <div>
                <span className="stat-number">4</span>
                <span className="stat-label">Détectés</span>
              </div>
            </div>
            <div className="stat-card verified">
              <CheckCircle size={24} />
              <div>
                <span className="stat-number">2</span>
                <span className="stat-label">Vérifiés</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div 
        className="historique-controls"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="search-box">
          <Search size={20} />
          <input 
            type="text" 
            placeholder="Rechercher dans l'historique..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="filter-select">
            <Filter size={20} />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">Tous les types</option>
              <option value="deepfake">Deepfake</option>
              <option value="image">Image</option>
              <option value="audio">Audio</option>
              <option value="video">Vidéo</option>
              <option value="text">Texte</option>
            </select>
          </div>

          <button 
            className="btn-visibility"
            onClick={() => setShowDeleted(!showDeleted)}
            title={showDeleted ? "Masquer supprimés" : "Afficher supprimés"}
          >
            {showDeleted ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
      </motion.div>

      {/* History List */}
      <motion.div 
        className="historique-list"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <motion.div
              key={item.id}
              className={`history-card status-${item.status}`}
              variants={itemVariants}
            >
              <div 
                className="card-header"
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              >
                <div className="card-left">
                  <div className="thumbnail">{item.thumbnail}</div>
                  <div className="card-info">
                    <div className="card-title">
                      <h3>{item.title}</h3>
                      <span className={`status-badge status-${item.status}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </div>
                    <p className="card-description">{item.description}</p>
                    <div className="card-meta">
                      <span className="source">
                        <Calendar size={14} />
                        {item.date} à {item.time}
                      </span>
                      <span className="source">
                        Source: <strong>{item.source}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card-right">
                  <div className="confidence-bar">
                    <div className="confidence-fill" style={{width: `${item.confidence}%`}}></div>
                    <span className="confidence-text">{item.confidence}%</span>
                  </div>
                  {getStatusIcon(item.status)}
                  <ChevronDown 
                    size={20} 
                    className={`chevron ${expandedId === item.id ? 'open' : ''}`}
                  />
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === item.id && (
                <motion.div 
                  className="card-details"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="details-text">{item.details}</p>
                  <div className="card-actions">
                    <button className="action-btn">
                      <Download size={18} />
                      Télécharger le rapport
                    </button>
                    <button className="action-btn">
                      <Share2 size={18} />
                      Partager
                    </button>
                    <button className="action-btn delete">
                      <Trash2 size={18} />
                      Supprimer
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))
        ) : (
          <motion.div 
            className="empty-state"
            variants={itemVariants}
          >
            <Search size={48} />
            <h3>Aucun résultat trouvé</h3>
            <p>Vérifiez vos critères de recherche et réessayez</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}