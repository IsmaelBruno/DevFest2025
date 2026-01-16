import { Request, Response } from "express";
import * as authService from "../services/userServices";

// Inscription
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, first_name, last_name, role } = req.body;
    const user = await authService.registerUser(email, password, first_name, last_name, role);
    res.status(200).json({ message: "Utilisateur créé. Vérifiez votre e-mail.", user });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Une erreur inconnue est survenue." });
    }
  }
};

// Connexion
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.status(200).json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Une erreur inconnue est survenue." });
    }
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { otp } = req.body;
    const message = await authService.verifyEmail(otp as string);
    res.status(200).json({ message });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Une erreur inconnue est survenue." });
    }
  }
};

// Récupère les utilisateurs en attente d'approbation
export const getPendingUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await authService.getPendingUsers();
    res.status(200).json(users);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Une erreur inconnue est survenue." });
    }
  }
};

// Approuver un utilisateur
export const approveUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;
    const user = await authService.approveUser(userId);
    
    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return; // Ensure return after sending response in this path
    }
    
    res.status(200).json({ 
      message: "Utilisateur approuvé avec succès", 
      user 
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Une erreur inconnue est survenue." });
    }
  }
};

// Récupère les utilisateurs par rôle
export const getUserByRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await authService.getUsersByRole(req.params.role);
    res.status(200).json(users);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Une erreur inconnue est survenue." });
    }
  }
};

// Enregistrer plusieurs utilisateurs
export const registerMultipleUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    await authService.saveAll(req.body);
    res.status(201).json({ message: "Utilisateurs enregistrés avec succès." });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Une erreur inconnue est survenue." });
    }
  }
};

// Récupère tous les utilisateurs (avec pagination et recherche)
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string || "";

    const result = await authService.getAllUsers(page, limit, search);
    res.status(200).json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Une erreur inconnue est survenue." });
    }
  }
};

// Récupère un utilisateur par ID
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await authService.getUserById(id);
    
    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }
    
    res.status(200).json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Une erreur inconnue est survenue." });
    }
  }
};

// Met à jour un utilisateur
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const user = await authService.updateUser(id, updateData);
    
    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }
    
    res.status(200).json({ 
      message: "Utilisateur mis à jour avec succès", 
      user 
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Une erreur inconnue est survenue." });
    }
  }
};

// Supprime un utilisateur
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await authService.deleteUser(id);
    
    if (!success) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }
    
    res.status(200).json({ 
      message: "Utilisateur supprimé avec succès" 
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Une erreur inconnue est survenue." });
    }
  }
};

// Récupère les statistiques des utilisateurs
export const getUserStatistics = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await authService.getUserStats();
    res.status(200).json(stats);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Une erreur inconnue est survenue." });
    }
  }
};