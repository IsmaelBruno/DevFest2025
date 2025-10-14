import { useRef, useLayoutEffect } from "react";
import { useEffect, useState } from 'react';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import "./Hero_2.scss";
import TrueFocus from "../../../../../Components/TrueFocus/TrueFocus";
import CircularText from "../../../../../Components/CircularText/CircularText";
import Particles from "../../../../../Components/Particles/Particles";
import woman from "../../../../../assets/Images/Jpeg/Woman_techpreview.jpeg";
import { Bolt, Users, Shield, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Animations Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      duration: 1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: "easeOut"
    }
  }
};

const gradientTextVariants = {
  hidden: {
    opacity: 0,
    backgroundPosition: "0% 50%"
  },
  visible: {
    opacity: 1,
    backgroundPosition: "100% 50%",
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

const scaleVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 1,
      ease: "backOut"
    }
  }
};

const Hero_2 = () => {
  const component = useRef(null);
  const slider = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const arrowRef = useRef(null);

  // Refs pour les SVG reveals
  const svgPath1Ref = useRef(null);
  const svgPath2Ref = useRef(null);
  const svgPath3Ref = useRef(null);
  const svgCirclesRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const sections = gsap.utils.toArray(".section");

      // Animation du scroll horizontal principal
      const horizontalScroll = gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: slider.current,
          pin: true,
          scrub: 1,
          snap: 1 / (sections.length - 1),
          end: () => "+=" + slider.current.offsetWidth,
        },
      });

      // SVG Reveal Section 1 - Path drawing animation
      if (svgPath1Ref.current) {
        const path1 = svgPath1Ref.current.querySelectorAll('path, circle, line');
        path1.forEach((element) => {
          const length = element.getTotalLength ? element.getTotalLength() : 0;
          if (length > 0) {
            gsap.set(element, {
              strokeDasharray: length,
              strokeDashoffset: length,
            });
          }
        });

        gsap.to(path1, {
          strokeDashoffset: 0,
          duration: 2,
          ease: "power2.inOut",
          stagger: 0.2,
          scrollTrigger: {
            trigger: ".section-1",
            containerAnimation: horizontalScroll,
            start: "left center",
            end: "center center",
            scrub: 1,
          },
        });
      }

      // SVG Reveal Section 2 - Morphing et scale
      if (svgPath2Ref.current) {
        const paths2 = svgPath2Ref.current.querySelectorAll('path, polygon, rect');

        gsap.fromTo(paths2, {
          scale: 0,
          opacity: 0,
          transformOrigin: "center center",
        }, {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: "elastic.out(1, 0.5)",
          stagger: 0.15,
          scrollTrigger: {
            trigger: ".section-2",
            containerAnimation: horizontalScroll,
            start: "left center",
            end: "center center",
            scrub: 1,
          },
        });
      }

      // SVG Reveal Section 3 - Path drawing avec colors
      if (svgPath3Ref.current) {
        const paths3 = svgPath3Ref.current.querySelectorAll('path, circle');

        paths3.forEach((element) => {
          const length = element.getTotalLength ? element.getTotalLength() : 0;
          if (length > 0) {
            gsap.set(element, {
              strokeDasharray: length,
              strokeDashoffset: length,
            });
          }
        });

        gsap.to(paths3, {
          strokeDashoffset: 0,
          duration: 2.5,
          ease: "power1.inOut",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".section-3",
            containerAnimation: horizontalScroll,
            start: "left center",
            end: "center center",
            scrub: 1,
          },
        });

        // Animation de fill progressif
        gsap.to(paths3, {
          fillOpacity: 1,
          duration: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".section-3",
            containerAnimation: horizontalScroll,
            start: "center center",
            end: "right center",
            scrub: 1,
          },
        });
      }

      // SVG Reveal Section 4 - Circles animation
      if (svgCirclesRef.current) {
        const circles = svgCirclesRef.current.querySelectorAll('circle');

        gsap.fromTo(circles, {
          attr: { r: 0 },
          opacity: 0,
        }, {
          attr: { r: (i, target) => target.getAttribute('data-radius') },
          opacity: 1,
          duration: 1.5,
          ease: "back.out(1.7)",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".section-4",
            containerAnimation: horizontalScroll,
            start: "left center",
            end: "center center",
            scrub: 1,
          },
        });
      }

      // Animation de la flèche (si elle existe)
      if (arrowRef.current) {
        gsap.fromTo(
          arrowRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: arrowRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, component);

    return () => ctx.revert();
  }, []);

  return (
    <div className="Hero_2-container" ref={component}>
      <div className="firstContainer">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <TrueFocus
            sentence="C'est quoi Edden?"
            manualMode={false}
            blurAmount={5}
            borderColor="#047185"
            animationDuration={0.5}
            pauseBetweenAnimations={1}
          />
        </motion.div>

      </div>
     
      <div className="scroll-container" ref={slider}>

        {/* SECTION 1 - Présentation */}
        <div className="section section-1">
          <motion.div
            className="section-content"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h2 variants={itemVariants}>
              <CircularText
                text="EDDEN APPLICATION"
                onHover="speedUp"
                spinDuration={20}
                className="custom-class"
              />
            </motion.h2>

            <motion.p
              className="subtitle"
              variants={itemVariants}
            >
              L'univers d'EDDEN
            </motion.p>

            <motion.p
              className="description"
              variants={itemVariants}
            >
              Une plateforme qui <span className="highlight-text">illumine</span> vos journées grâce à la technologie moderne et à une expérience utilisateur exceptionnelle.
              <br />
              Découvrez un univers où chaque interaction est pensée pour vous <span className="highlight-text">simplifier la vie</span>, vous informer et vous accompagner au quotidien.

            </motion.p>
          </motion.div>

          {/* SVG Decorative elements */}
          <svg
            ref={svgPath1Ref}
            className="svg-decoration svg-section1"
            viewBox="0 0 800 600"
          >
            <path d="M 50 300 Q 200 100, 400 300 T 750 300"
              stroke="#047185"
              strokeWidth="3"
              fill="none" />
            <circle cx="100" cy="150" r="30"
              stroke="#ffa500"
              strokeWidth="2"
              fill="none" />
            <circle cx="700" cy="450" r="40"
              stroke="#25d2f1"
              strokeWidth="2"
              fill="none" />
          </svg>
        </div>

        {/* SECTION 2 - Vision */}
        <div className="section section-2" ref={sectionRef}>
          <motion.div
            className="text-section2"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <motion.h2
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="primary-text"
            >
            <span className="accent-vision">  Notre</span> vision<span className="accent-vision"> du futur</span>
            </motion.h2>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
            >
              Une technologie <strong>centrée sur l'humain</strong>, tournée vers demain.
              Elle facilitera la prise de décisions
              pour les professionnels et les autorités en
              fournissant des <strong>données précises et exploitables</strong>.
            </motion.span>
          </motion.div>

          <motion.img
            src={woman}
            alt="Woman Pictures"
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, rotate: 3 }}
            className="pulse"
          />

          <svg
            ref={svgPath2Ref}
            className="svg-decoration svg-section2"
            viewBox="0 0 800 600"
          >
            <polygon points="100,100 150,50 200,100 150,150"
              fill="#047185"
              opacity="0.5" />
            <rect x="600" y="400" width="80" height="80"
              fill="#ffa500"
              opacity="0.5" />
          </svg>
        </div>

        <div className="section section-3">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            Pourquoi Edden est différent ?
          </motion.h2>

          <motion.div
            className="professional-cards-container"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {/* Première carte */}
            <motion.div
              className="professional-card blue-card"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="card-icon">
                <Bolt size={32} color="var(--whiteColor)" />
              </div>
              <h3>Innovation Technologique</h3>
              <p>
                Notre plateforme utilise les dernières avancées en intelligence artificielle
                et traitement de données pour offrir une expérience unique et performante
                à nos utilisateurs.
              </p>
              <div className="card-features">
                <span className="feature-tag">
                  <Zap size={14} />
                  IA Avancée
                </span>
                <span className="feature-tag">
                  <Shield size={14} />
                  Sécurité
                </span>
              </div>
            </motion.div>

            {/* Deuxième carte */}
            <motion.div
              className="professional-card blue-card"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="card-icon">
                <Users size={32} color="var(--whiteColor)" />
              </div>
              <h3>Approche Centrée Utilisateur</h3>
              <p>
                Chaque fonctionnalité est conçue en pensant à l'expérience utilisateur finale.
                Interface intuitive, navigation fluide et support réactif pour une adoption rapide.
              </p>
              <div className="card-features">
                <span className="feature-tag">
                  <Users size={14} />
                  UX Optimisée
                </span>
                <span className="feature-tag">
                  <Shield size={14} />
                  Support 24/7
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* SVG Complex illustration */}
          <svg
            ref={svgPath3Ref}
            className="svg-decoration svg-section3"
            viewBox="0 0 800 600"
          >
            <path d="M 100 300 C 100 200, 200 200, 200 300 S 300 400, 300 300"
              stroke="#047185"
              strokeWidth="4"
              fill="none" />
            <circle cx="400" cy="300" r="80"
              stroke="#ffa500"
              strokeWidth="3"
              fill="none" />
          </svg>
        </div>

        {/* SECTION 4 - Aventure */}
        <div className="section section-4">
           <motion.h2
    initial={{ opacity: 0, scale: 0.5 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1.2, ease: "easeOut" }}
    viewport={{ once: true }}
  >
    Rejoignez l'aventure
  </motion.h2>

  <motion.p
    className="section4-subtitle"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, delay: 0.3 }}
    viewport={{ once: true }}
  >
    Explorez un univers où la technologie et la créativité s’unissent pour façonner le futur.
  </motion.p>

  <motion.div
    className="cta-container"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, delay: 0.6 }}
    viewport={{ once: true }}
  >
    <button className="cta-button">Commencer maintenant 🚀</button>
  </motion.div>

  <motion.div
    style={{ width: '100%', height: '600px', position: 'relative' }}
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 1.5, delay: 0.5 }}
    viewport={{ once: true }}
  >
    <Particles
      particleColors={['#047185', '#ffa500', '#25d2f1']}
      particleCount={200}
      particleSpread={10}
      speed={0.1}
      particleBaseSize={100}
      moveParticlesOnHover={true}
      alphaParticles={false}
      disableRotation={false}
    />

    <svg
      ref={svgCirclesRef}
      className="svg-decoration svg-section4"
      viewBox="0 0 800 600"
    >
      <circle cx="400" cy="300" r="0" data-radius="250" stroke="#047185" strokeWidth="2" fill="none" />
      <circle cx="400" cy="300" r="0" data-radius="200" stroke="#ffa500" strokeWidth="2" fill="none" />
      <circle cx="400" cy="300" r="0" data-radius="150" stroke="#25d2f1" strokeWidth="2" fill="none" />
    </svg>
  </motion.div>
        </div>
      </div>

      <div className="lastContainer">
        <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1.2, ease: "easeOut" }}
    viewport={{ once: true }}
    className="final-section"
  >
    <h2>Fin du voyage 🌌</h2>
    <p className="final-subtitle">Merci d’avoir exploré l’univers <strong>Edden</strong>.</p>
    <div className="badge-group">
      <span className="badge-primary">Innovation</span>
      <span className="badge-warning">Technologie</span>
      <span className="badge-accent">Créativité</span>
    </div>
  </motion.div>
      </div>
    </div>
  );
};

export default Hero_2;