import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    // Définir un type explicite pour l'URI
    const mongoURI: string | undefined = process.env.MONGO_URI;

    // Ajouter un log pour vérifier l'URI
    console.log("Mongo URI:", mongoURI);

    if (!mongoURI) {
      throw new Error("Mongo URI is not defined in the environment variables");
    }

    // Options de connexion pour mongoose
    const options: ConnectOptions = {};

    // Connexion à MongoDB
    await mongoose.connect(mongoURI, options);
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
