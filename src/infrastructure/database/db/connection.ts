import mongoose from "mongoose";
import { logger } from "@/shared/utils/logger";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/curie-interview-mvp";

// Database connection function
export async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      logger.database("MongoDB already connected");
      return;
    }

    // Connection options for better compatibility
    const options = {
      // Remove deprecated options warnings
      bufferCommands: false,
      // Connection timeout
      serverSelectionTimeoutMS: 5000,
      // Socket timeout
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(MONGODB_URI, options);
    logger.database("MongoDB connected successfully");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    throw error;
  }
}

// Disconnect function
export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    logger.database("MongoDB disconnected");
  } catch (error) {
    logger.error("MongoDB disconnection error:", error);
  }
}
