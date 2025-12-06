import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

// Icônes plus adaptées au scan / boutique
import {
  Search,
  ShoppingCart,
  Star,
  CreditCard,
  Shield,
  FileText,
  Database,
  UserCheck,
  Package,
} from 'lucide-react';

import SparklesText from '../../../Components/SparkleText/SparkleText';
import { mockProducts } from '../../../data/mockProducts';
import './Shop.scss';

// 👉 Catégories réalistes pour MadaScan
const categories = [
  "Tous",
  "Pack Scans",
  "Analyses Avancées",
  "Crédits de Vérification",
  "Abonnements",
  "Premium"
];

function Shop() {
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [sortBy, setSortBy] = useState("default");
  const navigate = useNavigate();

  // Filtrage, recherche et tri
  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== "Tous") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'price-asc':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, sortBy, products]);

  // Redirige vers détails produit
  const handleProductClick = (product) => {
    // ⚠ Vérifie que ta route correspond bien à /madascan/... ou similaire
    navigate(`/madascan-app/premium/product/${product.id}`);
  };

  return (
    <div className="shop-container">
      {/* Header + recherche */}
      <div className="shop-header">
        <div className="header-content">
          <motion.h1
            className="shop-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <SparklesText className="custom-texte">
              MadaScan Store
            </SparklesText>
          </motion.h1>
          <p className="shop-subtitle">Découvrez nos offres d’analyse IA</p>

          <div className="search-section">
            <div className="search-bar">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filters">
              <div className="category-filter">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grille des produits */}
      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card" onClick={() => handleProductClick(product)}>
            <div className="product-image-container">
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="product-overlay">
                <ShoppingCart className="cart-icon" />
                <span>Acheter maintenant</span>
              </div>
            </div>

            <div className="product-info">
              <div className="product-category">
                {/* Icônes conditionnelles selon nouvelle catégorie */}
                {product.category === "Pack Scans" && <CreditCard size={16} className="category-icon" />}
                {product.category === "Analyses Avancées" && <FileText size={16} className="category-icon" />}
                {product.category === "Crédits de Vérification" && <Shield size={16} className="category-icon" />}
                {product.category === "Abonnements" && <Package size={16} className="category-icon" />}
                {product.category === "Premium" && <UserCheck size={16} className="category-icon" />}
                <span>{product.category}</span>
              </div>

              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>

              <div className="product-pricing">
                <div className="current-price">{product.price} Ar</div>
                {product.originalPrice && (
                  <div className="original-price">{product.originalPrice} Ar</div>
                )}
              </div>

              <div className="product-stock">
                <span className={`stock-indicator ${product.stock < 10 ? 'low' : ''}`}>
                  {product.stock} en stock
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-products">
          <h3>Aucun produit trouvé</h3>
          <p>Essayez de modifier vos critères de recherche</p>
        </div>
      )}
    </div>
  );
}

export default Shop;
