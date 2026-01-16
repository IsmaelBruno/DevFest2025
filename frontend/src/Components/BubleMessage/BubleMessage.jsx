import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import './BubleMessage.scss';

const BubbleMessage = ({ messages = [], delay = 3000, onClose }) => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const [isVisible, setIsVisible] = useState(true);
    const [showClose, setShowClose] = useState(false);

    // Messages par défaut si aucun n'est fourni
    const defaultMessages = [
        "J'ai détecté un contenu généré par IA !",
        "Vérification en cours...",
        "Analyse terminée : 98% de fiabilité",
        "Ce contenu semble authentique !"
    ];

    const messageList = messages.length > 0 ? messages : defaultMessages;

    // Effet typewriter
    useEffect(() => {
        if (!isVisible) return;

        const currentMessage = messageList[currentMessageIndex];
        let currentIndex = 0;
        setIsTyping(true);

        const typeWriter = setInterval(() => {
            if (currentIndex <= currentMessage.length) {
                setDisplayText(currentMessage.substring(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(typeWriter);
                setIsTyping(false);
                setShowClose(true);
                
                // Passer au message suivant après un délai
                setTimeout(() => {
                    if (currentMessageIndex < messageList.length - 1) {
                        setCurrentMessageIndex(prev => prev + 1);
                        setShowClose(false);
                    } else {
                        // Boucler au début si on a fini tous les messages
                        setTimeout(() => {
                            setCurrentMessageIndex(0);
                            setShowClose(false);
                        }, delay);
                    }
                }, delay);
            }
        }, 50); // Vitesse de frappe

        return () => clearInterval(typeWriter);
    }, [currentMessageIndex, messageList, delay, isVisible]);

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) onClose();
    };

    if (!isVisible) return null;

    return (
        <motion.div
            className="bubble-message"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
           
            {/* Corps du message */}
            <div className="bubble-body">
                <div className="message-content">
                    <span className="message-text">{displayText}</span>
                    {isTyping && <span className="typing-cursor">|</span>}
                </div>
                
                {/* Indicateur de frappe */}
                {isTyping && (
                    <div className="typing-indicator">
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default BubbleMessage;