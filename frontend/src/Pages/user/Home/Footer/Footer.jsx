import "./Footer.scss";
import {
  FaFacebook,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowRight
} from "react-icons/fa";
import Marquee from "react-fast-marquee";
import img1 from "../../../../assets/Images/Sponsors/1.jpg";
import img2 from "../../../../assets/Images/Sponsors/2.jpg";
import img3 from "../../../../assets/Images/Sponsors/3.jpg";
import img4 from "../../../../assets/Images/Sponsors/4.jpg";
import img5 from "../../../../assets/Images/Sponsors/5.jpg";
import img6 from "../../../../assets/Images/Sponsors/6.jpg";
import img7 from "../../../../assets/Images/Sponsors/7.jpg";
import img8 from "../../../../assets/Images/Sponsors/8.jpg";
import img9 from "../../../../assets/Images/Sponsors/9.jpg";
import img10 from "../../../../assets/Images/Sponsors/10.jpg";
import img11 from "../../../../assets/Images/Sponsors/11.jpg";
import img12 from "../../../../assets/Images/Sponsors/12.jpg";

const Footer = () => {
  const partnerImages = [img1, img2, img3, img4, img5, ,img6,img7,img8,img9,img10,img11,img12];

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Signaler un cas", url: "/signaler-cas" },
    { name: "Assistant IA", url: "/quiz" },
    { name: "Carte infographique", url: "/cartographie" },
    { name: "À propos", url: "/a-propos" }
  ];

  const socialLinks = [
    { icon: <FaFacebook />, url: "#", label: "Facebook" },
    { icon: <FaGithub />, url: "#", label: "GitHub" },
    { icon: <FaLinkedin />, url: "#", label: "LinkedIn" },
    { icon: <FaTwitter />, url: "#", label: "Twitter" }
  ];

  return (
    <footer className="footer-container">
      {/* Top Wave Divider */}
      <div className="custom-shape-divider-top">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="shape-fill"
          ></path>
        </svg>
      </div>

      <div className="footer-wrapper">
        {/* Section Principale */}
        <div className="footer-main">
          {/* Section Partenaires */}
          <div className="partners-section">
            <div className="partners-wrapper container">
              <h3 className="partners-title">Nos Partenaires durant cet évenement</h3>
              <div className="partners-marquee">
                <Marquee pauseOnHover={true} speed={40} gradient={false}>
                  {partnerImages.map((img, index) => (
                    <div key={index} className="partner-item">
                      <img
                        src={img}
                        alt={`Partenaire ${index + 1}`}
                        className="partner-logo"
                      />
                    </div>
                  ))}
                </Marquee>
              </div>
            </div>
          </div>
          <div className="footer-grid container">
            {/* Colonne 1 - À propos */}
            <div className="footer-column">
              <div className="footer-logo">
                <h2 className="logo-text">
                  <span className="logo-gradient">MadaScan</span>
                </h2>
                <p className="logo-tagline">Innovation & Excellence</p>
              </div>
              <p className="footer-description">
                Plateforme innovante dédiée à la transformation digitale et à l'excellence technologique.
                Ensemble, construisons l'avenir.
              </p>
              <div className="social-links">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="social-link"
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Colonne 2 - Liens rapides (MadaScan) */}
<div className="footer-column">
  <h3 className="column-title">Liens Rapides</h3>

  <ul className="footer-links">

    <li>
      <a href="/madascan-app/">
        <FaArrowRight className="link-icon" />
        <span>Accueil</span>
      </a>
    </li>

    <li>
      <a href="/madascan-app/scanner">
        <FaArrowRight className="link-icon" />
        <span>Scanner</span>
      </a>
    </li>

    <li>
      <a href="/madascan-app/analyse">
        <FaArrowRight className="link-icon" />
        <span>Analyse IA</span>
      </a>
    </li>

    <li>
      <a href="/madascan-app/historique">
        <FaArrowRight className="link-icon" />
        <span>Historique</span>
      </a>
    </li>

    <li>
      <a href="/madascan-app/help">
        <FaArrowRight className="link-icon" />
        <span>Aide</span>
      </a>
    </li>

    <li>
      <a href="/madascan-app/communaute">
        <FaArrowRight className="link-icon" />
        <span>Communauté</span>
      </a>
    </li>

    <li>
      <a href="/madascan-app/premium">
        <FaArrowRight className="link-icon" />
        <span>Premium</span>
      </a>
    </li>

  </ul>
</div>


            {/* Colonne 3 - Contact */}
            <div className="footer-column">
              <h3 className="column-title">Contact</h3>
              <ul className="contact-info">
                <li>
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>Antananarivo, Madagascar</span>
                </li>
                <li>
                  <FaPhoneAlt className="contact-icon" />
                  <span>+261 34 00 000 00</span>
                </li>
                <li>
                  <FaEnvelope className="contact-icon" />
                  <span>contact@madascan.mg</span>
                </li>
              </ul>
            </div>

            {/* Colonne 4 - Newsletter */}
            <div className="footer-column">
              <h3 className="column-title">Newsletter</h3>
              <p className="newsletter-text">
                Restez informé de nos dernières actualités et innovations.
              </p>
            </div>
          </div>
        </div>


        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content container">
            <p className="copyright">
              © {currentYear} <strong>MadaScan</strong>. Tous droits réservés.
            </p>
            <div className="footer-bottom-links">
              <a href="/confidentialite">Confidentialité</a>
              <span className="separator">•</span>
              <a href="/conditions">Conditions d'utilisation</a>
              <span className="separator">•</span>
              <a href="/cookies">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;