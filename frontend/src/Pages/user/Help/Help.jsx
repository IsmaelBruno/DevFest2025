import { useState } from 'react';
import './Help.scss';

export default function Help() {
    const [isDownloading, setIsDownloading] = useState(false);

    // Liste des PDF à télécharger
    const pdfFiles = [
        { name: 'guide-ia-risques.pdf', url: '/assets/pdf/22_10_19_Controle-des-risques-des-systemes-IA_PDF-1.pdf' },
        { name: 'protection-deepfakes.pdf', url: '/assets/pdf/IA.pdf' },
        { name: 'detection-contenus-ia.pdf', url: '/assets/pdf/L\'intelligence artificielle.pdf' }
    ];

    // Fonction pour télécharger tous les PDF
    const downloadAllPDFs = () => {
        if (isDownloading) return;
        
        setIsDownloading(true);
        
        // Télécharger chaque PDF un par un
        pdfFiles.forEach((pdf, index) => {
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = pdf.url;
                link.download = pdf.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Dernier PDF téléchargé ?
                if (index === pdfFiles.length - 1) {
                    setIsDownloading(false);
                    alert('Tous les PDF ont été téléchargés !');
                }
            }, index * 500); // Délai de 500ms entre chaque téléchargement
        });
    };

    return (
        <div className="help-page">
            <div className="help-hero">
                <div className="help-hero-content">
                    <h1 className="help-title">
                        Vous voulez apprendre sur les risques de l'IA d'aujourd'hui ?
                    </h1>
                    <p className="help-subtitle">
                        Découvrez nos 3 guides complets sur les dangers des intelligences artificielles, 
                        les deepfakes, et comment vous protéger dans l'ère numérique.
                    </p>
                    
                    <button 
                        className="download-btn" 
                        onClick={downloadAllPDFs}
                        disabled={isDownloading}
                    >
                        {isDownloading ? (
                            <>Téléchargement en cours...</>
                        ) : (
                            <>
                                <span className="btn-text">Télécharger les 3 PDF</span>
                                <span className="btn-arrow">→</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}