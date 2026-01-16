import { useState, useEffect } from 'react';
import { RefreshCw, MessageSquare, Star, AlertCircle } from 'lucide-react';
import TransactionItem from '../TransactionItem/TransactionItem';
import { getFeedbacks } from '../../../services/ApiUser';
import './RecentTransaction.scss';

const RecentTransactions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    average: 0,
    positive: 0
  });

  // Charger les feedbacks au démarrage
  useEffect(() => {
    loadFeedbacks();
  }, []);

  // Fonction pour charger les feedbacks depuis l'API
  const loadFeedbacks = async () => {
    try {
      setError(null);
      const result = await getFeedbacks({ limit: 6 });
      
      if (result.success) {
        // Formater les données
        const formattedFeedbacks = result.data.map((feedback) => {
          // Déterminer le type basé sur la note
          let type = 'neutral';
          if (feedback.rating >= 4) type = 'positive';
          if (feedback.rating <= 2) type = 'negative';
          
          // Formater la date
          const date = feedback.createdAt 
            ? new Date(feedback.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })
            : 'Date inconnue';
          
          // Créer les initiales pour l'avatar
          const initials = feedback.name 
            ? feedback.name.split(' ').map(n => n[0] || '').join('').substring(0, 2).toUpperCase()
            : 'U';
          
          return {
            id: feedback._id || feedback.id,
            date: date,
            description: feedback.message?.length > 50 
              ? feedback.message.substring(0, 50) + '...' 
              : feedback.message || '',
            note: `${feedback.rating || 0}/5`,
            rating: feedback.rating || 0,
            type: type,
            initials: initials,
            name: feedback.name || 'Utilisateur',
            email: feedback.email || '',
            fullMessage: feedback.message || '',
            createdAt: feedback.createdAt
          };
        });
        
        setFeedbacks(formattedFeedbacks);
        
        // Calculer les statistiques
        if (formattedFeedbacks.length > 0) {
          const positiveCount = formattedFeedbacks.filter(f => f.rating >= 4).length;
          const totalRating = formattedFeedbacks.reduce((sum, f) => sum + f.rating, 0);
          const averageRating = totalRating / formattedFeedbacks.length;
          
          setStats({
            total: formattedFeedbacks.length,
            average: averageRating.toFixed(1),
            positive: Math.round((positiveCount / formattedFeedbacks.length) * 100)
          });
        }
      } else {
        setError(result.message || 'Erreur lors du chargement des feedbacks');
      }
    } catch (error) {
      console.error('Erreur chargement feedbacks:', error);
      setError('Impossible de charger les feedbacks depuis le serveur');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadFeedbacks();
  };

  const handleLoadMore = async () => {
    // Implémentez la pagination ici si nécessaire
    console.log('Charger plus de feedbacks');
  };

  // Si chargement initial
  if (isLoading) {
    return (
      <section className="recent-transactions">
        <div className="recent-transactions__header">
          <h3 className="recent-transactions__title">Feedbacks des Utilisateurs</h3>
        </div>
        <div className="loading-feedbacks">
          <div className="loading-spinner"></div>
          <p>Chargement des feedbacks...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="recent-transactions">
      <div className="recent-transactions__header">
        <div className="header-left">
          <h3 className="recent-transactions__title">
            <MessageSquare size={18} style={{ marginRight: '8px' }} />
            Feedbacks Récents
          </h3>
          {feedbacks.length > 0 && (
            <div className="stats-badge">
              <span className="stats-count">{stats.total}</span>
              <span className="stats-label">avis</span>
            </div>
          )}
        </div>
        <button 
          className={`recent-transactions__refresh ${isRefreshing ? 'refreshing' : ''}`}
          onClick={handleRefresh}
          disabled={isRefreshing}
          title="Rafraîchir"
        >
          <RefreshCw 
            size={16} 
            className={isRefreshing ? 'recent-transactions__refresh-icon--spinning' : ''}
          />
        </button>
      </div>

      {/* Statistiques résumées */}
      {feedbacks.length > 0 && (
        <div className="feedback-summary">
          <div className="summary-item">
            <Star size={16} className="summary-icon" />
            <span className="summary-value">{stats.average}</span>
            <span className="summary-label">/5</span>
          </div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="feedback-error">
          <AlertCircle size={20} style={{ marginRight: '10px' }} />
          <span style={{ flex: 1 }}>{error}</span>
          <button onClick={handleRefresh} className="retry-button">
            Réessayer
          </button>
        </div>
      )}

      {/* Liste des feedbacks */}
      <div className="recent-transactions__list">
        {feedbacks.length === 0 && !error ? (
          <div className="no-feedbacks">
            <MessageSquare size={48} />
            <p>Aucun feedback pour le moment</p>
            <p>Soyez le premier à donner votre avis !</p>
          </div>
        ) : (
          feedbacks.map((feedback) => (
            <div key={feedback.id} className="feedback-item">
              <div className="feedback-avatar-container">
                <div className="avatar-initials">
                  {feedback.initials}
                </div>
              </div>
              <TransactionItem 
                date={feedback.date}
                description={feedback.description}
                amount={feedback.note}
                type={feedback.type}
                metadata={
                  <div className="feedback-metadata">
                    <span className="feedback-name">{feedback.name}</span>
                    {feedback.email && (
                      <span className="feedback-email">{feedback.email}</span>
                    )}
                  </div>
                }
              />
            </div>
          ))
        )}
      </div>
      
      {/* Bouton Voir Plus */}
      {feedbacks.length > 0 && feedbacks.length >= 6 && (
        <button 
          className="recent-transactions__load-more"
          onClick={handleLoadMore}
        >
          VOIR PLUS DE FEEDBACKS
        </button>
      )}
    </section>
  );
};

export default RecentTransactions;