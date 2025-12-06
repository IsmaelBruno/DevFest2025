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

      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <div className="hero-content-wrapper">

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
            <span>Explorer</span>
            <ArrowUpRight
              className={`arrow-icon ${isButtonHovered ? "animated" : ""}`}
              size={20}
            />
          </button>
        </div>

        <div className="Hero1-content">
          <h1>
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={5}
              showBorder={false}
              className="hero-main-title"
            >
              MadaScan
            </GradientText>
          </h1>

          <div className="title-decoration">
            <Star className="star star-left" size={20} />
            <Star className="star star-right" size={20} />
          </div>
        </div>

        <div className="right-paragraph-section">
          <div className="grid-background"></div>

          <div className="paragraph-content">
            <h3>Le Scan Intelligent Made in Madagascar</h3>
            <p>
              MadaScan révolutionne la manière d'extraire, d'analyser et de 
              comprendre vos documents. Grâce à l’IA, scannez plus vite, plus 
              proprement, et gagnez un temps précieux dans vos tâches quotidiennes.
            </p>

            <div className="features-list">
              <div className="feature">
                <Sparkles size={16} />
                <span>Scan intelligent instantané</span>
              </div>
              <div className="feature">
                <Star size={16} />
                <span>Résultats ultra-précis</span>
              </div>
              <div className="feature">
                <Users size={16} />
                <span>Conçu pour les utilisateurs malgaches</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      <span className="speech">
        "MadaScan — La technologie au service de Madagascar"
      </span>
    </div>
  );
};

export default Hero_1;
