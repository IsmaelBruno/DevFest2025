import { useState, useEffect } from "react";
import { Send, Star, MessageSquare, Mail, User, Loader, CheckCircle, AlertCircle } from "lucide-react";
import ScrollVelocity from "../../../../../Components/VelocityScroll/VelocityScroll";
import { submitFeedback, getFeedbackStats } from "../../../../../services/ApiUser";
import { toast } from "sonner"; 
import "./Hero_3.scss";

function Hero_3() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        rating: 0,
        message: ''
    });
    const [hoveredStar, setHoveredStar] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });
    const [stats, setStats] = useState({
        total: 2500,
        averageRating: 4.9,
        satisfactionRate: 98
    });

    // Charger les statistiques au démarrage
    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const result = await getFeedbackStats();
            if (result.success) {
                setStats(result.data);
            }
        } catch (error) {
            console.error('Erreur chargement stats:', error);
        }
    };

    const showNotification = (type, message) => {
        setNotification({ show: true, type, message });
        setTimeout(() => {
            setNotification({ show: false, type: '', message: '' });
        }, 5000);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRating = (rating) => {
        setFormData({
            ...formData,
            rating
        });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🎯 Début handleSubmit');
    console.log('📝 Données du formulaire:', formData);
    
    // Validation
    if (!formData.name.trim()) {
        toast.error('❌ Validation échouée: nom manquant');
        showNotification('error', 'Veuillez entrer votre nom');
        return;
    }

    if (!formData.email.trim()) {
        toast.error('❌ Validation échouée: email manquant');
        showNotification('error', 'Veuillez entrer votre email');
        return;
    }

    // Validation email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        toast.error('❌ Validation échouée: email invalide');
        showNotification('error', 'Veuillez entrer un email valide');
        return;
    }

    if (formData.rating === 0) {
        toast.error('❌ Validation échouée: note non sélectionnée');
        showNotification('error', 'Veuillez sélectionner une note');
        return;
    }

    if (!formData.message.trim()) {
        toast.error('❌ Validation échouée: message vide');
        showNotification('error', 'Veuillez entrer votre message');
        return;
    }

    if (formData.message.trim().length < 10) {
        toast.error('❌ Validation échouée: message trop court');
        showNotification('error', 'Le message doit contenir au moins 10 caractères');
        return;
    }

    console.log('✅ Toutes les validations passées');
    console.log('🔄 Mise à jour isSubmitting à true');
    setIsSubmitting(true);

    try {
        console.log('📤 Appel à submitFeedback avec:', formData);
        const result = await submitFeedback(formData);
        console.log('📥 Résultat de submitFeedback:', result);
        
        if (result.success) {
            toast.succes('Votre Feedback a été envoyé avec succès');
            showNotification('success', '✅ Merci pour votre feedback ! Votre avis a été envoyé avec succès.');
            
            // Réinitialiser le formulaire
            setFormData({
                name: '',
                email: '',
                rating: 0,
                message: ''
            });
            setHoveredStar(0);
            
            // Rafraîchir les statistiques
            console.log('🔄 Rechargement des statistiques');
            await loadStats();
        } else {
            console.log('❌ Erreur submitFeedback:', result.message);
            showNotification('error', `❌ ${result.message || 'Une erreur est survenue'}`);
        }
    } catch (error) {
        console.error('🔥 Erreur catch dans handleSubmit:', error);
        console.error('🔥 Stack:', error.stack);
        showNotification('error', '❌ Erreur de connexion au serveur. Veuillez réessayer.');
    } finally {
        console.log('🏁 Finally: isSubmitting à false');
        setIsSubmitting(false);
    }
};
    return (
        <div className="Hero_3">
            <ScrollVelocity
                texts={['MadaScan', 'Scan Intelligent • Analyse Instantanée • IA Made in Mada']}
                velocity={100}
                className="custom-scroll-text"
            />

            {/* Notification */}
            {notification.show && (
                <div className={`feedback-notification ${notification.type}`}>
                    {notification.type === 'success' ? (
                        <CheckCircle size={20} />
                    ) : (
                        <AlertCircle size={20} />
                    )}
                    <span>{notification.message}</span>
                    <button 
                        onClick={() => setNotification({ show: false, type: '', message: '' })}
                        className="notification-close"
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="feedback-section">
                <div className="feedback-container container">

                    {/* Texte à gauche */}
                    <div className="feedback-left">
                        <div className="feedback-content">
                            <div className="content-badge">
                                <MessageSquare size={18} />
                                <span>Votre avis compte</span>
                            </div>
                            
                            <h2 className="feedback-title">
                                Améliorons
                                <span className="title-gradient"> MadaScan Ensemble</span>
                            </h2>
                            
                            <p className="feedback-description">
                                Vos suggestions nous aident à rendre MadaScan plus précis, plus rapide
                                et plus intelligent. Merci de contribuer à l'évolution d'un outil 
                                technologique conçu pour Madagascar.
                            </p>

                            <div className="feedback-stats">
                                <div className="stat-box">
                                    <div className="stat-number">{stats.total.toLocaleString()}+</div>
                                    <div className="stat-label">Avis reçus</div>
                                </div>
                                <div className="stat-box">
                                    <div className="stat-number">{stats.averageRating}/5</div>
                                    <div className="stat-label">Note moyenne</div>
                                </div>
                                <div className="stat-box">
                                    <div className="stat-number">{stats.satisfactionRate}%</div>
                                    <div className="stat-label">Satisfaction</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Formulaire à droite */}
                    <div className="feedback-right">
                        <form className="feedback-form" onSubmit={handleSubmit}>
                            <div className="form-header">
                                <h3 className="form-title">Donnez-nous votre avis</h3>
                                <p className="form-subtitle">Aidez-nous à perfectionner MadaScan</p>
                            </div>

                            <div className="form-group">
                                <label htmlFor="name" className="form-label">
                                    <User size={18} />
                                    <span>Nom complet</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Votre nom"
                                    className="form-input"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email" className="form-label">
                                    <Mail size={18} />
                                    <span>Email</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="exemple@mail.com"
                                    className="form-input"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <Star size={18} />
                                    <span>Votre note</span>
                                </label>
                                <div className="rating-stars">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            className={`star-btn ${star <= (hoveredStar || formData.rating) ? 'active' : ''}`}
                                            onClick={() => !isSubmitting && handleRating(star)}
                                            onMouseEnter={() => !isSubmitting && setHoveredStar(star)}
                                            onMouseLeave={() => !isSubmitting && setHoveredStar(0)}
                                            disabled={isSubmitting}
                                        >
                                            <Star
                                                size={32}
                                                className="star-icon"
                                                fill={star <= (hoveredStar || formData.rating) ? 'currentColor' : 'none'}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="message" className="form-label">
                                    <MessageSquare size={18} />
                                    <span>Votre message</span>
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Expliquez votre expérience avec MadaScan..."
                                    className="form-textarea"
                                    rows="5"
                                    required
                                    disabled={isSubmitting}
                                ></textarea>
                                <div className="char-counter">
                                    {formData.message.length} caractères
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="submit-button"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader size={20} className="submit-spinner" />
                                        <span>Envoi en cours...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Envoyer mon avis</span>
                                        <Send size={20} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Hero_3;