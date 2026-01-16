import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Auth.scss";
import { Lock, Mail, ChevronRight, Shield, Code, FileText, Key } from "lucide-react";
import { Link } from "react-router-dom";
import { HandleLogin } from "../../services/ApiUser";
import { useNavigate } from "react-router-dom";
import { Toaster , toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [scan, setScan] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const user = await HandleLogin({ email, password });
      
      if (user?.error) {
        toast.error(`Erreur lors de la connexion: ${user.error}`);
        setIsLoading(false);
        return;
      }
      
      // Stocker l'authentification dans sessionStorage
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('userRole', user.role || 'user');
      sessionStorage.setItem('userEmail', user.email || email);
      sessionStorage.setItem('authToken', user.token || '');
      
      // Stocker également dans localStorage pour persistance
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', user.role || 'user');
      localStorage.setItem('userEmail', user.email || email);
      localStorage.setItem('authToken', user.token || '');
      
      // Vérifier le rôle et rediriger
      if (user.role === "admin" || user.role === "user") {
        navigate("/madascan-app/admin/dashboard");
      } else {
        navigate("/madascan-app/admin/dashboard");
      }
      
    } catch (error) {
      toast.error("Erreur lors de la connexion, veuillez réessayer");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };
  
  const fadeInUp = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const features = [
    { icon: <Key size={20} />, text: "Authentification sécurisée" },
    { icon: <Shield size={20} />, text: "Protection des données" },
    { icon: <FileText size={20} />, text: "Gestion des accès" },
  ];

  return (
    <div className="page-container">
      {/* Container principal */}
      <Toaster/>
      <motion.div
        className="main-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Section gauche (présentation) */}

        <motion.div
          className="card"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {/* Accent design element */}
          <motion.div
            className="accent-circle"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.div 
              className="auth-title-section"
              variants={fadeInUp} 
              initial="hidden" 
              animate="visible"
            >
              <Key className="auth-icon" size={28} />
              <motion.h2>
                MadaScan Auth
              </motion.h2>
            </motion.div>
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              Plateforme sécurisée pour la gestion et le suivi de vos opérations commerciales.
            </motion.p>
          </motion.div>

          {scan ? (
            <ScanComponent />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="features"
            >
              <motion.p variants={itemVariants} className="features-title">
                Fonctionnalités de sécurité
              </motion.p>

              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="feature-item"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="feature-icon">{feature.icon}</div>
                  <p>{feature.text}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            className="footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            © 2025 Madascan. Tous droits réservés.
          </motion.div>
        </motion.div>

        {/* Section droite (formulaire) */}
        <motion.div
          className="login-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="form-wrapper">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h2 className="title">Connexion Madascan</h2>
              <p className="subtitle">Accédez à votre espace Madascan</p>
            </motion.div>

            <form onSubmit={handleSubmit}>
              <motion.div
                className="form-fields"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants} className="field">
                  <label htmlFor="email" className="label">
                    Email Madascan
                  </label>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <Mail size={18} />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input"
                      placeholder="votre@madascan.com"
                      required
                    />
                    <motion.div
                      className="input-focus-line"
                      initial={{ width: 0 }}
                      whileFocus={{ width: "100%" }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="field">
                  <div className="password-header">
                    <label htmlFor="password" className="label">
                      Mot de passe Madascan
                    </label>
                    <motion.a
                      href="#"
                      className="forgot-password"
                      whileHover={{ x: 2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      Mot de passe oublié?
                    </motion.a>
                  </div>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <Lock size={18} />
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input"
                      placeholder="••••••••••"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <motion.button
                    type="submit"
                    className="submit-button"
                    disabled={isLoading}
                  >
                    <motion.span
                      className="ripple-effect"
                      whileTap={{
                        opacity: 0.2,
                        scale: [0, 1.5],
                        transition: { duration: 0.4 },
                      }}
                    />
                    {isLoading ? (
                      <svg
                        className="spinner"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="spinner-circle"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="spinner-path"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <>
                        <span>Se connecter à Madascan</span>
                        <ChevronRight size={18} className="button-icon" />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </motion.div>
            </form>

            <motion.div
              className="signup-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Link to="/madascan-app/signup">
                <p className="signup-text">Pas encore de compte Madascan?</p>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;