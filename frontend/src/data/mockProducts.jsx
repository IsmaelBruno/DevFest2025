import foudre from "../assets/Images/Jpeg/foudre.jpeg"
import portail from "../assets/Images/Jpeg/portail.jpeg"
import christ from "../assets/Images/Jpeg/christ.jpeg"
import relique from "../assets/Images/Jpeg/relique.jpeg"
import epee from "../assets/Images/Jpeg/epee.jpeg"
import bouclier from "../assets/Images/Jpeg/bouclier.jpeg"


export const mockProducts = [
  {
    id: 1,
    name: "Scan Ultraprécis 8K",
    price: 9999,
    originalPrice: 12999,
    image: `${foudre}`,
    category: "Scans Avancés",
    rating: 5.0,
    reviews: 42,
    description: "Analyse ultra-détaillée avec détection IA de micro-anomalies invisibles à l'œil nu.",
    stock: 6,
    discount: 23
  },
  {
    id: 2,
    name: "Accès Vision Dimensionnelle",
    price: 14999,
    originalPrice: 19999,
    image: `${portail}`,
    category: "Fonctionnalités Premium",
    rating: 4.9,
    reviews: 18,
    description: "Déverrouille un module IA permettant une exploration avancée des couches invisibles d’un scan.",
    stock: 3,
    discount: 25
  },
  {
    id: 3,
    name: "Analyse Spirituelle Pro",
    price: 7999,
    originalPrice: 9999,
    image: `${christ}`,
    category: "Analyses IA",
    rating: 4.8,
    reviews: 56,
    description: "Surcouche IA dédiée à l’analyse énergétique, émotionnelle et symbolique des objets détectés.",
    stock: 10,
    discount: 20
  },
  {
    id: 4,
    name: "Module Transmutation IA",
    price: 24999,
    originalPrice: 29999,
    image: `${relique}`,
    category: "Améliorations IA",
    rating: 4.9,
    reviews: 27,
    description: "Algorithme avancé permettant de transformer un scan brut en modèle IA interprétable.",
    stock: 2,
    discount: 17
  },
  {
    id: 5,
    name: "Pack Vision Laser",
    price: 8999,
    originalPrice: 11999,
    image: `${epee}`,
    category: "Extensions Pro",
    rating: 4.7,
    reviews: 89,
    description: "Permet des scans longue distance ultra-précis avec interprétation IA en temps réel.",
    stock: 5,
    discount: 25
  },
  {
    id: 6,
    name: "Bouclier Anti-Erreur IA",
    price: 7499,
    originalPrice: 8999,
    image: `${bouclier}`,
    category: "Sécurité et Protection",
    rating: 4.8,
    reviews: 64,
    description: "Réduit les faux positifs et protège l’utilisateur avec un filtrage IA intelligent.",
    stock: 7,
    discount: 17
  }
];
