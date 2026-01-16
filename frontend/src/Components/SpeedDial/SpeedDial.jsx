import React, { useState } from 'react';
import './SpeedDial.scss';
import { LuMusic, LuUser, LuLanguages, LuVolumeOff } from 'react-icons/lu';
import useAudio from '../../assets/Sounds/Sound';
import music from "../../assets/Sounds/m3.mp3"
import grec from "../../assets/Images/grec.png";
import { motion } from "framer-motion";
import ThemeToggle from '../../ui/switchMode/themeToggle';
import { useNavigate } from "react-router-dom";

const SpeedDial = () => {

  const [open, setOpen] = useState(false);
  const [showLangOptions, setShowLangOptions] = useState(false);

  const { isPlaying, play, pause } = useAudio(music);

  const navigate = useNavigate();   // ⬅️ Pour redirection

  const handleLangHover = (visible) => {
    setShowLangOptions(visible);
  };

  return (
    <div className="speed-dial">
      {open && (
        <div className="speed-dial-actions">

          {/* 🔵 BOUTON COMPTE — Redirection vers auth */}
          <motion.button
            whileHover={{ scale: 1.2 }}
            className="action-btn"
            title="Compte"
            onClick={() => navigate("/madascan-app/auth")}
          >
            <LuUser className='icon' />
          </motion.button>

          {/* 🔵 MUSIQUE */}
          <motion.button
            className="action-btn"
            whileHover={{ scale: 1.2 }}
            onClick={isPlaying ? pause : play}
          >
            {isPlaying ? <LuVolumeOff className='icon' /> : <LuMusic className='icon' />}
          </motion.button>

          {/* 🔵 Thème */}
          <ThemeToggle />
        </div>
      )}

      {/* 🔵 BOUTON PRINCIPAL */}
      <button className="speed-dial-btn" onClick={() => setOpen(!open)} title="Menu">
        <img src={grec} width={20} className={open ? 'rotate' : ''} />
      </button>
    </div>
  );
};

export default SpeedDial;
