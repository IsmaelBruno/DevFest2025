// multerConfig.ts
import multer from 'multer';
import path from 'path';

// Configuration du stockage pour Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Dossier où les fichiers seront stockés
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    cb(null, Date.now() + fileExtension);  // Nom unique pour chaque fichier
  },
});

// Vérifier si le fichier est bien une image
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);  // Le fichier est valide
  } else {
    cb(new Error('Seules les images JPG, JPEG et PNG sont autorisées'), false);
  }
};

// Configuration de Multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de taille du fichier (ici 5 MB)
  },
});

export { upload };
