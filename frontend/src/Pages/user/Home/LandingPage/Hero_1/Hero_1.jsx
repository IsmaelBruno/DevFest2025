import { useState } from "react";
import GradientText from "../../../../../Components/GradientText/GradientText";
import { ArrowUpRight, Users, Sparkles, Star } from "lucide-react";
import "./Hero_1.scss";
import heroImg from "../../../../../assets/Images/Jpeg/boy.jpeg";
import heroImg1 from "../../../../../assets/Images/Jpeg/IT.jpeg";

const Hero_1 = () => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleClick = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="Hero_1">
      {/* Éléments décoratifs */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <div className="hero-content-wrapper">
        {/* Zone gauche avec image + bouton */}
        <div className="left-section">
          <div className="hero-image">
            <img src={heroImg1} alt="hero" className="hero-image1" />
            <img src={heroImg} alt="hero" className="hero-image" />

          </div>
          <button
            onClick={handleClick}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            className="plonger-btn primary-btn"
          >
            <span>Plonger</span>
            <ArrowUpRight
              className={`arrow-icon ${isButtonHovered ? "animated" : ""}`}
              size={20}
            />
          </button>
        </div>

        {/* Zone centrale titre */}
        <div className="Hero1-content">
          <h1>
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={5}
              showBorder={false}
              className="hero-main-title"
            >
              Edden for you
            </GradientText>
          </h1>

          <div className="title-decoration">
            <Star className="star star-left" size={20} />
            <Star className="star star-right" size={20} />
          </div>
        </div>

        {/* Paragraphe à droite */}
        <div className="right-paragraph-section">
          <div className="grid-background"></div>
          <div className="paragraph-content">
            <h3>L'Avenir de la Technologie</h3>
            <p>
              Edden incarne la fusion parfaite entre innovation technologique et créativité divine.
              Notre plateforme vous transporte dans un univers où chaque interaction devient une expérience
              mémorable, guidée par les principes de l'excellence et de l'élégance.
            </p>
            <div className="features-list">
              <div className="feature">
                <Sparkles size={16} />
                <span>Interface intuitive</span>
              </div>
              <div className="feature">
                <Star size={16} />
                <span>Design premium</span>
              </div>
              <div className="feature">
                <Users size={16} />
                <span>Communauté active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phrase en bas */}
      <span className="speech">
        "Réveillez en vous la passion technologique et vos talents"
      </span>
    </div>
  );
};

export default Hero_1;
