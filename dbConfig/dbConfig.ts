import mongoose from "mongoose";

let isConnected = false; // Prevent multiple connections

export async function connect() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("❌ MONGO_URI is not set in environment variables");
    }

    if (isConnected) {
      console.log("⚡ MongoDB already connected");
      return;
    }

    await mongoose.connect(uri, {
      dbName: 'mydb', // Only keep this
    });

    const connection = mongoose.connection;

    connection.on("connected", () => {
      isConnected = true;
      console.log("✅ MongoDB connected successfully");
    });

    connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
      process.exit(1);
    });

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
}

