import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// const DB_URI: string | undefined = process.env.DB_URI;
export const connectDB = async (): Promise<void> => {
  try {
    // if (!DB_URI) return;
    await mongoose
      .connect(
        "mongodb://samishanthapa0:DWLdT2CwG4C1W6GC@ac-szquqjh-shard-00-00.1svmqyx.mongodb.net:27017,ac-szquqjh-shard-00-01.1svmqyx.mongodb.net:27017,ac-szquqjh-shard-00-02.1svmqyx.mongodb.net:27017/?ssl=true&replicaSet=atlas-75pmd2-shard-0&authSource=admin&retryWrites=true&w=majority"
      )
      .then(() => {
        console.log("Database connected");
      });
  } catch (error: any) {
    console.log(error.message);
  }
};
