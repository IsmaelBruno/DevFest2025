import { useState } from "react";
import { Send, Star, MessageSquare, Mail, User } from "lucide-react";
import ScrollVelocity from "../../../../../Components/VelocityScroll/VelocityScroll";
import "./Hero_3.scss";

function Hero_3() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        rating: 0,
        message: ''
    });
    const [hoveredStar, setHoveredStar] = useState(0);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Feedback soumis:', formData);
    };

    return (
        <div className="Hero_3">
            <ScrollVelocity
                texts={['MadaScan', 'Scan Intelligent • Analyse Instantanée • IA Made in Mada']}
                velocity={100}
                className="custom-scroll-text"
            />

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
                                et plus intelligent. Merci de contribuer à l’évolution d’un outil 
                                technologique conçu pour Madagascar.
                            </p>

                            <div className="feedback-stats">
                                <div className="stat-box">
                                    <div className="stat-number">2.5K+</div>
                                    <div className="stat-label">Avis reçus</div>
                                </div>
                                <div className="stat-box">
                                    <div className="stat-number">4.9/5</div>
                                    <div className="stat-label">Note moyenne</div>
                                </div>
                                <div className="stat-box">
                                    <div className="stat-number">98%</div>
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
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <Star size={18} />
                                    <span>Votre note</span>
                                </label>
                                <div className="rating-stars">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={32}
                                            className={`star ${
                                                star <= (hoveredStar || formData.rating) ? 'active' : ''
                                            }`}
                                            onClick={() => handleRating(star)}
                                            onMouseEnter={() => setHoveredStar(star)}
                                            onMouseLeave={() => setHoveredStar(0)}
                                            fill={star <= (hoveredStar || formData.rating) ? 'currentColor' : 'none'}
                                        />
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
                                ></textarea>
                            </div>

                            <button type="submit" className="submit-button">
                                <span>Envoyer mon avis</span>
                                <Send size={20} />
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Hero_3;
