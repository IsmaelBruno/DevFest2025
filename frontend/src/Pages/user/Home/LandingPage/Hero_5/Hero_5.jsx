import { motion } from "framer-motion";
import { Users, Star } from "lucide-react";
import CountUp from "react-countup";
import BubbleMessage from "../../../../../Components/BubleMessage/BubleMessage";
import WomanThink from "../../../../../assets/Images/Thinking.png";
import "./Hero_5.scss";

function Hero_5() {
    const messages = [
        "Bonjour...",
        "Bienvenue dans MadaScan",
        "La plateforme sur les IA critiques...",
    ];

    // Variants Framer Motion
    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: (i = 1) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.3, duration: 0.8, ease: "easeOut" },
        }),
    };

    const slideIn = {
        hidden: { opacity: 0, x: 60 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { delay: 0.5, duration: 0.8, ease: "easeOut" },
        },
    };

    const imageFloat = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { 
                delay: 0.7, 
                duration: 1, 
                ease: "easeOut",
                y: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                }
            }
        }
    };

    return (
        <section className="Hero_5">
            <div className="hero-container">
                {/* SVG grid overlay avec couleur bleue */}
                <div className="svg-grid-overlay">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin slice">
                        <defs>
                            <pattern id="grid" width="2" height="2" patternUnits="userSpaceOnUse">
                                <path d="M 2 0 L 0 0 0 2" fill="none" stroke="rgba(4, 113, 133, 0.3)" strokeWidth="0.3" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                {/* --- Contenu principal --- */}
                <div className="hero-content container">
                    <motion.div
                        className="hero-text"
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                    >
                        <motion.div className="badge" variants={fadeUp} custom={0.2}>
                            <span>Édition Limitée</span>
                        </motion.div>

                        <motion.h1 className="hero-title" variants={fadeUp} custom={0.4}>
                            <span className="title-gradient">Mada Scan</span>
                            <span className="title-accent">Vérification D'IA</span>
                        </motion.h1>

                        <motion.p className="hero-description" variants={fadeUp} custom={0.6}>
                            Une plateforme pour combattre la désinformation et vérifier les contenus générés par l'IA en temps réel.
                        </motion.p>

                        <motion.div className="hero-stats" variants={fadeUp} custom={0.8}>
                            <div className="stat-item">
                                <Users size={20} />
                                <div className="stat-content">
                                    <span className="stat-value">
                                        <CountUp end={100} duration={2.5} suffix="K+" />
                                    </span>
                                    <span className="stat-label">Utilisateurs</span>
                                </div>
                            </div>

                            <div className="stat-item">
                                <Star size={20} />
                                <div className="stat-content">
                                    <span className="stat-value">
                                        <CountUp end={4.9} duration={2.5} decimals={1} suffix="/5" />
                                    </span>
                                    <span className="stat-label">Fiabilité</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Image directe à droite sans conteneur */}
                    <motion.div 
                        className="hero-image-direct"
                        initial="hidden"
                        animate="visible"
                        variants={imageFloat}
                    >
                        <img 
                            src={WomanThink} 
                            alt="Femme utilisant Mada Scan pour vérifier des informations" 
                            className="hero-image-large"
                        />
                        {/* BubbleMessage positionné en dessous de l'image */}
                        <div className="bubble-container">
                            <BubbleMessage 
                                messages={messages}
                                delay={4000}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default Hero_5;