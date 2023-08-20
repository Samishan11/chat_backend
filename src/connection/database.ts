import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DB_URI = "mongodb://0.0.0.0:27017/mern-chat";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(DB_URI).then(() => {
      console.log("Database connected");
    });
  } catch (error: any) {
    console.log(error.message);
  }
};
