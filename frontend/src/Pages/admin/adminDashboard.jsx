import { useState, useEffect, useRef } from 'react';
import Header from '../../Components/admin/NavBar/NavBar';
import Sidebar from '../../Components/admin/SideBar/SideBar';
import StatsCard from '../../Components/admin/StatsCard/StatsCard';
import ProjectCard from '../../Components/admin/ProjectCard/ProjectCard';
import RecentTransactions from '../../Components/admin/RecentTransaction/RecentTransaction';
import Chart from '../../Components/admin/Chart/Chart';
import robot from "../../assets/Images/GIF/Robot.gif";
import accord from "../../assets/Images/Jpeg/illu.jpeg"
import './adminDashboard.scss';

const Dashboard = () => {
  const projects = [
    {
      name: 'AnyPay',
      description: 'Solution de paiement sécurisé avec cryptographie avancée',
      status: 'RÉCENT',
      amount: '4 000 €',
      color: 'yellow',
      details: 'Intégration API Stripe et PayPal terminée'
    },
    {
      name: 'DesignPub',
      description: 'Kit complet d\'identité visuelle',
      status: 'EN ATTENTE',
      amount: '2 000 €',
      color: 'black',
      details: 'En attente de validation du client'
    },
    {
      name: 'Epidemie',
      description: 'Plateforme de suivi épidémiologique en temps réel',
      status: 'EN ÉTUDE',
      amount: 'Budget en cours',
      color: 'gray',
      details: 'Analyse des besoins avec le service santé'
    },
    {
      name: 'TestPlateforme',
      description: 'Optimisation des parcours utilisateur',
      status: 'ACTIF',
      amount: '7 000 €',
      color: 'yellow',
      details: 'Tests A/B en cours sur les nouveaux workflows'
    },
    {
      name: 'EduConnect',
      description: 'Portail unifié pour les établissements scolaires',
      status: 'TERMINÉ',
      amount: '15 000 €',
      color: 'green',
      details: 'Déployé dans 5 écoles pilotes'
    }
  ];

  const [lineData, setLineData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aout", "Sept", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Demande mensuel",
        data: [65, 59, 80, 81, 56, 55, 40, 70, 60, 90, 100, 120],
        fill: false,
        borderColor: "#5DC0DC",
        tension: 0.2,
        borderWidth: 2
      }
    ]
  })
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
        bottom: 20
      }
    },
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Value: ${tooltipItem.raw}`,
        },
      },
    },
    animations: {
      tension: {
        duration: 800,
        easing: "linear",
        from: 1,
        to: 0,
        loop: true,
      }
    },
    scales: {
      y: {
        min: 0,
        max: Math.max(...lineData.datasets[0].data) * 1.1,
      },
    },
  };
  const [doughnutData] = useState({
    labels: ['Mobile', 'Desktop', 'Tablette'],
    datasets: [
      {
        data: [55, 30, 15],
        backgroundColor: [
          '#5DC0DC',
          '#047185',
          '#25d2f1'
        ],
        borderWidth: 0,
      }
    ]
  });
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 20,
        right: 20
      }
    },
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}%`
        }
      }
    },
    cutout: '70%',
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="dashboard__main">
        <Header />

        <div className="dashboard__welcome">
          <div className="dashboard__welcome-content">
            <h2>BIENVENU DANS VOTRE DASHBOARD EDDEN</h2>
            <div className="dashboard__welcome-illustration">
                <img src={robot} alt="Robot" className="Robot-image"/>
            </div>
          </div>
        </div>

        <section className="dashboard__stats">
          <StatsCard
            title="Utilisateurs"
            value="24,012"
            color="yellow"
          />
          <StatsCard
            title="Critiques"
            value="13,456"
            color="gray"
          />
          <StatsCard
            title="Interactions"
            value="10,904"
            color="gray"
          />
        </section>

        <div className="dashboard__content">
          <section className="dashboard__projects">
            <div className="dashboard__section-header">
              <h3>Listes des projets</h3>
              <span className="dashboard__project-count">04</span>
              <button className="dashboard__add-more">Rajouter</button>
            </div>
            <div className="dashboard__projects-list">
              {projects.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </section>

          <RecentTransactions />
          <div className="dashboard__charts">
            <div className="chart-container">
              <Chart
                type="line"
                data={lineData}
                options={{ ...lineOptions, maintainAspectRatio: false }}
              />
            </div>
            <div className="chart-container">
              <Chart
                type="doughnut"
                data={doughnutData}
                options={{ ...doughnutOptions, maintainAspectRatio: false }}
              />
            </div>
           
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;