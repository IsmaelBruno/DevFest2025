  import React from "react";
  import "./NavBar.scss";
  import { NavLink } from "react-router-dom";
  import { motion } from "framer-motion";

  import { 
    LuHouse,
    LuCamera,
    LuActivity,
    LuClock,
    LuCircleHelp,
    LuSettings,
    LuCrown,
    LuMenu,
    LuX
  } from "react-icons/lu";
  import { useTranslation } from "react-i18next"; 

  import logo from "../../../../assets/Images/grec.png";

  const NavBar = () => {
    const { t, i18n } = useTranslation(); 
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);

    React.useEffect(() => {
      const handleScroll = () => setIsScrolled(window.scrollY > 50);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // 🔥 Nouveaux items adaptés à MadaScan
    const menuItems = [
      { path: "", label: "Accueil", icon: LuHouse },
      { path: "analyse", label: "Analyser", icon: LuActivity },
      { path: "historique", label: "Les arnaques", icon: LuClock },
      { path: "help", label: "Aide", icon: LuCircleHelp },
      { path: "communaute", label: "Communauté", icon: LuSettings },
      { path: "premium", label: "Premium", icon: LuCrown },
    ];

    const menuItemVariants = {
      hidden: { opacity: 0, y: 15 },
      visible: (index) => ({
        opacity: 1,
        y: 0,
        transition: { delay: index * 0.1, duration: 0.45, ease: "easeOut" },
      }),
    };

    return (
      <nav className={`nav-container ${isScrolled ? "scrolled" : ""}`}>
        
        {isScrolled && (
          <>
            <motion.img src={logo} alt="logo" className="grec-logo left" />
            <motion.img src={logo} alt="logo" className="grec-logo right" />
          </>
        )}

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
                  to={`/madascan-app/${item.path}`}
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  end
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="nav-icon" />
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
