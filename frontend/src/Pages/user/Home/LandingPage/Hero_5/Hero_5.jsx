import { motion } from "framer-motion";
import { ArrowUpRight, Users, Sparkles, Star } from "lucide-react";
import CountUp from "react-countup";
import video from "../../../../../assets/Team.mp4";
import video1 from "../../../../../assets/Video.mp4";
import "./Hero_5.scss";

function Hero_5() {
    // Variants Framer Motion
    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: (i = 1) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.3, duration: 0.8, ease: "easeOut" },
        }),
    };

    return (
        <section className="Hero_5">
            <div className="hero-container">
                {/* --- Arrière-plan vidéo --- */}
                <div className="video-background">
                    <video className="bg-video" autoPlay muted loop playsInline>
                        <source src={video} type="video/mp4" />
                    </video>
                    <div className="video-overlay"></div>
                </div>
                <div className="svg-grid-overlay">
                    <div className="svg-grid-overlay">
                        <div className="svg-grid-overlay">
                            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin slice">
                                <defs>
                                    <pattern id="grid" width="2" height="2" patternUnits="userSpaceOnUse">
                                        <path d="M 2 0 L 0 0 0 2" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" />
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#grid)" />
                            </svg>

                        </div>

                    </div>



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
                            <Sparkles size={18} />
                            <span>Édition Limitée</span>
                        </motion.div>

                        <motion.h1 className="hero-title" variants={fadeUp} custom={0.4}>
                            <span className="title-gradient">Edden</span>
                            <span className="title-accent">Portail Sacré</span>
                        </motion.h1>

                        <motion.p className="hero-description" variants={fadeUp} custom={0.6}>
                            Un portail sacré entre les cieux et la mer, où Poséidon veille depuis
                            son trône d’écume. Explorez les mystères de l’Olympe et laissez la
                            magie divine guider vos pas.
                        </motion.p>

                        <motion.div className="hero-stats" variants={fadeUp} custom={0.8}>
                            <div className="stat-item">
                                <Users size={20} />
                                <div className="stat-content">
                                    <span className="stat-value">
                                        <CountUp end={100} duration={2.5} suffix="K+" />
                                    </span>
                                    <span className="stat-label">Explorateurs</span>
                                </div>
                            </div>

                            <div className="stat-item">
                                <Star size={20} />
                                <div className="stat-content">
                                    <span className="stat-value">
                                        <CountUp end={4.9} duration={2.5} decimals={1} suffix="/5" />
                                    </span>
                                    <span className="stat-label">Évaluation</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* --- Carte à droite --- */}
                    <motion.div
                        className="hero-card"
                        initial={{ opacity: 0, scale: 0.9, x: 60 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="card-image">
                            <video className="card-video" autoPlay muted loop playsInline>
                                <source src={video1} type="video/mp4" />
                            </video>

                        </div>
                        <div className="card-content">
                            <h3 className="card-title">Expérience Immersive</h3>
                            <p className="card-description">
                                Traversez les jardins d’Élysée et découvrez une dimension où le sacré
                                rencontre le merveilleux.
                            </p>
                            <div className="card-footer">
                                <motion.div
                                    className="card-link"
                                    whileHover={{ x: 5, y: -3 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <span>Explorer</span>
                                    <ArrowUpRight size={16} />
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default Hero_5;
