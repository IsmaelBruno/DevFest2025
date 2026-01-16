import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  X, 
  Shield, 
  AlertTriangle,
  Sparkles,
  Send,
  Copy,
  Check,
  Loader,
  Play,
  Pause,
  Download,
  History,
  Search,
  FileText,
  Smartphone,
  Mail,
  Globe,
  CheckCircle,
  XCircle
} from 'lucide-react';
import './Historique.scss';

export default function Historique() {
  const [inputText, setInputText] = useState('');
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [isRisky, setIsRisky] = useState(false);
  
  const audioRef = useRef(null);

  // Exemples de textes suspects (arnaque, phishing, etc.)
  const sampleTexts = [
    {
      title: "Offre d'emploi suspecte",
      text: "Cher candidat, Nous avons le plaisir de vous informer que votre profil a retenu notre attention pour un poste de Community Manager. Salaire: 3.500€/mois. Travail à distance. Envoyez 50€ pour les frais de dossier à ce numéro: +261 34 00 00 00",
      category: "arnaque emploi",
      risk: "Élevé"
    },
    {
      title: "Message de phishing bancaire",
      text: "URGENT: Votre compte bancaire a été suspendu pour cause de sécurité. Cliquez ici pour vérifier vos informations: https://fake-bank-mg.com/verification. Ne pas répondre à ce message entraînera la fermeture définitive de votre compte.",
      category: "phishing",
      risk: "Critique"
    },
    {
      title: "Arnaque au transfert d'argent",
      text: "Félicitations ! Vous avez gagné 10.000.000 Ar dans notre loterie. Pour recevoir votre prix, veuillez envoyer 25.000 Ar sur ce compte pour les frais de transfert. Contactez-nous au 032 00 00 00.",
      category: "loterie",
      risk: "Élevé"
    },
    {
      title: "Fausse opportunité d'investissement",
      text: "Investissez seulement 100.000 Ar et gagnez 500.000 Ar en 7 jours garantis ! Notre système automatisé de trading vous assure un rendement de 400%. Contact WhatsApp: +261 33 000 00 00.",
      category: "investissement",
      risk: "Très élevé"
    },
    {
      title: "Message légitime d'entreprise",
      text: "Madagascar Telecom vous informe que votre facture du mois de décembre est disponible dans votre espace client. Montant: 45.000 Ar. Paiement avant le 15/01/2025. Service client: 020 22 222 22.",
      category: "légitime",
      risk: "Faible"
    },
    {
      title: "Offre de crédit abusive",
      text: "BESOIN D'ARGENT URGENT ? Nous accordons des prêts de 100.000 Ar à 10.000.000 Ar sans justificatif. Taux 2%/mois. Envoyez copie CNI et 10.000 Ar de frais de dossier par Orange Money au 034 00 00 00.",
      category: "prêt usurier",
      risk: "Élevé"
    }
  ];

  const handleAnalyse = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalysing(true);
    setShowModal(true);
    
    // Simulation d'analyse avec IA (2 secondes)
    setTimeout(() => {
      const analysisResult = analyseTexte(inputText);
      setAnalysis(analysisResult);
      setIsRisky(analysisResult.riskLevel === 'Élevé' || analysisResult.riskLevel === 'Critique');
      
      // Ajouter à l'historique
      setAnalysisHistory(prev => [{
        id: Date.now(),
        original: inputText.substring(0, 100) + (inputText.length > 100 ? '...' : ''),
        risk: analysisResult.riskLevel,
        category: analysisResult.category,
        date: new Date().toLocaleDateString('fr-FR'),
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      }, ...prev.slice(0, 9)]); // Garder les 10 derniers
      
      setIsAnalysing(false);
    }, 2000);
  };

  const analyseTexte = (text) => {
    // Mots-clés indicateurs d'arnaque
    const scamIndicators = {
      'urgent': { weight: 3, description: "Utilisation de l'urgence pour créer la pression" },
      'argent': { weight: 2, description: "Mention d'argent répétée" },
      'frais': { weight: 4, description: "Demande de frais initiaux" },
      'loterie': { weight: 5, description: "Gains de loterie non sollicités" },
      'gagné': { weight: 4, description: "Annonce de gain soudain" },
      'téléphone': { weight: 2, description: "Numéro de téléphone suspect" },
      'whatsapp': { weight: 3, description: "Contact via WhatsApp uniquement" },
      'cliquez': { weight: 3, description: "Lien suspect à cliquer" },
      'compte': { weight: 2, description: "Menace sur compte bancaire" },
      'investissement': { weight: 3, description: "Promesse de rendement élevé" },
      'garanti': { weight: 4, description: "Rendement garanti irréaliste" },
      'sans justificatif': { weight: 4, description: "Prêt sans documents" },
      'orange money': { weight: 3, description: "Paiement via mobile money" },
      'mvola': { weight: 3, description: "Paiement via mobile money" },
      '\\+261': { weight: 2, description: "Numéro malgache suspect" }
    };

    let score = 0;
    let detectedIndicators = [];
    const textLower = text.toLowerCase();

    // Calcul du score de risque
    Object.entries(scamIndicators).forEach(([keyword, data]) => {
      if (textLower.includes(keyword.toLowerCase())) {
        score += data.weight;
        detectedIndicators.push({
          keyword,
          description: data.description,
          weight: data.weight
        });
      }
    });

    // Détection de patterns spécifiques
    if (/[0-9]{2}\s?[0-9]{2}\s?[0-9]{2}\s?[0-9]{2}/.test(text)) {
      score += 2;
      detectedIndicators.push({
        keyword: "Numéro téléphone",
        description: "Numéro de téléphone dans le message",
        weight: 2
      });
    }

    if (/https?:\/\/[^\s]+/.test(text)) {
      score += 3;
      detectedIndicators.push({
        keyword: "Lien URL",
        description: "Lien hypertexte suspect",
        weight: 3
      });
    }

    // Détermination du niveau de risque
    let riskLevel, riskColor, recommendation;
    if (score >= 15) {
      riskLevel = "Critique";
      riskColor = "#dc2626";
      recommendation = "ARNQUE CONFIRMÉE - Ne répondez pas, ne cliquez sur aucun lien, ne transférez pas d'argent. Signalez le numéro aux autorités.";
    } else if (score >= 10) {
      riskLevel = "Élevé";
      riskColor = "#f97316";
      recommendation = "TRÈS SUSPECT - Forte probabilité d'arnaque. Vérifiez l'identité de l'expéditeur par d'autres moyens avant toute action.";
    } else if (score >= 5) {
      riskLevel = "Modéré";
      riskColor = "#eab308";
      recommendation = "SUSPECT - Soyez prudent. Vérifiez l'authenticité de l'offre et ne donnez pas d'informations personnelles.";
    } else {
      riskLevel = "Faible";
      riskColor = "#16a34a";
      recommendation = "APPEMMENT LÉGITIME - Mais restez vigilant et vérifiez quand même auprès de sources officielles si vous avez un doute.";
    }

    // Catégorisation automatique
    let category = "Message générique";
    if (textLower.includes("emploi") || textLower.includes("travail") || textLower.includes("salaire")) {
      category = "Offre d'emploi";
    } else if (textLower.includes("banque") || textLower.includes("compte") || textLower.includes("carte")) {
      category = "Message bancaire";
    } else if (textLower.includes("loteri") || textLower.includes("gagné") || textLower.includes("prix")) {
      category = "Loterie/Gain";
    } else if (textLower.includes("invest") || textLower.includes("rendement") || textLower.includes("trading")) {
      category = "Investissement";
    } else if (textLower.includes("prêt") || textLower.includes("crédit") || textLower.includes("argent")) {
      category = "Offre de crédit";
    }

    // Traduction en malgache pour explication
    const translationMalagasy = traduireEnMalagasy(text);
    
    return {
      original: text,
      translated: translationMalagasy,
      riskScore: score,
      riskLevel,
      riskColor,
      category,
      detectedIndicators,
      recommendation,
      explanation: generateExplanation(text, detectedIndicators),
      timestamp: new Date().toISOString(),
      wordCount: text.split(' ').filter(w => w.trim().length > 0).length
    };
  };

  const traduireEnMalagasy = (text) => {
    // Pour une vraie implémentation, utiliser une API ou modèle Hugging Face
    const translations = {
      "urgent": "maika",
      "argent": "vola",
      "frais": "saram-pidirana",
      "loterie": "loteria",
      "gagné": "resy",
      "téléphone": "finday",
      "whatsapp": "whatsapp",
      "cliquez": "tsindrio",
      "compte": "kaonty",
      "investissement": "fametrahana vola",
      "garanti": "antoka",
      "sans justificatif": "tsy misy porofo",
      "orange money": "orange money",
      "mvola": "mvola",
      "emploi": "asa",
      "travail": "asa",
      "salaire": "karama",
      "banque": "banky",
      "carte": "karatra",
      "prix": "loka",
      "rendement": "tombony",
      "trading": "varotra",
      "prêt": "petrana",
      "crédit": "petrana",
      "merci": "misaotra",
      "bonjour": "salama"
    };

    let translated = text;
    Object.entries(translations).forEach(([fr, mg]) => {
      const regex = new RegExp(fr, 'gi');
      translated = translated.replace(regex, mg);
    });

    return translated + " (dikanteny Malagasy)";
  };

  const generateExplanation = (text, indicators) => {
    if (indicators.length === 0) {
      return "Ce message ne présente pas d'indicateurs évidents d'arnaque. Cependant, restez vigilant face aux nouvelles techniques de fraude.";
    }

    let explanation = "ANALYSE DÉTAILLÉE :\n\n";
    explanation += `📊 Score de risque: ${indicators.reduce((sum, ind) => sum + ind.weight, 0)}/100\n\n`;
    explanation += "🚨 INDICATEURS DÉTECTÉS:\n";
    
    indicators.forEach((indicator, index) => {
      explanation += `${index + 1}. "${indicator.keyword}" - ${indicator.description}\n`;
    });

    explanation += "\n🔍 CONSEILS DE SÉCURITÉ:\n";
    explanation += "• Ne jamais envoyer d'argent pour des 'frais de dossier'\n";
    explanation += "• Vérifier l'identité de l'expéditeur\n";
    explanation += "• Ne pas cliquer sur les liens suspects\n";
    explanation += "• Consulter les autorités (DGCC, Police)\n";
    explanation += "• Signaler le numéro sur www.signal-spam.mg";

    return explanation;
  };

  // Pour la voix malagasy authentique
  const playMalagasyAudio = () => {
    if (!analysis?.translated) return;

    // Pour une vraie implémentation :
    // 1. Enregistrez des voix malagasy authentiques
    // 2. Utilisez un service TTS avec voix malgache (ElevenLabs, Google Cloud)
    // 3. Stockez les fichiers audio dans public/audio/
    
    // Solution temporaire : Utiliser la synthèse vocale du navigateur
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(analysis.translated);
      
      // Essayez de trouver une voix malgache
      const voices = speechSynthesis.getVoices();
      const malagasyVoice = voices.find(voice => 
        voice.lang.includes('mg') || voice.name.toLowerCase().includes('malagasy')
      );
      
      if (malagasyVoice) {
        utterance.voice = malagasyVoice;
      } else {
        utterance.lang = 'fr-FR'; // Fallback en français
      }
      
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = isMuted ? 0 : 1;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const handleTextToSpeech = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      playMalagasyAudio();
    }
  };

  const handleCopy = () => {
    if (analysis?.explanation) {
      navigator.clipboard.writeText(analysis.explanation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!analysis) return;
    
    const content = `
ANALYSE D'ARNAQUE MadaScan - ${new Date().toLocaleString('fr-FR')}

📋 RÉSUMÉ DE L'ANALYSE:
Message original: ${analysis.original.substring(0, 200)}...
Niveau de risque: ${analysis.riskLevel}
Catégorie: ${analysis.category}
Score de risque: ${analysis.riskScore}/100

🚨 INDICATEURS DÉTECTÉS:
${analysis.detectedIndicators.map((ind, i) => `${i+1}. ${ind.keyword} - ${ind.description} (${ind.weight} pts)`).join('\n')}

📝 TRADUCTION MALAGASY:
${analysis.translated}

🔍 EXPLICATION DÉTAILLÉE:
${analysis.explanation}

✅ RECOMMANDATION:
${analysis.recommendation}

MadaScan - Protégez-vous contre les arnaques à Madagascar
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analyse-arnaque-madascan-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSampleClick = (text) => {
    setInputText(text);
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="analyse-texte-page">
      {/* Header */}
      <motion.div 
        className="analyse-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <div className="header-text">
            <div className="header-badge">
              <Shield size={20} />
              <span>Détection d'Arnaques</span>
            </div>
            <h1>Analyseur de Messages Suspects</h1>
            <p>Collez un message suspect et découvrez s'il s'agit d'une arnaque, avec explication en malgache</p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <AlertTriangle size={24} />
              <div>
                <span className="stat-number">+500</span>
                <span className="stat-label">Arnaques détectées</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="analyse-container">
        <div className="analyse-grid">
          {/* Left Column - Input */}
          <motion.div 
            className="input-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="section-card">
              <div className="section-header">
                <div className="header-icon">
                  <FileText size={24} />
                </div>
                <div>
                  <h2>Message à analyser</h2>
                  <p className="section-subtitle">Collez un SMS, email ou message suspect</p>
                </div>
              </div>
              
              <div className="input-wrapper">
                <div className="textarea-container">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Exemple: 'Cher client, votre compte Orange Money a été suspendu. Cliquez ici pour le réactiver: https://fake-orange.mg'"
                    rows={8}
                    className="text-input"
                  />
                  <div className="textarea-footer">
                    <div className="char-info">
                      <span className="char-count">
                        {inputText.length} caractères
                      </span>
                      <span className="word-count">
                        {inputText.split(' ').filter(w => w.trim().length > 0).length} mots
                      </span>
                    </div>
                    <button 
                      className="clear-btn"
                      onClick={() => setInputText('')}
                      disabled={!inputText.trim()}
                    >
                      Effacer tout
                    </button>
                  </div>
                </div>

                <button 
                  className="analyse-btn"
                  onClick={handleAnalyse}
                  disabled={!inputText.trim() || isAnalysing}
                >
                  {isAnalysing ? (
                    <>
                      <Loader size={20} className="spinner" />
                      <span>Analyse en cours...</span>
                    </>
                  ) : (
                    <>
                      <Search size={20} />
                      <span>Analyser le message</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sample Texts */}
            <div className="samples-section">
              <div className="section-header">
                <History size={24} />
                <h3>Exemples d'arnaques courantes</h3>
              </div>
              
              <div className="samples-grid">
                {sampleTexts.map((sample, index) => (
                  <motion.button
                    key={index}
                    className={`sample-card risk-${sample.risk.toLowerCase().replace(' ', '-')}`}
                    onClick={() => handleSampleClick(sample.text)}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="sample-header">
                      <span className="sample-category">
                        {sample.category}
                      </span>
                      <span className={`risk-badge risk-${sample.risk.toLowerCase().replace(' ', '-')}`}>
                        {sample.risk}
                      </span>
                    </div>
                    <p className="sample-text">
                      {sample.text.length > 120 
                        ? sample.text.substring(0, 120) + '...' 
                        : sample.text}
                    </p>
                    <div className="sample-footer">
                      <span className="sample-title">
                        {sample.title}
                      </span>
                      <span className="try-sample">
                        Essayer →
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - History */}
          <motion.div 
            className="history-section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="section-card">
              <div className="section-header">
                <History size={24} />
                <div>
                  <h2>Historique d'analyse</h2>
                  <p className="section-subtitle">Vos dernières vérifications</p>
                </div>
              </div>
              
              {analysisHistory.length > 0 ? (
                <div className="history-list">
                  {analysisHistory.map((item) => (
                    <motion.div 
                      key={item.id}
                      className="history-card"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="history-content">
                        <p className="history-text">
                          {item.original}
                        </p>
                        <div className="history-meta">
                          <span className={`risk-tag risk-${item.risk.toLowerCase().replace(' ', '-')}`}>
                            {item.risk}
                          </span>
                          <span className="category-tag">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <div className="history-footer">
                        <span className="history-date">
                          {item.date} • {item.time}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="empty-history">
                  <div className="empty-icon">
                    <Search size={48} />
                  </div>
                  <h4>Aucune analyse récente</h4>
                  <p>Vos analyses de messages apparaîtront ici</p>
                </div>
              )}
            </div>

            {/* Tips Section */}
            <div className="tips-section">
              <div className="section-header">
                <Shield size={24} />
                <h3>Conseils de sécurité</h3>
              </div>
              <div className="tips-list">
                <div className="tip-item">
                  <AlertTriangle size={16} />
                  <span>Ne payez jamais de "frais de dossier"</span>
                </div>
                <div className="tip-item">
                  <Smartphone size={16} />
                  <span>Vérifiez les numéros sur signal-spam.mg</span>
                </div>
                <div className="tip-item">
                  <Mail size={16} />
                  <span>Ne cliquez pas sur les liens suspects</span>
                </div>
                <div className="tip-item">
                  <Globe size={16} />
                  <span>Contactez toujours les services officiels</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Analysis Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isAnalysing && setShowModal(false)}
          >
            <motion.div 
              className="analysis-modal"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div className="modal-title">
                  <div className="title-icon">
                    {isRisky ? <AlertTriangle size={28} /> : <CheckCircle size={28} />}
                  </div>
                  <div>
                    <h2>Résultat de l'analyse</h2>
                    <p className="modal-subtitle">
                      {isRisky ? "Message suspect détecté" : "Aucun risque majeur détecté"}
                    </p>
                  </div>
                </div>
                <button 
                  className="modal-close"
                  onClick={() => setShowModal(false)}
                  disabled={isAnalysing}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="modal-content">
                {isAnalysing ? (
                  <div className="loading-state">
                    <div className="loading-content">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="spinner-container"
                      >
                        <Loader size={56} className="loading-spinner" />
                      </motion.div>
                      <h3>Analyse en cours</h3>
                      <p>Recherche d'indicateurs d'arnaque...</p>
                      <div className="scanning-animation">
                        <div className="scan-line"></div>
                      </div>
                    </div>
                  </div>
                ) : analysis && (
                  <>
                    {/* Risk Summary */}
                    <div className="risk-summary" style={{ borderColor: analysis.riskColor }}>
                      <div className="risk-header">
                        <h3>Niveau de risque</h3>
                        <span 
                          className="risk-level" 
                          style={{ 
                            backgroundColor: analysis.riskColor,
                            color: 'white'
                          }}
                        >
                          {analysis.riskLevel}
                        </span>
                      </div>
                      <div className="risk-details">
                        <div className="risk-score">
                          <span className="score-label">Score:</span>
                          <div className="score-bar">
                            <div 
                              className="score-fill" 
                              style={{ 
                                width: `${Math.min(analysis.riskScore * 5, 100)}%`,
                                backgroundColor: analysis.riskColor
                              }}
                            ></div>
                          </div>
                          <span className="score-value">{analysis.riskScore}/20</span>
                        </div>
                        <div className="risk-category">
                          <span className="category-label">Catégorie:</span>
                          <span className="category-value">{analysis.category}</span>
                        </div>
                      </div>
                    </div>

                    {/* Original Message */}
                    <div className="analysis-section">
                      <h4>
                        <FileText size={20} />
                        Message original
                      </h4>
                      <div className="message-box">
                        <p>{analysis.original}</p>
                      </div>
                    </div>

                    {/* Translation */}
                    <div className="analysis-section">
                      <div className="section-header-row">
                        <h4>
                          <Globe size={20} />
                          Traduction Malagasy
                        </h4>
                        <div className="audio-controls">
                          <button 
                            className={`audio-btn ${isPlaying ? 'playing' : ''}`}
                            onClick={handleTextToSpeech}
                          >
                            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                            {isPlaying ? 'Arrêter' : 'Écouter'}
                          </button>
                          <button 
                            className={`mute-btn ${isMuted ? 'muted' : ''}`}
                            onClick={() => setIsMuted(!isMuted)}
                          >
                            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                          </button>
                        </div>
                      </div>
                      <div className="translation-box">
                        <p className="translation-text">{analysis.translated}</p>
                        <div className="translation-footer">
                          <span className="language-label">
                            Traduction automatique Malagasy
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Detected Indicators */}
                    {analysis.detectedIndicators.length > 0 && (
                      <div className="analysis-section">
                        <h4>
                          <AlertTriangle size={20} />
                          Indicateurs détectés ({analysis.detectedIndicators.length})
                        </h4>
                        <div className="indicators-grid">
                          {analysis.detectedIndicators.map((indicator, index) => (
                            <div key={index} className="indicator-card">
                              <div className="indicator-header">
                                <span className="indicator-keyword">
                                  "{indicator.keyword}"
                                </span>
                                <span className="indicator-weight">
                                  {indicator.weight} pts
                                </span>
                              </div>
                              <p className="indicator-desc">
                                {indicator.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Explanation */}
                    <div className="analysis-section">
                      <h4>
                        <Sparkles size={20} />
                        Explication détaillée
                      </h4>
                      <div className="explanation-box">
                        <pre className="explanation-text">{analysis.explanation}</pre>
                        <div className="explanation-actions">
                          <button 
                            className={`copy-btn ${copied ? 'copied' : ''}`}
                            onClick={handleCopy}
                          >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                            {copied ? 'Copié !' : 'Copier'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className="recommendation-box" style={{ borderColor: analysis.riskColor }}>
                      <div className="recommendation-header">
                        <Shield size={24} />
                        <h4>Recommandation</h4>
                      </div>
                      <p className="recommendation-text">{analysis.recommendation}</p>
                    </div>

                    {/* Actions */}
                    <div className="modal-actions">
                      <button className="action-btn secondary" onClick={() => setShowModal(false)}>
                        Fermer
                      </button>
                      <button className="action-btn" onClick={handleDownload}>
                        <Download size={20} />
                        Télécharger le rapport
                      </button>
                      <button 
                        className="action-btn primary"
                        onClick={() => {
                          setShowModal(false);
                          setInputText('');
                        }}
                      >
                        Nouvelle analyse
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}