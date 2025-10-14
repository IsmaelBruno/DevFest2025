import React from "react";
import "./NavBar.scss";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LuHouse, LuCamera, LuSettings, LuActivity, LuShoppingCart, LuMenu, LuX } from "react-icons/lu";
import grec from "../../../../assets/Images/grec.png";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  // ✅ Correction du scroll
  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { path: "", label: "Accueil", icon: LuHouse },
    { path: "live", label: "Live", icon: LuCamera },
    { path: "solution", label: "Solution", icon: LuSettings },
    { path: "prediction", label: "Prédire", icon: LuActivity },
    { path: "shop-edden", label: "Espace achat", icon: LuShoppingCart },
  ];

  const menuItemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1, duration: 0.4, ease: "easeOut" },
    }),
  };

  return (
    <nav className={`nav-container ${isScrolled ? "scrolled" : ""}`}>
      {/* Logos apparaissent seulement après scroll */}
      {isScrolled && (
        <>
          <motion.img src={grec} alt="logo" className="grec-logo left" />
          <motion.img src={grec} alt="logo" className="grec-logo right" />
        </>
      )}

      {/* Bouton hamburger (mobile) */}
      <button
        className="menu-toggle"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <LuX /> : <LuMenu />}
      </button>

      <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.li
              key={index}
              custom={index}
              variants={menuItemVariants}
              initial="hidden"
              animate="visible"
            >
              <NavLink
                to={`/edden-app/${item.path}`}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                end
                onClick={() => setIsMenuOpen(false)}
              >
                {Icon && <Icon className="nav-icon" />}
                {item.label}
              </NavLink>
            </motion.li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavBar;
