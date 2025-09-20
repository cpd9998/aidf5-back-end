import mongoose from "mongoose";

const connectDB = async () => {
  try {
    let MONGODB_URL = process.env.MONGODB_URI || "";
    console.log("MongoDB URI:", MONGODB_URL);
    if (!MONGODB_URL) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    await mongoose.connect(MONGODB_URL);
    console.log("MongoDB connected");
  } catch (error) {
    if (error instanceof Error) {
      console.error("MongoDB connection error:", error.message);
    }

    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
