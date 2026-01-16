import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoose_uri = process.env.MONGODB_URI!;

  try {
    if (!mongoose_uri) throw new Error();
    await mongoose.connect(mongoose_uri, {
      dbName: "hooc-ai-db",
    });
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.log("MongoDB connection error", error);
    process.exit(1);
  }
};
