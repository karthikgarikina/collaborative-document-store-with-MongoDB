import mongoose from "mongoose";
import { env } from "./env";

export const connectDatabase = async (): Promise<void> => {
  await mongoose.connect(env.MONGO_URI, {
    dbName: env.DATABASE_NAME
  });
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
};
