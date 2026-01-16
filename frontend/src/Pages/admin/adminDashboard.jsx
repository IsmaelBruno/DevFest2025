import { useState, useEffect, useRef } from 'react';
import Header from '../../Components/admin/NavBar/NavBar';
import Sidebar from '../../Components/admin/SideBar/SideBar';
import StatsCard from '../../Components/admin/StatsCard/StatsCard';
import RecentTransactions from '../../Components/admin/RecentTransaction/RecentTransaction';
import Chart from '../../Components/admin/Chart/Chart';
import CloudMetrics from '../../Components/admin/CloudMetrics/CloudMetrics';
import robot from "../../assets/Images/GIF/Robot.gif";
import { startDashboardTour, resetDashboardTour } from '../../Components/admin/Driver/IntroGuide';
import { UserRound, HelpCircle, RefreshCw, Cloud, Cpu, Database, Zap, Download, Star } from 'lucide-react';
// Import corrigé - utilisez SimpleCloudService si vous n'avez pas de clés API
import { SimpleCloudService } from '../../services/cloudService';
import './adminDashboard.scss';

const Dashboard = () => {
  const [showTourButton, setShowTourButton] = useState(false);
  const [cloudData, setCloudData] = useState({
    hfTrends: null,
    aiNews: null,
    githubMetrics: null,
    liveMetrics: null
  });
  const [loading, setLoading] = useState(true);
  const [refreshTime, setRefreshTime] = useState(new Date());
  const dashboardRef = useRef(null);
  const hasSeenTour = localStorage.getItem("madascan_tour_seen");

  // Utilisez SimpleCloudService pour commencer (pas de clés API nécessaires)
  const cloudService = new SimpleCloudService();

  const [lineData, setLineData] = useState({
    labels: ["00h", "04h", "08h", "12h", "16h", "20h"],
    datasets: [
      {
        label: "Appels API Cloud",
        data: [120, 150, 180, 210, 240, 280],
        fill: false,
        borderColor: "#5DC0DC",
        tension: 0.4,
        borderWidth: 3
      },
      {
        label: "Analyses MadaScan",
        data: [80, 110, 140, 170, 200, 230],
        fill: false,
        borderColor: "#047185",
        tension: 0.4,
        borderWidth: 2
      }
    ]
  });

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: "top",
        labels: {
          color: '#333',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.dataset.label}: ${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.05)'
        },
        ticks: {
          color: '#666'
        }
      },
      x: {
        grid: {
          color: 'rgba(0,0,0,0.05)'
        },
        ticks: {
          color: '#666'
        }
      }
    },
  };

  const [doughnutData, setDoughnutData] = useState({
    labels: ['Textes', 'Audios', 'Vidéos'],
    datasets: [
      {
        data: [55, 30, 15],
        backgroundColor: [
          '#5DC0DC',
          '#047185',
          '#25d2f1'
        ],
        borderWidth: 0,
        hoverOffset: 15
      }
    ]
  });

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#333',
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}%`
        }
      }
    },
    cutout: '65%',
  };

  useEffect(() => {
    // Lancer la tournée automatiquement lors de la première visite
    if (!hasSeenTour || hasSeenTour !== "true") {
      const timer = setTimeout(() => {
        startDashboardTour();
      }, 1000);
      
      return () => clearTimeout(timer);
    }

    // Afficher le bouton de tournée si l'utilisateur veut la revoir
    setShowTourButton(true);

    // Charger les données cloud
    loadCloudData();

    // Actualiser toutes les 30 secondes
    const interval = setInterval(loadCloudData, 30000);
    return () => clearInterval(interval);
  }, [hasSeenTour]);

  const loadCloudData = async () => {
    setLoading(true);
    try {
      console.log('Loading cloud data...');
      const dashboardData = await cloudService.getDashboardData();
      
      setCloudData(dashboardData);

      // Mettre à jour les graphiques avec données dynamiques
      updateCharts(dashboardData.liveMetrics, dashboardData.hfTrends);
      
      setRefreshTime(new Date());
      console.log('Cloud data loaded successfully');
    } catch (error) {
      console.error('Error loading cloud data:', error);
      // Données de secours
      setCloudData(getFallbackData());
    } finally {
      setLoading(false);
    }
  };

  const updateCharts = (liveMetrics, hfTrends) => {
    if (!liveMetrics || !hfTrends) return;
    
    // Mettre à jour le graphique en ligne
    const newLineData = {
      ...lineData,
      datasets: [
        {
          ...lineData.datasets[0],
          data: Array.from({length: 6}, (_, i) => 
            Math.floor(liveMetrics.apiCalls * (0.7 + Math.random() * 0.6) * (i/5))
          )
        },
        {
          ...lineData.datasets[1],
          data: Array.from({length: 6}, (_, i) => 
            Math.floor(liveMetrics.concurrentAnalyses * (0.8 + Math.random() * 0.4) * (i/5))
          )
        }
      ]
    };
    setLineData(newLineData);

    // Mettre à jour le doughnut chart
    const totalModels = hfTrends.totalModels || 456789;
    const newDoughnutData = {
      labels: ['Modèles texte', 'Modèles image', 'Modèles audio'],
      datasets: [{
        data: [
          Math.floor(totalModels * 0.6),
          Math.floor(totalModels * 0.3),
          Math.floor(totalModels * 0.1)
        ],
        backgroundColor: ['#5DC0DC', '#047185', '#25d2f1'],
        borderWidth: 0
      }]
    };
    setDoughnutData(newDoughnutData);
  };

  const getFallbackData = () => {
    const now = new Date();
    return {
      hfTrends: {
        totalModels: 456789,
        trendingModels: [
          { modelId: 'gpt-2', downloads: 15000000, likes: 8500 },
          { modelId: 'bert', downloads: 12000000, likes: 7200 },
          { modelId: 'stable-diffusion', downloads: 9000000, likes: 6500 }
        ],
        totalDownloads: 45000000,
        avgLikes: 7400
      },
      aiNews: {
        totalArticles: 1250,
        latestArticles: [
          {
            title: 'MadScan: Détection IA en temps réel',
            source: 'MadScan',
            date: now.toLocaleDateString('fr-FR'),
            url: '#'
          }
        ],
        sentiment: 'positive'
      },
      githubMetrics: {
        totalStars: 1250000,
        totalForks: 250000,
        avgGrowth: 12.5,
        mostPopular: 'stable-diffusion'
      },
      liveMetrics: {
        activeUsers: 750,
        apiCalls: 24012,
        responseTime: 120,
        successRate: 99.7,
        concurrentAnalyses: 156,
        storageUsed: '34.5',
        costPerHour: '1.25'
      }
    };
  };

  const handleStartTour = () => {
    startDashboardTour();
  };

  const handleResetTour = () => {
    if (window.confirm("Voulez-vous réinitialiser la tournée d'introduction? Vous la reverrez à votre prochaine visite.")) {
      resetDashboardTour();
      setShowTourButton(false);
    }
  };

  const handleRefresh = () => {
    loadCloudData();
  };

  // Données de secours pour les cartes
  const fallbackMetrics = {
    apiCalls: 24012,
    concurrentAnalyses: 156,
    storageUsed: '34.5',
    costPerHour: '1.25',
    successRate: 99.7
  };

  const liveMetrics = cloudData.liveMetrics || fallbackMetrics;

  return (
    <div className="dashboard" ref={dashboardRef}>
      <Sidebar />
      <main className="dashboard__main">
        <Header showProfileIcon={true} />

        <div className="dashboard__welcome">
          <div className="dashboard__welcome-content">
            <h2>PLATEFORME MadaScan - DASHBOARD ADMIN</h2>
            <div className="dashboard__welcome-illustration">
              <img src={robot} alt="Robot IA MadaScan" className="Robot-image"/>
            </div>
          </div>
          
          {/* Contrôles cloud */}
          <div className="cloud-controls">
            <button 
              className="cloud-refresh-btn"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw size={18} className={loading ? 'spinning' : ''} />
              {loading ? 'Chargement...' : 'Actualiser'}
            </button>
            
            <div className="last-update">
              <Cloud size={14} />
              Dernière mise à jour : {refreshTime.toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
          </div>
          
          {/* Bouton de tournée */}
          {showTourButton && (
            <div className="tour-button-container">
              <button 
                className="tour-button"
                onClick={handleStartTour}
                title="Relancer la visite guidée"
              >
                <UserRound size={20} />
                <span>Visite guidée</span>
              </button>
              
              <button 
                className="tour-reset-button"
                onClick={handleResetTour}
                title="Réinitialiser la visite guidée"
              >
                <HelpCircle size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Cartes avec données cloud */}
        <section className="dashboard__stats">
          <StatsCard
            title="Appels API Cloud"
            value={liveMetrics.apiCalls.toLocaleString()}
            icon={<Cpu size={24} />}
            color="blue"
            subtitle={cloudData.hfTrends ? `${cloudData.hfTrends.trendingModels.length} modèles actifs` : "Hugging Face"}
            trend={`+${Math.floor(Math.random() * 12)}%`}
          />
          
          <StatsCard
            title="Analyses en temps réel"
            value={liveMetrics.concurrentAnalyses.toString()}
            icon={<Zap size={24} />}
            color="green"
            subtitle={`${liveMetrics.successRate.toFixed(1)}% succès`}
            trend={`${Math.floor(Math.random() * 5)}s`}
          />
          
          <StatsCard
            title="Stockage Cloud"
            value={`${liveMetrics.storageUsed} GB`}
            icon={<Database size={24} />}
            color="orange"
            subtitle={`$${liveMetrics.costPerHour}/heure`}
            trend={`$${(parseFloat(liveMetrics.costPerHour) * 24 * 30).toFixed(2)}/mois`}
          />
        </section>

        {/* Composant métriques cloud */}
        <CloudMetrics 
          hfTrends={cloudData.hfTrends}
          aiNews={cloudData.aiNews}
          githubMetrics={cloudData.githubMetrics}
          liveMetrics={cloudData.liveMetrics}
          loading={loading}
        />

        <div className="dashboard__content"> 
          <div className="dashboard__charts-section">
            <div className="charts-container">
              <div className="chart-wrapper">
                <div className="chart-container">
                  <div className="chart-header">
                    <h4>Activité Cloud en temps réel</h4>
                    <span className="chart-subtitle">
                      {liveMetrics.activeUsers || '750'} utilisateurs actifs
                    </span>
                  </div>
                  <Chart
                    type="line"
                    data={lineData}
                    options={{ ...lineOptions, maintainAspectRatio: false }}
                  />
                </div>
              </div>
              
              <div className="chart-wrapper">
                <div className="chart-container">
                  <Chart
                    type="doughnut"
                    data={doughnutData}
                    options={{ ...doughnutOptions, maintainAspectRatio: false }}
                  />
                </div>
              </div>
            </div>
            
            <div className="transactions-sidebar">
              <RecentTransactions 
                aiNews={cloudData.aiNews}
                hfTrends={cloudData.hfTrends}
              />
            </div>
          </div>
        </div>

        {/* Section tendances IA */}
        {cloudData.hfTrends?.trendingModels && (
          <div className="ai-trends-section">
            <h3>
              <Cpu size={20} />
              Modèles IA tendance (Hugging Face)
            </h3>
            <div className="trending-models">
              {cloudData.hfTrends.trendingModels.slice(0, 4).map((model, index) => (
                <div key={index} className="model-card">
                  <div className="model-rank">{index + 1}</div>
                  <div className="model-info">
                    <div className="model-name">{model.modelId}</div>
                    <div className="model-stats">
                      <span className="stat">
                        <Download size={12} />
                        {model.downloads ? (model.downloads / 1000000).toFixed(1) + 'M' : 'N/A'}
                      </span>
                      <span className="stat">
                        <Star size={12} />
                        {model.likes?.toLocaleString() || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;