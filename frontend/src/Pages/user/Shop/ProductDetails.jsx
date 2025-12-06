import { useParams } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { mockProducts } from '../../../data/mockProducts';
import { FileText, Shield, Package, UserCheck , Star , Truck , MapPin} from 'lucide-react';
import CheckoutForm from './CheckoutForm';
import "./ProductDetails.scss";

// Configuration Stripe
const stripePromise = loadStripe('votre_clé_publique_stripe');

function ProductDetails() {
  const { id } = useParams();
  const product = mockProducts.find(p => p.id === parseInt(id));

  if (!product) {
    return <div>Produit non trouvé</div>;
  }

  return (
    <div className="product-details-container">
      <div className="product-display">
        {/* Colonne de gauche - Image du produit */}
        <div className="product-image-column">
          <img 
            src={product.image} 
            alt={product.name} 
            className="main-product-image"
          />
          <div className="product-meta">
            <div className="product-category">
  {product.category === "Pack Scans" && <CreditCard size={16} />}
  {product.category === "Analyses Avancées" && <FileText size={16} />}
  {product.category === "Crédits de Vérification" && <Shield size={16} />}
  {product.category === "Abonnements" && <Package size={16} />}
  {product.category === "Premium" && <UserCheck size={16} />}
  <span>{product.category}</span>
</div>
            
            <div className="product-rating">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`star ${i < Math.floor(product.rating) ? 'filled' : ''}`}
                />
              ))}
              <span>({product.reviews} avis)</span>
            </div>
            
            <div className="product-stock">
              Stock: <span className={product.stock < 10 ? 'low' : ''}>{product.stock}</span>
            </div>
          </div>
        </div>

        {/* Colonne de droite - Détails et paiement */}
        <div className="product-info-column">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-description">{product.description}</p>
          
          <div className="product-pricing">
            <span className="current-price">{product.price}Ar</span>
            {product.originalPrice && (
              <span className="original-price">{product.originalPrice}Ar</span>
            )}
          </div>

          {/* Intégration Stripe */}
          <div className="payment-section">
            <Elements stripe={stripePromise}>
              <CheckoutForm product={product} />
            </Elements>
            
            <div className="guarantees">
              <div className="guarantee">
                <Shield size={20} />
                <span>Paiement 100% sécurisé</span>
              </div>
              <div className="guarantee">
                <Truck size={20} />
                <span>Livraison express</span>
              </div>
              <div className="guarantee">
                <MapPin size={20} />
                <span>Suivi en temps réel</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;