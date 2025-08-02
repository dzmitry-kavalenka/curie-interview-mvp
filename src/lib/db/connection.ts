import mongoose from "mongoose";

// MongoDB connection string - you'll need to set this in your environment variables
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/curie-interview-mvp";

// Database connection function
export async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB already connected");
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
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

// Disconnect function
export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("MongoDB disconnection error:", error);
  }
}
