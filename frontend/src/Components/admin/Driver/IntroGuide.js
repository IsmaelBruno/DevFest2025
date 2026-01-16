import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const startDashboardTour = () => {
  // Vérifier si la tournée a déjà été vue (stocké dans localStorage)
  const hasSeenTour = localStorage.getItem("madascan_tour_seen");
  
  if (hasSeenTour === "true") {
    return; // Ne pas afficher si déjà vu
  }

  const driverObj = driver({
    showProgress: true,
    animate: true,
    overlayColor: 'rgba(0, 0, 0, 0.7)',
    showButtons: ['next', 'previous', 'close'],
    progressText: 'Étape {{current}} sur {{total}}',
    nextBtnText: 'Suivant',
    prevBtnText: 'Précédent',
    doneBtnText: 'Terminer',
    onDestroyed: () => {
      localStorage.setItem("madascan_tour_seen", "true");
    },
    steps: [
      { 
        element: '.dashboard__welcome', 
        popover: { 
          title: '👋 Bienvenue sur MadaScan Admin', 
          description: 'Ce tableau de bord vous donne une vue d\'ensemble complète de votre plateforme de détection IA.',
          side: 'bottom',
          align: 'center'
        }
      },
      { 
        element: '.dashboard__stats', 
        popover: { 
          title: '📊 Statistiques clés', 
          description: 'Suivez en temps réel les performances de votre plateforme: analyses effectuées, détections positives et taux de précision.',
          side: 'bottom',
          align: 'center'
        }
      },
      { 
        element: '.charts-container > .chart-wrapper:first-child', 
        popover: { 
          title: '📈 Activité mensuelle', 
          description: 'Visualisez l\'évolution du nombre d\'analyses effectuées mois par mois.',
          side: 'right',
          align: 'center'
        }
      },
      { 
        element: '.charts-container > .chart-wrapper:last-child', 
        popover: { 
          title: '🎯 Répartition clients', 
          description: 'Comprenez la distribution de votre clientèle entre entreprises, particuliers et gouvernements.',
          side: 'left',
          align: 'center'
        }
      },
      { 
        element: '.transactions-sidebar', 
        popover: { 
          title: '📝 Feedback utilisateurs', 
          description: 'Consultez les derniers retours d\'expérience de vos utilisateurs pour améliorer MadaScan.',
          side: 'left',
          align: 'center'
        }
      },
      { 
        element: '.sidebar', 
        popover: { 
          title: '🗂️ Navigation', 
          description: 'Accédez à toutes les fonctionnalités de MadaScan: analyses, utilisateurs, paramètres.',
          side: 'right',
          align: 'start'
        }
      },
      { 
        element: '.navbar__profile', 
        popover: { 
          title: '👤 Votre compte', 
          description: 'Gérez votre profil, vos paramètres et déconnectez-vous.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        popover: { 
          title: '🎉 Tournée terminée!', 
          description: 'Vous êtes maintenant prêt à utiliser MadaScan Admin. Vous pouvez relancer cette visite depuis les paramètres.',
          side: 'center',
          align: 'center'
        }
      }
    ],
  });

  // Démarrer la tournée après un léger délai pour que le DOM soit complètement chargé
  setTimeout(() => {
    driverObj.drive();
  }, 500);
};

// Fonction pour réinitialiser la tournée (utile pour les tests ou depuis les paramètres)
export const resetDashboardTour = () => {
  localStorage.removeItem("madascan_tour_seen");
  console.log('Tournée réinitialisée - La prochaine visite affichera la tournée.');
};