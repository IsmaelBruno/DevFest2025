// Updated Hero_2 component for MadScan with sections 1-3 only

import { useRef, useLayoutEffect } from "react";
import { useEffect, useState } from 'react';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import "./Hero_2.scss";
import TrueFocus from "../../../../../Components/TrueFocus/TrueFocus";
import CircularText from "../../../../../Components/CircularText/CircularText";
import woman from "../../../../../assets/Images/Jpeg/Woman_techpreview.jpeg";
import { Bolt, Users, Shield, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, duration: 1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: "easeOut" }
  }
};

const Hero_2 = () => {
  const component = useRef(null);
  const slider = useRef(null);
  const sectionRef = useRef(null);

  const svgPath1Ref = useRef(null);
  const svgPath2Ref = useRef(null);
  const svgPath3Ref = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const sections = gsap.utils.toArray(".section").slice(0, 3);

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

      // SVG Section 1
      if (svgPath1Ref.current) {
        const paths = svgPath1Ref.current.querySelectorAll('path, circle');
        paths.forEach((el) => {
          const length = el.getTotalLength ? el.getTotalLength() : 0;
          if (length) gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
        });

        gsap.to(paths, {
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

      // SVG Section 2
      if (svgPath2Ref.current) {
        const paths2 = svgPath2Ref.current.querySelectorAll('polygon, rect');
        gsap.fromTo(paths2,
          { scale: 0, opacity: 0, transformOrigin: "center center" },
          {
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
          }
        );
      }

      // SVG Section 3
      if (svgPath3Ref.current) {
        const paths3 = svgPath3Ref.current.querySelectorAll('path, circle');
        paths3.forEach((el) => {
          const length = el.getTotalLength ? el.getTotalLength() : 0;
          if (length) gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
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
            sentence="C'est quoi MADASCAN ?"
            manualMode={false}
            blurAmount={5}
            borderColor="#047185"
            animationDuration={0.5}
            pauseBetweenAnimations={1}
          />
        </motion.div>
      </div>

      <div className="scroll-container" ref={slider}>

        {/* SECTION 1 */}
        <div className="section section-1">
          <motion.div className="section-content" variants={containerVariants} initial="hidden" whileInView="visible">
            <motion.h2 variants={itemVariants}>
              <CircularText text="MADASCAN SYSTEM" spinDuration={20} />
            </motion.h2>
            <motion.p className="subtitle" variants={itemVariants}>Analyse & Authenticité</motion.p>
            <motion.p className="description" variants={itemVariants}>
              MadaScan vous aide à distinguer le vrai du faux grâce à des analyses avancées d’images, vidéos et contenus générés par IA.
            </motion.p>
          </motion.div>

          <svg ref={svgPath1Ref} className="svg-decoration svg-section1" viewBox="0 0 800 600">
            <path d="M 50 300 Q 200 100, 400 300 T 750 300" stroke="#047185" strokeWidth="3" fill="none" />
            <circle cx="100" cy="150" r="30" stroke="#ffa500" strokeWidth="2" fill="none" />
            <circle cx="700" cy="450" r="40" stroke="#25d2f1" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* SECTION 2 */}
        <div className="section section-2" ref={sectionRef}>
          <motion.div className="text-section2" initial={{ opacity: 0, x: -100 }} whileInView={{ opacity: 1, x: 0 }}>
            <motion.h2 className="primary-text">Notre vision pour un 🇲🇬 mieux informé</motion.h2>
            <motion.span>
              MadaScan lutte contre la désinformation numérique à Madagascar en analysant automatiquement les contenus suspects.
            </motion.span>
          </motion.div>

          <motion.img
            src={woman}
            alt="Analyse IA"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="pulse"
          />

          <svg ref={svgPath2Ref} className="svg-decoration svg-section2" viewBox="0 0 800 600">
            <polygon points="100,100 150,50 200,100 150,150" fill="#047185" opacity="0.5" />
            <rect x="600" y="400" width="80" height="80" fill="#ffa500" opacity="0.5" />
          </svg>
        </div>

        {/* SECTION 3 */}
        <div className="section section-3">
          <motion.h2>Pourquoi MadaScan est unique ?</motion.h2>

          <motion.div className="professional-cards-container">
            <motion.div className="professional-card blue-card" whileHover={{ scale: 1.05, y: -5 }}>
              <div className="card-icon"><Bolt size={32} /></div>
              <h3>Détection IA de haute précision</h3>
              <p>MadaScan identifie les vidéos truquées, images modifiées et contenus générés par IA.</p>
              <div className="card-features">
                <span className="feature-tag"><Zap size={14} /> Analyse IA</span>
                <span className="feature-tag"><Shield size={14} /> Protection</span>
              </div>
            </motion.div>

            <motion.div className="professional-card blue-card" whileHover={{ scale: 1.05, y: -5 }}>
              <div className="card-icon"><Users size={32} /></div>
              <h3>Simplicité pour tous</h3>
              <p>Interface intuitive pensée pour les utilisateurs malgaches, même débutants en technologie.</p>
              <div className="card-features">
                <span className="feature-tag"><Users size={14} /> UX Simple</span>
              </div>
            </motion.div>
          </motion.div>

          <svg ref={svgPath3Ref} className="svg-decoration svg-section3" viewBox="0 0 800 600">
            <path d="M 100 300 C 100 200, 200 200, 200 300 S 300 400, 300 300" stroke="#047185" strokeWidth="4" fill="none" />
            <circle cx="400" cy="300" r="80" stroke="#ffa500" strokeWidth="3" fill="none" />
          </svg>
        </div>

      </div>
    </div>
  );
};

export default Hero_2;
