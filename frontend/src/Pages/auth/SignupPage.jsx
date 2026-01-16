import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Auth.scss";
import { Lock, Mail, ChevronRight, Shield, Code, FileText, Key, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { handleSignup } from "../../services/ApiUser";
import { toast } from "sonner"
import { Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lastName, setlastName] = useState("");
  const [role, setRole] = useState("");
  const [scan, setScan] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  
  // Validation
  if (!email || !password || !name || !lastName || !role) {
    setIsLoading(false);
    toast.error("Veuillez remplir tous les champs");
    return;
  }
  
  if (password.length < 6) {
    setIsLoading(false);
    toast.warning("Le mot de passe doit contenir au moins 6 caractères");
    return;
  }
  
  if (password !== confirmPassword) {
    setIsLoading(false);
    toast.warning("Les mots de passe ne correspondent pas");
    return;
  }
  
  if (!captchaValue) {
    setIsLoading(false);
    toast.error("Veuillez vérifier le reCAPTCHA");
    return;
  }

  try {
    // Appel à l'API - N'ENVOYEZ PAS LE ROLE car votre backend ne l'accepte plus
    const data = await handleSignup({ 
      email, 
      password, 
      first_name: name, 
      last_name: lastName
      // SUPPRIMEZ: role 
    });
    
    console.log("📊 Données retournées:", data);
    
    // Vérification que data n'est pas undefined
    if (!data) {
      toast.error("Aucune réponse du serveur");
      setIsLoading(false);
      return;
    }
    
    // Vérification de la réponse - plusieurs façons de détecter le succès
    if (data.success === true || 
        data.message?.includes("créé") || 
        data.message?.includes("vérifiez") ||
        data.user) {
      
      toast.success(data.message || "Inscription réussie! Vérifiez votre email.");
      
      // Stocker les informations utilisateur (avec le rôle côté frontend seulement)
      localStorage.setItem("Information user", JSON.stringify({ 
        email, 
        name, 
        lastName, 
        role // Stocké localement seulement
      }));
      
      // Redirection vers la page OTP IMMÉDIATEMENT
      console.log("🚀 Redirection vers /madascan-app/otp-verification");
      navigate("/madascan-app/otp-verification");
      
    } else {
      // Si success est false ou le message indique une erreur
      toast.error(data.message || "Erreur lors de l'inscription");
    }
    
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    toast.error("Une erreur est survenue lors de l'inscription");
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
    { icon: <Key size={20} />, text: "Authentification sécurisée MadaScan" },
    { icon: <Shield size={20} />, text: "Protection des données certifiée" },
    { icon: <FileText size={20} />, text: "Gestion des accès centralisée" },
  ];

  return (
    <div className="page-container">
      <Toaster />
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
              <motion.h2>MadaScan Signup</motion.h2>
            </motion.div>
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              Plateforme de gestion sécurisée pour les opérations commerciales et le suivi des achats au sein de votre entreprise.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="features"
          >
            <motion.p variants={itemVariants} className="features-title">
              Fonctionnalités MadaScan
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

          <motion.div
            className="footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            © 2025 MadaScan. Tous droits réservés.
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
              <h2 className="title">Inscription MadaScan</h2>
              <p className="subtitle">Créez votre compte pour accéder à la plateforme MadaScan</p>
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
                    Email professionnel MadaScan
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
                      placeholder="votre@entreprise.com"
                      required
                    />
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="field">
                  <label htmlFor="name" className="label">
                    Nom complet
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input"
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="field">
                  <label htmlFor="lname" className="label">
                    Prénom
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="lname"
                      type="text"
                      value={lastName}
                      onChange={(e) => setlastName(e.target.value)}
                      className="input"
                      placeholder="Votre prénom"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="field">
                  <div className="password-header">
                    <label htmlFor="password" className="label">
                      Mot de passe MadaScan
                    </label>
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

                <motion.div variants={itemVariants} className="field">
                  <div className="password-header">
                    <label htmlFor="confirmpassword" className="label">
                      Confirmer votre mot de passe
                    </label>
                  </div>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <Lock size={18} />
                    </div>
                    <input
                      id="confirmpassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setconfirmPassword(e.target.value)}
                      className="input"
                      placeholder="••••••••••"
                      required
                    />
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="field">
                  <label htmlFor="role" className="label">
                    Rôle dans MadaScan
                  </label>
                  <div className="input-wrapper">
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="input"
                      required
                    >
                      <option value="">Sélectionnez votre rôle</option>
                      <option value="user">Utilisateur simple de Madascan</option>
                      <option value="admin">Gérant</option>
                    </select>
                  </div>
                </motion.div>
                
                <ReCAPTCHA
                  sitekey="6Lc29S0qAAAAABuR00MS7tL0RgDzvoUyaejbyhrO"
                  onChange={handleCaptchaChange}
                />
                
                <motion.div variants={itemVariants}>
                  <motion.button
                    type="submit"
                    className="submit-button"
                    disabled={isLoading}
                  >
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
                        <span>Créer mon compte MadaScan</span>
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
              <Link to="/madascan-app/login">
                <p className="signup-text">
                  Déjà un compte MadaScan?
                </p>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;