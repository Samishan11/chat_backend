import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DB_URI: string | undefined = process.env.DB_URI;
console.log(DB_URI);
export const connectDB = async (): Promise<void> => {
  try {
    if (!DB_URI) return;
    await mongoose.connect(DB_URI).then(() => {
      console.log("Database connected");
    });
  } catch (error: any) {
    console.log(error.message);
  }
};
