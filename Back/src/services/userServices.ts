import User from "../models/userModel";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/mailer";
import crypto from "crypto";
import { generateToken } from "../utils/jwt";
import { IUser } from "../types/userTypes";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:2025/";

/**
 * INSCRIPTION
 * Logique modifiée : Les admins sont activés directement.
 */
export const registerUser = async (email: string, password: string, first_name: string, last_name: string, role: string) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Cet email est déjà utilisé.");

  const hashedPassword = await bcrypt.hash(password, 10);
  const emailToken = crypto.randomInt(100000, 999999).toString();

  // Détermine si l'utilisateur doit être actif dès l'inscription
  const isAdmin = role === 'admin';

  const user = await User.create({
    email,
    password_hash: hashedPassword,
    first_name,
    last_name,
    role: role,
    is_active: isAdmin,      // L'admin est actif immédiatement
    otpVerification: isAdmin, // L'admin n'a pas besoin de vérification
    otp: isAdmin ? "" : emailToken, // Pas d'OTP pour l'admin
  });

  // N'envoie un e-mail de vérification que si ce n'est pas un admin
  if (!isAdmin) {
    await sendEmail(email, `Vérification de votre compte : ${emailToken}`,
      `Votre code de vérification est : ${emailToken}. Utilisez-le dans l'application pour valider votre e-mail.`
    );
  }

  return user;
};

/**
 * CONNEXION
 * Logique modifiée pour des messages d'erreur clairs.
 */
export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email ou mot de passe incorrect.");

  // 1. L'utilisateur a-t-il vérifié son e-mail ?
  if (!user.otpVerification) {
    throw new Error("Veuillez vérifier votre e-mail avant de vous connecter.");
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new Error("Email ou mot de passe incorrect.");

  const token = generateToken(user.id);
  return { token, user };
};

/**
 * VÉRIFICATION D'EMAIL (OTP)
 * Logique entièrement corrigée : ne crée plus de `PurchaseRequest`.
 * Notifie l'administrateur qu'un nouveau compte attend son approbation.
 */
export const verifyEmail = async (token: string): Promise<string> => {
  const user = await User.findOne({ otp: token });

  if (!user) throw new Error("Code OTP invalide ou expiré.");

  // Mise à jour de l'utilisateur
  user.otpVerification = true; // L'OTP est vérifié
  user.is_active = false;      // Le compte reste inactif
  user.otp = "";               // L'OTP est effacé
  await user.save();

  // Notifier les administrateurs via Socket.IO


  return "Votre e-mail a été vérifié. Votre compte est maintenant en attente d'approbation par un administrateur.";
};

/**
 * Récupère tous les utilisateurs en attente d'approbation.
 */
export const getPendingUsers = async (): Promise<IUser[]> => {
  return User.find({ is_active: false, otpVerification: true }).select("-password_hash");
};

/**
 * Approuve un utilisateur.
 */
export const approveUser = async (userId: string): Promise<IUser | null> => {
  const user = await User.findByIdAndUpdate(
    userId,
    { is_active: true },
    { new: true }
  );
  
  if (user) {
    // Envoyer un email de notification à l'utilisateur
    await sendEmail(
      user.email,
      "Votre compte a été approuvé",
      `Bonjour ${user.first_name},\n\nVotre compte a été approuvé par l'administrateur. Vous pouvez maintenant vous connecter à l'application.\n\nCordialement,\nL'équipe Access-Bills`
    );
  }

  return user;
};
/**
 * Rejette et supprime un utilisateur.
 */
export const rejectUser = async (userId: string): Promise<IUser | null> => {
  const user = await User.findByIdAndDelete(userId);
  return user;
};

/**
 * Récupère les utilisateurs par rôle (fonction existante conservée).
 */
export const getUsersByRole = async (role : string) => {
  try {
    const users = await User.find({role }).select("-password_hash");
    return users;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des utilisateurs");
  }
};

/**
 * Fonction générique pour sauvegarder plusieurs utilisateurs (fonction existante conservée).
 */
export const saveAll = async (users: any): Promise<void> => {
  try {
    if (!Array.isArray(users)) {
      throw new Error("L'argument 'users' doit être un tableau.");
    }
    
    const usersToSave = await Promise.all(
      users.map(async (user: any) => {
        if (!user.password_hash) {
          throw new Error('Chaque utilisateur doit avoir un mot de passe.');
        }
        const hashedPassword = await bcrypt.hash(user.password_hash, 10);
        return {
          ...user,
          password_hash: hashedPassword,
          otp: "",
          created_at: new Date().toISOString().split("T")[0].replace(/-/g, "/"),
          updated_at: new Date().toISOString().split("T")[0].replace(/-/g, "/"),
        };
      })
    );
    
    await User.insertMany(usersToSave);

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Erreur:', error.message);
      throw new Error(error.message);
    } else {
      console.error('Erreur inconnue');
      throw new Error('Une erreur inconnue est survenue.');
    }
  }
};
// Ajoutez cette fonction dans votre service

/**
 * Récupère tous les utilisateurs (avec pagination optionnelle)
 */
export const getAllUsers = async (
  page: number = 1,
  limit: number = 20,
  search: string = ""
): Promise<{
  users: IUser[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  try {
    // Construire la requête de recherche
    const query: any = {};
    
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { first_name: { $regex: search, $options: 'i' } },
        { last_name: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculer le skip pour la pagination
    const skip = (page - 1) * limit;

    // Récupérer les utilisateurs avec pagination
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password_hash') // Exclure le mot de passe
        .sort({ created_at: -1 }) // Trier par date de création (plus récent en premier)
        .skip(skip)
        .limit(limit),
      User.countDocuments(query)
    ]);

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    throw new Error('Erreur lors de la récupération des utilisateurs');
  }
};

/**
 * Récupère un utilisateur par son ID
 */
export const getUserById = async (userId: string): Promise<IUser | null> => {
  try {
    const user = await User.findById(userId).select('-password_hash');
    return user;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    throw new Error('Utilisateur non trouvé');
  }
};

/**
 * Met à jour un utilisateur
 */
export const updateUser = async (
  userId: string,
  updateData: Partial<IUser>
): Promise<IUser | null> => {
  try {
    // Exclure les champs sensibles de la mise à jour
    const { password_hash, email, ...safeUpdateData } = updateData;

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        ...safeUpdateData,
        updated_at: new Date().toISOString().split("T")[0].replace(/-/g, "/")
      },
      { new: true, runValidators: true }
    ).select('-password_hash');

    return user;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    throw new Error('Erreur lors de la mise à jour de l\'utilisateur');
  }
};

/**
 * Supprime un utilisateur
 */
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    const result = await User.findByIdAndDelete(userId);
    return result !== null;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    throw new Error('Erreur lors de la suppression de l\'utilisateur');
  }
};

/**
 * Statistiques des utilisateurs
 */
export const getUserStats = async (): Promise<{
  total: number;
  active: number;
  pending: number;
  byRole: Record<string, number>;
}> => {
  try {
    const [
      total,
      active,
      pending,
      allUsers
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ is_active: true }),
      User.countDocuments({ is_active: false, otpVerification: true }),
      User.find({}, 'role')
    ]);

    // Compter les utilisateurs par rôle
    const byRole: Record<string, number> = {};
    allUsers.forEach(user => {
      const role = user.role || 'user';
      byRole[role] = (byRole[role] || 0) + 1;
    });

    return {
      total,
      active,
      pending,
      byRole
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    throw new Error('Erreur lors de la récupération des statistiques');
  }
};